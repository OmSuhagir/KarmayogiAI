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
      'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98]',
    secondary:
      'bg-white/80 hover:bg-white text-slate-700 border border-slate-200/80 shadow-sm hover:shadow active:scale-[0.98] backdrop-blur-sm',
    glass:
      'bg-white/60 hover:bg-white/90 text-slate-800 border border-white/80 shadow-glass-sm hover:shadow-glass active:scale-[0.98] backdrop-blur-md',
    outline:
      'bg-transparent hover:bg-blue-50/50 text-blue-700 border border-blue-200 hover:border-blue-300 active:scale-[0.98]',
    ghost:
      'bg-transparent hover:bg-slate-100/60 text-slate-600 hover:text-slate-900 active:scale-[0.98]',
    danger:
      'bg-rose-50/80 hover:bg-rose-100/90 text-rose-700 border border-rose-200 shadow-sm active:scale-[0.98]',
    success:
      'bg-emerald-50/80 hover:bg-emerald-100/90 text-emerald-700 border border-emerald-200 shadow-sm active:scale-[0.98]',
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
