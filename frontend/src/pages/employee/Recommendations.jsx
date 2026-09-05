import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiZap,
  FiBookOpen,
  FiClock,
  FiCheckCircle,
  FiArrowRight,
  FiRefreshCw,
  FiExternalLink,
  FiAward,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import {
  getEmployeeRecommendations,
  generateEmployeeRecommendations,
} from '../../services/employeeService';
import GlassCard from '../../components/common/GlassCard';
import GlassButton from '../../components/common/GlassButton';
import GlassBadge from '../../components/common/GlassBadge';

export default function Recommendations() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    async function loadRecs() {
      if (!user?._id) return;
      try {
        setLoading(true);
        const data = await getEmployeeRecommendations(user._id);
        if (Array.isArray(data)) {
          setRecommendations(data);
        }
      } catch (e) {
        console.warn('Failed to load recommendations:', e);
      } finally {
        setLoading(false);
      }
    }
    loadRecs();
  }, [user?._id]);

  const handleRegenerate = async () => {
    if (!user?._id) return;
    try {
      setGenerating(true);
      await generateEmployeeRecommendations(user._id);
      const data = await getEmployeeRecommendations(user._id);
      if (Array.isArray(data)) {
        setRecommendations(data);
      }
    } catch (e) {
      console.warn('Failed to regenerate recommendations:', e);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <GlassCard variant="solid" className="p-6 sm:p-8 border-white/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <GlassBadge variant="purple" size="xs">
                AI Intelligence Layer
              </GlassBadge>
              <span className="text-xs text-slate-400 font-medium">
                iGOT Karmayogi Integrated
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              AI Learning Recommendations
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl font-normal leading-relaxed">
              Curated and ranked courses mapped precisely to your open skill gaps. Algorithms analyze required proficiency, course duration, and content suitability to recommend the optimal learning pathway.
            </p>
          </div>

          <GlassButton
            variant="glass"
            size="md"
            icon={FiRefreshCw}
            loading={generating}
            onClick={handleRegenerate}
          >
            Refresh Recommendations
          </GlassButton>
        </div>
      </GlassCard>

      {/* Recommendations Content */}
      {loading ? (
        <div className="py-16 text-center text-xs text-slate-400 space-y-3">
          <FiRefreshCw className="animate-spin text-blue-600 text-2xl mx-auto" />
          <p>Scoring and ranking learning resources from iGOT Karmayogi...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Static Sample of Real Recommended Courses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Course 1 */}
            <GlassCard className="p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <GlassBadge variant="default" size="xs">iGOT Karmayogi</GlassBadge>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    94% Match Score
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    Python for Data Analysis & Tabular Processing
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Directly addresses your evaluated <strong>Level 2 Gap in Python for Data Analysis</strong>. Covers Pandas data structures, data filtering, and statistical computation.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/60 space-y-1.5 text-xs text-slate-600">
                  <p className="font-semibold text-slate-800 text-[11px] uppercase tracking-wider">
                    Why Recommended:
                  </p>
                  <ul className="space-y-1 text-[11px] text-slate-600">
                    <li className="flex items-center gap-1.5">
                      <FiCheckCircle className="text-emerald-600 text-xs flex-shrink-0" />
                      <span>Directly addresses target competency: Python Fundamentals & Pandas</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <FiCheckCircle className="text-emerald-600 text-xs flex-shrink-0" />
                      <span>Suitable for current evaluated Level 1 proficiency</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <FiCheckCircle className="text-emerald-600 text-xs flex-shrink-0" />
                      <span>Trusted iGOT capacity building content</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between">
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <FiClock /> 150 Minutes
                </span>
                <GlassButton
                  variant="primary"
                  size="sm"
                  iconRight={FiArrowRight}
                  onClick={() => navigate('/employee/learning')}
                >
                  Start Course
                </GlassButton>
              </div>
            </GlassCard>

            {/* Course 2 */}
            <GlassCard className="p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <GlassBadge variant="default" size="xs">iGOT Karmayogi</GlassBadge>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    88% Match Score
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    Sampling Techniques and Survey Design
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Directly addresses your <strong>Level 2 Gap in Sampling Design</strong>. Covers probability sampling, sample size estimation, and sampling error control.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/60 space-y-1.5 text-xs text-slate-600">
                  <p className="font-semibold text-slate-800 text-[11px] uppercase tracking-wider">
                    Why Recommended:
                  </p>
                  <ul className="space-y-1 text-[11px] text-slate-600">
                    <li className="flex items-center gap-1.5">
                      <FiCheckCircle className="text-emerald-600 text-xs flex-shrink-0" />
                      <span>Directly addresses target competency: Sampling Design</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <FiCheckCircle className="text-emerald-600 text-xs flex-shrink-0" />
                      <span>Designed for Level 2 &rarr; Level 4 progression</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <FiCheckCircle className="text-emerald-600 text-xs flex-shrink-0" />
                      <span>Standard survey methodology for official statistics</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between">
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <FiClock /> 180 Minutes
                </span>
                <GlassButton
                  variant="primary"
                  size="sm"
                  iconRight={FiArrowRight}
                  onClick={() => navigate('/employee/learning')}
                >
                  Start Course
                </GlassButton>
              </div>
            </GlassCard>

            {/* Course 3 */}
            <GlassCard className="p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <GlassBadge variant="default" size="xs">iGOT Karmayogi</GlassBadge>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    85% Match Score
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    Data Quality Management and Validation Procedures
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Directly addresses your <strong>Level 2 Gap in Data Quality Management</strong>. Focuses on data validation rules, inconsistency identification, and missing data imputation.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/60 space-y-1.5 text-xs text-slate-600">
                  <p className="font-semibold text-slate-800 text-[11px] uppercase tracking-wider">
                    Why Recommended:
                  </p>
                  <ul className="space-y-1 text-[11px] text-slate-600">
                    <li className="flex items-center gap-1.5">
                      <FiCheckCircle className="text-emerald-600 text-xs flex-shrink-0" />
                      <span>Directly addresses Data Quality Management</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <FiCheckCircle className="text-emerald-600 text-xs flex-shrink-0" />
                      <span>Focused module for immediate capacity building</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between">
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <FiClock /> 140 Minutes
                </span>
                <GlassButton
                  variant="primary"
                  size="sm"
                  iconRight={FiArrowRight}
                  onClick={() => navigate('/employee/learning')}
                >
                  Start Course
                </GlassButton>
              </div>
            </GlassCard>

            {/* Course 4 */}
            <GlassCard className="p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <GlassBadge variant="default" size="xs">iGOT Karmayogi</GlassBadge>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    80% Match Score
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    Data Visualization & Policy Storytelling
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Directly addresses your <strong>Level 1 Gap in Data Visualization</strong>. Focuses on charts selection, dashboard design, and effective communication.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/60 space-y-1.5 text-xs text-slate-600">
                  <p className="font-semibold text-slate-800 text-[11px] uppercase tracking-wider">
                    Why Recommended:
                  </p>
                  <ul className="space-y-1 text-[11px] text-slate-600">
                    <li className="flex items-center gap-1.5">
                      <FiCheckCircle className="text-emerald-600 text-xs flex-shrink-0" />
                      <span>Directly addresses Data Visualization requirements</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <FiCheckCircle className="text-emerald-600 text-xs flex-shrink-0" />
                      <span>Fast-track 100 minute duration</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between">
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <FiClock /> 100 Minutes
                </span>
                <GlassButton
                  variant="primary"
                  size="sm"
                  iconRight={FiArrowRight}
                  onClick={() => navigate('/employee/learning')}
                >
                  Start Course
                </GlassButton>
              </div>
            </GlassCard>

          </div>
        </div>
      )}
    </div>
  );
}
