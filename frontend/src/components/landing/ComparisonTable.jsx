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
    <div className="border border-white/10 rounded-3xl overflow-hidden shadow-2xl mt-12 bg-[#0C0C0C]">
      {/* Headers */}
      <div className="grid grid-cols-1 md:grid-cols-2 border-b border-white/10">
        <div className="py-8 px-8 text-[11px] font-black tracking-widest text-[#D7E2EA]/40 uppercase hidden md:block bg-[#111111] text-center">WHAT SLOWS YOU DOWN</div>
        <div className="py-8 px-8 text-[11px] font-black tracking-widest text-[#D7E2EA] uppercase hidden md:block bg-[#1A1A1A] text-center md:border-l border-white/10">WHAT CHANGES WITH GLIMPSE</div>
      </div>

      {/* Rows */}
      <div className="flex flex-col">
        {PAIN_COMPARISON.map((row, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
            className="grid grid-cols-1 md:grid-cols-2 border-b border-white/5 last:border-0 group cursor-pointer transition-colors duration-300">
            <div className="flex items-center gap-5 p-8 bg-[#111111] group-hover:bg-white/[0.02] transition-colors duration-300">
              <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                <XIcon className="w-4 h-4 text-red-400" strokeWidth={2.5} />
              </div>
              <span className="text-[#D7E2EA]/50 font-light text-sm md:text-base">{row.pain}</span>
            </div>
            
            <div className="flex items-center gap-5 p-8 bg-[#1A1A1A] group-hover:bg-white/[0.05] md:border-l border-white/5 transition-colors duration-300">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <Check className="w-4 h-4 text-[#D7E2EA]" strokeWidth={2.5} />
              </div>
              <span className="font-semibold text-[#D7E2EA] text-sm md:text-base tracking-wide">{row.fix}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
