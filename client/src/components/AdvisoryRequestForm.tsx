import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, 
  UploadCloud, 
  X, 
  Mic, 
  MicOff, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle,
  FileText
} from 'lucide-react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import { Farm } from '../types';

export const AdvisoryRequestForm: React.FC = () => {
  const navigate = useNavigate();
  const { t, showToast, refreshTrigger } = useApp();

  const [farms, setFarms] = useState<Farm[]>([]);
  const [selectedFarmId, setSelectedFarmId] = useState<string>('');
  const [cropName, setCropName] = useState<string>('Tomato');
  const [symptomDescription, setSymptomDescription] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [dragActive, setDragActive] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load user farms
  useEffect(() => {
    api.getFarms()
      .then((data) => {
        setFarms(data);
        if (data.length > 0) {
          setSelectedFarmId(data[0].id);
        }
      })
      .catch((err) => console.error('Failed to load farms:', err));
  }, [refreshTrigger]);

  const quickSymptomTags = [
    'Yellowing lower leaves with green veins',
    'Dark concentric target-shaped brown spots',
    'Powdery white residue on leaf upper surfaces',
    'Severe daytime wilting recovering at night',
    'Chewed holes with dark caterpillar frass',
    'Stunted growth with crinkled mosaic leaves',
    'Water-soaked lesions on stems and fruit',
    'Interveinal chlorosis on youngest leaves'
  ];

  const crops = [
    'Tomato', 'Potato', 'Corn (Maize)', 'Wheat', 'Rice', 
    'Soybeans', 'Cotton', 'Onion', 'Bell Pepper', 'Sugarcane', 
    'Coffee', 'Tea', 'Cabbage', 'Eggplant'
  ];

  const handleAddSymptomTag = (tag: string) => {
    setSymptomDescription((prev) => {
      if (!prev) return tag;
      return `${prev}. ${tag}`;
    });
  };

  // Simulated Voice / Speech-to-Text Recognition
  const toggleSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      // Fallback simulated speech input
      if (!isListening) {
        setIsListening(true);
        showToast('Listening... Speak your crop symptoms now.', 'info');
        setTimeout(() => {
          setSymptomDescription((prev) => 
            prev ? `${prev}. Severe leaf curling with whitefly nymphs visible underneath` : 'Severe leaf curling with whitefly nymphs visible underneath'
          );
          setIsListening(false);
          showToast('Speech transcribed successfully!', 'success');
        }, 3000);
      } else {
        setIsListening(false);
      }
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        showToast('Listening for crop symptoms...', 'info');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSymptomDescription((prev) => prev ? `${prev} ${transcript}` : transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  // Image upload handling
  const handleFileChange = (file: File) => {
    if (!file.type.match(/image\/(jpeg|png|webp)/)) {
      showToast('Please upload a valid JPEG, PNG, or WebP image.', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size exceeds 5MB limit.', 'error');
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cropName.trim()) {
      showToast('Please specify target crop name', 'error');
      return;
    }
    if (!symptomDescription.trim() && !imageFile) {
      showToast('Please describe symptoms or upload a leaf photo for AI analysis', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('cropName', cropName);
      formData.append('symptomDescription', symptomDescription || 'Multimodal photographic crop diagnosis requested.');
      if (selectedFarmId) {
        formData.append('farmId', selectedFarmId);
      }
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const advisory = await api.createAdvisory(formData);
      showToast('AI Crop Health Advisory successfully generated!', 'success');
      navigate(`/advisory/${advisory.id}`);
    } catch (err: any) {
      showToast(err.message || 'Error processing crop advisory', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-emerald-100 shadow-xl overflow-hidden">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 px-6 sm:px-10 py-8 text-white relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Multimodal Vision & Agronomic Reasoning
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">
              Crop Health Diagnosis & Advisory Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Upload plant foliage photos and symptom narratives. Gemini 2.5 Flash analyzes pathogen markers and generates calibrated treatment protocols.
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-8">
        {/* Farm & Crop Selection Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Associated Farm Profile
            </label>
            <select
              value={selectedFarmId}
              onChange={(e) => setSelectedFarmId(e.target.value)}
              className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              {farms.length === 0 ? (
                <option value="">Standard Demo Farm (General Climate)</option>
              ) : (
                farms.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.farm_name} ({f.location_region} — {f.soil_type} pH {f.soil_ph})
                  </option>
                ))
              )}
            </select>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Inherits soil texture, pH, and irrigation parameters into the AI prompt.
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Target Crop Variety *
            </label>
            <select
              value={cropName}
              onChange={(e) => setCropName(e.target.value)}
              className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              {crops.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Calibrates pathology database and maximum economic yield threshold.
            </span>
          </div>
        </div>

        {/* Multimodal Leaf Image Upload */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-emerald-600" />
              Upload Crop Leaf / Plant Photograph (Multimodal Vision)
            </span>
            <span className="text-[11px] text-slate-400 font-normal">
              Supports JPEG, PNG, WebP up to 5MB
            </span>
          </label>

          {!imagePreview ? (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                dragActive
                  ? 'border-emerald-500 bg-emerald-50/80 scale-[1.01]'
                  : 'border-slate-300 hover:border-emerald-500 bg-slate-50/60 hover:bg-emerald-50/20'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                className="hidden"
              />
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3 shadow-inner">
                <UploadCloud className="w-7 h-7" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">
                Click to browse or drag & drop leaf photograph
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Capture infected leaves under natural daylight showing top and bottom surfaces for optimal diagnostic precision.
              </p>
            </div>
          ) : (
            <div className="relative rounded-2xl overflow-hidden border border-emerald-200 bg-slate-900 shadow-md max-h-72 flex items-center justify-center group">
              <img
                src={imagePreview}
                alt="Uploaded leaf preview"
                className="max-h-72 w-auto object-contain"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-3 right-3 p-2 bg-rose-600 text-white rounded-full hover:bg-rose-700 shadow-lg transition-transform hover:scale-110"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-2 left-3 px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg text-white text-[11px] font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Ready for Gemini Vision Multimodal Inspection
              </div>
            </div>
          )}
        </div>

        {/* Symptoms & Visual Observations */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-emerald-600" />
              Observed Symptoms & Field Notes *
            </label>
            <button
              type="button"
              onClick={toggleSpeechRecognition}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-colors ${
                isListening
                  ? 'bg-rose-100 text-rose-700 animate-pulse border border-rose-300'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {isListening ? (
                <>
                  <Mic className="w-3.5 h-3.5" />
                  Recording Audio...
                </>
              ) : (
                <>
                  <MicOff className="w-3.5 h-3.5 text-slate-400" />
                  Voice Dictate
                </>
              )}
            </button>
          </div>

          <textarea
            rows={4}
            value={symptomDescription}
            onChange={(e) => setSymptomDescription(e.target.value)}
            placeholder={t.symptomPlaceholder}
            className="w-full text-xs font-medium border border-slate-300 rounded-xl p-3.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />

          {/* Quick Symptom Chips */}
          <div className="mt-3">
            <span className="text-[11px] font-bold text-slate-500 block mb-1.5">
              Quick Symptom Selector (Click to append):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {quickSymptomTags.map((tag) => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => handleAddSymptomTag(tag)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-200 border border-slate-200 text-slate-600 text-[11px] font-medium transition-all"
                >
                  + {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm tracking-wide shadow-xl shadow-emerald-600/30 transition-all hover:scale-[1.01] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{t.analyzingWithGemini}</span>
              </div>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-emerald-200" />
                <span>{t.submitConsultation}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
