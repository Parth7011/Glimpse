/* ============================================
   Photo Service — mock implementation
   Later: Next.js Route Handlers → Supabase Storage + FastAPI
   ============================================ */

import { MOCK_PHOTOS } from '../data/mockData';
import { sleep, generateId } from '@/utils/utils';
let _photos = [...MOCK_PHOTOS];
export const photoService = {
  /** List photos for an event */
  async listPhotos(eventId) {
    await sleep(500);
    const photos = _photos.filter(p => p.event_id === eventId);
    return {
      photos,
      total: photos.length
    };
  },
  /** Upload a photo (mock: just create a record) */
  async uploadPhoto(eventId, file) {
    await sleep(1200);
    const photo = {
      id: generateId(),
      event_id: eventId,
      storage_path: `/events/${eventId}/originals/${file.name}`,
      thumbnail_path: `/events/${eventId}/thumbnails/${file.name.replace(/\.\w+$/, '.webp')}`,
      preview_path: `/events/${eventId}/previews/${file.name.replace(/\.\w+$/, '.webp')}`,
      filename: file.name,
      status: 'uploaded',
      face_count: 0,
      width: 4000,
      height: 2667,
      size_bytes: file.size,
      created_at: new Date().toISOString()
    };
    _photos = [..._photos, photo];
    return photo;
  },
  /** Get a signed URL for a photo */
  async getSignedUrl(photoId) {
    await sleep(200);
    return {
      url: `/images/mock/photo-placeholder.jpg`,
      expires_at: new Date(Date.now() + 3600 * 1000).toISOString()
    };
  },
  /** Get processing progress for an event */
  async getProcessingProgress(eventId) {
    await sleep(300);
    const photos = _photos.filter(p => p.event_id === eventId);
    const processed = photos.filter(p => p.status === 'ready').length;
    const total = photos.length;
    const percent = total > 0 ? Math.round(processed / total * 100) : 0;
    return {
      event_id: eventId,
      status: percent === 100 ? 'ready' : 'processing',
      current_step: percent === 100 ? 'complete' : 'detecting_faces',
      total_photos: total,
      processed_photos: processed,
      total_faces: photos.reduce((sum, p) => sum + p.face_count, 0),
      progress_percent: percent
    };
  },
  /** Trigger processing for an event's photos */
  async triggerProcessing(eventId) {
    await sleep(500);
    // Mock: mark all photos as processing
    _photos = _photos.map(p => p.event_id === eventId ? {
      ...p,
      status: 'processing'
    } : p);
  }
};