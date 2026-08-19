import React from 'react';
import { useCountUp } from '@/hooks/useCountUp';

export function StatCard({ label, value, icon, accent, accentSoft }) {
  const { count, ref } = useCountUp(value);

  return (
    <div
      ref={ref}
      className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-xl)] p-6 flex items-center gap-5 shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      <div
        className="w-12 h-12 rounded-[var(--radius-lg)] flex items-center justify-center shrink-0"
        style={{ backgroundColor: accentSoft, color: accent }}
      >
        {icon}
      </div>
      <div>
        <span className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wide block mb-1">{label}</span>
        <span className="text-3xl font-bold text-[var(--text-primary)] tabular-nums">
          {value != null ? count.toLocaleString() : '—'}
        </span>
      </div>
    </div>
  );
}
