import supabase from '../config/supabase.js';
import { v4 as uuidv4 } from 'uuid';

export const listPhotos = async (eventId) => {
  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .eq('event_id', eventId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const createPhotoRecord = async (eventId, photoData) => {
  const id = uuidv4();
  const { data, error } = await supabase
    .from('photos')
    .insert([{
      id,
      event_id: eventId,
      storage_path: photoData.storage_path,
      thumbnail_path: photoData.thumbnail_path || null,
      preview_path: photoData.preview_path || null,
      filename: photoData.filename,
      status: 'uploaded',
      face_count: 0,
      width: photoData.width || null,
      height: photoData.height || null,
      size_bytes: photoData.size_bytes || null,
      created_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) throw error;
  
  // Update event photo_count
  const { data: event } = await supabase.from('events').select('photo_count').eq('id', eventId).single();
  if (event) {
    await supabase.from('events').update({ photo_count: (event.photo_count || 0) + 1 }).eq('id', eventId);
  }
  
  return data;
};

export const getSignedUrl = async (photoId) => {
  const { data: photo, error: photoError } = await supabase
    .from('photos')
    .select('storage_path')
    .eq('id', photoId)
    .single();

  if (photoError) throw photoError;

  // Since we don't have real storage setup with RLS in this mock/Express fallback,
  // we will just return a public URL if the bucket is public, or a signed URL.
  // For the hackathon, we assume the bucket 'event-photos' exists.
  const { data, error } = await supabase
    .storage
    .from('event-photos')
    .createSignedUrl(photo.storage_path, 3600); // 1 hour

  if (error) {
    console.error("Storage error (ignoring for hackathon demo):", error);
    return { url: `/images/mock/photo-placeholder.jpg`, expires_at: new Date(Date.now() + 3600000).toISOString() };
  }
  
  return {
    url: data.signedUrl,
    expires_at: new Date(Date.now() + 3600 * 1000).toISOString()
  };
};

export const getProcessingProgress = async (eventId) => {
  const { data: photos, error } = await supabase
    .from('photos')
    .select('status, face_count')
    .eq('event_id', eventId);

  if (error) throw error;

  const total = photos.length;
  const processed = photos.filter(p => p.status === 'ready').length;
  const percent = total > 0 ? Math.round((processed / total) * 100) : 0;
  
  return {
    event_id: eventId,
    status: percent === 100 ? 'ready' : 'processing',
    current_step: percent === 100 ? 'complete' : 'detecting_faces',
    total_photos: total,
    processed_photos: processed,
    total_faces: photos.reduce((sum, p) => sum + (p.face_count || 0), 0),
    progress_percent: percent
  };
};

export const triggerProcessing = async (eventId) => {
  // Normally this would call the FastAPI ML service.
  // For now, we just update the DB to simulate it starting.
  const { error } = await supabase
    .from('events')
    .update({ status: 'processing' })
    .eq('id', eventId);
    
  if (error) throw error;
  
  // Mock: instantly mark photos as ready
  await supabase
    .from('photos')
    .update({ status: 'ready', face_count: 1 })
    .eq('event_id', eventId)
    .eq('status', 'uploaded');
};
