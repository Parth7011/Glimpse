/* ============================================
   Download Service — mock implementation
   Later: Next.js Route Handler → FastAPI zipfile
   ============================================ */

import { sleep } from '@/utils/utils';
export const downloadService = {
  /** Download a single photo by ID */
  async downloadPhoto(photoId, eventId) {
    await sleep(500);
    // Mock: return a placeholder URL
    return `/images/mock/photo-placeholder.jpg`;
  },
  /** Request a ZIP of multiple photos */
  async requestZipDownload(photoIds, eventId, sessionId) {
    await sleep(2000);
    return {
      status: 'ready',
      progress_percent: 100,
      download_url: '/mock-download.zip',
      file_count: photoIds.length,
      total_size_bytes: photoIds.length * 3 * 1024 * 1024
    };
  },
  /** Poll ZIP generation progress */
  async getZipProgress(downloadId) {
    await sleep(300);
    return {
      status: 'ready',
      progress_percent: 100,
      download_url: '/mock-download.zip',
      file_count: 8,
      total_size_bytes: 24 * 1024 * 1024
    };
  }
};