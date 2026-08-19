/* ============================================
   Mock Data — used by all services during Phase 1
   Will be replaced by real Supabase/API calls
   ============================================ */

// Curated high-quality Unsplash photos for varied event covers
const EVENT_COVERS = [
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80', // wedding ceremony
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80', // tech conference
  'https://images.unsplash.com/photo-1604017011826-d3b4c23f8914?w=800&q=80', // diwali celebration
  'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80', // birthday party
];

// Varied gallery photos for event workspace and results
export const GALLERY_PHOTOS = [
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=80',
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80',
  'https://images.unsplash.com/photo-1529543544282-ea98407407c4?w=600&q=80',
  'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&q=80',
  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&q=80',
  'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=600&q=80',
  'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=600&q=80',
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80',
  'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80',
  'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
];

export const MOCK_PHOTOGRAPHER = {
  id: 'photo-001',
  email: 'demo@glimpse.com',
  name: 'Arjun Kapoor',
  created_at: '2026-07-15T10:00:00Z'
};
export const MOCK_EVENTS = [{
  id: 'evt-001',
  photographer_id: 'photo-001',
  name: 'Aarav & Meera Wedding',
  slug: 'aarav-meera-wedding',
  date: '2026-12-18T00:00:00Z',
  cover_photo_url: EVENT_COVERS[0],
  status: 'ready',
  photo_count: 1248,
  face_count: 186,
  guest_count: 42,
  created_at: '2026-12-10T08:00:00Z'
}, {
  id: 'evt-002',
  photographer_id: 'photo-001',
  name: 'TechSummit 2026',
  slug: 'techsummit-2026',
  date: '2026-11-05T00:00:00Z',
  cover_photo_url: EVENT_COVERS[1],
  status: 'processing',
  photo_count: 534,
  face_count: 89,
  guest_count: 15,
  created_at: '2026-11-01T09:30:00Z'
}, {
  id: 'evt-003',
  photographer_id: 'photo-001',
  name: 'Diwali Celebration 2026',
  slug: 'diwali-celebration-2026',
  date: '2026-10-20T00:00:00Z',
  cover_photo_url: EVENT_COVERS[2],
  status: 'ready',
  photo_count: 892,
  face_count: 134,
  guest_count: 67,
  created_at: '2026-10-18T14:00:00Z'
}, {
  id: 'evt-004',
  photographer_id: 'photo-001',
  name: 'Priya\'s Birthday Party',
  slug: 'priyas-birthday-party',
  date: '2026-09-12T00:00:00Z',
  cover_photo_url: EVENT_COVERS[3],
  status: 'draft',
  photo_count: 0,
  face_count: 0,
  guest_count: 0,
  created_at: '2026-09-10T16:00:00Z'
}];
export const MOCK_PHOTOS = Array.from({
  length: 12
}, (_, i) => ({
  id: `photo-${String(i + 1).padStart(3, '0')}`,
  event_id: 'evt-001',
  storage_path: `/events/evt-001/originals/photo-${i + 1}.jpg`,
  thumbnail_path: `/events/evt-001/thumbnails/photo-${i + 1}.webp`,
  preview_path: `/events/evt-001/previews/photo-${i + 1}.webp`,
  // Each photo gets a unique Unsplash image
  preview_url: GALLERY_PHOTOS[i % GALLERY_PHOTOS.length],
  filename: `IMG_${1000 + i}.jpg`,
  status: 'ready',
  face_count: Math.floor(Math.random() * 5) + 1,
  width: 4000,
  height: 2667,
  size_bytes: (Math.random() * 5 + 2) * 1024 * 1024,
  created_at: new Date(Date.now() - i * 60000).toISOString()
}));
export const MOCK_MATCHES = Array.from({
  length: 8
}, (_, i) => ({
  id: `match-${String(i + 1).padStart(3, '0')}`,
  guest_session_id: 'session-001',
  photo_id: `photo-${String(i + 1).padStart(3, '0')}`,
  photo: { ...MOCK_PHOTOS[i], preview_url: GALLERY_PHOTOS[i % GALLERY_PHOTOS.length] },
  similarity: 0.92 - i * 0.03,
  created_at: new Date().toISOString()
}));
export const MOCK_DASHBOARD_STATS = {
  total_events: 4,
  total_photos: 2674,
  total_guests_matched: 124,
  events_ready: 2
};
export const MOCK_GUEST_SESSION = {
  id: 'session-001',
  event_id: 'evt-001',
  session_token: 'mock-token-abc123',
  created_at: new Date().toISOString(),
  expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
};
export const MOCK_CONSENT = {
  id: 'consent-001',
  event_id: 'evt-001',
  guest_session_id: 'session-001',
  consent_given: true,
  created_at: new Date().toISOString()
};