import React, { useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { eventService } from '@/services/eventService';
import { photoService } from '@/services/photoService';
import { ROUTES, UPLOAD } from '@/utils/constants';
import { Button, Skeleton } from '@/components/ui';
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

  if (isLoading) return <div className="p-8 max-w-4xl mx-auto"><Skeleton className="h-96 w-full rounded-[var(--radius-xl)] bg-[var(--surface)]" /></div>;
  if (!event) return <div className="p-8 text-center max-w-4xl mx-auto"><h2 className="text-xl font-medium">Event not found</h2></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div>
        <Link to={ROUTES.EVENT(eventId)} className="inline-flex items-center text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to {event.name}
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">Upload Photos</h1>
        <p className="text-[var(--text-secondary)] mt-1">Drag and drop high-resolution JPG, PNG, or HEIC files.</p>
      </div>

      <div className="bg-[var(--surface)] rounded-[var(--radius-xl)] p-8 border border-[var(--border)] shadow-sm">
        <div 
          className={cn(
            "relative border-2 border-dashed rounded-[var(--radius-lg)] p-16 text-center transition-colors duration-200 bg-[var(--background)]",
            dragActive ? "border-[var(--accent)] bg-[var(--accent-soft)]/50" : "border-[var(--border)] hover:border-[var(--border-strong)]"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            multiple
            accept={UPLOAD.ACCEPTED_EXTENSIONS}
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            disabled={uploading}
          />
          <div className="flex flex-col items-center justify-center space-y-4 pointer-events-none">
            <div className={cn("p-5 rounded-full transition-colors", dragActive ? "bg-[var(--accent)]/10 text-[var(--accent)]" : "bg-white text-[var(--text-secondary)] shadow-sm border border-[var(--border)]")}>
              <UploadCloud className="w-8 h-8" />
            </div>
            <div>
              <p className="text-lg font-semibold text-[var(--text-primary)]">Drop photos here</p>
              <p className="text-[var(--text-secondary)] mt-1">or click to browse files</p>
            </div>
            <p className="text-sm text-[var(--text-muted)] pt-2">Max {UPLOAD.MAX_BATCH_SIZE} files per batch. Max 15MB each.</p>
          </div>
        </div>

        {files.length > 0 && (
          <div className="mt-8 border-t border-[var(--border)] pt-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-lg text-[var(--text-primary)]">{files.length} {files.length === 1 ? 'file' : 'files'} selected</h3>
              {!uploading && (
                <Button variant="ghost" size="sm" onClick={() => setFiles([])} className="text-[var(--danger)] hover:bg-[var(--danger-soft)]">
                  Clear All
                </Button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
              {files.map((file, i) => (
                <div key={i} className="relative aspect-square rounded-[var(--radius-md)] overflow-hidden border border-[var(--border)] group bg-[var(--background)]">
                  <img src={file.preview} alt="preview" className="w-full h-full object-cover" />
                  {!uploading && (
                    <button 
                      onClick={() => removeFile(i)} 
                      className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur text-[var(--text-primary)] rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:text-[var(--danger)] shadow-sm"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  {uploading && (
                     <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
                     </div>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-[var(--background)] rounded-[var(--radius-lg)] p-6 border border-[var(--border)]">
               {uploading ? (
                 <div className="space-y-4">
                   <div className="flex items-center justify-between">
                     <span className="font-semibold text-[var(--text-primary)]">Uploading and processing...</span>
                     <span className="font-mono font-medium text-[var(--accent)]">{Math.round(progress)}%</span>
                   </div>
                   <div className="h-3 w-full bg-[var(--surface)] rounded-full overflow-hidden border border-[var(--border)]">
                     <div 
                       className="h-full bg-[var(--accent)] transition-all duration-300"
                       style={{ width: `${progress}%` }}
                     />
                   </div>
                 </div>
               ) : (
                 <div className="flex justify-end">
                    <Button variant="primary" className="h-12 px-8 text-base shadow-sm" onClick={handleUpload}>
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