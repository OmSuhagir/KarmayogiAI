import React from 'react';
import GlassCard from './GlassCard';

/**
 * Reusable StatMetric card for displaying quantitative indicators,
 * KPIs, and progress summaries in warm beige GovTech styling.
 */
export default function StatMetric({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'blue', // 'blue' | 'emerald' | 'amber' | 'neutral' | 'rose'
  trend,
  trendDirection = 'neutral', // 'up' | 'down' | 'neutral'
  className = '',
  onClick,
}) {
  const iconThemes = {
    blue: 'bg-[#E9EDFF] text-[#3348A8] border-[#CAD5FF]',
    emerald: 'bg-[#EAF2EC] text-[#52745D] border-[#C5DDCB]',
    amber: 'bg-[#F7EEDC] text-[#A8752E] border-[#ECD9BA]',
    neutral: 'bg-[#F8F6F0] text-[#111111] border-[#DDD9CF]',
    rose: 'bg-[#F8E9E7] text-[#A54C45] border-[#E8C2BF]',
  };

  const trendStyles = {
    up: 'text-[#52745D] bg-[#EAF2EC] border-[#C5DDCB]',
    down: 'text-[#A54C45] bg-[#F8E9E7] border-[#E8C2BF]',
    neutral: 'text-[#62615D] bg-[#F8F6F0] border-[#DDD9CF]',
  };

  return (
    <GlassCard
      interactive={!!onClick}
      onClick={onClick}
      className={`relative overflow-hidden transition-all duration-200 bg-[#FFFDF8] border border-[#DDD9CF] ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#8A8882]">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111]">
              {value}
            </h3>
            {trend && (
              <span
                className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md border ${trendStyles[trendDirection] || trendStyles.neutral}`}
              >
                {trend}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-[#62615D] font-normal pt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        {Icon && (
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center border shadow-xs flex-shrink-0 ${iconThemes[iconColor] || iconThemes.neutral}`}
          >
            <Icon className="text-lg" />
          </div>
        )}
      </div>
    </GlassCard>
  );
}
