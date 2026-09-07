import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiAlertCircle,
  FiCheckCircle,
  FiArrowRight,
  FiZap,
  FiRefreshCw,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { getEmployeeCompetencyAudit } from '../../services/employeeService';
import GlassCard from '../../components/common/GlassCard';
import GlassButton from '../../components/common/GlassButton';
import GlassBadge from '../../components/common/GlassBadge';
import ProficiencyScale from '../../components/common/ProficiencyScale';

export default function SkillGaps() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [competencies, setCompetencies] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'critical' | 'high' | 'medium' | 'met'

  useEffect(() => {
    async function loadGaps() {
      if (!user?._id) return;
      try {
        setLoading(true);
        const data = await getEmployeeCompetencyAudit(user._id);
        if (data?.competencies) {
          setCompetencies(data.competencies);
        }
      } catch (e) {
        console.warn('Failed to load skill gaps:', e);
      } finally {
        setLoading(false);
      }
    }
    loadGaps();
  }, [user?._id]);

  const totalGaps = competencies.filter((c) => (c.gap || 0) > 0).length;
  const criticalCount = competencies.filter((c) => (c.gap || 0) >= 3).length;
  const highCount = competencies.filter((c) => (c.gap || 0) === 2).length;
  const mediumCount = competencies.filter((c) => (c.gap || 0) === 1).length;
  const metCount = competencies.filter((c) => (c.gap || 0) <= 0).length;

  const filteredItems = competencies.filter((item) => {
    const gap = item.gap || 0;
    if (activeFilter === 'all') return true;
    if (activeFilter === 'critical') return gap >= 3;
    if (activeFilter === 'high') return gap === 2;
    if (activeFilter === 'medium') return gap === 1;
    if (activeFilter === 'met') return gap <= 0;
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="rounded-2xl bg-[#FFFDF8] border border-[#DDD9CF] p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-[#F8F6F0] text-[#62615D] border border-[#DDD9CF]">
              {totalGaps} Identified Gaps
            </span>
            <span className="text-[11px] text-[#8A8882]">Prioritized for Capacity Building</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#111111] tracking-tight">
            Capability Gaps
          </h1>
          <p className="text-xs sm:text-sm text-[#62615D]">
            Delta between your current evaluated proficiency and the benchmark levels required for your MoSPI cadre.
          </p>
        </div>

        <GlassButton
          variant="primary"
          size="sm"
          iconRight={FiArrowRight}
          onClick={() => navigate('/employee/recommendations')}
        >
          View Recommended Learning
        </GlassButton>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-[#FFFDF8] border border-[#DDD9CF] space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8882]">Total Gaps</span>
          <div className="text-2xl font-bold text-[#111111]">{totalGaps}</div>
          <span className="text-[11px] text-[#62615D]">Requires progression</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#FFFDF8] border border-[#DDD9CF] space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#A54C45]">Critical (+3 Lvls)</span>
          <div className="text-2xl font-bold text-[#A54C45]">{criticalCount}</div>
          <span className="text-[11px] text-[#62615D]">High urgency</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#FFFDF8] border border-[#DDD9CF] space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#A8752E]">High Priority (+2)</span>
          <div className="text-2xl font-bold text-[#A8752E]">{highCount}</div>
          <span className="text-[11px] text-[#62615D]">Target this quarter</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#FFFDF8] border border-[#DDD9CF] space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#52745D]">Benchmarks Met</span>
          <div className="text-2xl font-bold text-[#52745D]">{metCount}</div>
          <span className="text-[11px] text-[#62615D]">Certified proficient</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            activeFilter === 'all'
              ? 'bg-[#111111] text-[#FFFDF8] font-semibold'
              : 'bg-[#FFFDF8] text-[#62615D] hover:text-[#111111] border border-[#DDD9CF]'
          }`}
        >
          All ({competencies.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('critical')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            activeFilter === 'critical'
              ? 'bg-[#111111] text-[#FFFDF8] font-semibold'
              : 'bg-[#FFFDF8] text-[#62615D] hover:text-[#111111] border border-[#DDD9CF]'
          }`}
        >
          Critical ({criticalCount})
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('high')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            activeFilter === 'high'
              ? 'bg-[#111111] text-[#FFFDF8] font-semibold'
              : 'bg-[#FFFDF8] text-[#62615D] hover:text-[#111111] border border-[#DDD9CF]'
          }`}
        >
          High Priority ({highCount})
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('medium')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            activeFilter === 'medium'
              ? 'bg-[#111111] text-[#FFFDF8] font-semibold'
              : 'bg-[#FFFDF8] text-[#62615D] hover:text-[#111111] border border-[#DDD9CF]'
          }`}
        >
          Medium ({mediumCount})
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('met')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            activeFilter === 'met'
              ? 'bg-[#111111] text-[#FFFDF8] font-semibold'
              : 'bg-[#FFFDF8] text-[#62615D] hover:text-[#111111] border border-[#DDD9CF]'
          }`}
        >
          Benchmarks Met ({metCount})
        </button>
      </div>

      {/* Gaps List / Grid */}
      {loading ? (
        <div className="py-16 text-center text-xs text-[#8A8882] space-y-2">
          <FiRefreshCw className="animate-spin text-[#111111] text-xl mx-auto" />
          <p>Analyzing skill gaps...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="py-12 text-center text-xs text-[#8A8882]">
          No competencies match the selected filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item, idx) => {
            const comp = item.competency || {};
            const current = item.currentLevel || 1;
            const expected = item.expectedLevel || 1;
            const gap = item.gap || 0;

            return (
              <div
                key={comp._id || idx}
                className="rounded-xl bg-[#FFFDF8] border border-[#DDD9CF] p-5 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#F8F6F0] text-[#62615D] border border-[#DDD9CF]">
                          {comp.category || 'Functional'}
                        </span>
                        {gap > 0 ? (
                          <GlassBadge variant="carmine" size="xs">
                            Gap: +{gap} {gap === 1 ? 'Level' : 'Levels'}
                          </GlassBadge>
                        ) : (
                          <GlassBadge variant="success" size="xs">
                            Requirement Met
                          </GlassBadge>
                        )}
                      </div>
                      <h2 className="text-sm font-bold text-[#111111] leading-snug">
                        {comp.name}
                      </h2>
                    </div>
                  </div>

                  <p className="text-xs text-[#62615D] line-clamp-2 leading-relaxed">
                    {comp.description}
                  </p>

                  <div className="pt-1">
                    <ProficiencyScale
                      currentLevel={current}
                      targetLevel={expected}
                      compact={false}
                      showLabels={true}
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-[#DDD9CF] flex items-center justify-between">
                  <span className="text-[11px] text-[#8A8882]">
                    Target: <strong>Level {expected}</strong>
                  </span>

                  {gap > 0 ? (
                    <GlassButton
                      variant="outline"
                      size="xs"
                      onClick={() => navigate('/employee/recommendations')}
                    >
                      Start Learning Path &rarr;
                    </GlassButton>
                  ) : (
                    <span className="text-xs text-[#52745D] font-medium flex items-center gap-1">
                      <FiCheckCircle className="text-xs" /> Benchmark Achieved
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
