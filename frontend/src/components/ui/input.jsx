import * as React from 'react';
import { cn } from '@/utils/utils';
const Input = React.forwardRef(({
  className,
  type,
  error,
  ...props
}, ref) => {
  return <div className="w-full relative group/global-input">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-transparent via-[#D7E2EA]/20 to-transparent rounded-2xl blur opacity-0 group-focus-within/global-input:opacity-100 transition duration-500 pointer-events-none translate-y-2" />
        <input type={type} className={cn('relative flex h-12 w-full rounded-2xl border border-white/10 bg-[#1A1A1A] px-4 py-3 text-sm text-[#D7E2EA] placeholder:text-[#D7E2EA]/30 transition-all duration-300 font-light shadow-inner', 'focus:border-[#D7E2EA]/50 focus:outline-none focus:ring-1 focus:ring-[#D7E2EA]/20 focus:bg-[#111111]', 'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-white/5', error && 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20 text-red-200', className)} ref={ref} {...props} />
        {error && <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-red-400 pl-1">{error}</p>}
      </div>;
});
Input.displayName = 'Input';
export { Input };