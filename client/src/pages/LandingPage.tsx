import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sprout, 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  CloudSun, 
  Camera, 
  CheckCircle2, 
  ArrowRight, 
  Cpu, 
  Database,
  Leaf,
  Globe2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LandingPage: React.FC = () => {
  const { t } = useApp();

  return (
    <div className="space-y-20 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/70 via-white to-transparent -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300 text-emerald-900 text-xs font-bold shadow-sm">
              <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
              <span>Next-Gen Agricultural Intelligence Engine</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Gemini 2.5 Flash</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Empowering Global Farmers with <span className="bg-gradient-to-r from-emerald-700 via-teal-600 to-emerald-800 bg-clip-text text-transparent">Instant AI Crop Diagnostics</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto">
              Bridge the agronomic divide. Upload crop leaf photographs, receive scientifically validated plant pathology diagnosis, organic remediation schedules, and dynamic yield projections in seconds.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/advisory/new"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/30 transition-all hover:scale-105"
              >
                <Camera className="w-5 h-5" />
                <span>{t.ctaNewAdvisory}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-sm border border-slate-300 shadow-sm transition-all hover:border-emerald-500"
              >
                <span>{t.navDashboard}</span>
              </Link>
            </div>

            {/* Quick Proof Badges */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs font-bold text-slate-600">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Multimodal Leaf Vision Analysis
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Dual Organic & Chemical Protocols
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Row-Level PostgreSQL Isolation
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CORE CAPABILITIES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Enterprise Agricultural Architecture
          </span>
          <h2 className="text-3xl font-black text-slate-900 mt-1">
            End-to-End Agronomic Decision Support
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Engineered for agricultural extension agents, commercial growers, and smallholder farmers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Multimodal Vision Pathology
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Google Gemini 2.5 Flash analyzes microscopic symptom signatures across fungal lesions, bacterial blights, viral mottling, and nutrient chlorosis.
            </p>
            <ul className="text-xs text-slate-500 space-y-1.5 pt-2">
              <li className="flex items-center gap-2">✓ Sub-second visual inference</li>
              <li className="flex items-center gap-2">✓ Confidence scoring 0-100%</li>
              <li className="flex items-center gap-2">✓ Severity category classification</li>
            </ul>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center">
              <Leaf className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Balanced Treatment Engine
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Provides both biological organic controls and targeted chemical treatments with active ingredients, application rates, and pre-harvest intervals.
            </p>
            <ul className="text-xs text-slate-500 space-y-1.5 pt-2">
              <li className="flex items-center gap-2">✓ Bio-fungicide & beneficials guidance</li>
              <li className="flex items-center gap-2">✓ FRAC mode-of-action rotation</li>
              <li className="flex items-center gap-2">✓ Detailed safety & REI protocols</li>
            </ul>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Dynamic Yield & Spray Advisor
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Forecasts harvest tonnage impacts according to soil pH, irrigation infrastructure, and 7-day micro-climate weather forecasts.
            </p>
            <ul className="text-xs text-slate-500 space-y-1.5 pt-2">
              <li className="flex items-center gap-2">✓ 7-day disease risk index</li>
              <li className="flex items-center gap-2">✓ Real-time spray window warnings</li>
              <li className="flex items-center gap-2">✓ Treatment recovery yield model</li>
            </ul>
          </div>
        </div>
      </section>

      {/* SAMPLE ADVISORY SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                <Sprout className="w-4 h-4" />
                Live Diagnostic Sample
              </div>
              <h2 className="text-3xl font-black text-white">
                Early Blight Detected on Tomato
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Case Study: Salinas Valley Field Plot with concentric necrotic lesions. AgriAssist AI isolated <em>Alternaria solani</em> with 94% confidence, recommending Bacillus subtilis bio-fungicide and split-application potassium nutrition to protect ~35% harvest yield.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <span className="px-3 py-1 rounded-lg bg-white/10 text-xs font-semibold">
                  Crop: Tomato (Solanum lycopersicum)
                </span>
                <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
                  Severity: Moderate
                </span>
                <span className="px-3 py-1 rounded-lg bg-white/10 text-xs font-semibold">
                  Action: Bio-Foliar Drench
                </span>
              </div>
              <div className="pt-4">
                <Link
                  to="/advisory/new"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  Run Your Own Diagnosis
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/80 space-y-4 backdrop-blur-md">
                <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                  <span className="font-bold text-xs text-emerald-400">Diagnostic Summary</span>
                  <span className="text-xs font-mono bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">
                    Confidence: 94%
                  </span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="text-slate-300">
                    <strong className="text-white">Organic Remedy:</strong> Bio-Fungicide Bacillus subtilis (Serenade ASO) @ 3 qt/100 gal.
                  </div>
                  <div className="text-slate-300">
                    <strong className="text-white">Chemical Backup:</strong> Azoxystrobin + Difenoconazole (Quadris Top) @ 10 fl oz/ac.
                  </div>
                  <div className="text-slate-300">
                    <strong className="text-white">Fertilizer Adjustment:</strong> Foliar potassium & silica to reinforce epidermal cell walls.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
