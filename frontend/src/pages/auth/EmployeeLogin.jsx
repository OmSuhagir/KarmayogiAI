import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiShield,
  FiAlertCircle,
  FiCheckCircle,
  FiKey,
} from 'react-icons/fi';
import { RiGovernmentLine } from 'react-icons/ri';
import { useAuth } from '../../context/AuthContext';
import GlassCard from '../../components/common/GlassCard';
import GlassButton from '../../components/common/GlassButton';
import GlassBadge from '../../components/common/GlassBadge';

export default function EmployeeLogin() {
  const navigate = useNavigate();
  const { loginEmployee } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Quick fill helper for prototype evaluation
  const handleFillDemo = () => {
    setEmail('rahul@example.com');
    setPassword('password123');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Field validation
    if (!email.trim()) {
      setError('Please enter your government email address.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email format.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);

    try {
      await loginEmployee({ email, password });
      navigate('/employee/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen ambient-canvas bg-canvas text-slate-800 flex flex-col justify-between relative px-4 py-8 sm:py-12">
      {/* Ambient Blurred Glowing Elements */}
      <div className="ambient-glow-1" />
      <div className="ambient-glow-2" />
      <div className="ambient-glow-3" />

      {/* Top Bar / Clean Header Branding */}
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <RiGovernmentLine className="text-2xl" />
          </div>
          <div>
            <span className="text-lg font-extrabold text-slate-900 tracking-tight block leading-tight">
              Karmayogi AI
            </span>
            <span className="text-[11px] text-slate-500 font-medium tracking-wide block">
              Competency Intelligence Platform
            </span>
          </div>
        </div>

        <GlassBadge variant="primary" size="sm" icon={FiShield}>
          Officer Portal
        </GlassBadge>
      </header>

      {/* Main Glass Login Card */}
      <main className="max-w-md w-full mx-auto my-auto relative z-10 py-6">
        <GlassCard variant="solid" className="p-7 sm:p-9 border-white/80 shadow-glass-lg">
          
          {/* Card Header */}
          <div className="text-center space-y-2 mb-6">
            <div className="flex justify-center mb-1">
              <GlassBadge variant="purple" size="sm">
                Employee Portal
              </GlassBadge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome back
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-normal">
              Sign in to continue your role competency journey.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50/90 border border-rose-200/90 text-rose-800 text-xs flex items-start gap-2.5 shadow-xs">
              <FiAlertCircle className="text-rose-600 text-base flex-shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{error}</div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Input */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
              >
                Government Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <FiMail className="text-base" />
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. rahul@example.com"
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-white/70 border border-slate-200/80 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all backdrop-blur-xs disabled:opacity-50"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
                >
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <FiLock className="text-base" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  disabled={loading}
                  className="w-full pl-10 pr-11 py-2.5 text-sm rounded-xl bg-white/70 border border-slate-200/80 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all backdrop-blur-xs disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <FiEyeOff className="text-base" />
                  ) : (
                    <FiEye className="text-base" />
                  )}
                </button>
              </div>
            </div>

            {/* Demo Helper Pill */}
            <div className="pt-1">
              <button
                type="button"
                onClick={handleFillDemo}
                className="w-full py-1.5 px-3 rounded-lg bg-blue-50/60 hover:bg-blue-100/70 border border-blue-200/70 text-blue-800 text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors"
              >
                <FiKey className="text-xs" />
                <span>Fill Demo Officer: <strong>rahul@example.com</strong></span>
              </button>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <GlassButton
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                iconRight={FiArrowRight}
                className="w-full justify-center shadow-md shadow-blue-500/20"
              >
                {loading ? 'Signing in...' : 'Sign In to Portal'}
              </GlassButton>
            </div>

            {/* Onboard Officer Callout */}
            <div className="pt-2">
              <Link
                to="/onboarding"
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100/80 hover:to-indigo-100/80 border border-blue-200/80 text-blue-900 text-xs font-bold flex items-center justify-between transition-all shadow-xs group"
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs shadow-xs">
                    +
                  </span>
                  <div className="text-left">
                    <span className="block leading-tight">New Officer Joining?</span>
                    <span className="text-[10px] text-blue-600 font-medium">
                      Sync e-HRMS 2.0 & Service Book
                    </span>
                  </div>
                </div>
                <FiArrowRight className="text-blue-700 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </form>

          {/* Security & Access Note */}
          <div className="mt-6 pt-5 border-t border-slate-200/60 flex items-center justify-center gap-2 text-[11px] text-slate-500">
            <FiCheckCircle className="text-emerald-600 text-xs flex-shrink-0" />
            <span>National Competency Framework for Civil Services</span>
          </div>
        </GlassCard>

        {/* Distinct Separation to Admin Login */}
        <div className="text-center mt-5">
          <p className="text-xs text-slate-500">
            Department Administrator or MDO Manager?{' '}
            <Link
              to="/login/admin"
              className="text-blue-600 font-semibold hover:text-blue-800 hover:underline transition-colors ml-0.5"
            >
              Go to Admin Login
            </Link>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto w-full text-center relative z-10 pt-4">
        <p className="text-[11px] text-slate-400">
          Karmayogi AI &bull; Smart India Hackathon 2026 Prototype &bull; Capacity Building Commission
        </p>
      </footer>
    </div>
  );
}
