import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { Advisory } from '../types';
import { AdvisoryResultCard } from '../components/AdvisoryResultCard';

export const AdvisoryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [advisory, setAdvisory] = useState<Advisory | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.getAdvisoryById(id)
      .then((data) => {
        setAdvisory(data);
        setError(null);
      })
      .catch((err) => {
        setError(err.message || 'Advisory not found');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <h3 className="font-bold text-slate-700 text-sm">
          Loading Agronomic Advisory Report...
        </h3>
      </div>
    );
  }

  if (error || !advisory) {
    return (
      <div className="max-w-lg mx-auto py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Advisory Report Not Found</h2>
        <p className="text-xs text-slate-500">
          The consultation record could not be retrieved or is restricted under data isolation rules.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-6 sm:py-10">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between no-print">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <Link
          to="/advisory/new"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          New Diagnosis
        </Link>
      </div>

      <AdvisoryResultCard advisory={advisory} />
    </div>
  );
};
