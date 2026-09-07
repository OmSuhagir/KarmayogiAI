import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiFileText,
  FiClock,
  FiAward,
  FiArrowRight,
  FiCheckCircle,
  FiRefreshCw,
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
      <div className="rounded-2xl bg-[#FFFDF8] border border-[#DDD9CF] p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-[#F8F6F0] text-[#62615D] border border-[#DDD9CF]">
              Standard Evaluation
            </span>
            <span className="text-[11px] text-[#8A8882]">National Civil Services Capacity Building</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#111111] tracking-tight mt-1.5">
            Role Assessments
          </h1>
          <p className="text-xs sm:text-sm text-[#62615D] mt-0.5">
            Objective evaluations calibrated against MoSPI competency benchmarks. Results dynamically update your capability profile.
          </p>
        </div>
      </div>

      {/* Assessments Grid */}
      {loading ? (
        <div className="py-16 text-center text-xs text-[#8A8882] space-y-2">
          <FiRefreshCw className="animate-spin text-[#111111] text-xl mx-auto" />
          <p>Loading active role assessments...</p>
        </div>
      ) : assessments.length === 0 ? (
        <div className="rounded-xl bg-[#FFFDF8] border border-[#DDD9CF] p-8 text-center text-xs text-[#8A8882]">
          No active assessments available at this time.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assessments.map((item) => (
            <div
              key={item._id}
              className="rounded-xl bg-[#FFFDF8] border border-[#DDD9CF] p-5 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-[#EAF2EC] text-[#52745D] border border-[#C5DDCB] mb-1">
                      Active Evaluation
                    </span>
                    <h2 className="text-base font-bold text-[#111111]">
                      {item.title}
                    </h2>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-[#F8F6F0] border border-[#DDD9CF] text-[#111111] flex items-center justify-center flex-shrink-0">
                    <FiFileText className="text-sm" />
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-[#62615D]">
                  <span className="flex items-center gap-1.5">
                    <FiClock className="text-[#8A8882]" /> {item.durationMinutes || 30} mins
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FiAward className="text-[#8A8882]" /> {item.competencies?.length || 0} Competencies
                  </span>
                </div>

                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8882]">
                    Evaluated Competencies:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(item.competencies || []).map((c, cIdx) => (
                      <span
                        key={c.competencyId?._id || cIdx}
                        className="px-2 py-0.5 rounded bg-[#F8F6F0] border border-[#DDD9CF] text-[10px] text-[#111111]"
                      >
                        {c.competencyId?.name || 'Competency'} (L{c.requiredLevel} req)
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#DDD9CF] flex items-center justify-between">
                <span className="text-[11px] text-[#8A8882]">
                  Adaptive evaluation
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
