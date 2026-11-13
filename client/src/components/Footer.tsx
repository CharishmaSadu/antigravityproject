import React from 'react';
import { Sprout, ShieldAlert, Heart, Cpu, Database } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { t } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-20 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg text-white tracking-tight">
                AgriAssist <span className="text-emerald-400">AI</span>
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Next-generation multi-agent agricultural advisory platform bridging field practice with multimodal generative intelligence.
            </p>
            <div className="flex items-center gap-2 pt-2 text-[11px] text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Gemini 2.5 Flash Engine Active</span>
            </div>
          </div>

          {/* Core Modules */}
          <div>
            <h4 className="text-slate-200 font-semibold mb-3 uppercase tracking-wider text-[11px]">
              Platform Modules
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="/advisory/new" className="hover:text-emerald-400 transition-colors">Multimodal Disease Diagnosis</a></li>
              <li><a href="/farms/new" className="hover:text-emerald-400 transition-colors">Soil & Farm Profile Setup</a></li>
              <li><a href="/dashboard" className="hover:text-emerald-400 transition-colors">Agro-Weather Spray Windows</a></li>
              <li><a href="/dashboard" className="hover:text-emerald-400 transition-colors">Dynamic Yield Forecaster</a></li>
              <li><a href="/history" className="hover:text-emerald-400 transition-colors">Advisory History & PDF Reports</a></li>
            </ul>
          </div>

          {/* Scientific Disclaimer */}
          <div className="md:col-span-2 bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
            <div className="flex items-start gap-2.5">
              <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-slate-200 font-semibold text-xs mb-1">
                  Scientific Agronomic Notice & Limitations
                </h4>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  {t.disclaimer}
                </p>
                <div className="mt-2.5 flex flex-wrap items-center gap-3 text-[10px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Cpu className="w-3.5 h-3.5 text-teal-400" />
                    Google GenAI SDK 2.5
                  </span>
                  <span className="flex items-center gap-1">
                    <Database className="w-3.5 h-3.5 text-emerald-400" />
                    Row-Level Data Isolation
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} AgriAssist AI. Built for global farmers and agricultural extension specialists.
          </div>
          <div className="flex items-center gap-1">
            <span>Cultivating sustainable food futures with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>and AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
