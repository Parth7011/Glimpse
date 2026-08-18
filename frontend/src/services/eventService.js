/* ============================================
   Event Service — mock implementation
   Later: Next.js Route Handlers → Supabase
   ============================================ */

import { MOCK_EVENTS, MOCK_DASHBOARD_STATS } from '../data/mockData';
import { sleep, generateId, generateSlug } from '@/utils/utils';

// Mutable copy for mock CRUD
let _events = [...MOCK_EVENTS];
export const eventService = {
  /** List all events for the authenticated photographer */
  async listEvents() {
    await sleep(600);
    return {
      events: _events,
      total: _events.length
    };
  },
  /** Get a single event by ID */
  async getEvent(eventId) {
    await sleep(400);
    return _events.find(e => e.id === eventId) ?? null;
  },
  /** Get a single event by slug (for guest access) */
  async getEventBySlug(slug) {
    await sleep(400);
    return _events.find(e => e.slug === slug) ?? null;
  },
  /** Create a new event */
  async createEvent(req) {
    await sleep(800);
    const newEvent = {
      id: generateId(),
      photographer_id: 'photo-001',
      name: req.name,
      slug: generateSlug(req.name),
      date: req.date,
      cover_photo_url: undefined,
      status: 'draft',
      photo_count: 0,
      face_count: 0,
      guest_count: 0,
      created_at: new Date().toISOString()
    };
    _events = [newEvent, ..._events];
    return newEvent;
  },
  /** Update an event */
  async updateEvent(eventId, req) {
    await sleep(500);
    const idx = _events.findIndex(e => e.id === eventId);
    if (idx === -1) return null;
    _events[idx] = {
      ..._events[idx],
      ...req,
      updated_at: new Date().toISOString()
    };
    return _events[idx];
  },
  /** Get share info for an event */
  async getShareInfo(eventId) {
    await sleep(300);
    const event = _events.find(e => e.id === eventId);
    if (!event) return null;
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://glimpse.vercel.app';
    return {
      event_id: event.id,
      slug: event.slug,
      share_url: `${baseUrl}/e/${event.slug}`,
      qr_data: `${baseUrl}/e/${event.slug}`
    };
  },
  /** Get dashboard stats */
  async getDashboardStats() {
    await sleep(400);
    return MOCK_DASHBOARD_STATS;
  }
};