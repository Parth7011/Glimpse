import * as React from 'react';
import { cn } from '@/utils/utils';

/* ---------- Checkbox ---------- */

const Checkbox = React.forwardRef(({
  className,
  label,
  id,
  ...props
}, ref) => {
  const inputId = id || `checkbox-${React.useId()}`;
  return <div className="flex items-start gap-3">
        <input type="checkbox" ref={ref} id={inputId} className={cn('mt-0.5 h-4 w-4 rounded-[4px] border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--accent)] transition-colors', 'checked:bg-[var(--accent)] checked:border-[var(--accent)]', 'focus:ring-2 focus:ring-[var(--accent-soft)] focus:ring-offset-1', 'cursor-pointer disabled:cursor-not-allowed disabled:opacity-50', className)} {...props} />
        {label && <label htmlFor={inputId} className="text-sm text-[var(--text-primary)] leading-snug cursor-pointer select-none">
            {label}
          </label>}
      </div>;
});
Checkbox.displayName = 'Checkbox';
export { Checkbox };