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
        <div className="h-80 sm:h-96 w-full relative group">
          {event.cover_photo_url ? (
            <>
              <img 
                src={event.cover_photo_url} 
                alt={event.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-[#F7F7F5]" />
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#7C6EF6] to-[#5A4ED1]" />
          )}
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-6 left-6 right-6 z-10"
          >
            <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full mb-3 border border-white/30">
              <span className="text-white text-xs font-semibold uppercase tracking-wider shadow-sm">
                {new Date(event.date || event.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-1 text-[var(--text-primary)] leading-tight text-balance">
              {event.name}
            </h1>
          </motion.div>
        </div>

        {/* Content */}
        <div className="px-6 py-8 space-y-8 bg-[var(--background)] relative z-10 rounded-t-3xl -mt-6">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center bg-white rounded-3xl p-6 shadow-xl shadow-[#7C6EF6]/5 border border-[#7C6EF6]/10"
          >
            <div className="w-14 h-14 rounded-full bg-[#EEECFF] flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📸</span>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-[var(--text-primary)]">Find your moments</h2>
            <p className="text-[var(--text-secondary)] text-balance">
              Take one quick selfie and our AI will instantly find all the photos you're in.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`rounded-2xl p-5 border transition-colors ${consent ? 'bg-[#EEECFF] border-[#7C6EF6]/30' : 'bg-white border-[var(--border)]'}`}
          >
            <div className="flex items-start gap-3">
              <Checkbox 
                id="consent" 
                checked={consent} 
                onCheckedChange={setConsent} 
                className="mt-1 border-[var(--border-strong)] data-[state=checked]:bg-[#7C6EF6] data-[state=checked]:border-[#7C6EF6]"
              />
              <div className="space-y-1.5 leading-none">
                <Label htmlFor="consent" className="text-sm font-semibold leading-normal cursor-pointer text-[var(--text-primary)]">
                  I agree to use my selfie for matching.
                </Label>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed flex items-center gap-1">
                  <span className="text-green-500">🔒</span> Secure & private. Deleted immediately.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Sticky Bottom Action */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[var(--background)] via-[var(--background)] to-transparent pt-12 z-20">
        <motion.div
          whileTap={consent ? { scale: 0.98 } : {}}
        >
          <Button 
            variant="primary" 
            size="xl" 
            className={`w-full text-lg font-bold shadow-2xl h-14 rounded-2xl transition-all ${
              consent 
                ? 'bg-gradient-to-r from-[#7C6EF6] to-[#5A4ED1] text-white hover:shadow-[#7C6EF6]/40 hover:-translate-y-0.5' 
                : 'bg-gray-200 text-gray-400 shadow-none'
            }`}
            disabled={!consent}
            style={{ backgroundColor: consent ? '' : '' }}
            onClick={handleStart}
          >
            Find My Photos
          </Button>
        </motion.div>
      </div>
    </div>
  );
}