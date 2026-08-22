import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { eventService } from '@/services/eventService';
import { ROUTES } from '@/utils/constants';
import { Button, Checkbox, Label, Skeleton, CursorGlow } from '@/components/ui';

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
    <div className="flex-1 flex flex-col bg-[#0C0C0C] font-kanit max-w-2xl mx-auto w-full shadow-2xl overflow-hidden relative min-h-[100dvh]">
      <CursorGlow />
      <div className="flex-1 overflow-y-auto pb-32">
        {/* Cover Photo Area */}
        <div className="aspect-video sm:h-96 w-full relative group bg-[#111111]">
          {event.cover_photo_url ? (
            <>
              <img 
                src={event.cover_photo_url} 
                alt={event.name} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0C] via-black/40 to-transparent opacity-90" />
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#1A1A1A] to-[#111111]" />
          )}
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-6 left-6 right-6 z-10"
          >
            <div className="inline-block px-4 py-1.5 bg-white/5 backdrop-blur-md rounded-full mb-4 border border-white/10 shadow-[0_0_15px_rgba(215,226,234,0.1)]">
              <span className="text-[#D7E2EA] text-[10px] font-black uppercase tracking-widest">
                {new Date(event.date || event.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tighter mb-1 text-[#D7E2EA] uppercase drop-shadow-lg leading-[0.9]">
              {event.name}
            </h1>
          </motion.div>
        </div>

        {/* Content */}
        <div className="px-6 py-8 space-y-8 bg-[#0C0C0C] relative z-10 rounded-t-[3rem] -mt-8 border-t border-white/5">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center bg-[#111111]/80 backdrop-blur-xl rounded-[3rem] p-8 shadow-2xl border border-white/5 relative overflow-hidden group hover:border-[#D7E2EA]/30 transition-colors duration-500"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50 pointer-events-none" />
            <div className="w-16 h-16 rounded-full bg-[#1A1A1A] border border-white/10 flex items-center justify-center mx-auto mb-6 shadow-inner group-hover:scale-110 group-hover:bg-[#D7E2EA] transition-all duration-500 z-10 relative">
              <span className="text-2xl group-hover:scale-110 transition-transform duration-500">📸</span>
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight mb-2 text-[#D7E2EA] relative z-10">Find your moments</h2>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#D7E2EA]/50 text-balance relative z-10">
              Take one quick selfie and our AI will instantly find all the photos you're in.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`rounded-3xl p-6 border transition-all duration-300 relative overflow-hidden ${consent ? 'bg-[#D7E2EA]/10 border-[#D7E2EA]/30 shadow-[0_0_20px_rgba(215,226,234,0.1)]' : 'bg-[#111111]/50 border-white/5 hover:border-white/20'}`}
          >
            <div className="flex items-start gap-4 relative z-10">
              <Checkbox 
                id="consent" 
                checked={consent} 
                onCheckedChange={setConsent} 
                className="mt-1 border-white/20 data-[state=checked]:bg-[#D7E2EA] data-[state=checked]:border-[#D7E2EA] data-[state=checked]:text-[#0C0C0C]"
              />
              <div className="space-y-2 leading-none">
                <Label htmlFor="consent" className="text-sm font-black uppercase tracking-wide cursor-pointer text-[#D7E2EA]">
                  I agree to use my selfie for matching.
                </Label>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#D7E2EA]/40 leading-relaxed flex items-center gap-1.5">
                  <span className="text-green-400">🔒</span> Secure & private. Deleted immediately.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Sticky Bottom Action */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0C0C0C] via-[#0C0C0C] to-transparent pt-12 z-20">
        <motion.div
          whileTap={consent ? { scale: 0.98 } : {}}
        >
          <Button 
            variant="primary" 
            size="xl" 
            className={`w-full text-base font-black uppercase tracking-widest shadow-2xl h-16 rounded-[1.5rem] transition-all duration-300 ${
              consent 
                ? 'shadow-[0_0_30px_rgba(215,226,234,0.15)] hover:shadow-[0_0_40px_rgba(215,226,234,0.3)] hover:-translate-y-1' 
                : 'opacity-50 grayscale cursor-not-allowed shadow-none'
            }`}
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