import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FiAward,
  FiAlertCircle,
  FiBookOpen,
  FiTrendingUp,
  FiArrowRight,
  FiCheckCircle,
  FiZap,
  FiClock,
  FiChevronRight,
  FiDatabase,
} from 'react-icons/fi';
import { RiGovernmentLine, RiSparklingFill } from 'react-icons/ri';
import { useAuth } from '../../context/AuthContext';
import {
  getEmployeeProfile,
  getEmployeeCompetencyAudit,
  getEmployeeSkillGaps,
  getEmployeeRecommendations,
  getEmployeeLearningProgress,
  getEmployeeCompetencyHistory,
  getActiveAssessments,
} from '../../services/employeeService';
import GlassCard from '../../components/common/GlassCard';
import GlassButton from '../../components/common/GlassButton';
import GlassBadge from '../../components/common/GlassBadge';
import ProgressBar from '../../components/common/ProgressBar';
import StatMetric from '../../components/common/StatMetric';
import ProficiencyScale from '../../components/common/ProficiencyScale';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [competencies, setCompetencies] = useState([]);
  const [skillGaps, setSkillGaps] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [learningProgress, setLearningProgress] = useState([]);
  const [activeAssessment, setActiveAssessment] = useState(null);
  const [compFilter, setCompFilter] = useState('all');

  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      if (!user?._id) return;
      setLoading(true);

      try {
        const [
          profileData,
          auditData,
          gapsData,
          recsData,
          progressData,
          assessmentsData,
        ] = await Promise.allSettled([
          getEmployeeProfile(user._id),
          getEmployeeCompetencyAudit(user._id),
          getEmployeeSkillGaps(user._id),
          getEmployeeRecommendations(user._id),
          getEmployeeLearningProgress(user._id),
          getActiveAssessments(),
        ]);

        if (!isMounted) return;

        if (profileData.status === 'fulfilled' && profileData.value) {
          setProfile(profileData.value?.data || profileData.value);
        }
        if (auditData.status === 'fulfilled' && auditData.value?.competencies) {
          setCompetencies(auditData.value.competencies);
        }
        if (gapsData.status === 'fulfilled' && Array.isArray(gapsData.value)) {
          setSkillGaps(gapsData.value);
        }
        if (recsData.status === 'fulfilled' && Array.isArray(recsData.value)) {
          setRecommendations(recsData.value);
        }
        if (progressData.status === 'fulfilled' && Array.isArray(progressData.value)) {
          setLearningProgress(progressData.value);
        }
        if (assessmentsData.status === 'fulfilled' && Array.isArray(assessmentsData.value)) {
          setActiveAssessment(assessmentsData.value[0] || null);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadDashboardData();
    return () => {
      isMounted = false;
    };
  }, [user?._id]);

  const totalCompetencies = competencies.length;
  const metCount = competencies.filter(
    (c) => (c.currentLevel || 0) >= (c.expectedLevel || 1)
  ).length;
  const openGaps = competencies.filter((c) => (c.gap || 0) > 0);
  const openGapsCount = openGaps.length;
  const roleReadiness =
    totalCompetencies > 0 ? Math.round((metCount / totalCompetencies) * 100) : 0;

  const topPriorityGap = openGaps[0] || null;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. HERO ACTION BANNER */}
      <div className="rounded-2xl bg-[#FFFDF8] border border-[#DDD9CF] p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-[#F8F6F0] text-[#62615D] border border-[#DDD9CF]">
                {user?.department?.shortName || 'MoSPI'} &bull; {user?.position?.title || 'Statistical Officer'}
              </span>
              <span className="text-[11px] text-[#8A8882]">e-HRMS ID: {profile?.employeeId || user?.employeeId || 'GOI-2022-419'}</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-[#111111] tracking-tight">
              {getGreeting()}, {user?.name?.split(' ')[0] || 'Officer'}
            </h1>

            <p className="text-xs sm:text-sm text-[#62615D] leading-relaxed">
              Your capability profile is currently <strong>{roleReadiness}% aligned</strong> with role requirements.
              {openGapsCount > 0
                ? ` You have ${openGapsCount} identified skill ${openGapsCount === 1 ? 'gap' : 'gaps'} to address for full role proficiency.`
                : ' All role competency benchmarks have been successfully achieved.'}
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <GlassButton
              variant="primary"
              size="md"
              iconRight={FiArrowRight}
              onClick={() => navigate('/employee/skill-gaps')}
            >
              Continue Development
            </GlassButton>
            <GlassButton
              variant="secondary"
              size="md"
              onClick={() => navigate('/employee/assessments')}
            >
              Take Assessment
            </GlassButton>
          </div>
        </div>
      </div>

      {/* 2. NEXT BEST ACTION CARD (The single most urgent recommendation) */}
      {topPriorityGap && (
        <div className="rounded-xl bg-[#F8F6F0] border border-[#DDD9CF] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#F7EEDC] border border-[#ECD9BA] text-[#A8752E] flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">
              <FiZap />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#FFFDF8] text-[#A8752E] border border-[#ECD9BA]">
                  Recommended Next Action
                </span>
                <span className="text-xs font-semibold text-[#111111]">
                  Target Gap: {topPriorityGap.competency?.name}
                </span>
              </div>
              <p className="text-xs text-[#62615D] mt-1">
                Advance from <strong>L{topPriorityGap.currentLevel || 1}</strong> to benchmark <strong>L{topPriorityGap.expectedLevel || 2}</strong> by taking the matched micro-learning module.
              </p>
            </div>
          </div>

          <GlassButton
            variant="outline"
            size="sm"
            className="self-start sm:self-auto flex-shrink-0"
            onClick={() => navigate('/employee/recommendations')}
          >
            Start Learning &rarr;
          </GlassButton>
        </div>
      )}

      {/* 3. FOUR CORE QUANTITATIVE METRICS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatMetric
          title="Role Alignment"
          value={loading ? '...' : `${roleReadiness}%`}
          subtitle={`${metCount} of ${totalCompetencies} met`}
          icon={FiTrendingUp}
          iconColor="blue"
          onClick={() => navigate('/employee/progress')}
        />

        <StatMetric
          title="Verified Competencies"
          value={loading ? '...' : `${metCount}`}
          subtitle="At or above benchmark"
          icon={FiAward}
          iconColor="emerald"
          onClick={() => navigate('/employee/competencies')}
        />

        <StatMetric
          title="Open Skill Gaps"
          value={loading ? '...' : `${openGapsCount}`}
          subtitle={openGapsCount > 0 ? 'Requires attention' : 'Optimal status'}
          icon={FiAlertCircle}
          iconColor={openGapsCount > 0 ? 'amber' : 'emerald'}
          onClick={() => navigate('/employee/skill-gaps')}
        />

        <StatMetric
          title="Active Learning"
          value={loading ? '...' : `${learningProgress.length} Courses`}
          subtitle="iGOT Karmayogi synced"
          icon={FiBookOpen}
          iconColor="neutral"
          onClick={() => navigate('/employee/learning')}
        />
      </div>

      {/* 4. MAIN CONTENT 2-COLUMN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Role Competency Profile & Proficiency Scale */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl bg-[#FFFDF8] border border-[#DDD9CF] p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DDD9CF] pb-3">
              <div>
                <h2 className="text-sm font-bold text-[#111111]">
                  Role Competency Proficiency
                </h2>
                <p className="text-xs text-[#8A8882]">
                  Evaluated capability levels against MoSPI {user?.position?.title || 'Officer'} benchmarks
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setCompFilter('all')}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    compFilter === 'all'
                      ? 'bg-[#111111] text-[#FFFDF8] font-semibold'
                      : 'bg-[#F8F6F0] text-[#62615D] hover:text-[#111111]'
                  }`}
                >
                  All ({competencies.length})
                </button>
                <button
                  type="button"
                  onClick={() => setCompFilter('gaps')}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    compFilter === 'gaps'
                      ? 'bg-[#111111] text-[#FFFDF8] font-semibold'
                      : 'bg-[#F8F6F0] text-[#62615D] hover:text-[#111111]'
                  }`}
                >
                  Gaps ({openGapsCount})
                </button>
                <button
                  type="button"
                  onClick={() => setCompFilter('met')}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    compFilter === 'met'
                      ? 'bg-[#111111] text-[#FFFDF8] font-semibold'
                      : 'bg-[#F8F6F0] text-[#62615D] hover:text-[#111111]'
                  }`}
                >
                  Met ({metCount})
                </button>
              </div>
            </div>

            {loading ? (
              <div className="py-8 text-center text-xs text-[#8A8882]">
                Loading verified competencies...
              </div>
            ) : competencies.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#8A8882]">
                No competencies found for this role profile.
              </div>
            ) : (
              <div className="space-y-4">
                {competencies
                  .filter((item) => {
                    const gap = item.gap || 0;
                    if (compFilter === 'gaps') return gap > 0;
                    if (compFilter === 'met') return gap <= 0;
                    return true;
                  })
                  .map((item, idx) => {
                    const comp = item.competency || {};
                    const current = item.currentLevel || 1;
                    const expected = item.expectedLevel || 1;
                    const gap = item.gap || 0;

                    return (
                      <div
                        key={comp._id || idx}
                        className="p-3.5 rounded-lg bg-[#F8F6F0] border border-[#DDD9CF] space-y-2.5"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-[#111111]">
                                {comp.name || 'Competency'}
                              </span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#FFFDF8] text-[#62615D] border border-[#DDD9CF]">
                                {comp.category || 'Functional'}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#62615D] line-clamp-1 mt-0.5">
                              {comp.description}
                            </p>
                          </div>

                          <div className="text-right flex-shrink-0">
                            {gap > 0 ? (
                              <GlassBadge variant="carmine" size="xs">
                                Gap: +{gap} {gap === 1 ? 'Lvl' : 'Lvls'}
                              </GlassBadge>
                            ) : (
                              <GlassBadge variant="success" size="xs">
                                Benchmark Met
                              </GlassBadge>
                            )}
                          </div>
                        </div>

                        {/* Interactive Proficiency Scale Visualization */}
                        <ProficiencyScale
                          currentLevel={current}
                          targetLevel={expected}
                          compact={true}
                          showLabels={false}
                        />

                        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#DDD9CF]/60">
                          <span className="text-[#8A8882]">
                            Current: <strong>L{current}</strong> &middot; Target: <strong>L{expected}</strong>
                          </span>

                          {gap > 0 ? (
                            <Link
                              to="/employee/recommendations"
                              className="text-xs font-semibold text-[#3348A8] hover:underline flex items-center gap-1"
                            >
                              Build Competency &rarr;
                            </Link>
                          ) : (
                            <span className="text-xs text-[#52745D] font-medium flex items-center gap-1">
                              <FiCheckCircle className="text-xs" /> Verified
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}

            <div className="pt-2 border-t border-[#DDD9CF] flex items-center justify-between text-xs">
              <span className="text-[#8A8882]">
                {metCount} of {totalCompetencies} role benchmarks achieved
              </span>
              <Link
                to="/employee/competencies"
                className="font-semibold text-[#111111] hover:underline flex items-center gap-1"
              >
                View Full Competency Framework &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Priority Gaps & Recommended Learning */}
        <div className="space-y-6">
          
          {/* PRIORITY SKILL GAPS LIST */}
          <div className="rounded-xl bg-[#FFFDF8] border border-[#DDD9CF] p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#DDD9CF] pb-2.5">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                  Priority Skill Gaps
                </h3>
                <p className="text-[11px] text-[#8A8882]">Immediate focus areas</p>
              </div>
              <Link
                to="/employee/skill-gaps"
                className="text-xs font-semibold text-[#3348A8] hover:underline"
              >
                View All ({openGapsCount})
              </Link>
            </div>

            {openGaps.length === 0 ? (
              <div className="py-4 text-center text-xs text-[#52745D]">
                <FiCheckCircle className="text-base mx-auto mb-1" />
                All competency benchmarks are met!
              </div>
            ) : (
              <div className="space-y-2">
                {openGaps.slice(0, 3).map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-[#F8F6F0] border border-[#DDD9CF] flex items-center justify-between"
                  >
                    <div>
                      <h4 className="text-xs font-medium text-[#111111] line-clamp-1">
                        {item.competency?.name}
                      </h4>
                      <span className="text-[10px] text-[#8A8882]">
                        L{item.currentLevel} &rarr; Target L{item.expectedLevel}
                      </span>
                    </div>
                    <GlassBadge variant="warning" size="xs">
                      +{item.gap} Lvl
                    </GlassBadge>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RECOMMENDED COURSES (iGOT Karmayogi) */}
          <div className="rounded-xl bg-[#FFFDF8] border border-[#DDD9CF] p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#DDD9CF] pb-2.5">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                  Targeted Learning
                </h3>
                <p className="text-[11px] text-[#8A8882]">iGOT Karmayogi accredited</p>
              </div>
              <Link
                to="/employee/learning"
                className="text-xs font-semibold text-[#3348A8] hover:underline"
              >
                Learning Hub &rarr;
              </Link>
            </div>

            <div className="space-y-2">
              <div className="p-2.5 rounded-lg bg-[#F8F6F0] border border-[#DDD9CF] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#8A8882]">Module &bull; 150 mins</span>
                  <span className="text-[10px] font-semibold text-[#52745D]">94% Match</span>
                </div>
                <h4 className="text-xs font-semibold text-[#111111]">
                  Python for Data Analysis & Official Statistics
                </h4>
                <Link
                  to="/employee/recommendations"
                  className="text-[11px] font-medium text-[#3348A8] hover:underline block pt-0.5"
                >
                  Enroll Course &rarr;
                </Link>
              </div>

              <div className="p-2.5 rounded-lg bg-[#F8F6F0] border border-[#DDD9CF] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#8A8882]">Module &bull; 180 mins</span>
                  <span className="text-[10px] font-semibold text-[#52745D]">88% Match</span>
                </div>
                <h4 className="text-xs font-semibold text-[#111111]">
                  Sampling Techniques and Field Survey Design
                </h4>
                <Link
                  to="/employee/recommendations"
                  className="text-[11px] font-medium text-[#3348A8] hover:underline block pt-0.5"
                >
                  Enroll Course &rarr;
                </Link>
              </div>
            </div>
          </div>

          {/* SERVICE PROFILE SUMMARY */}
          <div className="rounded-xl bg-[#FFFDF8] border border-[#DDD9CF] p-4 space-y-2 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#DDD9CF]">
              <span className="font-semibold text-[#111111]">Service Record</span>
              <GlassBadge variant="success" size="xs">
                e-HRMS 2.0 Synced
              </GlassBadge>
            </div>
            <div className="space-y-1 text-[#62615D] text-[11px]">
              <div>Cadre: <strong className="text-[#111111]">{profile?.cadre || 'Indian Statistical Service (ISS)'}</strong></div>
              <div>Batch: <strong className="text-[#111111]">{profile?.batchYear || '2021'}</strong></div>
              <div>SPARROW Appraisal: <strong className="text-[#111111]">Outstanding (9.2/10)</strong></div>
            </div>
            <Link
              to="/employee/competencies"
              className="text-[11px] font-semibold text-[#3348A8] hover:underline block pt-1"
            >
              View Service Dossier &rarr;
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
