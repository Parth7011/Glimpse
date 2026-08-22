import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/utils/constants';
import { Button } from '@/components/ui';
import { cn } from '@/utils/utils';

export function Navbar({ activePage = 'home', theme = 'light' }) {
  const [isNavScrolled, setIsNavScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsNavScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isDark = theme === 'dark';

  return (
    <nav className={cn(
      "fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-in-out font-kanit",
      isNavScrolled
        ? `top-6 w-[90%] md:w-[75%] max-w-[1200px] px-6 py-3 backdrop-blur-lg shadow-md rounded-full border ${isDark ? 'bg-[#0C0C0C]/70 border-[#D7E2EA]/20' : 'bg-white/70 border-white/40'}`
        : "top-0 w-full max-w-full px-8 md:px-16 py-6 bg-transparent border-b border-transparent shadow-none rounded-none"
    )}>
      <div className="max-w-[1200px] mx-auto w-full flex items-center justify-between">
        <Link to="/" className={cn(
          "text-2xl font-bold tracking-tighter flex items-center gap-1.5",
          isDark ? "text-[#D7E2EA]" : "text-[var(--text-primary)]"
        )}>
          Glimpse
        </Link>
        
        <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          <Link to="/" className={cn(
            "text-base transition-colors",
            activePage === 'home' 
              ? (isDark ? "font-semibold text-white" : "font-semibold text-[var(--accent)]")
              : (isDark ? "font-medium text-[#D7E2EA]/70 hover:text-white" : "font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]")
          )}>
            Home
          </Link>
          
          <Link to="/how-it-works" className={cn(
            "text-base transition-colors",
            activePage === 'how-it-works' 
              ? (isDark ? "font-semibold text-white" : "font-semibold text-[var(--accent)]")
              : (isDark ? "font-medium text-[#D7E2EA]/70 hover:text-white" : "font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]")
          )}>
            How it works
          </Link>
          
          <Link to="/for-photographers" className={cn(
            "text-base transition-colors",
            activePage === 'photographers' 
              ? (isDark ? "font-semibold text-white" : "font-semibold text-[var(--accent)]")
              : (isDark ? "font-medium text-[#D7E2EA]/70 hover:text-white" : "font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]")
          )}>
            For photographers
          </Link>
          
          <Link to="/about" className={cn(
            "text-base transition-colors",
            activePage === 'about' 
              ? (isDark ? "font-semibold text-white" : "font-semibold text-[var(--accent)]")
              : (isDark ? "font-medium text-[#D7E2EA]/70 hover:text-white" : "font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]")
          )}>
            About
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link to={ROUTES.LOGIN}>
            {isDark ? (
              <Button className="rounded-full px-6 shadow-sm font-semibold tracking-wide bg-[#D7E2EA] hover:bg-white text-[#0C0C0C]">
                Start free →
              </Button>
            ) : (
              <Button className="rounded-full px-6 shadow-sm font-semibold tracking-wide bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white">
                Start free →
              </Button>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}
