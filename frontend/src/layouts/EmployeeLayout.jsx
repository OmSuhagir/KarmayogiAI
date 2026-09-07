import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  FiHome,
  FiAward,
  FiFileText,
  FiAlertCircle,
  FiBookOpen,
  FiTrendingUp,
  FiZap,
  FiLogOut,
  FiMenu,
  FiX,
  FiUser,
} from 'react-icons/fi';
import { RiGovernmentLine, RiSparklingFill } from 'react-icons/ri';
import { useAuth } from '../context/AuthContext';
import GlassBadge from '../components/common/GlassBadge';
import EmployeeCompanionWidget from '../components/companion/EmployeeCompanionWidget';

export default function EmployeeLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sathiOpen, setSathiOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login/employee');
  };

  const navItems = [
    { label: 'Overview', path: '/employee/dashboard', icon: FiHome },
    { label: 'Competencies', path: '/employee/competencies', icon: FiAward },
    { label: 'Skill Gaps', path: '/employee/skill-gaps', icon: FiAlertCircle },
    { label: 'Assessments', path: '/employee/assessments', icon: FiFileText },
    { label: 'Learning Hub', path: '/employee/learning', icon: FiBookOpen },
    { label: 'Recommendations', path: '/employee/recommendations', icon: FiZap },
    { label: 'Progress', path: '/employee/progress', icon: FiTrendingUp },
  ];

  const getInitials = (name) => {
    if (!name) return 'GO';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-[#F4F1E9] text-[#171717] flex flex-col antialiased selection:bg-[#E9EDFF] selection:text-[#3348A8]">
      {/* TOP HEADER & PRIMARY NAVIGATION */}
      <header className="sticky top-0 z-40 bg-[#FFFDF8]/95 backdrop-blur-md border-b border-[#DDD9CF] shadow-xs">
        {/* Main Header Row */}
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

          {/* Left: Brand + Identity */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-[#62615D] hover:text-[#111111] hover:bg-[#F8F6F0] border border-[#DDD9CF] transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <FiX className="text-lg" /> : <FiMenu className="text-lg" />}
            </button>

            <NavLink to="/employee/dashboard" className="flex items-center gap-3 flex-shrink-0">
              <div className="w-8 h-8 rounded-lg bg-[#111111] text-[#FFFDF8] flex items-center justify-center font-bold flex-shrink-0">
                <RiGovernmentLine className="text-lg" />
              </div>
              <div className="flex-shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#111111] tracking-tight whitespace-nowrap">
                    Karmayogi AI
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#F8F6F0] text-[#62615D] border border-[#DDD9CF] whitespace-nowrap">
                    Officer
                  </span>
                </div>
                <span className="text-[10px] text-[#8A8882] hidden 2xl:block whitespace-nowrap">
                  Capacity Intelligence &middot; MoSPI
                </span>
              </div>
            </NavLink>
          </div>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden xl:flex items-center gap-1 2xl:gap-1.5 overflow-x-auto py-1 scrollbar-none">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `px-2.5 2xl:px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex-shrink-0 ${isActive
                    ? 'bg-[#111111] text-[#FFFDF8] font-semibold shadow-xs'
                    : 'text-[#62615D] hover:text-[#111111] hover:bg-[#F8F6F0]'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Actions: Sathi Trigger + e-HRMS + Officer Profile + Logout */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Quick Sathi Assistant Trigger with Animated Logo */}
            <button
              type="button"
              onClick={() => setSathiOpen(true)}
              className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#FFFDF8] hover:bg-[#F8F6F0] text-[#111111] text-xs font-semibold border border-[#DDD9CF] transition-all shadow-xs whitespace-nowrap flex-shrink-0"
              title="Open Karmayogi Sathi AI Copilot"
            >
              <div className="relative flex items-center justify-center">
                <RiSparklingFill className="text-[#3348A8] text-sm animate-pulse group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <span className="whitespace-nowrap">Sathi AI</span>
            </button>

            {/* e-HRMS Onboard Demo Shortcut */}
            <NavLink
              to="/onboarding"
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#62615D] hover:text-[#111111] hover:bg-[#F8F6F0] border border-[#DDD9CF] transition-colors whitespace-nowrap flex-shrink-0"
              title="Test e-HRMS 2.0 Ingestion"
            >
              <span>e-HRMS</span>
            </NavLink>

            {/* Officer Profile Badge */}
            <div className="flex items-center gap-2 pl-2 border-l border-[#DDD9CF] flex-shrink-0">
              <div className="w-8 h-8 rounded-lg bg-[#F8F6F0] border border-[#DDD9CF] text-[#111111] font-bold text-xs flex items-center justify-center flex-shrink-0">
                {getInitials(user?.name)}
              </div>
              <div className="hidden sm:block text-left whitespace-nowrap flex-shrink-0">
                <div className="text-xs font-semibold text-[#111111] leading-tight truncate max-w-[130px]">
                  {user?.name || 'Rahul Sharma'}
                </div>
                <div className="text-[10px] text-[#8A8882] leading-tight truncate max-w-[130px]">
                  {user?.position?.title || 'Statistical Officer'}
                </div>
              </div>
            </div>

            {/* Sign Out */}
            <button
              type="button"
              onClick={handleLogout}
              className="p-2 rounded-lg text-[#8A8882] hover:text-[#A54C45] hover:bg-[#F8E9E7] transition-colors text-xs flex-shrink-0"
              title="Sign Out"
            >
              <FiLogOut className="text-sm" />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE NAVIGATION DRAWER */}
      {mobileMenuOpen && (
        <div className="xl:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 bg-[#FFFDF8] border-r border-[#DDD9CF] shadow-xl p-5 flex flex-col justify-between z-10">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#DDD9CF]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-[#111111] text-[#FFFDF8] flex items-center justify-center font-bold">
                    <RiGovernmentLine className="text-sm" />
                  </div>
                  <span className="text-sm font-bold text-[#111111]">Karmayogi AI</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-md text-[#8A8882] hover:text-[#111111]"
                >
                  <FiX className="text-lg" />
                </button>
              </div>

              <div className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${isActive
                          ? 'bg-[#111111] text-[#FFFDF8] font-semibold'
                          : 'text-[#62615D] hover:bg-[#F8F6F0]'
                        }`
                      }
                    >
                      <Icon className="text-sm" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-[#DDD9CF] space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setSathiOpen(true);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-[#111111] bg-[#F8F6F0] hover:bg-[#EAE6DB] border border-[#DDD9CF] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className="relative flex items-center justify-center">
                      <RiSparklingFill className="text-[#3348A8] text-sm animate-pulse" />
                      <span className="animate-ping absolute inline-flex h-1.5 w-1.5 rounded-full bg-[#3348A8] opacity-75" />
                    </div>
                    <span>Karmayogi Sathi AI</span>
                  </div>
                  <span className="text-[10px] text-[#3348A8] font-bold">Ask &rarr;</span>
                </button>

                <NavLink
                  to="/onboarding"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-[#62615D] hover:bg-[#F8F6F0]"
                >
                  <span>e-HRMS Onboarding</span>
                </NavLink>
              </div>
            </div>

            <div className="pt-4 border-t border-[#DDD9CF] flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-[#111111]">{user?.name || 'Officer'}</div>
                <div className="text-[10px] text-[#8A8882]">{user?.position?.title || 'MoSPI'}</div>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="p-2 text-[#A54C45] hover:bg-[#F8E9E7] rounded-md transition-colors"
                title="Sign Out"
              >
                <FiLogOut className="text-sm" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN VIEWPORT CONTAINER */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1">
        <Outlet />
      </main>

      {/* KARMAYOGI SATHI COPILOT COMPONENT */}
      <EmployeeCompanionWidget isOpen={sathiOpen} setIsOpen={setSathiOpen} />
    </div>
  );
}
