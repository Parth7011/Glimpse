import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { eventService } from '@/services/eventService';
import { ROUTES } from '@/utils/constants';
import { Button, Card, Badge, Skeleton } from '@/components/ui';
import { Camera, ImageIcon, Users, Plus, Calendar, ArrowRight } from 'lucide-react';

// Animated counter hook
function useCountUp(end, duration = 1500) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (end == null || hasAnimated.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const startTime = performance.now();
          const numEnd = typeof end === 'string' ? parseInt(end.replace(/,/g, ''), 10) : end;

          const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * numEnd));
            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(numEnd);
            }
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return { count, ref };
}

// Get time-based greeting
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

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

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: () => eventService.getDashboardStats()
  });

  const { data: eventsData, isLoading: eventsLoading } = useQuery({
    queryKey: ['events'],
    queryFn: () => eventService.listEvents()
  });

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-10 max-w-6xl mx-auto"
    >
      {/* Greeting Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
            {getGreeting()}, Arjun
          </h1>
          <p className="text-[var(--text-secondary)] mt-1.5 text-lg">Manage your events and photo delivery.</p>
        </div>
        <Link to={ROUTES.EVENTS_NEW}>
          <Button variant="primary" className="shadow-md gap-2 h-11 px-6">
            <Plus className="w-4 h-4" /> Create Event
          </Button>
        </Link>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {statsLoading ? (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-[var(--radius-xl)] bg-[var(--surface)]" />)
        ) : (
          <>
            <StatCard
              label="Events"
              value={stats?.total_events}
              icon={<Calendar className="w-5 h-5" />}
              accent="var(--accent)"
              accentSoft="var(--accent-soft)"
            />
            <StatCard
              label="Photos"
              value={stats?.total_photos}
              icon={<ImageIcon className="w-5 h-5" />}
              accent="var(--success)"
              accentSoft="var(--success-soft)"
            />
            <StatCard
              label="Guests Matched"
              value={stats?.total_guests_matched}
              icon={<Users className="w-5 h-5" />}
              accent="#7C6EF6"
              accentSoft="#EEECFF"
            />
          </>
        )}
      </motion.div>

      {/* Recent Events */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold tracking-tight text-[var(--text-primary)]">Recent Events</h2>
          <span className="text-sm font-medium text-[var(--text-secondary)]">
            {eventsData?.events?.length || 0} total
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {eventsLoading ? (
            Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-72 w-full rounded-[var(--radius-xl)] bg-[var(--surface)]" />)
          ) : eventsData?.events?.length === 0 ? (
            <div className="col-span-full py-20 text-center border border-[var(--border)] border-dashed rounded-[var(--radius-xl)] bg-[var(--surface)]">
              <div className="w-16 h-16 rounded-full bg-[var(--accent-soft)] flex items-center justify-center mx-auto mb-5">
                <Camera className="w-7 h-7 text-[var(--accent)]" />
              </div>
              <p className="text-lg font-medium text-[var(--text-primary)] mb-2">No events yet</p>
              <p className="text-[var(--text-secondary)] mb-6">Create your first event to start uploading photos.</p>
              <Link to={ROUTES.EVENTS_NEW}>
                <Button variant="primary" className="shadow-sm gap-2">
                  <Plus className="w-4 h-4" /> Create your first event
                </Button>
              </Link>
            </div>
          ) : (
            eventsData?.events?.map((event, index) => (
              <motion.div
                key={event.id}
                variants={itemVariants}
              >
                <EventCard event={event} />
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function StatCard({ label, value, icon, accent, accentSoft }) {
  const { count, ref } = useCountUp(value);

  return (
    <div
      ref={ref}
      className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-xl)] p-6 flex items-center gap-5 shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      <div
        className="w-12 h-12 rounded-[var(--radius-lg)] flex items-center justify-center shrink-0"
        style={{ backgroundColor: accentSoft, color: accent }}
      >
        {icon}
      </div>
      <div>
        <span className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wide block mb-1">{label}</span>
        <span className="text-3xl font-bold text-[var(--text-primary)] tabular-nums">
          {value != null ? count.toLocaleString() : '—'}
        </span>
      </div>
    </div>
  );
}

function EventCard({ event }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'ready': return 'success';
      case 'processing': return 'warning';
      default: return 'neutral';
    }
  };

  return (
    <Link to={ROUTES.EVENT(event.id)} className="block group">
      <div className="bg-[var(--surface)] rounded-[var(--radius-xl)] overflow-hidden border border-[var(--border)] shadow-sm hover:shadow-lg hover:border-[var(--border-strong)] transition-all duration-300 flex flex-col h-full">
        <div className="aspect-[16/10] bg-[var(--surface-soft)] relative overflow-hidden">
          {event.cover_photo_url ? (
            <img
              src={event.cover_photo_url}
              alt={event.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80'; }}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-[var(--text-muted)] bg-gradient-to-br from-[var(--surface-soft)] to-[var(--border)]">
              <Camera className="w-10 h-10 mb-2 opacity-40" />
              <span className="text-sm font-medium opacity-60">No Cover</span>
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
          {/* Status badge on image */}
          <div className="absolute top-3 right-3">
            <Badge variant={getStatusColor(event.status)} className="capitalize font-medium shadow-sm backdrop-blur-sm">
              {event.status}
            </Badge>
          </div>
        </div>
        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-semibold text-[var(--text-primary)] text-lg line-clamp-1 mb-1 group-hover:text-[var(--accent)] transition-colors">{event.name}</h3>
          <p className="text-sm text-[var(--text-secondary)] mb-5 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
          </p>
          <div className="mt-auto flex items-center justify-between text-sm text-[var(--text-secondary)] pt-4 border-t border-[var(--border)]/50">
            <span className="flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5" /> {event.photo_count.toLocaleString()} photos
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" /> {event.guest_count} guests
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}