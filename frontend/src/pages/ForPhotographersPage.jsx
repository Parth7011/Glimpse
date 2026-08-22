import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/utils/constants';
import { Button } from '@/components/ui';
import { Navbar, Footer } from '@/components/layout';
import { ComparisonTable, FAQAccordion } from '@/components/landing';
import { FadeIn, GradientButton } from '@/components/ui';
import {
  Check, X as XIcon, ChevronDown, Plus,
  Camera, Sparkles, Share2, Clock, Image as ImageIcon, UploadCloud, Lock,
  BarChart3, Smartphone, Mail, Instagram, Facebook, Youtube,
  Link as LinkIcon
} from 'lucide-react';
import { cn } from '@/utils/utils';
import Lenis from 'lenis';

const EVENT_TABS = [
  {
    id: 'wedding',
    label: 'Wedding',
    headline: 'Galleries that feel like your own studio website.',
    subtext: 'Your studio identity leads the experience—from the event cover to every highlight and final download. Couples share the link and every guest finds their moments without ever messaging you.',
    cover: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=80',
    badge: 'Most popular',
    stats: ['1,930 photos', '247 guests', '98% satisfaction'],
  },
  {
    id: 'birthday',
    label: 'Birthday',
    headline: "Every celebration, delivered while it still feels fresh.",
    subtext: "Share a polished gallery with families before the candles are out. Guests find their own moments in seconds—and your studio gets credited on every share.",
    cover: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=900&q=80',
    badge: '',
    stats: ['820 photos', '78 guests', 'Delivered in 2 hrs'],
  },
  {
    id: 'corporate',
    label: 'Corporate',
    headline: 'A professional gallery for every team moment.',
    subtext: 'Give organisers one refined destination for keynotes, networking shots, and team moments. Every attendee finds photos they actually want to keep.',
    cover: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=900&q=80',
    badge: '',
    stats: ['3,200 photos', '500 attendees', 'Private access'],
  },
  {
    id: 'sports',
    label: 'Sports',
    headline: 'Thousands of action shots. The right ones find each athlete.',
    subtext: 'Turn a full day of competition into personal galleries athletes can open, download, and share immediately—sorted automatically, no tagging required.',
    cover: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=900&q=80',
    badge: '🔥 Trending',
    stats: ['8,400 photos', '1,200 athletes', 'Instant delivery'],
  },
];


const FAQS = [
  { q: 'How do guests find their photos?', a: "Guests open your event link, take a single selfie, and Glimpse's face-match AI gathers every photo they appear in into a personal gallery. When you upload more photos later, their gallery updates automatically." },
  { q: 'Do guests need to install an app?', a: "No. Guests open the gallery in their phone's browser from a link or QR code. They create or sign in to a simple Glimpse account so their matched photos stay private and remain available when they return." },
  { q: 'Is the gallery white-label?', a: 'Yes. Your logo, colours, and covers carry through the entire guest experience — from the link preview to the download screen. Guests see your studio, not our software.' },
  { q: 'Is there a free plan?', a: 'Yes. You can run a real event from start to finish on the free plan. Upgrade only when your events grow bigger.' },
  { q: 'How is guest privacy handled?', a: "Matching is scoped to the event: a guest's selfie is compared only against the faces in the event they opened. The selfie is saved to the guest's own account, so if they attend another event they are not asked for a new one. Media is served through signed links, and you control who can view or download. See our Privacy Policy for the full picture." },
];

