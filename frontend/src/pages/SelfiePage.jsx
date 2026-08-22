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
    <div className="flex-1 flex flex-col bg-[#0C0C0C] max-w-2xl mx-auto w-full relative h-[100dvh] overflow-hidden shadow-2xl font-kanit">
      {/* Header */}
      <div className="relative z-20 flex items-center justify-between p-6 bg-[#0C0C0C] border-b border-white/5">
        <button 
          onClick={() => navigate(ROUTES.GUEST_EVENT(eventSlug))}
          className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-[#D7E2EA] hover:bg-white/10 transition-colors border border-white/10"
          disabled={isProcessing}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="font-black uppercase tracking-widest text-xs text-[#D7E2EA]">Find your photos</span>
        <div className="w-10" /> {/* Spacer for centering */}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative bg-[#111111] flex flex-col justify-center overflow-hidden">
        
        {/* Permission Denied State */}
        {hasPermission === false && !capturedImage && (
          <div className="text-center p-10 bg-[#111111]/80 backdrop-blur-xl m-6 rounded-[3rem] border border-white/10 shadow-2xl space-y-6 z-10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-50 pointer-events-none" />
            <div className="w-20 h-20 rounded-[2rem] bg-[#1A1A1A] border border-white/10 shadow-inner flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500 relative z-10">
              <Camera className="w-10 h-10 text-red-400" />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-[#D7E2EA] relative z-10">Camera Access Required</h2>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#D7E2EA]/50 max-w-xs mx-auto relative z-10">
              We need access to your camera to take a selfie and find your photos. Please allow access in your browser.
            </p>
            <Button variant="primary" onClick={startCamera} className="mt-8 w-full h-14 relative z-10">
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
              <div className="w-[75vw] max-w-[300px] aspect-[3/4] border-[3px] border-[#D7E2EA]/40 rounded-[140px] relative shadow-[0_0_0_9999px_rgba(12,12,12,0.85)]">
                {/* Glowing edge effect */}
                <div className="absolute inset-[-3px] border-[3px] border-[#D7E2EA]/20 rounded-[140px] blur-sm" />
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 text-center w-full">
                   <p className="font-black uppercase tracking-widest text-lg text-[#D7E2EA] drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]">Centre your face</p>
                   <p className="text-[10px] font-bold uppercase tracking-widest text-[#D7E2EA]/70 mt-1 drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]">Good lighting works best</p>
                </div>
              </div>
            </div>
            
            {/* Action Bar */}
            <div className="absolute bottom-0 left-0 right-0 z-20 p-8 flex flex-col items-center justify-end bg-gradient-to-t from-[#0C0C0C] via-[#0C0C0C]/80 to-transparent pt-32">
              <button 
                onClick={captureSelfie}
                className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-xl p-2 flex items-center justify-center hover:bg-white/20 transition-all mb-8 shadow-[0_0_30px_rgba(215,226,234,0.15)] active:scale-95 group border border-white/20"
              >
                <div className="w-full h-full rounded-full bg-[#D7E2EA] shadow-inner transition-transform group-hover:scale-95 group-active:scale-90 flex items-center justify-center" />
              </button>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-[#D7E2EA]/70 hover:text-[#D7E2EA] transition-colors bg-white/5 border border-white/10 px-6 py-3 rounded-full backdrop-blur-xl hover:bg-white/10"
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
                  className="absolute inset-0 bg-[#0C0C0C]/95 backdrop-blur-2xl flex flex-col items-center justify-center p-8 z-30"
                >
                  <div className="relative w-24 h-24 mb-10 flex items-center justify-center bg-[#1A1A1A] rounded-[2rem] shadow-[0_0_40px_rgba(215,226,234,0.1)] border border-white/10">
                    <motion.div 
                      className="absolute inset-0 rounded-[2rem] border-2 border-[#D7E2EA] border-t-transparent shadow-[0_0_20px_rgba(215,226,234,0.3)]"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />
                    <Search className="w-10 h-10 text-[#D7E2EA]" />
                  </div>
                  
                  <div className="space-y-6 w-full max-w-[280px]">
                    <ProcessStep active={processingStep >= 1} text="Selfie captured" />
                    <ProcessStep active={processingStep >= 2} text="Face detected" loading={processingStep === 1} />
                    <ProcessStep active={processingStep >= 3} text="Searching event photos..." loading={processingStep === 2} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions (hidden while processing) */}
            {!isProcessing && (
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-[#0C0C0C] via-[#0C0C0C]/80 to-transparent flex items-center gap-4 z-20 animate-in slide-in-from-bottom-10 pt-20 pb-12">
                <Button 
                  variant="secondary" 
                  size="xl" 
                  onClick={retakeSelfie}
                  className="bg-white/10 text-[#D7E2EA] hover:bg-white/20 border border-white/20 h-16 w-16 shrink-0 rounded-2xl p-0 shadow-lg backdrop-blur-xl"
                >
                  <RefreshCw className="w-6 h-6" />
                </Button>
                <Button 
                  variant="primary" 
                  size="xl" 
                  onClick={processSelfie}
                  className="flex-1 h-16 rounded-[1.5rem] text-base font-black uppercase tracking-widest shadow-xl"
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
