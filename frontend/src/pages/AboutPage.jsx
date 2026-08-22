import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Lenis from 'lenis';
import { Navbar, Footer } from '@/components/layout';
import { Button } from '@/components/ui';
import { ROUTES } from '@/utils/constants';
import { Camera, Sparkles, ShieldCheck, HeartHandshake, Zap, Globe } from 'lucide-react';
import { FadeIn, GradientButton } from '@/components/ui';

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
    <div className="bg-[#0C0C0C] min-h-screen text-[#D7E2EA] font-kanit overflow-x-clip selection:bg-[#D7E2EA] selection:text-[#0C0C0C]">
      <Navbar theme="dark" activePage="about" />

      {/* HERO SECTION */}
      <section className="pt-32 md:pt-40 pb-20 px-6 relative overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#D7E2EA]/10 rounded-full blur-[160px] pointer-events-none -z-10" />
        
        <div className="max-w-[1200px] mx-auto text-center z-10 relative">
          <FadeIn y={30}>
            <span className="inline-block py-2 px-6 rounded-full bg-[#111111] border border-white/10 text-[#D7E2EA]/60 text-xs font-bold uppercase tracking-widest mb-6">
              Our Story
            </span>
            <h1 className="hero-heading font-black uppercase tracking-tight mb-8 leading-[0.9]" style={{ fontSize: 'clamp(3rem, 7vw, 90px)' }}>
              Building the future of <br className="hidden md:block" />
              event photography.
            </h1>
            <p className="text-xl md:text-2xl text-[#D7E2EA]/50 max-w-3xl mx-auto leading-relaxed font-light">
              We started with a simple belief: finding your memories shouldn't be the hardest part of the event.
            </p>
          </FadeIn>
        </div>

        {/* Hero Image Grid */}
        <FadeIn y={40} delay={0.2} className="max-w-[1200px] mx-auto mt-20 grid grid-cols-12 gap-4 md:gap-6 px-4 md:px-0">
          <div className="col-span-12 md:col-span-7 h-[300px] md:h-[500px] rounded-[40px] overflow-hidden relative shadow-2xl group border border-white/10">
            <img src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=2000" alt="Team at an event" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-700" />
          </div>
          <div className="col-span-12 md:col-span-5 grid grid-rows-2 gap-4 md:gap-6 h-[500px]">
            <div className="rounded-[40px] overflow-hidden relative shadow-xl group h-full border border-white/10">
              <img src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=1000" alt="Photographer in action" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="rounded-[40px] overflow-hidden relative shadow-2xl group h-full bg-[#111111] flex items-center justify-center p-8 border border-white/10">
               <div className="text-center">
                 <div className="text-5xl md:text-7xl font-black text-[#D7E2EA] mb-2 tracking-tighter">1M+</div>
                 <div className="text-[#D7E2EA]/50 font-bold uppercase tracking-widest text-xs">Smiles Delivered</div>
               </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* THE MISSION */}
      <section className="py-32 px-6 bg-[#0C0C0C] border-y border-white/5">
        <div className="max-w-[1000px] mx-auto text-center">
          <FadeIn y={30}>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-12 text-[#D7E2EA]">
              The friction of delivery <span className="text-white/20 line-through decoration-white/20 decoration-2">stops here.</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.1} y={30}>
            <p className="text-xl md:text-2xl text-[#D7E2EA]/60 font-light leading-relaxed max-w-4xl mx-auto space-y-8">
              <span className="block">
                For years, event photography delivery has been broken. Photographers spend hours sorting, exporting, and managing endless Google Drive links. Guests spend days scrolling through thousands of photos just to find the two pictures they actually care about.
              </span>
              <span className="block">
                Glimpse changes the paradigm. By leveraging cutting-edge, privacy-first AI face-matching, we connect the right photos to the right people instantly. We give photographers their time back, and we give guests their memories back. It's magical, and it's just the beginning.
              </span>
            </p>
          </FadeIn>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="py-32 px-6 bg-[#0C0C0C]">
        <div className="max-w-[1200px] mx-auto">
          <FadeIn y={30} className="text-center mb-20 space-y-4">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-[#D7E2EA]">Our Core Values</h2>
            <p className="text-xl text-[#D7E2EA]/50 font-light">The principles that guide everything we build at Glimpse.</p>
          </FadeIn>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {VALUES.map((value, i) => (
              <FadeIn key={i} delay={i * 0.1} y={30}>
                <div className="bg-[#111111] border border-white/5 rounded-[32px] p-10 hover:bg-white/[0.02] hover:border-white/10 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(215,226,234,0.05)] transition-all duration-300 group h-full">
                  <div className="w-14 h-14 rounded-2xl bg-[#1A1A1A] border border-white/5 flex items-center justify-center mb-8 group-hover:bg-[#D7E2EA] transition-colors duration-300">
                    <value.icon className="w-6 h-6 text-[#D7E2EA] group-hover:text-[#0C0C0C] transition-colors duration-300" />
                  </div>
                  <h3 className="text-2xl font-bold uppercase tracking-wide mb-4 text-[#D7E2EA]">{value.title}</h3>
                  <p className="text-[#D7E2EA]/50 font-light leading-relaxed text-sm md:text-base">
                    {value.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-32 px-6 bg-[#0C0C0C] border-t border-white/5 text-center">
        <div className="max-w-[800px] mx-auto">
          <FadeIn y={30}>
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tight mb-8 text-[#D7E2EA] leading-[0.9]">
              Join the delivery revolution.
            </h2>
            <p className="text-xl text-[#D7E2EA]/50 font-light mb-12 max-w-2xl mx-auto">
              Ready to give your clients a magical gallery experience while saving hours of your time? Start using Glimpse today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to={ROUTES.LOGIN}>
                <GradientButton>Get Started for Free</GradientButton>
              </Link>
              <Link to="/for-photographers">
                <Button variant="outline" className="rounded-full bg-transparent border-white/20 text-[#D7E2EA] hover:bg-white/10 px-8 h-14 text-base font-semibold w-full sm:w-auto transition-all">
                  Explore Features
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </div>
  );
}
