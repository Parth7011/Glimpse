import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { eventService } from '@/services/eventService';
import { ROUTES } from '@/utils/constants';
import { Button, Card, Badge, Skeleton } from '@/components/ui';
import { Camera, ImageIcon, Users, Plus, Calendar, ArrowRight } from 'lucide-react';

import { StatCard, EventCard } from '@/components/dashboard';
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

export default function DashboardPage() {
  const [userName, setUserName] = useState('Photographer');

  useEffect(() => {
    try {
      const userStr = localStorage.getItem('glimpse_user');
      if (userStr) {
        const user = JSON.parse(userStr);
        // Supabase stores the name in user_metadata, not directly on the user object
        const name = user.user_metadata?.name || user.name || user.email?.split('@')[0];
        if (name) {
          setUserName(name);
        }
      }
    } catch (e) {
      console.error('Failed to parse user from local storage');
    }
  }, []);

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
            {getGreeting()}, {userName}
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
