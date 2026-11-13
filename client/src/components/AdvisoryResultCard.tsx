import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles, 
  Printer, 
  Copy, 
  Check, 
  Leaf, 
  FlaskConical, 
  Calendar, 
  TrendingDown, 
  ListChecks, 
  FileDown,
  Info,
  Layers,
  MapPin,
  Clock
} from 'lucide-react';
import { Advisory } from '../types';
import { useApp } from '../context/AppContext';

export const AdvisoryResultCard: React.FC<{ advisory: Advisory }> = ({ advisory }) => {
  const { t, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'organic' | 'chemical' | 'prevention' | 'fertilizer'>('organic');
  const [completedTasks, setCompletedTasks] = useState<Record<number, boolean>>({});
  const [copied, setCopied] = useState<boolean>(false);

  const toggleTask = (index: number) => {
    setCompletedTasks((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    const text = `
AGRIASSIST AI ADVISORY REPORT
----------------------------------------------
Diagnosis: ${advisory.diagnosis_title}
Crop: ${advisory.crop_name}
Category: ${advisory.issue_category}
Confidence Score: ${advisory.confidence_score}%
Severity: ${advisory.severity_level}
Yield Impact: ${advisory.estimated_yield_impact}

ORGANIC PROTOCOL:
${advisory.organic_remedies.map((r, i) => `${i + 1}. ${r.treatmentName} - ${r.dosageOrRate} (${r.applicationMethod})`).join('\n')}

CONVENTIONAL CHEMICAL PROTOCOL:
${advisory.chemical_treatments.map((c, i) => `${i + 1}. ${c.tradeNameExample} (${c.activeIngredient}) - ${c.applicationRate}. Precautions: ${c.safetyPrecautions}`).join('\n')}

FERTILIZER NUTRITION SCHEDULE:
Focus: ${advisory.fertilizer_recommendation.primaryNutrientFocus}
NPK: ${advisory.fertilizer_recommendation.recommendedNPK}
Timing: ${advisory.fertilizer_recommendation.applicationTiming}
----------------------------------------------
Consultation Date: ${new Date(advisory.created_at).toLocaleDateString()}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Advisory summary copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  // Severity color mapping
  const severityColors = {
    Low: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    Moderate: 'bg-amber-100 text-amber-800 border-amber-300',
    High: 'bg-orange-100 text-orange-800 border-orange-300',
    Critical: 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse',
  };

  const badgeClass = severityColors[advisory.severity_level as keyof typeof severityColors] || severityColors.Moderate;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden print:border-none print:shadow-none">
      {/* Top Advisory Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 p-6 sm:p-8 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {advisory.issue_category}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${badgeClass}`}>
                {advisory.severity_level} Severity
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {new Date(advisory.created_at).toLocaleString()}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              {advisory.diagnosis_title}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-200/90 font-medium mt-1 flex items-center gap-2">
              <span>Target: <strong>{advisory.crop_name}</strong></span>
              {advisory.farm_name && (
                <>
                  <span>•</span>
                  <span>Farm: <strong>{advisory.farm_name}</strong> ({advisory.location_region || 'Custom'})</span>
                </>
              )}
            </p>
          </div>

          {/* Action buttons (hidden on print) */}
          <div className="flex items-center gap-2 no-print self-start sm:self-auto">
            <button
              onClick={handleCopy}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/20"
              title="Copy Summary"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>{t.printReport}</span>
            </button>
          </div>
        </div>

        {/* Diagnosis Confidence Score Meter */}
        <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="relative w-14 h-14 flex items-center justify-center rounded-full bg-emerald-950/60 border-2 border-emerald-400 text-emerald-300 font-black text-base shadow-inner">
              {advisory.confidence_score}%
            </div>
            <div>
              <div className="text-xs font-bold text-white">{t.confidence}</div>
              <div className="text-[11px] text-slate-400">Gemini 2.5 Flash Validation</div>
            </div>
          </div>

          <div className="sm:col-span-2 flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
            <TrendingDown className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <div>
              <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                {t.estimatedYieldImpact}
              </div>
              <div className="text-xs text-slate-200 mt-0.5">
                {advisory.estimated_yield_impact}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 sm:p-8 space-y-8">
        {/* Uploaded Leaf Image (if present) & Farmer Notes */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {advisory.image_url && (
            <div className="md:col-span-4 rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 flex items-center justify-center max-h-64 shadow-md">
              <img
                src={advisory.image_url}
                alt="Diagnosed plant specimen"
                className="w-full h-full object-cover max-h-64"
              />
            </div>
          )}

          <div className={`${advisory.image_url ? 'md:col-span-8' : 'md:col-span-12'} space-y-3`}>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1">
                <Info className="w-4 h-4 text-emerald-600" />
                Reported Field Symptoms & Environmental Context
              </div>
              <p className="text-xs text-slate-600 leading-relaxed italic">
                "{advisory.symptom_description}"
              </p>
              <div className="mt-3 pt-3 border-t border-slate-200/80 flex flex-wrap gap-4 text-[11px] text-slate-500 font-medium">
                {advisory.soil_type && (
                  <span>Soil: <strong>{advisory.soil_type}</strong> (pH {advisory.soil_ph})</span>
                )}
                {advisory.irrigation_type && (
                  <span>Irrigation: <strong>{advisory.irrigation_type}</strong></span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-200 flex flex-wrap gap-2 no-print">
          {[
            { id: 'organic', label: t.organicRemedies, icon: Leaf },
            { id: 'chemical', label: t.chemicalTreatments, icon: FlaskConical },
            { id: 'prevention', label: t.preventativeMeasures, icon: ListChecks },
            { id: 'fertilizer', label: t.fertilizerPlan, icon: Calendar },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 font-bold text-xs sm:text-sm transition-all ${
                  isActive
                    ? 'border-emerald-600 text-emerald-800 bg-emerald-50/50'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB 1: Organic & Biological Controls */}
        {(activeTab === 'organic' || window.matchMedia?.('print')?.matches) && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <Leaf className="w-4 h-4 text-emerald-600" />
                Biological & Organic Therapeutic Protocols
              </h3>
              <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Eco-Friendly & Non-Toxic to Pollinators
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {advisory.organic_remedies.map((remedy, idx) => (
                <div
                  key={idx}
                  className="p-5 bg-gradient-to-br from-emerald-50/80 to-teal-50/40 rounded-2xl border border-emerald-200/80 shadow-sm space-y-2"
                >
                  <div className="font-bold text-emerald-950 text-sm">
                    {remedy.treatmentName}
                  </div>
                  <div className="text-xs text-slate-600">
                    <strong className="text-slate-700">Application:</strong> {remedy.applicationMethod}
                  </div>
                  <div className="text-xs text-slate-600">
                    <strong className="text-slate-700">Dosage:</strong> {remedy.dosageOrRate}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: Conventional Chemical Treatments */}
        {(activeTab === 'chemical' || window.matchMedia?.('print')?.matches) && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-blue-600" />
                Conventional Synthetic & Targeted Chemical Control
              </h3>
              <span className="text-xs text-amber-700 font-semibold bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                Strict Safety Warnings & Pre-Harvest Intervals
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {advisory.chemical_treatments.map((chem, idx) => (
                <div
                  key={idx}
                  className="p-5 bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-2xl border border-slate-200 shadow-sm space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-bold text-slate-900 text-sm">
                      {chem.tradeNameExample}
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                      Active: {chem.activeIngredient}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600">
                    <strong className="text-slate-700">Application Rate:</strong> {chem.applicationRate}
                  </div>

                  <div className="p-3 bg-rose-50/80 rounded-xl border border-rose-200 text-xs text-rose-900 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>Precautions & PHI:</strong> {chem.safetyPrecautions}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Preventative Measures Checklist */}
        {(activeTab === 'prevention' || window.matchMedia?.('print')?.matches) && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <ListChecks className="w-4 h-4 text-emerald-600" />
                Preventative Field Hygiene & Cultural Action Items
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                Click to mark field operations completed
              </span>
            </div>

            <div className="space-y-2.5">
              {advisory.preventative_measures.map((measure, idx) => {
                const isDone = Boolean(completedTasks[idx]);
                return (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => toggleTask(idx)}
                    className={`w-full p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                      isDone
                        ? 'bg-emerald-50/60 border-emerald-300 text-slate-500 line-through'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                      isDone ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300'
                    }`}>
                      {isDone && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <span className="text-xs font-medium leading-relaxed">
                      {measure}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: Fertilizer & Soil Nutrition Plan */}
        {(activeTab === 'fertilizer' || window.matchMedia?.('print')?.matches) && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-600" />
              Nutritional Supplementation & Fertilizer Schedule
            </h3>

            <div className="p-6 bg-gradient-to-br from-teal-50 via-emerald-50 to-slate-50 rounded-2xl border border-teal-200/80 space-y-4">
              <div>
                <span className="text-[11px] font-bold uppercase text-teal-800 tracking-wider">
                  Primary Nutrient Focus
                </span>
                <p className="text-sm font-extrabold text-slate-800 mt-0.5">
                  {advisory.fertilizer_recommendation.primaryNutrientFocus}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-teal-200/60 text-xs">
                <div>
                  <span className="text-slate-500 font-semibold">Recommended N-P-K Ratio:</span>
                  <div className="font-extrabold text-emerald-800 text-base mt-0.5">
                    {advisory.fertilizer_recommendation.recommendedNPK}
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 font-semibold">Application Timing & Delivery:</span>
                  <div className="font-bold text-slate-800 mt-0.5">
                    {advisory.fertilizer_recommendation.applicationTiming}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
