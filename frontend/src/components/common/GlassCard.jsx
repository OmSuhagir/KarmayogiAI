import React from 'react';

/**
 * Reusable GlassCard component with translucent frosted surface,
 * backdrop blur, subtle border highlight, and optional hover interaction.
 */
export default function GlassCard({
  children,
  className = '',
  interactive = false,
  variant = 'default', // 'default' | 'solid' | 'subtle' | 'tinted' | 'danger' | 'success'
  padding = 'p-6',
  onClick,
  ...props
}) {
  const variantStyles = {
    default: 'bg-white border border-slate-200/80 shadow-xs',
    solid: 'bg-white border border-slate-200 shadow-xs',
    subtle: 'bg-slate-50/70 border border-slate-200/60 shadow-none',
    tinted: 'bg-blue-50/60 border border-blue-100 shadow-xs',
    danger: 'bg-rose-50/50 border border-rose-200/70 shadow-xs',
    success: 'bg-emerald-50/50 border border-emerald-200/70 shadow-xs',
  };

  const interactiveStyles = interactive
    ? 'glass-card-interactive cursor-pointer active:scale-[0.99]'
    : '';

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl ${variantStyles[variant] || variantStyles.default} ${padding} ${interactiveStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
