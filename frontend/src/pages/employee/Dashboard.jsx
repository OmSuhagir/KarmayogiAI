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
  const [compFilter, setCompFilter] = useState('all'); // 'all' | 'gaps' | 'met'
  const [showFullHistory, setShowFullHistory] = useState(false);

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
      
      {/* SECTION 1: CLEAN WELCOME HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
              {user?.department?.shortName || 'MoSPI'} &bull; {user?.position?.title || 'Statistical Officer'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1.5">
            {getGreeting()}, {user?.name?.split(' ')[0] || 'Officer'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Role competency profile, active skill gaps, and personalized capacity roadmap.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-shrink-0">
          <GlassButton
            variant="primary"
            size="sm"
            iconRight={FiArrowRight}
            onClick={() => navigate('/employee/assessments')}
          >
            Take Assessment
          </GlassButton>
          <GlassButton
            variant="outline"
            size="sm"
            icon={FiAlertCircle}
            onClick={() => navigate('/employee/skill-gaps')}
          >
            Skill Gaps ({openGapsCount})
          </GlassButton>
        </div>
      </div>

      {/* SECTION 2: PRIMARY KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatMetric
          title="Current Competency"
          value={loading ? '...' : `L${avgCurrentLevel}`}
          subtitle={loading ? 'Evaluating...' : `Across ${totalCompetencies} role competencies`}
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
              : `${criticalGapsCount} critical, ${highGapsCount} high priority`
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
              : `${metCount} of ${totalCompetencies} targets met`
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
        
        {/* LEFT COLUMN (2 Cols): Competency Matrix & Service Dossier */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* SECTION 3: ROLE COMPETENCY MATRIX (UNIFIED) */}
          <GlassCard className="p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FiAward className="text-blue-600" />
                  Role Competencies & Proficiency
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Benchmark requirements vs your current evaluated proficiency
                </p>
              </div>

              {/* Filter pills */}
              <div className="flex items-center gap-1.5 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setCompFilter('all')}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                    compFilter === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All ({competencies.length})
                </button>
                <button
                  type="button"
                  onClick={() => setCompFilter('gaps')}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                    compFilter === 'gaps'
                      ? 'bg-rose-600 text-white'
                      : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                  }`}
                >
                  Gaps ({openGapsCount})
                </button>
                <button
                  type="button"
                  onClick={() => setCompFilter('met')}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                    compFilter === 'met'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  }`}
                >
                  Met ({metCount})
                </button>
              </div>
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
              <div className="space-y-3">
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
                    const percent = Math.round((current / 5) * 100);

                    return (
                      <div
                        key={comp._id || idx}
                        className="p-3.5 rounded-lg bg-slate-50/70 border border-slate-100 hover:bg-slate-50 transition-all space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900">
                                {comp.name || 'Competency'}
                              </span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white text-slate-500 border border-slate-200">
                                {comp.category || 'Functional'}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 line-clamp-1">
                              {comp.description}
                            </p>
                          </div>

                          <div className="text-right flex items-center gap-2 flex-shrink-0">
                            <span className="text-xs text-slate-600 font-medium">
                              <strong className="text-slate-900">L{current}</strong> / L{expected}
                            </span>
                            {gap > 0 ? (
                              <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                                -{gap} Gap
                              </span>
                            ) : (
                              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                Met
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <ProgressBar
                              value={percent}
                              variant={gap > 0 ? 'blue' : 'emerald'}
                              size="xs"
                            />
                          </div>
                          {gap > 0 ? (
                            <button
                              type="button"
                              onClick={() => navigate('/employee/recommendations')}
                              className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-0.5 flex-shrink-0"
                            >
                              Close Gap &rarr;
                            </button>
                          ) : (
                            <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 flex-shrink-0">
                              <FiCheckCircle className="text-xs" /> Certified
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400">
                {metCount} of {totalCompetencies} benchmarks achieved
              </span>
              <Link
                to="/employee/competencies"
                className="font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                Full Competency Rubric &rarr;
              </Link>
            </div>
          </GlassCard>

          {/* SECTION 4B: VERIFIED SERVICE RECORD & EHRMS POSTINGS */}
          <GlassCard className="p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <FiDatabase className="text-blue-600" />
                    Digital Service Dossier
                  </h2>
                  <GlassBadge variant="success" size="xs" dot>
                    e-HRMS 2.0 Verified
                  </GlassBadge>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Synchronized government service book & accredited credentials
                </p>
              </div>

              <span className="text-[11px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-semibold w-fit">
                {profile?.employeeId || user?.employeeId || 'GOI-MOSPI-2022-419'}
              </span>
            </div>

            {/* Cadre & Performance Appraisal Summary */}
            <div className="p-3 rounded-lg bg-blue-50/60 border border-blue-100 text-xs text-blue-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-900 block">
                  {profile?.cadre || 'Indian Statistical Service (ISS)'} &bull; Batch of {profile?.batchYear || 2021}
                </span>
                <span className="text-[11px] text-slate-600">
                  {profile?.pastAppraisalsSummary || 'SPARROW Annual Performance Appraisal: Outstanding (Grade 9.2/10).'}
                </span>
              </div>
              <GlassBadge variant="primary" size="xs">
                Active Service
              </GlassBadge>
            </div>

            {/* Verified Certifications Badges */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <FiCheckCircle className="text-emerald-600" /> Verified Accreditations
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(profile?.certifications && profile.certifications.length > 0 ? profile.certifications : [
                  {
                    title: 'iGOT Karmayogi: Advanced Public Statistics',
                    issuingAuthority: 'DoPT & NSSTA Academy',
                  },
                  {
                    title: 'General Financial Rules (GFR 2017) & GeM',
                    issuingAuthority: 'ISTM',
                  }
                ]).map((cert, cIdx) => (
                  <div
                    key={cIdx}
                    className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs flex items-center gap-2"
                  >
                    <FiAward className="text-emerald-600 text-sm flex-shrink-0" />
                    <div className="truncate">
                      <span className="font-semibold text-slate-900 block truncate">{cert.title}</span>
                      <span className="text-[10px] text-slate-500 block">{cert.issuingAuthority}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Collapsible History Toggle */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowFullHistory(!showFullHistory)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                {showFullHistory ? 'Hide Postings Timeline' : 'View Prior Postings & Career Timeline'} &rarr;
              </button>
            </div>

            {/* Historical Postings Timeline (Collapsible) */}
            {showFullHistory && (
              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                {(profile?.serviceHistory && profile.serviceHistory.length > 0 ? profile.serviceHistory : [
                  {
                    organization: 'Ministry of Health & Family Welfare (MoHFW)',
                    designation: 'Assistant Director (Surveillance & Health Metrics)',
                    duration: 'July 2021 - May 2023',
                    domain: 'Public Health Statistics & Epidemiological Surveys',
                  },
                  {
                    organization: 'National Sample Survey Office (NSSO) - Western Zone',
                    designation: 'Field Statistical Investigator',
                    duration: 'Jan 2020 - June 2021',
                    domain: 'Socio-Economic Household Surveys',
                  }
                ]).map((post, pIdx) => (
                  <div
                    key={pIdx}
                    className="p-3 rounded-lg bg-slate-50 border border-slate-200/60 text-xs space-y-0.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{post.designation}</span>
                      <span className="text-[10px] text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                        {post.duration}
                      </span>
                    </div>
                    <p className="text-xs text-blue-700 font-medium">{post.organization}</p>
                    {post.domain && <p className="text-[11px] text-slate-500">Domain: {post.domain}</p>}
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </div>

        {/* RIGHT COLUMN (1 Col): Recommended Learning & Assistant */}
        <div className="space-y-6">
          
          {/* KARMAYOGI SATHI AI COMPANION CARD */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-700 to-indigo-800 text-white shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center text-amber-300">
                  <RiSparklingFill className="text-base" />
                </div>
                <div>
                  <h3 className="text-xs font-bold leading-tight">Karmayogi Sathi</h3>
                  <p className="text-[10px] text-blue-200">AI Capacity Copilot</p>
                </div>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <p className="text-xs text-blue-100 leading-snug">
              Ask Sathi about your {openGapsCount} skill gaps, course roadmaps, or assessment preparation.
            </p>
            <button
              type="button"
              onClick={() => {
                const btn = document.querySelector('[aria-label="Open Karmayogi Sathi AI Companion"]');
                if (btn) btn.click();
              }}
              className="w-full py-1.5 rounded-lg bg-white text-blue-800 font-bold text-xs hover:bg-blue-50 transition-all text-center cursor-pointer"
            >
              Open AI Assistant &rarr;
            </button>
          </div>

          {/* SECTION 5: RECOMMENDED LEARNING */}
          <GlassCard className="p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <FiZap className="text-purple-600" />
                  Recommended Courses
                </h2>
                <p className="text-[11px] text-slate-500">
                  AI-ranked from iGOT Karmayogi
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
              <div className="space-y-2.5">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1.5 hover:bg-slate-100/70 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-medium">iGOT Karmayogi</span>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      94% Match
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">
                    Python for Data Analysis & Tabular Processing
                  </h4>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
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

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1.5 hover:bg-slate-100/70 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-medium">iGOT Karmayogi</span>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      88% Match
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">
                    Sampling Techniques and Survey Design
                  </h4>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
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

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1.5 hover:bg-slate-100/70 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-medium">iGOT Karmayogi</span>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      85% Match
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">
                    Data Quality Management and Validation
                  </h4>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
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

          {/* SECTION 6: COMPETENCY CYCLE */}
          <GlassCard className="p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <FiTrendingUp className="text-emerald-600" />
                  Development Cycle
                </h2>
                <p className="text-[11px] text-slate-500">
                  Assess &bull; Learn &bull; Advance
                </p>
              </div>

              <Link
                to="/employee/progress"
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                Analytics <FiArrowRight className="text-xs" />
              </Link>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                <span className="font-semibold text-slate-900 block">Current Focus</span>
                <p className="text-[11px] text-slate-500">
                  Complete {openGapsCount} courses to unlock reassessment and advance proficiency.
                </p>
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
