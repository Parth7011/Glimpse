import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { eventService } from '@/services/eventService';
import { ROUTES } from '@/utils/constants';
import { Button, Card, Badge, Skeleton } from '@/components/ui';

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
    <div className="space-y-10 animate-in fade-in duration-500 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">Dashboard</h1>
          <p className="text-[var(--text-secondary)] mt-1">Manage your events and photo delivery.</p>
        </div>
        <Link to={ROUTES.EVENTS_NEW}>
          <Button variant="primary" className="shadow-sm">Create Event</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {statsLoading ? (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28 w-full rounded-[var(--radius-lg)] bg-[var(--surface)]" />)
        ) : (
          <>
            <StatCard label="Events" value={stats?.total_events} />
            <StatCard label="Photos" value={stats?.total_photos?.toLocaleString()} />
            <StatCard label="Guests" value={stats?.total_guests_matched} />
          </>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold tracking-tight text-[var(--text-primary)] mb-6">Recent Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {eventsLoading ? (
            Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-64 w-full rounded-[var(--radius-xl)] bg-[var(--surface)]" />)
          ) : eventsData?.events?.length === 0 ? (
            <div className="col-span-full py-16 text-center border border-[var(--border)] border-dashed rounded-[var(--radius-xl)] bg-[var(--surface)]">
              <p className="text-[var(--text-secondary)] mb-4">You haven't created any events yet.</p>
              <Link to={ROUTES.EVENTS_NEW}>
                <Button variant="primary">Create your first event</Button>
              </Link>
            </div>
          ) : (
            eventsData?.events?.map(event => (
              <EventCard key={event.id} event={event} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-xl)] p-6 flex flex-col justify-center shadow-sm">
      <span className="text-sm font-medium text-[var(--text-secondary)] mb-2 uppercase tracking-wide">{label}</span>
      <span className="text-3xl font-bold text-[var(--text-primary)]">{value}</span>
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
      <div className="bg-[var(--surface)] rounded-[var(--radius-xl)] overflow-hidden border border-[var(--border)] shadow-sm hover:shadow-md hover:border-[var(--border-strong)] transition-all duration-300 flex flex-col h-full">
        <div className="aspect-[4/3] bg-[var(--surface-soft)] relative overflow-hidden">
          {event.cover_photo_url ? (
            <img 
              src={event.cover_photo_url} 
              alt={event.name} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80'; }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-[var(--text-muted)]">
              No Cover
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
        </div>
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-[var(--text-primary)] text-lg line-clamp-1">{event.name}</h3>
            <Badge variant={getStatusColor(event.status)} className="capitalize shrink-0 font-medium">
              {event.status}
            </Badge>
          </div>
          <p className="text-sm text-[var(--text-secondary)] mb-5">
            {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
          </p>
          <div className="mt-auto flex items-center justify-between text-sm text-[var(--text-secondary)] pt-4 border-t border-[var(--border)]/50">
            <span>{event.photo_count.toLocaleString()} photos</span>
            <span>{event.guest_count} guests</span>
          </div>
        </div>
      </div>
    </Link>
  );
}