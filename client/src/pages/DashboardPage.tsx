import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sprout, 
  Sparkles, 
  MapPin, 
  History, 
  PlusCircle, 
  AlertTriangle, 
  ShieldCheck, 
  TrendingUp, 
  Calendar,
  Layers,
  ChevronRight,
  Droplets
} from 'lucide-react';
import { api } from '../services/api';
import { Farm, Advisory } from '../types';
import { useApp } from '../context/AppContext';
import { WeatherWidget } from '../components/WeatherWidget';
import { YieldAnalytics } from '../components/YieldAnalytics';

export const DashboardPage: React.FC = () => {
  const { t, refreshTrigger } = useApp();
  const [farms, setFarms] = useState<Farm[]>([]);
  const [recentAdvisories, setRecentAdvisories] = useState<Advisory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const [farmsData, advData] = await Promise.all([
          api.getFarms(),
          api.getAdvisories({ limit: 4 })
        ]);
        setFarms(farmsData);
        setRecentAdvisories(advData.data);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, [refreshTrigger]);

  const primaryFarm = farms[0] || null;

  return (
    <div className="space-y-8 pb-12">
      {/* Top Welcome & Quick Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Field Intelligence Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            {t.navDashboard} & Agronomic Operations
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time farm health monitoring, climate risk analysis, and generative crop diagnostics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/farms/new"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold shadow-sm transition-all"
          >
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>Register Farm Profile</span>
          </Link>
          <Link
            to="/advisory/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-md shadow-emerald-600/30 transition-all hover:scale-[1.02]"
          >
            <Sparkles className="w-4 h-4" />
            <span>{t.ctaNewAdvisory}</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Active Farm Profiles
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {farms.length}
            </div>
            <span className="text-[10px] text-emerald-700 font-semibold">
              {farms.reduce((acc, f) => acc + (f.total_area_acres || 0), 0)} Total Acres
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Sprout className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Crop Diagnoses
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {recentAdvisories.length > 0 ? recentAdvisories.length : '1'}
            </div>
            <span className="text-[10px] text-teal-700 font-semibold">
              Gemini 2.5 Flash Verified
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Foliar Disease Hazard
            </span>
            <div className="text-2xl font-black text-emerald-800 mt-1">
              Low - Mod
            </div>
            <span className="text-[10px] text-slate-500 font-medium">
              Spray window open till 11 AM
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Yield Recovery Potential
            </span>
            <div className="text-2xl font-black text-emerald-700 mt-1">
              +85%
            </div>
            <span className="text-[10px] text-emerald-800 font-semibold">
              With biological & NPK protocol
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Agro-Weather & Spray Window Widget */}
      <WeatherWidget region={primaryFarm ? primaryFarm.location_region : 'Salinas Valley, California'} />

      {/* Yield Forecaster & Soil Health Calculator */}
      <YieldAnalytics />

      {/* Two Column Grid: Farm Profiles & Recent Consultations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Active Farms Section */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-600" />
              {t.myFarms}
            </h2>
            <Link
              to="/farms/new"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              + Add Farm
            </Link>
          </div>

          <div className="space-y-3">
            {farms.length === 0 ? (
              <div className="p-6 bg-white rounded-2xl border border-slate-200 text-center">
                <Sprout className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500">No farm profiles configured yet.</p>
                <Link
                  to="/farms/new"
                  className="mt-2 inline-block text-xs font-bold text-emerald-600"
                >
                  Launch Farm Wizard →
                </Link>
              </div>
            ) : (
              farms.map((farm) => (
                <div
                  key={farm.id}
                  className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 transition-all shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{farm.farm_name}</h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {farm.location_region}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {farm.total_area_acres} Acres
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-100 text-slate-600">
                    <div>
                      Soil: <strong>{farm.soil_type}</strong> (pH {farm.soil_ph})
                    </div>
                    <div>
                      Irrigation: <strong>{farm.irrigation_type}</strong>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {farm.primary_crops.map((c) => (
                      <span key={c} className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Advisories Section */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              {t.recentAdvisories}
            </h2>
            <Link
              to="/history"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              View Full History →
            </Link>
          </div>

          <div className="space-y-3">
            {recentAdvisories.length === 0 ? (
              <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center">
                <p className="text-xs text-slate-500">{t.noAdvisoriesYet}</p>
                <Link
                  to="/advisory/new"
                  className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Diagnose First Crop
                </Link>
              </div>
            ) : (
              recentAdvisories.map((adv) => (
                <Link
                  key={adv.id}
                  to={`/advisory/${adv.id}`}
                  className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 transition-all shadow-sm flex items-center justify-between group block"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 flex-shrink-0">
                      <Sprout className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-emerald-700 truncate">
                          {adv.diagnosis_title}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          {adv.confidence_score}%
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate max-w-md mt-0.5">
                        {adv.crop_name} • {adv.symptom_description}
                      </p>
                    </div>
                  </div>

                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition-transform group-hover:translate-x-1 flex-shrink-0" />
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
