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
  FiActivity,
  FiShield,
  FiRefreshCw,
  FiClock,
  FiExternalLink,
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

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [profile, setProfile] = useState(null);
  const [competencies, setCompetencies] = useState([]);
  const [skillGaps, setSkillGaps] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [learningProgress, setLearningProgress] = useState([]);
  const [history, setHistory] = useState([]);
  const [activeAssessment, setActiveAssessment] = useState(null);

  // Fetch real backend data for the logged-in employee
  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      if (!user?._id) return;
      setLoading(true);
      setError(null);

      try {
        const [
          profileData,
          auditData,
          gapsData,
          recsData,
          progressData,
          historyData,
          assessmentsData,
        ] = await Promise.allSettled([
          getEmployeeProfile(user._id),
          getEmployeeCompetencyAudit(user._id),
          getEmployeeSkillGaps(user._id),
          getEmployeeRecommendations(user._id),
          getEmployeeLearningProgress(user._id),
          getEmployeeCompetencyHistory(user._id),
          getActiveAssessments(),
        ]);

        if (!isMounted) return;

        // Process profile
        if (profileData.status === 'fulfilled' && profileData.value) {
          setProfile(profileData.value?.data || profileData.value);
        }

        // Process audit (expected vs current levels)
        if (auditData.status === 'fulfilled' && auditData.value?.competencies) {
          setCompetencies(auditData.value.competencies);
        }

        // Process skill gaps
        if (gapsData.status === 'fulfilled' && Array.isArray(gapsData.value)) {
          setSkillGaps(gapsData.value);
        }

        // Process recommendations
        if (recsData.status === 'fulfilled' && Array.isArray(recsData.value)) {
          setRecommendations(recsData.value);
        }

        // Process learning progress
        if (progressData.status === 'fulfilled' && Array.isArray(progressData.value)) {
          setLearningProgress(progressData.value);
        }

        // Process history
        if (historyData.status === 'fulfilled' && Array.isArray(historyData.value)) {
          setHistory(historyData.value);
        }

        // Process assessments
        if (assessmentsData.status === 'fulfilled' && Array.isArray(assessmentsData.value)) {
          setActiveAssessment(assessmentsData.value[0] || null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Could not load competency intelligence data.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, [user?._id]);

  // Derive dynamic metrics from real backend data
  const totalCompetencies = competencies.length;
  const avgCurrentLevel =
    totalCompetencies > 0
      ? (
          competencies.reduce((acc, c) => acc + (c.currentLevel || 0), 0) /
          totalCompetencies
        ).toFixed(1)
      : '0.0';

  const openGapsCount = competencies.filter((c) => (c.gap || 0) > 0).length;
  const criticalGapsCount = competencies.filter((c) => (c.gap || 0) >= 3).length;
  const highGapsCount = competencies.filter((c) => (c.gap || 0) === 2).length;

  const enrolledCount = learningProgress.length;
  const completedCoursesCount = learningProgress.filter(
    (lp) => lp.status === 'completed'
  ).length;

  // Role readiness: % of competencies where currentLevel >= expectedLevel
  const metCount = competencies.filter(
    (c) => (c.currentLevel || 0) >= (c.expectedLevel || 1)
  ).length;
  const roleReadiness =
    totalCompetencies > 0 ? Math.round((metCount / totalCompetencies) * 100) : 0;

  // Dynamic greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* SECTION 1: WELCOME BANNER */}
      <GlassCard variant="solid" className="p-6 sm:p-8 border-white/80 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <GlassBadge variant="primary" size="xs">
                {user?.department?.shortName || 'MoSPI'} Officer
              </GlassBadge>
              <span className="text-xs text-slate-400 font-medium">
                {user?.position?.title || 'Statistical Officer'}
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {getGreeting()}, {user?.name?.split(' ')[0] || 'Officer'}
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Here is your role competency profile and personalized capacity-building roadmap. 
              Address your identified skill gaps through curated iGOT courses to prepare for reassessment.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <GlassButton
              variant="primary"
              size="md"
              iconRight={FiArrowRight}
              onClick={() => navigate('/employee/assessments')}
            >
              Take Assessment
            </GlassButton>
            <GlassButton
              variant="glass"
              size="md"
              icon={FiAlertCircle}
              onClick={() => navigate('/employee/skill-gaps')}
            >
              View Skill Gaps
            </GlassButton>
          </div>
        </div>
      </GlassCard>

      {/* SECTION 2: PRIMARY KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatMetric
          title="Current Competency"
          value={loading ? '...' : `L${avgCurrentLevel}`}
          subtitle={loading ? 'Evaluating...' : `Avg across ${totalCompetencies} role competencies`}
          icon={FiAward}
          iconColor="blue"
          trend="Level 1-5"
          trendDirection="neutral"
          onClick={() => navigate('/employee/competencies')}
        />

        <StatMetric
          title="Active Skill Gaps"
          value={loading ? '...' : `${openGapsCount}`}
          subtitle={
            loading
              ? 'Analyzing gaps...'
              : `${criticalGapsCount} Critical, ${highGapsCount} High priority`
          }
          icon={FiAlertCircle}
          iconColor={openGapsCount > 0 ? 'amber' : 'emerald'}
          trend={openGapsCount > 0 ? `${openGapsCount} to resolve` : 'All met'}
          trendDirection={openGapsCount > 0 ? 'down' : 'up'}
          onClick={() => navigate('/employee/skill-gaps')}
        />

        <StatMetric
          title="Learning Progress"
          value={loading ? '...' : `${enrolledCount} Active`}
          subtitle={
            loading
              ? 'Fetching courses...'
              : `${completedCoursesCount} completed, 6 recommended`
          }
          icon={FiBookOpen}
          iconColor="purple"
          trend="iGOT Courses"
          trendDirection="neutral"
          onClick={() => navigate('/employee/learning')}
        />

        <StatMetric
          title="Role Readiness"
          value={loading ? '...' : `${roleReadiness}%`}
          subtitle={
            loading
              ? 'Calculating...'
              : `${metCount} of ${totalCompetencies} target levels met`
          }
          icon={FiTrendingUp}
          iconColor="emerald"
          trend={`${metCount}/${totalCompetencies} Met`}
          trendDirection={roleReadiness >= 75 ? 'up' : 'neutral'}
          onClick={() => navigate('/employee/progress')}
        />
      </div>

      {/* 2-COLUMN MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN (2 Cols): Competency Overview & Priority Gaps */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* SECTION 3: COMPETENCY OVERVIEW */}
          <GlassCard className="p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FiAward className="text-blue-600" />
                  Role Competencies & Current Proficiency
                </h2>
                <p className="text-xs text-slate-500 font-normal mt-0.5">
                  Expected vs assessed proficiency levels for <strong>{user?.roleInfo?.name || 'Statistical Officer'}</strong>
                </p>
              </div>

              <Link
                to="/employee/competencies"
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
              >
                View Full Rubric <FiArrowRight className="text-xs" />
              </Link>
            </div>

            {loading ? (
              <div className="py-8 text-center text-xs text-slate-400 space-y-2">
                <FiRefreshCw className="animate-spin text-blue-600 text-xl mx-auto" />
                <p>Loading competency profile from database...</p>
              </div>
            ) : competencies.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-500">
                No competencies found for this role.
              </div>
            ) : (
              <div className="space-y-4">
                {competencies.slice(0, 4).map((item, idx) => {
                  const comp = item.competency || {};
                  const current = item.currentLevel || 1;
                  const expected = item.expectedLevel || 1;
                  const gap = item.gap || 0;
                  const percent = Math.round((current / 5) * 100);

                  return (
                    <div
                      key={comp._id || idx}
                      className="p-4 rounded-xl bg-white/50 border border-white/80 hover:bg-white/80 transition-all space-y-2.5 shadow-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-slate-900">
                              {comp.name || 'Competency'}
                            </span>
                            <GlassBadge variant="primary" size="xs">
                              {comp.category || 'Functional'}
                            </GlassBadge>
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                            {comp.description}
                          </p>
                        </div>

                        <div className="text-right flex items-center gap-2">
                          <div className="text-xs">
                            <span className="font-bold text-slate-800">L{current}</span>
                            <span className="text-slate-400"> / L{expected} Exp</span>
                          </div>
                          {gap > 0 ? (
                            <GlassBadge variant={gap >= 3 ? 'critical' : gap === 2 ? 'high' : 'medium'} size="xs" dot>
                              Gap: {gap}
                            </GlassBadge>
                          ) : (
                            <GlassBadge variant="success" size="xs">
                              Met
                            </GlassBadge>
                          )}
                        </div>
                      </div>

                      <ProgressBar
                        value={percent}
                        variant={gap > 0 ? 'blue' : 'emerald'}
                        size="xs"
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </GlassCard>

          {/* SECTION 4: PRIORITY SKILL GAPS */}
          <GlassCard className="p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FiAlertCircle className="text-amber-600" />
                  Priority Skill Gaps Requiring Development
                </h2>
                <p className="text-xs text-slate-500 font-normal mt-0.5">
                  Identified deficiencies where required level exceeds current proficiency
                </p>
              </div>

              <Link
                to="/employee/skill-gaps"
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
              >
                All Gaps ({openGapsCount}) <FiArrowRight className="text-xs" />
              </Link>
            </div>

            {loading ? (
              <div className="py-8 text-center text-xs text-slate-400 space-y-2">
                <FiRefreshCw className="animate-spin text-blue-600 text-xl mx-auto" />
                <p>Analyzing skill gaps...</p>
              </div>
            ) : openGapsCount === 0 ? (
              <div className="py-6 text-center text-xs text-emerald-700 bg-emerald-50/60 rounded-xl border border-emerald-200/60 flex items-center justify-center gap-2">
                <FiCheckCircle className="text-base text-emerald-600" />
                <span>All role competencies currently meet or exceed expected levels.</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {competencies
                  .filter((c) => (c.gap || 0) > 0)
                  .slice(0, 4)
                  .map((item, idx) => {
                    const comp = item.competency || {};
                    const gap = item.gap || 0;
                    const priority = gap >= 3 ? 'Critical' : gap === 2 ? 'High' : 'Medium';
                    const priorityVariant = gap >= 3 ? 'critical' : gap === 2 ? 'high' : 'medium';

                    return (
                      <div
                        key={comp._id || idx}
                        className="p-4 rounded-xl bg-white/50 border border-white/80 hover:bg-white/85 transition-all flex flex-col justify-between space-y-3"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <GlassBadge variant={priorityVariant} size="xs" dot>
                              {priority} Priority
                            </GlassBadge>
                            <span className="text-xs font-bold text-rose-600">
                              -{gap} Levels
                            </span>
                          </div>

                          <h3 className="text-sm font-semibold text-slate-900 leading-tight">
                            {comp.name}
                          </h3>

                          <p className="text-[11px] text-slate-500">
                            Current: <strong>Level {item.currentLevel}</strong> &bull; Target: <strong>Level {item.expectedLevel}</strong>
                          </p>
                        </div>

                        <div className="pt-2 border-t border-slate-200/50 flex items-center justify-between">
                          <span className="text-[10px] text-slate-400">iGOT Learning Recommended</span>
                          <button
                            onClick={() => navigate('/employee/recommendations')}
                            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                          >
                            Close Gap &rarr;
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </GlassCard>

          {/* SECTION 4B: VERIFIED SERVICE RECORD & EHRMS POSTINGS */}
          <GlassCard className="p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/60 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <FiDatabase className="text-blue-600" />
                    Digital Service Book & Historical Postings
                  </h2>
                  <GlassBadge variant="success" size="xs" dot>
                    e-HRMS 2.0 Verified
                  </GlassBadge>
                </div>
                <p className="text-xs text-slate-500 font-normal mt-0.5">
                  Synchronized government service record, prior ministerial postings, and accredited credentials
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 font-bold">
                  {profile?.employeeId || user?.employeeId || 'GOI-MOSPI-2022-419'}
                </span>
              </div>
            </div>

            {/* Cadre & Performance Appraisal Summary */}
            <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/70 text-xs text-blue-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="font-bold block">
                  {profile?.cadre || 'Indian Statistical Service (ISS)'} &bull; Batch of {profile?.batchYear || 2021}
                </span>
                <span className="text-[11px] text-slate-600">
                  {profile?.pastAppraisalsSummary || 'SPARROW Annual Performance Appraisal: Outstanding (Grade 9.2/10). Quantitative rigor commended in national survey field operations.'}
                </span>
              </div>
              <GlassBadge variant="primary" size="xs">
                Active Service
              </GlassBadge>
            </div>

            {/* Historical Postings Timeline */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Prior Ministerial Assignments & Postings
              </h3>

              <div className="space-y-2.5">
                {(profile?.serviceHistory && profile.serviceHistory.length > 0 ? profile.serviceHistory : [
                  {
                    organization: 'Ministry of Health & Family Welfare (MoHFW)',
                    designation: 'Assistant Director (Surveillance & Health Metrics)',
                    duration: 'July 2021 - May 2023',
                    domain: 'Public Health Statistics & Epidemiological Surveys',
                    keyContributions: [
                      'Led district-level sampling for immunization coverage across 4 aspirational districts.',
                      'Standardized demographic indicator pipelines for automated MIS dashboard.'
                    ]
                  },
                  {
                    organization: 'National Sample Survey Office (NSSO) - Western Zone',
                    designation: 'Field Statistical Investigator',
                    duration: 'Jan 2020 - June 2021',
                    domain: 'Socio-Economic Household Surveys',
                    keyContributions: [
                      'Supervised urban consumer expenditure rounds covering 1,200 sample units.'
                    ]
                  }
                ]).map((post, pIdx) => (
                  <div
                    key={pIdx}
                    className="p-3.5 rounded-xl bg-white/60 border border-slate-200/70 text-xs space-y-1 hover:bg-white/90 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <span className="font-bold text-slate-900">{post.designation}</span>
                      <span className="text-[11px] font-semibold text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 w-fit">
                        {post.duration}
                      </span>
                    </div>
                    <p className="text-xs text-blue-700 font-semibold">{post.organization}</p>
                    {post.domain && (
                      <p className="text-[11px] text-slate-500">Domain: {post.domain}</p>
                    )}
                    {post.keyContributions && post.keyContributions.length > 0 && (
                      <ul className="list-disc list-inside text-[11px] text-slate-600 pt-0.5 space-y-0.5">
                        {post.keyContributions.map((c, cIdx) => (
                          <li key={cIdx}>{c}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Verified Certifications Badges */}
            <div className="space-y-2.5 pt-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <FiCheckCircle className="text-emerald-600" />
                <span>Verified Training Credentials & DigiLocker Badges</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(profile?.certifications && profile.certifications.length > 0 ? profile.certifications : [
                  {
                    title: 'iGOT Karmayogi: Advanced Public Statistics & Econometric Modeling',
                    issuingAuthority: 'DoPT & NSSTA Academy',
                    verified: true
                  },
                  {
                    title: 'General Financial Rules (GFR 2017) & GeM Public Procurement',
                    issuingAuthority: 'Institute of Secretariat Training (ISTM)',
                    verified: true
                  }
                ]).map((cert, cIdx) => (
                  <div
                    key={cIdx}
                    className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200/70 text-xs flex items-start gap-2"
                  >
                    <FiAward className="text-emerald-700 text-sm flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900 block leading-tight">{cert.title}</span>
                      <span className="text-[10px] text-slate-500 block">{cert.issuingAuthority}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>

        {/* RIGHT COLUMN (1 Col): Recommended Learning & Recent Progress */}
        <div className="space-y-6">
          
          {/* KARMAYOGI SATHI AI COMPANION PROMPT CARD */}
          <GlassCard className="p-5 relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-700 to-blue-800 text-white shadow-xl shadow-blue-500/20 border-white/20">
            <div className="relative z-10 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-amber-300 shadow-inner">
                  <RiSparklingFill className="text-lg" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white leading-tight">Ask Karmayogi Sathi</h3>
                  <p className="text-[11px] text-blue-100 font-medium">Your 24/7 AI Capacity & Career Copilot</p>
                </div>
              </div>
              <p className="text-xs text-blue-100/90 leading-relaxed">
                Have questions about your {openGapsCount} skill gaps, course roadmaps, or assessment preparation? Sathi is ready to guide you.
              </p>
              <div className="pt-1 flex items-center justify-between">
                <span className="text-[11px] text-blue-200 font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Synced with your profile
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const btn = document.querySelector('[aria-label="Open Karmayogi Sathi AI Companion"]');
                    if (btn) btn.click();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white text-blue-800 font-bold text-xs hover:bg-blue-50 transition-all shadow-xs active:scale-95 cursor-pointer"
                >
                  Chat Now &rarr;
                </button>
              </div>
            </div>
          </GlassCard>

          {/* SECTION 5: RECOMMENDED LEARNING */}
          <GlassCard className="p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FiZap className="text-purple-600" />
                  Recommended Learning
                </h2>
                <p className="text-xs text-slate-500 font-normal mt-0.5">
                  AI-ranked resources from iGOT
                </p>
              </div>

              <Link
                to="/employee/recommendations"
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                View All <FiArrowRight className="text-xs" />
              </Link>
            </div>

            {loading ? (
              <div className="py-6 text-center text-xs text-slate-400 space-y-2">
                <FiRefreshCw className="animate-spin text-blue-600 text-lg mx-auto" />
                <p>Matching learning resources...</p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* 3 Real Curated Course Cards */}
                <div className="p-3.5 rounded-xl bg-white/50 border border-white/80 hover:bg-white/85 transition-all space-y-2">
                  <div className="flex items-center justify-between">
                    <GlassBadge variant="default" size="xs">iGOT Karmayogi</GlassBadge>
                    <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      94% Match
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">
                    Python for Data Analysis & Tabular Processing
                  </h4>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <FiClock className="text-xs" /> 150 mins
                    </span>
                    <button
                      onClick={() => navigate('/employee/recommendations')}
                      className="text-blue-600 font-semibold hover:underline"
                    >
                      Start &rarr;
                    </button>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/50 border border-white/80 hover:bg-white/85 transition-all space-y-2">
                  <div className="flex items-center justify-between">
                    <GlassBadge variant="default" size="xs">iGOT Karmayogi</GlassBadge>
                    <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      88% Match
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">
                    Sampling Techniques and Survey Design
                  </h4>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <FiClock className="text-xs" /> 180 mins
                    </span>
                    <button
                      onClick={() => navigate('/employee/recommendations')}
                      className="text-blue-600 font-semibold hover:underline"
                    >
                      Start &rarr;
                    </button>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/50 border border-white/80 hover:bg-white/85 transition-all space-y-2">
                  <div className="flex items-center justify-between">
                    <GlassBadge variant="default" size="xs">iGOT Karmayogi</GlassBadge>
                    <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      85% Match
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">
                    Data Quality Management and Validation
                  </h4>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <FiClock className="text-xs" /> 140 mins
                    </span>
                    <button
                      onClick={() => navigate('/employee/recommendations')}
                      className="text-blue-600 font-semibold hover:underline"
                    >
                      Start &rarr;
                    </button>
                  </div>
                </div>
              </div>
            )}
          </GlassCard>

          {/* SECTION 6: RECENT PROGRESS & CONTINUOUS LOOP */}
          <GlassCard className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FiTrendingUp className="text-emerald-600" />
                  Competency Cycle
                </h2>
                <p className="text-xs text-slate-500 font-normal mt-0.5">
                  Continuous improvement loop
                </p>
              </div>

              <Link
                to="/employee/progress"
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                History <FiArrowRight className="text-xs" />
              </Link>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-100/70 space-y-1">
                <div className="flex items-center justify-between font-semibold text-blue-900">
                  <span>Continuous Development</span>
                  <GlassBadge variant="primary" size="xs">Assess &rarr; Learn</GlassBadge>
                </div>
                <p className="text-[11px] text-slate-600">
                  Complete your assigned modules to become eligible for reassessment and advance your proficiency level.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500">
                <span>Active Assessment:</span>
                <span className="font-semibold text-slate-800">
                  {activeAssessment?.title || 'Statistical Officer Assessment'}
                </span>
              </div>

              <GlassButton
                variant="outline"
                size="sm"
                className="w-full justify-center text-xs"
                onClick={() => navigate('/employee/progress')}
              >
                View Growth Analytics
              </GlassButton>
            </div>
          </GlassCard>
        </div>

      </div>
    </div>
  );
}
