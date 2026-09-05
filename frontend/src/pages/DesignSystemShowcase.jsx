import React, { useState } from 'react';
import {
  FiAward,
  FiBookOpen,
  FiTrendingUp,
  FiAlertCircle,
  FiCheckCircle,
  FiArrowRight,
  FiLayers,
  FiActivity,
  FiShield,
  FiCpu,
  FiBarChart2,
  FiUserCheck,
  FiFileText,
  FiHelpCircle,
} from 'react-icons/fi';
import { RiGovernmentLine, RiDashboard3Line } from 'react-icons/ri';
import GlassCard from '../components/common/GlassCard';
import GlassButton from '../components/common/GlassButton';
import GlassBadge from '../components/common/GlassBadge';
import ProgressBar from '../components/common/ProgressBar';
import StatMetric from '../components/common/StatMetric';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function DesignSystemShowcase() {
  const [btnLoading, setBtnLoading] = useState(false);
  const [progressVal, setProgressVal] = useState(65);

  return (
    <div className="min-h-screen ambient-canvas bg-canvas text-slate-800 relative pb-20">
      {/* Subtle Ambient Background Gradient Orbs */}
      <div className="ambient-glow-1" />
      <div className="ambient-glow-2" />
      <div className="ambient-glow-3" />

      {/* Top Banner / Gov Tech Header */}
      <header className="sticky top-0 z-30 bg-white/70 backdrop-blur-md border-b border-white/60 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
              <RiGovernmentLine className="text-xl" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-slate-900 tracking-tight">
                  Karmayogi AI
                </span>
                <GlassBadge variant="primary" size="xs">
                  Stage 1 Showcase
                </GlassBadge>
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-none">
                Competency Intelligence & Capacity Building Platform
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <GlassBadge variant="success" size="sm" dot>
              Design System Ready
            </GlassBadge>
            <GlassButton
              size="sm"
              variant="glass"
              icon={FiShield}
              onClick={() => alert('Design System Foundation Active')}
            >
              System Rubric
            </GlassButton>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10 relative z-10">
        
        {/* Intro Hero Section */}
        <section>
          <GlassCard variant="solid" className="p-8 sm:p-10 border-white/80">
            <div className="max-w-3xl space-y-3">
              <div className="flex items-center gap-2">
                <GlassBadge variant="purple" size="sm" icon={FiLayers}>
                  Foundation & Design Tokens
                </GlassBadge>
                <span className="text-xs text-slate-400 font-medium">Stage 1 Component Library</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Light Glassmorphism Design System
              </h1>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                Crafted specifically for the <strong className="text-slate-800">Karmayogi AI</strong> platform. 
                Features serene government-tech aesthetics, translucent frosted glass surfaces, 
                high-clarity typography, strict icon conventions (zero emojis), and responsive micro-interactions.
              </p>
            </div>
          </GlassCard>
        </section>

        {/* 1. Stat Metric Cards */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FiBarChart2 className="text-blue-600" />
              1. StatMetric Components
            </h2>
            <span className="text-xs text-slate-500 font-medium">Frosted KPI summary indicators</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatMetric
              title="Target Competencies"
              value="6"
              subtitle="Assigned for current role"
              icon={FiAward}
              iconColor="blue"
              trend="+1 Assessed"
              trendDirection="up"
            />
            <StatMetric
              title="Active Skill Gaps"
              value="2"
              subtitle="1 Critical, 1 High priority"
              icon={FiAlertCircle}
              iconColor="amber"
              trend="Needs Focus"
              trendDirection="down"
            />
            <StatMetric
              title="Recommended Courses"
              value="8"
              subtitle="Curated from iGOT Karmayogi"
              icon={FiBookOpen}
              iconColor="purple"
              trend="2 Enrolled"
              trendDirection="neutral"
            />
            <StatMetric
              title="Workforce Improvement"
              value="+24%"
              subtitle="Competency growth rate"
              icon={FiTrendingUp}
              iconColor="emerald"
              trend="+4.2 pts"
              trendDirection="up"
            />
          </div>
        </section>

        {/* 2. Glass Cards & Surface Variations */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FiLayers className="text-blue-600" />
              2. GlassCard Surface Variants
            </h2>
            <span className="text-xs text-slate-500 font-medium">Translucent backdrop-blur cards</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard variant="default">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Default Variant</span>
                  <GlassBadge variant="default" size="xs">72% Opacity</GlassBadge>
                </div>
                <h3 className="text-base font-semibold text-slate-900">Standard Frosted Card</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Used for main content blocks, list items, and standard section panels with backdrop-blur-md and subtle white borders.
                </p>
              </div>
            </GlassCard>

            <GlassCard variant="tinted" interactive>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Tinted + Interactive</span>
                  <GlassBadge variant="primary" size="xs">Hover Me</GlassBadge>
                </div>
                <h3 className="text-base font-semibold text-blue-950">Blue Ambient Tinted Card</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Smooth hover translation and glow. Perfect for clickable assessment cards, recommendation items, and modules.
                </p>
              </div>
            </GlassCard>

            <GlassCard variant="subtle">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Subtle Variant</span>
                  <GlassBadge variant="info" size="xs">Light Blur</GlassBadge>
                </div>
                <h3 className="text-base font-semibold text-slate-900">Light Translucent Surface</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Ultra-lightweight surface for secondary metadata, side notes, or nested sub-panels within larger cards.
                </p>
              </div>
            </GlassCard>
          </div>
        </section>

        {/* 3. Button Component Library */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FiActivity className="text-blue-600" />
              3. GlassButton Variants & States
            </h2>
            <span className="text-xs text-slate-500 font-medium">Interactive buttons with icon slots</span>
          </div>

          <GlassCard className="space-y-6">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Variants (Medium Size)</p>
              <div className="flex flex-wrap items-center gap-3">
                <GlassButton variant="primary" iconRight={FiArrowRight}>
                  Start Assessment
                </GlassButton>
                <GlassButton variant="secondary" icon={FiBookOpen}>
                  Browse Courses
                </GlassButton>
                <GlassButton variant="glass" icon={FiShield}>
                  View Competencies
                </GlassButton>
                <GlassButton variant="outline" icon={FiActivity}>
                  View History
                </GlassButton>
                <GlassButton variant="ghost" icon={FiHelpCircle}>
                  Guidelines
                </GlassButton>
                <GlassButton variant="success" icon={FiCheckCircle}>
                  Mark Complete
                </GlassButton>
                <GlassButton variant="danger" icon={FiAlertCircle}>
                  Flag Discrepancy
                </GlassButton>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200/60">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Sizes & Interactive States</p>
              <div className="flex flex-wrap items-center gap-3">
                <GlassButton size="xs" variant="primary">Extra Small</GlassButton>
                <GlassButton size="sm" variant="primary">Small</GlassButton>
                <GlassButton size="md" variant="primary">Medium (Default)</GlassButton>
                <GlassButton size="lg" variant="primary" iconRight={FiArrowRight}>Large Action</GlassButton>
                <GlassButton
                  variant="primary"
                  loading={btnLoading}
                  onClick={() => {
                    setBtnLoading(true);
                    setTimeout(() => setBtnLoading(false), 2000);
                  }}
                >
                  {btnLoading ? 'Processing...' : 'Click for Loading State'}
                </GlassButton>
                <GlassButton variant="primary" disabled>
                  Disabled Button
                </GlassButton>
              </div>
            </div>
          </GlassCard>
        </section>

        {/* 4. Badges & Priority Chips */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FiCheckCircle className="text-blue-600" />
              4. GlassBadge Component
            </h2>
            <span className="text-xs text-slate-500 font-medium">Priority, level, and category badges</span>
          </div>

          <GlassCard className="space-y-6">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Skill Gap Priorities</p>
              <div className="flex flex-wrap items-center gap-2.5">
                <GlassBadge variant="critical" dot icon={FiAlertCircle}>Critical Gap (Gap $\ge$ 3)</GlassBadge>
                <GlassBadge variant="high" dot icon={FiAlertCircle}>High Priority (Gap = 2)</GlassBadge>
                <GlassBadge variant="medium" dot>Medium Priority (Gap = 1)</GlassBadge>
                <GlassBadge variant="low" dot>Low Priority (Gap = 0)</GlassBadge>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200/60">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Competency Categories & Statuses</p>
              <div className="flex flex-wrap items-center gap-2.5">
                <GlassBadge variant="primary" icon={FiCpu}>Functional</GlassBadge>
                <GlassBadge variant="purple" icon={FiUserCheck}>Behavioral</GlassBadge>
                <GlassBadge variant="cyan" icon={FiFileText}>Domain</GlassBadge>
                <GlassBadge variant="success" dot>Resolved / Passed</GlassBadge>
                <GlassBadge variant="warning" dot>In Progress</GlassBadge>
                <GlassBadge variant="info">Level 4: Advanced</GlassBadge>
                <GlassBadge variant="default">iGOT Karmayogi</GlassBadge>
              </div>
            </div>
          </GlassCard>
        </section>

        {/* 5. Progress Bars & Indicators */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FiTrendingUp className="text-blue-600" />
              5. ProgressBar Components
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Interactive Slider:</span>
              <input
                type="range"
                min="0"
                max="100"
                value={progressVal}
                onChange={(e) => setProgressVal(Number(e.target.value))}
                className="w-24 accent-blue-600 cursor-pointer"
              />
              <span className="text-xs font-bold text-blue-700 w-8">{progressVal}%</span>
            </div>
          </div>

          <GlassCard className="space-y-5">
            <ProgressBar
              value={progressVal}
              labelText="Python for Data Analysis - Course Completion"
              showPercentage
              variant="blue"
              size="md"
            />
            <ProgressBar
              value={85}
              labelText="Sampling Design - Proficiency Target (Level 4)"
              showPercentage
              variant="emerald"
              size="md"
            />
            <ProgressBar
              value={40}
              labelText="Statistical Inference - Skill Gap Resolution"
              showPercentage
              variant="amber"
              size="sm"
            />
            <ProgressBar
              value={92}
              labelText="Overall Role Competency Match"
              showPercentage
              variant="gradient"
              size="lg"
            />
          </GlassCard>
        </section>

        {/* 6. Typography & Hierarchy */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FiFileText className="text-blue-600" />
              6. Typography & Hierarchy
            </h2>
            <span className="text-xs text-slate-500 font-medium">Inter font hierarchy</span>
          </div>

          <GlassCard className="space-y-4">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Page Heading (text-3xl font-extrabold)</p>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Statistical Officer Competency Assessment
              </h1>
            </div>

            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Section Heading (text-xl font-bold)</p>
              <h2 className="text-xl font-bold text-slate-800">
                Identified Skill Gaps & Recommended Learning
              </h2>
            </div>

            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Card Heading (text-base font-semibold)</p>
              <h3 className="text-base font-semibold text-slate-800">
                Python for Tabular Data Manipulation (Pandas)
              </h3>
            </div>

            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Body Text (text-sm text-slate-600)</p>
              <p className="text-sm text-slate-600 leading-relaxed">
                This course directly addresses your evaluated skill gap in Pandas data manipulation. Recommended duration is 150 minutes, available via the official iGOT Karmayogi capacity building portal.
              </p>
            </div>

            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Secondary Text & Metadata (text-xs text-slate-500)</p>
              <p className="text-xs text-slate-500">
                Last assessed: 30 Aug 2026 &bull; Position: Statistical Officer &bull; Department: MoSPI
              </p>
            </div>
          </GlassCard>
        </section>

        {/* 7. Loading States */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FiActivity className="text-blue-600" />
              7. LoadingSpinner Component
            </h2>
            <span className="text-xs text-slate-500 font-medium">Inline & card loader states</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard>
              <LoadingSpinner size="md" message="Evaluating competency assessment responses..." />
            </GlassCard>

            <GlassCard>
              <LoadingSpinner size="lg" message="Generating personalized iGOT recommendations..." />
            </GlassCard>
          </div>
        </section>

        {/* 8. Zero Emoji Icon Standard Check */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FiShield className="text-blue-600" />
              8. Icon Standards (React Icons Only — Zero Emojis)
            </h2>
            <GlassBadge variant="success" size="xs">Enforced Standard</GlassBadge>
          </div>

          <GlassCard>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 text-center">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex flex-col items-center gap-2">
                <FiAward className="text-2xl text-blue-600" />
                <span className="text-xs font-medium text-slate-600">Competency</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex flex-col items-center gap-2">
                <FiAlertCircle className="text-2xl text-amber-600" />
                <span className="text-xs font-medium text-slate-600">Skill Gap</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex flex-col items-center gap-2">
                <FiBookOpen className="text-2xl text-purple-600" />
                <span className="text-xs font-medium text-slate-600">Learning</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex flex-col items-center gap-2">
                <FiActivity className="text-2xl text-emerald-600" />
                <span className="text-xs font-medium text-slate-600">Assessment</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex flex-col items-center gap-2">
                <FiBarChart2 className="text-2xl text-indigo-600" />
                <span className="text-xs font-medium text-slate-600">Analytics</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex flex-col items-center gap-2">
                <RiGovernmentLine className="text-2xl text-cyan-700" />
                <span className="text-xs font-medium text-slate-600">Gov Portal</span>
              </div>
            </div>
          </GlassCard>
        </section>

      </main>
    </div>
  );
}
