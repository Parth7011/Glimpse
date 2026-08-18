import * as React from 'react';
import { cn } from '@/utils/utils';
const Label = React.forwardRef(({
  className,
  required,
  children,
  ...props
}, ref) => {
  return <label ref={ref} className={cn('text-sm font-medium text-[var(--text-primary)] leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70', className)} {...props}>
        {children}
        {required && <span className="text-[var(--danger)] ml-0.5">*</span>}
      </label>;
});
Label.displayName = 'Label';
export { Label };