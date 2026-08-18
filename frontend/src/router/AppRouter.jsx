import React from 'react';
import { Routes, Route, Outlet, Link } from 'react-router-dom';

// Pages
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import CreateEventPage from '../pages/CreateEventPage';
import EventWorkspacePage from '../pages/EventWorkspacePage';
import UploadPage from '../pages/UploadPage';
import SharePage from '../pages/SharePage';
import GuestEventPage from '../pages/GuestEventPage';
import SelfiePage from '../pages/SelfiePage';
import ResultsPage from '../pages/ResultsPage';

// Simple layouts
function DashboardLayout() {
  return (
    <div className="min-h-screen bg-[var(--background)] flex">
      {/* Sidebar — simplified for Phase 1 */}
      <aside className="hidden lg:flex flex-col w-[var(--sidebar-width)] border-r border-[var(--border)] bg-[var(--surface)] px-4 py-5 shrink-0">
        <div className="px-2 mb-8">
          <Link to="/" className="text-base font-semibold text-[var(--text-primary)] tracking-tight hover:text-[var(--accent)] transition-colors">
            Glimpse
          </Link>
        </div>
        <nav className="space-y-1 flex-1">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-[var(--text-primary)] bg-[var(--surface-soft)] rounded-[var(--radius-sm)]"
          >
            Dashboard
          </Link>
        </nav>
        <div className="flex items-center gap-3 px-2 py-3 border-t border-[var(--border)] mt-auto">
          <div className="h-8 w-8 rounded-full bg-[var(--accent-soft)] flex items-center justify-center text-xs font-semibold text-[var(--accent)]">
            AK
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[var(--text-primary)] truncate">Arjun Kapoor</p>
            <p className="text-xs text-[var(--text-muted)] truncate">demo@glimpse.com</p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--surface)]">
          <Link to="/" className="text-base font-semibold text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors">Glimpse</Link>
          <div className="h-8 w-8 rounded-full bg-[var(--accent-soft)] flex items-center justify-center text-xs font-semibold text-[var(--accent)]">
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

function GuestLayout() {
  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      <Outlet />
    </div>
  );
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/events/new" element={<CreateEventPage />} />
        <Route path="/events/:eventId" element={<EventWorkspacePage />} />
        <Route path="/events/:eventId/upload" element={<UploadPage />} />
        <Route path="/events/:eventId/share" element={<SharePage />} />
      </Route>

      <Route element={<GuestLayout />}>
        <Route path="/e/:eventSlug" element={<GuestEventPage />} />
        <Route path="/e/:eventSlug/selfie" element={<SelfiePage />} />
        <Route path="/e/:eventSlug/results" element={<ResultsPage />} />
      </Route>
    </Routes>
  );
}
