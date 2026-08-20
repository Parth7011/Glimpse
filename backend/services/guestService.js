import supabase from '../config/supabase.js';
import { adminSupabase } from '../config/supabase.js';
import { v4 as uuidv4 } from 'uuid';

export const createSession = async (eventSlug) => {
  // First, find the event ID by slug
  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('id')
    .eq('slug', eventSlug)
    .single();

  if (eventError) throw eventError;

  const sessionId = uuidv4();
  const sessionToken = `session-${uuidv4()}`;
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  const { data: session, error: sessionError } = await adminSupabase
    .from('guest_sessions')
    .insert([{
      id: sessionId,
      event_id: event.id,
      session_token: sessionToken,
      expires_at: expiresAt
    }])
    .select()
    .single();

  if (sessionError) throw sessionError;
  return session;
};

export const recordConsent = async (eventId, sessionId, consentGiven) => {
  const consentId = uuidv4();
  const { data, error } = await adminSupabase
    .from('consents')
    .insert([{
      id: consentId,
      event_id: eventId,
      guest_session_id: sessionId,
      consent_given: consentGiven
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const validateSession = async (sessionToken) => {
  const { data, error } = await supabase
    .from('guest_sessions')
    .select('*')
    .eq('session_token', sessionToken)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw new Error('Invalid session token');
    }
    throw error;
  }
  
  if (new Date(data.expires_at) < new Date()) {
    throw new Error('Session expired');
  }

  return data;
};

/**
 * Get all events a guest has joined, identified by their email.
 * Returns events with match counts from the matches table.
 */
export const getGuestEvents = async (guestEmail) => {
  // Find all match records for this guest email, joined with event details
  const { data, error } = await supabase
    .from('matches')
    .select(`
      id,
      matched_at,
      events (
        id,
        name,
        slug,
        date,
        cover_photo_url,
        status
      )
    `)
    .eq('guest_email', guestEmail)
    .order('matched_at', { ascending: false });

  if (error) {
    // If matches table doesn't have guest_email column, fall back to guest_sessions
    console.warn('Matches query failed, falling back to guest_sessions:', error.message);
    return getGuestEventsBySession(guestEmail);
  }

  // Group by event, count matches
  const eventMap = new Map();
  for (const row of data || []) {
    const event = row.events;
    if (!event) continue;
    if (!eventMap.has(event.id)) {
      eventMap.set(event.id, { ...event, matches: 0 });
    }
    eventMap.get(event.id).matches += 1;
  }

  return Array.from(eventMap.values());
};

/**
 * Fallback: get events by guest_sessions table if matches table lacks guest_email
 */
export const getGuestEventsBySession = async (guestEmail) => {
  const { data, error } = await supabase
    .from('guest_sessions')
    .select(`
      id,
      created_at,
      events (
        id,
        name,
        slug,
        date,
        cover_photo_url,
        status
      )
    `)
    .eq('guest_email', guestEmail)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('getGuestEventsBySession error:', error.message);
    return [];
  }

  return (data || [])
    .filter(row => row.events)
    .map(row => ({ ...row.events, matches: 0 }));
};

