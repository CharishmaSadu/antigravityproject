import React from 'react';
import { HistoryTable } from '../components/HistoryTable';

export const HistoryPage: React.FC = () => {
  return (
    <div className="py-6 sm:py-10 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          Agricultural Advisory History
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review past field pathology analyses, treatment recommendations, and seasonal intervention logs.
        </p>
      </div>
      <HistoryTable />
    </div>
  );
};
