import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/utils/utils';
const badgeVariants = cva('inline-flex items-center gap-1 font-medium transition-colors', {
  variants: {
    variant: {
      default: 'bg-[var(--surface-soft)] text-[var(--text-secondary)] border border-[var(--border)]',
      accent: 'bg-[var(--accent-soft)] text-[var(--accent)]',
      success: 'bg-[var(--success-soft)] text-[var(--success)]',
      warning: 'bg-[var(--warning-soft)] text-[var(--warning)]',
      danger: 'bg-[var(--danger-soft)] text-[var(--danger)]'
    },
    size: {
      sm: 'px-2 py-0.5 text-xs rounded-[var(--radius-sm)]',
      md: 'px-2.5 py-1 text-xs rounded-[var(--radius-sm)]'
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
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', variant === 'success' && 'bg-[var(--success)]', variant === 'warning' && 'bg-[var(--warning)]', variant === 'danger' && 'bg-[var(--danger)]', variant === 'accent' && 'bg-[var(--accent)]', (!variant || variant === 'default') && 'bg-[var(--text-muted)]')} />}
      {children}
    </span>;
}
export { Badge, badgeVariants };