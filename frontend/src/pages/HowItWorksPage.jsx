import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/utils/constants';
import { Button } from '@/components/ui';
import {
  Check,
  X as XIcon,
  Link as LinkIcon,
  Camera,
  CheckCircle2,
  Mail,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Play,
  Pause,
  Smartphone,
  Laptop,
  Lock,
  Sparkles,
  Share2,
  UploadCloud,
  ShieldCheck,
  ArrowRight,
  HelpCircle,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/utils/utils';
import Lenis from 'lenis';

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=80',
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&q=80'
];

export default function HowItWorksPage() {
  // Smooth scroll activation
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Shrinking header check on scroll
  const [isNavScrolled, setIsNavScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsNavScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Video state management
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => { });
      }
      setIsPlaying(!isPlaying);
    }
  };

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
            <Link to="/how-it-works" className="text-sm font-semibold text-[var(--accent)] transition-colors">How it works</Link>
            <Link to="/for-photographers" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">For photographers</Link>
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

      {/* Hero Section */}
      <section className="pt-40 pb-0 flex flex-col items-center text-center px-6 relative bg-gradient-to-b from-[#FFFDF9] to-[var(--background)] overflow-hidden">
        {/* Decorative ambient blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[var(--accent-soft)] rounded-full blur-[120px] opacity-40 -z-10" />
        <div className="absolute bottom-0 right-[-10%] w-[40%] h-[40%] bg-[var(--accent-soft)] rounded-full blur-[100px] opacity-30 -z-10" />

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-[var(--accent-soft)] text-[var(--accent)] font-semibold px-4 py-1.5 rounded-full text-xs md:text-sm tracking-wider uppercase inline-flex items-center gap-2 mb-6 shadow-sm border border-[var(--accent)]/10"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
          How it works
        </motion.div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter text-[var(--text-primary)] leading-[0.95] mb-6 max-w-4xl">
          Upload once.<br />
          Every guest finds<br />
          <span className="text-[var(--accent)]">their moment.</span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-lg md:text-xl text-[var(--text-secondary)] font-medium max-w-2xl leading-relaxed mb-10"
        >
          Create the event once. Upload your photos directly. Guests use one single web link and a selfie to instantly see and download every photo they appear in.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-20"
        >
          <Link to={ROUTES.DASHBOARD}>
            <Button size="xl" className="rounded-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white shadow-xl px-10 h-14 text-base font-semibold tracking-wide">
              Start free →
            </Button>
          </Link>
          <a href="#workflow-steps">
            <Button size="xl" variant="outline" className="rounded-full bg-white/40 border-[var(--border-strong)] hover:bg-white/80 px-10 h-14 text-base font-medium">
              See How It Works ↓
            </Button>
          </a>
        </motion.div>

        {/* Stats row */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.45 }}
          className="flex flex-wrap justify-center gap-6 mb-16">
          {[
            { num: '< 60s', label: 'to create an event' },
            { num: '1 selfie', label: 'for guests to find photos' },
            { num: '0 apps', label: 'needed by guests' },
            { num: '100%', label: 'your studio branding' },
          ].map(stat => (
            <div key={stat.label} className="text-center bg-[var(--surface)] border border-[var(--border)] rounded-2xl px-6 py-4">
              <div className="text-2xl font-extrabold text-[var(--text-primary)]">{stat.num}</div>
              <div className="text-xs text-[var(--text-muted)] mt-0.5">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Full-width scrolling photo strip */}
        <div className="w-screen relative left-1/2 -translate-x-1/2 overflow-hidden">
          <div className="flex gap-3 animate-[scroll_30s_linear_infinite] w-max px-3 pb-12">
            {[
              'https://images.unsplash.com/photo-1519741497674-611481863552?w=500&q=80',
              'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=500&q=80',
              'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500&q=80',
              'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=500&q=80',
              'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=500&q=80',
              'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=500&q=80',
              'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&q=80',
              'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=500&q=80',
              'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=500&q=80',
              'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&q=80',
              // Duplicate for seamless loop
              'https://images.unsplash.com/photo-1519741497674-611481863552?w=500&q=80',
              'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=500&q=80',
              'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500&q=80',
              'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=500&q=80',
              'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=500&q=80',
              'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=500&q=80',
              'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&q=80',
              'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=500&q=80',
              'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=500&q=80',
              'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&q=80',
            ].map((src, i) => (
              <div key={i} className="w-[260px] h-[180px] rounded-2xl overflow-hidden shrink-0 shadow-md">
                <img src={src} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" alt="event photo" />
              </div>
            ))}
          </div>
          {/* Gradient fade edges */}
          <div className="absolute top-0 left-0 h-full w-32 bg-gradient-to-r from-[#FFFDF9] to-transparent pointer-events-none" />
          <div className="absolute top-0 right-0 h-full w-32 bg-gradient-to-l from-[var(--background)] to-transparent pointer-events-none" />
        </div>
      </section>


      {/* The 4-Step Breakdown (Split Layout) */}
      <section id="workflow-steps" className="py-24 px-6 bg-[var(--surface)] border-t border-[var(--border)]">
        <div className="max-w-[1200px] mx-auto space-y-32">

          {/* Step 1 */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <div className="text-[var(--accent)] text-lg font-bold font-mono">STEP 01</div>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--text-primary)]">Create the event</h2>
              <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
                Name your event workspace, pick a cover banner, and add your studio details. Glimpse generates your private client gallery and sharing link instantly.
              </p>
              <ul className="space-y-3 pt-4">
                {['Branded dashboard layout', 'Custom cover image integration', 'Takes under 60 seconds to set up'].map((li, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium text-[var(--text-secondary)]">
                    <div className="w-5 h-5 rounded-full bg-[var(--accent-soft)] flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-[var(--accent)]" />
                    </div>
                    {li}
                  </li>
                ))}
              </ul>
            </div>

            {/* Step 1 Visual Mockup */}
            <div className="bg-[#FAF8F5] border border-[var(--border)] rounded-2xl p-6 shadow-sm">
              {/* Cover Photo Strip */}
              <div className="rounded-xl overflow-hidden mb-4 aspect-[16/6] relative">
                <img src="https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80" className="w-full h-full object-cover" alt="event cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-4 text-white">
                  <div className="text-xs font-bold">Aarav & Meera Wedding</div>
                  <div className="text-[10px] opacity-70">Dec 18, 2026</div>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Event Configurator</span>
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase block mb-1">Event Name</label>
                    <div className="border border-gray-200 rounded p-2 text-xs font-semibold text-gray-700 bg-gray-50">Aarav & Meera Wedding</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase block mb-1">Event Date</label>
                      <div className="border border-gray-200 rounded p-2 text-xs text-gray-600 bg-gray-50">Dec 18, 2026</div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase block mb-1">Studio Branding</label>
                      <div className="border border-gray-200 rounded p-2 text-xs text-[var(--accent)] bg-[var(--accent-soft)] font-semibold text-center">Capture Studios</div>
                    </div>
                  </div>
                </div>
                <div className="bg-[var(--accent)] text-white text-xs font-bold text-center py-2.5 rounded-lg shadow-sm">
                  Create Event Workspace
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Step 2 Visual Mockup (Left on desktop) */}
            <div className="bg-[#FAF8F5] border border-[var(--border)] rounded-2xl p-6 shadow-sm order-2 lg:order-1">
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UploadCloud className="w-4 h-4 text-[var(--accent)]" />
                    <span className="text-xs font-bold text-gray-700">Photo Uploader</span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono">42.4 MB/s</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-[var(--accent)] h-2 rounded-full w-[84%] transition-all" />
                </div>
                <div className="flex justify-between text-[11px] text-[var(--text-secondary)]">
                  <span>Uploading 428 / 512 photos...</span>
                  <span className="font-bold">84%</span>
                </div>
                <div className="grid grid-cols-4 gap-2 pt-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="aspect-square bg-gray-100 rounded relative overflow-hidden">
                      <img src={HERO_IMAGES[i % HERO_IMAGES.length]} className="w-full h-full object-cover opacity-60" alt="uploader" />
                      {i === 3 && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-[10px] text-white font-bold">
                          +84
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6 order-1 lg:order-2">
              <div className="text-[var(--accent)] text-lg font-bold font-mono">STEP 02</div>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--text-primary)]">Upload your photos</h2>
              <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
                Upload your raw or edited photos straight to the dashboard. Our AI processes face signatures dynamically in the background, identifying guests instantly.
              </p>
              <ul className="space-y-3 pt-4">
                {['Drag & drop browser uploader', 'High-speed cloud processing', 'Smart background face indexing'].map((li, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium text-[var(--text-secondary)]">
                    <div className="w-5 h-5 rounded-full bg-[var(--accent-soft)] flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-[var(--accent)]" />
                    </div>
                    {li}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Step 3 */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <div className="text-[var(--accent)] text-lg font-bold font-mono">STEP 03</div>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--text-primary)]">Share one link</h2>
              <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
                No folders, no lists, no passwords. Send one web link in WhatsApp, or download the printable QR standee and display it at the event venue.
              </p>
              <ul className="space-y-3 pt-4">
                {['Single access link for all guests', 'Printable QR code for tables', 'Integrated social sharing options'].map((li, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium text-[var(--text-secondary)]">
                    <div className="w-5 h-5 rounded-full bg-[var(--accent-soft)] flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-[var(--accent)]" />
                    </div>
                    {li}
                  </li>
                ))}
              </ul>
            </div>

            {/* Step 3 Visual Mockup */}
            <div className="bg-[#FAF8F5] border border-[var(--border)] rounded-2xl p-6 shadow-sm">
              {/* QR Standee Preview image */}
              <div className="rounded-xl overflow-hidden mb-4 aspect-[16/7] relative bg-gradient-to-br from-[var(--accent-soft)] to-[var(--surface-soft)] flex items-center justify-center">
                {/* WhatsApp preview strip */}
                <div className="flex gap-2 p-4 w-full">
                  <div className="flex-1 bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-white">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                        <span className="text-[8px] text-white font-bold">W</span>
                      </div>
                      <span className="text-[9px] font-bold text-gray-600">WhatsApp</span>
                    </div>
                    <div className="text-[9px] text-gray-700 font-medium">📸 Your photos from Aarav & Meera Wedding are ready!</div>
                    <div className="mt-1 text-[8px] text-[var(--accent)] font-bold">glimpse.in/e/aarav-meera →</div>
                  </div>
                  <div className="w-20 bg-white/80 rounded-xl p-2 shadow-sm border border-white flex flex-col items-center justify-center gap-1">
                    <div className="grid grid-cols-3 gap-0.5">
                      {Array.from({length:9}).map((_,i) => (
                        <div key={i} className={`w-1.5 h-1.5 rounded-sm ${i%3===0 || i===4 ? 'bg-gray-800' : 'bg-gray-300'}`} />
                      ))}
                    </div>
                    <span className="text-[7px] font-bold text-gray-500">QR Standee</span>
                  </div>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4">
                <span className="text-xs font-bold text-gray-700 block">Share Link</span>
                <div className="flex gap-2">
                  <div className="flex-1 bg-gray-50 border border-gray-200 rounded px-3 py-2 text-xs font-mono text-gray-500 select-all truncate">
                    glimpse.in/e/aarav-meera
                  </div>
                  <button className="bg-gray-150 hover:bg-gray-200 border border-gray-300 text-xs font-bold px-4 py-2 rounded shrink-0 transition-colors">
                    Copy
                  </button>
                </div>
                <div className="border border-gray-150 rounded-lg p-3 flex items-center gap-3 bg-gray-50">
                  <div className="w-10 h-10 bg-[var(--accent-soft)] text-[var(--accent)] rounded-md flex items-center justify-center shrink-0">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-700 block">QR Standee</span>
                    <span className="text-[10px] text-gray-400">Download ready-to-print SVG</span>
                  </div>
                  <button className="ml-auto bg-[var(--accent)] text-white text-[10px] font-bold px-3 py-1.5 rounded transition-transform hover:scale-102">
                    Print QR
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Step 4 Visual Mockup (Left on desktop) */}
            <div className="bg-[#FAF8F5] border border-[var(--border)] rounded-2xl p-6 shadow-sm order-2 lg:order-1">
              {/* Photo thumbnail strip preview */}
              <div className="rounded-xl overflow-hidden mb-4 relative">
                <div className="flex gap-1.5 h-24">
                  {[
                    'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=300&q=80',
                    'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&q=80',
                    'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=300&q=80',
                    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&q=80',
                    'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=300&q=80',
                  ].map((src, i) => (
                    <div key={i} className="flex-1 rounded-lg overflow-hidden relative">
                      <img src={src} className="w-full h-full object-cover" alt="matched photo" />
                      {i === 4 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="text-white font-bold text-sm">+27</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-1.5 text-[10px] text-[var(--text-muted)] font-medium">Priya Sharma · 32 matched photos</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4">
                <span className="text-xs font-bold text-gray-700 block">Live Delivery Feed</span>
                <div className="space-y-2">
                  {[
                    { name: 'Priya Sharma', photos: 32, matched: '98% match' },
                    { name: 'Rahul Verma', photos: 18, matched: '94% match' },
                    { name: 'Aman Singhal', photos: 25, matched: '96% match' }
                  ].map((guest, i) => (
                    <div key={i} className="flex items-center justify-between text-xs py-2 border-b border-gray-50 last:border-0">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-150 flex items-center justify-center font-bold text-[10px] text-gray-600">
                          {guest.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <span className="font-semibold block text-gray-700">{guest.name}</span>
                          <span className="text-[10px] text-gray-400">{guest.photos} photos matched</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full font-medium">
                        {guest.matched}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6 order-1 lg:order-2">
              <div className="text-[var(--accent)] text-lg font-bold font-mono">STEP 04</div>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--text-primary)]">Guests get their photos</h2>
              <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
                Guests open the link, upload a quick selfie, and instantly see their own matching photos. They download original-resolution files directly based on your event settings.
              </p>
              <ul className="space-y-3 pt-4">
                {['Instant face signatures comparison', 'Zero manual sorting needed', 'Private, isolated guest galleries'].map((li, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium text-[var(--text-secondary)]">
                    <div className="w-5 h-5 rounded-full bg-[var(--accent-soft)] flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-[var(--accent)]" />
                    </div>
                    {li}
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </section>

      {/* ============================================
          ONE LINK. ONE SELFIE. IT'S THAT SIMPLE.
          Visual showcase inspired by fotobee.in/how-it-works
      ============================================ */}
      <section className="py-32 px-6 bg-[var(--background)] border-t border-[var(--border)] overflow-hidden">
        <div className="max-w-[1300px] mx-auto">

          {/* Section Heading */}
          <div className="text-center mb-24 max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-7xl lg:text-[7.5rem] font-extrabold tracking-tighter leading-[0.9] text-[var(--text-primary)] mb-6">
              One link.<br />
              One selfie.<br />
              <span className="text-[var(--accent)]">It's that simple.</span>
            </h2>
            <p className="text-xl text-[var(--text-secondary)] max-w-xl mx-auto">
              Everything runs in the mobile browser. No app, no login, no instructions needed.
            </p>
          </div>

          {/* Three-Step Phone Showcase */}
          <div className="grid md:grid-cols-3 gap-6 lg:gap-10 items-start relative">

            {/* Connecting line between phones (desktop) */}
            <div className="hidden md:block absolute top-[120px] left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)]/30 to-transparent" />

            {/* Step 1 - Open the link */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="flex flex-col items-center text-center group"
            >
              {/* Step label */}
              <div className="flex items-center gap-2 mb-6">
                <div className="w-7 h-7 rounded-full bg-[var(--accent)] text-white text-xs font-bold flex items-center justify-center">01</div>
                <span className="text-sm font-bold tracking-widest uppercase text-[var(--accent)]">Open the link</span>
              </div>

              {/* Phone mockup with event gallery image */}
              <div className="relative w-[220px] mx-auto">
                {/* Phone frame */}
                <div className="relative border-[10px] border-gray-800 rounded-[2.5rem] overflow-hidden shadow-2xl bg-black aspect-[9/19]">
                  {/* Phone notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-gray-800 rounded-b-2xl z-20" />
                  {/* Screen content - Event Gallery mockup */}
                  <div className="w-full h-full bg-[#FAF8F5] flex flex-col relative overflow-hidden">
                    {/* Gallery header */}
                    <div className="pt-6 px-3 pb-3 bg-white border-b border-gray-100">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-5 h-5 rounded-full bg-[var(--accent-soft)] text-[var(--accent)] font-bold text-[8px] flex items-center justify-center">CS</div>
                        <span className="text-[9px] font-bold text-gray-700">Capture Studios</span>
                      </div>
                      <div className="text-[11px] font-bold text-gray-800 mb-0.5">Aarav & Meera Wedding</div>
                      <div className="text-[8px] text-gray-400">1,930 photos · Dec 18</div>
                    </div>
                    {/* Photo grid */}
                    <div className="grid grid-cols-2 gap-1 p-2 flex-1">
                      {[
                        'https://images.unsplash.com/photo-1519741497674-611481863552?w=300&q=80',
                        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=300&q=80',
                        'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=300&q=80',
                        'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=300&q=80',
                        'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=300&q=80',
                        'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=300&q=80',
                      ].map((src, i) => (
                        <div key={i} className="aspect-square rounded overflow-hidden bg-gray-200">
                          <img src={src} className="w-full h-full object-cover" alt="gallery" />
                        </div>
                      ))}
                    </div>
                    {/* CTA Button */}
                    <div className="p-2 bg-white border-t border-gray-100">
                      <div className="bg-[var(--accent)] text-white text-[9px] font-bold text-center py-2 rounded-full">Find my photos →</div>
                    </div>
                  </div>
                </div>
                {/* Glow behind phone */}
                <div className="absolute inset-0 bg-[var(--accent-soft)] blur-3xl opacity-30 -z-10 scale-75" />
              </div>

              <div className="mt-6 space-y-1">
                <h3 className="text-xl font-bold text-[var(--text-primary)]">Open the gallery</h3>
                <p className="text-sm text-[var(--text-secondary)]">Tap the WhatsApp link or scan the QR code at the venue.</p>
              </div>
            </motion.div>

            {/* Step 2 - Take a selfie */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="flex flex-col items-center text-center group md:mt-12"
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="w-7 h-7 rounded-full bg-[var(--accent)] text-white text-xs font-bold flex items-center justify-center">02</div>
                <span className="text-sm font-bold tracking-widest uppercase text-[var(--accent)]">Take a selfie</span>
              </div>

              {/* Phone mockup - Selfie / camera UI */}
              <div className="relative w-[220px] mx-auto">
                <div className="relative border-[10px] border-gray-800 rounded-[2.5rem] overflow-hidden shadow-2xl bg-black aspect-[9/19]">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-gray-800 rounded-b-2xl z-20" />
                  {/* Selfie Camera UI */}
                  <div className="w-full h-full relative bg-gray-900 flex flex-col">
                    {/* Camera viewport */}
                    <div className="flex-1 relative overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&q=80"
                        className="w-full h-full object-cover opacity-80"
                        alt="selfie camera view"
                      />
                      {/* Face detection ring overlay */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-28 h-36 rounded-full border-2 border-[var(--accent)] border-dashed opacity-80 animate-pulse" />
                      </div>
                      {/* Status text */}
                      <div className="absolute top-8 left-0 right-0 text-center">
                        <span className="bg-black/50 backdrop-blur-sm text-white text-[9px] font-semibold px-3 py-1 rounded-full">
                          Position your face
                        </span>
                      </div>
                    </div>
                    {/* Shutter button */}
                    <div className="h-20 bg-black flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full border-4 border-white flex items-center justify-center">
                        <div className="w-9 h-9 rounded-full bg-white" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-[var(--accent-soft)] blur-3xl opacity-30 -z-10 scale-75" />
              </div>

              <div className="mt-6 space-y-1">
                <h3 className="text-xl font-bold text-[var(--text-primary)]">Take one selfie</h3>
                <p className="text-sm text-[var(--text-secondary)]">Our AI extracts your face signature instantly. The selfie is deleted immediately after.</p>
              </div>
            </motion.div>

            {/* Step 3 - See your photos */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="w-7 h-7 rounded-full bg-[var(--accent)] text-white text-xs font-bold flex items-center justify-center">03</div>
                <span className="text-sm font-bold tracking-widest uppercase text-[var(--accent)]">Your photos</span>
              </div>

              {/* Phone mockup - Results gallery */}
              <div className="relative w-[220px] mx-auto">
                <div className="relative border-[10px] border-gray-800 rounded-[2.5rem] overflow-hidden shadow-2xl bg-black aspect-[9/19]">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-gray-800 rounded-b-2xl z-20" />
                  {/* Results UI */}
                  <div className="w-full h-full bg-[#FAF8F5] flex flex-col overflow-hidden">
                    {/* Header */}
                    <div className="pt-6 px-3 pb-2 bg-white border-b border-gray-100">
                      <div className="flex items-center gap-1.5 mb-1">
                        <div className="w-3 h-3 rounded-full bg-green-400" />
                        <span className="text-[9px] font-bold text-green-600">32 photos found!</span>
                      </div>
                      <div className="text-[11px] font-bold text-gray-800">Your gallery is ready</div>
                      <div className="text-[8px] text-gray-400">Aarav & Meera Wedding · Priya Sharma</div>
                    </div>
                    {/* Matched photos - masonry style */}
                    <div className="grid grid-cols-2 gap-1 p-2 flex-1">
                      {[
                        { src: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=300&q=80', span: 'row-span-2' },
                        { src: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&q=80', span: '' },
                        { src: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=300&q=80', span: '' },
                        { src: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&q=80', span: '' },
                      ].map((img, i) => (
                        <div key={i} className={`${img.span} rounded overflow-hidden bg-gray-200 relative ${i === 0 ? 'aspect-[3/4]' : 'aspect-square'}`}>
                          <img src={img.src} className="w-full h-full object-cover" alt="matched" />
                          {/* Download icon on first */}
                          {i === 0 && (
                            <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-white/80 flex items-center justify-center">
                              <span className="text-[8px]">↓</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    {/* Download CTA */}
                    <div className="p-2 bg-white border-t border-gray-100">
                      <div className="bg-[var(--accent)] text-white text-[9px] font-bold text-center py-1.5 rounded-full">Save all to camera roll</div>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-green-100 blur-3xl opacity-30 -z-10 scale-75" />
              </div>

              <div className="mt-6 space-y-1">
                <h3 className="text-xl font-bold text-[var(--text-primary)]">Download your photos</h3>
                <p className="text-sm text-[var(--text-secondary)]">Every photo you're in, ready to save in original quality.</p>
              </div>
            </motion.div>

          </div>

          {/* Bottom trust badge row */}
          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-[var(--border)] pt-16">
            {[
              { icon: '🔒', label: 'No app required', desc: 'Works in Safari, Chrome, or any browser.' },
              { icon: '⚡', label: 'Results in seconds', desc: 'Face matching happens instantly in the cloud.' },
              { icon: '🗑️', label: 'Selfie deleted immediately', desc: 'We never store guest selfies.' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="text-2xl shrink-0 mt-1">{item.icon}</div>
                <div>
                  <div className="font-bold text-[var(--text-primary)] mb-1">{item.label}</div>
                  <div className="text-sm text-[var(--text-secondary)]">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* Detailed Guest Mobile Walkthrough (01 - 04 Columns) */}
      <section className="py-24 px-6 bg-[var(--surface-soft)] border-t border-[var(--border)]">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-20 max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--accent)]">GUEST EXPERIENCE</span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight">The view from their phone.</h2>
            <p className="text-lg text-[var(--text-secondary)]">
              We design every pixel to make finding and downloading photographs a smooth, modern experience.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                num: '01',
                title: 'Tap the link',
                desc: 'Guests tap the shared link from WhatsApp or scan the venue QR standee. It opens inside their native mobile browser instantly.'
              },
              {
                num: '02',
                title: 'Take a selfie',
                desc: 'With a single authentication tap, guests take a selfie. No software installations and no complex passwords required.'
              },
              {
                num: '03',
                title: 'See matching photos',
                desc: 'Glimpse extracts the face signature and aggregates all photos they appear in, creating a private, personal gallery.'
              },
              {
                num: '04',
                title: 'Save and share',
                desc: 'Guests download the original quality images or share them directly to social media. Privacy is preserved.'
              }
            ].map((step, i) => (
              <div key={i} className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 relative hover:shadow-md transition-shadow">
                <span className="text-4xl font-extrabold text-[var(--accent-soft)] absolute right-6 top-6 select-none font-mono">
                  {step.num}
                </span>
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-3 pt-6">{step.title}</h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Sync Feature Section */}
      <section className="py-24 px-6 bg-[var(--background)] border-t border-[var(--border)]">
        <div className="max-w-[1200px] mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--accent)]">REAL-TIME INGESTION</span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-[var(--text-primary)] leading-[0.95]">
              The gallery keeps working after the selfie.
            </h2>
            <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
              Guests only scan once. Every time you upload new photos during the event—from the pheras to the midnight dance floor—Glimpse matches and pushes them to their personal gallery automatically.
            </p>
            <div className="border-t border-[var(--border)] pt-6 space-y-4">
              <div className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-[var(--accent-soft)] flex items-center justify-center text-[var(--accent)] shrink-0 mt-0.5 font-bold text-xs">
                  ✓
                </div>
                <div>
                  <span className="font-bold text-sm text-[var(--text-primary)] block">Instant Sync</span>
                  <span className="text-xs text-[var(--text-secondary)]">New uploads populate matching client folders dynamically.</span>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-[var(--accent-soft)] flex items-center justify-center text-[var(--accent)] shrink-0 mt-0.5 font-bold text-xs">
                  ✓
                </div>
                <div>
                  <span className="font-bold text-sm text-[var(--text-primary)] block">Browser Alerts</span>
                  <span className="text-xs text-[var(--text-secondary)]">Guests get live indicators when new matches are added.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sync timeline visual */}
          <div className="bg-[#FAF8F5] border border-[var(--border)] rounded-2xl p-8 flex flex-col space-y-4 relative overflow-hidden">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Live Activity Sync</span>

            {/* Timeline element 1 */}
            <div className="bg-white border border-gray-150 rounded-xl p-4 flex gap-3 shadow-sm relative">
              <div className="w-2 h-2 rounded-full bg-green-500 absolute top-4 left-4" />
              <div className="pl-5">
                <span className="text-xs font-bold text-gray-700 block">Selfie Matched</span>
                <span className="text-[10px] text-gray-400">8:04 PM · Priya Sharma matched 14 photos</span>
              </div>
            </div>

            {/* Timeline element 2 */}
            <div className="bg-white border border-gray-150 rounded-xl p-4 flex gap-3 shadow-sm relative opacity-70">
              <div className="w-2 h-2 rounded-full bg-[var(--accent)] absolute top-4 left-4" />
              <div className="pl-5">
                <span className="text-xs font-bold text-gray-700 block">New Photos Uploaded</span>
                <span className="text-[10px] text-gray-400">11:42 PM · Photographer added 234 fresh images</span>
              </div>
            </div>

            {/* Timeline element 3 */}
            <div className="bg-white border border-gray-150 rounded-xl p-4 flex gap-3 shadow-sm relative opacity-40">
              <div className="w-2 h-2 rounded-full bg-green-500 absolute top-4 left-4" />
              <div className="pl-5">
                <span className="text-xs font-bold text-gray-700 block">Gallery Updated Automatically</span>
                <span className="text-[10px] text-gray-400">11:43 PM · Priya found 8 new photos in her gallery</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Delivery Platform Comparison Section (Traditional vs Glimpse) */}
      <section className="py-32 px-6 bg-[var(--background)] border-t border-[var(--border)]">
        <div className="max-w-[1000px] mx-auto">
          <div className="text-center mb-20 max-w-2xl mx-auto space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--accent)]">THE DIFFERENCE</span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Culling vs Auto Delivery.</h2>
            <p className="text-lg text-[var(--text-secondary)]">
              Save days spent sorting through event files and answering guest emails.
            </p>
          </div>

          <div className="border-t border-[var(--border)]">
            {/* Table headers */}
            <div className="grid grid-cols-1 md:grid-cols-2 py-6 text-xs font-bold tracking-widest text-[var(--text-muted)] uppercase hidden md:grid">
              <div>TRADITIONAL CLIENT DELIVERY</div>
              <div>DELIVERY WITH GLIMPSE</div>
            </div>

            {/* Comparison Rows */}
            <div className="space-y-0">
              {[
                {
                  old: 'Couple forwards full gallery links to everyone.',
                  new: 'Private matching restricts access to relevant images.'
                },
                {
                  old: 'Guests text: "Where can I find our photos?"',
                  new: 'Guests get their photos instantly with a simple selfie.'
                },
                {
                  old: 'Uploading files into massive, unorganized folders.',
                  new: 'AI indexes face signatures and handles the sorting.'
                },
                {
                  old: 'Standard delivery sites look generic.',
                  new: 'The client experience is customized with your studio brand.'
                }
              ].map((row, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center py-6 border-t border-[var(--border)] gap-4 md:gap-8">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[var(--border)] flex items-center justify-center shrink-0 mt-0.5">
                      <XIcon className="w-3 h-3 text-[var(--text-muted)]" />
                    </div>
                    <span className="text-[var(--text-secondary)] text-sm">{row.old}</span>
                  </div>

                  <div className="text-[var(--border-strong)] hidden md:block">→</div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[var(--accent-soft)] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-[var(--accent)]" />
                    </div>
                    <span className="font-semibold text-[var(--text-primary)] text-sm">{row.new}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Event Types Section */}
      <section id="photographers" className="py-24 px-6 bg-[var(--surface-soft)] border-t border-[var(--border)]">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-20 max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--accent)]">EVERY EVENT TYPE</span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight">Built for any event.</h2>
            <p className="text-lg text-[var(--text-secondary)]">
              Our secure face signature platform scales seamlessly, whatever you are photographing.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Weddings & Celebrations',
                desc: 'Haldi, sangeet, and reception photos. Family members find their portraits instantly without culling thousands of images.'
              },
              {
                title: 'Conferences & Corporate',
                desc: 'Provide speakers and attendees with their keynotes and networking portraits instantly. Private and GDPR-compliant.'
              },
              {
                title: 'Sports & Marathons',
                desc: 'Index tens of thousands of race photos. Participants input their selfie and download their race portraits instantly.'
              }
            ].map((card, i) => (
              <div key={i} className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">{card.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dark Footer */}
      <footer className="bg-[#1C1814] relative overflow-hidden text-white font-sans border-t border-[#2C2620]">
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

            {/* Left Column (Brand & Info) */}
            <div className="md:col-span-5 lg:col-span-4 space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="text-3xl font-bold tracking-tighter text-white">Glimpse</div>
              </div>
              <p className="text-[#A19D98] text-sm leading-relaxed max-w-[280px]">
                AI-powered event photo delivery for photographers and studios across India.
              </p>
              <p className="text-[#84807C] text-xs max-w-[280px]">
                One browser link. Private matching. Your brand.
              </p>

              <div className="pt-2 flex items-center gap-2 text-[#A19D98] hover:text-white transition-colors cursor-pointer w-fit">
                <Mail className="w-4 h-4 text-[var(--accent)]" />
                <span className="text-sm font-semibold">hello@glimpse.in</span>
              </div>

              <div className="flex items-center gap-3 pt-4">
                {[Instagram, Facebook, Twitter, LinkIcon, Youtube].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all">
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Spacer */}
            <div className="hidden lg:block md:col-span-2 lg:col-span-3" />

            {/* Middle Column (Explore) */}
            <div className="md:col-span-4 lg:col-span-3">
              <h4 className="text-[10px] font-bold tracking-widest text-[#6B6661] uppercase mb-6">EXPLORE</h4>
              <ul className="space-y-4 text-sm font-medium text-[#A19D98]">
                <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/how-it-works" className="hover:text-white transition-colors">How it works</Link></li>
                <li><a href="#photographers" className="hover:text-white transition-colors">For photographers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>

            {/* Right Column (Legal) */}
            <div className="md:col-span-3 lg:col-span-2">
              <h4 className="text-[10px] font-bold tracking-widest text-[#6B6661] uppercase mb-6">LEGAL</h4>
              <ul className="space-y-4 text-sm font-medium text-[#A19D98]">
                <li><a href="#" className="hover:text-white transition-colors">Terms & Conditions</a></li>
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
