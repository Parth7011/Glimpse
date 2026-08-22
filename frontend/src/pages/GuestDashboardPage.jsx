import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, Image as ImageIcon, Calendar as CalendarIcon, ArrowRight, Loader2 } from 'lucide-react';
import { Button, CursorGlow } from '@/components/ui';
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
      className="space-y-12 max-w-6xl mx-auto font-kanit relative z-10"
    >
      <CursorGlow />
      {/* Greeting Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pt-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-[#D7E2EA] uppercase drop-shadow-lg">
            {getGreeting()}, {guestName}
          </h1>
          <p className="text-[#D7E2EA]/50 mt-2 text-[10px] font-bold uppercase tracking-widest">View your matching photos from past events.</p>
        </div>
        <Link to="/guest-dashboard/find">
          <Button variant="primary" className="shadow-[0_0_20px_rgba(215,226,234,0.15)] h-12 px-8">
            <Search className="w-4 h-4 mr-2" /> Find an Event
          </Button>
        </Link>
      </motion.div>

      {/* Events Grid */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
          <h2 className="text-2xl font-black uppercase tracking-tight text-[#D7E2EA]">Your Events</h2>
          {!loading && (
            <span className="text-[10px] font-black uppercase tracking-widest text-[#D7E2EA]/50 bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
              {events.length} event{events.length !== 1 ? 's' : ''} found
            </span>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="w-10 h-10 animate-spin text-[#D7E2EA]" />
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="text-center py-24 text-red-400 font-bold uppercase tracking-widest text-xs bg-red-500/10 rounded-2xl border border-red-500/20">{error}</div>
        )}

        {/* Empty State */}
        {!loading && !error && events.length === 0 && (
          <div className="text-center py-32 bg-[#111111]/80 backdrop-blur-md rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50 pointer-events-none" />
            <div className="w-24 h-24 rounded-full bg-[#1A1A1A] flex items-center justify-center mx-auto mb-8 border border-white/10 shadow-inner group-hover:scale-110 transition-transform duration-500">
              <ImageIcon className="w-10 h-10 text-[#D7E2EA]/30 group-hover:text-[#D7E2EA]/70 transition-colors" />
            </div>
            <h3 className="text-3xl font-black uppercase tracking-tight text-[#D7E2EA] mb-2 drop-shadow-md">No events yet</h3>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#D7E2EA]/50 mb-10">Join an event to find your photos instantly.</p>
            <Link to="/guest-dashboard/find" className="relative z-10">
              <Button variant="primary">Find an Event</Button>
            </Link>
          </div>
        )}

        {/* Events Grid */}
        {!loading && !error && events.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <motion.div key={event.id} variants={itemVariants}>
                <Link
                  to={ROUTES.GUEST_EVENT(event.slug)}
                  className="group flex flex-col bg-[#111111]/80 backdrop-blur-md border border-white/10 rounded-[2rem] overflow-hidden hover:shadow-[0_0_30px_rgba(215,226,234,0.1)] hover:border-white/20 transition-all duration-500 h-full relative"
                >
                  <div className="aspect-video w-full relative overflow-hidden bg-[#1A1A1A]">
                    {event.cover_photo_url ? (
                      <img
                        src={event.cover_photo_url}
                        alt={event.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#1A1A1A] to-[#111111] flex items-center justify-center border-b border-white/5">
                        <ImageIcon className="w-12 h-12 text-[#D7E2EA]/20" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0C] via-black/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                    {/* Match Badge */}
                    {event.matches > 0 && (
                      <div className="absolute top-4 right-4 bg-green-500/20 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                        <ImageIcon className="w-3.5 h-3.5 text-green-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-green-400">{event.matches} matches</span>
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex flex-col flex-1 relative z-10 -mt-6">
                    <h3 className="text-xl font-black uppercase tracking-tight text-[#D7E2EA] mb-3 line-clamp-1 drop-shadow-md">
                      {event.name}
                    </h3>

                    <div className="space-y-2 mt-auto">
                      {event.date && (
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#D7E2EA]/50">
                          <CalendarIcon className="w-3.5 h-3.5" />
                          {new Date(event.date).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </div>
                      )}
                    </div>

                    <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-[#D7E2EA] group-hover:text-white transition-colors">
                      View Gallery
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#D7E2EA] group-hover:text-[#0C0C0C] transition-colors">
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}

            {/* Find More Card */}
            <motion.div variants={itemVariants}>
              <Link
                to="/guest-dashboard/find"
                className="group flex flex-col h-full bg-[#111111]/30 backdrop-blur-md border border-dashed border-white/20 rounded-[2rem] items-center justify-center p-10 hover:bg-[#111111]/80 hover:border-[#D7E2EA]/50 transition-all duration-500 min-h-[320px] shadow-inner hover:shadow-[0_0_30px_rgba(215,226,234,0.1)]"
              >
                <div className="w-16 h-16 rounded-full bg-[#1A1A1A] border border-white/10 shadow-inner flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#D7E2EA] transition-all duration-500">
                  <Search className="w-6 h-6 text-[#D7E2EA] group-hover:text-[#0C0C0C] transition-colors" />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight text-[#D7E2EA] mb-2 drop-shadow-sm">Find another event</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#D7E2EA]/50 text-center">
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
