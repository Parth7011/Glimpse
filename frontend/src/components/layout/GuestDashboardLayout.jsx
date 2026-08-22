import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Camera, Image, Settings, LogOut, ChevronRight, Search } from 'lucide-react';
import { cn } from '@/utils/utils';

const NAV_ITEMS = [
  { label: 'My Events', icon: Image, to: '/guest-dashboard' },
  { label: 'Find Event', icon: Search, to: '/guest-dashboard/find' },
  { label: 'Settings', icon: Settings, to: '/guest-dashboard/settings' },
];

function NavLink({ item, isActive }) {
  return (
    <Link
      to={item.to}
      className={cn(
        'flex items-center gap-3 px-4 py-3 text-[10px] uppercase tracking-widest font-bold rounded-2xl transition-all duration-300 group',
        isActive
          ? 'bg-white/5 text-[#D7E2EA] shadow-[0_0_20px_rgba(215,226,234,0.05)] border border-white/10'
          : 'text-[#D7E2EA]/50 hover:bg-white/[0.02] hover:text-[#D7E2EA]'
      )}
    >
      <item.icon className={cn(
        'w-[18px] h-[18px] shrink-0 transition-colors duration-300',
        isActive ? 'text-[#D7E2EA]' : 'text-[#D7E2EA]/40 group-hover:text-[#D7E2EA]'
      )} />
      {item.label}
      {isActive && (
        <ChevronRight className="w-3.5 h-3.5 ml-auto text-[#D7E2EA] opacity-60" />
      )}
    </Link>
  );
}

export function GuestDashboardLayout() {
  const location = useLocation();
  const [user, setUser] = useState({ name: 'Guest', email: '' });

  useEffect(() => {
    try {
      const userStr = localStorage.getItem('glimpse_user');
      if (userStr) {
        const parsed = JSON.parse(userStr);
        setUser({
          name: parsed.user_metadata?.name || parsed.name || parsed.email?.split('@')[0] || 'Guest',
          email: parsed.email || ''
        });
      }
    } catch (e) {
      console.error('Failed to parse user from localStorage');
    }
  }, []);

  const getInitials = (name) => {
    if (!name) return 'G';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const isNavActive = (item) => {
    return location.pathname === item.to;
  };

  return (
    <div className="min-h-screen bg-[#0C0C0C] font-kanit selection:bg-[#D7E2EA] selection:text-[#0C0C0C] flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-[280px] border-r border-white/5 bg-[#111111]/80 backdrop-blur-xl px-5 py-6 shrink-0 z-20">
        {/* Logo */}
        <div className="px-2 mb-10">
          <Link to="/" className="text-2xl font-black text-[#D7E2EA] tracking-tighter hover:text-white transition-colors flex items-center gap-3 uppercase drop-shadow-md">
            <div className="w-10 h-10 rounded-[14px] bg-[#D7E2EA] flex items-center justify-center shadow-[0_0_20px_rgba(215,226,234,0.3)]">
              <span className="text-[#0C0C0C] text-lg font-black tracking-tighter -ml-0.5">G</span>
            </div>
            Glimpse
          </Link>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 flex-1">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.label} item={item} isActive={isNavActive(item)} />
          ))}
        </nav>

        {/* Bottom section */}
        <div className="space-y-3 pt-6 border-t border-white/10 mt-6">
          {/* User profile */}
          <div className="flex items-center gap-3 p-3 bg-[#1A1A1A] border border-white/5 rounded-2xl shadow-inner">
            <div className="h-10 w-10 rounded-xl bg-[#D7E2EA]/10 border border-[#D7E2EA]/20 flex items-center justify-center text-xs font-black text-[#D7E2EA] shadow-inner">
              {getInitials(user.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-black uppercase tracking-wider text-[#D7E2EA] truncate">{user.name}</p>
              <p className="text-[9px] font-bold uppercase tracking-widest text-[#D7E2EA]/40 truncate">{user.email || 'Guest'}</p>
            </div>
          </div>
          {/* Logout */}
          <Link to="/login" className="flex items-center gap-3 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#D7E2EA]/50 hover:text-red-400 hover:bg-red-400/10 rounded-2xl transition-colors w-full border border-transparent hover:border-red-400/20 group">
            <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Sign out
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <header className="lg:hidden flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#111111]/80 backdrop-blur-md">
          <Link to="/" className="flex items-center gap-2 text-lg font-black uppercase tracking-tighter text-[#D7E2EA] hover:text-white transition-colors">
            <div className="w-8 h-8 rounded-[10px] bg-[#D7E2EA] flex items-center justify-center shadow-[0_0_15px_rgba(215,226,234,0.3)]">
              <span className="text-[#0C0C0C] text-sm font-black -ml-0.5">G</span>
            </div>
            Glimpse
          </Link>
          <div className="h-9 w-9 rounded-xl bg-[#D7E2EA]/10 border border-[#D7E2EA]/20 flex items-center justify-center text-[10px] font-black text-[#D7E2EA]">
            G
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
