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
  FiKey,
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
    <div className="min-h-screen bg-[#F4F1E9] text-[#171717] flex flex-col justify-between px-4 py-8 sm:py-12">
      {/* Top Header */}
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#111111] text-[#FFFDF8] flex items-center justify-center font-bold">
            <RiGovernmentLine className="text-xl" />
          </div>
          <div>
            <span className="text-sm font-bold text-[#111111] tracking-tight block">
              Karmayogi AI &middot; Governance
            </span>
            <span className="text-[10px] text-[#8A8882] block">
              Workforce Intelligence & Oversight
            </span>
          </div>
        </div>

        <Link
          to="/login/employee"
          className="text-xs font-semibold text-[#62615D] hover:text-[#111111]"
        >
          Officer Portal &rarr;
        </Link>
      </header>

      {/* Main Login Card */}
      <main className="max-w-md w-full mx-auto my-auto py-6">
        <div className="rounded-2xl bg-[#FFFDF8] border border-[#DDD9CF] p-7 sm:p-9 shadow-xs space-y-6">
          <div className="text-center space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8882]">
              Administrative Supervision
            </span>
            <h1 className="text-2xl font-bold text-[#111111] tracking-tight">
              Workforce Governance
            </h1>
            <p className="text-xs text-[#62615D]">
              Sign in to manage competency frameworks, monitor capacity metrics, and review assessment items.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-[#F8E9E7] border border-[#E8C2BF] text-[#A54C45] text-xs flex items-center gap-2">
              <FiAlertCircle className="text-base flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label
                htmlFor="email"
                className="block text-xs font-bold uppercase tracking-wider text-[#111111]"
              >
                Administrator Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8A8882]">
                  <FiMail className="text-sm" />
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@karmayogi.gov.in"
                  disabled={loading}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg bg-[#F8F6F0] border border-[#DDD9CF] text-[#111111] placeholder:text-[#8A8882] focus:outline-none focus:border-[#111111]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="password"
                className="block text-xs font-bold uppercase tracking-wider text-[#111111]"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8A8882]">
                  <FiLock className="text-sm" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  disabled={loading}
                  className="w-full pl-9 pr-10 py-2 text-xs sm:text-sm rounded-lg bg-[#F8F6F0] border border-[#DDD9CF] text-[#111111] placeholder:text-[#8A8882] focus:outline-none focus:border-[#111111]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8A8882] hover:text-[#111111]"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {/* Demo Helper */}
            <button
              type="button"
              onClick={handleFillDemo}
              className="w-full py-1.5 px-3 rounded bg-[#F8F6F0] hover:bg-[#EAE6DB] border border-[#DDD9CF] text-[#111111] text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <FiKey className="text-xs" />
              <span>Fill Demo Admin (admin@karmayogi.gov.in)</span>
            </button>

            <GlassButton
              type="submit"
              variant="primary"
              size="md"
              loading={loading}
              iconRight={FiArrowRight}
              className="w-full justify-center"
            >
              {loading ? 'Authenticating...' : 'Sign In as Administrator'}
            </GlassButton>
          </form>
        </div>

        <div className="text-center mt-4">
          <p className="text-xs text-[#62615D]">
            Looking for Officer Portal?{' '}
            <Link
              to="/login/employee"
              className="font-semibold text-[#111111] hover:underline"
            >
              Officer Login &rarr;
            </Link>
          </p>
        </div>
      </main>

      <footer className="max-w-4xl mx-auto w-full text-center pt-4">
        <p className="text-[10px] text-[#8A8882]">
          Karmayogi AI &bull; Workforce Governance & Capacity Building Commission
        </p>
      </footer>
    </div>
  );
}
