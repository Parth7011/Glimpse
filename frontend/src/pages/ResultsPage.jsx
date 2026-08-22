import React, { useState } from 'react';
import { useParams, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { eventService } from '@/services/eventService';
import { matchingService } from '@/services/matchingService';
import { ROUTES } from '@/utils/constants';
import { Button, Skeleton } from '@/components/ui';
import { Download, X } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export default function ResultsPage() {
  const { eventSlug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const sessionId = location.state?.sessionId;

  const { data: event, isLoading: eventLoading } = useQuery({
    queryKey: ['guest_event', eventSlug],
    queryFn: () => eventService.getEventBySlug(eventSlug),
    enabled: !!eventSlug
  });

  const { data: matchesData, isLoading: matchesLoading } = useQuery({
    queryKey: ['matches', sessionId],
    queryFn: () => matchingService.getMatches(sessionId),
    enabled: !!sessionId
  });

  if (!sessionId) {
    return <Navigate to={ROUTES.GUEST_EVENT(eventSlug)} replace />;
  }

  const matches = Array.isArray(matchesData) ? matchesData : (matchesData?.matches || []);

  const handleDownloadAll = async () => {
    if (isDownloading || matches.length === 0) return;
    setIsDownloading(true);
    toast('Preparing your high-res zip file...', 'success');
    
    try {
      const zip = new JSZip();
      
      const fetchPromises = matches.map(async (match, index) => {
        const url = match.preview_url || match.thumbnail_url;
        if (!url) return;
        
        const response = await fetch(url);
        const blob = await response.blob();
        
        // Extract filename or generate one
        const filename = url.split('/').pop()?.split('?')[0] || `photo_${index + 1}.jpg`;
        zip.file(filename, blob);
      });
      
      await Promise.all(fetchPromises);
      
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `${event?.name || 'event'}_photos.zip`);
      toast('Download complete!', 'success');
    } catch (err) {
      console.error('Download error:', err);
      toast('Failed to download photos.', 'error');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadSingle = async (e, photo) => {
    e.stopPropagation();
    toast('Downloading photo...', 'success');
    
    try {
      const url = photo.preview_url || photo.thumbnail_url;
      if (!url) return;
      
      const response = await fetch(url);
      const blob = await response.blob();
      const filename = url.split('/').pop()?.split('?')[0] || 'photo.jpg';
      
      saveAs(blob, filename);
    } catch (err) {
      console.error('Download error:', err);
      toast('Failed to download photo.', 'error');
    }
  };

  if (eventLoading || matchesLoading) {
    return (
      <div className="flex-1 flex flex-col p-6 max-w-6xl mx-auto w-full pt-12 space-y-8 bg-[#0C0C0C] min-h-[100dvh]">
        <Skeleton className="h-16 w-80 bg-[#1A1A1A] rounded-2xl" />
        <Skeleton className="h-4 w-48 mb-8 bg-[#1A1A1A] rounded-full" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="aspect-[3/4] w-full rounded-[2rem] bg-[#111111]" />)}
        </div>
      </div>
    );
  }

  if (!event || !matchesData) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-[#0C0C0C] min-h-[100dvh] font-kanit">
        <h1 className="text-3xl font-black uppercase tracking-tight mb-2 text-[#D7E2EA]">Something went wrong</h1>
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#D7E2EA]/50">We couldn't load your gallery.</p>
      </div>
    );
  }



  return (
    <div className="flex-1 flex flex-col bg-[#0C0C0C] relative min-h-[100dvh] font-kanit">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#0C0C0C]/80 backdrop-blur-xl border-b border-white/5 px-6 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-[#D7E2EA] leading-tight flex items-center gap-3">
            <span className="text-2xl drop-shadow-[0_0_10px_rgba(215,226,234,0.3)]">✨</span> We found {matches.length} photos
          </h1>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#D7E2EA]/50 mt-1">{event.name}</p>
        </div>
        <Button variant="primary" className="hidden sm:flex shadow-[0_0_20px_rgba(215,226,234,0.15)] h-12 px-8" onClick={handleDownloadAll}>
          Download All
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 pb-32">
        {matches.length === 0 ? (
          <div className="text-center py-32 bg-[#111111]/80 backdrop-blur-xl border border-white/5 rounded-[3rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50 pointer-events-none" />
            <h2 className="text-3xl font-black uppercase tracking-tight mb-4 text-[#D7E2EA] relative z-10">No photos found</h2>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#D7E2EA]/50 mb-10 max-w-sm mx-auto relative z-10">
              We couldn't find any photos of you in this event yet. Check back later if the photographer is still uploading.
            </p>
            <Link to={ROUTES.GUEST_EVENT(eventSlug)} className="relative z-10">
              <Button variant="primary" className="h-14 px-8">Take another selfie</Button>
            </Link>
          </div>
        ) : (
            <motion.div 
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
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
                  className="aspect-[3/4] relative rounded-[2rem] overflow-hidden bg-[#1A1A1A] cursor-pointer group shadow-lg hover:shadow-[0_0_30px_rgba(215,226,234,0.15)] transition-all duration-500 border border-white/5 hover:border-[#D7E2EA]/30"
                  onClick={() => setSelectedPhoto(match)}
                >
                  <img 
                    src={match.preview_url || match.photo?.preview_url || `https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=80&random=${i}`} 
                    alt="Gallery" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                  />
                  {/* Minimal gradient for the icon only */}
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0C0C0C]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <button 
                    onClick={(e) => handleDownloadSingle(e, match)}
                    className="absolute bottom-4 right-4 w-12 h-12 rounded-[1.2rem] bg-white/10 backdrop-blur-xl border border-white/20 text-[#D7E2EA] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl hover:scale-110 active:scale-95 hover:bg-white/20 hover:text-white"
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
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0C0C0C] via-[#0C0C0C]/90 to-transparent pt-12 sm:hidden z-20">
          <Button variant="primary" className="w-full shadow-2xl h-16 rounded-[1.5rem]" onClick={handleDownloadAll}>
            Download All Photos
          </Button>
        </div>
      )}

      {/* Lightbox - Premium Dark theme */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#0C0C0C]/95 backdrop-blur-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <button 
                onClick={() => setSelectedPhoto(null)}
                className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#D7E2EA] hover:bg-white/10 hover:text-white transition-all shadow-inner"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-4">
                <button 
                  onClick={(e) => handleDownloadSingle(e, selectedPhoto)}
                  className="flex items-center gap-3 bg-[#D7E2EA] text-[#0C0C0C] px-6 py-3 rounded-[1rem] font-black uppercase tracking-widest text-[10px] hover:bg-white transition-all shadow-[0_0_20px_rgba(215,226,234,0.3)] hover:shadow-[0_0_30px_rgba(215,226,234,0.5)] hover:-translate-y-0.5"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Download</span>
                </button>
              </div>
            </div>
            
            <div className="flex-1 flex items-center justify-center p-6 sm:p-10 min-h-0 relative">
              <div className="absolute inset-0 bg-gradient-to-b from-[#111111]/20 to-transparent pointer-events-none" />
              <motion.img 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                src={selectedPhoto.preview_url || `https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=80&random=${selectedPhoto.id}`} 
                alt="Selected" 
                className="max-w-full max-h-full object-contain rounded-xl shadow-2xl relative z-10"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}