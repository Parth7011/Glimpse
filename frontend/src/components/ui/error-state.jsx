import { cn } from '@/utils/utils';
import { Button } from './button';
import { AlertCircle, WifiOff, ShieldAlert } from 'lucide-react';
function ErrorState({
  title = 'Something went wrong',
  message = 'Please try again. If the problem continues, contact support.',
  onRetry,
  variant = 'default',
  className
}) {
  const icons = {
    default: AlertCircle,
    network: WifiOff,
    permission: ShieldAlert
  };
  const Icon = icons[variant];
  return <div className={cn('flex flex-col items-center justify-center text-center py-16 px-6', className)}>
      <div className="h-12 w-12 rounded-full bg-[var(--danger-soft)] flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-[var(--danger)]" />
      </div>
      <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1">{title}</h3>
      <p className="text-sm text-[var(--text-secondary)] max-w-sm mb-6">{message}</p>
      {onRetry && <Button variant="secondary" size="md" onClick={onRetry}>
          Try again
        </Button>}
    </div>;
}
export { ErrorState };