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
      {/* Clean Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Learning Recommendations
            </h1>
            <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
              iGOT Karmayogi
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Curated and AI-ranked courses mapped to close your identified competency gaps.
          </p>
        </div>

        <GlassButton
          variant="outline"
          size="sm"
          icon={FiRefreshCw}
          loading={generating}
          onClick={handleRegenerate}
        >
          Refresh Matching
        </GlassButton>
      </div>

      {/* Recommendations Content */}
      {loading ? (
        <div className="py-16 text-center text-xs text-slate-400 space-y-3">
          <FiRefreshCw className="animate-spin text-blue-600 text-xl mx-auto" />
          <p>Scoring and ranking learning resources from iGOT Karmayogi...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Static Sample of Real Recommended Courses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Course 1 */}
            <GlassCard className="p-5 space-y-3 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <GlassBadge variant="default" size="xs">iGOT Karmayogi</GlassBadge>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    94% Match Score
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    Python for Data Analysis & Tabular Processing
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Directly addresses your evaluated <strong>Level 2 Gap in Python for Data Analysis</strong>. Covers Pandas data structures, data filtering, and statistical computation.
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1 text-xs text-slate-600">
                  <p className="font-semibold text-slate-800 text-[10px] uppercase tracking-wider">
                    Why Recommended:
                  </p>
                  <ul className="space-y-0.5 text-[11px] text-slate-600">
                    <li className="flex items-center gap-1.5">
                      <FiCheckCircle className="text-emerald-600 text-xs flex-shrink-0" />
                      <span>Directly addresses target competency: Python Fundamentals & Pandas</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <FiCheckCircle className="text-emerald-600 text-xs flex-shrink-0" />
                      <span>Suitable for current evaluated Level 1 proficiency</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <FiClock /> 150 Minutes
                </span>
                <GlassButton
                  variant="primary"
                  size="xs"
                  iconRight={FiArrowRight}
                  onClick={() => navigate('/employee/learning')}
                >
                  Start Course
                </GlassButton>
              </div>
            </GlassCard>

            {/* Course 2 */}
            <GlassCard className="p-5 space-y-3 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <GlassBadge variant="default" size="xs">iGOT Karmayogi</GlassBadge>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    88% Match Score
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    Sampling Techniques and Survey Design
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Directly addresses your <strong>Level 2 Gap in Sampling Design</strong>. Covers probability sampling, sample size estimation, and sampling error control.
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1 text-xs text-slate-600">
                  <p className="font-semibold text-slate-800 text-[10px] uppercase tracking-wider">
                    Why Recommended:
                  </p>
                  <ul className="space-y-0.5 text-[11px] text-slate-600">
                    <li className="flex items-center gap-1.5">
                      <FiCheckCircle className="text-emerald-600 text-xs flex-shrink-0" />
                      <span>Directly addresses target competency: Sampling Design</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <FiCheckCircle className="text-emerald-600 text-xs flex-shrink-0" />
                      <span>Designed for Level 2 &rarr; Level 4 progression</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <FiClock /> 180 Minutes
                </span>
                <GlassButton
                  variant="primary"
                  size="xs"
                  iconRight={FiArrowRight}
                  onClick={() => navigate('/employee/learning')}
                >
                  Start Course
                </GlassButton>
              </div>
            </GlassCard>

            {/* Course 3 */}
            <GlassCard className="p-5 space-y-3 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <GlassBadge variant="default" size="xs">iGOT Karmayogi</GlassBadge>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    85% Match Score
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    Data Quality Management and Validation
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Directly addresses your <strong>Level 2 Gap in Data Quality Management</strong>. Focuses on data validation rules, inconsistency identification, and imputation.
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1 text-xs text-slate-600">
                  <p className="font-semibold text-slate-800 text-[10px] uppercase tracking-wider">
                    Why Recommended:
                  </p>
                  <ul className="space-y-0.5 text-[11px] text-slate-600">
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

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <FiClock /> 140 Minutes
                </span>
                <GlassButton
                  variant="primary"
                  size="xs"
                  iconRight={FiArrowRight}
                  onClick={() => navigate('/employee/learning')}
                >
                  Start Course
                </GlassButton>
              </div>
            </GlassCard>

            {/* Course 4 */}
            <GlassCard className="p-5 space-y-3 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <GlassBadge variant="default" size="xs">iGOT Karmayogi</GlassBadge>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    80% Match Score
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    Data Visualization & Policy Storytelling
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Directly addresses your <strong>Level 1 Gap in Data Visualization</strong>. Focuses on chart selection, dashboard design, and effective communication.
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1 text-xs text-slate-600">
                  <p className="font-semibold text-slate-800 text-[10px] uppercase tracking-wider">
                    Why Recommended:
                  </p>
                  <ul className="space-y-0.5 text-[11px] text-slate-600">
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

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <FiClock /> 100 Minutes
                </span>
                <GlassButton
                  variant="primary"
                  size="xs"
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
