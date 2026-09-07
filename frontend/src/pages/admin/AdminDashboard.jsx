import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiUsers,
  FiTrendingUp,
  FiAlertCircle,
  FiAward,
  FiZap,
  FiArrowRight,
  FiBookOpen,
  FiFileText,
  FiRefreshCw,
} from 'react-icons/fi';
import { RiBuildingLine } from 'react-icons/ri';
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
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="rounded-2xl bg-[#FFFDF8] border border-[#DDD9CF] p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-[#111111] text-[#FFFDF8]">
              Governance & Oversight
            </span>
            <span className="text-[11px] text-[#8A8882]">
              {user?.department?.name || 'Ministry of Statistics and Programme Implementation'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#111111] tracking-tight mt-1.5">
            Workforce Competency Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-[#62615D] mt-0.5">
            Civil services workforce readiness, competency gap distributions, assessment analytics, and AI question supervision.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-shrink-0">
          <GlassButton
            variant="primary"
            size="sm"
            icon={FiZap}
            onClick={() => navigate('/admin/ai-question-review')}
          >
            AI Question Studio
          </GlassButton>
          <GlassButton
            variant="secondary"
            size="sm"
            icon={FiRefreshCw}
            loading={loading}
            onClick={loadData}
          >
            Refresh
          </GlassButton>
        </div>
      </div>

      {/* 8 Workforce KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatMetric
          title="Total Officers"
          value={loading ? '...' : String(stats.totalEmployees || 0)}
          subtitle="Enrolled civil service officers"
          icon={FiUsers}
          iconColor="blue"
          onClick={() => navigate('/admin/employees')}
        />

        <StatMetric
          title="Departments"
          value={loading ? '...' : String(stats.totalDepartments || 0)}
          subtitle="Ministries & Divisions"
          icon={RiBuildingLine}
          iconColor="neutral"
          onClick={() => navigate('/admin/departments')}
        />

        <StatMetric
          title="Assessments"
          value={loading ? '...' : String(stats.totalAssessments || 0)}
          subtitle={`${stats.completedAssessments || 0} completed`}
          icon={FiFileText}
          iconColor="emerald"
          onClick={() => navigate('/admin/assessments')}
        />

        <StatMetric
          title="Avg Readiness"
          value={loading ? '...' : `${stats.averageWorkforceReadiness || 0}%`}
          subtitle="Workforce benchmark met"
          icon={FiTrendingUp}
          iconColor="emerald"
          onClick={() => navigate('/admin/analytics')}
        />

        <StatMetric
          title="Skill Gaps"
          value={loading ? '...' : String(stats.totalOpenSkillGaps || 0)}
          subtitle="Identified deficits"
          icon={FiAlertCircle}
          iconColor="amber"
          onClick={() => navigate('/admin/analytics')}
        />

        <StatMetric
          title="Critical Gaps"
          value={loading ? '...' : String(stats.criticalSkillGaps || 0)}
          subtitle="Priority +2 levels"
          icon={FiAlertCircle}
          iconColor="rose"
          onClick={() => navigate('/admin/analytics')}
        />

        <StatMetric
          title="Pending AI Qs"
          value={loading ? '...' : String(stats.pendingQuestions || 0)}
          subtitle="Awaiting human review"
          icon={FiZap}
          iconColor="amber"
          onClick={() => navigate('/admin/ai-question-review')}
        />

        <StatMetric
          title="Resources"
          value={loading ? '...' : String(stats.learningResources || 0)}
          subtitle="iGOT courses mapped"
          icon={FiBookOpen}
          iconColor="blue"
          onClick={() => navigate('/admin/learning')}
        />
      </div>

      {/* Core Management Modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Module 1 */}
        <div className="rounded-xl bg-[#FFFDF8] border border-[#DDD9CF] p-5 space-y-3 flex flex-col justify-between shadow-xs">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8A8882]">
                Workforce Directory
              </span>
              <span className="text-xs font-semibold text-[#111111]">
                {stats.totalEmployees || 0} Officers
              </span>
            </div>
            <h3 className="text-base font-bold text-[#111111]">
              Officer Rosters & Audits
            </h3>
            <p className="text-xs text-[#62615D] leading-relaxed">
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
        </div>

        {/* Module 2 */}
        <div className="rounded-xl bg-[#FFFDF8] border border-[#DDD9CF] p-5 space-y-3 flex flex-col justify-between shadow-xs">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#3348A8]">
                Gemini GenAI
              </span>
              <span className="text-xs font-semibold text-[#111111]">
                {stats.pendingQuestions || 0} Pending
              </span>
            </div>
            <h3 className="text-base font-bold text-[#111111]">
              AI Question Studio
            </h3>
            <p className="text-xs text-[#62615D] leading-relaxed">
              Upload official policy documents, synthesize standardized MCQs via Gemini, and approve items for assessment banks.
            </p>
          </div>
          <GlassButton
            variant="primary"
            size="sm"
            className="w-full justify-center"
            iconRight={FiArrowRight}
            onClick={() => navigate('/admin/ai-question-review')}
          >
            Open AI Studio
          </GlassButton>
        </div>

        {/* Module 3 */}
        <div className="rounded-xl bg-[#FFFDF8] border border-[#DDD9CF] p-5 space-y-3 flex flex-col justify-between shadow-xs">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#52745D]">
                iGOT Catalogue
              </span>
              <span className="text-xs font-semibold text-[#111111]">
                {stats.learningResources || 0} Mapped
              </span>
            </div>
            <h3 className="text-base font-bold text-[#111111]">
              Learning Resources & Documents
            </h3>
            <p className="text-xs text-[#62615D] leading-relaxed">
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
        </div>
      </div>
    </div>
  );
}
