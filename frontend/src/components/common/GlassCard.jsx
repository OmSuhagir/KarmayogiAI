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
    default: 'bg-white/70 backdrop-blur-md border border-white/60 shadow-glass',
    solid: 'bg-white/90 backdrop-blur-lg border border-white/80 shadow-glass',
    subtle: 'bg-white/45 backdrop-blur-sm border border-white/40 shadow-glass-sm',
    tinted: 'bg-blue-50/50 backdrop-blur-md border border-blue-100/60 shadow-glass',
    danger: 'bg-rose-50/40 backdrop-blur-md border border-rose-100/70 shadow-glass-sm',
    success: 'bg-emerald-50/40 backdrop-blur-md border border-emerald-100/70 shadow-glass-sm',
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
