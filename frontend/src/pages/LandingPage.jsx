import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/utils/constants';
import { Button } from '@/components/ui';
import { Check, X as XIcon, Link as LinkIcon, Camera, CheckCircle2, Mail, Instagram, Facebook, Twitter, Youtube } from 'lucide-react';
import { cn } from '@/utils/utils';
import Lenis from 'lenis';

// Premium photography assets
const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=80',
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&q=80'
];

export default function LandingPage() {
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

  const heroRef = useRef(null);
  const { scrollY, scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const [isNavScrolled, setIsNavScrolled] = useState(false);
  useEffect(() => {
    return scrollY.onChange((latest) => {
      setIsNavScrolled(latest > 50);
    });
  }, [scrollY]);

  // Parallax calculations for Hero
  const yImage1 = useTransform(heroScroll, [0, 1], ['0%', '25%']);
  const yImage2 = useTransform(heroScroll, [0, 1], ['0%', '45%']);
  const yImage3 = useTransform(heroScroll, [0, 1], ['0%', '15%']);
  
  const opacityHeroText = useTransform(heroScroll, [0, 0.4], [1, 0]);
  const scaleHeroText = useTransform(heroScroll, [0, 0.5], [1, 0.95]);

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
            <a href="#features" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Features</a>
            <Link to="/how-it-works" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">How it works</Link>
            <a href="#photographers" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">For photographers</a>
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

      {/* Immersive Photography Hero (Layered Parallax) */}
      <section ref={heroRef} className="relative min-h-[100dvh] flex flex-col items-center justify-center px-4 pt-20 overflow-hidden perspective-container bg-[var(--background)]">
        
        {/* Layered Photography Background */}
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none mt-12">
          {/* Back image - Right */}
          <motion.div 
            style={{ y: yImage2 }}
            initial={{ scale: 1.1, opacity: 0, rotate: -3 }}
            animate={{ scale: 1, opacity: 0.7, rotate: -3 }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-[8%] right-[2%] md:right-[10%] w-[55vw] md:w-[35vw] aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl"
          >
            <img src={HERO_IMAGES[1]} className="w-full h-full object-cover" alt="Background event" />
          </motion.div>
          
          {/* Back image - Left */}
          <motion.div 
            style={{ y: yImage3 }}
            initial={{ scale: 1.15, opacity: 0, rotate: 4 }}
            animate={{ scale: 1, opacity: 0.85, rotate: 4 }}
            transition={{ duration: 1.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-[10%] left-[2%] md:left-[8%] w-[60vw] md:w-[40vw] aspect-video rounded-2xl overflow-hidden shadow-2xl"
          >
            <img src={HERO_IMAGES[2]} className="w-full h-full object-cover" alt="Background event" />
          </motion.div>

          {/* Front Main Image */}
          <motion.div 
            style={{ y: yImage1 }}
            initial={{ scale: 1.05, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-[25%] md:top-[20%] w-[90vw] md:w-[65vw] max-w-5xl aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden shadow-[var(--shadow-photo)] border border-white/20"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
            <img src={HERO_IMAGES[0]} className="w-full h-full object-cover" alt="Main event" />
          </motion.div>
        </div>

        {/* Hero Content Overlay */}
        <motion.div 
          style={{ opacity: opacityHeroText, scale: scaleHeroText }}
          className="relative z-10 text-center flex flex-col items-center max-w-4xl mt-[-15vh]"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-[clamp(3.5rem,10vw,8rem)] font-bold leading-[0.9] tracking-tighter text-white drop-shadow-[0_4px_32px_rgba(0,0,0,0.8)] mb-6"
          >
            Every moment.<br/>Find yours.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-2xl text-white/95 font-medium drop-shadow-md mb-10 max-w-xl"
          >
            Upload thousands of event photos and let guests find themselves with one simple selfie.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <Link to={ROUTES.DASHBOARD}>
              <Button size="xl" className="rounded-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white shadow-xl px-10 h-14 text-base font-semibold">
                Create an Event
              </Button>
            </Link>
            <Button size="xl" variant="outline" className="rounded-full bg-white/10 backdrop-blur-md text-white border-white/30 hover:bg-white/20 hover:border-white/50 shadow-xl px-10 h-14 text-base font-medium">
              See How It Works ↓
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Story Flow (One Link, One Selfie, Result) */}
      <section className="py-32 px-6 bg-[var(--background)] border-t border-[var(--border)]">
        <div className="max-w-[1200px] mx-auto text-center">
          <h2 className="text-5xl md:text-6xl lg:text-[7rem] font-bold tracking-tighter leading-[0.95] text-[var(--text-primary)] mb-6 max-w-4xl mx-auto">
            From one gallery link to every matching photo.
          </h2>
          <p className="text-xl text-[var(--text-secondary)] mb-24 max-w-2xl mx-auto font-medium">
            Guests open the gallery, take a selfie, and find themselves—without an app or instructions.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-8 max-w-4xl mx-auto">
            {/* Step 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flex-1 flex flex-col items-center relative z-10 w-full"
            >
               <div className="w-16 h-16 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center mb-6 shadow-sm z-10">
                 <LinkIcon className="w-6 h-6 text-[var(--accent)]" />
               </div>
               <h3 className="text-3xl font-bold tracking-tight mb-2">One link</h3>
               <p className="text-[var(--text-secondary)]">Guests open the event gallery</p>
            </motion.div>

            {/* Connecting line (Desktop) */}
            <div className="hidden md:block absolute left-1/2 -translate-x-1/2 w-full max-w-2xl h-[1px] bg-gradient-to-r from-transparent via-[var(--border-strong)] to-transparent top-[190px]" />

            {/* Step 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex-1 flex flex-col items-center relative z-10 w-full"
            >
               <div className="w-16 h-16 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center mb-6 shadow-sm z-10">
                 <Camera className="w-6 h-6 text-[var(--accent)]" />
               </div>
               <h3 className="text-3xl font-bold tracking-tight mb-2 text-[var(--accent)]">One selfie</h3>
               <p className="text-[var(--text-secondary)]">They find every matching photo</p>
            </motion.div>

            {/* Step 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="flex-1 flex flex-col items-center relative z-10 w-full"
            >
               <div className="w-16 h-16 rounded-full bg-[var(--accent)] flex items-center justify-center mb-6 shadow-md z-10">
                 <Check className="w-6 h-6 text-white" />
               </div>
               <div className="relative">
                 {/* Decorative highlight under text */}
                 <div className="absolute inset-x-0 bottom-1 h-3 bg-[var(--accent-soft)] -z-10 -rotate-1 rounded" />
                 <h3 className="text-3xl font-bold tracking-tight mb-2">It's that simple.</h3>
               </div>
               <p className="text-[var(--text-secondary)]">Nothing to install or learn</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Photographer Section - The Shoot Ends */}
      <section id="photographers" className="py-24 px-6 bg-[var(--surface-soft)]">
        <div className="max-w-[1300px] mx-auto grid lg:grid-cols-[1fr_1.2fr] gap-16 items-center">
          
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-8"
          >
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[0.95]">
              The shoot ends.<br />
              <span className="text-[var(--accent)]">Your studio stays visible.</span>
            </h2>
            <p className="text-xl text-[var(--text-secondary)] leading-relaxed max-w-lg">
              Upload thousands of event photos and share one branded gallery. Every guest finds their own photos with one selfie—without asking your team to sort or send them.
            </p>
            <div className="flex items-center gap-6 pt-4">
               <Link to={ROUTES.DASHBOARD}>
                 <Button className="rounded-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white shadow-md px-8 h-12 text-base font-semibold">
                   Start free
                 </Button>
               </Link>
               <button className="text-sm font-bold tracking-widest uppercase text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-2">
                 SEE THE DIFFERENCE <span className="text-xs">↓</span>
               </button>
            </div>
          </motion.div>

          {/* Floating UI Mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="relative"
          >
            {/* The Browser/App Window */}
            <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] shadow-2xl overflow-hidden relative z-10 w-full aspect-[4/3] max-h-[600px] flex flex-col">
               {/* Browser Header */}
               <div className="h-12 border-b border-[var(--border)] flex items-center px-4 gap-2 bg-[var(--background)]">
                 <div className="flex gap-1.5">
                   <div className="w-2.5 h-2.5 rounded-full bg-[var(--border-strong)]" />
                   <div className="w-2.5 h-2.5 rounded-full bg-[var(--border-strong)]" />
                   <div className="w-2.5 h-2.5 rounded-full bg-[var(--border-strong)]" />
                 </div>
                 <div className="mx-auto text-xs font-mono text-[var(--text-muted)] bg-[var(--surface)] px-24 py-1 rounded-md border border-[var(--border)]">gallery.glimpse.in</div>
               </div>
               
               {/* App Header inside window */}
               <div className="p-6 pb-2">
                 <div className="flex items-center justify-between mb-8">
                   <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-[var(--accent-soft)] text-[var(--accent)] font-bold text-xs flex items-center justify-center">CS</div>
                     <span className="font-semibold text-sm">Capture Studios</span>
                   </div>
                   <div className="bg-[var(--accent)] text-white text-xs font-semibold px-4 py-1.5 rounded-full">Find my photos</div>
                 </div>
                 
                 <div className="mb-6">
                   <p className="text-[10px] font-bold tracking-widest text-[var(--text-muted)] uppercase mb-1">ALBUM BY CAPTURE STUDIOS</p>
                   <h3 className="text-2xl font-bold">Aarav & Meera</h3>
                   <div className="flex justify-between items-center mt-1 text-xs text-[var(--text-secondary)]">
                     <span>6 July 2026</span>
                     <span>1930 photos</span>
                   </div>
                 </div>
                 
                 {/* Fake Photo Grid */}
                 <div className="grid grid-cols-2 gap-3 pb-6">
                   <div className="aspect-square bg-[var(--surface-soft)] rounded-lg overflow-hidden">
                     <img src={HERO_IMAGES[0]} className="w-full h-full object-cover opacity-80" alt="mock" />
                   </div>
                   <div className="grid grid-rows-2 gap-3">
                     <div className="bg-[var(--surface-soft)] rounded-lg overflow-hidden">
                       <img src={HERO_IMAGES[1]} className="w-full h-full object-cover opacity-80" alt="mock" />
                     </div>
                     <div className="bg-[var(--surface-soft)] rounded-lg overflow-hidden">
                       <img src={HERO_IMAGES[2]} className="w-full h-full object-cover opacity-80" alt="mock" />
                     </div>
                   </div>
                 </div>
               </div>
            </div>

            {/* Floating Tooltips */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="absolute -left-12 top-24 z-20 bg-[var(--surface)] p-4 rounded-2xl shadow-xl border border-[var(--border)] max-w-[200px]"
            >
              <div className="font-semibold text-sm mb-1">Capture Studios</div>
              <div className="text-xs text-[var(--text-secondary)]">Visible on every screen</div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="absolute -right-8 bottom-16 z-20 bg-[var(--surface)] p-4 rounded-2xl shadow-xl border border-[var(--border)] max-w-[200px]"
            >
              <div className="font-semibold text-sm mb-1 text-[var(--accent)]">One selfie</div>
              <div className="text-xs text-[var(--text-secondary)]">24 photos found</div>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* Comparison Section (Before vs After) */}
      <section className="py-32 px-6 bg-[var(--background)] overflow-hidden">
        <div className="max-w-[1300px] mx-auto">
          <div className="text-center mb-20 max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-bold tracking-tighter leading-[0.95] mb-6">
              Your gallery should look like <span className="relative inline-block"><span className="relative z-10 text-[var(--accent)]">your studio</span><div className="absolute inset-x-0 bottom-2 h-4 bg-[var(--accent-soft)] -z-10 -rotate-1 rounded" /></span>—not generic software.
            </h2>
            <p className="text-xl text-[var(--text-secondary)]">
              The final client experience should carry the same care and identity as the photographs themselves.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center relative">
             
             {/* Left - Before */}
             <div className="bg-[#F8F9FA] rounded-2xl p-8 border border-[var(--border)]/50 relative shadow-inner">
                <div className="absolute top-4 left-6 text-[10px] font-bold tracking-widest text-[var(--text-muted)] uppercase">BEFORE</div>
                <div className="absolute top-4 right-6 text-[10px] font-medium text-[var(--text-secondary)]">Generic delivery</div>
                
                {/* Fake Windows Explorer */}
                <div className="mt-8 bg-white border border-[#E1E4E8] rounded-md shadow-sm h-[400px] overflow-hidden flex flex-col">
                   <div className="h-10 bg-[#F3F4F6] border-b border-[#E1E4E8] flex items-center px-3 gap-2">
                     <div className="flex-1 bg-white border border-[#D1D5DB] rounded px-2 py-1 text-xs text-gray-500 truncate">
                       DATA-USB (E:) \ 24f5406db4259b96b39ad15765 \
                     </div>
                   </div>
                   <div className="p-4 grid grid-cols-4 gap-4 flex-1">
                     {Array.from({length: 12}).map((_, i) => (
                       <div key={i} className="flex flex-col items-center gap-1">
                         <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                           <path d="M40 8H22L18 4H8C5.79 4 4.02 5.79 4.02 8L4 40C4 42.21 5.79 44 8 44H40C42.21 44 44 42.21 44 40V12C44 9.79 42.21 8 40 8Z" fill="#FACC15"/>
                         </svg>
                         <span className="text-[9px] text-gray-600 truncate w-full text-center">103{i}_wed_lp</span>
                       </div>
                     ))}
                   </div>
                </div>
                <p className="text-center text-xs text-[var(--text-muted)] mt-6">Folders and filenames. No studio experience.</p>
             </div>

             {/* VS Badge */}
             <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[var(--surface)] border border-[var(--border)] shadow-sm items-center justify-center z-10 text-xs font-bold text-[var(--text-muted)]">
               VS
             </div>

             {/* Right - After */}
             <div className="bg-[var(--surface-soft)] rounded-2xl p-8 border border-[var(--border)]/50 relative shadow-inner">
                <div className="absolute top-4 left-6 text-[10px] font-bold tracking-widest text-[var(--accent)] uppercase">WITH GLIMPSE</div>
                <div className="absolute top-4 right-6 text-[10px] font-medium text-[var(--text-secondary)]">Your studio leads</div>
                
                {/* Clean Gallery Mockup */}
                <div className="mt-8 bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-lg h-[400px] overflow-hidden flex flex-col p-5">
                   <div className="flex items-center justify-between mb-4">
                     <div className="flex items-center gap-2">
                       <div className="w-6 h-6 rounded-full bg-[var(--accent-soft)]" />
                       <div className="h-3 w-20 bg-[var(--surface-soft)] rounded" />
                     </div>
                     <div className="h-6 w-24 bg-[var(--accent)] rounded-full" />
                   </div>
                   <div className="h-6 w-40 bg-[var(--text-primary)] rounded mb-2" />
                   <div className="h-2 w-16 bg-[var(--surface-soft)] rounded mb-4" />
                   
                   <div className="grid grid-cols-2 gap-2 flex-1">
                     <div className="bg-[var(--surface-soft)] rounded-md overflow-hidden relative">
                       <img src={HERO_IMAGES[0]} className="w-full h-full object-cover" alt="mock" />
                     </div>
                     <div className="grid grid-rows-2 gap-2">
                       <div className="bg-[var(--surface-soft)] rounded-md overflow-hidden">
                         <img src={HERO_IMAGES[1]} className="w-full h-full object-cover" alt="mock" />
                       </div>
                       <div className="bg-[var(--surface-soft)] rounded-md overflow-hidden">
                         <img src={HERO_IMAGES[2]} className="w-full h-full object-cover" alt="mock" />
                       </div>
                     </div>
                   </div>
                </div>
                <p className="text-center text-xs text-[var(--text-muted)] mt-6">Studio logo · Custom cover · Premium gallery</p>
             </div>
          </div>
        </div>
      </section>

      {/* Feature List Section (What slows you down vs What changes) */}
      <section className="py-32 px-6 bg-[var(--surface)]">
        <div className="max-w-[1000px] mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold tracking-tighter leading-[0.95] mb-6">
            Less time answering guests.<br/>
            <span className="text-[var(--accent)]">More control</span> over delivery.
          </h2>
          <p className="text-xl text-[var(--text-secondary)] mb-20 max-w-2xl">
            Glimpse takes the repetitive work out of the handoff without taking your studio out of the experience.
          </p>

          <div className="border-t border-[var(--border)]">
            {/* Headers */}
            <div className="grid grid-cols-1 md:grid-cols-2 py-6">
              <div className="text-[10px] font-bold tracking-widest text-[var(--text-muted)] uppercase hidden md:block">WHAT SLOWS YOU DOWN</div>
              <div className="text-[10px] font-bold tracking-widest text-[var(--text-muted)] uppercase hidden md:block">WHAT CHANGES WITH GLIMPSE</div>
            </div>

            {/* Rows */}
            <div className="space-y-0">
              {[
                { 
                  old: '"When will we get our photos?"', 
                  new: 'Guests find themselves with one selfie.' 
                },
                { 
                  old: 'Hours spent sorting photos manually.', 
                  new: 'Every guest automatically sees only their own photos.' 
                },
                { 
                  old: 'Every gallery looks like generic software.', 
                  new: 'Every gallery carries your own studio branding.' 
                },
                { 
                  old: 'Links get forwarded everywhere.', 
                  new: 'Secure matching puts access under your control.' 
                }
              ].map((row, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center py-6 border-t border-[var(--border)] gap-4 md:gap-8">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[var(--surface-soft)] flex items-center justify-center shrink-0 mt-0.5">
                      <XIcon className="w-3 h-3 text-[var(--text-muted)]" />
                    </div>
                    <span className="text-[var(--text-secondary)]">{row.old}</span>
                  </div>
                  
                  <div className="text-[var(--border-strong)] hidden md:block">→</div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[var(--accent-soft)] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-[var(--accent)]" />
                    </div>
                    <span className="font-semibold text-[var(--text-primary)]">{row.new}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Privacy Accordion area */}
      <section className="py-24 pb-32 px-6 bg-[var(--background)] border-t border-[var(--border)]">
        <div className="max-w-[1000px] mx-auto grid md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter leading-[0.95] mb-6">
              Try it with<br/>confidence.
            </h2>
            <p className="text-[var(--text-secondary)]">What to know about guests, branding, privacy, and security.</p>
          </div>
          
          <FAQAccordion />
        </div>
      </section>

      {/* Dark Centered CTA (From Photo 1) */}
      <section className="bg-[#1C1814] relative overflow-hidden text-white font-sans border-t-[8px] border-[#2C2620]">
        {/* Hexagon Pattern Background */}
        <div 
          className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='103.923' viewBox='0 0 60 103.923' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 17.32V51.96L30 69.28L0 51.96V17.32L30 0ZM30 103.92L60 86.6V51.96L30 34.64L0 51.96V86.6L30 103.92Z' fill='none' stroke='%23FFFFFF' stroke-width='1.5'/%3E%3C/svg%3E")`,
            backgroundSize: '120px',
            backgroundPosition: 'top center'
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-32 md:py-40 text-center flex flex-col items-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
            Make your next delivery feel like your studio
          </h2>
          <p className="text-[#A19D98] text-lg md:text-xl font-medium mb-10 max-w-2xl mx-auto">
            Run a real event on the free plan—your photos, your branding, and every guest finding themselves.
          </p>
          <div className="flex items-center gap-4 mb-8">
            <Link to={ROUTES.DASHBOARD}>
              <Button size="lg" className="rounded-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-black shadow-xl px-8 h-12 text-sm font-bold transition-transform hover:scale-105 border-0">
                Start free
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="rounded-full border-white/20 text-white hover:bg-white/10 hover:text-white px-8 h-12 text-sm font-bold transition-colors">
              View plans
            </Button>
          </div>
          <p className="text-[#6B6661] text-[11px] font-semibold tracking-widest uppercase">
            Free to start · No credit card required
          </p>
        </div>
      </section>

      {/* White Guides Section (From Photo 1) */}
      <section className="py-24 px-6 bg-[var(--background)] border-b border-[var(--border)]">
        <div className="max-w-[1300px] mx-auto">
          <div className="mb-16">
            <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-[var(--accent)] uppercase mb-4">
              <div className="w-2 h-2 bg-[var(--accent)] rotate-45" />
              FOR YOUR STUDIO
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-[var(--text-primary)] max-w-xl leading-[1.1]">
              Guides for the business side of the job
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <h3 className="text-xl font-bold text-[var(--text-primary)] leading-snug mb-4">The complete Indian wedding shot list</h3>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed flex-1 mb-8">
                Function by function, from haldi to vidaai, with regional variations and family portrait planning.
              </p>
              <a href="#" className="text-[var(--accent)] text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all w-fit">
                Read the guide <span>→</span>
              </a>
            </div>

            {/* Card 2 */}
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <h3 className="text-xl font-bold text-[var(--text-primary)] leading-snug mb-4">What belongs in your package</h3>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed flex-1 mb-8">
                Standard inclusions, separate line items, and how to define edited photographs clearly.
              </p>
              <a href="#" className="text-[var(--accent)] text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all w-fit">
                Read the guide <span>→</span>
              </a>
            </div>

            {/* Card 3 */}
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <h3 className="text-xl font-bold text-[var(--text-primary)] leading-snug mb-4">Culling 10,000 photos down to 600</h3>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed flex-1 mb-8">
                A multi-pass workflow that stops selection from consuming your week.
              </p>
              <a href="#" className="text-[var(--accent)] text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all w-fit">
                Read the guide <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Dark Footer (Separated from CTA) */}
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
                {[Instagram, Facebook, XIcon, LinkIcon, Youtube].map((Icon, i) => (
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

function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    { q: "How do guests find their photos?", a: "Guests simply open the gallery link and take a quick selfie. Our secure facial matching technology instantly finds every photo they appear in." },
    { q: "Do guests need to install an app?", a: "No. Everything happens right in their mobile browser. No apps to download, no accounts to create, and no passwords to remember." },
    { q: "Is the gallery white-label?", a: "Yes. Your studio's name, logo, and branding are front and center. Glimpse stays invisible in the background." },
    { q: "What happens to the selfies?", a: "Selfies are securely processed for matching and then immediately discarded. We do not store or use guest selfies for any other purpose." }
  ];

  return (
    <div className="space-y-0">
      {faqs.map((faq, i) => (
        <div 
          key={i} 
          className="py-6 border-b border-[var(--border)] flex flex-col cursor-pointer group"
          onClick={() => setOpenIndex(openIndex === i ? null : i)}
        >
          <div className="flex justify-between items-center">
            <span className="font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors pr-4">{faq.q}</span>
            <span 
              className="text-[var(--accent)] text-xl font-light transition-transform duration-300"
              style={{ transform: openIndex === i ? 'rotate(45deg)' : 'none' }}
            >
              +
            </span>
          </div>
          <div className={cn("faq-answer", openIndex === i ? "open" : "")}>
            <div className="pt-4 text-[var(--text-secondary)] leading-relaxed">
              {faq.a}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}