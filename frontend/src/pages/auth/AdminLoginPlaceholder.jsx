import React from 'react';
import { Link } from 'react-router-dom';
import { FiShield, FiArrowLeft } from 'react-icons/fi';
import { RiGovernmentLine } from 'react-icons/ri';
import GlassCard from '../../components/common/GlassCard';
import GlassBadge from '../../components/common/GlassBadge';

export default function AdminLoginPlaceholder() {
  return (
    <div className="min-h-screen ambient-canvas bg-canvas text-slate-800 flex flex-col justify-between p-6">
      <div className="ambient-glow-1" />
      <div className="ambient-glow-2" />

      <header className="max-w-4xl mx-auto w-full flex items-center justify-between relative z-10 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-700 to-slate-900 flex items-center justify-center text-white">
            <RiGovernmentLine className="text-xl" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900">Karmayogi AI</h1>
            <p className="text-xs text-slate-500">Administration Console</p>
          </div>
        </div>

        <Link
          to="/login/employee"
          className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
        >
          <FiArrowLeft /> Back to Employee Portal
        </Link>
      </header>

      <main className="max-w-md w-full mx-auto my-auto relative z-10 text-center space-y-4">
        <GlassCard variant="solid" className="p-8 space-y-4 border-white/80 shadow-glass">
          <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center mx-auto">
            <FiShield className="text-2xl" />
          </div>

          <div className="space-y-1">
            <GlassBadge variant="purple" size="sm">
              Administrator Portal
            </GlassBadge>
            <h2 className="text-2xl font-extrabold text-slate-900">
              Admin Login
            </h2>
            <p className="text-xs text-slate-500">
              Workforce Intelligence & Competency Management Console
            </p>
          </div>

          <p className="text-xs text-slate-600 bg-slate-100/70 p-4 rounded-xl border border-slate-200/80">
            The Admin Portal is a completely separate experience and will be implemented in subsequent stages.
          </p>

          <Link
            to="/login/employee"
            className="inline-block text-xs font-semibold text-blue-700 hover:underline pt-2"
          >
            &larr; Return to Employee Login
          </Link>
        </GlassCard>
      </main>

      <footer className="text-center text-xs text-slate-400 py-4 relative z-10">
        Karmayogi AI &bull; Smart India Hackathon 2026
      </footer>
    </div>
  );
}
