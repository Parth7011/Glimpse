import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { eventService } from '@/services/eventService';
import { matchingService } from '@/services/matchingService';
import { ROUTES } from '@/utils/constants';
import { Button } from '@/components/ui';
import { ProcessStep } from '@/components/guest';
import { useToast } from '@/components/ui/toast';
import { Camera, RefreshCw, ChevronLeft, Search, Upload } from 'lucide-react';

export default function SelfiePage() {
  const { eventSlug } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  
  const [stream, setStream] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      setStream(mediaStream);
      setHasPermission(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Camera error:", err);
      setHasPermission(false);
      toast('Camera access denied. Please allow camera permissions to continue.', 'error');
    }
  }, [toast]);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [startCamera]);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const captureSelfie = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const imageBase64 = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedImage(imageBase64);
    
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const retakeSelfie = () => {
    setCapturedImage(null);
    startCamera();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setCapturedImage(e.target.result);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const { data: event } = useQuery({
    queryKey: ['guest_event', eventSlug],
    queryFn: () => eventService.getEventBySlug(eventSlug),
    enabled: !!eventSlug
  });

  const processSelfie = async () => {
    if (!event) {
      toast('Event not found', 'error');
      return;
    }
    
    setIsProcessing(true);
    setProcessingStep(1); 
    
    try {
      const sessionId = crypto.randomUUID();
      
      setProcessingStep(2); 
      await matchingService.matchSelfie(event.id, sessionId, capturedImage);
      
      setProcessingStep(3); 
      await new Promise(r => setTimeout(r, 600));
      
      navigate(ROUTES.GUEST_RESULTS(eventSlug), { state: { sessionId } });
    } catch (err) {
      toast(err.message || 'Failed to find photos', 'error');
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[var(--background)] max-w-lg mx-auto w-full relative h-[100dvh] overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="relative z-20 flex items-center justify-between p-4 bg-[var(--surface)] border-b border-[var(--border)]">
        <button 
          onClick={() => navigate(ROUTES.GUEST_EVENT(eventSlug))}
          className="w-10 h-10 rounded-full bg-[var(--surface-soft)] flex items-center justify-center text-[var(--text-primary)] hover:bg-[var(--border)] transition-colors"
          disabled={isProcessing}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="font-semibold text-sm tracking-wide text-[var(--text-primary)]">Find your photos</span>
        <div className="w-10" /> {/* Spacer for centering */}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative bg-[var(--surface-soft)] flex flex-col justify-center overflow-hidden">
        
        {/* Permission Denied State */}
        {hasPermission === false && !capturedImage && (
          <div className="text-center p-8 bg-[var(--surface)] m-4 rounded-[var(--radius-xl)] border border-[var(--border)] shadow-sm space-y-4 z-10">
            <div className="w-16 h-16 rounded-full bg-[var(--accent-soft)] flex items-center justify-center mx-auto mb-2">
              <Camera className="w-8 h-8 text-[var(--accent)]" />
            </div>
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">Camera Access Required</h2>
            <p className="text-[var(--text-secondary)] text-sm max-w-xs mx-auto">
              We need access to your camera to take a selfie and find your photos. Please allow access in your browser.
            </p>
            <Button variant="primary" onClick={startCamera} className="mt-6 w-full h-12 shadow-sm">
              Try Again
            </Button>
          </div>
        )}

        {/* Live Camera View */}
        {hasPermission && !capturedImage && (
          <>
            <div className="absolute inset-0 bg-black">
              <video 
                ref={videoRef}
                autoPlay 
                playsInline 
                muted
                className="absolute inset-0 w-full h-full object-cover transform -scale-x-100"
              />
            </div>
            
            {/* Face Guide Overlay */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
              <div className="w-[70vw] max-w-[280px] aspect-[3/4] border-2 border-white/60 rounded-[120px] relative shadow-[0_0_0_9999px_rgba(0,0,0,0.4)]">
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-white text-center w-full">
                   <p className="font-semibold text-lg drop-shadow-md">Centre your face</p>
                   <p className="text-sm text-white/80 drop-shadow-md">Good lighting works best</p>
                </div>
              </div>
            </div>
            
            {/* Action Bar */}
            <div className="absolute bottom-0 left-0 right-0 z-20 p-8 flex flex-col items-center justify-end bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-24">
              <button 
                onClick={captureSelfie}
                className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md p-1.5 flex items-center justify-center hover:bg-white/30 transition-all mb-6 shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-95 group"
              >
                <div className="w-full h-full rounded-full bg-white shadow-inner transition-transform group-hover:scale-95 group-active:scale-90 flex items-center justify-center" />
              </button>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 text-white/90 text-sm font-medium hover:text-white transition-colors bg-black/40 px-4 py-2 rounded-full backdrop-blur-md"
              >
                <Upload className="w-4 h-4" />
                Upload a selfie instead
              </button>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
              />
            </div>
          </>
        )}

        {/* Hidden Canvas for capture */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Captured Image View */}
        {capturedImage && (
          <div className="absolute inset-0 w-full h-full z-10 bg-black">
            <img 
              src={capturedImage} 
              alt="Selfie" 
              className="w-full h-full object-cover opacity-90"
            />
            
            <AnimatePresence>
              {isProcessing && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-[var(--surface)]/95 backdrop-blur-md flex flex-col items-center justify-center p-8 z-30"
                >
                  <div className="relative w-20 h-20 mb-8 flex items-center justify-center bg-[var(--surface)] rounded-full shadow-lg border border-[var(--border)]">
                    <motion.div 
                      className="absolute inset-0 rounded-full border-2 border-[#7C6EF6] border-t-transparent shadow-[0_0_15px_rgba(124,110,246,0.5)]"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />
                    <Search className="w-8 h-8 text-[#7C6EF6]" />
                  </div>
                  
                  <div className="space-y-5 w-full max-w-[240px]">
                    <ProcessStep active={processingStep >= 1} text="Selfie captured" />
                    <ProcessStep active={processingStep >= 2} text="Face detected" loading={processingStep === 1} />
                    <ProcessStep active={processingStep >= 3} text="Searching event photos..." loading={processingStep === 2} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions (hidden while processing) */}
            {!isProcessing && (
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-white/10 backdrop-blur-xl border-t border-white/20 shadow-[0_-10px_40px_rgba(0,0,0,0.3)] flex items-center gap-4 z-20 animate-in slide-in-from-bottom-10 rounded-t-3xl pb-10">
                <Button 
                  variant="secondary" 
                  size="xl" 
                  onClick={retakeSelfie}
                  className="bg-white/10 text-white hover:bg-white/20 border border-white/20 h-14 w-14 shrink-0 rounded-full p-0 shadow-lg backdrop-blur-md"
                >
                  <RefreshCw className="w-5 h-5" />
                </Button>
                <Button 
                  variant="primary" 
                  size="xl" 
                  onClick={processSelfie}
                  className="flex-1 bg-gradient-to-r from-[#7C6EF6] to-[#5A4ED1] text-white hover:shadow-[0_8px_30px_rgba(124,110,246,0.5)] hover:-translate-y-0.5 border-none h-14 rounded-2xl text-lg font-bold transition-all shadow-xl"
                >
                  Find My Photos
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
