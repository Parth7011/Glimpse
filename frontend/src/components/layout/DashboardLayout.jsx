import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Settings, LogOut, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/utils';
import { authService } from '@/services/authService';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' },
  { label: 'Settings', icon: Settings, to: '/dashboard/settings' },
];

function NavLink({ item, isActive }) {
  return (
    <Link
      to={item.to}
      className={cn(
        'flex items-center gap-3 px-4 py-3 text-xs font-black uppercase tracking-widest rounded-2xl transition-all duration-300 group',
        isActive
          ? 'bg-[#D7E2EA] text-[#0C0C0C] shadow-[0_0_20px_rgba(215,226,234,0.3)]'
          : 'text-[#D7E2EA]/50 hover:bg-white/5 hover:text-[#D7E2EA]'
      )}
    >
      <item.icon className={cn(
        'w-4 h-4 shrink-0 transition-colors',
        isActive ? 'text-[#0C0C0C]' : 'text-[#D7E2EA]/40 group-hover:text-[#D7E2EA]'
      )} />
      {item.label}
      {isActive && (
        <ChevronRight className="w-4 h-4 ml-auto text-[#0C0C0C]/50" />
      )}
    </Link>
  );
}

export function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: 'Photographer', email: '' });

  useEffect(() => {
    try {
      const userStr = localStorage.getItem('glimpse_user');
      if (userStr) {
        const parsedUser = JSON.parse(userStr);
        setUser({
          name: parsedUser.user_metadata?.name || parsedUser.name || parsedUser.email?.split('@')[0] || 'Photographer',
          email: parsedUser.email || ''
        });
      }
    } catch (e) {
      console.error('Failed to parse user from local storage');
    }
  }, []);

  const isNavActive = (item) => {
    if (item.matchPrefix && location.pathname.startsWith(item.matchPrefix)) return true;
    return location.pathname === item.to;
  };

  const getInitials = (name) => {
    if (!name) return 'P';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    await authService.logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#0C0C0C] flex font-kanit text-[#D7E2EA] selection:bg-[#D7E2EA] selection:text-[#0C0C0C]">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-[280px] border-r border-white/5 bg-[#111111]/80 backdrop-blur-xl px-5 py-6 shrink-0 relative z-20">
        {/* Logo */}
        <div className="px-2 mb-10">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-[#D7E2EA] flex items-center justify-center group-hover:shadow-[0_0_15px_rgba(215,226,234,0.5)] transition-all">
              <span className="text-[#0C0C0C] text-sm font-black uppercase">G</span>
            </div>
            <span className="text-2xl font-black uppercase tracking-tight text-[#D7E2EA]">Glimpse</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 flex-1">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.label} item={item} isActive={isNavActive(item)} />
          ))}
        </nav>

        {/* Bottom section */}
        <div className="space-y-3 pt-6 border-t border-white/5 mt-auto">
          {/* User profile */}
          <div className="flex items-center gap-3 px-3 py-3 bg-[#1A1A1A] rounded-2xl border border-white/5">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#D7E2EA] to-white flex items-center justify-center text-sm font-black text-[#0C0C0C] shadow-[0_0_15px_rgba(215,226,234,0.3)] uppercase">
              {getInitials(user.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-[#D7E2EA] uppercase tracking-wider truncate">{user.name}</p>
              <p className="text-[9px] font-bold text-[#D7E2EA]/50 uppercase tracking-widest truncate">{user.email}</p>
            </div>
          </div>
          {/* Logout */}
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-xs font-black uppercase tracking-widest text-[#D7E2EA]/50 hover:text-red-400 hover:bg-red-500/10 rounded-2xl transition-all w-full text-left group">
            <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <header className="lg:hidden flex items-center justify-between px-5 py-4 border-b border-white/5 bg-[#111111]/80 backdrop-blur-xl">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-lg bg-[#D7E2EA] flex items-center justify-center group-hover:shadow-[0_0_15px_rgba(215,226,234,0.5)] transition-all">
              <span className="text-[#0C0C0C] text-xs font-black uppercase">G</span>
            </div>
            <span className="text-xl font-black uppercase tracking-tight text-[#D7E2EA]">Glimpse</span>
          </Link>
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#D7E2EA] to-white flex items-center justify-center text-xs font-black text-[#0C0C0C] shadow-md uppercase">
            {getInitials(user.name)}
          </div>
        </header>
        <main className="flex-1 p-6 md:p-8 lg:p-12 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
