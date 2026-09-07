import React from 'react';

/**
 * Reusable GlassBadge component for skill priorities, competency levels,
 * status flags, categories, and provider tags.
 */
export default function GlassBadge({
  children,
  variant = 'default', // 'default' | 'primary' | 'critical' | 'high' | 'medium' | 'low' | 'success' | 'warning' | 'info' | 'purple' | 'cyan'
  size = 'md', // 'xs' | 'sm' | 'md'
  icon: Icon,
  dot = false,
  className = '',
}) {
  const sizeStyles = {
    xs: 'px-2 py-0.5 text-[10px] font-semibold gap-1 rounded-md',
    sm: 'px-2.5 py-0.5 text-xs font-semibold gap-1.5 rounded-lg',
    md: 'px-3 py-1 text-xs font-semibold gap-1.5 rounded-lg',
  };

  const variantStyles = {
    default: 'bg-[#F8F6F0] text-[#62615D] border border-[#DDD9CF]',
    primary: 'bg-[#F4F1E9] text-[#111111] border border-[#DDD9CF]',
    critical: 'bg-[#F8E9E7] text-[#A54C45] border border-[#A54C45]/30',
    high: 'bg-[#F7EEDC] text-[#A8752E] border border-[#A8752E]/30',
    medium: 'bg-[#F7EEDC] text-[#A8752E] border border-[#A8752E]/30',
    low: 'bg-[#F8F6F0] text-[#62615D] border border-[#DDD9CF]',
    success: 'bg-[#EAF2EC] text-[#52745D] border border-[#52745D]/30',
    warning: 'bg-[#F7EEDC] text-[#A8752E] border border-[#A8752E]/30',
    info: 'bg-[#F4F1E9] text-[#111111] border border-[#DDD9CF]',
    purple: 'bg-[#F8F6F0] text-[#111111] border border-[#DDD9CF]',
    cyan: 'bg-[#F8F6F0] text-[#111111] border border-[#DDD9CF]',
    carmine: 'bg-[#960018]/10 text-[#960018] border border-[#960018]/25',
    black: 'bg-[#111111] text-[#FFFDF8] border border-[#111111]',
  };

  const dotColors = {
    default: 'bg-[#8A8882]',
    primary: 'bg-[#111111]',
    critical: 'bg-[#A54C45] animate-pulse',
    carmine: 'bg-[#960018]',
    high: 'bg-[#A8752E]',
    medium: 'bg-[#A8752E]',
    low: 'bg-[#8A8882]',
    success: 'bg-[#52745D]',
    warning: 'bg-[#A8752E]',
    info: 'bg-[#3348A8]',
    purple: 'bg-[#3348A8]',
    cyan: 'bg-[#3348A8]',
    black: 'bg-[#FFFDF8]',
  };

  return (
    <span
      className={`inline-flex items-center justify-center font-medium uppercase tracking-wider ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.default} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColors[variant] || 'bg-slate-400'}`}
        />
      )}
      {Icon && <Icon className="text-current text-xs flex-shrink-0" />}
      <span>{children}</span>
    </span>
  );
}
