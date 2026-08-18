import { cn } from '@/utils/utils';
import { Button } from './button';
import { Inbox } from 'lucide-react';
function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
  className
}) {
  return <div className={cn('flex flex-col items-center justify-center text-center py-16 px-6', className)}>
      <div className="h-12 w-12 rounded-full bg-[var(--surface-soft)] flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-[var(--text-muted)]" />
      </div>
      <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1">{title}</h3>
      {description && <p className="text-sm text-[var(--text-secondary)] max-w-sm mb-6">{description}</p>}
      {actionLabel && onAction && <Button variant="primary" size="md" onClick={onAction}>
          {actionLabel}
        </Button>}
    </div>;
}
export { EmptyState };