import { adminSupabase } from '../config/supabase.js';
import { v4 as uuidv4 } from 'uuid';

export const matchSelfie = async (eventId, sessionId, selfieFile) => {
  const sessionToken = `session-${uuidv4()}`;
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  
  const { error: sessionError } = await adminSupabase.from('guest_sessions').upsert([{
    id: sessionId,
    event_id: eventId,
    session_token: sessionToken,
    expires_at: expiresAt
  }]);
  if (sessionError) throw sessionError;

  const bucketName = process.env.SUPABASE_STORAGE_BUCKET || 'event-photos';
  const storagePath = `guest-selfies/${eventId}/${sessionId}.jpg`;
  
  const { error: uploadError } = await adminSupabase.storage
    .from(bucketName)
    .upload(storagePath, selfieFile.buffer, {
      contentType: selfieFile.mimetype,
      upsert: true
    });
  if (uploadError) throw new Error('Failed to upload selfie');

  const mlEndpoint = "https://ritishmahajan15--glimpse-ml-pipeline-fastapi-app.modal.run";
  const response = await fetch(`${mlEndpoint}/match-selfie`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event_id: eventId,
      storage_path: storagePath,
      top_k: 20,
      similarity_threshold: 0.45
    })
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.detail || `ML Pipeline error: ${response.status}`);
  }

  const mlPayload = await response.json();
  const matchedFaces = mlPayload.matches || [];

  if (matchedFaces.length > 0) {
    await adminSupabase.from('matches').delete().eq('guest_session_id', sessionId);
    const matchesToInsert = matchedFaces.map(match => ({
      id: uuidv4(),
      guest_session_id: sessionId,
      photo_id: match.photo_id,
      face_id: match.face_id,
      similarity: match.similarity
    }));
    const { error: matchError } = await adminSupabase.from('matches').insert(matchesToInsert);
    if (matchError) throw matchError;
  }
  return getMatches(sessionId);
};

export const getMatches = async (sessionId) => {
  const { data, error } = await adminSupabase
    .from('matches')
    .select(`id, similarity, photos (id, storage_path, thumbnail_path, preview_path, filename)`)
    .eq('guest_session_id', sessionId)
    .order('similarity', { ascending: false });

  if (error) throw error;
  
  const bucketName = process.env.SUPABASE_STORAGE_BUCKET || 'event-photos';
  const formattedMatches = await Promise.all(data.map(async m => {
    let previewUrl = null, thumbnailUrl = null;
    if (m.photos && m.photos.storage_path) {
      const { data: signedData } = await adminSupabase.storage.from(bucketName).createSignedUrl(m.photos.storage_path, 3600);
      if (signedData?.signedUrl) {
        previewUrl = signedData.signedUrl;
        thumbnailUrl = signedData.signedUrl; 
      }
    }
    return {
      id: m.id, photo_id: m.photos ? m.photos.id : null,
      similarity_score: m.similarity,
      thumbnail_url: thumbnailUrl, preview_url: previewUrl
    };
  }));

  const validMatches = formattedMatches.filter(m => m.photo_id);
  return { matches: validMatches, total_found: validMatches.length, processing_time_ms: 0 };
};