export default function ForPhotographersPage() {
  const [activeTab, setActiveTab] = useState('wedding');

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  const activeEvent = EVENT_TABS.find(t => t.id === activeTab);

  return (
    <div className="bg-[#0C0C0C] min-h-screen text-[#D7E2EA] font-kanit overflow-x-clip selection:bg-[#D7E2EA] selection:text-[#0C0C0C]">

      {/* Navigation */}
      <Navbar theme="dark" activePage="photographers" />

      {/* HERO */}
      <section className="pt-32 md:pt-40 pb-24 px-6 relative overflow-hidden">
        {/* Cinematic glow */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#D7E2EA]/10 rounded-full blur-[160px] opacity-40 -z-10" />
        
        <div className="max-w-[1200px] mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="space-y-8">
            <FadeIn y={30}>
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D7E2EA] border border-white/20 px-4 py-2 rounded-full mb-6">
                <Camera className="w-3.5 h-3.5" /> For Event Photographers
              </span>
              <h1 className="hero-heading font-black uppercase tracking-tight leading-[0.92]" style={{ fontSize: 'clamp(3rem, 6vw, 80px)' }}>
                The shoot ends.<br />
                Your studio stays visible.
              </h1>
            </FadeIn>
            <FadeIn delay={0.15} y={20}>
              <p className="text-xl text-[#D7E2EA]/60 leading-relaxed font-light max-w-lg">
                Upload thousands of event photos and share one branded gallery. Every guest finds their own photos with one selfie—without asking your team to sort or send them.
              </p>
            </FadeIn>
            <FadeIn delay={0.28} y={20} className="flex flex-col sm:flex-row items-start gap-4">
              <Link to={ROUTES.LOGIN}>
                <GradientButton>Start Free</GradientButton>
              </Link>
              <a href="#comparison">
                <Button size="xl" variant="outline" className="rounded-full bg-transparent border-white/20 hover:bg-white/10 text-[#D7E2EA] px-10 h-14 text-base font-medium">
                  See the difference ↓
                </Button>
              </a>
            </FadeIn>
          </div>

          {/* Hero gallery mockup */}
          <FadeIn delay={0.2} y={30} className="relative">
            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#111111]">
              <div className="bg-[#1A1A1A] px-4 py-3 flex items-center gap-3 border-b border-white/5">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex-1 bg-[#222222] rounded-md px-3 py-1.5 text-[10px] font-mono text-[#D7E2EA]/40 text-center border border-white/5 uppercase tracking-widest">
                  gallery.glimpse.in/aarav-meera
                </div>
              </div>
              <div className="bg-[#0C0C0C]">
                <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-[#111111]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-white/10 text-[#D7E2EA] font-bold text-sm flex items-center justify-center border border-white/20">CS</div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-[#D7E2EA]">Capture Studios</div>
                      <div className="text-[9px] text-[#D7E2EA]/40 uppercase tracking-widest">Professional Photography</div>
                    </div>
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#0C0C0C] bg-[#D7E2EA] px-3 py-1.5 rounded-full">1,930 photos</span>
                </div>
                <div className="relative aspect-[16/7] overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=80" className="w-full h-full object-cover" alt="event cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0C] via-black/40 to-transparent" />
                  <div className="absolute bottom-5 left-6 text-white">
                    <h2 className="text-xl font-black uppercase tracking-widest">Aarav & Meera Wedding</h2>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest mt-1">December 18, 2026 · Jaipur</p>
                  </div>
                </div>
                <div className="p-4 grid grid-cols-3 gap-2">
                  {[
                    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&q=80',
                    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&q=80',
                    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&q=80',
                    'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400&q=80',
                    'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=400&q=80',
                    'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=80',
                  ].map((src, i) => (
                    <div key={i} className="aspect-square rounded-lg overflow-hidden bg-[#222222]">
                      <img src={src} className="w-full h-full object-cover" alt="gallery photo" />
                    </div>
                  ))}
                </div>
                <div className="px-4 pb-5">
                  <div className="bg-[#D7E2EA] text-[#0C0C0C] text-[10px] font-black uppercase tracking-widest text-center py-3.5 rounded-xl shadow-sm">
                    Find my photos
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -top-4 -left-4 bg-[#111111]/80 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl px-4 py-3 flex items-center gap-3">
              <Camera className="w-4 h-4 text-[#D7E2EA]" />
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#D7E2EA]">One selfie</div>
                <div className="text-[8px] text-[#D7E2EA]/50 uppercase tracking-widest">24 photos found</div>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 bg-[#111111]/80 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl px-4 py-3 flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-[#D7E2EA]" />
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#D7E2EA]">Capture Studios</div>
                <div className="text-[8px] text-[#D7E2EA]/50 uppercase tracking-widest">Visible on every screen</div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* COMPARISON */}
      <section id="comparison" className="py-32 px-6 bg-[#0C0C0C] border-t border-white/5">
        <div className="max-w-[1200px] mx-auto">
          <FadeIn y={30} className="text-center mb-20 max-w-4xl mx-auto space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D7E2EA]/40">The difference</span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight uppercase text-[#D7E2EA]">
              Your gallery should look like your studio—not generic software.
            </h2>
            <p className="text-xl text-[#D7E2EA]/60 font-light">The final client experience should carry the same care and identity as the photographs themselves.</p>
          </FadeIn>
          <div className="grid md:grid-cols-2 gap-8">
            <FadeIn y={30} delay={0.1}>
              <div className="rounded-3xl border border-white/5 bg-[#111111] p-10 space-y-6 h-full hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                    <XIcon className="w-4 h-4 text-red-400" />
                  </div>
                  <h3 className="text-xl font-bold uppercase tracking-wide text-[#D7E2EA]/50">Generic delivery</h3>
                </div>
                <div className="bg-[#0C0C0C] border border-white/5 rounded-2xl p-6 font-mono text-[10px] text-[#D7E2EA]/40 space-y-3">
                  <div className="text-[#D7E2EA]/20 text-[10px] uppercase font-black tracking-widest mb-4">WeTransfer / Google Drive</div>
                  <div>📁 DSC_0001.jpg</div>
                  <div>📁 DSC_0002.jpg</div>
                  <div>📁 DSC_0003.jpg</div>
                  <div>📁 DSC_0004.jpg</div>
                  <div className="text-white/20 pt-2">... 1,926 more files</div>
                </div>
                <p className="text-sm text-[#D7E2EA]/40 font-light">Folders and filenames. No studio experience.</p>
              </div>
            </FadeIn>

            <FadeIn y={30} delay={0.2}>
              <div className="rounded-3xl border border-[#D7E2EA]/30 bg-[#1A1A1A] p-10 space-y-6 relative overflow-hidden h-full shadow-[0_0_50px_rgba(215,226,234,0.05)]">
                <div className="absolute top-6 right-6 bg-[#D7E2EA] text-[#0C0C0C] text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-[0_0_15px_rgba(215,226,234,0.3)]">✨ With Glimpse</div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                    <Check className="w-5 h-5 text-[#D7E2EA]" />
                  </div>
                  <h3 className="text-xl font-bold uppercase tracking-wide text-[#D7E2EA]">Your studio leads</h3>
                </div>
                <div className="bg-[#111111] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                  <div className="px-5 py-3 bg-[#1A1A1A] border-b border-white/5 flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-white/10 text-[#D7E2EA] font-bold text-[8px] flex items-center justify-center">CS</div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#D7E2EA]">Capture Studios · Aarav & Meera</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 p-2">
                    {['https://images.unsplash.com/photo-1519741497674-611481863552?w=200&q=80',
                      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=200&q=80',
                      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=200&q=80',
                    ].map((src, i) => (
                      <div key={i} className="aspect-square rounded-lg overflow-hidden bg-[#222222]">
                        <img src={src} className="w-full h-full object-cover" alt="gallery" />
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-[#D7E2EA]/60 font-light">Studio logo · Studio colours · Custom cover · Premium gallery</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* PAIN vs FIX TABLE */}
      <section className="py-32 px-6 bg-[#0C0C0C] border-t border-white/5">
        <div className="max-w-[1000px] mx-auto">
          <FadeIn y={30} className="text-center mb-16 max-w-3xl mx-auto space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D7E2EA]/40">Why photographers switch</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-[#D7E2EA]">
              Less time answering guests.<br />More control over delivery.
            </h2>
          </FadeIn>
          <FadeIn y={30}>
            <ComparisonTable />
          </FadeIn>
        </div>
      </section>

      {/* EVENT TYPES TABS */}
      <section className="py-32 px-6 bg-[#0C0C0C] border-t border-white/5 overflow-hidden">
        <div className="max-w-[1200px] mx-auto">
          <FadeIn y={30} className="text-center mb-16 max-w-4xl mx-auto space-y-6">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-[#D7E2EA]">
              One delivery experience for every event you shoot.
            </h2>
            <p className="text-xl text-[#D7E2EA]/60 font-light">Change the event, not the workflow. Each gallery stays personal, searchable, and unmistakably yours.</p>
          </FadeIn>
          
          <FadeIn y={30} className="flex flex-wrap justify-center gap-3 mb-16">
            {EVENT_TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'relative px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300',
                  activeTab === tab.id
                    ? 'bg-[#D7E2EA] text-[#0C0C0C] shadow-[0_0_20px_rgba(215,226,234,0.2)]'
                    : 'bg-[#111111] border border-white/10 text-[#D7E2EA]/50 hover:border-white/30 hover:text-[#D7E2EA]'
                )}>
                {tab.label}
                {tab.badge && (
                  <span className="absolute -top-3 -right-2 text-[8px] font-black bg-[#0C0C0C] border border-[#D7E2EA]/30 text-[#D7E2EA] px-2 py-1 rounded-full uppercase tracking-wider">{tab.badge}</span>
                )}
              </button>
            ))}
          </FadeIn>

          <AnimatePresence mode="wait">
            <motion.div key={activeTab}
              initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }} 
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} 
              exit={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="grid lg:grid-cols-2 gap-16 items-center">
              
              <div className="rounded-[40px] overflow-hidden shadow-2xl aspect-[4/3] relative border border-white/10">
                <img src={activeEvent.cover} className="w-full h-full object-cover" alt={activeTab} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0C] via-black/40 to-transparent" />
                <div className="absolute top-6 left-6 bg-[#1A1A1A]/80 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-xl">
                  <div className="w-6 h-6 rounded-full bg-white/10 text-[#D7E2EA] font-bold text-[8px] flex items-center justify-center">CS</div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#D7E2EA]">Capture Studios</span>
                </div>
                <div className="absolute bottom-6 left-6 flex flex-wrap gap-2">
                  {activeEvent.stats.map(s => (
                    <span key={s} className="text-[9px] font-bold uppercase tracking-widest bg-[#111111]/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-[#D7E2EA]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-[#D7E2EA] leading-[1.1]">{activeEvent.headline}</h3>
                <p className="text-lg text-[#D7E2EA]/50 font-light leading-relaxed">{activeEvent.subtext}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ONE LINK. ONE SELFIE. */}
      <section className="py-32 px-6 bg-[#0C0C0C] border-t border-white/5">
        <div className="max-w-[1200px] mx-auto grid lg:grid-cols-12 gap-16 lg:gap-20 items-center">
          <FadeIn y={30} className="lg:col-span-5 text-left space-y-6">
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tight text-[#D7E2EA] leading-[0.9]">
              From one gallery link to every matching photo.
            </h2>
            <p className="text-xl text-[#D7E2EA]/50 font-light">Guests open the gallery, take a selfie, and find themselves—without an app or instructions.</p>
          </FadeIn>
          
          <div className="lg:col-span-7 relative z-0 mt-8 lg:mt-0">
            {/* Connecting line */}
            <div className="hidden sm:block absolute top-[28px] left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent -z-10" />
            
            <div className="grid sm:grid-cols-3 gap-8 text-center">
              {[
                { icon: LinkIcon, title: 'One link', desc: 'Guests open the event gallery', highlight: false, filledIcon: false },
                { icon: Camera, title: 'One selfie', desc: 'They find every matching photo', highlight: false, filledIcon: false },
                { icon: Check, title: "It's that simple.", desc: 'Nothing to install or learn', highlight: true, filledIcon: true },
              ].map((item, i) => (
                <FadeIn key={i} delay={i * 0.15} y={30} className="flex flex-col items-center">
                  <div className={cn(
                    "w-14 h-14 rounded-full flex items-center justify-center mb-6",
                    item.filledIcon 
                      ? "bg-[#D7E2EA] shadow-[0_0_30px_rgba(215,226,234,0.2)] border-0" 
                      : "bg-[#111111] border border-white/10"
                  )}>
                    <item.icon className={cn("w-6 h-6", item.filledIcon ? "text-[#0C0C0C]" : "text-[#D7E2EA]")} />
                  </div>
                  <h3 className={cn(
                    "text-2xl font-black uppercase tracking-wide mb-3 text-[#D7E2EA]",
                    item.highlight && "bg-white/10 px-3 py-1 rounded-lg"
                  )}>
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#D7E2EA]/50 leading-relaxed font-light uppercase tracking-wider">{item.desc}</p>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-[1200px] mx-auto my-32 border-t border-white/5" />

        <div className="max-w-[1200px] mx-auto grid lg:grid-cols-12 gap-16 lg:gap-20 items-start">
          <FadeIn y={30} className="lg:col-span-5 text-left space-y-6">
            <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tight text-[#D7E2EA] leading-[0.9]">Try Glimpse with confidence.</h2>
            <p className="text-xl text-[#D7E2EA]/50 font-light">What to know about guests, branding, privacy, and the free plan.</p>
          </FadeIn>
          <FadeIn y={30} delay={0.2} className="lg:col-span-7">
            <FAQAccordion faqs={FAQS} />
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
