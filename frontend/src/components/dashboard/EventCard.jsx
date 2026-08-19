import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Image as ImageIcon, Users, Camera } from 'lucide-react';
import { ROUTES } from '@/utils/constants';
import { Badge } from '@/components/ui';

export function EventCard({ event }) {
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
