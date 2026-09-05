import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiAlertCircle,
  FiCheckCircle,
  FiArrowRight,
  FiZap,
  FiRefreshCw,
  FiTrendingUp,
  FiShield,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { getEmployeeCompetencyAudit } from '../../services/employeeService';
import GlassCard from '../../components/common/GlassCard';
import GlassButton from '../../components/common/GlassButton';
import GlassBadge from '../../components/common/GlassBadge';

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

  const filteredItems = competencies.filter((item) => {
    const gap = item.gap || 0;
    if (activeFilter === 'all') return true;
    if (activeFilter === 'critical') return gap >= 3;
    if (activeFilter === 'high') return gap === 2;
    if (activeFilter === 'medium') return gap === 1;
    if (activeFilter === 'met') return gap <= 0;
    return true;
  });

  const totalGaps = competencies.filter((c) => (c.gap || 0) > 0).length;
  const criticalCount = competencies.filter((c) => (c.gap || 0) >= 3).length;
  const highCount = competencies.filter((c) => (c.gap || 0) === 2).length;
  const mediumCount = competencies.filter((c) => (c.gap || 0) === 1).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <GlassCard variant="solid" className="p-6 sm:p-8 border-white/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <GlassBadge variant="high" size="xs" dot>
                Gap Intelligence
              </GlassBadge>
              <span className="text-xs text-slate-400 font-medium">
                {totalGaps} Identified Gaps
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Skill Gap Analysis
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl font-normal leading-relaxed">
              Formula: <code className="bg-white/80 px-1.5 py-0.5 rounded font-mono text-slate-800 border border-slate-200">Expected Level - Current Level = Gap</code>. 
              Priority is assigned dynamically to guide personalized capacity building.
            </p>
          </div>

          <GlassButton
            variant="primary"
            size="md"
            icon={FiZap}
            onClick={() => navigate('/employee/recommendations')}
          >
            Recommended Learning
          </GlassButton>
        </div>
      </GlassCard>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeFilter === 'all'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white/70 text-slate-600 hover:bg-white border border-white/80'
          }`}
        >
          All Competencies ({competencies.length})
        </button>
        <button
          onClick={() => setActiveFilter('critical')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeFilter === 'critical'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-white/70 text-rose-700 hover:bg-white border border-white/80'
          }`}
        >
          Critical ({criticalCount})
        </button>
        <button
          onClick={() => setActiveFilter('high')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeFilter === 'high'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white/70 text-amber-800 hover:bg-white border border-white/80'
          }`}
        >
          High Priority ({highCount})
        </button>
        <button
          onClick={() => setActiveFilter('medium')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeFilter === 'medium'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'bg-white/70 text-sky-800 hover:bg-white border border-white/80'
          }`}
        >
          Medium ({mediumCount})
        </button>
        <button
          onClick={() => setActiveFilter('met')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeFilter === 'met'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white/70 text-emerald-800 hover:bg-white border border-white/80'
          }`}
        >
          Target Met ({competencies.length - totalGaps})
        </button>
      </div>

      {/* Gap Cards Grid */}
      {loading ? (
        <div className="py-16 text-center text-xs text-slate-400 space-y-3">
          <FiRefreshCw className="animate-spin text-blue-600 text-2xl mx-auto" />
          <p>Analyzing skill gaps...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredItems.map((item, idx) => {
            const comp = item.competency || {};
            const current = item.currentLevel || 1;
            const expected = item.expectedLevel || 1;
            const gap = item.gap || 0;
            const priorityVariant = gap >= 3 ? 'critical' : gap === 2 ? 'high' : gap === 1 ? 'medium' : 'low';
            const priorityText = gap >= 3 ? 'Critical' : gap === 2 ? 'High' : gap === 1 ? 'Medium' : 'Target Met';

            return (
              <GlassCard key={comp._id || idx} className="p-6 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <GlassBadge variant={gap > 0 ? priorityVariant : 'success'} size="xs" dot={gap > 0}>
                      {priorityText} Priority
                    </GlassBadge>

                    {gap > 0 ? (
                      <span className="text-xs font-bold text-rose-600">
                        -{gap} Level Gap
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-emerald-600">
                        Target Met
                      </span>
                    )}
                  </div>

                  <div>
                    <h2 className="text-base font-bold text-slate-900 leading-snug">
                      {comp.name}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {comp.description}
                    </p>
                  </div>

                  {/* Level Comparison Matrix */}
                  <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-50/80 border border-slate-200/60 text-center">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Current</span>
                      <span className="text-sm font-bold text-slate-800">L{current}</span>
                    </div>
                    <div className="border-x border-slate-200/80">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Required</span>
                      <span className="text-sm font-bold text-blue-700">L{expected}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Gap</span>
                      <span className={`text-sm font-bold ${gap > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {gap > 0 ? `-${gap}` : '0'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Category: <strong>{comp.category || 'Functional'}</strong>
                  </span>

                  {gap > 0 ? (
                    <GlassButton
                      variant="outline"
                      size="xs"
                      iconRight={FiArrowRight}
                      onClick={() => navigate('/employee/recommendations')}
                    >
                      View Learning
                    </GlassButton>
                  ) : (
                    <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                      <FiCheckCircle className="text-xs" /> Satisfied
                    </span>
                  )}
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
