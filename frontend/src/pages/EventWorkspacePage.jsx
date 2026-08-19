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
    enabled: !!eventId
  });

  const { data: photosData, isLoading: photosLoading } = useQuery({
    queryKey: ['event_photos', eventId],
    queryFn: () => photoService.listPhotos(eventId),
    enabled: !!eventId
  });

  if (eventLoading) {
    return (
      <div className="space-y-8 max-w-6xl mx-auto">
        <Skeleton className="h-6 w-48 mb-8 bg-[var(--surface)]" />
        <Skeleton className="h-72 w-full rounded-[var(--radius-xl)] bg-[var(--surface)]" />
        <div className="grid grid-cols-3 gap-6">
          <Skeleton className="h-64 w-full bg-[var(--surface)]" />
          <Skeleton className="h-64 w-full bg-[var(--surface)]" />
          <Skeleton className="h-64 w-full bg-[var(--surface)]" />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-24 max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-3">Event not found</h2>
        <Link to={ROUTES.DASHBOARD}>
          <Button variant="ghost">Return to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const photos = photosData?.photos || [];

  return (
    <div className="space-y-10 animate-in fade-in duration-300 max-w-6xl mx-auto pb-12">
      {/* Hero Cover Section */}
      <div className="relative h-64 md:h-80 w-full rounded-[var(--radius-2xl)] overflow-hidden border border-[var(--border)] shadow-sm mb-8">
        {event.cover_photo_url ? (
          <img 
            src={event.cover_photo_url} 
            alt="Event Cover" 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[var(--surface-soft)] to-[var(--border)] flex items-center justify-center">
            <Camera className="w-12 h-12 text-[var(--text-muted)] opacity-40" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        <div className="absolute top-6 left-6 z-10">
          <Link to={ROUTES.DASHBOARD} className="inline-flex items-center text-sm font-medium text-white/80 hover:text-white bg-black/20 hover:bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full transition-all">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Events
          </Link>
        </div>

        <div className="absolute bottom-6 left-6 right-6 z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white drop-shadow-md">{event.name}</h1>
              <Badge variant={event.status === 'ready' ? 'success' : event.status === 'processing' ? 'warning' : 'neutral'} className="capitalize font-medium shadow-sm border-0 backdrop-blur-md">
                {event.status}
              </Badge>
            </div>
            <p className="text-lg text-white/90 font-medium drop-shadow-sm flex items-center gap-2">
              {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link to={ROUTES.EVENT_SHARE(event.id)}>
              <Button variant="secondary" className="gap-2 shadow-xl h-11 px-6 bg-white hover:bg-[var(--surface-soft)] border-0 text-[var(--text-primary)]">
                <Share2 className="w-4 h-4" /> Share Event
              </Button>
            </Link>
            <Link to={ROUTES.EVENT_UPLOAD(event.id)}>
              <Button variant="primary" className="gap-2 shadow-xl h-11 px-6 border border-white/20">
                <ImagePlus className="w-4 h-4" /> Upload Photos
              </Button>
            </Link>
          </div>
        </div>
      </div>


      {/* Stats Overview */}
      <div className="flex flex-col md:flex-row gap-6 border-b border-[var(--border)] pb-8">
        <div className="flex-1 bg-[var(--surface)] p-6 rounded-[var(--radius-xl)] border border-[var(--border)] shadow-sm flex items-center justify-between">
           <div>
             <p className="text-sm font-medium text-[var(--text-secondary)] mb-1 uppercase tracking-wide">Total Photos</p>
             <p className="text-3xl font-bold text-[var(--text-primary)]">{event.photo_count.toLocaleString()}</p>
           </div>
        </div>
        <div className="flex-1 bg-[var(--surface)] p-6 rounded-[var(--radius-xl)] border border-[var(--border)] shadow-sm flex items-center justify-between">
           <div>
             <p className="text-sm font-medium text-[var(--text-secondary)] mb-1 uppercase tracking-wide">Guests Matched</p>
             <p className="text-3xl font-bold text-[var(--text-primary)]">{event.guest_count.toLocaleString()}</p>
           </div>
           <Users className="w-8 h-8 text-[var(--text-muted)] opacity-50" />
        </div>
      </div>

      {/* Photo Grid */}
      <div>
        <h2 className="text-xl font-semibold tracking-tight mb-6 text-[var(--text-primary)]">Gallery</h2>
        
        {photosLoading ? (
           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
             {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="aspect-[4/3] w-full rounded-[var(--radius-lg)] bg-[var(--surface)]" />)}
           </div>
        ) : photos.length === 0 ? (
          <div className="text-center py-24 bg-[var(--surface)] border border-[var(--border)] border-dashed rounded-[var(--radius-xl)]">
            <ImagePlus className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-medium mb-2 text-[var(--text-primary)]">No photos yet</h3>
            <p className="text-[var(--text-secondary)] mb-8 max-w-md mx-auto">Upload event photos to automatically detect faces and allow guests to find themselves.</p>
            <Link to={ROUTES.EVENT_UPLOAD(event.id)}>
              <Button variant="primary" className="h-11 px-8 shadow-sm">Upload Photos</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {photos.map(photo => (
              <div key={photo.id} className="aspect-[4/3] rounded-[var(--radius-lg)] overflow-hidden bg-[var(--surface-soft)] group relative border border-[var(--border)] shadow-sm hover:shadow-md transition-shadow">
                <img 
                  src={photo.preview_url || `https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&q=80&random=${photo.id}`} 
                  alt={photo.filename} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <p className="text-white text-sm font-medium truncate drop-shadow-sm">{photo.filename}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}