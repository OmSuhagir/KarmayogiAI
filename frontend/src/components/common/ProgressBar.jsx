import React from 'react';

/**
 * Reusable ProgressBar with subtle gradient fill, frosted track,
 * and optional labels/levels.
 */
export default function ProgressBar({
  value = 0,
  max = 100,
  variant = 'blue', // 'blue' | 'emerald' | 'amber' | 'purple' | 'cyan' | 'gradient'
  size = 'md', // 'xs' | 'sm' | 'md' | 'lg'
  showLabel = false,
  labelText,
  showPercentage = false,
  className = '',
}) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const sizeStyles = {
    xs: 'h-1.5 rounded-full',
    sm: 'h-2 rounded-full',
    md: 'h-2.5 rounded-full',
    lg: 'h-3.5 rounded-full',
  };

  const variantFills = {
    blue: 'bg-gradient-to-r from-blue-500 to-indigo-600',
    emerald: 'bg-gradient-to-r from-emerald-400 to-teal-600',
    amber: 'bg-gradient-to-r from-amber-400 to-orange-500',
    purple: 'bg-gradient-to-r from-purple-500 to-indigo-500',
    cyan: 'bg-gradient-to-r from-cyan-500 to-blue-500',
    gradient: 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500',
  };

  return (
    <div className={`w-full ${className}`}>
      {(showLabel || showPercentage) && (
        <div className="flex items-center justify-between text-xs font-medium text-slate-600 mb-1.5">
          <span>{labelText || ''}</span>
          {showPercentage && <span className="text-slate-800 font-semibold">{percentage}%</span>}
        </div>
      )}
      <div className={`w-full bg-slate-200/70 border border-white/50 backdrop-blur-xs overflow-hidden ${sizeStyles[size] || sizeStyles.md}`}>
        <div
          className={`h-full transition-all duration-500 ease-out rounded-full ${variantFills[variant] || variantFills.blue}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
