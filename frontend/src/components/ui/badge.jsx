import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/utils/utils';
const badgeVariants = cva('inline-flex items-center gap-1.5 font-black uppercase tracking-widest transition-all duration-300 backdrop-blur-md shadow-sm', {
  variants: {
    variant: {
      default: 'bg-white/5 text-[#D7E2EA]/70 border border-white/10',
      accent: 'bg-[#D7E2EA]/10 text-[#D7E2EA] border border-[#D7E2EA]/30 shadow-[0_0_15px_rgba(215,226,234,0.15)]',
      success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]',
      warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.15)]',
      danger: 'bg-red-500/10 text-red-400 border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.15)]'
    },
    size: {
      sm: 'px-2.5 py-1 text-[8px] rounded-full',
      md: 'px-3 py-1.5 text-[9px] rounded-full'
    }
  },
  defaultVariants: {
    variant: 'default',
    size: 'md'
  }
});
function Badge({
  className,
  variant,
  size,
  dot,
  children,
  ...props
}) {
  return <span className={cn(badgeVariants({
    variant,
    size
  }), className)} {...props}>
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full shadow-[0_0_5px_currentColor]', variant === 'success' && 'bg-emerald-400', variant === 'warning' && 'bg-amber-400', variant === 'danger' && 'bg-red-400', variant === 'accent' && 'bg-[#D7E2EA]', (!variant || variant === 'default') && 'bg-white/40')} />}
      {children}
    </span>;
}
export { Badge, badgeVariants };