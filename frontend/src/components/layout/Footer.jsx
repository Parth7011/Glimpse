import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Instagram, Facebook, X as XIcon, Link as LinkIcon, Youtube } from 'lucide-react';

export function Footer() {
  return (
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
              <li><Link to="/for-photographers" className="hover:text-white transition-colors">For photographers</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="/#pricing" className="hover:text-white transition-colors">Pricing</a></li>
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
  );
}
