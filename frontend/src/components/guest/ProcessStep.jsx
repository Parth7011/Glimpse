import React from 'react';
import { motion } from 'framer-motion';

export function ProcessStep({ active, text, loading }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: active || loading ? 1 : 0.4, y: 0 }}
      className="flex items-center gap-3"
    >
      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${active ? 'bg-[var(--success)] text-white' : 'border border-[var(--border-strong)]'}`}>
        {active && <span className="text-[10px] font-bold">✓</span>}
        {loading && (
           <motion.div 
             animate={{ rotate: 360 }}
             transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
             className="w-3 h-3 rounded-full border border-[var(--accent)] border-t-transparent"
           />
        )}
      </div>
      <span className={`text-sm font-medium ${active ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>{text}</span>
    </motion.div>
  );
}
