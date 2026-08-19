import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, Image as ImageIcon, MapPin, Calendar as CalendarIcon, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui';
import { ROUTES } from '@/utils/constants';
import { getGreeting } from '@/utils/utils';

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

const DUMMY_EVENTS = [
  {
    id: '1',
    slug: 'rohan-wedding',
    name: "Rohan & Priya's Wedding",
    date: '2026-08-15T00:00:00Z',
    location: 'Udaipur, RJ',
    coverUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80',
    matches: 12
  },
  {
    id: '2',
    slug: 'tech-summit-26',
    name: 'India Tech Summit 2026',
    date: '2026-07-22T00:00:00Z',
    location: 'Bangalore, KA',
    coverUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
    matches: 4
  }
];

export default function GuestDashboardPage() {
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
            {getGreeting()}, Guest
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
          <span className="text-sm font-medium text-[var(--text-secondary)]">
            {DUMMY_EVENTS.length} events found
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DUMMY_EVENTS.map((event) => (
            <motion.div key={event.id} variants={itemVariants}>
              <Link 
                to={ROUTES.GUEST_EVENT(event.slug)}
                className="group flex flex-col bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden hover:shadow-xl hover:border-[var(--accent)]/30 transition-all duration-300"
              >
                <div className="aspect-[4/3] w-full relative overflow-hidden bg-gray-100">
                  <img 
                    src={event.coverUrl} 
                    alt={event.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent" />
                  
                  {/* Match Badge */}
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                    <ImageIcon className="w-3.5 h-3.5 text-[var(--accent)]" />
                    <span className="text-xs font-bold text-[var(--text-primary)]">{event.matches} matches</span>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-[var(--text-primary)] mb-3 line-clamp-1 group-hover:text-[var(--accent)] transition-colors">
                    {event.name}
                  </h3>
                  
                  <div className="space-y-2 mt-auto">
                    <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                      <CalendarIcon className="w-4 h-4 text-[var(--text-muted)]" />
                      {new Date(event.date).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                      <MapPin className="w-4 h-4 text-[var(--text-muted)]" />
                      {event.location}
                    </div>
                  </div>
                  
                  <div className="mt-5 pt-4 border-t border-[var(--border)] flex items-center justify-between text-sm font-semibold text-[var(--accent)]">
                    View Gallery
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
          
          {/* Add New Event Card */}
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
      </motion.div>
    </motion.div>
  );
}
