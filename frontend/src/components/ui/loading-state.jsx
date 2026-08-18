import { cn } from '@/utils/utils';
import { Loader2 } from 'lucide-react';
function LoadingState({
  message = 'Loading...',
  size = 'md',
  className,
  fullPage = false
}) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };
  const content = <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <Loader2 className={cn('animate-spin text-[var(--accent)]', sizes[size])} />
      {message && <p className="text-sm text-[var(--text-secondary)] animate-pulse">{message}</p>}
    </div>;
  if (fullPage) {
    return <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        {content}
      </div>;
  }
  return content;
}
export { LoadingState };