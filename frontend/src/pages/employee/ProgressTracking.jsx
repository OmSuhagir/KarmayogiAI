import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiTrendingUp,
  FiAward,
  FiCheckCircle,
  FiArrowRight,
  FiCalendar,
} from 'react-icons/fi';
import GlassCard from '../../components/common/GlassCard';
import GlassButton from '../../components/common/GlassButton';
import GlassBadge from '../../components/common/GlassBadge';
import ProgressBar from '../../components/common/ProgressBar';

export default function ProgressTracking() {
  const navigate = useNavigate();

  const competencyTimeline = [
    {
      competency: 'Statistical Analysis & Reporting',
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
      {/* Clean Page Header */}
      <div className="rounded-2xl bg-[#FFFDF8] border border-[#DDD9CF] p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-[#F8F6F0] text-[#62615D] border border-[#DDD9CF]">
              Continuous Progression
            </span>
            <span className="text-[11px] text-[#8A8882]">Longitudinal Competency Tracking</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#111111] tracking-tight mt-1.5">
            Competency Growth Timeline
          </h1>
          <p className="text-xs sm:text-sm text-[#62615D] mt-0.5">
            Track verified proficiency growth across assessment, learning, and reassessment cycles.
          </p>
        </div>

        <GlassButton
          variant="primary"
          size="sm"
          iconRight={FiArrowRight}
          onClick={() => navigate('/employee/assessments')}
        >
          Take Reassessment
        </GlassButton>
      </div>

      {/* Progression Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {competencyTimeline.map((item, idx) => (
          <div
            key={idx}
            className="rounded-xl bg-[#FFFDF8] border border-[#DDD9CF] p-5 space-y-3 shadow-xs"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#F8F6F0] text-[#62615D] border border-[#DDD9CF]">
                  {item.category}
                </span>
                <h2 className="text-sm font-bold text-[#111111]">
                  {item.competency}
                </h2>
              </div>

              {item.status === 'Target Met' ? (
                <GlassBadge variant="success" size="xs">
                  Target Achieved
                </GlassBadge>
              ) : (
                <GlassBadge variant="warning" size="xs">
                  Target: L{item.targetLevel}
                </GlassBadge>
              )}
            </div>

            {/* Step Matrix */}
            <div className="grid grid-cols-3 gap-2 p-3 rounded-lg bg-[#F8F6F0] border border-[#DDD9CF] text-center text-xs">
              <div>
                <span className="text-[10px] text-[#8A8882] font-bold uppercase block">Baseline</span>
                <span className="text-sm font-semibold text-[#62615D]">Level {item.initialLevel}</span>
              </div>
              <div className="border-x border-[#DDD9CF] bg-[#FFFDF8] rounded">
                <span className="text-[10px] text-[#3348A8] font-bold uppercase block">Current</span>
                <span className="text-sm font-bold text-[#111111]">Level {item.currentLevel}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#8A8882] font-bold uppercase block">Target</span>
                <span className="text-sm font-semibold text-[#111111]">Level {item.targetLevel}</span>
              </div>
            </div>

            <ProgressBar
              value={Math.round((item.currentLevel / item.targetLevel) * 100)}
              variant={item.currentLevel >= item.targetLevel ? 'emerald' : 'primary'}
              size="xs"
              labelText={`Role Target Fulfillment: ${Math.round((item.currentLevel / item.targetLevel) * 100)}%`}
              showPercentage
            />

            <div className="pt-2 border-t border-[#DDD9CF] flex items-center justify-between text-[11px] text-[#8A8882]">
              <span className="flex items-center gap-1">
                <FiCalendar className="text-xs" /> Assessed: {item.lastAssessed}
              </span>
              <span className="font-semibold text-[#52745D]">{item.improvement}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
