import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, ArrowLeft, CalendarDays, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui';
import { ROUTES } from '@/utils/constants';
import { eventService } from '@/services/eventService';

export default function FindEventPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!query.trim()) {
        setSuggestions([]);
        return;
      }
      setSearching(true);
      try {
        const results = await eventService.searchEvents(query.trim());
        setSuggestions(results);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setSearching(false);
      }
    };

    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const goToEvent = (slug) => {
    setLoading(true);
    setError('');
    setShowSuggestions(false);
    navigate(ROUTES.GUEST_EVENT(slug));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setError('');
    setLoading(true);
    setShowSuggestions(false);

    try {
      const results = await eventService.searchEvents(query.trim());
      if (results.length > 0) {
        navigate(ROUTES.GUEST_EVENT(results[0].slug));
      } else {
        setError('Event not found. Check the name or code and try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
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

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[2rem] p-6 md:p-10 shadow-xl relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#7C6EF6]/10 to-transparent rounded-[2rem] blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none overflow-hidden" />

          <form onSubmit={handleSearch} className="relative z-10 flex flex-col gap-6">
            <div className="space-y-2">
              <label htmlFor="eventSearch" className="text-sm font-bold text-[var(--text-primary)] ml-1">
                Event Name or Code
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  {searching || loading ? (
                    <Loader2 className="w-5 h-5 text-[#7C6EF6] animate-spin" />
                  ) : (
                    <Search className="w-5 h-5 text-[#A19D98]" />
                  )}
                </div>
                <input
                  id="eventSearch"
                  type="text"
                  placeholder="e.g. Demo or aarav-meera-wedding"
                  value={query}
                  autoComplete="off"
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setShowSuggestions(true);
                    if (error) setError('');
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className={`w-full p-4 pl-12 pr-5 text-base bg-[var(--background)] border-2 rounded-[1rem] transition-all outline-none focus:ring-4 focus:ring-[#7C6EF6]/10 ${
                    error
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-[#E5E5E0] focus:border-[#7C6EF6]'
                  }`}
                  autoFocus
                />

                <AnimatePresence>
                  {showSuggestions && suggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-white border border-[var(--border)] rounded-2xl shadow-2xl z-50 overflow-hidden max-h-[16rem] overflow-y-auto custom-scrollbar"
                    >
                      {suggestions.map((event) => (
                        <button
                          key={event.slug}
                          type="button"
                          onMouseDown={() => goToEvent(event.slug)}
                          className="w-full flex items-center gap-4 px-4 py-3 hover:bg-[#F9F8F6] transition-colors text-left group"
                        >
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7C6EF6] to-[#5A4ED1] shrink-0 flex items-center justify-center">
                            {event.cover_photo_url ? (
                              <img
                                src={event.cover_photo_url}
                                alt={event.name}
                                className="w-full h-full rounded-xl object-cover"
                              />
                            ) : (
                              <span className="text-white font-bold">{event.name.charAt(0).toUpperCase()}</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-[var(--text-primary)] truncate">{event.name}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <CalendarDays className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                              <span className="text-xs text-[var(--text-muted)]">
                                {new Date(event.date || event.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

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
        </div>
      </motion.div>
    </div>
  );
}
