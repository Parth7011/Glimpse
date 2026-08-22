import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Image as ImageIcon, Upload, Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { eventService } from '@/services/eventService';
import { useToast } from '@/components/ui/toast';

const MOCK_COVERS = [
  { id: 'wedding', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80', label: 'Wedding' },
  { id: 'birthday', url: 'https://images.unsplash.com/photo-1530103862676-de8892b07d62?w=800&q=80', label: 'Birthday' },
  { id: 'party', url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80', label: 'Party' },
  { id: 'corporate', url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80', label: 'Corporate' }
];

export function EventCoverModal({ isOpen, onClose, event }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const fileInputRef = useRef(null);

  const updateEventMutation = useMutation({
    mutationFn: (updates) => eventService.updateEvent(event.id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries(['events']);
      toast('Cover photo updated!', 'success');
      onClose();
    },
    onError: () => toast('Failed to update cover photo', 'error')
  });

  const uploadCoverMutation = useMutation({
    mutationFn: (file) => eventService.uploadCoverPhoto(event.id, file),
    onSuccess: () => {
      queryClient.invalidateQueries(['events']);
      toast('Cover photo uploaded!', 'success');
      onClose();
    },
    onError: () => toast('Failed to upload cover photo', 'error')
  });

  const handleSelectPreset = (url) => {
    updateEventMutation.mutate({ cover_photo_url: url });
  };

  const handleCustomUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast('File must be less than 5MB', 'error');
      return;
    }
    uploadCoverMutation.mutate(file);
  };

  if (!isOpen || !event) return null;

  const isPending = updateEventMutation.isPending || uploadCoverMutation.isPending;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#111] border border-white/10 p-6 rounded-3xl w-full max-w-2xl relative z-10 shadow-2xl">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
          
          <h2 className="text-2xl font-black uppercase text-[#D7E2EA] tracking-tight mb-2">Change Cover Photo</h2>
          <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-6">Select a preset or upload your own.</p>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            {MOCK_COVERS.map(cover => (
              <div 
                key={cover.id} 
                onClick={() => !isPending && handleSelectPreset(cover.url)}
                className={`relative aspect-video rounded-xl overflow-hidden cursor-pointer group border-2 transition-all ${event.cover_photo_url === cover.url ? 'border-[#D7E2EA]' : 'border-transparent hover:border-white/20'}`}
              >
                <img src={cover.url} alt={cover.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-3">
                  <span className="text-xs font-black uppercase tracking-widest text-white">{cover.label}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t border-white/10 pt-6">
            <input type="file" ref={fileInputRef} className="hidden" accept="image/jpeg, image/png, image/webp" onChange={handleCustomUpload} />
            <Button 
              variant="secondary" 
              className="w-full h-14" 
              onClick={() => fileInputRef.current?.click()}
              disabled={isPending}
            >
              {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
              {isPending ? 'Saving...' : 'Upload Custom Photo'}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export function EventEditModal({ isOpen, onClose, event }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [name, setName] = useState(event?.name || '');
  const [date, setDate] = useState(event?.date ? new Date(event.date).toISOString().split('T')[0] : '');

  const updateEventMutation = useMutation({
    mutationFn: (updates) => eventService.updateEvent(event.id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries(['events']);
      toast('Event updated!', 'success');
      onClose();
    },
    onError: () => toast('Failed to update event', 'error')
  });

  const handleSave = () => {
    if (!name || !date) {
      toast('Please fill all fields', 'error');
      return;
    }
    updateEventMutation.mutate({ name, date: new Date(date).toISOString() });
  };

  if (!isOpen || !event) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#111] border border-white/10 p-8 rounded-3xl w-full max-w-md relative z-10 shadow-2xl">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
          
          <h2 className="text-2xl font-black uppercase text-[#D7E2EA] tracking-tight mb-2">Edit Event</h2>
          <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-6">Update details for {event.name}</p>
          
          <div className="space-y-4 mb-8">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-[#D7E2EA]/60 ml-1 mb-2 block">Event Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)}
                className="w-full p-4 bg-[#1A1A1A] border border-white/10 rounded-2xl text-sm focus:outline-none focus:border-[#D7E2EA]/50 text-white" 
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-[#D7E2EA]/60 ml-1 mb-2 block">Event Date</label>
              <input 
                type="date" 
                value={date} 
                onChange={e => setDate(e.target.value)}
                className="w-full p-4 bg-[#1A1A1A] border border-white/10 rounded-2xl text-sm focus:outline-none focus:border-[#D7E2EA]/50 text-white" 
              />
            </div>
          </div>
          
          <Button 
            variant="primary" 
            className="w-full h-12" 
            onClick={handleSave}
            disabled={updateEventMutation.isPending}
          >
            {updateEventMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export function EventDeleteModal({ isOpen, onClose, event }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const deleteEventMutation = useMutation({
    mutationFn: () => eventService.deleteEvent(event.id),
    onSuccess: () => {
      queryClient.invalidateQueries(['events']);
      queryClient.invalidateQueries(['dashboardStats']);
      toast('Event deleted successfully', 'success');
      onClose();
    },
    onError: () => toast('Failed to delete event', 'error')
  });

  if (!isOpen || !event) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#111] border border-red-500/30 p-8 rounded-3xl w-full max-w-md relative z-10 shadow-2xl text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 mx-auto flex items-center justify-center mb-6">
            <Trash2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black uppercase text-white tracking-tight mb-2">Delete Event?</h2>
          <p className="text-sm font-bold text-white/50 uppercase tracking-widest mb-8">
            Are you sure you want to delete <span className="text-white">{event.name}</span>? This action cannot be undone and will delete all photos.
          </p>
          
          <div className="flex gap-4">
            <Button variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
            <Button 
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-black uppercase tracking-widest rounded-2xl transition-all"
              onClick={() => deleteEventMutation.mutate()}
              disabled={deleteEventMutation.isPending}
            >
              {deleteEventMutation.isPending ? 'Deleting...' : 'Delete Event'}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
