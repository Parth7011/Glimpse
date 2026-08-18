import * as React from 'react';
import { cn } from '@/utils/utils';

/* ---------- Linear Progress Bar ---------- */

function Progress({
  value,
  label,
  showValue = false,
  size = 'md',
  variant = 'accent',
  className
}) {
  const clampedValue = Math.min(100, Math.max(0, value));
  const heights = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };
  const colors = {
    accent: 'bg-[var(--accent)]',
    success: 'bg-[var(--success)]',
    warning: 'bg-[var(--warning)]',
    danger: 'bg-[var(--danger)]'
  };
  return <div className={cn('w-full', className)}>
      {(label || showValue) && <div className="flex items-center justify-between mb-1.5">
          {label && <span className="text-sm text-[var(--text-secondary)]">{label}</span>}
          {showValue && <span className="text-sm font-medium text-[var(--text-primary)]">
              {Math.round(clampedValue)}%
            </span>}
        </div>}
      <div className={cn('w-full rounded-full bg-[var(--surface-soft)] overflow-hidden', heights[size])} role="progressbar" aria-valuenow={clampedValue} aria-valuemin={0} aria-valuemax={100} aria-label={label || 'Progress'}>
        <div className={cn('h-full rounded-full transition-all duration-500 ease-out', colors[variant])} style={{
        width: `${clampedValue}%`
      }} />
      </div>
    </div>;
}
export { Progress };