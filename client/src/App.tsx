import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { FarmSetupPage } from './pages/FarmSetupPage';
import { AdvisoryNewPage } from './pages/AdvisoryNewPage';
import { AdvisoryDetailPage } from './pages/AdvisoryDetailPage';
import { HistoryPage } from './pages/HistoryPage';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full no-print">
      {toasts.map((t) => {
        const bg =
          t.type === 'success'
            ? 'bg-emerald-800 text-white border-emerald-700'
            : t.type === 'error'
            ? 'bg-rose-800 text-white border-rose-700'
            : 'bg-slate-900 text-white border-slate-800';

        const Icon =
          t.type === 'success' ? CheckCircle2 : t.type === 'error' ? AlertCircle : Info;

        return (
          <div
            key={t.id}
            className={`p-3.5 rounded-xl border shadow-lg flex items-start gap-2.5 text-xs font-semibold animate-slide-up ${bg}`}
          >
            <Icon className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div className="flex-1 leading-snug">{t.message}</div>
            <button
              onClick={() => dismissToast(t.id)}
              className="text-slate-300 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

const AppRoutes: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/farms/new" element={<FarmSetupPage />} />
          <Route path="/advisory/new" element={<AdvisoryNewPage />} />
          <Route path="/advisory/:id" element={<AdvisoryDetailPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
