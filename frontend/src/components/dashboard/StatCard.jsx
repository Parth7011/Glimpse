import React from 'react';
import { useCountUp } from '@/hooks/useCountUp';

export function StatCard({ label, value, icon, accent, accentSoft }) {
  const { count, ref } = useCountUp(value);

  return (
    <div
      ref={ref}
      className="bg-[#1A1A1A] border border-white/10 rounded-3xl p-6 flex items-center gap-5 relative overflow-hidden group hover:border-[#D7E2EA]/50 transition-all duration-500 hover:-translate-y-1 shadow-2xl"
    >
      {/* Background Gradient Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 relative z-10 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
        style={{ backgroundColor: accentSoft || '#222222', color: accent || '#D7E2EA' }}
      >
        {icon}
      </div>
      <div className="relative z-10">
        <span className="text-xs font-black text-[#D7E2EA]/50 uppercase tracking-widest block mb-1">{label}</span>
        <span className="text-4xl font-black text-[#D7E2EA] tabular-nums tracking-tighter">
          {value != null ? count.toLocaleString() : '—'}
        </span>
      </div>
    </div>
  );
}
