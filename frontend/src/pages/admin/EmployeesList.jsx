import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiUsers,
  FiSearch,
  FiArrowRight,
  FiRefreshCw,
  FiX,
  FiUserPlus,
  FiDatabase,
} from 'react-icons/fi';
import { getEmployeesList, getEmployeeDetail } from '../../services/adminService';
import GlassCard from '../../components/common/GlassCard';
import GlassButton from '../../components/common/GlassButton';
import GlassBadge from '../../components/common/GlassBadge';

export default function EmployeesList() {
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReadiness, setSelectedReadiness] = useState('all');

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

  const filteredEmployees = employees.filter((emp) => {
    const matchSearch =
      emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchReadiness =
      selectedReadiness === 'all' ||
      (selectedReadiness === 'high' && (emp.readinessPercent || 0) >= 80) ||
      (selectedReadiness === 'moderate' &&
        (emp.readinessPercent || 0) >= 50 &&
        (emp.readinessPercent || 0) < 80) ||
      (selectedReadiness === 'low' && (emp.readinessPercent || 0) < 50);

    return matchSearch && matchReadiness;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="rounded-2xl bg-[#FFFDF8] border border-[#DDD9CF] p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-[#F8F6F0] text-[#62615D] border border-[#DDD9CF]">
              {employees.length} Enrolled Officers
            </span>
            <span className="text-[11px] text-[#8A8882]">Workforce Directory &middot; MoSPI</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#111111] tracking-tight mt-1.5">
            Officer Rosters & Role Readiness
          </h1>
          <p className="text-xs sm:text-sm text-[#62615D] mt-0.5">
            Individualized officer competency audits, assessment timelines, skill gap counts, and role readiness benchmarks.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link to="/onboarding">
            <GlassButton
              variant="primary"
              size="sm"
              icon={FiUserPlus}
            >
              Onboard Officer
            </GlassButton>
          </Link>

          <GlassButton
            variant="secondary"
            size="sm"
            icon={FiRefreshCw}
            loading={loading}
            onClick={fetchEmployees}
          >
            Refresh
          </GlassButton>
        </div>
      </div>

      {/* Toolbar */}
      <div className="rounded-xl bg-[#FFFDF8] border border-[#DDD9CF] p-3.5 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full md:w-80">
          <FiSearch className="absolute left-3 top-2.5 text-[#8A8882] text-xs" />
          <input
            type="text"
            placeholder="Search by officer name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#F8F6F0] border border-[#DDD9CF] text-xs text-[#111111] placeholder:text-[#8A8882] focus:outline-none focus:border-[#111111]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedReadiness}
            onChange={(e) => setSelectedReadiness(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-[#F8F6F0] border border-[#DDD9CF] text-xs text-[#111111] font-medium focus:outline-none"
          >
            <option value="all">All Readiness Levels</option>
            <option value="high">High Readiness (&ge; 80%)</option>
            <option value="moderate">Moderate Readiness (50-79%)</option>
            <option value="low">Needs Attention (&lt; 50%)</option>
          </select>
        </div>
      </div>

      {/* Officers List */}
      {loading ? (
        <div className="py-16 text-center text-xs text-[#8A8882] space-y-2">
          <FiRefreshCw className="animate-spin text-[#111111] text-xl mx-auto" />
          <p>Loading officer rosters from database...</p>
        </div>
      ) : filteredEmployees.length === 0 ? (
        <div className="rounded-xl bg-[#FFFDF8] border border-[#DDD9CF] p-8 text-center text-xs text-[#8A8882]">
          No officers match your search or filter criteria.
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredEmployees.map((emp) => (
            <div
              key={emp._id}
              className="rounded-xl bg-[#FFFDF8] border border-[#DDD9CF] p-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 hover:border-[#111111] transition-all shadow-xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-[#F8F6F0] border border-[#DDD9CF] text-[#111111] font-bold text-xs flex items-center justify-center flex-shrink-0">
                  {emp.name
                    ?.split(' ')
                    .map((n) => n[0])
                    .join('')
                    .substring(0, 2)
                    .toUpperCase()}
                </div>

                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xs sm:text-sm font-bold text-[#111111]">
                      {emp.name}
                    </h3>
                    <GlassBadge variant={emp.readinessPercent >= 75 ? 'success' : 'warning'} size="xs">
                      {emp.readinessPercent}% Readiness
                    </GlassBadge>
                    {emp.employeeId && (
                      <span className="text-[10px] font-mono text-[#62615D] bg-[#F8F6F0] px-1.5 py-0.5 rounded border border-[#DDD9CF]">
                        {emp.employeeId}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#62615D] truncate">
                    {emp.cadre ? `${emp.cadre} • ` : ''}{emp.email} &bull; {emp.positionId?.title || 'Statistical Officer'} &bull; {emp.departmentId?.shortName || 'MoSPI'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-end pt-2 lg:pt-0 border-t lg:border-t-0 border-[#DDD9CF]">
                <div className="text-left sm:text-right">
                  <div className="text-xs font-semibold text-[#111111]">
                    {emp.gapCount > 0 ? (
                      <span className="text-[#A8752E]">{emp.gapCount} Active Gaps</span>
                    ) : (
                      <span className="text-[#52745D]">All Targets Met</span>
                    )}
                  </div>
                  <span className="text-[10px] text-[#8A8882]">
                    Avg: L{emp.avgLevel || '3.0'} / L5.0
                  </span>
                </div>

                <GlassBadge variant={emp.lastAssessmentDate ? 'primary' : 'neutral'} size="xs">
                  {emp.assessmentStatus}
                </GlassBadge>

                <GlassButton
                  variant="outline"
                  size="xs"
                  iconRight={FiArrowRight}
                  onClick={() => handleOpenDetail(emp._id)}
                >
                  View Profile
                </GlassButton>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* OFFICER DETAIL MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/35 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl max-h-[85vh] bg-[#FFFDF8] rounded-2xl border border-[#DDD9CF] p-6 shadow-xl space-y-5 overflow-y-auto">
            <div className="flex items-start justify-between border-b border-[#DDD9CF] pb-3">
              <div>
                <h2 className="text-base font-bold text-[#111111]">
                  {detailUser?.user?.name}
                </h2>
                <p className="text-xs text-[#62615D]">
                  {detailUser?.user?.positionId?.title || 'Statistical Officer'} &bull; {detailUser?.user?.departmentId?.name || 'MoSPI'}
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded text-[#8A8882] hover:text-[#111111]"
              >
                <FiX className="text-lg" />
              </button>
            </div>

            {detailLoading ? (
              <div className="py-12 text-center text-xs text-[#8A8882]">
                Retrieving detailed officer audit...
              </div>
            ) : (
              <div className="space-y-4 text-left">
                {/* Competency Audit */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                    Competency Breakdown & Gap Analysis
                  </h4>
                  <div className="space-y-1.5">
                    {(detailUser?.competencies || []).map((c, idx) => {
                      const comp = c.competency || {};
                      const isMet = (c.currentLevel || 1) >= (c.expectedLevel || 3);
                      return (
                        <div
                          key={idx}
                          className="p-3 rounded-lg bg-[#F8F6F0] border border-[#DDD9CF] flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-semibold text-[#111111] block">{comp.name || 'Competency'}</span>
                            <span className="text-[10px] text-[#8A8882]">{comp.category || 'Functional'}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#111111]">L{c.currentLevel} / L{c.expectedLevel}</span>
                            <GlassBadge variant={isMet ? 'success' : 'warning'} size="xs">
                              {isMet ? 'Satisfied' : `Gap: ${c.gap}`}
                            </GlassBadge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Service History */}
                {detailUser?.user?.serviceHistory && detailUser.user.serviceHistory.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-[#DDD9CF]">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                      e-HRMS Service History
                    </h4>
                    <div className="space-y-1.5">
                      {detailUser.user.serviceHistory.map((post, pIdx) => (
                        <div key={pIdx} className="p-2.5 rounded-lg bg-[#F8F6F0] border border-[#DDD9CF] text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-[#111111]">{post.designation}</span>
                            <span className="text-[10px] text-[#8A8882]">{post.duration}</span>
                          </div>
                          <p className="text-[11px] text-[#3348A8]">{post.organization}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="pt-2 border-t border-[#DDD9CF] flex justify-end">
              <GlassButton
                variant="secondary"
                size="sm"
                onClick={() => setModalOpen(false)}
              >
                Close
              </GlassButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
