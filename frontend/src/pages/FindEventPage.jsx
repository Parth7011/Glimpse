import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, ArrowLeft, CalendarDays, ChevronRight } from 'lucide-react';
import { Button, Input, CursorGlow } from '@/components/ui';
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
    <div className="max-w-2xl mx-auto py-10 px-4 md:py-16 h-full flex flex-col font-kanit relative z-10">
      <CursorGlow />
      <Link
        to={ROUTES.GUEST_DASHBOARD}
        className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#D7E2EA]/50 hover:text-[#D7E2EA] transition-colors w-fit mb-12 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 flex flex-col"
      >
        <div className="mb-12 text-center">
          <div className="w-20 h-20 rounded-[2rem] bg-[#111111] border border-white/10 flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(215,226,234,0.1)] rotate-3 hover:rotate-0 hover:scale-110 transition-all duration-500">
            <Search className="w-10 h-10 text-[#D7E2EA] -rotate-3 hover:rotate-0 transition-transform duration-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-[#D7E2EA] uppercase drop-shadow-lg mb-4">
            Find your event
          </h1>
          <p className="text-[12px] font-bold uppercase tracking-widest text-[#D7E2EA]/50">
            Search by event name or enter the code you received.
          </p>
        </div>

        <div className="bg-[#111111]/80 backdrop-blur-xl border border-white/5 rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50 pointer-events-none" />

          <form onSubmit={handleSearch} className="relative z-10 flex flex-col gap-8">
            <div className="space-y-4">
              <label htmlFor="eventSearch" className="text-[10px] font-black uppercase tracking-widest text-[#D7E2EA]/50 block">
                Event Name or Code
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none z-10">
                  {searching || loading ? (
                    <Loader2 className="w-5 h-5 text-[#D7E2EA] animate-spin" />
                  ) : (
                    <Search className="w-5 h-5 text-[#D7E2EA]/50" />
                  )}
                </div>
                <Input
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
                  className={`pl-14 text-base ${error ? 'border-red-500/50 focus:border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : ''}`}
                  autoFocus
                />

                <AnimatePresence>
                  {showSuggestions && suggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="absolute top-[calc(100%+0.5rem)] left-0 right-0 bg-[#1A1A1A] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden max-h-[16rem] overflow-y-auto custom-scrollbar backdrop-blur-xl"
                    >
                      {suggestions.map((event) => (
                        <button
                          key={event.slug}
                          type="button"
                          onMouseDown={() => goToEvent(event.slug)}
                          className="w-full flex items-center gap-4 px-5 py-4 hover:bg-white/5 transition-colors text-left group border-b border-white/5 last:border-0"
                        >
                          <div className="w-12 h-12 rounded-xl bg-[#222222] border border-white/5 shrink-0 flex items-center justify-center overflow-hidden">
                            {event.cover_photo_url ? (
                              <img
                                src={event.cover_photo_url}
                                alt={event.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            ) : (
                              <span className="text-[#D7E2EA] font-black">{event.name.charAt(0).toUpperCase()}</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold uppercase tracking-wide text-[#D7E2EA] truncate">{event.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <CalendarDays className="w-3.5 h-3.5 text-[#D7E2EA]/40" />
                              <span className="text-[10px] font-bold uppercase tracking-widest text-[#D7E2EA]/40">
                                {new Date(event.date || event.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-[#D7E2EA]/40 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
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
                  className="text-red-400 text-[10px] font-bold uppercase tracking-widest mt-2"
                >
                  {error}
                </motion.p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={loading || !query.trim()}
              className="w-full h-14"
            >
              {loading ? 'Searching...' : 'Continue to Event →'}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
