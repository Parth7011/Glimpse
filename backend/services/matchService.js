import supabase from '../config/supabase.js';
import { v4 as uuidv4 } from 'uuid';

export const matchSelfie = async (eventId, sessionId, selfieFile) => {
  // In a real application, this would:
  // 1. Upload selfie
  // 2. Call FastAPI for face detection and matching
  // 3. FastAPI would write to the `matches` table
  
  // Since we are mocking the ML part but keeping the DB part real,
  // we will just fetch ALL photos for this event and create fake matches
  // in the database so the frontend has real data to read.
  
  const { data: photos, error: photoError } = await supabase
    .from('photos')
    .select('id')
    .eq('event_id', eventId);
    
  if (photoError) throw photoError;
  
  // Create fake matches for up to 5 photos
  const matchesToInsert = photos.slice(0, 5).map(photo => ({
    id: uuidv4(),
    guest_session_id: sessionId,
    photo_id: photo.id,
    face_id: null, // No real face_id since no ML
    similarity: 0.95 + (Math.random() * 0.04)
  }));
  
  if (matchesToInsert.length > 0) {
    const { error: matchError } = await supabase
      .from('matches')
      .insert(matchesToInsert);
      
    if (matchError) throw matchError;
  }
  
  // Return the matches joined with photos
  return getMatches(sessionId);
};

export const getMatches = async (sessionId) => {
  const { data, error } = await supabase
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
  
  // Format to match what the frontend expects
  const formattedMatches = data.map(m => ({
    id: m.id,
    photo_id: m.photos.id,
    similarity_score: m.similarity,
    thumbnail_url: m.photos.thumbnail_path || m.photos.storage_path,
    preview_url: m.photos.preview_path || m.photos.storage_path
  }));

  return {
    matches: formattedMatches,
    total_found: formattedMatches.length,
    processing_time_ms: 1250 // fake metric
  };
};
