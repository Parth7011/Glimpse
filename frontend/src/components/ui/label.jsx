import * as React from 'react';
import { cn } from '@/utils/utils';
const Label = React.forwardRef(({
  className,
  required,
  children,
  ...props
}, ref) => {
  return <label ref={ref} className={cn('text-[10px] font-black uppercase tracking-widest text-[#D7E2EA]/60 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ml-1 block mb-2', className)} {...props}>
        {children}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>;
});
Label.displayName = 'Label';
export { Label };