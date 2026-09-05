import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiCheckCircle, FiShield } from 'react-icons/fi';
import { RiGovernmentLine } from 'react-icons/ri';
import { useAuth } from '../../context/AuthContext';
import GlassCard from '../../components/common/GlassCard';
import GlassButton from '../../components/common/GlassButton';
import GlassBadge from '../../components/common/GlassBadge';

export default function DashboardPlaceholder() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login/employee');
  };

  return (
    <div className="min-h-screen ambient-canvas bg-canvas text-slate-800 flex flex-col justify-between p-6">
      <div className="ambient-glow-1" />
      <div className="ambient-glow-2" />

      {/* Header */}
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between relative z-10 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white">
            <RiGovernmentLine className="text-xl" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900">Karmayogi AI</h1>
            <p className="text-xs text-slate-500">Employee Portal</p>
          </div>
        </div>

        <GlassButton size="sm" variant="ghost" icon={FiLogOut} onClick={handleLogout}>
          Sign Out
        </GlassButton>
      </header>

      {/* Main Container */}
      <main className="max-w-md w-full mx-auto my-auto relative z-10 text-center space-y-4">
        <GlassCard variant="solid" className="p-8 space-y-4 border-white/80 shadow-glass">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
            <FiCheckCircle className="text-2xl" />
          </div>

          <div className="space-y-1">
            <GlassBadge variant="success" size="sm" dot>
              Authenticated Session
            </GlassBadge>
            <h2 className="text-2xl font-extrabold text-slate-900">
              Employee Dashboard
            </h2>
            <p className="text-xs text-slate-500">
              Stage 2 Login Succeeded &bull; Session Active for{' '}
              <strong className="text-slate-800">{user?.name || 'Officer'}</strong>
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-100 text-left text-xs text-slate-600 space-y-1">
            <p className="font-semibold text-slate-800">Officer Context:</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Position:</strong> {user?.position?.title || 'Statistical Officer'}</p>
            <p><strong>Ministry:</strong> {user?.department?.name || 'MoSPI'}</p>
          </div>

          <p className="text-[11px] text-slate-400">
            Stage 3 will implement the complete 4-pillar Employee Dashboard.
          </p>
        </GlassCard>
      </main>

      <footer className="text-center text-xs text-slate-400 py-4 relative z-10">
        Karmayogi AI &bull; Prototype Application
      </footer>
    </div>
  );
}
