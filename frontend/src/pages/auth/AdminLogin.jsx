import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FiShield,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiAlertCircle,
  FiCheckCircle,
  FiUsers,
} from 'react-icons/fi';
import { RiGovernmentLine } from 'react-icons/ri';
import { useAuth } from '../../context/AuthContext';
import GlassCard from '../../components/common/GlassCard';
import GlassButton from '../../components/common/GlassButton';
import GlassBadge from '../../components/common/GlassBadge';

export default function AdminLogin() {
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // One-click demo fill for rapid evaluation
  const handleFillDemo = () => {
    setEmail('admin@karmayogi.gov.in');
    setPassword('admin123');
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail) {
      setError('Please enter your administrator email address.');
      return;
    }
    if (!cleanPassword) {
      setError('Please enter your password.');
      return;
    }

    try {
      setLoading(true);
      await loginAdmin({ email: cleanEmail, password: cleanPassword });
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen ambient-canvas bg-canvas flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 relative selection:bg-indigo-100 selection:text-indigo-900 antialiased">
      {/* Ambient background glow orbs */}
      <div className="ambient-glow-1" />
      <div className="ambient-glow-2" />
      <div className="ambient-glow-3" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        
        {/* BRAND HEADER */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-700 via-indigo-800 to-slate-900 text-white shadow-lg shadow-indigo-500/20 mb-1">
            <RiGovernmentLine className="text-3xl" />
          </div>
          
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl font-extrabold text-slate-900 tracking-tight">
              Karmayogi AI
            </span>
            <GlassBadge variant="purple" size="xs">
              Administrator Portal
            </GlassBadge>
          </div>

          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Workforce Intelligence Portal
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
            Manage workforce competency frameworks, monitor capacity-building velocity, and oversee AI-assisted assessment content.
          </p>
        </div>

        {/* LOGIN FORM CARD */}
        <GlassCard variant="solid" className="p-6 sm:p-8 border-white/80 shadow-glass-lg space-y-6">
          
          {/* Quick Demo Fill Pill */}
          <div className="p-3 rounded-xl bg-indigo-50/80 border border-indigo-100 flex items-center justify-between gap-2">
            <div className="text-[11px] text-indigo-900 font-medium">
              <span className="font-bold block">Prototype Admin Credentials</span>
              <span className="text-indigo-700">admin@karmayogi.gov.in / admin123</span>
            </div>
            <GlassButton
              type="button"
              variant="outline"
              size="xs"
              onClick={handleFillDemo}
            >
              Fill Demo Admin
            </GlassButton>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5 shadow-xs">
              <FiAlertCircle className="text-base text-rose-600 flex-shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Field */}
            <div className="space-y-1.5 text-left">
              <label
                htmlFor="admin-email"
                className="block text-xs font-bold uppercase tracking-wider text-slate-600"
              >
                Administrative Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <FiMail className="text-base" />
                </div>
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@karmayogi.gov.in"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/70 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all font-medium"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5 text-left">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="admin-password"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-600"
                >
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <FiLock className="text-base" />
                </div>
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/70 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all font-medium"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FiEyeOff className="text-sm" /> : <FiEye className="text-sm" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <GlassButton
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className="w-full justify-center bg-gradient-to-r from-indigo-700 to-slate-900 hover:from-indigo-800 hover:to-black text-white shadow-md shadow-indigo-500/20"
                iconRight={FiArrowRight}
              >
                {loading ? 'Authenticating Administrator...' : 'Sign In as Administrator'}
              </GlassButton>
            </div>
          </form>

          {/* Portal Switcher Link */}
          <div className="pt-4 border-t border-slate-200/60 text-center text-xs text-slate-500">
            <span>Are you a civil service officer? </span>
            <Link
              to="/login/employee"
              className="font-bold text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1"
            >
              Switch to Employee Portal &rarr;
            </Link>
          </div>
        </GlassCard>

        {/* Footer Note */}
        <p className="text-center text-[11px] text-slate-400">
          Mission Karmayogi &bull; National Programme for Civil Services Capacity Building
        </p>

      </div>
    </div>
  );
}
