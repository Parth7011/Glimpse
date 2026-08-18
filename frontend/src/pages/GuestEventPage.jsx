import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { eventService } from '@/services/eventService';
import { ROUTES } from '@/utils/constants';
import { Button, Checkbox, Label, Skeleton } from '@/components/ui';

export default function GuestEventPage() {
  const { eventSlug } = useParams();
  const navigate = useNavigate();
  const [consent, setConsent] = useState(false);

  const { data: event, isLoading } = useQuery({
    queryKey: ['guest_event', eventSlug],
    queryFn: () => eventService.getEventBySlug(eventSlug),
    enabled: !!eventSlug
  });

  const handleStart = () => {
    if (!consent) return;
    navigate(ROUTES.GUEST_SELFIE(eventSlug));
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col max-w-lg mx-auto w-full bg-[var(--background)]">
        <Skeleton className="h-72 w-full bg-[var(--surface)]" />
        <div className="p-6 space-y-6 mt-4">
          <Skeleton className="h-8 w-3/4 bg-[var(--surface)]" />
          <Skeleton className="h-24 w-full bg-[var(--surface)] rounded-[var(--radius-lg)]" />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-[var(--background)] max-w-lg mx-auto w-full">
        <h1 className="text-xl font-semibold mb-2">Event not found</h1>
        <p className="text-[var(--text-secondary)]">Please check the link and try again.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[var(--background)] max-w-lg mx-auto w-full shadow-2xl overflow-hidden relative min-h-[100dvh]">
      <div className="flex-1 overflow-y-auto pb-32">
        {/* Cover Photo Area */}
        <div className="h-72 sm:h-80 w-full relative bg-[var(--surface-soft)]">
          {event.cover_photo_url ? (
            <img 
              src={event.cover_photo_url} 
              alt={event.name} 
              className="w-full h-full object-cover"
              onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80'; }}
            />
          ) : (
            <div className="w-full h-full bg-[var(--accent-soft)]" />
          )}
          {/* Subtle gradient so text is readable if we had text on image, but we put text below in Fotobee style */}
        </div>

        {/* Content */}
        <div className="px-6 py-8 space-y-8 bg-[var(--surface)] -mt-6 rounded-t-3xl relative z-10">
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight mb-1 text-[var(--text-primary)] text-balance">{event.name}</h1>
            <p className="text-sm text-[var(--text-secondary)] mb-6">
              {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            
            <h2 className="text-xl font-semibold mb-3 text-[var(--text-primary)]">Find every photo you're in.</h2>
            <p className="text-[var(--text-secondary)] text-balance">
              Take one selfie and we'll instantly find all your moments from this event.
            </p>
          </div>

          <div className="bg-[var(--surface-soft)] rounded-[var(--radius-lg)] p-5 border border-[var(--border)]">
            <div className="flex items-start gap-3">
              <Checkbox 
                id="consent" 
                checked={consent} 
                onCheckedChange={setConsent} 
                className="mt-1 border-[var(--border-strong)] data-[state=checked]:bg-[var(--accent)] data-[state=checked]:border-[var(--accent)]"
              />
              <div className="space-y-1.5 leading-none">
                <Label htmlFor="consent" className="text-sm font-medium leading-normal cursor-pointer text-[var(--text-primary)]">
                  I agree to use my selfie for event photo matching.
                </Label>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed flex items-center gap-1">
                  <span className="text-[var(--text-primary)]">🔒</span> Secure and private. Deleted immediately.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[var(--surface)] via-[var(--surface)] to-transparent pt-12 z-20">
        <motion.div
          whileTap={consent ? { scale: 0.98 } : {}}
        >
          <Button 
            variant="primary" 
            size="xl" 
            className="w-full text-base font-semibold shadow-lg h-14"
            disabled={!consent}
            onClick={handleStart}
          >
            Find My Photos
          </Button>
        </motion.div>
      </div>
    </div>
  );
}