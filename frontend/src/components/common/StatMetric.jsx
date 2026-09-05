import React from 'react';
import GlassCard from './GlassCard';

/**
 * Reusable StatMetric card for displaying quantitative indicators,
 * KPIs, and progress summaries in a light glass container.
 */
export default function StatMetric({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'blue', // 'blue' | 'purple' | 'emerald' | 'amber' | 'cyan' | 'rose'
  trend,
  trendDirection = 'neutral', // 'up' | 'down' | 'neutral'
  className = '',
  onClick,
}) {
  const iconThemes = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    cyan: 'bg-cyan-50 text-cyan-700 border-cyan-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
  };

  const trendStyles = {
    up: 'text-emerald-700 bg-emerald-50/80 border-emerald-200/80',
    down: 'text-rose-700 bg-rose-50/80 border-rose-200/80',
    neutral: 'text-slate-600 bg-slate-100/80 border-slate-200/80',
  };

  return (
    <GlassCard
      interactive={!!onClick}
      onClick={onClick}
      className={`relative overflow-hidden transition-all duration-200 ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              {value}
            </h3>
            {trend && (
              <span
                className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border ${trendStyles[trendDirection] || trendStyles.neutral}`}
              >
                {trend}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 font-normal pt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        {Icon && (
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center border shadow-xs flex-shrink-0 ${iconThemes[iconColor] || iconThemes.blue}`}
          >
            <Icon className="text-xl" />
          </div>
        )}
      </div>
    </GlassCard>
  );
}
