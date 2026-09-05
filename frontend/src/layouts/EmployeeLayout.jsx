import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  FiHome,
  FiAward,
  FiFileText,
  FiAlertCircle,
  FiBookOpen,
  FiTrendingUp,
  FiZap,
  FiBell,
  FiLogOut,
  FiMenu,
  FiX,
  FiShield,
  FiUser,
  FiChevronRight,
} from 'react-icons/fi';
import { RiGovernmentLine } from 'react-icons/ri';
import { useAuth } from '../context/AuthContext';
import GlassBadge from '../components/common/GlassBadge';
import EmployeeCompanionWidget from '../components/companion/EmployeeCompanionWidget';

export default function EmployeeLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login/employee');
  };

  const navItems = [
    {
      label: 'Dashboard',
      path: '/employee/dashboard',
      icon: FiHome,
      description: 'Competency overview & KPIs',
    },
    {
      label: 'My Competencies',
      path: '/employee/competencies',
      icon: FiAward,
      description: 'Role requirements & levels',
    },
    {
      label: 'Assessments',
      path: '/employee/assessments',
      icon: FiFileText,
      description: 'Active role assessments',
    },
    {
      label: 'Skill Gaps',
      path: '/employee/skill-gaps',
      icon: FiAlertCircle,
      description: 'Priority gap analysis',
    },
    {
      label: 'Recommendations',
      path: '/employee/recommendations',
      icon: FiZap,
      description: 'AI-matched learning resources',
    },
    {
      label: 'Learning Hub',
      path: '/employee/learning',
      icon: FiBookOpen,
      description: 'Enrolled courses & progress',
    },
    {
      label: 'My Progress',
      path: '/employee/progress',
      icon: FiTrendingUp,
      description: 'Competency growth timeline',
    },
  ];

  // Derive initials for avatar
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
    <div className="min-h-screen ambient-canvas bg-canvas text-slate-800 flex flex-col antialiased relative selection:bg-blue-100 selection:text-blue-900">
      {/* Background Ambient Glow Elements */}
      <div className="ambient-glow-1" />
      <div className="ambient-glow-2" />
      <div className="ambient-glow-3" />

      {/* TOP HEADER */}
      <header className="sticky top-0 z-40 bg-white/75 backdrop-blur-md border-b border-white/60 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Left: Brand + Portal Label */}
          <div className="flex items-center gap-3.5">
            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-white/60 border border-slate-200/60 focus:outline-none transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
            </button>

            <NavLink to="/employee/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20 flex-shrink-0">
                <RiGovernmentLine className="text-2xl" />
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-2">
                  <span className="text-base font-extrabold text-slate-900 tracking-tight leading-tight">
                    Karmayogi AI
                  </span>
                  <GlassBadge variant="primary" size="xs">
                    Officer Portal
                  </GlassBadge>
                </div>
                <span className="text-[11px] text-slate-500 font-medium block">
                  Capacity Building & Competency Intelligence
                </span>
              </div>
            </NavLink>
          </div>

          {/* Right: Officer Profile Details & Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Notification Bell */}
            <button
              type="button"
              className="relative p-2 rounded-xl bg-white/60 hover:bg-white/90 border border-white/80 text-slate-600 hover:text-slate-900 transition-colors shadow-xs"
              title="Notifications"
            >
              <FiBell className="text-lg" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
            </button>

            {/* Officer Profile Badge */}
            <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-slate-200/70">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 border border-blue-200/80 text-blue-800 font-bold text-xs flex items-center justify-center shadow-xs flex-shrink-0">
                {getInitials(user?.name)}
              </div>
              
              <div className="hidden md:block text-left">
                <div className="text-xs font-bold text-slate-900 leading-tight">
                  {user?.name || 'Rahul Sharma'}
                </div>
                <div className="text-[11px] text-slate-500 font-medium leading-tight truncate max-w-[180px]">
                  {user?.position?.title || 'Statistical Officer'} &bull; {user?.department?.shortName || 'MoSPI'}
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <button
              type="button"
              onClick={handleLogout}
              className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50/60 border border-transparent hover:border-rose-100 transition-all text-sm flex items-center gap-1.5"
              title="Sign Out"
            >
              <FiLogOut className="text-base" />
              <span className="hidden lg:inline text-xs font-semibold">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* APP BODY CONTAINER (Sidebar + Main Content) */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1 flex gap-6 relative z-10">
        
        {/* DESKTOP SIDEBAR NAVIGATION */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <nav className="sticky top-24 bg-white/70 backdrop-blur-md border border-white/65 shadow-glass rounded-2xl p-3 space-y-1">
            
            <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Competency Navigation
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-500/20'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3">
                        <Icon className={`text-base ${isActive ? 'text-white' : 'text-slate-500'}`} />
                        <span>{item.label}</span>
                      </div>
                      {isActive && <FiChevronRight className="text-xs text-white/80" />}
                    </>
                  )}
                </NavLink>
              );
            })}

            {/* Ministry / Capacity Building Note */}
            <div className="mt-4 pt-3 border-t border-slate-200/60 px-3 py-2 text-[11px] text-slate-500 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                <FiShield className="text-blue-600 text-xs flex-shrink-0" />
                <span>Mission Karmayogi</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                Role-based continuous capacity building framework.
              </p>
            </div>
          </nav>
        </aside>

        {/* MOBILE SLIDEOUT DRAWER */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Drawer Panel */}
            <div className="relative w-4/5 max-w-xs bg-white/90 backdrop-blur-lg border-r border-white/80 shadow-glass-lg p-5 flex flex-col justify-between z-10">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-xs">
                      <RiGovernmentLine className="text-lg" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-slate-900 block">Karmayogi AI</span>
                      <span className="text-[10px] text-slate-500 block">Employee Portal</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
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
                          `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                            isActive
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'text-slate-700 hover:bg-slate-100/70'
                          }`
                        }
                      >
                        <Icon className="text-base" />
                        <span>{item.label}</span>
                      </NavLink>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Officer Info */}
              <div className="pt-4 border-t border-slate-200/60 space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center">
                    {getInitials(user?.name)}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-900 leading-tight">{user?.name}</p>
                    <p className="text-[10px] text-slate-500 leading-tight">{user?.email}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full py-2 px-3 rounded-xl bg-rose-50 text-rose-700 font-semibold text-xs border border-rose-200 flex items-center justify-center gap-2"
                >
                  <FiLogOut /> Sign Out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MAIN CONTENT OUTLET */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>

      {/* KARMAYOGI SATHI: AI EMPLOYEE COMPANION WIDGET */}
      <EmployeeCompanionWidget />
    </div>
  );
}
