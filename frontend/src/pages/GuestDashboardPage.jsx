import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, Image as ImageIcon, Calendar as CalendarIcon, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui';
import { ROUTES } from '@/utils/constants';
import { getGreeting } from '@/utils/utils';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } }
};

export default function GuestDashboardPage() {
  const [guestName, setGuestName] = useState('Guest');
  const [guestEmail, setGuestEmail] = useState('');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      const userStr = localStorage.getItem('glimpse_user');
      if (userStr) {
        const user = JSON.parse(userStr);
        const name = user.user_metadata?.name || user.name || user.email?.split('@')[0] || 'Guest';
        setGuestName(name);
        setGuestEmail(user.email || '');
      }
    } catch (e) {
      console.error('Failed to parse user from local storage');
    }
  }, []);

  useEffect(() => {
    if (!guestEmail) {
      setLoading(false);
      return;
    }

    const fetchEvents = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${API_URL}/guests/my-events?email=${encodeURIComponent(guestEmail)}`);
        if (!res.ok) throw new Error('Failed to fetch events');
        const data = await res.json();
        setEvents(data.events || []);
      } catch (err) {
        console.error('Fetch guest events error:', err);
        setError('Could not load your events. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [guestEmail]);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-10 max-w-5xl mx-auto"
    >
      {/* Greeting Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
            {getGreeting()}, {guestName}
          </h1>
          <p className="text-[var(--text-secondary)] mt-1.5 text-lg">View your matching photos from past events.</p>
        </div>
        <Link to="/guest-dashboard/find">
          <Button variant="primary" className="shadow-md gap-2 h-11 px-6">
            <Search className="w-4 h-4" /> Find an Event
          </Button>
        </Link>
      </motion.div>

      {/* Events Grid */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold tracking-tight text-[var(--text-primary)]">Your Events</h2>
          {!loading && (
            <span className="text-sm font-medium text-[var(--text-secondary)]">
              {events.length} event{events.length !== 1 ? 's' : ''} found
            </span>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--accent)]" />
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="text-center py-16 text-red-500 font-medium">{error}</div>
        )}

        {/* Empty State */}
        {!loading && !error && events.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-[var(--surface-soft)] flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="w-8 h-8 text-[var(--text-muted)]" />
            </div>
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">No events yet</h3>
            <p className="text-[var(--text-secondary)] mb-6">Join an event to find your photos instantly.</p>
            <Link to="/guest-dashboard/find">
              <Button variant="primary">Find an Event</Button>
            </Link>
          </div>
        )}

        {/* Events Grid */}
        {!loading && !error && events.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <motion.div key={event.id} variants={itemVariants}>
                <Link
                  to={ROUTES.GUEST_EVENT(event.slug)}
                  className="group flex flex-col bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden hover:shadow-xl hover:border-[var(--accent)]/30 transition-all duration-300"
                >
                  <div className="aspect-[4/3] w-full relative overflow-hidden bg-gray-100">
                    {event.cover_photo_url ? (
                      <img
                        src={event.cover_photo_url}
                        alt={event.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[var(--surface-soft)] to-[var(--surface)] flex items-center justify-center">
                        <ImageIcon className="w-12 h-12 text-[var(--text-muted)]" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent" />

                    {/* Match Badge */}
                    {event.matches > 0 && (
                      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                        <ImageIcon className="w-3.5 h-3.5 text-[var(--accent)]" />
                        <span className="text-xs font-bold text-[var(--text-primary)]">{event.matches} matches</span>
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-lg font-bold text-[var(--text-primary)] mb-3 line-clamp-1 group-hover:text-[var(--accent)] transition-colors">
                      {event.name}
                    </h3>

                    <div className="space-y-2 mt-auto">
                      {event.date && (
                        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                          <CalendarIcon className="w-4 h-4 text-[var(--text-muted)]" />
                          {new Date(event.date).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </div>
                      )}
                    </div>

                    <div className="mt-5 pt-4 border-t border-[var(--border)] flex items-center justify-between text-sm font-semibold text-[var(--accent)]">
                      View Gallery
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}

            {/* Find More Card */}
            <motion.div variants={itemVariants}>
              <Link
                to="/guest-dashboard/find"
                className="group flex flex-col h-full bg-[var(--surface-soft)] border-2 border-dashed border-[var(--border)] rounded-2xl items-center justify-center p-8 hover:bg-[var(--surface)] hover:border-[var(--accent)]/50 transition-all duration-300 min-h-[320px]"
              >
                <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Search className="w-6 h-6 text-[var(--accent)]" />
                </div>
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">Find another event</h3>
                <p className="text-sm text-[var(--text-secondary)] text-center">
                  Have a link or code from a photographer?
                </p>
              </Link>
            </motion.div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
