import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  FiHome,
  FiUsers,
  FiGrid,
  FiBriefcase,
  FiUserCheck,
  FiAward,
  FiFileText,
  FiHelpCircle,
  FiBookOpen,
  FiZap,
  FiTrendingUp,
  FiBell,
  FiLogOut,
  FiMenu,
  FiX,
  FiShield,
  FiChevronRight,
  FiActivity,
} from 'react-icons/fi';
import { RiGovernmentLine, RiBuildingLine } from 'react-icons/ri';
import { useAuth } from '../context/AuthContext';
import GlassBadge from '../components/common/GlassBadge';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login/admin');
  };

  const navSections = [
    {
      heading: 'Workforce Intelligence',
      items: [
        {
          label: 'Dashboard',
          path: '/admin/dashboard',
          icon: FiHome,
          description: 'Workforce KPIs & overview',
        },
        {
          label: 'Officer Onboarding',
          path: '/onboarding',
          icon: FiUserCheck,
          description: 'e-HRMS & past service ingestion',
        },
        {
          label: 'Workforce Analytics',
          path: '/admin/analytics',
          icon: FiTrendingUp,
          description: 'Department & gap trends',
        },
        {
          label: 'Employees',
          path: '/admin/employees',
          icon: FiUsers,
          description: 'Officer profiles & readiness',
        },
      ],
    },
    {
      heading: 'Master Frameworks',
      items: [
        {
          label: 'Departments',
          path: '/admin/departments',
          icon: RiBuildingLine,
          description: 'Ministries & departments',
        },
        {
          label: 'Positions',
          path: '/admin/positions',
          icon: FiBriefcase,
          description: 'Official designations',
        },
        {
          label: 'Roles',
          path: '/admin/roles',
          icon: FiUserCheck,
          description: 'Role competency mappings',
        },
        {
          label: 'Competencies',
          path: '/admin/competencies',
          icon: FiAward,
          description: 'Rubric & proficiency levels',
        },
      ],
    },
    {
      heading: 'Capacity & Assessments',
      items: [
        {
          label: 'Assessments',
          path: '/admin/assessments',
          icon: FiFileText,
          description: 'Active role evaluations',
        },
        {
          label: 'Question Bank',
          path: '/admin/questions',
          icon: FiHelpCircle,
          description: 'Approved assessment items',
        },
        {
          label: 'AI Question Review',
          path: '/admin/ai-question-review',
          icon: FiZap,
          description: 'Gemini AI question studio',
        },
        {
          label: 'Learning Resources',
          path: '/admin/learning',
          icon: FiBookOpen,
          description: 'iGOT Karmayogi catalogue',
        },
      ],
    },
  ];

  const getInitials = (name) => {
    if (!name) return 'AD';
    return name
      .split(' ')
      .filter((n) => !n.startsWith('Dr.') && !n.startsWith('Mr.') && !n.startsWith('Ms.'))
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase() || 'AD';
  };

  return (
    <div className="min-h-screen ambient-canvas bg-canvas text-slate-800 flex flex-col antialiased relative selection:bg-indigo-100 selection:text-indigo-900">
      {/* Ambient background glow elements */}
      <div className="ambient-glow-1" />
      <div className="ambient-glow-2" />
      <div className="ambient-glow-3" />

      {/* ADMIN TOP HEADER */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-white/70 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Left: Brand + Admin Badge */}
          <div className="flex items-center gap-3.5">
            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-white/60 border border-slate-200/60 focus:outline-none transition-colors"
              aria-label="Toggle admin navigation"
            >
              {mobileMenuOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
            </button>

            <NavLink to="/admin/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-700 to-slate-900 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 flex-shrink-0">
                <RiGovernmentLine className="text-2xl" />
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-2">
                  <span className="text-base font-extrabold text-slate-900 tracking-tight leading-tight">
                    Karmayogi AI
                  </span>
                  <GlassBadge variant="purple" size="xs">
                    Administrator Portal
                  </GlassBadge>
                </div>
                <span className="text-[11px] text-slate-500 font-medium block">
                  Workforce Competency Intelligence & Oversight
                </span>
              </div>
            </NavLink>
          </div>

          {/* Right: Administrator Profile & Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Notification Icon */}
            <button
              type="button"
              className="relative p-2 rounded-xl bg-white/60 hover:bg-white/90 border border-white/80 text-slate-600 hover:text-slate-900 transition-colors shadow-xs"
              title="Administrator Alerts"
            >
              <FiBell className="text-lg" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white" />
            </button>

            {/* Admin Profile Badge */}
            <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-slate-200/70">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 border border-indigo-200/80 text-indigo-900 font-bold text-xs flex items-center justify-center shadow-xs flex-shrink-0">
                {getInitials(user?.name)}
              </div>

              <div className="hidden md:block text-left">
                <div className="text-xs font-bold text-slate-900 leading-tight">
                  {user?.name || 'Dr. Arvind Mehta'}
                </div>
                <div className="text-[11px] text-slate-500 font-medium leading-tight truncate max-w-[200px]">
                  {user?.designation || 'Principal Director'} &bull; {user?.department?.shortName || 'MoSPI'}
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <button
              type="button"
              onClick={handleLogout}
              className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50/60 border border-transparent hover:border-rose-100 transition-all text-sm flex items-center gap-1.5"
              title="Sign Out as Administrator"
            >
              <FiLogOut className="text-base" />
              <span className="hidden lg:inline text-xs font-semibold">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* APP BODY CONTAINER */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1 flex gap-6 relative z-10">
        
        {/* DESKTOP ADMIN SIDEBAR */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <nav className="sticky top-24 bg-white/75 backdrop-blur-md border border-white/70 shadow-glass rounded-2xl p-3 space-y-4 max-h-[calc(100vh-7rem)] overflow-y-auto">
            
            {navSections.map((sec, secIdx) => (
              <div key={secIdx} className="space-y-1">
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {sec.heading}
                </div>

                {sec.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 ${
                          isActive
                            ? 'bg-gradient-to-r from-indigo-700 to-slate-900 text-white shadow-sm shadow-indigo-500/20'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Icon className={`text-sm flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                            <span className="truncate">{item.label}</span>
                          </div>
                          {isActive && <FiChevronRight className="text-xs text-white/80 flex-shrink-0" />}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            ))}

            {/* Ministry Capacity Building Framework Note */}
            <div className="pt-3 border-t border-slate-200/60 px-3 py-2 text-[11px] text-slate-500 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-indigo-900">
                <FiShield className="text-indigo-600 text-xs flex-shrink-0" />
                <span>Mission Karmayogi</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                Workforce capacity intelligence and AI competency supervision.
              </p>
            </div>
          </nav>
        </aside>

        {/* MOBILE SLIDEOUT DRAWER */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
            />

            <div className="relative w-4/5 max-w-xs bg-white/95 backdrop-blur-lg border-r border-white/80 shadow-glass-lg p-5 flex flex-col justify-between z-10 overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-700 to-slate-900 flex items-center justify-center text-white shadow-xs">
                      <RiGovernmentLine className="text-lg" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-slate-900 block">Karmayogi AI</span>
                      <span className="text-[10px] text-indigo-700 font-semibold block">Admin Portal</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
                  >
                    <FiX className="text-lg" />
                  </button>
                </div>

                <div className="space-y-4">
                  {navSections.map((sec, secIdx) => (
                    <div key={secIdx} className="space-y-1">
                      <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {sec.heading}
                      </div>
                      {sec.items.map((item) => {
                        const Icon = item.icon;
                        return (
                          <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className={({ isActive }) =>
                              `flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                                isActive
                                  ? 'bg-indigo-700 text-white shadow-xs'
                                  : 'text-slate-700 hover:bg-slate-100/70'
                              }`
                            }
                          >
                            <Icon className="text-sm" />
                            <span>{item.label}</span>
                          </NavLink>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile Admin Footer */}
              <div className="pt-4 border-t border-slate-200/60 space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-900 font-bold text-xs flex items-center justify-center">
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
                  <FiLogOut /> Sign Out as Admin
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
    </div>
  );
}
