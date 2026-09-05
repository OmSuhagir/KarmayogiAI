import React, { useEffect, useState } from 'react';
import {
  FiUsers,
  FiSearch,
  FiFilter,
  FiArrowRight,
  FiCheckCircle,
  FiAlertCircle,
  FiAward,
  FiBookOpen,
  FiClock,
  FiRefreshCw,
  FiX,
  FiTrendingUp,
} from 'react-icons/fi';
import { RiBuildingLine } from 'react-icons/ri';
import { getEmployeesList, getEmployeeDetail } from '../../services/adminService';
import GlassCard from '../../components/common/GlassCard';
import GlassButton from '../../components/common/GlassButton';
import GlassBadge from '../../components/common/GlassBadge';
import ProgressBar from '../../components/common/ProgressBar';

export default function EmployeesList() {
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedReadiness, setSelectedReadiness] = useState('all');

  // Detail Modal State
  const [detailUser, setDetailUser] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await getEmployeesList();
      const list = res?.data || res;
      if (Array.isArray(list)) {
        setEmployees(list);
      }
    } catch (err) {
      console.warn('Failed to load employees:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleOpenDetail = async (userId) => {
    try {
      setDetailLoading(true);
      setModalOpen(true);
      const res = await getEmployeeDetail(userId);
      const detail = res?.data || res;
      if (detail) {
        setDetailUser(detail);
      }
    } catch (err) {
      console.warn('Failed to load officer details:', err);
    } finally {
      setDetailLoading(false);
    }
  };

  // Filter logic
  const filteredEmployees = employees.filter((emp) => {
    const matchSearch =
      emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchDept =
      selectedDept === 'all' ||
      emp.departmentId?._id === selectedDept ||
      emp.departmentId?.name === selectedDept;

    const matchReadiness =
      selectedReadiness === 'all' ||
      (selectedReadiness === 'high' && (emp.readinessPercent || 0) >= 80) ||
      (selectedReadiness === 'moderate' &&
        (emp.readinessPercent || 0) >= 50 &&
        (emp.readinessPercent || 0) < 80) ||
      (selectedReadiness === 'low' && (emp.readinessPercent || 0) < 50);

    return matchSearch && matchDept && matchReadiness;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <GlassCard variant="solid" className="p-6 sm:p-8 border-white/80 space-y-2 shadow-glass">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <GlassBadge variant="purple" size="xs">
                Workforce Directory
              </GlassBadge>
              <span className="text-xs text-slate-400 font-medium">
                {employees.length} Enrolled Officers
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Officer Rosters & Role Readiness
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl font-normal leading-relaxed">
              Track officer competency profiles, assessment status, active skill gaps, and role readiness against government benchmarks.
            </p>
          </div>

          <GlassButton
            variant="glass"
            size="md"
            icon={FiRefreshCw}
            loading={loading}
            onClick={fetchEmployees}
          >
            Refresh Roster
          </GlassButton>
        </div>
      </GlassCard>

      {/* Search & Filter Toolbar */}
      <GlassCard className="p-4 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <FiSearch className="absolute left-3.5 top-3 text-slate-400 text-sm" />
          <input
            type="text"
            placeholder="Search by officer name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/70 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-medium"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 w-full md:w-auto self-end">
          <select
            value={selectedReadiness}
            onChange={(e) => setSelectedReadiness(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white/70 border border-slate-200 text-xs text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="all">All Readiness Levels</option>
            <option value="high">High Readiness (&ge; 80%)</option>
            <option value="moderate">Moderate Readiness (50-79%)</option>
            <option value="low">Needs Attention (&lt; 50%)</option>
          </select>
        </div>
      </GlassCard>

      {/* Officers List Table */}
      {loading ? (
        <div className="py-16 text-center text-xs text-slate-400 space-y-3">
          <FiRefreshCw className="animate-spin text-indigo-600 text-2xl mx-auto" />
          <p>Loading officer rosters from database...</p>
        </div>
      ) : filteredEmployees.length === 0 ? (
        <GlassCard className="p-8 text-center text-xs text-slate-500">
          No officers match your search or filter criteria.
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {filteredEmployees.map((emp) => (
            <GlassCard
              key={emp._id}
              className="p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 hover:bg-white/90 transition-all border-white/80"
            >
              {/* Officer Main Info */}
              <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 border border-indigo-200 text-indigo-900 font-bold text-sm flex items-center justify-center flex-shrink-0 shadow-xs">
                  {emp.name
                    ?.split(' ')
                    .map((n) => n[0])
                    .join('')
                    .substring(0, 2)
                    .toUpperCase()}
                </div>

                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {emp.name}
                    </h3>
                    <GlassBadge variant={emp.readinessPercent >= 75 ? 'success' : 'high'} size="xs" dot>
                      {emp.readinessPercent}% Role Readiness
                    </GlassBadge>
                  </div>

                  <p className="text-xs text-slate-500 font-medium truncate">
                    {emp.email} &bull; {emp.positionId?.title || 'Statistical Officer'} &bull; {emp.departmentId?.shortName || 'MoSPI'}
                  </p>
                </div>
              </div>

              {/* Status Pills & Action */}
              <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto justify-between lg:justify-end pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-200/50">
                <div className="text-left sm:text-right">
                  <div className="text-xs font-bold text-slate-900">
                    {emp.gapCount > 0 ? (
                      <span className="text-amber-700 font-semibold">{emp.gapCount} Active Gaps</span>
                    ) : (
                      <span className="text-emerald-700 font-semibold">Target Satisfied</span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 block">
                    Avg Level: L{emp.avgLevel || '3.0'} / L5.0
                  </span>
                </div>

                <div className="text-left sm:text-right">
                  <GlassBadge variant={emp.lastAssessmentDate ? 'primary' : 'default'} size="xs">
                    {emp.assessmentStatus}
                  </GlassBadge>
                </div>

                <GlassButton
                  variant="outline"
                  size="sm"
                  iconRight={FiArrowRight}
                  onClick={() => handleOpenDetail(emp._id)}
                >
                  View Profile
                </GlassButton>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* OFFICER DETAIL MODAL / DRAWER */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/25 backdrop-blur-xs">
          <div className="relative w-full max-w-3xl max-h-[90vh] bg-white/95 backdrop-blur-md rounded-2xl border border-white/80 p-6 sm:p-8 shadow-glass-lg space-y-6 overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-200/60 pb-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-900 font-bold text-base flex items-center justify-center shadow-xs">
                  {detailUser?.user?.name
                    ?.split(' ')
                    .map((n) => n[0])
                    .join('')
                    .substring(0, 2)
                    .toUpperCase()}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {detailUser?.user?.name}
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    {detailUser?.user?.positionId?.title || 'Statistical Officer'} &bull; {detailUser?.user?.departmentId?.name || 'MoSPI'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <FiX className="text-xl" />
              </button>
            </div>

            {detailLoading ? (
              <div className="py-12 text-center text-xs text-slate-400 space-y-2">
                <FiRefreshCw className="animate-spin text-indigo-600 text-xl mx-auto" />
                <p>Retrieving detailed officer audit...</p>
              </div>
            ) : (
              <div className="space-y-6 text-left">
                
                {/* Competency Audit Table */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Competency Breakdown & Gap Analysis
                  </h4>
                  <div className="space-y-2">
                    {(detailUser?.competencies || []).map((c, idx) => {
                      const comp = c.competency || {};
                      const isMet = (c.currentLevel || 1) >= (c.expectedLevel || 3);
                      return (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between gap-3 text-xs"
                        >
                          <div>
                            <span className="font-bold text-slate-900 block">{comp.name || 'Competency'}</span>
                            <span className="text-[11px] text-slate-500">{comp.category || 'Functional'}</span>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <span className="font-bold text-slate-800">L{c.currentLevel}</span>
                              <span className="text-slate-400"> / L{c.expectedLevel} Exp</span>
                            </div>
                            <GlassBadge variant={isMet ? 'success' : 'high'} size="xs">
                              {isMet ? 'Satisfied' : `Gap: ${c.gap}`}
                            </GlassBadge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Skill Gaps & Reassessment History */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/70 space-y-2">
                    <span className="text-xs font-bold text-amber-900 block">Open Skill Gaps</span>
                    <p className="text-2xl font-extrabold text-amber-900">
                      {detailUser?.skillGaps?.filter((g) => g.status === 'open').length || 0}
                    </p>
                    <span className="text-[11px] text-amber-700 block">
                      Targeted for continuous capacity building
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200/70 space-y-2">
                    <span className="text-xs font-bold text-indigo-900 block">Evaluations Logged</span>
                    <p className="text-2xl font-extrabold text-indigo-900">
                      {detailUser?.history?.length || 0}
                    </p>
                    <span className="text-[11px] text-indigo-700 block">
                      Historical competency assessment records
                    </span>
                  </div>
                </div>

              </div>
            )}

            <div className="pt-2 border-t border-slate-200/60 flex justify-end">
              <GlassButton
                variant="glass"
                size="sm"
                onClick={() => setModalOpen(false)}
              >
                Close Profile
              </GlassButton>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
