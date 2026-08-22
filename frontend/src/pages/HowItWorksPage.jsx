import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/utils/constants';
import { Button } from '@/components/ui';
import { Navbar, Footer } from '@/components/layout';
import { FadeIn, GradientButton } from '@/components/ui';
import {
  Check, X as XIcon, UploadCloud, Share2
} from 'lucide-react';
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

  return (
    <div className="bg-[#0C0C0C] min-h-screen text-[#D7E2EA] font-kanit overflow-x-clip selection:bg-[#D7E2EA] selection:text-[#0C0C0C]">

      <Navbar theme="dark" activePage="how-it-works" />
      
      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-0 flex flex-col items-center text-center px-6 relative overflow-hidden">
        
        <FadeIn delay={0.1} y={20}>
          <div className="border border-[#D7E2EA]/20 text-[#D7E2EA]/70 font-semibold px-4 py-1.5 rounded-full text-xs md:text-sm tracking-wider uppercase inline-flex items-center gap-2 mb-6 shadow-xl">
            <div className="w-1.5 h-1.5 rounded-full bg-[#D7E2EA] animate-pulse" />
            How it works
          </div>
        </FadeIn>

        <FadeIn delay={0.2} y={30}>
          <h1 
            className="hero-heading font-black uppercase tracking-tight leading-[0.85] mb-6 max-w-5xl mx-auto"
            style={{ fontSize: 'clamp(3rem, 10vw, 120px)' }}
          >
            Upload once.<br />
            Every guest finds<br />
            their moment.
          </h1>
        </FadeIn>

        <FadeIn delay={0.3} y={20} className="w-full max-w-2xl">
          <p className="text-lg md:text-xl text-[#D7E2EA]/60 font-light leading-relaxed mb-10 mx-auto">
            Create the event once. Upload your photos directly. Guests use one single web link and a selfie to instantly see and download every photo they appear in.
          </p>
        </FadeIn>

        <FadeIn delay={0.4} y={20} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 w-full">
          <Link to={ROUTES.LOGIN}>
            <GradientButton>Start Free</GradientButton>
          </Link>
          <a href="#workflow-steps">
            <Button size="xl" variant="outline" className="rounded-full bg-transparent border-[#D7E2EA]/20 text-[#D7E2EA] hover:bg-[#D7E2EA]/10 px-10 h-14 text-base font-medium">
              See How It Works ↓
            </Button>
          </a>
        </FadeIn>

        {/* Stats row */}
        <FadeIn delay={0.5} y={20} className="flex flex-wrap justify-center gap-6 mb-16">
          {[
            { num: '< 60s', label: 'to create an event' },
            { num: '1 selfie', label: 'for guests to find photos' },
            { num: '0 apps', label: 'needed by guests' },
            { num: '100%', label: 'your studio branding' },
          ].map(stat => (
            <div key={stat.label} className="text-center bg-[#1A1A1A]/80 border border-white/5 rounded-2xl px-6 py-4 backdrop-blur-sm">
              <div className="text-2xl font-extrabold text-[#D7E2EA]">{stat.num}</div>
              <div className="text-xs text-[#D7E2EA]/50 mt-0.5 uppercase tracking-wide">{stat.label}</div>
            </div>
          ))}
        </FadeIn>

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
              <div key={i} className="w-[260px] h-[180px] rounded-[30px] overflow-hidden shrink-0 border-2 border-white/10">
                <img src={src} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 grayscale hover:grayscale-0" alt="event photo" />
              </div>
            ))}
          </div>
          {/* Gradient fade edges */}
          <div className="absolute top-0 left-0 h-full w-32 bg-gradient-to-r from-[#0C0C0C] to-transparent pointer-events-none" />
          <div className="absolute top-0 right-0 h-full w-32 bg-gradient-to-l from-[#0C0C0C] to-transparent pointer-events-none" />
        </div>
      </section>


      {/* The 4-Step Breakdown (Split Layout) */}
      <section id="workflow-steps" className="py-24 px-6 border-t border-white/5 bg-[#0C0C0C]">
        <div className="max-w-[1200px] mx-auto space-y-32">

          {/* Step 1 */}
          <FadeIn y={40} className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <div className="text-[#D7E2EA]/50 text-lg font-bold uppercase tracking-widest">STEP 01</div>
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-black uppercase tracking-tight leading-none text-[#D7E2EA]">Create the event</h2>
              <p className="text-lg text-[#D7E2EA]/60 leading-relaxed font-light">
                Name your event workspace, pick a cover banner, and add your studio details. Glimpse generates your private client gallery and sharing link instantly.
              </p>
              <ul className="space-y-3 pt-4">
                {['Branded dashboard layout', 'Custom cover image integration', 'Takes under 60 seconds to set up'].map((li, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium text-[#D7E2EA]/70">
                    <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-[#D7E2EA]" />
                    </div>
                    {li}
                  </li>
                ))}
              </ul>
            </div>

            {/* Step 1 Visual Mockup */}
            <div className="bg-[#111111] border border-white/10 rounded-[40px] p-6 shadow-2xl">
              {/* Cover Photo Strip */}
              <div className="rounded-2xl overflow-hidden mb-4 aspect-[16/6] relative">
                <img src="https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80" className="w-full h-full object-cover" alt="event cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-3 left-4 text-white">
                  <div className="text-xs font-bold uppercase tracking-wide">Aarav & Meera Wedding</div>
                  <div className="text-[10px] opacity-70">Dec 18, 2026</div>
                </div>
              </div>
              <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl shadow-xl overflow-hidden flex flex-col p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#D7E2EA]/50">Event Configurator</span>
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-[#D7E2EA]/40 uppercase tracking-widest block mb-1">Event Name</label>
                    <div className="border border-white/10 rounded-xl p-3 text-xs font-semibold text-[#D7E2EA] bg-[#222222]">Aarav & Meera Wedding</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-[#D7E2EA]/40 uppercase tracking-widest block mb-1">Event Date</label>
                      <div className="border border-white/10 rounded-xl p-3 text-xs text-[#D7E2EA] bg-[#222222]">Dec 18, 2026</div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[#D7E2EA]/40 uppercase tracking-widest block mb-1">Studio Branding</label>
                      <div className="border border-white/10 rounded-xl p-3 text-xs text-[#0C0C0C] bg-[#D7E2EA] font-semibold text-center uppercase tracking-wider">Capture Studios</div>
                    </div>
                  </div>
                </div>
                <div className="bg-[#D7E2EA] text-[#0C0C0C] uppercase tracking-widest text-xs font-black text-center py-3 rounded-xl shadow-sm mt-2">
                  Create Event Workspace
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Step 2 */}
          <FadeIn y={40} className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Step 2 Visual Mockup (Left on desktop) */}
            <div className="bg-[#111111] border border-white/10 rounded-[40px] p-6 shadow-2xl order-2 lg:order-1">
              <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl shadow-xl overflow-hidden p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UploadCloud className="w-4 h-4 text-[#D7E2EA]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#D7E2EA]/70">Photo Uploader</span>
                  </div>
                  <span className="text-[10px] text-[#D7E2EA]/40 font-mono">42.4 MB/s</span>
                </div>
                <div className="w-full bg-[#333333] rounded-full h-2 overflow-hidden">
                  <div className="bg-[#D7E2EA] h-2 rounded-full w-[84%] transition-all" />
                </div>
                <div className="flex justify-between text-[11px] text-[#D7E2EA]/60 uppercase tracking-wide">
                  <span>Uploading 428 / 512 photos...</span>
                  <span className="font-bold">84%</span>
                </div>
                <div className="grid grid-cols-4 gap-2 pt-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="aspect-square bg-[#222222] rounded-xl relative overflow-hidden">
                      <img src={HERO_IMAGES[i % HERO_IMAGES.length]} className="w-full h-full object-cover opacity-60" alt="uploader" />
                      {i === 3 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-xs text-[#D7E2EA] font-bold">
                          +84
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6 order-1 lg:order-2">
              <div className="text-[#D7E2EA]/50 text-lg font-bold uppercase tracking-widest">STEP 02</div>
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-black uppercase tracking-tight leading-none text-[#D7E2EA]">Upload your photos</h2>
              <p className="text-lg text-[#D7E2EA]/60 leading-relaxed font-light">
                Upload your raw or edited photos straight to the dashboard. Our AI processes face signatures dynamically in the background, identifying guests instantly.
              </p>
              <ul className="space-y-3 pt-4">
                {['Drag & drop browser uploader', 'High-speed cloud processing', 'Smart background face indexing'].map((li, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium text-[#D7E2EA]/70">
                    <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-[#D7E2EA]" />
                    </div>
                    {li}
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>

          {/* Step 3 */}
          <FadeIn y={40} className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <div className="text-[#D7E2EA]/50 text-lg font-bold uppercase tracking-widest">STEP 03</div>
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-black uppercase tracking-tight leading-none text-[#D7E2EA]">Share one link</h2>
              <p className="text-lg text-[#D7E2EA]/60 leading-relaxed font-light">
                No folders, no lists, no passwords. Send one web link in WhatsApp, or download the printable QR standee and display it at the event venue.
              </p>
              <ul className="space-y-3 pt-4">
                {['Single access link for all guests', 'Printable QR code for tables', 'Integrated social sharing options'].map((li, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium text-[#D7E2EA]/70">
                    <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-[#D7E2EA]" />
                    </div>
                    {li}
                  </li>
                ))}
              </ul>
            </div>

            {/* Step 3 Visual Mockup */}
            <div className="bg-[#111111] border border-white/10 rounded-[40px] p-6 shadow-2xl">
              {/* QR Standee Preview image */}
              <div className="rounded-2xl overflow-hidden mb-4 aspect-[16/7] relative bg-gradient-to-br from-[#222222] to-[#111111] flex items-center justify-center">
                {/* WhatsApp preview strip */}
                <div className="flex gap-2 p-4 w-full">
                  <div className="flex-1 bg-[#1A1A1A]/90 backdrop-blur-md rounded-xl p-3 shadow-xl border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-5 h-5 rounded-full bg-green-500/80 flex items-center justify-center">
                        <span className="text-[8px] text-white font-bold">W</span>
                      </div>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[#D7E2EA]/70">WhatsApp</span>
                    </div>
                    <div className="text-[9px] text-[#D7E2EA] font-medium leading-relaxed">📸 Your photos from Aarav & Meera Wedding are ready!</div>
                    <div className="mt-1 text-[8px] text-[#D7E2EA]/50 font-bold tracking-widest">GLIMPSE.IN/E/AARAV-MEERA →</div>
                  </div>
                  <div className="w-20 bg-[#1A1A1A]/90 rounded-xl p-2 shadow-xl border border-white/10 flex flex-col items-center justify-center gap-1 backdrop-blur-md">
                    <div className="grid grid-cols-3 gap-0.5">
                      {Array.from({length:9}).map((_,i) => (
                        <div key={i} className={`w-1.5 h-1.5 rounded-sm ${i%3===0 || i===4 ? 'bg-[#D7E2EA]' : 'bg-[#D7E2EA]/20'}`} />
                      ))}
                    </div>
                    <span className="text-[7px] font-bold text-[#D7E2EA]/50 uppercase mt-1">QR Standee</span>
                  </div>
                </div>
              </div>
              <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl shadow-xl p-6 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#D7E2EA]/70 block">Share Link</span>
                <div className="flex gap-2">
                  <div className="flex-1 bg-[#222222] border border-white/10 rounded-xl px-4 py-3 text-xs font-mono text-[#D7E2EA]/50 select-all truncate">
                    glimpse.in/e/aarav-meera
                  </div>
                  <button className="bg-[#333333] hover:bg-[#444444] border border-white/10 text-[#D7E2EA] text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-xl shrink-0 transition-colors">
                    Copy
                  </button>
                </div>
                <div className="border border-white/5 rounded-2xl p-3 flex items-center gap-4 bg-[#222222]">
                  <div className="w-12 h-12 bg-white/5 text-[#D7E2EA] rounded-xl flex items-center justify-center shrink-0 border border-white/10">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#D7E2EA] block">QR Standee</span>
                    <span className="text-[10px] text-[#D7E2EA]/40">Download ready-to-print SVG</span>
                  </div>
                  <button className="ml-auto bg-[#D7E2EA] text-[#0C0C0C] text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-transform hover:scale-105">
                    Print QR
                  </button>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Step 4 */}
          <FadeIn y={40} className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Step 4 Visual Mockup (Left on desktop) */}
            <div className="bg-[#111111] border border-white/10 rounded-[40px] p-6 shadow-2xl order-2 lg:order-1">
              {/* Photo thumbnail strip preview */}
              <div className="rounded-2xl overflow-hidden mb-4 relative">
                <div className="flex gap-1.5 h-24">
                  {[
                    'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=300&q=80',
                    'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&q=80',
                    'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=300&q=80',
                    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&q=80',
                    'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=300&q=80',
                  ].map((src, i) => (
                    <div key={i} className="flex-1 rounded-xl overflow-hidden relative border border-white/10">
                      <img src={src} className="w-full h-full object-cover" alt="matched photo" />
                      {i === 4 && (
                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                          <span className="text-[#D7E2EA] font-bold text-sm">+27</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-2 text-[10px] text-[#D7E2EA]/40 font-medium uppercase tracking-widest text-center">Priya Sharma · 32 matched photos</div>
              </div>
              <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl shadow-xl p-6 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#D7E2EA]/70 block">Live Delivery Feed</span>
                <div className="space-y-2">
                  {[
                    { name: 'Priya Sharma', photos: 32, matched: '98% match' },
                    { name: 'Rahul Verma', photos: 18, matched: '94% match' },
                    { name: 'Aman Singhal', photos: 25, matched: '96% match' }
                  ].map((guest, i) => (
                    <div key={i} className="flex items-center justify-between text-xs py-3 border-b border-white/5 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#333333] flex items-center justify-center font-bold text-[10px] text-[#D7E2EA]">
                          {guest.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <span className="font-semibold block text-[#D7E2EA] uppercase tracking-wide">{guest.name}</span>
                          <span className="text-[10px] text-[#D7E2EA]/40">{guest.photos} photos matched</span>
                        </div>
                      </div>
                      <span className="text-[9px] text-[#D7E2EA] bg-white/5 border border-white/10 px-2 py-1 rounded-md font-bold uppercase tracking-wider">
                        {guest.matched}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6 order-1 lg:order-2">
              <div className="text-[#D7E2EA]/50 text-lg font-bold uppercase tracking-widest">STEP 04</div>
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-black uppercase tracking-tight leading-none text-[#D7E2EA]">Guests get their photos</h2>
              <p className="text-lg text-[#D7E2EA]/60 leading-relaxed font-light">
                Guests open the link, upload a quick selfie, and instantly see their own matching photos. They download original-resolution files directly based on your event settings.
              </p>
              <ul className="space-y-3 pt-4">
                {['Instant face signatures comparison', 'Zero manual sorting needed', 'Private, isolated guest galleries'].map((li, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium text-[#D7E2EA]/70">
                    <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-[#D7E2EA]" />
                    </div>
                    {li}
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>

        </div>
      </section>

      {/* ============================================
          ONE LINK. ONE SELFIE. IT'S THAT SIMPLE.
      ============================================ */}
      <section className="py-32 px-6 bg-[#0C0C0C] border-t border-white/5 overflow-hidden">
        <div className="max-w-[1300px] mx-auto">

          {/* Section Heading */}
          <FadeIn y={30} className="text-center mb-24 max-w-5xl mx-auto">
            <h2 
              className="hero-heading font-black uppercase tracking-tight leading-[0.9] text-[#D7E2EA] mb-6"
              style={{ fontSize: 'clamp(3rem, 10vw, 120px)' }}
            >
              One link.<br />
              One selfie.<br />
              It's that simple.
            </h2>
            <p className="text-xl text-[#D7E2EA]/60 max-w-xl mx-auto font-light">
              Everything runs in the mobile browser. No app, no login, no instructions needed.
            </p>
          </FadeIn>

          {/* Three-Step Phone Showcase */}
          <div className="grid md:grid-cols-3 gap-6 lg:gap-10 items-start relative">

            {/* Connecting line between phones (desktop) */}
            <div className="hidden md:block absolute top-[120px] left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-[#D7E2EA]/20 to-transparent" />

            {/* Step 1 - Open the link */}
            <FadeIn delay={0.1} y={40} className="flex flex-col items-center text-center group">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-7 h-7 rounded-full bg-white/10 text-[#D7E2EA] text-xs font-bold flex items-center justify-center border border-white/20">01</div>
                <span className="text-sm font-bold tracking-widest uppercase text-[#D7E2EA]/60">Open the link</span>
              </div>

              {/* Phone mockup */}
              <div className="relative w-[220px] mx-auto">
                <div className="relative border-[10px] border-[#1A1A1A] rounded-[2.5rem] overflow-hidden shadow-2xl bg-black aspect-[9/19]">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-[#1A1A1A] rounded-b-2xl z-20" />
                  <div className="w-full h-full bg-[#0C0C0C] flex flex-col relative overflow-hidden">
                    {/* Gallery header */}
                    <div className="pt-8 px-4 pb-4 bg-[#111111] border-b border-white/5">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-5 h-5 rounded-full bg-white/10 text-[#D7E2EA] font-bold text-[8px] flex items-center justify-center">CS</div>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-[#D7E2EA]/70">Capture Studios</span>
                      </div>
                      <div className="text-xs font-black uppercase tracking-wider text-[#D7E2EA] mb-1">Aarav & Meera</div>
                      <div className="text-[8px] text-[#D7E2EA]/40 uppercase tracking-widest">1,930 photos · Dec 18</div>
                    </div>
                    {/* Photo grid */}
                    <div className="grid grid-cols-2 gap-1.5 p-2 flex-1">
                      {[
                        'https://images.unsplash.com/photo-1519741497674-611481863552?w=300&q=80',
                        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=300&q=80',
                        'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=300&q=80',
                        'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=300&q=80',
                        'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=300&q=80',
                        'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=300&q=80',
                      ].map((src, i) => (
                        <div key={i} className="aspect-square rounded-md overflow-hidden bg-[#222222]">
                          <img src={src} className="w-full h-full object-cover" alt="gallery" />
                        </div>
                      ))}
                    </div>
                    {/* CTA Button */}
                    <div className="p-3 bg-[#111111] border-t border-white/5">
                      <div className="bg-[#D7E2EA] text-[#0C0C0C] text-[9px] font-black uppercase tracking-widest text-center py-2.5 rounded-xl">Find my photos</div>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-[#D7E2EA]/10 blur-3xl opacity-50 -z-10 scale-90" />
              </div>

              <div className="mt-8 space-y-2">
                <h3 className="text-xl font-bold uppercase tracking-wide text-[#D7E2EA]">Open the gallery</h3>
                <p className="text-sm text-[#D7E2EA]/60 font-light px-4">Tap the WhatsApp link or scan the QR code at the venue.</p>
              </div>
            </FadeIn>

            {/* Step 2 - Take a selfie */}
            <FadeIn delay={0.25} y={40} className="flex flex-col items-center text-center group md:mt-12">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-7 h-7 rounded-full bg-white/10 text-[#D7E2EA] text-xs font-bold flex items-center justify-center border border-white/20">02</div>
                <span className="text-sm font-bold tracking-widest uppercase text-[#D7E2EA]/60">Take a selfie</span>
              </div>

              {/* Phone mockup */}
              <div className="relative w-[220px] mx-auto">
                <div className="relative border-[10px] border-[#1A1A1A] rounded-[2.5rem] overflow-hidden shadow-2xl bg-black aspect-[9/19]">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-[#1A1A1A] rounded-b-2xl z-20" />
                  <div className="w-full h-full relative bg-[#0C0C0C] flex flex-col">
                    <div className="flex-1 relative overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&q=80"
                        className="w-full h-full object-cover opacity-60"
                        alt="selfie camera view"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-28 h-36 rounded-full border border-[#D7E2EA]/60 border-dashed opacity-80 animate-pulse" />
                      </div>
                      <div className="absolute top-10 left-0 right-0 text-center">
                        <span className="bg-black/80 border border-white/10 backdrop-blur-md text-[#D7E2EA] text-[9px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
                          Position your face
                        </span>
                      </div>
                    </div>
                    <div className="h-24 bg-[#111111] border-t border-white/5 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full border-[3px] border-[#D7E2EA]/30 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-[#D7E2EA]" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-[#D7E2EA]/10 blur-3xl opacity-50 -z-10 scale-90" />
              </div>

              <div className="mt-8 space-y-2">
                <h3 className="text-xl font-bold uppercase tracking-wide text-[#D7E2EA]">Take one selfie</h3>
                <p className="text-sm text-[#D7E2EA]/60 font-light px-4">Our AI extracts your face signature instantly. The selfie is deleted immediately.</p>
              </div>
            </FadeIn>

            {/* Step 3 - See your photos */}
            <FadeIn delay={0.4} y={40} className="flex flex-col items-center text-center group">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-7 h-7 rounded-full bg-white/10 text-[#D7E2EA] text-xs font-bold flex items-center justify-center border border-white/20">03</div>
                <span className="text-sm font-bold tracking-widest uppercase text-[#D7E2EA]/60">Your photos</span>
              </div>

              {/* Phone mockup */}
              <div className="relative w-[220px] mx-auto">
                <div className="relative border-[10px] border-[#1A1A1A] rounded-[2.5rem] overflow-hidden shadow-2xl bg-black aspect-[9/19]">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-[#1A1A1A] rounded-b-2xl z-20" />
                  <div className="w-full h-full bg-[#0C0C0C] flex flex-col overflow-hidden">
                    <div className="pt-8 px-4 pb-3 bg-[#111111] border-b border-white/5">
                      <div className="flex items-center gap-1.5 mb-2">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-[8px] font-bold uppercase tracking-widest text-green-500">32 photos found</span>
                      </div>
                      <div className="text-[11px] font-black uppercase tracking-wider text-[#D7E2EA]">Your gallery is ready</div>
                      <div className="text-[7px] text-[#D7E2EA]/40 uppercase tracking-widest mt-1">Aarav & Meera · Priya Sharma</div>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 p-2 flex-1">
                      {[
                        { src: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=300&q=80', span: 'row-span-2' },
                        { src: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&q=80', span: '' },
                        { src: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=300&q=80', span: '' },
                        { src: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&q=80', span: '' },
                      ].map((img, i) => (
                        <div key={i} className={`${img.span} rounded-md overflow-hidden bg-[#222222] relative ${i === 0 ? 'aspect-[3/4]' : 'aspect-square'}`}>
                          <img src={img.src} className="w-full h-full object-cover" alt="matched" />
                          {i === 0 && (
                            <div className="absolute bottom-1.5 right-1.5 w-6 h-6 rounded-full bg-[#0C0C0C]/80 backdrop-blur-md border border-white/20 flex items-center justify-center">
                              <span className="text-[10px] text-[#D7E2EA]">↓</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="p-3 bg-[#111111] border-t border-white/5">
                      <div className="bg-[#D7E2EA] text-[#0C0C0C] text-[9px] font-black uppercase tracking-widest text-center py-2.5 rounded-xl">Save all to camera roll</div>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-[#D7E2EA]/10 blur-3xl opacity-50 -z-10 scale-90" />
              </div>

              <div className="mt-8 space-y-2">
                <h3 className="text-xl font-bold uppercase tracking-wide text-[#D7E2EA]">Download your photos</h3>
                <p className="text-sm text-[#D7E2EA]/60 font-light px-4">Every photo you're in, ready to save in original quality.</p>
              </div>
            </FadeIn>

          </div>

          {/* Bottom trust badge row */}
          <FadeIn y={30} className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-white/10 pt-16">
            {[
              { icon: '🔒', label: 'No app required', desc: 'Works in Safari, Chrome, or any browser.' },
              { icon: '⚡', label: 'Results in seconds', desc: 'Face matching happens instantly in the cloud.' },
              { icon: '🗑️', label: 'Selfie deleted immediately', desc: 'We never store guest selfies.' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="text-2xl shrink-0 mt-1 opacity-80">{item.icon}</div>
                <div>
                  <div className="font-bold uppercase tracking-wide text-[#D7E2EA] mb-2">{item.label}</div>
                  <div className="text-sm text-[#D7E2EA]/60 font-light">{item.desc}</div>
                </div>
              </div>
            ))}
          </FadeIn>

        </div>
      </section>


      {/* Detailed Guest Mobile Walkthrough (01 - 04 Columns) */}
      <section className="py-32 px-6 bg-[#0C0C0C] border-t border-white/5 relative overflow-hidden">
        {/* Subtle background element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[radial-gradient(circle,_rgba(215,226,234,0.03)_0%,_transparent_70%)] pointer-events-none" />

        <div className="max-w-[1200px] mx-auto relative z-10">
          <FadeIn y={30} className="text-center mb-24 max-w-3xl mx-auto space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D7E2EA]/40">GUEST EXPERIENCE</span>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-[#D7E2EA]">The view from their phone.</h2>
            <p className="text-lg text-[#D7E2EA]/60 font-light">
              We design every pixel to make finding and downloading photographs a smooth, modern experience.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { num: '01', title: 'Tap the link', desc: 'Guests tap the shared link from WhatsApp or scan the venue QR standee. It opens inside their native mobile browser instantly.' },
              { num: '02', title: 'Take a selfie', desc: 'With a single authentication tap, guests take a selfie. No software installations and no complex passwords required.' },
              { num: '03', title: 'See matching photos', desc: 'Glimpse extracts the face signature and aggregates all photos they appear in, creating a private, personal gallery.' },
              { num: '04', title: 'Save and share', desc: 'Guests download the original quality images or share them directly to social media. Privacy is preserved.' }
            ].map((step, i) => (
              <FadeIn key={i} delay={i * 0.1} y={30}>
                <div className="bg-[#111111] border border-white/5 rounded-3xl p-8 relative hover:border-white/20 transition-all duration-300 h-full group">
                  <span className="text-6xl font-black text-white/5 absolute right-4 top-4 select-none font-kanit transition-transform group-hover:scale-110">
                    {step.num}
                  </span>
                  <h3 className="text-lg font-bold uppercase tracking-wide text-[#D7E2EA] mb-4 pt-8">{step.title}</h3>
                  <p className="text-sm text-[#D7E2EA]/50 leading-relaxed font-light">{step.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Live Sync Feature Section */}
      <section className="py-32 px-6 bg-[#0C0C0C] border-t border-white/5">
        <div className="max-w-[1200px] mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <FadeIn y={30} className="space-y-8">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D7E2EA]/40">REAL-TIME INGESTION</span>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-[#D7E2EA] leading-[0.95]">
              The gallery keeps working after the selfie.
            </h2>
            <p className="text-lg text-[#D7E2EA]/60 font-light leading-relaxed">
              Guests only scan once. Every time you upload new photos during the event—from the pheras to the midnight dance floor—Glimpse matches and pushes them to their personal gallery automatically.
            </p>
            <div className="border-t border-white/10 pt-8 space-y-6">
              <div className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[#D7E2EA] shrink-0 font-bold text-xs">
                  <Check className="w-3 h-3" />
                </div>
                <div>
                  <span className="font-bold uppercase tracking-wide text-sm text-[#D7E2EA] block mb-1">Instant Sync</span>
                  <span className="text-sm text-[#D7E2EA]/50 font-light">New uploads populate matching client folders dynamically.</span>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[#D7E2EA] shrink-0 font-bold text-xs">
                  <Check className="w-3 h-3" />
                </div>
                <div>
                  <span className="font-bold uppercase tracking-wide text-sm text-[#D7E2EA] block mb-1">Browser Alerts</span>
                  <span className="text-sm text-[#D7E2EA]/50 font-light">Guests get live indicators when new matches are added.</span>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Sync timeline visual */}
          <FadeIn y={30} delay={0.2} className="bg-[#111111] border border-white/10 rounded-[40px] p-10 flex flex-col space-y-6 relative overflow-hidden shadow-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D7E2EA]/40 text-center block mb-2">Live Activity Sync</span>

            <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-5 flex gap-4 shadow-xl relative">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/80 absolute top-6 left-5 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
              <div className="pl-6">
                <span className="text-xs font-bold uppercase tracking-wide text-[#D7E2EA] block mb-1">Selfie Matched</span>
                <span className="text-[10px] text-[#D7E2EA]/40 tracking-widest uppercase">8:04 PM · Priya matched 14 photos</span>
              </div>
            </div>

            <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-5 flex gap-4 shadow-xl relative opacity-70">
              <div className="w-2.5 h-2.5 rounded-full bg-[#D7E2EA] absolute top-6 left-5 shadow-[0_0_10px_rgba(215,226,234,0.5)]" />
              <div className="pl-6">
                <span className="text-xs font-bold uppercase tracking-wide text-[#D7E2EA] block mb-1">New Photos Uploaded</span>
                <span className="text-[10px] text-[#D7E2EA]/40 tracking-widest uppercase">11:42 PM · 234 fresh images</span>
              </div>
            </div>

            <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-5 flex gap-4 shadow-xl relative opacity-40">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/80 absolute top-6 left-5" />
              <div className="pl-6">
                <span className="text-xs font-bold uppercase tracking-wide text-[#D7E2EA] block mb-1">Gallery Updated</span>
                <span className="text-[10px] text-[#D7E2EA]/40 tracking-widest uppercase">11:43 PM · Priya found 8 new photos</span>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Delivery Platform Comparison Section (Traditional vs Glimpse) */}
      <section className="py-32 px-6 bg-[#0C0C0C] border-t border-white/5">
        <div className="max-w-[1000px] mx-auto">
          <FadeIn y={30} className="text-center mb-24 max-w-3xl mx-auto space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D7E2EA]/40">THE DIFFERENCE</span>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-[#D7E2EA]">Culling vs Auto Delivery.</h2>
            <p className="text-lg text-[#D7E2EA]/60 font-light">
              Save days spent sorting through event files and answering guest emails.
            </p>
          </FadeIn>

          <FadeIn y={30} className="border-t border-white/10">
            {/* Table headers */}
            <div className="grid grid-cols-1 md:grid-cols-2 py-8 text-xs font-black tracking-widest text-[#D7E2EA]/40 uppercase hidden md:grid">
              <div>TRADITIONAL CLIENT DELIVERY</div>
              <div>DELIVERY WITH GLIMPSE</div>
            </div>

            {/* Comparison Rows */}
            <div className="space-y-0">
              {[
                { old: 'Couple forwards full gallery links to everyone.', new: 'Private matching restricts access to relevant images.' },
                { old: 'Guests text: "Where can I find our photos?"', new: 'Guests get their photos instantly with a simple selfie.' },
                { old: 'Uploading files into massive, unorganized folders.', new: 'AI indexes face signatures and handles the sorting.' },
                { old: 'Standard delivery sites look generic.', new: 'The client experience is customized with your studio brand.' }
              ].map((row, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center py-8 border-t border-white/5 gap-6 md:gap-10 hover:bg-white/[0.02] transition-colors px-4 -mx-4 rounded-2xl">
                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-[#1A1A1A] flex items-center justify-center shrink-0 border border-white/5">
                      <XIcon className="w-3 h-3 text-[#D7E2EA]/30" />
                    </div>
                    <span className="text-[#D7E2EA]/50 text-sm font-light leading-relaxed">{row.old}</span>
                  </div>

                  <div className="text-white/10 hidden md:block">→</div>

                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                      <Check className="w-3 h-3 text-[#D7E2EA]" />
                    </div>
                    <span className="font-semibold text-[#D7E2EA] text-sm leading-relaxed tracking-wide uppercase">{row.new}</span>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Event Types Section */}
      <section id="photographers" className="py-32 px-6 bg-[#0C0C0C] border-t border-white/5">
        <div className="max-w-[1200px] mx-auto">
          <FadeIn y={30} className="text-center mb-24 max-w-3xl mx-auto space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D7E2EA]/40">EVERY EVENT TYPE</span>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-[#D7E2EA]">Built for any event.</h2>
            <p className="text-lg text-[#D7E2EA]/60 font-light">
              Our secure face signature platform scales seamlessly, whatever you are photographing.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Weddings & Celebrations', desc: 'Haldi, sangeet, and reception photos. Family members find their portraits instantly without culling thousands of images.' },
              { title: 'Conferences & Corporate', desc: 'Provide speakers and attendees with their keynotes and networking portraits instantly. Private and GDPR-compliant.' },
              { title: 'Sports & Marathons', desc: 'Index tens of thousands of race photos. Participants input their selfie and download their race portraits instantly.' }
            ].map((card, i) => (
              <FadeIn key={i} delay={i * 0.15} y={30}>
                <div className="bg-[#111111] border border-white/5 rounded-3xl p-10 hover:border-white/20 hover:bg-[#151515] transition-all duration-500 h-full">
                  <h3 className="text-xl font-bold uppercase tracking-wide text-[#D7E2EA] mb-6">{card.title}</h3>
                  <p className="text-sm text-[#D7E2EA]/50 leading-relaxed font-light">{card.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
