import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiAward,
  FiCheckCircle,
  FiAlertCircle,
  FiArrowRight,
  FiLayers,
  FiRefreshCw,
  FiInfo,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { getEmployeeCompetencyAudit } from '../../services/employeeService';
import GlassCard from '../../components/common/GlassCard';
import GlassButton from '../../components/common/GlassButton';
import GlassBadge from '../../components/common/GlassBadge';
import ProgressBar from '../../components/common/ProgressBar';

export default function MyCompetencies() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [competencies, setCompetencies] = useState([]);

  useEffect(() => {
    async function loadData() {
      if (!user?._id) return;
      try {
        setLoading(true);
        const data = await getEmployeeCompetencyAudit(user._id);
        if (data?.competencies) {
          setCompetencies(data.competencies);
        }
      } catch (e) {
        console.warn('Failed to load competencies:', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user?._id]);

  return (
    <div className="space-y-6 pb-12">
      {/* Clean Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Role Competencies
            </h1>
            <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              {user?.position?.title || 'Statistical Officer'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Official competency framework requirements and current evaluated proficiency levels.
          </p>
        </div>

        <GlassButton
          variant="primary"
          size="sm"
          iconRight={FiArrowRight}
          onClick={() => navigate('/employee/assessments')}
        >
          Take Assessment
        </GlassButton>
      </div>

      {/* Competency Grid */}
      {loading ? (
        <div className="py-16 text-center text-xs text-slate-400 space-y-3">
          <FiRefreshCw className="animate-spin text-blue-600 text-xl mx-auto" />
          <p>Loading competency profile from database...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {competencies.map((item, idx) => {
            const comp = item.competency || {};
            const current = item.currentLevel || 1;
            const expected = item.expectedLevel || 1;
            const gap = item.gap || 0;
            const subComps = comp.subCompetencies || [];

            return (
              <GlassCard key={comp._id || idx} className="p-5 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  {/* Card Title & Category */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <GlassBadge variant="primary" size="xs">
                          {comp.category || 'Functional'}
                        </GlassBadge>
                        {gap > 0 ? (
                          <GlassBadge variant={gap >= 3 ? 'critical' : gap === 2 ? 'high' : 'medium'} size="xs" dot>
                            Gap: {gap}
                          </GlassBadge>
                        ) : (
                          <GlassBadge variant="success" size="xs">
                            Target Met
                          </GlassBadge>
                        )}
                      </div>
                      <h2 className="text-sm font-bold text-slate-900 leading-snug">
                        {comp.name}
                      </h2>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="text-xs font-bold text-slate-900">
                        Level {current} <span className="text-slate-400 font-normal">/ L{expected}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block">Proficiency</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {comp.description}
                  </p>

                  {/* Level Progress Bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Proficiency</span>
                      <span className="font-semibold text-slate-700">Level {current} of 5</span>
                    </div>
                    <ProgressBar
                      value={Math.round((current / 5) * 100)}
                      variant={gap > 0 ? 'blue' : 'emerald'}
                      size="xs"
                    />
                  </div>

                  {/* Sub-competencies */}
                  {subComps.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Key Areas
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {subComps.map((sc, scIdx) => (
                          <span
                            key={sc._id || scIdx}
                            className="px-2 py-0.5 rounded-md bg-slate-100 text-[11px] text-slate-700 font-medium"
                          >
                            {sc.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Action Footer */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Required: <strong>Level {expected}</strong>
                  </span>

                  {gap > 0 ? (
                    <button
                      onClick={() => navigate('/employee/recommendations')}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      Close Gap &rarr;
                    </button>
                  ) : (
                    <span className="text-xs font-medium text-emerald-700 flex items-center gap-1">
                      <FiCheckCircle className="text-xs" /> Certified Proficient
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
