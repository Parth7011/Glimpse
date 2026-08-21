import supabase, { adminSupabase } from '../config/supabase.js';
import { v4 as uuidv4 } from 'uuid';

export const listEvents = async (photographerId) => {
  const { data, error } = await adminSupabase
    .from('events')
    .select('*')
    .eq('photographer_id', photographerId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const getDashboardStats = async (photographerId) => {
  const { data: events, error } = await adminSupabase
    .from('events')
    .select('id, photo_count, guest_count')
    .eq('photographer_id', photographerId);

  if (error) throw error;

  const stats = {
    total_events: events.length,
    total_photos: events.reduce((sum, event) => sum + (event.photo_count || 0), 0),
    total_guests_matched: events.reduce((sum, event) => sum + (event.guest_count || 0), 0)
  };

  return stats;
};

export const createEvent = async (photographerId, eventData, photographerMeta = {}) => {
  // Ensure the photographer row exists before creating the event.
  // This is a safety net for users who registered before the auto-insert was in place.
  const { error: upsertErr } = await adminSupabase
    .from('photographers')
    .upsert([
      {
        id: photographerId,
        email: photographerMeta.email || `${photographerId}@glimpse.local`,
        name: photographerMeta.name || 'Photographer',
      }
    ], { onConflict: 'id' });

  if (upsertErr) {
    console.warn('Photographer upsert warning (non-fatal):', upsertErr.message);
  }

  const id = uuidv4();
  const slug = eventData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + id.substring(0, 6);
  
  const { data, error } = await adminSupabase
    .from('events')
    .insert([
      {
        id,
        photographer_id: photographerId,
        name: eventData.name,
        slug,
        date: eventData.date,
        cover_photo_url: null,
        status: 'draft',
        photo_count: 0,
        face_count: 0,
        guest_count: 0,
        created_at: new Date().toISOString()
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};


export const getEvent = async (photographerId, eventId) => {
  const { data, error } = await adminSupabase
    .from('events')
    .select('*')
    .eq('id', eventId)
    .eq('photographer_id', photographerId)
    .single();

  if (error) throw error;

  // Real-time count of photos to heal any race conditions during upload
  const { count } = await adminSupabase
    .from('photos')
    .select('*', { count: 'exact', head: true })
    .eq('event_id', eventId);
    
  if (count !== null) {
    data.photo_count = count;
    // Silently heal the db
    adminSupabase.from('events').update({ photo_count: count }).eq('id', eventId).then();
  }

  return data;
};

export const getEventBySlug = async (slug) => {
  const { data, error } = await adminSupabase
    .from('events')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) throw error;
  return data;
};

export const searchEvents = async (query) => {
  const { data, error } = await adminSupabase
    .from('events')
    .select('*')
    .or(`name.ilike.%${query}%,slug.ilike.%${query}%`)
    .limit(10);

  if (error) throw error;
  return data;
};

export const updateEvent = async (photographerId, eventId, updates) => {
  const { data, error } = await adminSupabase
    .from('events')
    .update(updates)
    .eq('id', eventId)
    .eq('photographer_id', photographerId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getShareInfo = async (photographerId, eventId) => {
  const { data: event, error } = await adminSupabase
    .from('events')
    .select('id, slug')
    .eq('id', eventId)
    .eq('photographer_id', photographerId)
    .single();

  if (error) throw error;

  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  return {
    event_id: event.id,
    slug: event.slug,
    share_url: `${baseUrl}/e/${event.slug}`,
    qr_data: `${baseUrl}/e/${event.slug}`
  };
};
