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
      <div className="bg-[#1A1A1A] rounded-3xl overflow-hidden border border-white/10 shadow-2xl hover:border-[#D7E2EA]/50 transition-all duration-500 flex flex-col h-full hover:-translate-y-1 relative">
        {/* Subtle background glow on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="aspect-[16/10] bg-[#111111] relative overflow-hidden">
          {event.cover_photo_url ? (
            <img
              src={event.cover_photo_url}
              alt={event.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80'; }}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-[#D7E2EA]/40 bg-gradient-to-br from-[#111111] to-[#1A1A1A]">
              <Camera className="w-10 h-10 mb-2 opacity-40" />
              <span className="text-[10px] font-black uppercase tracking-widest opacity-60">No Cover</span>
            </div>
          )}
          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent opacity-80" />
          
          {/* Status badge on image */}
          <div className="absolute top-4 right-4">
            <Badge variant={getStatusColor(event.status)} className="uppercase font-black tracking-widest text-[9px] shadow-[0_0_10px_rgba(0,0,0,0.5)] backdrop-blur-md px-3 py-1">
              {event.status}
            </Badge>
          </div>
        </div>
        <div className="p-6 flex flex-col flex-1 relative z-10">
          <h3 className="font-black text-[#D7E2EA] uppercase tracking-wide text-xl line-clamp-1 mb-1 group-hover:text-white transition-colors">{event.name}</h3>
          <p className="text-xs font-bold text-[#D7E2EA]/50 uppercase tracking-widest mb-6 flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
          </p>
          <div className="mt-auto flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-[#D7E2EA]/40 pt-5 border-t border-white/10">
            <span className="flex items-center gap-1.5 group-hover:text-[#D7E2EA]/70 transition-colors">
              <ImageIcon className="w-3.5 h-3.5" /> {event.photo_count.toLocaleString()} photos
            </span>
            <span className="flex items-center gap-1.5 group-hover:text-[#D7E2EA]/70 transition-colors">
              <Users className="w-3.5 h-3.5" /> {event.guest_count} guests
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
