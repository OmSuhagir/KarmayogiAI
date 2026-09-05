import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiFileText,
  FiClock,
  FiAward,
  FiArrowRight,
  FiCheckCircle,
  FiRefreshCw,
  FiShield,
} from 'react-icons/fi';
import { getAssessments } from '../../services/assessmentService';
import GlassCard from '../../components/common/GlassCard';
import GlassButton from '../../components/common/GlassButton';
import GlassBadge from '../../components/common/GlassBadge';

export default function Assessments() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [assessments, setAssessments] = useState([]);

  useEffect(() => {
    async function loadAssessments() {
      try {
        setLoading(true);
        const data = await getAssessments();
        if (Array.isArray(data)) {
          setAssessments(data);
        }
      } catch (e) {
        console.warn('Failed to load assessments:', e);
      } finally {
        setLoading(false);
      }
    }
    loadAssessments();
  }, []);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <GlassCard variant="solid" className="p-6 sm:p-8 border-white/80">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <GlassBadge variant="primary" size="xs">
              Continuous Capacity Building
            </GlassBadge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Role Assessments
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl font-normal leading-relaxed">
            Standardized competency assessments evaluating your functional, domain, and behavioral proficiencies. Results automatically compute skill gaps and recommend tailored learning pathways.
          </p>
        </div>
      </GlassCard>

      {/* Assessments List */}
      {loading ? (
        <div className="py-16 text-center text-xs text-slate-400 space-y-3">
          <FiRefreshCw className="animate-spin text-blue-600 text-2xl mx-auto" />
          <p>Loading active role assessments from database...</p>
        </div>
      ) : assessments.length === 0 ? (
        <GlassCard className="p-8 text-center text-slate-500 text-xs">
          No active assessments found at this time.
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {assessments.map((item) => (
            <GlassCard
              key={item._id}
              className="p-6 space-y-5 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <GlassBadge variant="success" size="xs" dot>
                      Active Evaluation
                    </GlassBadge>
                    <h2 className="text-lg font-bold text-slate-900">
                      {item.title}
                    </h2>
                  </div>
                  <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex-shrink-0">
                    <FiFileText className="text-xl" />
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-600">
                  <span className="flex items-center gap-1.5 font-medium">
                    <FiClock className="text-slate-400" /> {item.durationMinutes || 30} mins
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <FiAward className="text-slate-400" /> {item.competencies?.length || 0} Competencies
                  </span>
                </div>

                {/* Competencies covered */}
                <div className="space-y-1.5 pt-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Evaluated Competencies:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {(item.competencies || []).map((c, cIdx) => (
                      <span
                        key={c.competencyId?._id || cIdx}
                        className="px-2.5 py-1 rounded-lg bg-white/70 border border-slate-200/60 text-[11px] text-slate-700 font-medium"
                      >
                        {c.competencyId?.name || 'Competency'} (L{c.requiredLevel} req)
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  Adaptive evaluation format
                </span>
                <GlassButton
                  variant="primary"
                  size="sm"
                  iconRight={FiArrowRight}
                  onClick={() => navigate(`/employee/assessments/${item._id}`)}
                >
                  Start Assessment
                </GlassButton>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
