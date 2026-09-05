import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiTrendingUp,
  FiAward,
  FiCheckCircle,
  FiArrowRight,
  FiCalendar,
  FiActivity,
  FiShield,
} from 'react-icons/fi';
import GlassCard from '../../components/common/GlassCard';
import GlassButton from '../../components/common/GlassButton';
import GlassBadge from '../../components/common/GlassBadge';
import ProgressBar from '../../components/common/ProgressBar';

export default function ProgressTracking() {
  const navigate = useNavigate();

  // Real mock timeline demonstrating the continuous improvement loop
  const competencyTimeline = [
    {
      competency: 'Statistical Analysis',
      category: 'Functional',
      initialLevel: 2,
      currentLevel: 3,
      targetLevel: 4,
      improvement: '+1 Level',
      status: 'In Progress',
      lastAssessed: '30 Aug 2026',
    },
    {
      competency: 'SQL and Database Management',
      category: 'Functional',
      initialLevel: 2,
      currentLevel: 3,
      targetLevel: 3,
      improvement: '+1 Level',
      status: 'Target Met',
      lastAssessed: '30 Aug 2026',
    },
    {
      competency: 'Python for Data Analysis',
      category: 'Functional',
      initialLevel: 1,
      currentLevel: 1,
      targetLevel: 3,
      improvement: '0 Levels',
      status: 'Needs Assessment',
      lastAssessed: '30 Aug 2026',
    },
    {
      competency: 'Sampling Design',
      category: 'Functional',
      initialLevel: 2,
      currentLevel: 2,
      targetLevel: 4,
      improvement: '0 Levels',
      status: 'Needs Assessment',
      lastAssessed: '30 Aug 2026',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <GlassCard variant="solid" className="p-6 sm:p-8 border-white/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <GlassBadge variant="success" size="xs">
                Competency Progression
              </GlassBadge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              My Competency Improvement
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl font-normal leading-relaxed">
              Track your evaluated growth across capacity-building cycles: <strong className="text-slate-800">Assess &rarr; Analyze &rarr; Learn &rarr; Reassess &rarr; Improve</strong>.
            </p>
          </div>

          <GlassButton
            variant="primary"
            size="md"
            iconRight={FiArrowRight}
            onClick={() => navigate('/employee/assessments')}
          >
            Take Reassessment
          </GlassButton>
        </div>
      </GlassCard>

      {/* Progression Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {competencyTimeline.map((item, idx) => (
          <GlassCard key={idx} className="p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <GlassBadge variant="primary" size="xs">
                  {item.category}
                </GlassBadge>
                <h2 className="text-base font-bold text-slate-900">
                  {item.competency}
                </h2>
              </div>

              {item.status === 'Target Met' ? (
                <GlassBadge variant="success" size="xs" dot>
                  Target Achieved
                </GlassBadge>
              ) : (
                <GlassBadge variant="high" size="xs" dot>
                  Target: L{item.targetLevel}
                </GlassBadge>
              )}
            </div>

            {/* Progression Stepper */}
            <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-50/80 border border-slate-200/60 text-center">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Baseline</span>
                <span className="text-sm font-bold text-slate-600">Level {item.initialLevel}</span>
              </div>
              <div className="border-x border-slate-200/80 bg-blue-50/50 rounded-lg">
                <span className="text-[10px] text-blue-600 font-bold uppercase block">Current</span>
                <span className="text-sm font-extrabold text-blue-700">Level {item.currentLevel}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Target</span>
                <span className="text-sm font-bold text-slate-800">Level {item.targetLevel}</span>
              </div>
            </div>

            <ProgressBar
              value={Math.round((item.currentLevel / item.targetLevel) * 100)}
              variant={item.currentLevel >= item.targetLevel ? 'emerald' : 'blue'}
              size="xs"
              labelText={`Role Target Fulfillment: ${Math.round((item.currentLevel / item.targetLevel) * 100)}%`}
              showPercentage
            />

            <div className="pt-2 border-t border-slate-200/50 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <FiCalendar className="text-xs" /> Last assessed: {item.lastAssessed}
              </span>
              <span className="font-semibold text-emerald-600">{item.improvement}</span>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
