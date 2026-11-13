import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  CartesianGrid 
} from 'recharts';
import { 
  TrendingUp, 
  ShieldCheck, 
  AlertCircle, 
  Sparkles, 
  SlidersHorizontal 
} from 'lucide-react';
import { api } from '../services/api';
import { YieldAnalysis, SoilType, IrrigationType, SeverityLevel } from '../types';

export const YieldAnalytics: React.FC = () => {
  const [crop, setCrop] = useState<string>('Tomato');
  const [soil, setSoil] = useState<SoilType>('Loam');
  const [ph, setPh] = useState<number>(6.5);
  const [irrigation, setIrrigation] = useState<IrrigationType>('Drip');
  const [severity, setSeverity] = useState<SeverityLevel>('Moderate');
  const [data, setData] = useState<YieldAnalysis | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const crops = ['Tomato', 'Potato', 'Corn', 'Wheat', 'Rice', 'Soybeans', 'Cotton', 'Onion'];
  const soils: SoilType[] = ['Clay', 'Loam', 'Sandy', 'Silt', 'Peaty', 'Chalky'];
  const irrigations: IrrigationType[] = ['Drip', 'Sprinkler', 'Canal', 'Flood', 'Rainfed'];
  const severities: SeverityLevel[] = ['Low', 'Moderate', 'High', 'Critical'];

  const calculate = async () => {
    try {
      setLoading(true);
      const res = await api.getYieldForecast({
        crop,
        soil,
        ph,
        irrigation,
        severity
      });
      setData(res);
    } catch (err) {
      console.error('Yield analysis calculation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculate();
  }, [crop, soil, ph, irrigation, severity]);

  const barColors = ['#10b981', '#f43f5e', '#3b82f6'];

  return (
    <div className="bg-white rounded-2xl p-6 border border-emerald-100/80 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base">
              Dynamic Yield & Crop Health Forecaster
            </h3>
            <p className="text-xs text-slate-500">
              Interactive soil chemistry and agronomic treatment recovery simulator
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 self-start sm:self-auto flex items-center gap-1">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Live Model
        </span>
      </div>

      {/* Control sliders & selectors */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 my-4 p-4 bg-slate-50 rounded-xl border border-slate-200/60">
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">Target Crop</label>
          <select
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
            className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            {crops.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">Soil Type</label>
          <select
            value={soil}
            onChange={(e) => setSoil(e.target.value as SoilType)}
            className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            {soils.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[11px] font-bold text-slate-700">Soil pH</label>
            <span className="text-[11px] font-bold text-emerald-700">{ph}</span>
          </div>
          <input
            type="range"
            min="4.5"
            max="9.0"
            step="0.1"
            value={ph}
            onChange={(e) => setPh(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 mt-2"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">Irrigation</label>
          <select
            value={irrigation}
            onChange={(e) => setIrrigation(e.target.value as IrrigationType)}
            className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            {irrigations.map((i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">Disease Pressure</label>
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value as SeverityLevel)}
            className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            {severities.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Metrics Column */}
          <div className="lg:col-span-5 space-y-3">
            <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/80">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Yield Protected by AgriAssist
                </span>
                <span className="text-xs font-black px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                  +{data.protectionPercentage}% Recovery
                </span>
              </div>
              <div className="text-3xl font-black text-slate-800 mt-2">
                {data.treatedYield} <span className="text-sm font-semibold text-slate-500">{data.unit}</span>
              </div>
              <p className="text-xs text-emerald-700 mt-1 font-medium">
                Saves ~{data.yieldProtected} {data.unit} compared to untreated crop loss.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 text-[11px]">Untreated Scenario</span>
                <div className="font-bold text-rose-600 text-base mt-0.5">
                  {data.untreatedYield} <span className="text-xs font-normal text-slate-500">t/ac</span>
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 text-[11px]">Soil Fertility Index</span>
                <div className="font-bold text-emerald-700 text-base mt-0.5">
                  {data.soilHealthScore} / 100
                </div>
              </div>
            </div>
          </div>

          {/* Recharts Bar Chart */}
          <div className="lg:col-span-7 h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.chartComparison} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#64748b" />
                <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" />
                <Tooltip 
                  formatter={(val: any) => [`${val} ${data.unit}`, 'Estimated Yield']}
                  contentStyle={{ borderRadius: '12px', fontSize: '11px', border: '1px solid #e2e8f0' }} 
                />
                <Bar dataKey="yield" radius={[8, 8, 0, 0]}>
                  {data.chartComparison.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};
