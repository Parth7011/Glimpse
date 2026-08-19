import * as eventService from '../services/eventService.js';

export const listEvents = async (req, res) => {
  try {
    const photographerId = req.user.id;
    const events = await eventService.listEvents(photographerId);
    
    res.status(200).json({
      events,
      total: events.length
    });
  } catch (error) {
    console.error('List events error:', error);
    res.status(500).json({ error: error.message || 'Failed to list events' });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const photographerId = req.user.id;
    const stats = await eventService.getDashboardStats(photographerId);
    
    res.status(200).json(stats);
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: error.message || 'Failed to get dashboard stats' });
  }
};

export const createEvent = async (req, res) => {
  try {
    const photographerId = req.user.id;
    const event = await eventService.createEvent(photographerId, req.body);
    res.status(201).json(event);
  } catch (error) {
    console.error('Create event error:', error);
    import('fs').then(fs => fs.writeFileSync('error_log.json', JSON.stringify(error, null, 2)));
    res.status(500).json({ error: error.message || 'Failed to create event' });
  }
};

export const getEvent = async (req, res) => {
  try {
    const photographerId = req.user.id;
    const { id } = req.params;
    const event = await eventService.getEvent(photographerId, id);
    res.status(200).json(event);
  } catch (error) {
    console.error('Get event error:', error);
    res.status(404).json({ error: 'Event not found' });
  }
};

// Public route for guests
export const getEventBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const event = await eventService.getEventBySlug(slug);
    res.status(200).json(event);
  } catch (error) {
    console.error('Get event by slug error:', error);
    res.status(404).json({ error: 'Event not found' });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const photographerId = req.user.id;
    const { id } = req.params;
    const event = await eventService.updateEvent(photographerId, id, req.body);
    res.status(200).json(event);
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ error: error.message || 'Failed to update event' });
  }
};

export const getShareInfo = async (req, res) => {
  try {
    const photographerId = req.user.id;
    const { id } = req.params;
    const shareInfo = await eventService.getShareInfo(photographerId, id);
    res.status(200).json(shareInfo);
  } catch (error) {
    console.error('Get share info error:', error);
    res.status(500).json({ error: error.message || 'Failed to get share info' });
  }
};
