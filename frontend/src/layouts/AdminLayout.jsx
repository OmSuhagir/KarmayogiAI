import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  FiHome,
  FiUsers,
  FiBriefcase,
  FiUserCheck,
  FiAward,
  FiFileText,
  FiHelpCircle,
  FiBookOpen,
  FiZap,
  FiTrendingUp,
  FiLogOut,
  FiMenu,
  FiX,
  FiShield,
  FiChevronRight,
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
        { label: 'Governance Overview', path: '/admin/dashboard', icon: FiHome },
        { label: 'Workforce Analytics', path: '/admin/analytics', icon: FiTrendingUp },
        { label: 'Officer Profiles', path: '/admin/employees', icon: FiUsers },
        { label: 'e-HRMS Onboarding', path: '/onboarding', icon: FiUserCheck },
      ],
    },
    {
      heading: 'Competency Frameworks',
      items: [
        { label: 'Ministries & Depts', path: '/admin/departments', icon: RiBuildingLine },
        { label: 'Designations', path: '/admin/positions', icon: FiBriefcase },
        { label: 'Roles & Mappings', path: '/admin/roles', icon: FiUserCheck },
        { label: 'Competency Rubrics', path: '/admin/competencies', icon: FiAward },
      ],
    },
    {
      heading: 'Assessments & Learning',
      items: [
        { label: 'Role Assessments', path: '/admin/assessments', icon: FiFileText },
        { label: 'Question Bank', path: '/admin/questions', icon: FiHelpCircle },
        { label: 'AI Question Studio', path: '/admin/ai-question-review', icon: FiZap },
        { label: 'Learning Resources', path: '/admin/learning', icon: FiBookOpen },
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
    <div className="min-h-screen bg-[#F4F1E9] text-[#171717] flex flex-col antialiased selection:bg-[#E9EDFF] selection:text-[#3348A8]">
      {/* ADMIN TOP HEADER */}
      <header className="sticky top-0 z-40 bg-[#FFFDF8]/95 backdrop-blur-md border-b border-[#DDD9CF] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand + Portal Label */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-[#62615D] hover:text-[#111111] hover:bg-[#F8F6F0] border border-[#DDD9CF] transition-colors"
              aria-label="Toggle admin navigation"
            >
              {mobileMenuOpen ? <FiX className="text-lg" /> : <FiMenu className="text-lg" />}
            </button>

            <NavLink to="/admin/dashboard" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#111111] text-[#FFFDF8] flex items-center justify-center font-bold flex-shrink-0">
                <RiGovernmentLine className="text-lg" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#111111] tracking-tight">
                    Karmayogi AI
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#111111] text-[#FFFDF8]">
                    Governance
                  </span>
                </div>
                <span className="text-[11px] text-[#8A8882] hidden sm:block">
                  Workforce Capability & MDO Supervision &middot; MoSPI
                </span>
              </div>
            </NavLink>
          </div>

          {/* Right: Administrator Profile & Actions */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 pl-2 border-l border-[#DDD9CF]">
              <div className="w-8 h-8 rounded-lg bg-[#F8F6F0] border border-[#DDD9CF] text-[#111111] font-bold text-xs flex items-center justify-center flex-shrink-0">
                {getInitials(user?.name)}
              </div>
              <div className="hidden md:block text-left">
                <div className="text-xs font-semibold text-[#111111] leading-tight">
                  {user?.name || 'Dr. Arvind Mehta'}
                </div>
                <div className="text-[10px] text-[#8A8882] leading-tight truncate max-w-[170px]">
                  {user?.designation || 'Principal Director'} &bull; {user?.department?.shortName || 'MoSPI'}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="p-2 rounded-lg text-[#8A8882] hover:text-[#A54C45] hover:bg-[#F8E9E7] transition-colors text-xs flex items-center gap-1"
              title="Sign Out as Administrator"
            >
              <FiLogOut className="text-sm" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* APP BODY CONTAINER */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1 flex gap-6">
        
        {/* DESKTOP ADMIN SIDEBAR */}
        <aside className="hidden lg:block w-60 flex-shrink-0">
          <nav className="sticky top-24 bg-[#FFFDF8] border border-[#DDD9CF] shadow-xs rounded-xl p-3 space-y-4">
            {navSections.map((sec, secIdx) => (
              <div key={secIdx} className="space-y-1">
                <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#8A8882]">
                  {sec.heading}
                </div>

                {sec.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          isActive
                            ? 'bg-[#111111] text-[#FFFDF8] font-semibold'
                            : 'text-[#62615D] hover:text-[#111111] hover:bg-[#F8F6F0]'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <div className="flex items-center gap-2 min-w-0">
                            <Icon className={`text-sm flex-shrink-0 ${isActive ? 'text-[#FFFDF8]' : 'text-[#8A8882]'}`} />
                            <span className="truncate">{item.label}</span>
                          </div>
                          {isActive && <FiChevronRight className="text-xs text-[#FFFDF8]/80 flex-shrink-0" />}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            ))}
          </nav>
        </aside>

        {/* MOBILE SLIDEOUT DRAWER */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div
              className="fixed inset-0 bg-black/30 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
            />

            <div className="relative w-72 bg-[#FFFDF8] border-r border-[#DDD9CF] shadow-xl p-5 flex flex-col justify-between z-10 overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#DDD9CF]">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded bg-[#111111] text-[#FFFDF8] flex items-center justify-center font-bold">
                      <RiGovernmentLine className="text-sm" />
                    </div>
                    <span className="text-sm font-bold text-[#111111]">Karmayogi AI</span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 rounded text-[#8A8882] hover:text-[#111111]"
                  >
                    <FiX className="text-lg" />
                  </button>
                </div>

                <div className="space-y-4">
                  {navSections.map((sec, secIdx) => (
                    <div key={secIdx} className="space-y-1">
                      <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-[#8A8882]">
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
                              `flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                isActive
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
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#DDD9CF] flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-[#111111]">{user?.name || 'Administrator'}</div>
                  <div className="text-[10px] text-[#8A8882]">Workforce Supervision</div>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-2 text-[#A54C45] hover:bg-[#F8E9E7] rounded transition-colors"
                >
                  <FiLogOut className="text-sm" />
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
