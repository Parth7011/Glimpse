import React, { useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { eventService } from '@/services/eventService';
import { photoService } from '@/services/photoService';
import { ROUTES, UPLOAD } from '@/utils/constants';
import { Button, Skeleton, CursorGlow } from '@/components/ui';
import { useToast } from '@/components/ui/toast';
import { ArrowLeft, UploadCloud, X } from 'lucide-react';
import { cn } from '@/utils/utils';

export default function UploadPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const { data: event, isLoading } = useQuery({
    queryKey: ['event', eventId],
    queryFn: () => eventService.getEvent(eventId),
    enabled: !!eventId
  });

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (newFiles) => {
    const imageFiles = newFiles.filter(file => file.type.startsWith('image/'));
    if (imageFiles.length !== newFiles.length) {
      toast('Some files were ignored because they are not images.', 'warning');
    }
    
    const filesWithPreviews = imageFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    }));
    
    setFiles(prev => [...prev, ...filesWithPreviews]);
  };

  const removeFile = (index) => {
    setFiles(prev => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setUploading(true);
    setProgress(0);

    try {
      let completed = 0;
      // Upload each photo sequentially (or could be Promise.all for concurrent)
      for (const file of files) {
        await photoService.uploadPhoto(eventId, file);
        completed++;
        setProgress((completed / files.length) * 100);
      }
      
      // Trigger backend processing once all photos are uploaded
      await photoService.triggerProcessing(eventId);

      toast(`Successfully uploaded ${files.length} photos!`, 'success');
      navigate(ROUTES.EVENT(eventId));
    } catch (err) {
      toast(err.message || 'Error uploading photos', 'error');
      setUploading(false);
    }
  };

  if (isLoading) return <div className="p-12 max-w-5xl mx-auto"><Skeleton className="h-[30rem] w-full rounded-[3rem] bg-[#111111]" /></div>;
  if (!event) return <div className="p-12 text-center max-w-5xl mx-auto font-kanit"><h2 className="text-4xl font-black uppercase tracking-tight text-[#D7E2EA]">Event not found</h2></div>;

  return (
    <div className="max-w-5xl mx-auto space-y-12 relative z-10 font-kanit animate-in fade-in duration-500 pb-16">
      <CursorGlow />
      <div className="pt-8">
        <Link to={ROUTES.EVENT(eventId)} className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-[#D7E2EA]/50 hover:text-[#D7E2EA] mb-6 transition-all group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to {event.name}
        </Link>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-[#D7E2EA] uppercase drop-shadow-lg">Upload Photos</h1>
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#D7E2EA]/50 mt-2">Drag and drop high-resolution JPG, PNG, or HEIC files.</p>
      </div>

      <div className="bg-[#111111]/80 backdrop-blur-xl rounded-[3rem] p-10 border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50 pointer-events-none" />
        <div 
          className={cn(
            "relative border border-dashed rounded-[2rem] p-20 text-center transition-all duration-500 bg-[#1A1A1A] z-10 group overflow-hidden",
            dragActive ? "border-[#D7E2EA] bg-[#D7E2EA]/5 shadow-[0_0_40px_rgba(215,226,234,0.15)]" : "border-white/20 hover:border-[#D7E2EA]/50"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {dragActive && <div className="absolute inset-0 bg-gradient-to-t from-[#D7E2EA]/5 to-transparent pointer-events-none" />}
          <input
            type="file"
            multiple
            accept={UPLOAD.ACCEPTED_EXTENSIONS}
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-20"
            disabled={uploading}
          />
          <div className="flex flex-col items-center justify-center space-y-6 pointer-events-none relative z-10">
            <div className={cn("w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl", dragActive ? "bg-[#D7E2EA]/20 text-[#D7E2EA] scale-110 shadow-[0_0_20px_rgba(215,226,234,0.3)]" : "bg-black/50 text-[#D7E2EA]/50 border border-white/10 group-hover:scale-110 group-hover:text-[#D7E2EA]")}>
              <UploadCloud className="w-10 h-10" />
            </div>
            <div>
              <p className="text-3xl font-black uppercase tracking-tight text-[#D7E2EA]">Drop photos here</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#D7E2EA]/50 mt-2">or click to browse files</p>
            </div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-[#D7E2EA]/30 pt-4">Max {UPLOAD.MAX_BATCH_SIZE} files per batch. Max 15MB each.</p>
          </div>
        </div>

        {files.length > 0 && (
          <div className="mt-12 border-t border-white/5 pt-12 relative z-10">
            <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
              <h3 className="font-black text-2xl uppercase tracking-tight text-[#D7E2EA]">{files.length} {files.length === 1 ? 'file' : 'files'} selected</h3>
              {!uploading && (
                <Button variant="ghost" onClick={() => setFiles([])}>
                  Clear All
                </Button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-12">
              {files.map((file, i) => (
                <div key={i} className="relative aspect-square rounded-[2rem] overflow-hidden border border-white/10 group bg-[#1A1A1A] shadow-2xl hover:-translate-y-1 transition-transform">
                  <img src={file.preview} alt="preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {!uploading && (
                    <button 
                      onClick={() => removeFile(i)} 
                      className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-md text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white shadow-lg border border-white/10"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  {uploading && (
                     <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-2">
                        <div className="w-8 h-8 rounded-full border-2 border-[#D7E2EA] border-t-transparent animate-spin drop-shadow-[0_0_10px_rgba(215,226,234,0.8)]" />
                     </div>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-[#1A1A1A] rounded-[2rem] p-8 border border-white/10 shadow-2xl relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50 pointer-events-none" />
               {uploading ? (
                 <div className="space-y-6 relative z-10">
                   <div className="flex items-center justify-between">
                     <span className="font-black uppercase tracking-widest text-[#D7E2EA] text-[10px]">Uploading and processing...</span>
                     <span className="font-black uppercase tracking-tighter text-[#D7E2EA] text-xl drop-shadow-md">{Math.round(progress)}%</span>
                   </div>
                   <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden border border-white/5 shadow-inner relative">
                     <div 
                       className="h-full bg-gradient-to-r from-[#D7E2EA]/50 to-[#D7E2EA] transition-all duration-300 shadow-[0_0_15px_rgba(215,226,234,0.6)] relative"
                       style={{ width: `${progress}%` }}
                     >
                       <div className="absolute inset-0 bg-white/20 w-full h-full animate-pulse" />
                     </div>
                   </div>
                 </div>
               ) : (
                 <div className="flex justify-end relative z-10">
                    <Button variant="primary" onClick={handleUpload}>
                      Start Upload
                    </Button>
                 </div>
               )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}