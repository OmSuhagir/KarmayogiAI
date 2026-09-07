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
    default: 'bg-[#FFFDF8] border border-[#DDD9CF] shadow-warm',
    solid: 'bg-[#FFFDF8] border border-[#C9C4B8] shadow-warm',
    subtle: 'bg-[#F8F6F0] border border-[#DDD9CF] shadow-none',
    tinted: 'bg-[#E9EDFF]/60 border border-[#3348A8]/25 shadow-warm',
    danger: 'bg-[#F8E9E7] border border-[#A54C45]/25 shadow-none',
    success: 'bg-[#EAF2EC] border border-[#52745D]/25 shadow-none',
    warning: 'bg-[#F7EEDC] border border-[#A8752E]/25 shadow-none',
  };

  const interactiveStyles = interactive
    ? 'cursor-pointer transition-all duration-150 hover:border-[#C9C4B8] hover:shadow-warm-md active:scale-[0.995]'
    : '';

  return (
    <div
      onClick={onClick}
      className={`rounded-xl ${variantStyles[variant] || variantStyles.default} ${padding} ${interactiveStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
