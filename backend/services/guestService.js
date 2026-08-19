import supabase from '../config/supabase.js';
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

  const { data: session, error: sessionError } = await supabase
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
  const { data, error } = await supabase
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
