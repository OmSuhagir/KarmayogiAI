import React from 'react';
import { FiLoader } from 'react-icons/fi';

/**
 * Reusable GlassButton with support for primary, secondary, glass-outline,
 * danger, and ghost variants with smooth micro-interactions.
 */
export default function GlassButton({
  children,
  type = 'button',
  variant = 'primary', // 'primary' | 'secondary' | 'glass' | 'outline' | 'ghost' | 'danger' | 'success'
  size = 'md', // 'xs' | 'sm' | 'md' | 'lg'
  icon: Icon,
  iconRight: IconRight,
  loading = false,
  disabled = false,
  className = '',
  onClick,
  ...props
}) {
  const sizeStyles = {
    xs: 'px-2.5 py-1 text-xs gap-1.5 rounded-lg font-medium',
    sm: 'px-3.5 py-1.5 text-xs sm:text-sm gap-2 rounded-xl font-medium',
    md: 'px-4 py-2 text-sm gap-2 rounded-xl font-medium',
    lg: 'px-6 py-2.5 text-base gap-2.5 rounded-2xl font-semibold',
  };

  const variantStyles = {
    primary:
      'bg-[#111111] hover:bg-[#222222] text-[#FFFDF8] font-medium transition-colors border border-[#111111] shadow-warm',
    secondary:
      'bg-[#FFFDF8] hover:bg-[#F8F6F0] text-[#111111] border border-[#C9C4B8] font-medium transition-colors',
    glass:
      'bg-[#FFFDF8] hover:bg-[#F8F6F0] text-[#171717] border border-[#DDD9CF] font-medium transition-colors',
    outline:
      'bg-transparent hover:bg-[#F8F6F0] text-[#111111] border border-[#DDD9CF] font-medium transition-colors',
    accent:
      'bg-[#3348A8] hover:bg-[#253685] text-white font-medium transition-colors border border-[#3348A8]',
    ghost:
      'bg-transparent hover:bg-[#F1EDE3] text-[#62615D] hover:text-[#111111] transition-colors',
    danger:
      'bg-[#F8E9E7] hover:bg-[#F1DBD8] text-[#A54C45] border border-[#A54C45]/30 font-medium transition-colors',
    success:
      'bg-[#EAF2EC] hover:bg-[#DDE9E0] text-[#52745D] border border-[#52745D]/30 font-medium transition-colors',
  };

  const disabledStyles = disabled || loading
    ? 'opacity-50 cursor-not-allowed pointer-events-none active:scale-100 shadow-none'
    : 'cursor-pointer transition-all duration-200';

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`inline-flex items-center justify-center select-none ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.primary} ${disabledStyles} ${className}`}
      {...props}
    >
      {loading ? (
        <FiLoader className="animate-spin text-current text-base" />
      ) : (
        Icon && <Icon className="text-current text-base flex-shrink-0" />
      )}
      <span>{children}</span>
      {!loading && IconRight && (
        <IconRight className="text-current text-base flex-shrink-0" />
      )}
    </button>
  );
}
