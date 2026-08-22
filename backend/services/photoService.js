import supabase, { adminSupabase } from '../config/supabase.js';
import { v4 as uuidv4 } from 'uuid';

export const listPhotos = async (eventId) => {
  const { data, error } = await adminSupabase
    .from('photos')
    .select('*')
    .eq('event_id', eventId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  const bucketName = process.env.SUPABASE_STORAGE_BUCKET || 'event-photos';
  
  // Attach signed URLs for previews
  const photosWithUrls = await Promise.all(data.map(async (photo) => {
    if (photo.storage_path) {
      const { data: signedData } = await adminSupabase.storage.from(bucketName).createSignedUrl(photo.storage_path, 3600);
      if (signedData?.signedUrl) {
        photo.preview_url = signedData.signedUrl;
      }
    }
    return photo;
  }));
  
  return photosWithUrls;
};

export const uploadAndProcessPhoto = async (eventId, file, metadata) => {
  const id = uuidv4();
  const bucketName = process.env.SUPABASE_STORAGE_BUCKET || 'event-photos';
  
  // Clean filename and create storage path
  const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
  const storagePath = `events/${eventId}/${id}_${sanitizedName}`;

  // 1. Upload to Supabase Storage
  const { error: uploadError } = await adminSupabase.storage
    .from(bucketName)
    .upload(storagePath, file.buffer, {
      contentType: file.mimetype,
      upsert: true
    });

  if (uploadError) {
    console.error('Storage upload error:', uploadError);
    throw new Error(`Failed to upload to storage: ${uploadError.message}`);
  }

  // 2. Insert Database Record
  const { data, error } = await adminSupabase
    .from('photos')
    .insert([{
      id,
      event_id: eventId,
      storage_path: storagePath,
      thumbnail_path: null,
      preview_path: null,
      filename: file.originalname,
      status: 'uploaded', // Mock ML will mark as ready later
      face_count: 0,
      width: metadata.width ? parseInt(metadata.width) : null,
      height: metadata.height ? parseInt(metadata.height) : null,
      size_bytes: file.size,
      created_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) throw error;
  
  // Update photo count robustly by recounting to prevent race conditions during bulk upload
  const { count } = await adminSupabase
    .from('photos')
    .select('*', { count: 'exact', head: true })
    .eq('event_id', eventId);
    
  if (count !== null) {
    await adminSupabase.from('events').update({ photo_count: count }).eq('id', eventId);
  }
  
  return data;
};

export const getSignedUrl = async (photoId) => {
  const { data: photo, error: photoError } = await adminSupabase
    .from('photos')
    .select('storage_path')
    .eq('id', photoId)
    .single();

  if (photoError) throw photoError;

  // Since we don't have real storage setup with RLS in this mock/Express fallback,
  // we will just return a public URL if the bucket is public, or a signed URL.
  // For the hackathon, we assume the bucket 'event-photos' exists.
  const { data, error } = await adminSupabase
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
  const { data: photos, error } = await adminSupabase
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
  // 1. Update event status to processing
  const { error: eventError } = await adminSupabase
    .from('events')
    .update({ status: 'processing' })
    .eq('id', eventId);
    
  if (eventError) throw eventError;
  
  // 2. Fetch all unprocessed photos for this event
  const { data: photos, error: fetchError } = await adminSupabase
    .from('photos')
    .select('id, storage_path, filename')
    .eq('event_id', eventId)
    .eq('status', 'uploaded');

  if (fetchError) throw fetchError;
  if (!photos || photos.length === 0) return;

  // 3. Mark them as processing in the DB
  await adminSupabase
    .from('photos')
    .update({ status: 'processing' })
    .in('id', photos.map(p => p.id));

  // 4. Send to ML Pipeline concurrently
  try {
    const mlEndpoint = "https://ritishmahajan15--glimpse-ml-pipeline-fastapi-app.modal.run";

    // We do NOT wait for this to finish before returning to the frontend.
    // The ML Pipeline will process photos, and we update the event when all are done.
    Promise.allSettled(photos.map(async (photo) => {
      try {
        const response = await fetch(`${mlEndpoint}/process-photo`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                event_id: eventId,
                photo_id: photo.id,
                storage_path: photo.storage_path,
                filename: photo.filename
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log(`Successfully processed photo ${photo.id}`);
      } catch (err) {
        console.error(`Failed to process photo ${photo.id}:`, err);
        // Fallback: Mark failed in DB if the Gradio call crashes
        await adminSupabase.from('photos').update({ status: 'failed' }).eq('id', photo.id);
      }
    })).then(async () => {
      try {
        const { count: photoCount } = await adminSupabase.from('photos').select('*', { count: 'exact', head: true }).eq('event_id', eventId);
        const { count: faceCount } = await adminSupabase.from('faces').select('*', { count: 'exact', head: true }).eq('event_id', eventId);
        
        await adminSupabase.from('events').update({
          status: 'ready',
          photo_count: photoCount || 0,
          face_count: faceCount || 0
        }).eq('id', eventId);
        console.log(`Event ${eventId} marked as ready.`);
      } catch (err) {
        console.error(`Failed to update event ${eventId} status to ready:`, err);
      }
    });

  } catch (err) {
    console.error("Failed to connect to ML Pipeline:", err);
    throw new Error("ML Pipeline connection failed: " + err.message);
  }
};
