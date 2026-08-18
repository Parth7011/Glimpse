import { cn } from '@/utils/utils';
function Skeleton({
  className,
  rounded = 'md'
}) {
  const radiusMap = {
    sm: 'rounded-[var(--radius-sm)]',
    md: 'rounded-[var(--radius-md)]',
    lg: 'rounded-[var(--radius-lg)]',
    full: 'rounded-full'
  };
  return <div className={cn('bg-[var(--surface-soft)] animate-pulse', radiusMap[rounded], className)} />;
}

/* Pre-built skeleton patterns */
function SkeletonCard() {
  return <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5 space-y-3">
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-6 w-16" rounded="sm" />
        <Skeleton className="h-6 w-20" rounded="sm" />
      </div>
    </div>;
}
function SkeletonList({
  count = 3
}) {
  return <div className="space-y-3">
      {Array.from({
      length: count
    }, (_, i) => <div key={i} className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 shrink-0" rounded="full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>)}
    </div>;
}
function SkeletonGrid({
  count = 6
}) {
  return <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {Array.from({
      length: count
    }, (_, i) => <Skeleton key={i} className="aspect-[3/2] w-full" />)}
    </div>;
}
export { Skeleton, SkeletonCard, SkeletonList, SkeletonGrid };