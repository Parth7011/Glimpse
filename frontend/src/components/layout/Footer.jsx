import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Instagram, Facebook, X as XIcon, Link as LinkIcon, Youtube } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative bg-[#0C0C0C] text-[#D7E2EA] font-kanit overflow-hidden border-t border-[#D7E2EA]/10">
      
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#D7E2EA]/5 via-[#0C0C0C] to-[#0C0C0C]" />
      
      {/* Subtle Noise / Grid Pattern */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm20 20h20v20H20V20zM0 20h20v20H0V20z' fill='%23FFFFFF' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          backgroundSize: '40px',
        }}
      />

      <div className="relative z-10 max-w-[1300px] mx-auto px-6 pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-20">
          
          {/* Left Column (Brand & Info) */}
          <div className="md:col-span-5 lg:col-span-4 space-y-6">
            <p className="text-[#D7E2EA]/70 text-sm leading-relaxed max-w-[280px]">
              AI-powered event photo delivery for photographers and studios across India.
            </p>
            <p className="text-[#D7E2EA]/50 text-xs max-w-[280px]">
              One browser link. Private matching. Your brand.
            </p>
            
            <div className="pt-2 flex items-center gap-2 text-[#D7E2EA]/70 hover:text-white transition-colors cursor-pointer w-fit">
              <Mail className="w-4 h-4 text-white" />
              <span className="text-sm font-semibold">hello@glimpse.in</span>
            </div>

            <div className="flex items-center gap-3 pt-4">
              {[Instagram, Facebook, XIcon, LinkIcon, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full border border-[#D7E2EA]/10 bg-[#D7E2EA]/5 flex items-center justify-center text-[#D7E2EA]/60 hover:text-white hover:bg-[#D7E2EA]/10 hover:border-[#D7E2EA]/20 transition-all">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Spacer */}
          <div className="hidden lg:block md:col-span-2 lg:col-span-3" />

          {/* Middle Column (Explore) */}
          <div className="md:col-span-4 lg:col-span-3">
            <h4 className="text-xs font-black tracking-widest text-[#D7E2EA]/40 uppercase mb-6">EXPLORE</h4>
            <ul className="space-y-4 text-sm font-medium text-[#D7E2EA]/70">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/how-it-works" className="hover:text-white transition-colors">How it works</Link></li>
              <li><Link to="/for-photographers" className="hover:text-white transition-colors">For photographers</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
            </ul>
          </div>

          {/* Right Column (Legal) */}
          <div className="md:col-span-3 lg:col-span-2">
            <h4 className="text-xs font-black tracking-widest text-[#D7E2EA]/40 uppercase mb-6">LEGAL</h4>
            <ul className="space-y-4 text-sm font-medium text-[#D7E2EA]/70">
              <li><a href="#" className="hover:text-white transition-colors">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-[#D7E2EA]/50 uppercase tracking-wide relative z-20">
          <div>© 2026 Glimpse India. All rights reserved.</div>
          <div>A product of Logicbyts Software Solutions.</div>
        </div>
      </div>

      {/* Massive Background Text */}
      <div className="w-full overflow-hidden flex justify-center -mt-10 md:-mt-24 pointer-events-none select-none relative z-0">
        <h1 
          className="font-black uppercase tracking-tighter text-[#D7E2EA]/[0.08] text-center"
          style={{ fontSize: 'clamp(5rem, 24vw, 400px)', lineHeight: 0.75 }}
        >
          GLIMPSE
        </h1>
      </div>
    </footer>
  );
}
