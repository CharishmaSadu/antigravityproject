import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Layers, 
  Droplets, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft, 
  Sprout, 
  ShieldCheck, 
  Sparkles,
  Info
} from 'lucide-react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import { SoilType, IrrigationType } from '../types';

export const FarmSetupWizard: React.FC = () => {
  const navigate = useNavigate();
  const { t, showToast, triggerRefresh } = useApp();

  const [step, setStep] = useState<number>(1);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Form State
  const [farmName, setFarmName] = useState<string>('');
  const [locationRegion, setLocationRegion] = useState<string>('');
  const [soilType, setSoilType] = useState<SoilType>('Loam');
  const [soilPh, setSoilPh] = useState<number>(6.5);
  const [totalAreaAcres, setTotalAreaAcres] = useState<number>(25);
  const [irrigationType, setIrrigationType] = useState<IrrigationType>('Drip');
  const [selectedCrops, setSelectedCrops] = useState<string[]>(['Tomato', 'Corn']);
  const [farmingMethod, setFarmingMethod] = useState<'organic' | 'conventional'>('organic');

  const soilOptions: { type: SoilType; description: string }[] = [
    { type: 'Loam', description: 'Balanced silt, sand & clay. Optimal nutrient & moisture retention.' },
    { type: 'Clay', description: 'Heavy, nutrient-rich with high water holding capacity.' },
    { type: 'Sandy', description: 'Light, fast-draining, requires frequent fertigation.' },
    { type: 'Silt', description: 'Fertile, smooth texture with high capillary action.' },
    { type: 'Peaty', description: 'High organic matter, acidic, excellent moisture storage.' },
    { type: 'Chalky', description: 'Alkaline, stony, prone to iron & manganese lockup.' },
    { type: 'Salty', description: 'High salinity; necessitates salt-tolerant crop genetics.' },
  ];

  const irrigationOptions: { type: IrrigationType; desc: string }[] = [
    { type: 'Drip', desc: 'Precision water and fertilizer delivery at root zone (90%+ efficiency)' },
    { type: 'Sprinkler', desc: 'Overhead spray coverage for undulating topography' },
    { type: 'Rainfed', desc: 'Precipitation dependent; high vulnerability to seasonal dry spells' },
    { type: 'Canal', desc: 'Surface gravitational conveyance from community irrigation schemes' },
    { type: 'Flood', desc: 'Traditional basin inundation for heavy water demand crops' },
  ];

  const cropSuggestions = [
    'Tomato', 'Potato', 'Corn', 'Wheat', 'Rice', 
    'Soybeans', 'Cotton', 'Sugarcane', 'Onion', 'Coffee', 'Tea', 'Bell Pepper'
  ];

  const toggleCrop = (crop: string) => {
    if (selectedCrops.includes(crop)) {
      if (selectedCrops.length > 1) {
        setSelectedCrops(selectedCrops.filter((c) => c !== crop));
      }
    } else {
      setSelectedCrops([...selectedCrops, crop]);
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (!farmName.trim() || !locationRegion.trim()) {
        showToast('Please provide both farm name and geographic region', 'error');
        return;
      }
    }
    if (step === 2) {
      if (soilPh < 3.5 || soilPh > 10.0) {
        showToast('Soil pH must be between 3.5 and 10.0', 'error');
        return;
      }
      if (totalAreaAcres <= 0) {
        showToast('Area must be greater than zero acres', 'error');
        return;
      }
    }
    if (step === 3) {
      if (selectedCrops.length === 0) {
        showToast('Please select at least one primary crop', 'error');
        return;
      }
    }
    setStep((prev) => Math.min(4, prev + 1));
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      await api.createFarm({
        farm_name: farmName,
        location_region: locationRegion,
        soil_type: soilType,
        soil_ph: soilPh,
        total_area_acres: totalAreaAcres,
        irrigation_type: irrigationType,
        primary_crops: selectedCrops
      });

      showToast('Farm profile registered successfully with PostgreSQL tenant isolation!', 'success');
      triggerRefresh();
      navigate('/dashboard');
    } catch (err: any) {
      showToast(err.message || 'Failed to save farm profile', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-emerald-100 shadow-xl overflow-hidden">
      {/* Top Banner & Stepper Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-700 px-6 sm:px-8 py-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
              Interactive Farm Profile Wizard
            </span>
            <h2 className="text-2xl font-black mt-1">Register Agricultural Estate</h2>
            <p className="text-xs text-emerald-100 mt-1">
              Provides localized baseline environmental soil & climate parameters for AI diagnostic models
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-emerald-300">
            <Sprout className="w-7 h-7" />
          </div>
        </div>

        {/* Stepper Dots */}
        <div className="grid grid-cols-4 gap-2 mt-6">
          {[
            { num: 1, label: 'Identity' },
            { num: 2, label: 'Soil & pH' },
            { num: 3, label: 'Irrigation & Crops' },
            { num: 4, label: 'Review' },
          ].map((s) => (
            <div key={s.num} className="text-center">
              <div
                className={`h-1.5 rounded-full transition-all ${
                  step >= s.num ? 'bg-emerald-300' : 'bg-emerald-950/40'
                }`}
              />
              <span className="text-[10px] font-bold text-emerald-200 mt-1 block">
                {s.num}. {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Wizard Body */}
      <div className="p-6 sm:p-8">
        {/* STEP 1: Farm Identity & Location */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-600" />
                Step 1: Farm Location & Regional Climate
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Set geographic identifiers to enable localized weather tracking and seasonal pathogen monitoring.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Farm or Estate Name *
              </label>
              <input
                type="text"
                value={farmName}
                onChange={(e) => setFarmName(e.target.value)}
                placeholder="e.g., Sunridge Organic Ranch / Field Plot 4"
                className="w-full text-sm font-medium border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Location / Agricultural Region *
              </label>
              <input
                type="text"
                value={locationRegion}
                onChange={(e) => setLocationRegion(e.target.value)}
                placeholder="e.g., Salinas Valley, California or Punjab Agricultural Belt"
                className="w-full text-sm font-medium border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Used to correlate local precipitation, temperature records, and endemic pest threats.
              </p>
            </div>

            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-start gap-3">
              <Info className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-emerald-900 leading-relaxed">
                <strong>Agronomic Multi-Tenant Security:</strong> All farm records and consultation archives are isolated by user account adhering to strict Row-Level Security principles.
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Soil Profile & pH */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-600" />
                Step 2: Soil Characteristics & Edaphic Profile
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Soil texture and acidity dictate nutrient bioavailability and fungal spore propagation.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Dominant Soil Texture
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {soilOptions.map((opt) => (
                  <button
                    type="button"
                    key={opt.type}
                    onClick={() => setSoilType(opt.type)}
                    className={`p-3 text-left rounded-xl border transition-all ${
                      soilType === opt.type
                        ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/20 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="font-bold text-xs text-slate-800 flex items-center justify-between">
                      {opt.type}
                      {soilType === opt.type && (
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                      {opt.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Soil pH Scale</label>
                  <span className="text-sm font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    {soilPh} pH
                  </span>
                </div>
                <input
                  type="range"
                  min="3.5"
                  max="10.0"
                  step="0.1"
                  value={soilPh}
                  onChange={(e) => setSoilPh(parseFloat(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 mt-3"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
                  <span>3.5 Acidic</span>
                  <span>6.5 Neutral</span>
                  <span>10.0 Alkaline</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Total Cultivated Area (Acres)
                </label>
                <input
                  type="number"
                  min="0.1"
                  step="0.5"
                  value={totalAreaAcres}
                  onChange={(e) => setTotalAreaAcres(parseFloat(e.target.value) || 0)}
                  className="w-full text-base font-bold border border-slate-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Used to estimate dosage and aggregate harvest tonnage projections.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Irrigation & Crops */}
        {step === 3 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Droplets className="w-5 h-5 text-emerald-600" />
                Step 3: Irrigation Infrastructure & Target Crops
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Irrigation mechanics strongly influence canopy humidity and bacterial splash-spread.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Irrigation System
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {irrigationOptions.map((irr) => (
                  <button
                    type="button"
                    key={irr.type}
                    onClick={() => setIrrigationType(irr.type)}
                    className={`p-3 text-left rounded-xl border transition-all ${
                      irrigationType === irr.type
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center justify-between">
                      {irr.type}
                      {irrigationType === irr.type && (
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                      )}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{irr.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700">
                  Primary Crops Cultivated (Select all that apply)
                </label>
                <span className="text-[11px] text-emerald-700 font-semibold">
                  {selectedCrops.length} selected
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {cropSuggestions.map((crop) => {
                  const isSelected = selectedCrops.includes(crop);
                  return (
                    <button
                      type="button"
                      key={crop}
                      onClick={() => toggleCrop(crop)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-sm scale-105'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {crop}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Primary Farming Methodology
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFarmingMethod('organic')}
                  className={`p-3 rounded-xl border text-center font-bold text-xs transition-all ${
                    farmingMethod === 'organic'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 text-slate-700'
                  }`}
                >
                  🌱 Certified Organic / Regenerative
                </button>
                <button
                  type="button"
                  onClick={() => setFarmingMethod('conventional')}
                  className={`p-3 rounded-xl border text-center font-bold text-xs transition-all ${
                    farmingMethod === 'conventional'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 text-slate-700'
                  }`}
                >
                  🚜 Conventional Integrated Pest Management (IPM)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Review and Submit */}
        {step === 4 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                Step 4: Verify Farm Environmental Specification
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Confirm your farm details before initializing the intelligent advisory link.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-200">
                <span className="text-slate-500">Farm / Plot Name</span>
                <span className="font-bold text-slate-800">{farmName}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-200">
                <span className="text-slate-500">Region</span>
                <span className="font-bold text-slate-800">{locationRegion}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-200">
                <span className="text-slate-500">Soil Type & pH</span>
                <span className="font-bold text-emerald-800">{soilType} (pH: {soilPh})</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-200">
                <span className="text-slate-500">Total Cultivated Acres</span>
                <span className="font-bold text-slate-800">{totalAreaAcres} Acres</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-200">
                <span className="text-slate-500">Irrigation Method</span>
                <span className="font-bold text-slate-800">{irrigationType}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-200">
                <span className="text-slate-500">Methodology</span>
                <span className="font-bold uppercase text-emerald-700">{farmingMethod}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Primary Crops</span>
                <div className="flex flex-wrap gap-1 justify-end max-w-xs">
                  {selectedCrops.map((c) => (
                    <span key={c} className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold text-[10px]">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((p) => p - 1)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20"
            >
              Next Step
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-extrabold shadow-lg shadow-emerald-600/30 disabled:opacity-50"
            >
              {submitting ? (
                <>Saving Farm Profile...</>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Save Farm Profile
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
