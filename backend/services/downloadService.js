import supabase from '../config/supabase.js';

export const getDownloadUrl = async (photoId) => {
  const { data: photo, error } = await supabase
    .from('photos')
    .select('storage_path')
    .eq('id', photoId)
    .single();

  if (error) throw error;

  // Assuming 'event-photos' bucket is public for hackathon demo
  // we could return public URL or signed URL. 
  // For download we just return a placeholder or the actual path if storage is setup.
  return `/images/mock/photo-placeholder.jpg`;
};

export const requestZipDownload = async (photoIds, eventId, sessionId) => {
  // Mocking the FastAPI ZIP compilation process
  // In a real app this creates a background job and returns a job ID
  return {
    status: 'ready',
    progress_percent: 100,
    download_url: '/mock-download.zip',
    file_count: photoIds.length,
    total_size_bytes: photoIds.length * 3 * 1024 * 1024
  };
};

export const getZipProgress = async (downloadId) => {
  return {
    status: 'ready',
    progress_percent: 100,
    download_url: '/mock-download.zip',
    file_count: 8,
    total_size_bytes: 24 * 1024 * 1024
  };
};
