import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { QRCodeSVG } from 'qrcode.react';
import { eventService } from '@/services/eventService';
import { ROUTES } from '@/utils/constants';
import { Button, Skeleton } from '@/components/ui';
import { useToast } from '@/components/ui/toast';
import { ArrowLeft, Copy, Download, ExternalLink } from 'lucide-react';

export default function SharePage() {
  const { eventId } = useParams();
  const { addToast } = useToast();

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
    navigator.clipboard.writeText(shareInfo.share_url);
    addToast('Link copied to clipboard', 'success');
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

  if (eventLoading || shareLoading) return <div className="p-8 max-w-5xl mx-auto"><Skeleton className="h-[500px] w-full rounded-[var(--radius-xl)] bg-[var(--surface)]" /></div>;
  if (!event || !shareInfo) return <div className="p-8 text-center max-w-5xl mx-auto"><h2 className="text-xl font-medium">Failed to load share information.</h2></div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div>
        <Link to={ROUTES.EVENT(eventId)} className="inline-flex items-center text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to {event.name}
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">Your event is ready to share</h1>
        <p className="text-[var(--text-secondary)] mt-1">Print the QR code or share the link with guests.</p>
      </div>

      <div className="grid md:grid-cols-5 gap-8">
        <div className="md:col-span-2 bg-[var(--surface)] p-10 rounded-[var(--radius-xl)] border border-[var(--border)] shadow-sm flex flex-col items-center text-center">
          <div className="bg-white p-5 rounded-2xl border border-[var(--border)] mb-8 shadow-sm">
            <QRCodeSVG 
              id="qr-code-svg"
              value={shareInfo.qr_data} 
              size={200}
              level="M"
              fgColor="#171717"
            />
          </div>
          <Button variant="secondary" className="w-full gap-2 h-12 shadow-sm" onClick={handleDownloadQR}>
            <Download className="w-4 h-4" /> Download QR Code
          </Button>
          <p className="text-sm text-[var(--text-secondary)] mt-6">Print this and place it at your event venue for guests to scan.</p>
        </div>

        <div className="md:col-span-3 space-y-6">
          <div className="bg-[var(--surface)] p-8 rounded-[var(--radius-xl)] border border-[var(--border)] shadow-sm">
            <h3 className="text-lg font-semibold mb-2 text-[var(--text-primary)]">Event Link</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-6">Share this link directly via message or email.</p>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 bg-[var(--background)] border border-[var(--border)] rounded-[var(--radius-md)] px-4 py-3 text-sm font-mono truncate text-[var(--text-primary)] shadow-inner">
                {shareInfo.share_url}
              </div>
              <Button variant="primary" className="shrink-0 gap-2 h-11 px-6 shadow-sm" onClick={handleCopyLink}>
                <Copy className="w-4 h-4" /> Copy
              </Button>
            </div>
            
            <a href={shareInfo.share_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors">
              Open link as guest <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="bg-[var(--surface-soft)] p-8 rounded-[var(--radius-xl)] border border-[var(--border)]">
             <h3 className="font-semibold mb-4 text-[var(--text-primary)]">How guests use this</h3>
             <ol className="space-y-4 text-sm text-[var(--text-secondary)]">
               <li className="flex gap-3">
                 <span className="font-semibold text-[var(--text-primary)]">1.</span>
                 <span>Guests scan the QR code or click the link.</span>
               </li>
               <li className="flex gap-3">
                 <span className="font-semibold text-[var(--text-primary)]">2.</span>
                 <span>They land on the event page and take one selfie.</span>
               </li>
               <li className="flex gap-3">
                 <span className="font-semibold text-[var(--text-primary)]">3.</span>
                 <span>Our AI matches their face against all {event.photo_count.toLocaleString()} photos.</span>
               </li>
               <li className="flex gap-3">
                 <span className="font-semibold text-[var(--text-primary)]">4.</span>
                 <span>They instantly view and download their personalized gallery.</span>
               </li>
             </ol>
          </div>
        </div>
      </div>
    </div>
  );
}