import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/utils/constants';
import { Button } from '@/components/ui';
import {
  Check, X as XIcon, ChevronDown, Plus,
  Camera, Sparkles, Share2, Clock, Image, UploadCloud, Lock,
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

const PAIN_COMPARISON = [
  { pain: '“When will we get our photos?”', fix: 'Guests find them themselves with one selfie.' },
  { pain: 'Hours spent sorting photos manually.', fix: 'Every guest automatically sees only their own photos.' },
  { pain: 'Every gallery looks like generic software.', fix: 'Every gallery carries your own studio branding.' },
  { pain: 'Links get forwarded everywhere.', fix: 'Secure links put access and downloads under your control.' },
];

const FAQS = [
  { q: 'How do guests find their photos?', a: "Guests open your event link, take a single selfie, and Glimpse's face-match AI gathers every photo they appear in into a personal gallery. When you upload more photos later, their gallery updates automatically." },
  { q: 'Do guests need to install an app?', a: "No. Guests open the gallery in their phone's browser from a link or QR code. They create or sign in to a simple Glimpse account so their matched photos stay private and remain available when they return." },
  { q: 'Is the gallery white-label?', a: 'Yes. Your logo, colours, and covers carry through the entire guest experience — from the link preview to the download screen. Guests see your studio, not our software.' },
  { q: 'Is there a free plan?', a: 'Yes. You can run a real event from start to finish on the free plan. Upgrade only when your events grow bigger.' },
  { q: 'How is guest privacy handled?', a: "Matching is scoped to the event: a guest's selfie is compared only against the faces in the event they opened. The selfie is saved to the guest's own account, so if they attend another event they are not asked for a new one. Media is served through signed links, and you control who can view or download. See our Privacy Policy for the full picture." },
];

const FEATURES_GRID = [
  { icon: Sparkles, title: 'AI Face Matching', desc: 'Guests find all their photos automatically with a single selfie — no tagging, no manual sorting.' },
  { icon: Image, title: 'Branded Galleries', desc: 'Your logo, studio name, and cover photo on every event gallery your clients share.' },
  { icon: UploadCloud, title: 'Bulk Upload', desc: 'Drop thousands of photos in one go. Glimpse processes and indexes them in the background.' },
  { icon: Share2, title: 'One Link Delivery', desc: 'Send one WhatsApp link or print one QR standee. Every guest self-serves their own photos.' },
  { icon: Lock, title: 'Privacy First', desc: 'Guest selfies deleted instantly. Gallery access is private and expiry-controlled by you.' },
  { icon: BarChart3, title: 'Live Delivery Feed', desc: 'Track in real time which guests have accessed and downloaded their photos per event.' },
  { icon: Clock, title: 'Faster Turnaround', desc: 'Deliver galleries while the event is still fresh — often before guests even leave the venue.' },
  { icon: Smartphone, title: 'No App Required', desc: 'Works in Safari, Chrome, or any mobile browser. No installs, no friction for your clients.' },
];

export default function ForPhotographersPage() {
  const [isNavScrolled, setIsNavScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('wedding');
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsNavScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeEvent = EVENT_TABS.find(t => t.id === activeTab);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)] font-sans selection:bg-[var(--accent-soft)] selection:text-[var(--accent)] overflow-x-hidden">

      {/* Navigation - Dynamic Shrinking Glass Header/Pill */}
      <nav className={cn(
        "fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-in-out",
        isNavScrolled
          ? "top-6 w-[90%] md:w-[75%] max-w-[1200px] px-6 py-3 bg-white/70 backdrop-blur-lg border border-white/40 shadow-md rounded-full"
          : "top-0 w-full max-w-full px-8 md:px-16 py-6 bg-transparent border-b border-transparent shadow-none rounded-none"
      )}>
        <div className="max-w-[1200px] mx-auto w-full flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold tracking-tighter text-[var(--text-primary)] flex items-center gap-1.5">
            Glimpse
          </Link>

          <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            <Link to="/" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Home</Link>
            <Link to="/how-it-works" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">How it works</Link>
            <Link to="/for-photographers" className="text-sm font-semibold text-[var(--accent)] transition-colors">For photographers</Link>
            <a href="#pricing" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-4">
            <Link to={ROUTES.LOGIN} className="text-sm font-semibold text-[var(--text-primary)] hover:text-[var(--text-secondary)] transition-colors hidden sm:block px-2">
              Login
            </Link>
            <Link to={ROUTES.DASHBOARD}>
              <Button className="rounded-full px-6 shadow-sm font-semibold tracking-wide bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white">
                Start free →
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-40 pb-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[var(--accent-soft)] rounded-full blur-[160px] opacity-40 -z-10" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-100 rounded-full blur-[120px] opacity-20 -z-10" />
        <div className="max-w-[1200px] mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--accent)] bg-[var(--accent-soft)] px-3 py-1.5 rounded-full mb-6">
                <Camera className="w-3.5 h-3.5" /> For Event Photographers
              </span>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter leading-[0.92] text-[var(--text-primary)]">
                The shoot ends.<br />
                <span className="text-[var(--accent)]">Your studio stays visible.</span>
              </h1>
            </motion.div>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }}
              className="text-xl text-[var(--text-secondary)] leading-relaxed max-w-lg">
              Upload thousands of event photos and share one branded gallery. Every guest finds their own photos with one selfie—without asking your team to sort or send them.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.28 }}
              className="flex flex-col sm:flex-row items-start gap-4">
              <Link to={ROUTES.DASHBOARD}>
                <Button size="xl" className="rounded-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white shadow-xl px-10 h-14 text-base font-semibold tracking-wide">
                  Start free →
                </Button>
              </Link>
              <a href="#comparison">
                <Button size="xl" variant="outline" className="rounded-full bg-white/40 border-[var(--border-strong)] hover:bg-white/70 px-10 h-14 text-base font-medium">
                  See the difference ↓
                </Button>
              </a>
            </motion.div>
          </div>

          {/* Hero gallery mockup */}
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="relative">
            <div className="rounded-2xl overflow-hidden border border-[var(--border)] shadow-2xl bg-white">
              <div className="bg-gray-100 px-4 py-3 flex items-center gap-3 border-b border-gray-200">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 bg-white rounded-md px-3 py-1 text-xs font-mono text-gray-500 text-center border border-gray-200">
                  gallery.glimpse.in/aarav-meera
                </div>
              </div>
              <div className="bg-[#FAF8F5]">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[var(--accent-soft)] text-[var(--accent)] font-bold text-sm flex items-center justify-center">CS</div>
                    <div>
                      <div className="text-sm font-bold text-gray-800">Capture Studios</div>
                      <div className="text-[10px] text-gray-400">Professional Photography</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[var(--accent)] bg-[var(--accent-soft)] px-3 py-1 rounded-full">1,930 photos</span>
                </div>
                <div className="relative aspect-[16/7] overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=80" className="w-full h-full object-cover" alt="event cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute bottom-5 left-6 text-white">
                    <h2 className="text-2xl font-extrabold tracking-tight">Aarav & Meera Wedding</h2>
                    <p className="text-sm opacity-70 mt-0.5">December 18, 2026 · Jaipur</p>
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
                    <div key={i} className="aspect-square rounded-lg overflow-hidden bg-gray-200">
                      <img src={src} className="w-full h-full object-cover" alt="gallery photo" />
                    </div>
                  ))}
                </div>
                <div className="px-4 pb-5">
                  <div className="bg-[var(--accent)] text-white text-sm font-bold text-center py-3 rounded-xl shadow-sm">
                    Find my photos →
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -top-4 -left-4 bg-white border border-[var(--border)] rounded-xl shadow-lg px-4 py-3 flex items-center gap-2">
              <div>
                <div className="text-xs font-bold text-gray-800">One selfie</div>
                <div className="text-[10px] text-gray-400">24 photos found</div>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 bg-white border border-[var(--border)] rounded-xl shadow-lg px-4 py-3 flex items-center gap-2">
              <div>
                <div className="text-xs font-bold text-gray-800">Capture Studios</div>
                <div className="text-[10px] text-gray-400">Visible on every screen</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* COMPARISON */}
      <section id="comparison" className="py-28 px-6 bg-[var(--surface)] border-t border-[var(--border)]">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--accent)]">The difference</span>
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mt-3 mb-4">
              Your gallery should look like <span className="text-[var(--accent)]">your studio</span>—not generic software.
            </h2>
            <p className="text-lg text-[var(--text-secondary)]">The final client experience should carry the same care and identity as the photographs themselves.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-8 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-50 border border-red-200 flex items-center justify-center">
                  <XIcon className="w-4 h-4 text-red-400" />
                </div>
                <h3 className="text-lg font-bold text-[var(--text-muted)]">Generic delivery</h3>
              </div>
              <div className="bg-gray-100 border border-gray-200 rounded-xl p-5 font-mono text-xs text-gray-500 space-y-2">
                <div className="text-gray-400 text-[10px] uppercase font-bold tracking-widest mb-3">WeTransfer / Google Drive</div>
                <div>📁 DSC_0001.jpg</div>
                <div>📁 DSC_0002.jpg</div>
                <div>📁 DSC_0003.jpg</div>
                <div>📁 DSC_0004.jpg</div>
                <div className="text-gray-300">... 1,926 more files</div>
              </div>
              <p className="text-sm text-[var(--text-secondary)] font-medium">Folders and filenames. No studio experience.</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="rounded-2xl border border-[var(--accent)]/30 bg-[var(--accent-soft)]/40 p-8 space-y-5 relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-[var(--accent)] text-white text-[10px] font-bold px-3 py-1 rounded-full">✨ With Glimpse</div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--accent-soft)] border border-[var(--accent)]/30 flex items-center justify-center">
                  <Check className="w-4 h-4 text-[var(--accent)]" />
                </div>
                <h3 className="text-lg font-bold text-[var(--text-primary)]">Your studio leads</h3>
              </div>
              <div className="bg-[#FAF8F5] border border-[var(--border)] rounded-xl overflow-hidden">
                <div className="px-4 py-2.5 bg-white border-b border-gray-100 flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[var(--accent-soft)] text-[var(--accent)] font-bold text-[8px] flex items-center justify-center">CS</div>
                  <span className="text-xs font-bold text-gray-700">Capture Studios · Aarav & Meera</span>
                </div>
                <div className="grid grid-cols-3 gap-1 p-2">
                  {['https://images.unsplash.com/photo-1519741497674-611481863552?w=200&q=80',
                    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=200&q=80',
                    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=200&q=80',
                  ].map((src, i) => (
                    <div key={i} className="aspect-square rounded overflow-hidden">
                      <img src={src} className="w-full h-full object-cover" alt="gallery" />
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-sm text-[var(--text-secondary)] font-medium">Studio logo · Studio colours · Custom cover · Premium gallery</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* PAIN vs FIX TABLE */}
      <section className="py-28 px-6 bg-[var(--background)] border-t border-[var(--border)]">
        <div className="max-w-[1000px] mx-auto">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--accent)]">Why photographers switch</span>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mt-3 mb-4">
              Less time answering guests.<br />More control over delivery.
            </h2>
          </div>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
            <div className="grid grid-cols-2 border-b border-[var(--border)] bg-[var(--surface-soft)]">
              <div className="grid place-content-center px-6 py-4 text-[13px] font-bold text-[var(--text-muted)] border-r border-[var(--border)]">
                What slows you down
              </div>
              <div className="grid place-content-center px-6 py-4 text-[13px] font-bold text-[var(--text-primary)]">
                What changes with Glimpse
              </div>
            </div>
            {PAIN_COMPARISON.map((row, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className="grid grid-cols-2 border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface-soft)] transition-colors">
                <div className="px-6 py-5 text-sm text-[var(--text-muted)] border-r border-[var(--border)] flex items-start gap-3">
                  <span className="text-red-400 shrink-0 mt-0.5">✕</span>{row.pain}
                </div>
                <div className="px-6 py-5 text-sm text-[var(--text-primary)] font-medium flex items-start gap-3">
                  <span className="text-[var(--accent)] shrink-0 mt-0.5">✓</span>{row.fix}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* EVENT TYPES TABS */}
      <section className="py-28 px-6 bg-[var(--background)] border-t border-[var(--border)] overflow-hidden">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mt-3 mb-4">
              One delivery experience for <span className="text-[var(--accent)]">every event</span> you shoot.
            </h2>
            <p className="text-lg text-[var(--text-secondary)]">Change the event, not the workflow. Each gallery stays personal, searchable, and unmistakably yours.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {EVENT_TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'relative px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300',
                  activeTab === tab.id
                    ? 'bg-[var(--accent)] text-white shadow-md'
                    : 'bg-[var(--surface)] border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)]/40 hover:text-[var(--text-primary)]'
                )}>
                {tab.label}
                {tab.badge && (
                  <span className="absolute -top-2 -right-2 text-[9px] font-bold bg-orange-500 text-white px-1.5 py-0.5 rounded-full">{tab.badge}</span>
                )}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={activeTab}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
              className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] relative">
                <img src={activeEvent.cover} className="w-full h-full object-cover" alt={activeTab} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 flex items-center gap-2 shadow-sm">
                  <div className="w-5 h-5 rounded-full bg-[var(--accent-soft)] text-[var(--accent)] font-bold text-[8px] flex items-center justify-center">CS</div>
                  <span className="text-xs font-bold text-gray-800">Capture Studios</span>
                </div>
                <div className="absolute bottom-5 left-5 flex gap-2">
                  {activeEvent.stats.map(s => (
                    <span key={s} className="text-[10px] font-bold bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/30 text-white">{s}</span>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight">{activeEvent.headline}</h3>
                <p className="text-lg text-[var(--text-secondary)] leading-relaxed">{activeEvent.subtext}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ONE LINK. ONE SELFIE. */}
      <section className="py-28 px-6 bg-[var(--surface)] border-t border-[var(--border)]">
        <div className="max-w-[1200px] mx-auto grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          <div className="lg:col-span-5 text-left">
            <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4 text-[var(--text-primary)]">
              From one gallery link to every matching photo.
            </h2>
            <p className="text-lg text-[var(--text-secondary)]">Guests open the gallery, take a selfie, and find themselves—without an app or instructions.</p>
          </div>
          <div className="lg:col-span-7 relative z-0 mt-8 lg:mt-0">
            {/* Connecting line */}
            <div className="hidden sm:block absolute top-[24px] left-[15%] right-[15%] h-[1px] bg-[var(--border)] -z-10" />
            
            <div className="grid sm:grid-cols-3 gap-6 text-center">
              {[
                { icon: LinkIcon, title: 'One link', desc: 'Guests open the event gallery', highlight: false, filledIcon: false },
                { icon: Camera, title: 'One selfie', desc: 'They find every matching photo', highlight: false, filledIcon: false },
                { icon: Check, title: "It's that simple.", desc: 'Nothing to install or learn', highlight: true, filledIcon: true },
              ].map((item, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                  className="flex flex-col items-center">
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center mb-5",
                    item.filledIcon 
                      ? "bg-[var(--accent)] text-white shadow-md border-0" 
                      : "bg-[var(--surface)] border border-[var(--border)] text-[var(--accent)]"
                  )}>
                    <item.icon className={cn("w-5 h-5", item.filledIcon ? "text-white" : "text-[var(--accent)]")} />
                  </div>
                  <h3 className={cn(
                    "text-2xl md:text-4xl font-extrabold mb-4",
                    item.highlight && "bg-[var(--accent-soft)]/80 px-2 py-0.5 rounded-md"
                  )}>
                    {item.title}
                  </h3>
                  <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed max-w-[140px] mx-auto ">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-[1200px] mx-auto my-24 border-t border-[var(--border)]" />

        <div className="max-w-[1200px] mx-auto grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          <div className="lg:col-span-5 text-left">
            <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4 text-[var(--text-primary)]">Try Glimpse with confidence.</h2>
            <p className="text-lg text-[var(--text-secondary)]">What to know about guests, branding, privacy, and the free plan.</p>
          </div>
          <div className="lg:col-span-7">
            {FAQS.map((faq, i) => (
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
        </div>
      </section>



      {/* FOOTER — matches LandingPage */}
      <footer className="bg-[#1C1814] relative overflow-hidden text-white font-sans border-t border-[#2C2620]">
        {/* Hexagon Pattern Background */}
        <div
          className="absolute inset-0 z-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='103.923' viewBox='0 0 60 103.923' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 17.32V51.96L30 69.28L0 51.96V17.32L30 0ZM30 103.92L60 86.6V51.96L30 34.64L0 51.96V86.6L30 103.92Z' fill='none' stroke='%23FFFFFF' stroke-width='1.5'/%3E%3C/svg%3E")`,
            backgroundSize: '120px',
            backgroundPosition: 'top center'
          }}
        />
        <div className="relative z-10 max-w-[1300px] mx-auto px-6 pt-24 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-24">

            {/* Left Column */}
            <div className="md:col-span-5 lg:col-span-4 space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="text-3xl font-bold tracking-tighter text-white">Glimpse</div>
              </div>
              <p className="text-[#A19D98] text-sm leading-relaxed max-w-[280px]">
                AI-powered event photo delivery for photographers and studios across India.
              </p>
              <p className="text-[#84807C] text-xs max-w-[280px]">One browser link. Private matching. Your brand.</p>
              <div className="pt-2 flex items-center gap-2 text-[#A19D98] hover:text-white transition-colors cursor-pointer w-fit">
                <Mail className="w-4 h-4 text-[var(--accent)]" />
                <span className="text-sm font-semibold">hello@glimpse.in</span>
              </div>
              <div className="flex items-center gap-3 pt-4">
                {[Instagram, Facebook, XIcon, LinkIcon, Youtube].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all">
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Spacer */}
            <div className="hidden lg:block md:col-span-2 lg:col-span-3" />

            {/* Explore Column */}
            <div className="md:col-span-4 lg:col-span-3">
              <h4 className="text-[10px] font-bold tracking-widest text-[#6B6661] uppercase mb-6">EXPLORE</h4>
              <ul className="space-y-4 text-sm font-medium text-[#A19D98]">
                <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/how-it-works" className="hover:text-white transition-colors">How it works</Link></li>
                <li><Link to="/for-photographers" className="hover:text-white transition-colors">For photographers</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              </ul>
            </div>

            {/* Legal Column */}
            <div className="md:col-span-3 lg:col-span-2">
              <h4 className="text-[10px] font-bold tracking-widest text-[#6B6661] uppercase mb-6">LEGAL</h4>
              <ul className="space-y-4 text-sm font-medium text-[#A19D98]">
                <li><a href="#" className="hover:text-white transition-colors">Terms &amp; Conditions</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>

          {/* Copyright Bar */}
          <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-medium text-[#6B6661]">
            <div>© 2026 Glimpse India. All rights reserved.</div>
            <div>A product of Logicbyts Software Solutions.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
