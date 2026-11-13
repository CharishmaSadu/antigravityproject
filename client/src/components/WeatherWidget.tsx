import React, { useEffect, useState } from 'react';
import { 
  CloudSun, 
  Droplets, 
  Wind, 
  Sun, 
  AlertTriangle, 
  CheckCircle2, 
  CloudRain, 
  RefreshCw,
  TrendingUp
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { api } from '../services/api';
import { WeatherData } from '../types';
import { useApp } from '../context/AppContext';

export const WeatherWidget: React.FC<{ region?: string }> = ({ region = 'Salinas Valley, California' }) => {
  const { t } = useApp();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(0);

  const loadWeather = async () => {
    try {
      setLoading(true);
      const data = await api.getWeather(region);
      setWeather(data);
    } catch (err) {
      console.error('Failed to load agro weather:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeather();
  }, [region]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm animate-pulse space-y-4">
        <div className="h-6 bg-slate-200 rounded w-1/3" />
        <div className="h-28 bg-slate-100 rounded-xl" />
        <div className="grid grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-slate-100 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!weather) return null;

  const currentDay = weather.forecast[selectedDayIdx] || weather.forecast[0];

  return (
    <div className="bg-white rounded-2xl p-6 border border-emerald-100/80 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
            <CloudSun className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
              {t.weatherAdvisory}
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {weather.region}
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Live Field Met-Sensors & Satellite Agro-Forecasting
            </p>
          </div>
        </div>

        <button
          onClick={loadWeather}
          className="self-start sm:self-center p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-slate-50 transition-colors"
          title="Refresh Met Data"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Current Conditions Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-4">
        <div className="p-3 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
          <div className="text-[11px] font-semibold text-emerald-800 flex items-center gap-1.5">
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            Field Temperature
          </div>
          <div className="text-2xl font-black text-slate-800 mt-1">
            {weather.current.temperature}°C
          </div>
          <div className="text-[10px] text-slate-500 font-medium">Optimal crop metabolism</div>
        </div>

        <div className="p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
          <div className="text-[11px] font-semibold text-blue-800 flex items-center gap-1.5">
            <Droplets className="w-3.5 h-3.5 text-blue-500" />
            Relative Humidity
          </div>
          <div className="text-2xl font-black text-slate-800 mt-1">
            {weather.current.relativeHumidity}%
          </div>
          <div className="text-[10px] text-slate-500 font-medium">Soil moisture: {weather.current.soilMoisturePercent}%</div>
        </div>

        <div className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
          <div className="text-[11px] font-semibold text-purple-800 flex items-center gap-1.5">
            <Wind className="w-3.5 h-3.5 text-purple-500" />
            Foliar Wetness / Risk
          </div>
          <div className="text-2xl font-black text-slate-800 mt-1 flex items-baseline gap-1">
            {currentDay.diseaseRiskScore}
            <span className="text-xs font-semibold text-slate-400">/ 100</span>
          </div>
          <div className={`text-[10px] font-bold ${
            currentDay.diseaseRiskScore > 65 ? 'text-rose-600' : 'text-emerald-700'
          }`}>
            {currentDay.diseaseRiskScore > 65 ? 'High Pathogen Pressure' : 'Low Fungal Hazard'}
          </div>
        </div>

        <div className="p-3 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-100">
          <div className="text-[11px] font-semibold text-amber-800 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Spray Advisory
          </div>
          <div className="text-xs font-bold text-slate-800 mt-1 leading-snug">
            {currentDay.sprayWindowSuitability}
          </div>
          <div className="text-[10px] text-slate-500 truncate" title={weather.current.sprayAdvisory}>
            {weather.current.sprayAdvisory}
          </div>
        </div>
      </div>

      {/* 7-Day Carousel Selection */}
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 my-4">
        {weather.forecast.map((day, idx) => {
          const isSelected = idx === selectedDayIdx;
          return (
            <button
              key={day.day}
              onClick={() => setSelectedDayIdx(idx)}
              className={`p-2.5 rounded-xl text-center border transition-all ${
                isSelected
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md scale-105'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <div className={`text-xs font-bold ${isSelected ? 'text-emerald-100' : 'text-slate-500'}`}>
                {day.day}
              </div>
              <div className="text-sm font-black my-0.5">
                {day.tempMax}°
              </div>
              <div className="flex items-center justify-center gap-1 text-[10px]">
                <CloudRain className={`w-3 h-3 ${isSelected ? 'text-emerald-200' : 'text-blue-500'}`} />
                <span>{day.rainfallProbability}%</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Recharts Analytics Chart: Temperature & Disease Risk Index */}
      <div className="mt-4 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            7-Day Climate & Disease Risk Trajectory
          </div>
          <div className="flex items-center gap-3 text-[10px] font-semibold text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Max Temp (°C)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              Disease Risk Score
            </span>
          </div>
        </div>

        <div className="h-36 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weather.forecast} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '12px', 
                  fontSize: '11px', 
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  border: '1px solid #e2e8f0'
                }} 
              />
              <Area type="monotone" dataKey="tempMax" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorTemp)" name="Max Temp (°C)" />
              <Area type="monotone" dataKey="diseaseRiskScore" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorRisk)" name="Disease Risk (0-100)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
