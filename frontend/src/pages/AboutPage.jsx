import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Lenis from 'lenis';
import { Navbar, Footer } from '@/components/layout';
import { Button } from '@/components/ui';
import { ROUTES } from '@/utils/constants';
import { Camera, Sparkles, ShieldCheck, HeartHandshake, Zap, Globe } from 'lucide-react';
import { cn } from '@/utils/utils';

const VALUES = [
  {
    icon: Sparkles,
    title: 'Zero Friction',
    desc: 'We believe technology should disappear. No apps, no passwords, no complex tutorials. Just a selfie and you get your photos.',
  },
  {
    icon: ShieldCheck,
    title: 'Privacy by Design',
    desc: 'Guest privacy is our foundation. Selfies are used strictly for matching and instantly discarded. You control who sees what.',
  },
  {
    icon: HeartHandshake,
    title: 'Empowering Studios',
    desc: 'We built Glimpse to run quietly in the background so your studio brand takes center stage, every single time.',
  },
  {
    icon: Zap,
    title: 'Blazing Fast AI',
    desc: 'Our proprietary face-matching engine can scan thousands of photos in seconds, delivering instant joy to guests.',
  },
  {
    icon: Globe,
    title: 'Built for Scale',
    desc: 'From intimate birthdays to massive sports events, our infrastructure scales effortlessly to handle any volume of guests and photos.',
  },
  {
    icon: Camera,
    title: 'By Photographers, For Photographers',
    desc: 'We understand the late-night editing sessions and the endless gallery questions. Glimpse was born from real studio pain points.',
  }
];

export default function AboutPage() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)] font-sans selection:bg-[var(--accent-soft)] selection:text-[var(--accent)] overflow-x-hidden">
      <Navbar activePage="about" />

      {/* HERO SECTION */}
      <section className="pt-40 pb-20 px-6 relative overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-[var(--accent)]/10 to-transparent rounded-full blur-[100px] pointer-events-none -z-10" />
        
        <div className="max-w-[1200px] mx-auto text-center z-10 relative">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
            <span className="inline-block py-1.5 px-4 rounded-full bg-[var(--surface-soft)] border border-[var(--border)] text-[var(--text-secondary)] text-sm font-semibold tracking-wide mb-6">
              Our Story
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-8 leading-[1.1]">
              Building the future of <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-orange-400">
                event photography.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed">
              We started with a simple belief: finding your memories shouldn't be the hardest part of the event.
            </p>
          </motion.div>
        </div>

        {/* Hero Image Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}
          className="max-w-[1200px] mx-auto mt-20 grid grid-cols-12 gap-4 md:gap-6 px-4 md:px-0"
        >
          <div className="col-span-12 md:col-span-7 h-[300px] md:h-[500px] rounded-3xl overflow-hidden relative shadow-2xl group">
            <img src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=2000" alt="Team at an event" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-700" />
          </div>
          <div className="col-span-12 md:col-span-5 grid grid-rows-2 gap-4 md:gap-6 h-[500px]">
            <div className="rounded-3xl overflow-hidden relative shadow-xl group h-full">
              <img src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=1000" alt="Photographer in action" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="rounded-3xl overflow-hidden relative shadow-xl group h-full bg-[var(--surface-soft)] flex items-center justify-center p-8">
               <div className="text-center">
                 <div className="text-4xl md:text-5xl font-extrabold text-[var(--accent)] mb-2">1M+</div>
                 <div className="text-[var(--text-secondary)] font-medium">Smiles Delivered</div>
               </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* THE MISSION */}
      <section className="py-24 px-6 bg-[var(--surface)] border-y border-[var(--border)]">
        <div className="max-w-[1000px] mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-3xl md:text-5xl font-extrabold tracking-tight mb-8"
          >
            The friction of delivery <span className="text-[var(--text-muted)] line-through decoration-[var(--border-strong)] decoration-2">stops here.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed max-w-4xl mx-auto space-y-6"
          >
            <span className="block mb-4">
              For years, event photography delivery has been broken. Photographers spend hours sorting, exporting, and managing endless Google Drive links. Guests spend days scrolling through thousands of photos just to find the two pictures they actually care about.
            </span>
            <span className="block">
              Glimpse changes the paradigm. By leveraging cutting-edge, privacy-first AI face-matching, we connect the right photos to the right people instantly. We give photographers their time back, and we give guests their memories back. It's magical, and it's just the beginning.
            </span>
          </motion.p>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="py-28 px-6 bg-[var(--background)]">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Our Core Values</h2>
            <p className="text-lg text-[var(--text-secondary)]">The principles that guide everything we build at Glimpse.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {VALUES.map((value, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-8 hover:border-[var(--accent)]/40 hover:shadow-lg transition-all group"
              >
                <div className="w-14 h-14 rounded-2xl bg-[var(--surface-soft)] border border-[var(--border)] flex items-center justify-center mb-6 group-hover:bg-[var(--accent)] transition-colors duration-300">
                  <value.icon className="w-6 h-6 text-[var(--accent)] group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{value.title}</h3>
                <p className="text-[var(--text-secondary)] leading-relaxed text-sm md:text-base">
                  {value.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 px-6 bg-[var(--surface)] border-t border-[var(--border)] text-center">
        <div className="max-w-[800px] mx-auto">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
              Join the delivery revolution.
            </h2>
            <p className="text-xl text-[var(--text-secondary)] mb-10 max-w-2xl mx-auto">
              Ready to give your clients a magical gallery experience while saving hours of your time? Start using Glimpse today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to={ROUTES.LOGIN}>
                <Button className="rounded-full px-8 h-14 text-base font-semibold bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white w-full sm:w-auto shadow-lg hover:shadow-xl transition-all">
                  Get Started for Free →
                </Button>
              </Link>
              <Link to="/for-photographers">
                <Button variant="outline" className="rounded-full px-8 h-14 text-base font-semibold w-full sm:w-auto hover:bg-[var(--surface-soft)]">
                  Explore Features
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
