import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  FiCheckCircle,
  FiAward,
  FiTrendingUp,
  FiArrowRight,
  FiAlertCircle,
  FiBookOpen,
  FiHome,
  FiLayers,
  FiRefreshCw,
  FiCalendar,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { getEmployeeCompetencyAudit } from '../../services/employeeService';
import { getAssessmentResult } from '../../services/assessmentService';
import GlassCard from '../../components/common/GlassCard';
import GlassButton from '../../components/common/GlassButton';
import GlassBadge from '../../components/common/GlassBadge';
import ProgressBar from '../../components/common/ProgressBar';

export default function AssessmentResult() {
  const { id: assessmentId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [resultData, setResultData] = useState(null);
  const [auditData, setAuditData] = useState([]);

  useEffect(() => {
    async function loadResultAndProfile() {
      try {
        setLoading(true);

        // 1. Retrieve submission result from navigation state or session storage
        let storedResult = location.state?.resultData || location.state?.result;

        if (!storedResult) {
          const cache = sessionStorage.getItem(`karmayogi_result_${assessmentId}`);
          if (cache) {
            try {
              const parsed = JSON.parse(cache);
              storedResult = parsed.resultData || parsed.result;
            } catch (e) {
              console.warn('Could not parse cached assessment result:', e);
            }
          }
        }

        setResultData(storedResult || null);

        // 2. Fetch updated competency audit to enrich with names, categories, and expected levels
        if (user?._id) {
          const audit = await getEmployeeCompetencyAudit(user._id);
          if (audit?.competencies) {
            setAuditData(audit.competencies);
          }
        }
      } catch (err) {
        console.warn('Error loading assessment outcome:', err);
      } finally {
        setLoading(false);
      }
    }

    loadResultAndProfile();
  }, [assessmentId, user?._id, location.state]);

  // Merge backend competencyScores with rich metadata from competency audit
  const rawCompetencies = resultData?.competencies || [];

  const enrichedCompetencies = rawCompetencies.map((rc) => {
    const matched = auditData.find(
      (a) =>
        String(a.competency?._id) === String(rc.competencyId?._id || rc.competencyId) ||
        String(a.competency?.id) === String(rc.competencyId?._id || rc.competencyId)
    );

    return {
      competencyId: rc.competencyId?._id || rc.competencyId,
      name: rc.competency?.name || matched?.competency?.name || 'Core Competency',
      category: rc.competency?.category || matched?.competency?.category || 'Functional',
      description: matched?.competency?.description || '',
      score: rc.score !== undefined ? rc.score : 0,
      previousLevel: rc.previousLevel !== null && rc.previousLevel !== undefined ? rc.previousLevel : 1,
      assessedLevel: rc.assessedLevel !== null && rc.assessedLevel !== undefined ? rc.assessedLevel : 1,
      expectedLevel: matched?.expectedLevel || 3,
      gap: matched?.gap !== undefined ? matched.gap : Math.max(0, (matched?.expectedLevel || 3) - (rc.assessedLevel || 1)),
    };
  });

  const overallScore = resultData?.overallScore !== undefined ? resultData.overallScore : 0;
  const isPassed = overallScore >= 50;

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <FiRefreshCw className="animate-spin text-blue-600 text-3xl mx-auto" />
        <p className="text-xs text-slate-500 font-medium">
          Retrieving official evaluation results...
        </p>
      </div>
    );
  }

  if (!resultData && enrichedCompetencies.length === 0) {
    return (
      <div className="space-y-6 pb-12 max-w-3xl mx-auto text-center">
        <GlassCard variant="solid" className="p-8 space-y-4 border-white/80">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto">
            <FiAlertCircle className="text-2xl" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            No Recent Assessment Session Found
          </h2>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            Take a role assessment to evaluate your proficiencies and calculate updated skill gaps.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <GlassButton
              variant="primary"
              size="md"
              onClick={() => navigate('/employee/assessments')}
            >
              Go to Assessments
            </GlassButton>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto text-left">
      
      {/* SECTION 1: OVERALL OUTCOME BANNER */}
      <GlassCard variant="solid" className="p-6 sm:p-8 border-white/80 space-y-6 shadow-glass">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <GlassBadge variant={isPassed ? 'success' : 'high'} size="xs" dot>
                {isPassed ? 'Assessment Completed' : 'Needs Development'}
              </GlassBadge>
              <span className="text-xs text-slate-400 font-medium">
                Official Result Logged in MongoDB
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Assessment Evaluation Summary
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
              Your responses have been authoritatively scored by the backend evaluation engine. Your competency profile has been updated and skill gaps recalculated.
            </p>
          </div>

          {/* Overall Score Badge Pill */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200/80 text-center flex-shrink-0 min-w-[140px] shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 block">
              Overall Score
            </span>
            <span className="text-3xl sm:text-4xl font-extrabold text-indigo-900 block my-1">
              {overallScore}%
            </span>
            <span className="text-[10px] text-slate-500 font-semibold block">
              {enrichedCompetencies.length} Competencies Evaluated
            </span>
          </div>
        </div>
      </GlassCard>

      {/* SECTION 2: COMPETENCY-WISE LEVEL PROGRESSION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Evaluated Competency Breakdown
            </h2>
            <p className="text-xs text-slate-500">
              Previous Level vs Newly Assessed Level
            </p>
          </div>

          <GlassButton
            variant="outline"
            size="xs"
            iconRight={FiArrowRight}
            onClick={() => navigate('/employee/skill-gaps')}
          >
            View Updated Skill Gaps
          </GlassButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {enrichedCompetencies.map((comp, idx) => {
            const isImproved = comp.assessedLevel > comp.previousLevel;
            const isLevelMet = comp.assessedLevel >= comp.expectedLevel;

            return (
              <GlassCard
                key={comp.competencyId || idx}
                className="p-5 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <GlassBadge variant="primary" size="xs">
                          {comp.category}
                        </GlassBadge>
                        {isImproved && (
                          <GlassBadge variant="success" size="xs">
                            +1 Level Up
                          </GlassBadge>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 leading-snug">
                        {comp.name}
                      </h3>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-extrabold text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100 block">
                        {comp.score}% Score
                      </span>
                    </div>
                  </div>

                  {/* Level Stepper Visualization */}
                  <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-50/80 border border-slate-200/60 text-center">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Previous</span>
                      <span className="text-xs font-bold text-slate-600">Level {comp.previousLevel}</span>
                    </div>
                    <div className="border-x border-slate-200/80 bg-indigo-50/50 rounded-lg">
                      <span className="text-[10px] text-indigo-600 font-bold uppercase block">Assessed</span>
                      <span className="text-sm font-extrabold text-indigo-700">Level {comp.assessedLevel}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Required</span>
                      <span className="text-xs font-bold text-slate-800">Level {comp.expectedLevel}</span>
                    </div>
                  </div>

                  {/* Visual Progress Bar */}
                  <ProgressBar
                    value={Math.round((comp.assessedLevel / 5) * 100)}
                    color={isLevelMet ? 'emerald' : 'amber'}
                    size="sm"
                  />
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Status:</span>
                  <span
                    className={`font-semibold flex items-center gap-1 ${
                      isLevelMet ? 'text-emerald-700' : 'text-amber-700'
                    }`}
                  >
                    {isLevelMet ? (
                      <>
                        <FiCheckCircle className="text-xs" /> Target Satisfied
                      </>
                    ) : (
                      <>
                        <FiAlertCircle className="text-xs" /> Gap: {comp.gap} Level
                        {comp.gap > 1 ? 's' : ''}
                      </>
                    )}
                  </span>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: NEXT ACTION CTA BAR */}
      <GlassCard className="p-6 border-indigo-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-sm font-bold text-slate-900">
            Capacity Building & Next Steps
          </h3>
          <p className="text-xs text-slate-600">
            Your learning recommendations have been refreshed based on your newly assessed competency profile.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <GlassButton
            variant="glass"
            size="sm"
            icon={FiHome}
            onClick={() => navigate('/employee/dashboard')}
          >
            Dashboard
          </GlassButton>
          <GlassButton
            variant="primary"
            size="sm"
            iconRight={FiArrowRight}
            className="bg-gradient-to-r from-indigo-700 to-slate-900 text-white"
            onClick={() => navigate('/employee/recommendations')}
          >
            Start Recommended Learning
          </GlassButton>
        </div>
      </GlassCard>

    </div>
  );
}
