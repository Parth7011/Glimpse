import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { eventService } from '@/services/eventService';
import { ROUTES } from '@/utils/constants';
import { Button, Input, Label } from '@/components/ui';
import { useToast } from '@/components/ui/toast';
import { ArrowLeft } from 'lucide-react';

export default function CreateEventPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0]
  });

  const createMutation = useMutation({
    mutationFn: (data) => eventService.createEvent(data),
    onSuccess: (newEvent) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      addToast('Event created successfully', 'success');
      navigate(ROUTES.EVENT(newEvent.id));
    },
    onError: () => {
      addToast('Failed to create event. Please try again.', 'error');
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
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div>
        <Link to={ROUTES.DASHBOARD} className="inline-flex items-center text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Dashboard
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">Create your event</h1>
        <p className="text-[var(--text-secondary)] mt-1">Set up a new workspace for your photos.</p>
      </div>

      <div className="bg-[var(--surface)] p-8 rounded-[var(--radius-xl)] border border-[var(--border)] shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2.5">
            <Label htmlFor="name" className="text-sm font-medium text-[var(--text-primary)]">Event Name</Label>
            <Input 
              id="name" 
              placeholder="e.g., Aarav & Meera Wedding" 
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required 
              autoFocus
              className="h-12 bg-[var(--background)] border-[var(--border)] focus-visible:ring-1 focus-visible:ring-[var(--accent)]"
            />
          </div>
          
          <div className="space-y-2.5">
            <Label htmlFor="date" className="text-sm font-medium text-[var(--text-primary)]">Event Date</Label>
            <Input 
              id="date" 
              type="date" 
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              required 
              className="h-12 bg-[var(--background)] border-[var(--border)] focus-visible:ring-1 focus-visible:ring-[var(--accent)]"
            />
          </div>

          <div className="pt-6 border-t border-[var(--border)] flex items-center justify-end gap-4 mt-8">
            <Link to={ROUTES.DASHBOARD}>
              <Button type="button" variant="ghost" className="text-[var(--text-secondary)]">Cancel</Button>
            </Link>
            <Button 
              type="submit" 
              variant="primary" 
              loading={createMutation.isPending}
              className="px-8 shadow-sm h-11"
            >
              Create Event
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}