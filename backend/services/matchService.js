import supabase, { adminSupabase } from '../config/supabase.js';
import { v4 as uuidv4 } from 'uuid';

export const matchSelfie = async (eventId, sessionId, selfieFile) => {
  // In a real application, this would:
  // 1. Upload selfie
  // 2. Call FastAPI for face detection and matching
  // 3. FastAPI would write to the `matches` table
  
  // Since we are mocking the ML part but keeping the DB part real,
  // we will just fetch ALL photos for this event and create fake matches
  // in the database so the frontend has real data to read.
  
  const { data: photos, error: photoError } = await adminSupabase
    .from('photos')
    .select('id')
    .eq('event_id', eventId);
    
  if (photoError) throw photoError;

  // Insert a mock guest session to satisfy the database foreign key constraint
  // since the frontend is currently generating a random sessionId
  const sessionToken = `session-${uuidv4()}`;
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  await adminSupabase.from('guest_sessions').insert([{
    id: sessionId,
    event_id: eventId,
    session_token: sessionToken,
    expires_at: expiresAt
  }]);
  
  // Create fake matches for up to 5 photos
  const matchesToInsert = photos.slice(0, 5).map(photo => ({
    id: uuidv4(),
    guest_session_id: sessionId,
    photo_id: photo.id,
    face_id: null, // No real face_id since no ML
    similarity: 0.95 + (Math.random() * 0.04)
  }));
  
  if (matchesToInsert.length > 0) {
    const { error: matchError } = await adminSupabase
      .from('matches')
      .insert(matchesToInsert);
      
    if (matchError) throw matchError;
  }
  
  // Return the matches joined with photos
  return getMatches(sessionId);
};

export const getMatches = async (sessionId) => {
  const { data, error } = await adminSupabase
    .from('matches')
    .select(`
      id,
      similarity,
      photos (
        id,
        storage_path,
        thumbnail_path,
        preview_path,
        filename
      )
    `)
    .eq('guest_session_id', sessionId)
    .order('similarity', { ascending: false });

  if (error) throw error;
  
  const bucketName = process.env.SUPABASE_STORAGE_BUCKET || 'event-photos';
  
  // Format to match what the frontend expects, using signed URLs
  const formattedMatches = await Promise.all(data.map(async m => {
    let previewUrl = null;
    let thumbnailUrl = null;
    
    if (m.photos.storage_path) {
      const { data: signedData } = await adminSupabase.storage.from(bucketName).createSignedUrl(m.photos.storage_path, 3600);
      if (signedData?.signedUrl) {
        previewUrl = signedData.signedUrl;
        thumbnailUrl = signedData.signedUrl; // mock thumbnail with same URL
      }
    }
    
    return {
      id: m.id,
      photo_id: m.photos.id,
      similarity_score: m.similarity,
      thumbnail_url: thumbnailUrl,
      preview_url: previewUrl
    };
  }));

  return {
    matches: formattedMatches,
    total_found: formattedMatches.length,
    processing_time_ms: 1250 // fake metric
  };
};
