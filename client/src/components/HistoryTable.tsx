import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  ChevronRight, 
  Clock, 
  AlertTriangle, 
  Sparkles, 
  Calendar, 
  Layers, 
  FileText,
  RefreshCw
} from 'lucide-react';
import { api } from '../services/api';
import { Advisory } from '../types';
import { useApp } from '../context/AppContext';

export const HistoryTable: React.FC = () => {
  const { t } = useApp();
  const [advisories, setAdvisories] = useState<Advisory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [severity, setSeverity] = useState<string>('');
  const [issueCategory, setIssueCategory] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await api.getAdvisories({
        search,
        severity,
        issueCategory,
        page,
        limit: 10
      });
      setAdvisories(res.data);
      setTotalPages(res.totalPages);
      setTotalCount(res.total);
    } catch (err) {
      console.error('Failed to load advisories history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [search, severity, issueCategory, page]);

  const severityBadge = (level: string) => {
    switch (level) {
      case 'Critical':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'High':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Moderate':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      {/* Header & Filter Controls */}
      <div className="p-5 sm:p-6 border-b border-slate-100 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-extrabold text-slate-800 text-lg">
              Consultation Archive & Disease Logs
            </h3>
            <p className="text-xs text-slate-500">
              {totalCount} Total Agronomic Diagnoses Recorded in PostgreSQL
            </p>
          </div>

          <button
            onClick={fetchHistory}
            className="p-2 rounded-xl text-slate-400 hover:text-emerald-600 hover:bg-slate-50 self-start sm:self-auto border border-slate-200"
            title="Refresh History"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search diagnosis title, crop, or symptoms..."
              className="w-full pl-9 pr-3 py-2 text-xs font-medium border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={severity}
              onChange={(e) => {
                setSeverity(e.target.value);
                setPage(1);
              }}
              className="w-full py-2 px-3 text-xs font-medium border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="">All Severity Levels</option>
              <option value="Low">Low</option>
              <option value="Moderate">Moderate</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={issueCategory}
              onChange={(e) => {
                setIssueCategory(e.target.value);
                setPage(1);
              }}
              className="w-full py-2 px-3 text-xs font-medium border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="">All Issue Categories</option>
              <option value="Fungal">Fungal</option>
              <option value="Bacterial">Bacterial</option>
              <option value="Viral">Viral</option>
              <option value="Pest">Pest</option>
              <option value="Nutrient Deficiency">Nutrient Deficiency</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table / List */}
      {loading ? (
        <div className="p-8 text-center text-xs text-slate-400 animate-pulse space-y-3">
          <div className="h-10 bg-slate-100 rounded-xl" />
          <div className="h-10 bg-slate-100 rounded-xl" />
          <div className="h-10 bg-slate-100 rounded-xl" />
        </div>
      ) : advisories.length === 0 ? (
        <div className="p-12 text-center">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="font-bold text-slate-700 text-sm">{t.noAdvisoriesYet}</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Submit a crop leaf photograph or describe field symptoms to initiate your first diagnosis.
          </p>
          <Link
            to="/advisory/new"
            className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-600/20"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Launch New Consultation
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-slate-100 overflow-x-auto">
          {advisories.map((adv) => (
            <Link
              key={adv.id}
              to={`/advisory/${adv.id}`}
              className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50 transition-colors group block"
            >
              <div className="flex items-center gap-4 min-w-0">
                {/* Thumbnail or Icon */}
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0 flex items-center justify-center">
                  {adv.image_url ? (
                    <img
                      src={adv.image_url}
                      alt={adv.diagnosis_title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FileText className="w-6 h-6 text-emerald-600" />
                  )}
                </div>

                {/* Details */}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-bold text-xs sm:text-sm text-slate-800 group-hover:text-emerald-700 transition-colors truncate">
                      {adv.diagnosis_title}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${severityBadge(adv.severity_level)}`}>
                      {adv.severity_level}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {adv.crop_name}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-1 max-w-xl">
                    {adv.symptom_description}
                  </p>

                  <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(adv.created_at).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-emerald-700">
                      Confidence: {adv.confidence_score}%
                    </span>
                    {adv.farm_name && (
                      <>
                        <span>•</span>
                        <span className="truncate max-w-[120px]">{adv.farm_name}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pl-4 flex-shrink-0 text-slate-400 group-hover:text-emerald-600">
                <span className="text-xs font-bold hidden sm:inline">View Advisory</span>
                <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Page {page} of {totalPages}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 font-bold"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 font-bold"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
