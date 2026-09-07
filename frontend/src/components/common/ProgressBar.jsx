import React from 'react';

/**
 * Reusable ProgressBar with warm neutral tracks and clean, purposeful fills.
 */
export default function ProgressBar({
  value = 0,
  max = 100,
  variant = 'blue', // 'primary' | 'blue' | 'emerald' | 'amber' | 'neutral'
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
    primary: 'bg-[#111111]',
    blue: 'bg-[#3348A8]',
    emerald: 'bg-[#52745D]',
    amber: 'bg-[#A8752E]',
    neutral: 'bg-[#62615D]',
  };

  return (
    <div className={`w-full ${className}`}>
      {(showLabel || showPercentage) && (
        <div className="flex items-center justify-between text-xs font-medium text-[#62615D] mb-1.5">
          <span>{labelText || ''}</span>
          {showPercentage && <span className="text-[#111111] font-semibold">{percentage}%</span>}
        </div>
      )}
      <div className={`w-full bg-[#E8E4D9] border border-[#DDD9CF] overflow-hidden ${sizeStyles[size] || sizeStyles.md}`}>
        <div
          className={`h-full transition-all duration-500 ease-out rounded-full ${variantFills[variant] || variantFills.blue}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
