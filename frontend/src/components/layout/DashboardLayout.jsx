import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { LayoutDashboard, Calendar, Settings, LogOut, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/utils';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' },
  { label: 'Events', icon: Calendar, to: '/dashboard', matchPrefix: '/events' },
  { label: 'Settings', icon: Settings, to: '/dashboard' },
];

function NavLink({ item, isActive }) {
  return (
    <Link
      to={item.to}
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-[var(--radius-md)] transition-all duration-200 group',
        isActive
          ? 'bg-[var(--accent-soft)] text-[var(--accent)] font-semibold'
          : 'text-[var(--text-secondary)] hover:bg-[var(--surface-soft)] hover:text-[var(--text-primary)]'
      )}
    >
      <item.icon className={cn(
        'w-[18px] h-[18px] shrink-0 transition-colors',
        isActive ? 'text-[var(--accent)]' : 'text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]'
      )} />
      {item.label}
      {isActive && (
        <ChevronRight className="w-3.5 h-3.5 ml-auto text-[var(--accent)] opacity-60" />
      )}
    </Link>
  );
}

export function DashboardLayout() {
  const location = useLocation();

  const isNavActive = (item) => {
    if (item.matchPrefix && location.pathname.startsWith(item.matchPrefix)) return true;
    return location.pathname === item.to;
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-[var(--sidebar-width)] border-r border-[var(--border)] bg-[var(--surface)] px-4 py-5 shrink-0">
        {/* Logo */}
        <div className="px-2 mb-8">
          <Link to="/" className="text-xl font-bold text-[var(--text-primary)] tracking-tight hover:text-[var(--accent)] transition-colors flex items-center gap-2">
            <div className="w-8 h-8 rounded-[var(--radius-md)] bg-[var(--accent)] flex items-center justify-center">
              <span className="text-white text-sm font-bold">G</span>
            </div>
            Glimpse
          </Link>
        </div>

        {/* Navigation */}
        <nav className="space-y-1 flex-1">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.label} item={item} isActive={isNavActive(item)} />
          ))}
        </nav>

        {/* Bottom section */}
        <div className="space-y-2 pt-4 border-t border-[var(--border)]">
          {/* User profile */}
          <div className="flex items-center gap-3 px-2 py-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] flex items-center justify-center text-xs font-bold text-white shadow-sm">
              AK
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[var(--text-primary)] truncate">Arjun Kapoor</p>
              <p className="text-xs text-[var(--text-muted)] truncate">demo@glimpse.com</p>
            </div>
          </div>
          {/* Logout */}
          <button className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-[var(--danger-soft)] rounded-[var(--radius-md)] transition-colors w-full">
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--surface)]">
          <Link to="/" className="flex items-center gap-2 text-base font-bold text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors">
            <div className="w-7 h-7 rounded-[var(--radius-sm)] bg-[var(--accent)] flex items-center justify-center">
              <span className="text-white text-xs font-bold">G</span>
            </div>
            Glimpse
          </Link>
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] flex items-center justify-center text-xs font-bold text-white">
            AK
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
