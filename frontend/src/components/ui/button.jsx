'use client';

import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/utils/utils';
const buttonVariants = cva(
// Base styles
'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none', {
  variants: {
    variant: {
      primary: 'bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] active:scale-[0.98] shadow-sm',
      secondary: 'bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] hover:bg-[var(--surface-soft)] hover:border-[var(--border-strong)]',
      ghost: 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-soft)]',
      danger: 'bg-[var(--danger)] text-white hover:opacity-90 active:scale-[0.98]',
      success: 'bg-[var(--success)] text-white hover:opacity-90 active:scale-[0.98]',
      link: 'text-[var(--accent)] hover:text-[var(--accent-hover)] underline-offset-4 hover:underline p-0 h-auto'
    },
    size: {
      sm: 'h-8 px-3 text-sm rounded-[var(--radius-sm)]',
      md: 'h-10 px-4 text-sm rounded-[var(--radius-md)]',
      lg: 'h-12 px-6 text-base rounded-[var(--radius-md)]',
      xl: 'h-14 px-8 text-base rounded-[var(--radius-lg)]',
      icon: 'h-10 w-10 rounded-[var(--radius-md)]'
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
        {loading && <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>}
        {children}
      </button>;
});
Button.displayName = 'Button';
export { Button, buttonVariants };