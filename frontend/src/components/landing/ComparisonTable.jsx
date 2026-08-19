import React from 'react';
import { motion } from 'framer-motion';
import { Check, X as XIcon } from 'lucide-react';

const PAIN_COMPARISON = [
  { pain: '“When will we get our photos?”', fix: 'Guests find them themselves with one selfie.' },
  { pain: 'Hours spent sorting photos manually.', fix: 'Every guest automatically sees only their own photos.' },
  { pain: 'Every gallery looks like generic software.', fix: 'Every gallery carries your own studio branding.' },
  { pain: 'Links get forwarded everywhere.', fix: 'Secure links put access and downloads under your control.' },
];

export function ComparisonTable() {
  return (
    <div className="border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm mt-12">
      {/* Headers */}
      <div className="grid grid-cols-1 md:grid-cols-2 border-b border-[var(--border)]">
        <div className="py-6 px-8 text-[11px] font-bold tracking-widest text-[var(--text-muted)] uppercase hidden md:block bg-[#F8F9FA] text-center">WHAT SLOWS YOU DOWN</div>
        <div className="py-6 px-8 text-[11px] font-bold tracking-widest text-[var(--text-primary)] uppercase hidden md:block bg-[var(--surface)] text-center md:border-l border-[var(--border)]">WHAT CHANGES WITH GLIMPSE</div>
      </div>

      {/* Rows */}
      <div className="flex flex-col">
        {PAIN_COMPARISON.map((row, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
            className="grid grid-cols-1 md:grid-cols-2 border-b border-[var(--border)] last:border-0 group cursor-pointer transition-colors duration-300">
            <div className="flex items-center gap-4 p-6 md:px-8 bg-[#F8F9FA] group-hover:bg-[var(--accent-soft)] transition-colors duration-300">
              <XIcon className="w-4 h-4 text-red-400 shrink-0" strokeWidth={2.5} />
              <span className="text-[var(--text-secondary)] font-medium text-sm md:text-base">{row.pain}</span>
            </div>
            
            <div className="flex items-center gap-4 p-6 md:px-8 bg-[var(--surface)] group-hover:bg-[var(--accent-soft)] md:border-l border-[var(--border)] transition-colors duration-300">
              <Check className="w-4 h-4 text-[var(--accent)] shrink-0" strokeWidth={2.5} />
              <span className="font-semibold text-[var(--text-primary)] text-sm md:text-base">{row.fix}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
