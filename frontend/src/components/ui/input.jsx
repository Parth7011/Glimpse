import * as React from 'react';
import { cn } from '@/utils/utils';
const Input = React.forwardRef(({
  className,
  type,
  error,
  ...props
}, ref) => {
  return <div className="w-full">
        <input type={type} className={cn('flex h-10 w-full rounded-[var(--radius-md)] border bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] transition-colors duration-200', 'border-[var(--border)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-soft)]', 'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[var(--surface-soft)]', error && 'border-[var(--danger)] focus:border-[var(--danger)] focus:ring-[var(--danger-soft)]', className)} ref={ref} {...props} />
        {error && <p className="mt-1.5 text-xs text-[var(--danger)]">{error}</p>}
      </div>;
});
Input.displayName = 'Input';
export { Input };