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
    default: 'bg-slate-100/80 text-slate-700 border border-slate-200/80 backdrop-blur-xs',
    primary: 'bg-blue-50/80 text-blue-700 border border-blue-200/80 backdrop-blur-xs',
    critical: 'bg-rose-50/90 text-rose-700 border border-rose-200/90 shadow-xs backdrop-blur-xs',
    high: 'bg-amber-50/90 text-amber-800 border border-amber-200/90 backdrop-blur-xs',
    medium: 'bg-sky-50/80 text-sky-700 border border-sky-200/80 backdrop-blur-xs',
    low: 'bg-slate-100/80 text-slate-600 border border-slate-200/80 backdrop-blur-xs',
    success: 'bg-emerald-50/90 text-emerald-700 border border-emerald-200/90 backdrop-blur-xs',
    warning: 'bg-yellow-50/90 text-yellow-800 border border-yellow-200/90 backdrop-blur-xs',
    info: 'bg-indigo-50/80 text-indigo-700 border border-indigo-200/80 backdrop-blur-xs',
    purple: 'bg-purple-50/80 text-purple-700 border border-purple-200/80 backdrop-blur-xs',
    cyan: 'bg-cyan-50/80 text-cyan-800 border border-cyan-200/80 backdrop-blur-xs',
  };

  const dotColors = {
    default: 'bg-slate-400',
    primary: 'bg-blue-500',
    critical: 'bg-rose-500 animate-pulse',
    high: 'bg-amber-500',
    medium: 'bg-sky-500',
    low: 'bg-slate-400',
    success: 'bg-emerald-500',
    warning: 'bg-yellow-500',
    info: 'bg-indigo-500',
    purple: 'bg-purple-500',
    cyan: 'bg-cyan-500',
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
