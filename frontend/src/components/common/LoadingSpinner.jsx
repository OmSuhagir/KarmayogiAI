import React from 'react';
import { FiLoader } from 'react-icons/fi';

/**
 * Reusable LoadingSpinner with frosted backdrop support and customizable label.
 */
export default function LoadingSpinner({
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
  message = 'Loading...',
  fullScreen = false,
  className = '',
}) {
  const sizeStyles = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
  };

  const content = (
    <div className={`flex flex-col items-center justify-center gap-3 p-6 text-slate-600 ${className}`}>
      <FiLoader className={`animate-spin text-blue-600 ${sizeStyles[size] || sizeStyles.md}`} />
      {message && (
        <p className="text-xs sm:text-sm font-medium text-slate-500 tracking-wide">
          {message}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/10 backdrop-blur-md">
        <div className="bg-white/80 p-8 rounded-2xl border border-white/80 shadow-glass flex flex-col items-center">
          {content}
        </div>
      </div>
    );
  }

  return content;
}
