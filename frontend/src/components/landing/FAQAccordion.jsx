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
          className="border-b border-white/10 last:border-0">
          <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
            className="w-full text-left py-8 flex items-center justify-between gap-6 group">
            <span className="font-bold uppercase tracking-wide text-sm md:text-base text-[#D7E2EA]/70 transition-colors group-hover:text-[#D7E2EA]">{faq.q}</span>
            <div className={cn(
              "w-8 h-8 rounded-full border border-white/20 flex items-center justify-center shrink-0 transition-all duration-300",
              openFaq === i ? "bg-[#D7E2EA] border-transparent rotate-45" : "bg-transparent group-hover:bg-white/10"
            )}>
              <Plus className={cn('w-4 h-4 transition-colors duration-300', openFaq === i ? 'text-[#0C0C0C]' : 'text-[#D7E2EA]')} />
            </div>
          </button>
          <AnimatePresence>
            {openFaq === i && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                <div className="pb-8 pr-12 text-sm text-[#D7E2EA]/50 font-light leading-relaxed">
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
