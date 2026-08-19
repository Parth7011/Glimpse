import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { eventService } from '@/services/eventService';
import { matchingService } from '@/services/matchingService';
import { ROUTES } from '@/utils/constants';
import { Button, Skeleton } from '@/components/ui';
import { Download, X } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

export default function ResultsPage() {
  const { eventSlug } = useParams();
  const { addToast } = useToast();
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const { data: event, isLoading: eventLoading } = useQuery({
    queryKey: ['guest_event', eventSlug],
    queryFn: () => eventService.getEventBySlug(eventSlug),
    enabled: !!eventSlug
  });

  const { data: matchesData, isLoading: matchesLoading } = useQuery({
    queryKey: ['matches', eventSlug],
    queryFn: () => matchingService.getGuestMatches('mock-session'),
    enabled: !!eventSlug
  });

  const handleDownloadAll = () => {
    addToast('Preparing your high-res zip file...', 'success');
  };

  const handleDownloadSingle = (e, photo) => {
    e.stopPropagation();
    addToast('Downloading photo...', 'success');
  };

  if (eventLoading || matchesLoading) {
    return (
      <div className="flex-1 flex flex-col p-6 max-w-6xl mx-auto w-full pt-12 space-y-8 bg-[var(--background)] min-h-[100dvh]">
        <Skeleton className="h-12 w-64 bg-[var(--surface)]" />
        <Skeleton className="h-4 w-48 mb-8 bg-[var(--surface)]" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="aspect-[3/4] w-full rounded-[var(--radius-lg)] bg-[var(--surface)]" />)}
        </div>
      </div>
    );
  }

  if (!event || !matchesData) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-[var(--background)] min-h-[100dvh]">
        <h1 className="text-2xl font-semibold mb-2 text-[var(--text-primary)]">Something went wrong</h1>
        <p className="text-[var(--text-secondary)]">We couldn't load your gallery.</p>
      </div>
    );
  }

  const matches = matchesData.matches || [];

  return (
    <div className="flex-1 flex flex-col bg-[var(--background)] relative min-h-[100dvh]">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[var(--background)]/80 backdrop-blur-md border-b border-[var(--border)] px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-[var(--text-primary)] leading-tight flex items-center gap-2">
            <span className="text-xl">✨</span> We found {matches.length} photos
          </h1>
          <p className="text-sm text-[var(--text-secondary)] font-medium mt-0.5">{event.name}</p>
        </div>
        <Button variant="primary" size="sm" className="hidden sm:flex shadow-sm" onClick={handleDownloadAll}>
          Download All
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-6 pb-28">
        {matches.length === 0 ? (
          <div className="text-center py-24 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-xl)]">
            <h2 className="text-xl font-semibold mb-2 text-[var(--text-primary)]">No photos found</h2>
            <p className="text-[var(--text-secondary)] mb-6 max-w-sm mx-auto">
              We couldn't find any photos of you in this event yet. Check back later if the photographer is still uploading.
            </p>
            <Link to={ROUTES.GUEST_EVENT(eventSlug)}>
              <Button variant="primary" className="shadow-sm">Take another selfie</Button>
            </Link>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6"
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
          >
            {matches.map((match, i) => (
              <motion.div 
                key={match.id}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } }
                }}
                className="aspect-[3/4] relative rounded-[var(--radius-lg)] overflow-hidden bg-[var(--surface-soft)] cursor-pointer group shadow-sm hover:shadow-md transition-shadow"
                onClick={() => setSelectedPhoto(match.photo)}
              >
                <img 
                  src={match.photo.preview_url || `https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=80&random=${i}`} 
                  alt="Gallery" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                />
                {/* Minimal gradient for the icon only */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <button 
                  onClick={(e) => handleDownloadSingle(e, match.photo)}
                  className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md text-[var(--text-primary)] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-sm hover:scale-110 active:scale-95"
                >
                  <Download className="w-5 h-5" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>

      {/* Mobile sticky action */}
      {matches.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/90 to-transparent pt-12 sm:hidden z-20">
          <Button variant="primary" className="w-full shadow-lg h-14 text-base font-semibold" onClick={handleDownloadAll}>
            Download All Photos
          </Button>
        </div>
      )}

      {/* Lightbox - Clean White/Light theme */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[var(--surface)]/95 backdrop-blur-xl flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-[var(--border)]/50">
              <button 
                onClick={() => setSelectedPhoto(null)}
                className="w-10 h-10 rounded-full bg-[var(--surface-soft)] flex items-center justify-center text-[var(--text-primary)] hover:bg-[var(--border)] transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-3">
                <button 
                  onClick={(e) => handleDownloadSingle(e, selectedPhoto)}
                  className="flex items-center gap-2 bg-[var(--text-primary)] text-[var(--surface)] px-4 py-2 rounded-full font-medium text-sm hover:bg-black transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Download</span>
                </button>
              </div>
            </div>
            
            <div className="flex-1 flex items-center justify-center p-4 sm:p-8 min-h-0">
              <motion.img 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                src={selectedPhoto.preview_url || `https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=80&random=${selectedPhoto.id}`} 
                alt="Selected" 
                className="max-w-full max-h-full object-contain rounded-xl shadow-[var(--shadow-photo)]"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}