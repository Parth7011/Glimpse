import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { cn } from '@/utils/utils';

export function FAQAccordion({ faqs }) {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="w-full">
      {faqs.map((faq, i) => (
        <motion.div key={i}
          initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
          className="border-b border-[var(--border)] last:border-0">
          <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
            className="w-full text-left py-6 flex items-center justify-between gap-4 group">
            <span className="font-semibold text-[15px] md:text-base text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent)]">{faq.q}</span>
            <Plus className={cn('w-4 h-4 text-[var(--accent)] shrink-0 transition-transform duration-300', openFaq === i ? 'rotate-45' : '')} />
          </button>
          <AnimatePresence>
            {openFaq === i && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                <div className="pb-6 text-sm text-[var(--text-secondary)] leading-relaxed">
                  {faq.a}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}
