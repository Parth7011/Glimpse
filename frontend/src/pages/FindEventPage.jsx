import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, ArrowLeft, CalendarDays, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui';
import { ROUTES } from '@/utils/constants';

// All mock events — searchable by name OR slug
const ALL_EVENTS = [
  {
    name: 'Aarav & Meera Wedding',
    slug: 'aarav-meera-wedding',
    date: 'Dec 18, 2026',
    cover: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80',
  },
  {
    name: 'TechSummit 2026',
    slug: 'techsummit-2026',
    date: 'Nov 5, 2026',
    cover: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80',
  },
  {
    name: 'Diwali Celebration 2026',
    slug: 'diwali-celebration-2026',
    date: 'Oct 20, 2026',
    cover: 'https://images.unsplash.com/photo-1604017011826-d3b4c23f8914?w=400&q=80',
  },
  {
    name: "Priya's Birthday Party",
    slug: 'priyas-birthday-party',
    date: 'Sep 12, 2026',
    cover: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&q=80',
  },
];

export default function FindEventPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Filter events that match name OR slug — case insensitive
  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return ALL_EVENTS.filter(
      (e) => e.name.toLowerCase().includes(q) || e.slug.includes(q)
    );
  }, [query]);

  const goToEvent = (slug) => {
    setLoading(true);
    setError('');
    setShowSuggestions(false);
    setTimeout(() => {
      setLoading(false);
      navigate(ROUTES.GUEST_EVENT(slug));
    }, 1000);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setError('');
    setLoading(true);
    setShowSuggestions(false);

    setTimeout(() => {
      setLoading(false);
      const q = query.trim().toLowerCase();
      // Match by name OR slug
      const found = ALL_EVENTS.find(
        (e) => e.name.toLowerCase() === q || e.slug === q
      );
      if (found) {
        navigate(ROUTES.GUEST_EVENT(found.slug));
      } else {
        setError('Event not found. Check the name or code and try again.');
      }
    }, 1200);
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 md:py-16 h-full flex flex-col">
      <Link
        to={ROUTES.GUEST_DASHBOARD}
        className="flex items-center gap-2 text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors w-fit mb-8"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 flex flex-col"
      >
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7C6EF6] to-[#5A4ED1] flex items-center justify-center mx-auto mb-6 shadow-lg rotate-3">
            <Search className="w-8 h-8 text-white -rotate-3" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--text-primary)] mb-3">
            Find your event
          </h1>
          <p className="text-[var(--text-secondary)] text-lg">
            Search by event name or enter the code you received.
          </p>
        </div>

        {/* Card */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[2rem] p-6 md:p-10 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#7C6EF6]/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

          <form onSubmit={handleSearch} className="relative z-10 flex flex-col gap-6">
            <div className="space-y-2">
              <label htmlFor="eventSearch" className="text-sm font-bold text-[var(--text-primary)] ml-1">
                Event Name or Code
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  {loading ? (
                    <Loader2 className="w-5 h-5 text-[#7C6EF6] animate-spin" />
                  ) : (
                    <Search className="w-5 h-5 text-[#A19D98]" />
                  )}
                </div>
                <input
                  id="eventSearch"
                  type="text"
                  placeholder="e.g. Aarav Wedding or aarav-meera-wedding"
                  value={query}
                  autoComplete="off"
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setShowSuggestions(true);
                    if (error) setError('');
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                  className={`w-full p-4 pl-12 pr-5 text-base bg-[var(--background)] border-2 rounded-[1rem] transition-all outline-none focus:ring-4 focus:ring-[#7C6EF6]/10 ${
                    error
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-[#E5E5E0] focus:border-[#7C6EF6]'
                  }`}
                  autoFocus
                />

                {/* Live Suggestions Dropdown */}
                <AnimatePresence>
                  {showSuggestions && suggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-white border border-[var(--border)] rounded-2xl shadow-2xl z-50 overflow-hidden"
                    >
                      {suggestions.map((event) => (
                        <button
                          key={event.slug}
                          type="button"
                          onMouseDown={() => goToEvent(event.slug)}
                          className="w-full flex items-center gap-4 px-4 py-3 hover:bg-[#F9F8F6] transition-colors text-left group"
                        >
                          <img
                            src={event.cover}
                            alt={event.name}
                            className="w-12 h-12 rounded-xl object-cover shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-[var(--text-primary)] truncate">{event.name}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <CalendarDays className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                              <span className="text-xs text-[var(--text-muted)]">{event.date}</span>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Error Message */}
              {error && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="text-red-500 text-sm font-semibold ml-1"
                >
                  {error}
                </motion.p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading || !query.trim()}
              style={{ backgroundColor: loading || !query.trim() ? '' : '#7C6EF6' }}
              className={`w-full h-14 text-base font-bold rounded-[1rem] shadow-lg transition-all ${
                loading || !query.trim()
                  ? 'bg-gray-300 text-gray-500 shadow-none'
                  : 'hover:bg-[#5A4ED1] text-white hover:shadow-xl hover:scale-[1.02]'
              }`}
            >
              {loading ? 'Searching...' : 'Continue to Event →'}
            </Button>
          </form>

          {/* Demo shortcuts */}
          <div className="mt-8 pt-6 border-t border-[var(--border)]">
            <p className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider mb-3 text-center">
              Demo Events — click to auto-fill
            </p>
            <div className="grid grid-cols-2 gap-2">
              {ALL_EVENTS.map((event) => (
                <button
                  key={event.slug}
                  type="button"
                  onClick={() => {
                    setQuery(event.name);
                    setShowSuggestions(false);
                  }}
                  className="flex items-center gap-2 px-3 py-2.5 bg-[#F4F2EF] hover:bg-[#E5E5E0] rounded-xl text-sm font-medium text-[#6B6B67] transition-colors text-left"
                >
                  <img src={event.cover} alt={event.name} className="w-7 h-7 rounded-lg object-cover shrink-0" />
                  <span className="truncate">{event.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
