import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { eventService } from '@/services/eventService';
import { photoService } from '@/services/photoService';
import { ROUTES } from '@/utils/constants';
import { Button, Badge, Skeleton } from '@/components/ui';
import { ArrowLeft, ImagePlus, Share2, Users, Camera } from 'lucide-react';

export default function EventWorkspacePage() {
  const { eventId } = useParams();

  const { data: event, isLoading: eventLoading } = useQuery({
    queryKey: ['event', eventId],
    queryFn: () => eventService.getEvent(eventId),
    enabled: !!eventId,
    refetchInterval: (query) => {
      return query.state?.data?.status === 'processing' ? 3000 : false;
    }
  });

  const { data: photosData, isLoading: photosLoading } = useQuery({
    queryKey: ['event_photos', eventId],
    queryFn: () => photoService.listPhotos(eventId),
    enabled: !!eventId,
    refetchInterval: (query) => {
      return event?.status === 'processing' ? 3000 : false;
    }
  });

  if (eventLoading) {
    return (
      <div className="space-y-12 max-w-7xl mx-auto relative z-10 pt-8">
        <Skeleton className="h-6 w-48 mb-8 bg-[#1A1A1A]" />
        <Skeleton className="h-80 w-full rounded-[3rem] bg-[#111111]" />
        <div className="grid grid-cols-3 gap-6">
          <Skeleton className="h-72 w-full rounded-[2rem] bg-[#1A1A1A]" />
          <Skeleton className="h-72 w-full rounded-[2rem] bg-[#1A1A1A]" />
          <Skeleton className="h-72 w-full rounded-[2rem] bg-[#1A1A1A]" />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-32 max-w-7xl mx-auto relative z-10 font-kanit">
        <h2 className="text-4xl font-black uppercase tracking-tight text-[#D7E2EA] mb-4 drop-shadow-lg">Event not found</h2>
        <Link to={ROUTES.DASHBOARD}>
          <Button variant="ghost">Return to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const photos = photosData?.photos || [];

  return (
    <div className="space-y-12 animate-in fade-in duration-500 max-w-7xl mx-auto pb-16 relative z-10 font-kanit">
      {/* Hero Cover Section */}
      <div className="relative h-72 md:h-96 w-full rounded-[3rem] overflow-hidden shadow-[0_0_50px_rgba(215,226,234,0.1)] border border-white/5 mb-12 group">
        {event.cover_photo_url ? (
          <img 
            src={event.cover_photo_url} 
            alt="Event Cover" 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#111111] to-[#1A1A1A] flex items-center justify-center">
            <Camera className="w-20 h-20 text-[#D7E2EA] opacity-10" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0C] via-[#0C0C0C]/40 to-transparent" />
        
        <div className="absolute top-8 left-8 z-10">
          <Link to={ROUTES.DASHBOARD} className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-[#D7E2EA]/70 hover:text-white bg-black/40 hover:bg-black/60 backdrop-blur-md px-4 py-2 rounded-full transition-all hover:scale-105 border border-white/10">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Events
          </Link>
        </div>

        <div className="absolute bottom-8 left-8 right-8 z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="flex flex-wrap items-center gap-4 mb-3">
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-[#D7E2EA] uppercase drop-shadow-[0_0_20px_rgba(215,226,234,0.3)]">{event.name}</h1>
              <Badge variant={event.status === 'ready' ? 'success' : event.status === 'processing' ? 'warning' : 'neutral'}>
                {event.status}
              </Badge>
            </div>
            <p className="text-sm font-bold uppercase tracking-widest text-[#D7E2EA]/70 flex items-center gap-2">
              {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link to={ROUTES.EVENT_SHARE(event.id)}>
              <Button variant="secondary"><Share2 className="w-4 h-4" /> Share</Button>
            </Link>
            <Link to={ROUTES.EVENT_UPLOAD(event.id)}>
              <Button variant="primary"><ImagePlus className="w-4 h-4" /> Upload</Button>
            </Link>
          </div>
        </div>
      </div>


      {/* Stats Overview */}
      <div className="flex flex-col md:flex-row gap-6 border-b border-white/5 pb-10">
        <div className="flex-1 bg-[#1A1A1A] p-8 rounded-3xl border border-white/10 shadow-2xl flex items-center justify-between relative overflow-hidden group hover:border-[#D7E2EA]/50 transition-all hover:-translate-y-1">
           <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
           <div className="relative z-10">
             <p className="text-[10px] font-black text-[#D7E2EA]/50 mb-2 uppercase tracking-widest">Total Photos</p>
             <p className="text-5xl font-black tracking-tighter text-[#D7E2EA] drop-shadow-[0_0_15px_rgba(215,226,234,0.2)]">{event.photo_count.toLocaleString()}</p>
           </div>
           <Camera className="w-16 h-16 text-[#D7E2EA]/5 absolute right-4 top-1/2 -translate-y-1/2" />
        </div>
        <div className="flex-1 bg-[#1A1A1A] p-8 rounded-3xl border border-white/10 shadow-2xl flex items-center justify-between relative overflow-hidden group hover:border-[#D7E2EA]/50 transition-all hover:-translate-y-1">
           <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
           <div className="relative z-10">
             <p className="text-[10px] font-black text-[#D7E2EA]/50 mb-2 uppercase tracking-widest">Guests Matched</p>
             <p className="text-5xl font-black tracking-tighter text-[#D7E2EA] drop-shadow-[0_0_15px_rgba(215,226,234,0.2)]">{event.guest_count.toLocaleString()}</p>
           </div>
           <Users className="w-16 h-16 text-[#D7E2EA]/5 absolute right-4 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Photo Grid */}
      <div>
        <h2 className="text-3xl font-black uppercase tracking-tight mb-8 text-[#D7E2EA]">Gallery</h2>
        
        {photosLoading ? (
           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
             {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="aspect-[4/3] w-full rounded-2xl bg-[#1A1A1A]" />)}
           </div>
        ) : photos.length === 0 ? (
          <div className="text-center py-32 bg-[#111111]/50 backdrop-blur-xl border border-white/5 border-dashed rounded-[3rem] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#D7E2EA]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="w-24 h-24 rounded-full bg-[#1A1A1A] border border-white/10 flex items-center justify-center mx-auto mb-6 shadow-2xl relative z-10">
              <ImagePlus className="w-10 h-10 text-[#D7E2EA]/50" />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tight mb-2 text-[#D7E2EA] relative z-10">No photos yet</h3>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#D7E2EA]/40 mb-10 max-w-md mx-auto relative z-10">Upload event photos to automatically detect faces and allow guests to find themselves.</p>
            <Link to={ROUTES.EVENT_UPLOAD(event.id)} className="relative z-10 inline-block">
              <Button variant="primary">Upload Photos</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {photos.map(photo => (
              <div key={photo.id} className="aspect-[4/3] rounded-3xl overflow-hidden bg-[#1A1A1A] group relative border border-white/10 shadow-2xl hover:shadow-[0_0_30px_rgba(215,226,234,0.15)] hover:border-[#D7E2EA]/50 transition-all duration-500 hover:-translate-y-2">
                <img 
                  src={photo.preview_url || `https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&q=80&random=${photo.id}`} 
                  alt={photo.filename} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0C] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-5">
                  <p className="text-[#D7E2EA] text-[10px] font-black uppercase tracking-widest truncate drop-shadow-lg">{photo.filename}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}