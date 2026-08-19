import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/utils/constants';
import { Button } from '@/components/ui';
import { cn } from '@/utils/utils';

export function Navbar({ activePage = 'home' }) {
  const [isNavScrolled, setIsNavScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsNavScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
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
          <Link to="/" className={cn(
            "text-sm transition-colors",
            activePage === 'home' 
              ? "font-semibold text-[var(--accent)]" 
              : "font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          )}>
            Home
          </Link>
          
          <Link to="/how-it-works" className={cn(
            "text-sm transition-colors",
            activePage === 'how-it-works' 
              ? "font-semibold text-[var(--accent)]" 
              : "font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          )}>
            How it works
          </Link>
          
          <Link to="/for-photographers" className={cn(
            "text-sm transition-colors",
            activePage === 'photographers' 
              ? "font-semibold text-[var(--accent)]" 
              : "font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          )}>
            For photographers
          </Link>
          
          <Link to="/about" className={cn(
            "text-sm transition-colors",
            activePage === 'about' 
              ? "font-semibold text-[var(--accent)]" 
              : "font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          )}>
            About
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link to={ROUTES.LOGIN}>
            <Button className="rounded-full px-6 shadow-sm font-semibold tracking-wide bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white">
              Start free →
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
