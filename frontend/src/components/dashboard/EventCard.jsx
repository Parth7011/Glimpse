import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Image as ImageIcon, Users, Camera, MoreHorizontal, Edit2, ImageIcon as ImageIcon2, Trash2 } from 'lucide-react';
import { ROUTES } from '@/utils/constants';
import { Badge } from '@/components/ui';

export function EventCard({ event, onEdit, onChangeCover, onDelete }) {
  const [showMenu, setShowMenu] = useState(false);
  
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
          <div className="absolute top-4 left-4 z-20">
            <Badge variant={getStatusColor(event.status)} className="uppercase font-black tracking-widest text-[9px] shadow-[0_0_10px_rgba(0,0,0,0.5)] backdrop-blur-md px-3 py-1">
              {event.status}
            </Badge>
          </div>
          
          {/* Action Menu Button */}
          <div className="absolute top-4 right-4 z-20">
            <div className="relative">
              <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowMenu(!showMenu); }}
                className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-white hover:bg-black/70 transition-colors border border-white/10"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
              
              {/* Invisible overlay to close menu on click outside */}
              {showMenu && (
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowMenu(false); }}
                />
              )}
              
              {/* Dropdown Menu */}
              <div 
                className={`absolute right-0 mt-2 w-48 bg-[#1A1A1A] border border-white/10 rounded-xl shadow-2xl overflow-hidden transition-all duration-200 origin-top-right z-50 ${showMenu ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
              >
                <button 
                  onClick={() => { setShowMenu(false); onEdit(event); }}
                  className="w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-widest text-white/70 hover:text-white hover:bg-white/5 flex items-center gap-3 transition-colors"
                >
                  <Edit2 className="w-4 h-4" /> Edit Details
                </button>
                <button 
                  onClick={() => { setShowMenu(false); onChangeCover(event); }}
                  className="w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-widest text-white/70 hover:text-white hover:bg-white/5 flex items-center gap-3 transition-colors border-t border-white/5"
                >
                  <ImageIcon2 className="w-4 h-4" /> Change Cover
                </button>
                <button 
                  onClick={() => { setShowMenu(false); onDelete(event); }}
                  className="w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-widest text-red-400 hover:text-red-300 hover:bg-red-500/10 flex items-center gap-3 transition-colors border-t border-white/5"
                >
                  <Trash2 className="w-4 h-4" /> Delete Event
                </button>
              </div>
            </div>
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
