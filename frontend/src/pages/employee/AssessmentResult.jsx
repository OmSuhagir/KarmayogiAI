import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  FiCheckCircle,
  FiAward,
  FiArrowRight,
  FiAlertCircle,
  FiHome,
  FiRefreshCw,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { getEmployeeCompetencyAudit } from '../../services/employeeService';
import GlassCard from '../../components/common/GlassCard';
import GlassButton from '../../components/common/GlassButton';
import GlassBadge from '../../components/common/GlassBadge';
import ProficiencyScale from '../../components/common/ProficiencyScale';

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
      <div className="py-20 text-center space-y-2">
        <FiRefreshCw className="animate-spin text-[#111111] text-2xl mx-auto" />
        <p className="text-xs text-[#8A8882]">
          Retrieving official evaluation results...
        </p>
      </div>
    );
  }

  if (!resultData && enrichedCompetencies.length === 0) {
    return (
      <div className="space-y-6 pb-12 max-w-2xl mx-auto text-center">
        <div className="rounded-2xl bg-[#FFFDF8] border border-[#DDD9CF] p-8 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-[#F8F6F0] border border-[#DDD9CF] text-[#62615D] flex items-center justify-center mx-auto">
            <FiAlertCircle className="text-xl" />
          </div>
          <h2 className="text-lg font-bold text-[#111111]">
            No Recent Assessment Session Found
          </h2>
          <p className="text-xs text-[#62615D] max-w-sm mx-auto">
            Take a role assessment to evaluate proficiencies and calculate updated skill gaps.
          </p>
          <div className="pt-2 flex justify-center">
            <GlassButton
              variant="primary"
              size="sm"
              onClick={() => navigate('/employee/assessments')}
            >
              Go to Assessments
            </GlassButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* 1. OVERALL OUTCOME BANNER */}
      <div className="rounded-2xl bg-[#FFFDF8] border border-[#DDD9CF] p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {isPassed ? (
              <GlassBadge variant="success" size="xs">
                Assessment Completed
              </GlassBadge>
            ) : (
              <GlassBadge variant="warning" size="xs">
                Development Needed
              </GlassBadge>
            )}
            <span className="text-[11px] text-[#8A8882]">
              Official Result Logged & Calibrated
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-[#111111] tracking-tight">
            Assessment Evaluation Summary
          </h1>

          <p className="text-xs sm:text-sm text-[#62615D] max-w-xl leading-relaxed">
            Your responses have been authoritatively evaluated by the backend assessment engine. Your role profile has been updated and skill gaps recalculated.
          </p>
        </div>

        {/* Overall Score Badge */}
        <div className="p-4 rounded-xl bg-[#F8F6F0] border border-[#DDD9CF] text-center flex-shrink-0 min-w-[130px]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8882] block">
            Overall Score
          </span>
          <span className="text-3xl font-bold text-[#111111] block my-0.5">
            {overallScore}%
          </span>
          <span className="text-[10px] text-[#62615D] block">
            {enrichedCompetencies.length} Competencies
          </span>
        </div>
      </div>

      {/* 2. COMPETENCY BREAKDOWN */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#111111]">
              Competency Breakdown & Progression
            </h2>
            <p className="text-xs text-[#8A8882]">
              Previous evaluated level vs newly assessed proficiency
            </p>
          </div>

          <GlassButton
            variant="outline"
            size="xs"
            iconRight={FiArrowRight}
            onClick={() => navigate('/employee/skill-gaps')}
          >
            View Skill Gaps
          </GlassButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {enrichedCompetencies.map((comp, idx) => {
            const isImproved = comp.assessedLevel > comp.previousLevel;
            const isLevelMet = comp.assessedLevel >= comp.expectedLevel;

            return (
              <div
                key={comp.competencyId || idx}
                className="rounded-xl bg-[#FFFDF8] border border-[#DDD9CF] p-5 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#F8F6F0] text-[#62615D] border border-[#DDD9CF]">
                          {comp.category}
                        </span>
                        {isImproved && (
                          <GlassBadge variant="success" size="xs">
                            +1 Level Up
                          </GlassBadge>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-[#111111] leading-snug">
                        {comp.name}
                      </h3>
                    </div>

                    <span className="text-xs font-bold text-[#111111] bg-[#F8F6F0] px-2 py-0.5 rounded border border-[#DDD9CF]">
                      {comp.score}% Score
                    </span>
                  </div>

                  <ProficiencyScale
                    currentLevel={comp.assessedLevel}
                    targetLevel={comp.expectedLevel}
                    compact={true}
                    showLabels={false}
                  />
                </div>

                <div className="pt-3 border-t border-[#DDD9CF] flex items-center justify-between text-xs">
                  <span className="text-[#8A8882]">Status:</span>
                  <span
                    className={`font-medium flex items-center gap-1 ${
                      isLevelMet ? 'text-[#52745D]' : 'text-[#A8752E]'
                    }`}
                  >
                    {isLevelMet ? (
                      <>
                        <FiCheckCircle className="text-xs" /> Target Achieved
                      </>
                    ) : (
                      <>
                        <FiAlertCircle className="text-xs" /> Gap: +{comp.gap} Level{comp.gap > 1 ? 's' : ''}
                      </>
                    )}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. BOTTOM CTA */}
      <div className="rounded-xl bg-[#FFFDF8] border border-[#DDD9CF] p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-0.5 text-center sm:text-left">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
            Next Action in Capacity Building
          </h3>
          <p className="text-xs text-[#62615D]">
            Learning recommendations have been updated to target newly identified gaps.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <GlassButton
            variant="secondary"
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
            onClick={() => navigate('/employee/recommendations')}
          >
            Start Recommended Learning
          </GlassButton>
        </div>
      </div>
    </div>
  );
}
