import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { eventService } from '@/services/eventService';
import { ROUTES } from '@/utils/constants';
import { Button, Input, Label, CursorGlow } from '@/components/ui';
import { useToast } from '@/components/ui/toast';
import { ArrowLeft, CalendarPlus } from 'lucide-react';

export default function CreateEventPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0]
  });

  const createMutation = useMutation({
    mutationFn: (data) => eventService.createEvent(data),
    onSuccess: (newEvent) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast('Event created successfully', 'success');
      navigate(ROUTES.EVENT(newEvent.id));
    },
    onError: () => {
      toast('Failed to create event. Please try again.', 'error');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.date) return;
    createMutation.mutate({
      name: formData.name,
      date: new Date(formData.date).toISOString()
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-10 relative z-10 font-kanit">
      <CursorGlow />
      <div className="text-center pt-10 pb-4">
        <Link to={ROUTES.DASHBOARD} className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-[#D7E2EA]/50 hover:text-[#D7E2EA] mb-10 transition-all group absolute top-8 left-8 md:static md:mb-10">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
        </Link>
        <div className="w-24 h-24 rounded-[2rem] bg-[#1A1A1A] flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(215,226,234,0.1)] border border-white/10 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#D7E2EA]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <CalendarPlus className="w-12 h-12 text-[#D7E2EA] relative z-10 drop-shadow-[0_0_15px_rgba(215,226,234,0.5)]" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#D7E2EA] uppercase drop-shadow-lg mb-2">Create a new event</h1>
        <p className="text-xs font-bold text-[#D7E2EA]/50 uppercase tracking-widest">Set up a workspace for your next shoot.</p>
      </div>

      <div className="bg-[#111111]/80 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50 pointer-events-none" />
        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          <div className="space-y-2">
            <Label htmlFor="name">Event Name</Label>
            <Input 
              id="name" 
              placeholder="e.g., Aarav & Meera Wedding" 
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required 
              autoFocus
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date">Event Date</Label>
            <Input 
              id="date" 
              type="date" 
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              required 
            />
          </div>

          <div className="pt-8 border-t border-white/5 flex items-center justify-end gap-4 mt-10 relative z-10">
            <Link to={ROUTES.DASHBOARD}>
              <Button type="button" variant="ghost">Cancel</Button>
            </Link>
            <Button 
              type="submit" 
              variant="primary" 
              loading={createMutation.isPending}
            >
              Create Event
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}