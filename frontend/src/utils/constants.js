/* ============================================
   Application Constants
   ============================================ */

export const APP_NAME = 'Glimpse';
export const APP_TAGLINE = 'Every moment. Find yours.';
export const APP_DESCRIPTION = 'AI-powered event photo delivery. Photographers upload once — every guest finds their own moments with a single selfie.';

/** Routes */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  EVENTS_NEW: '/events/new',
  EVENT: id => `/events/${id}`,
  EVENT_UPLOAD: id => `/events/${id}/upload`,
  EVENT_SHARE: id => `/events/${id}/share`,
  GUEST_EVENT: slug => `/e/${slug}`,
  GUEST_SELFIE: slug => `/e/${slug}/selfie`,
  GUEST_RESULTS: slug => `/e/${slug}/results`
};

/** API endpoints (Next.js Route Handlers) */
export const API = {
  AUTH_CALLBACK: '/api/auth/callback',
  EVENTS: '/api/events',
  EVENT: id => `/api/events/${id}`,
  EVENT_PHOTOS: id => `/api/events/${id}/photos`,
  EVENT_PROCESS: id => `/api/events/${id}/process`,
  EVENT_SHARE: id => `/api/events/${id}/share`,
  GUEST_SESSION: '/api/guest/session',
  GUEST_CONSENT: '/api/guest/consent',
  GUEST_MATCH: '/api/guest/match',
  GUEST_DOWNLOAD: '/api/guest/download',
  PHOTO: id => `/api/photos/${id}`
};

/** Upload constraints */
export const UPLOAD = {
  MAX_FILE_SIZE: 15 * 1024 * 1024,
  // 15MB
  ACCEPTED_TYPES: ['image/jpeg', 'image/png', 'image/heic', 'image/webp'],
  ACCEPTED_EXTENSIONS: '.jpg,.jpeg,.png,.heic,.webp',
  MAX_BATCH_SIZE: 50,
  SELFIE_MAX_SIZE: 2 * 1024 * 1024,
  // 2MB (after compression)
  SELFIE_COMPRESSION_QUALITY: 0.8
};

/** Face matching */
export const MATCHING = {
  SIMILARITY_THRESHOLD: 0.6,
  POLL_INTERVAL_MS: 2500
};

/** Breakpoints matching Tailwind defaults */
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280
};