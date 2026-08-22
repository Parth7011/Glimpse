import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { eventService } from '@/services/eventService';
import { ROUTES } from '@/utils/constants';
import { Button, Card, Badge, Skeleton } from '@/components/ui';
import { Camera, ImageIcon, Users, Plus, Calendar, ArrowRight } from 'lucide-react';
import { CursorGlow } from '@/components/ui';

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
    queryFn: () => eventService.listEvents(),
    refetchInterval: (query) => {
      const isProcessing = query.state?.data?.events?.some(e => e.status === 'processing');
      return isProcessing ? 3000 : false;
    }
  });

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-12 max-w-7xl mx-auto relative z-10"
    >
      <CursorGlow />

      {/* Greeting Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-white/5">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#D7E2EA] uppercase drop-shadow-lg">
            {getGreeting()}, <span className="text-white">{userName}</span>
          </h1>
          <p className="text-[#D7E2EA]/50 mt-2 text-sm font-bold uppercase tracking-widest">Manage your events and photo delivery.</p>
        </div>
        <Link to={ROUTES.EVENTS_NEW}>
          <button className="group relative h-12 px-8 bg-[#D7E2EA] hover:bg-white text-[#0C0C0C] font-black uppercase tracking-widest rounded-2xl overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center shadow-[0_0_30px_rgba(215,226,234,0.15)] gap-3">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            <Plus className="w-4 h-4 relative z-10" />
            <span className="relative z-10">Create Event</span>
          </button>
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
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black uppercase tracking-tight text-[#D7E2EA]">Recent Events</h2>
          <span className="text-xs font-black uppercase tracking-widest text-[#D7E2EA]/50 bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
            {eventsData?.events?.length || 0} total
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {eventsLoading ? (
            Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-72 w-full rounded-[var(--radius-xl)] bg-[var(--surface)]" />)
          ) : eventsData?.events?.length === 0 ? (
            <div className="col-span-full py-24 text-center border border-white/5 border-dashed rounded-3xl bg-[#111111]/50 backdrop-blur-sm relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#D7E2EA]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="w-20 h-20 rounded-full bg-[#1A1A1A] border border-white/10 flex items-center justify-center mx-auto mb-6 shadow-2xl relative z-10">
                <Camera className="w-8 h-8 text-[#D7E2EA]/50" />
              </div>
              <p className="text-2xl font-black uppercase tracking-tight text-[#D7E2EA] mb-2 relative z-10">No events yet</p>
              <p className="text-[10px] font-bold text-[#D7E2EA]/40 uppercase tracking-widest mb-8 relative z-10">Create your first event to start uploading photos.</p>
              <Link to={ROUTES.EVENTS_NEW} className="relative z-10">
                <button className="group relative h-12 px-8 bg-[#D7E2EA] hover:bg-white text-[#0C0C0C] font-black uppercase tracking-widest rounded-2xl overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] inline-flex items-center justify-center shadow-[0_0_30px_rgba(215,226,234,0.15)] gap-3">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                  <Plus className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">Create your first event</span>
                </button>
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
