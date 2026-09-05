import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiUsers,
  FiTrendingUp,
  FiAlertCircle,
  FiAward,
  FiZap,
  FiArrowRight,
  FiActivity,
  FiLayers,
  FiShield,
  FiBookOpen,
  FiHelpCircle,
  FiFileText,
  FiRefreshCw,
} from 'react-icons/fi';
import { RiGovernmentLine, RiBuildingLine } from 'react-icons/ri';
import { useAuth } from '../../context/AuthContext';
import { getAdminDashboard } from '../../services/adminService';
import GlassCard from '../../components/common/GlassCard';
import GlassButton from '../../components/common/GlassButton';
import GlassBadge from '../../components/common/GlassBadge';
import StatMetric from '../../components/common/StatMetric';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalDepartments: 0,
    totalPositions: 0,
    totalRoles: 0,
    totalCompetencies: 0,
    totalAssessments: 0,
    completedAssessments: 0,
    totalOpenSkillGaps: 0,
    criticalSkillGaps: 0,
    learningResources: 0,
    pendingQuestions: 0,
    approvedQuestions: 0,
    averageWorkforceReadiness: 0,
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await getAdminDashboard();
      const payload = res?.data || res;
      if (payload && typeof payload === 'object') {
        setStats(payload);
      }
    } catch (err) {
      console.warn('Failed to load admin dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-8 pb-12">
      
      {/* SECTION 1: WELCOME BANNER */}
      <GlassCard variant="solid" className="p-6 sm:p-8 border-white/80 space-y-4 shadow-glass">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <GlassBadge variant="purple" size="xs">
                MDO Capacity Oversight
              </GlassBadge>
              <span className="text-xs text-slate-400 font-medium">
                {user?.department?.name || 'Ministry of Statistics and Programme Implementation'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Workforce Competency Intelligence
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl font-normal leading-relaxed">
              Real-time monitoring of civil services workforce readiness, competency gap distributions, assessment performance, and AI-assisted question generation.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <GlassButton
              variant="primary"
              size="md"
              icon={FiZap}
              className="bg-gradient-to-r from-indigo-700 to-slate-900 hover:from-indigo-800 hover:to-black text-white shadow-md shadow-indigo-500/20"
              onClick={() => navigate('/admin/ai-question-review')}
            >
              AI Question Studio
            </GlassButton>
            <GlassButton
              variant="glass"
              size="md"
              icon={FiRefreshCw}
              loading={loading}
              onClick={loadData}
            >
              Refresh
            </GlassButton>
          </div>
        </div>
      </GlassCard>

      {/* SECTION 2: 8 PRIMARY WORKFORCE KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <StatMetric
          title="Total Officers"
          value={loading ? '...' : String(stats.totalEmployees || 0)}
          subtitle="Enrolled civil service officers"
          icon={FiUsers}
          iconColor="blue"
          trend="Active Cadre"
          trendDirection="neutral"
          onClick={() => navigate('/admin/employees')}
        />

        <StatMetric
          title="Departments"
          value={loading ? '...' : String(stats.totalDepartments || 0)}
          subtitle="Ministries & Divisions participating"
          icon={RiBuildingLine}
          iconColor="indigo"
          trend="Organization"
          trendDirection="neutral"
          onClick={() => navigate('/admin/departments')}
        />

        <StatMetric
          title="Active Assessments"
          value={loading ? '...' : String(stats.totalAssessments || 0)}
          subtitle={`${stats.completedAssessments || 0} total attempts completed`}
          icon={FiFileText}
          iconColor="emerald"
          trend="Evaluations"
          trendDirection="up"
          onClick={() => navigate('/admin/assessments')}
        />

        <StatMetric
          title="Avg Workforce Readiness"
          value={loading ? '...' : `${stats.averageWorkforceReadiness || 0}%`}
          subtitle="Target competency levels satisfied"
          icon={FiTrendingUp}
          iconColor={(stats.averageWorkforceReadiness || 0) >= 75 ? 'emerald' : 'amber'}
          trend="Readiness %"
          trendDirection={(stats.averageWorkforceReadiness || 0) >= 75 ? 'up' : 'neutral'}
          onClick={() => navigate('/admin/analytics')}
        />

        <StatMetric
          title="Total Skill Gaps"
          value={loading ? '...' : String(stats.totalOpenSkillGaps || 0)}
          subtitle="Identified competency deficits"
          icon={FiAlertCircle}
          iconColor={(stats.totalOpenSkillGaps || 0) > 0 ? 'amber' : 'emerald'}
          trend={`${stats.totalOpenSkillGaps || 0} Open`}
          trendDirection={(stats.totalOpenSkillGaps || 0) > 0 ? 'down' : 'up'}
          onClick={() => navigate('/admin/analytics')}
        />

        <StatMetric
          title="Critical Priority Gaps"
          value={loading ? '...' : String(stats.criticalSkillGaps || 0)}
          subtitle="Gaps of 2+ proficiency levels"
          icon={FiAlertCircle}
          iconColor={(stats.criticalSkillGaps || 0) > 0 ? 'rose' : 'emerald'}
          trend="Immediate Action"
          trendDirection={(stats.criticalSkillGaps || 0) > 0 ? 'down' : 'up'}
          onClick={() => navigate('/admin/analytics')}
        />

        <StatMetric
          title="Pending AI Questions"
          value={loading ? '...' : String(stats.pendingQuestions || 0)}
          subtitle="Awaiting administrative approval"
          icon={FiZap}
          iconColor={(stats.pendingQuestions || 0) > 0 ? 'purple' : 'neutral'}
          trend="Gemini Studio"
          trendDirection="neutral"
          onClick={() => navigate('/admin/ai-question-review')}
        />

        <StatMetric
          title="Learning Resources"
          value={loading ? '...' : String(stats.learningResources || 0)}
          subtitle="iGOT courses & uploaded material"
          icon={FiBookOpen}
          iconColor="blue"
          trend="Catalogue"
          trendDirection="up"
          onClick={() => navigate('/admin/learning')}
        />

      </div>

      {/* SECTION 3: CORE MANAGEMENT ACCESS MODULES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Module 1: Workforce & Officers */}
        <GlassCard className="p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center">
                <FiUsers className="text-xl" />
              </div>
              <GlassBadge variant="primary" size="xs">
                {stats.totalEmployees || 0} Officers
              </GlassBadge>
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Officer Rosters & Profiles
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Inspect officer competency audits, assessment timelines, individualized skill gaps, and learning progression.
            </p>
          </div>
          <GlassButton
            variant="outline"
            size="sm"
            className="w-full justify-center"
            iconRight={FiArrowRight}
            onClick={() => navigate('/admin/employees')}
          >
            Manage Officers
          </GlassButton>
        </GlassCard>

        {/* Module 2: AI Question Studio */}
        <GlassCard className="p-6 space-y-4 flex flex-col justify-between border-indigo-200/80">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 border border-purple-100 flex items-center justify-center">
                <FiZap className="text-xl" />
              </div>
              <GlassBadge variant="purple" size="xs">
                Gemini GenAI
              </GlassBadge>
            </div>
            <h3 className="text-base font-bold text-slate-900">
              AI Question Studio
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Upload official policy documents, synthesize standardized MCQs via Gemini, and approve items for assessment banks.
            </p>
          </div>
          <GlassButton
            variant="primary"
            size="sm"
            className="w-full justify-center bg-gradient-to-r from-indigo-700 to-slate-900 text-white"
            iconRight={FiArrowRight}
            onClick={() => navigate('/admin/ai-question-review')}
          >
            Open AI Studio
          </GlassButton>
        </GlassCard>

        {/* Module 3: Learning Resources */}
        <GlassCard className="p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center">
                <FiBookOpen className="text-xl" />
              </div>
              <GlassBadge variant="success" size="xs">
                {stats.learningResources || 0} Mapped
              </GlassBadge>
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Learning Material & Document Upload
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Upload official manuals and PDF guides, map them to competencies and target proficiency levels, and deploy to iGOT hub.
            </p>
          </div>
          <GlassButton
            variant="outline"
            size="sm"
            className="w-full justify-center"
            iconRight={FiArrowRight}
            onClick={() => navigate('/admin/learning')}
          >
            Manage Learning Material
          </GlassButton>
        </GlassCard>

      </div>

    </div>
  );
}
