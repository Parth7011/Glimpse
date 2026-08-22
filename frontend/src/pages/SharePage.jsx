import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { QRCodeSVG } from 'qrcode.react';
import { eventService } from '@/services/eventService';
import { ROUTES } from '@/utils/constants';
import { Button, Skeleton, CursorGlow } from '@/components/ui';
import { useToast } from '@/components/ui/toast';
import { ArrowLeft, Copy, Download, ExternalLink } from 'lucide-react';

export default function SharePage() {
  const { eventId } = useParams();
  const { toast } = useToast();

  const { data: event, isLoading: eventLoading } = useQuery({
    queryKey: ['event', eventId],
    queryFn: () => eventService.getEvent(eventId),
    enabled: !!eventId
  });

  const { data: shareInfo, isLoading: shareLoading } = useQuery({
    queryKey: ['event_share', eventId],
    queryFn: () => eventService.getShareInfo(eventId),
    enabled: !!eventId
  });

  const handleCopyLink = () => {
    if (!shareInfo) return;
    const shareUrl = `${window.location.origin}/e/${shareInfo.slug}`;
    navigator.clipboard.writeText(shareUrl);
    toast('Link copied to clipboard', 'success');
  };

  const handleDownloadQR = () => {
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width + 80;
      canvas.height = img.height + 120;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 40, 40);
      
      ctx.fillStyle = '#171717';
      ctx.font = 'bold 24px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(event?.name || 'Event QR Code', canvas.width / 2, canvas.height - 40);
      
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `QR_${event?.slug || 'event'}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  if (eventLoading || shareLoading) return <div className="p-12 max-w-5xl mx-auto"><Skeleton className="h-[500px] w-full rounded-[3rem] bg-[#111111]" /></div>;
  if (!event || !shareInfo) return <div className="p-12 text-center max-w-5xl mx-auto font-kanit"><h2 className="text-4xl font-black uppercase tracking-tight text-[#D7E2EA]">Failed to load share information.</h2></div>;

  return (
    <div className="max-w-5xl mx-auto space-y-12 relative z-10 font-kanit animate-in fade-in duration-500 pb-16">
      <CursorGlow />
      <div className="pt-8">
        <Link to={ROUTES.EVENT(eventId)} className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-[#D7E2EA]/50 hover:text-[#D7E2EA] mb-6 transition-all group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to {event.name}
        </Link>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-[#D7E2EA] uppercase drop-shadow-lg">Your event is ready to share</h1>
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#D7E2EA]/50 mt-2">Print the QR code or share the link with guests.</p>
      </div>

      <div className="grid md:grid-cols-5 gap-8 relative z-10">
        <div className="md:col-span-2 bg-[#111111]/80 backdrop-blur-xl p-10 rounded-[3rem] border border-white/5 shadow-2xl flex flex-col items-center text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50 pointer-events-none" />
          
          <div className="bg-white p-6 rounded-3xl border border-white/10 mb-8 shadow-2xl group-hover:shadow-[0_0_40px_rgba(215,226,234,0.15)] transition-shadow duration-500 relative z-10">
            <QRCodeSVG 
              id="qr-code-svg"
              value={`${window.location.origin}/e/${shareInfo.slug}`} 
              size={220}
              level="M"
              fgColor="#111111"
            />
          </div>
          <Button variant="secondary" className="w-full relative z-10" onClick={handleDownloadQR}>
            <Download className="w-4 h-4 mr-2" /> Download QR Code
          </Button>
          <p className="text-[9px] font-bold uppercase tracking-widest text-[#D7E2EA]/40 mt-6 relative z-10">Print this and place it at your event venue for guests to scan.</p>
        </div>

        <div className="md:col-span-3 space-y-8">
          <div className="bg-[#111111]/80 backdrop-blur-xl p-10 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50 pointer-events-none" />
            <h3 className="text-2xl font-black uppercase tracking-tight mb-2 text-[#D7E2EA] relative z-10">Event Link</h3>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#D7E2EA]/50 mb-8 relative z-10">Share this link directly via message or email.</p>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8 relative z-10">
              <div className="flex-1 bg-[#1A1A1A] border border-white/10 rounded-2xl px-6 py-4 text-sm font-mono truncate text-[#D7E2EA] shadow-inner font-light">
                {`${window.location.origin}/e/${shareInfo.slug}`}
              </div>
              <Button variant="primary" onClick={handleCopyLink} className="h-[54px] sm:w-auto">
                <Copy className="w-4 h-4 mr-2" /> Copy
              </Button>
            </div>
            
            <a href={`${window.location.origin}/e/${shareInfo.slug}`} target="_blank" rel="noopener noreferrer" className="relative z-10 inline-flex items-center text-[10px] font-black uppercase tracking-widest text-[#D7E2EA] hover:text-white transition-colors hover:drop-shadow-[0_0_10px_rgba(215,226,234,0.5)] group">
              Open link as guest <ExternalLink className="w-3.5 h-3.5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>
          </div>

          <div className="bg-[#1A1A1A] p-10 rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50 pointer-events-none" />
             <h3 className="text-2xl font-black uppercase tracking-tight mb-8 text-[#D7E2EA] relative z-10">How guests use this</h3>
             <ol className="space-y-6 relative z-10">
               <li className="flex gap-6 items-start">
                 <div className="w-8 h-8 rounded-full bg-[#111111] border border-white/10 shadow-inner flex items-center justify-center flex-shrink-0 text-[#D7E2EA] font-black text-xs drop-shadow-md">1</div>
                 <span className="text-xs font-bold uppercase tracking-widest text-[#D7E2EA]/70 mt-2">Guests scan the QR code or click the link.</span>
               </li>
               <li className="flex gap-6 items-start">
                 <div className="w-8 h-8 rounded-full bg-[#111111] border border-white/10 shadow-inner flex items-center justify-center flex-shrink-0 text-[#D7E2EA] font-black text-xs drop-shadow-md">2</div>
                 <span className="text-xs font-bold uppercase tracking-widest text-[#D7E2EA]/70 mt-2">They land on the event page and take one selfie.</span>
               </li>
               <li className="flex gap-6 items-start">
                 <div className="w-8 h-8 rounded-full bg-[#111111] border border-white/10 shadow-inner flex items-center justify-center flex-shrink-0 text-[#D7E2EA] font-black text-xs drop-shadow-md">3</div>
                 <span className="text-xs font-bold uppercase tracking-widest text-[#D7E2EA]/70 mt-2">Our AI matches their face against all {event.photo_count.toLocaleString()} photos.</span>
               </li>
               <li className="flex gap-6 items-start">
                 <div className="w-8 h-8 rounded-full bg-[#111111] border border-white/10 shadow-inner flex items-center justify-center flex-shrink-0 text-[#D7E2EA] font-black text-xs drop-shadow-md">4</div>
                 <span className="text-xs font-bold uppercase tracking-widest text-[#D7E2EA]/70 mt-2">They instantly view and download their personalized gallery.</span>
               </li>
             </ol>
          </div>
        </div>
      </div>
    </div>
  );
}