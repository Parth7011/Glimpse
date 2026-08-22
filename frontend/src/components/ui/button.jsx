'use client';

import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/utils/utils';
const buttonVariants = cva(
// Base styles
'inline-flex items-center justify-center gap-2 font-black uppercase tracking-widest transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D7E2EA]/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none overflow-hidden relative group whitespace-nowrap', {
  variants: {
    variant: {
      primary: 'bg-[#D7E2EA] hover:bg-white text-[#0C0C0C] active:scale-[0.98] shadow-[0_0_20px_rgba(215,226,234,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]',
      secondary: 'bg-white/5 text-[#D7E2EA] border border-white/10 hover:bg-white/10 hover:border-[#D7E2EA]/50 active:scale-[0.98]',
      ghost: 'text-[#D7E2EA]/60 hover:text-[#D7E2EA] hover:bg-white/5',
      danger: 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 active:scale-[0.98]',
      success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 active:scale-[0.98]',
      link: 'text-[#D7E2EA] hover:text-white underline-offset-4 hover:underline p-0 h-auto font-bold tracking-normal'
    },
    size: {
      sm: 'h-9 px-4 text-[10px] rounded-xl',
      md: 'h-12 px-6 text-xs rounded-2xl',
      lg: 'h-14 px-8 text-sm rounded-2xl',
      xl: 'h-16 px-10 text-base rounded-3xl',
      icon: 'h-12 w-12 rounded-2xl'
    }
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md'
  }
});
const Button = React.forwardRef(({
  className,
  variant,
  size,
  loading,
  disabled,
  children,
  ...props
}, ref) => {
  return <button className={cn(buttonVariants({
    variant,
    size,
    className
  }))} ref={ref} disabled={disabled || loading} {...props}>
        {variant === 'primary' && !disabled && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
        )}
        <span className="relative z-10 flex items-center gap-2">
          {loading && <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>}
          {children}
        </span>
      </button>;
});
Button.displayName = 'Button';
export { Button, buttonVariants };