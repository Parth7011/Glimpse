import * as guestService from '../services/guestService.js';

export const createSession = async (req, res) => {
  try {
    const { eventSlug } = req.body;
    if (!eventSlug) return res.status(400).json({ error: 'eventSlug is required' });
    
    const session = await guestService.createSession(eventSlug);
    res.status(201).json({ session });
  } catch (error) {
    console.error('Create session error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const recordConsent = async (req, res) => {
  try {
    const { event_id, session_id, consent_given } = req.body;
    if (!event_id || !session_id) return res.status(400).json({ error: 'event_id and session_id are required' });
    
    const consent = await guestService.recordConsent(event_id, session_id, consent_given);
    res.status(201).json(consent);
  } catch (error) {
    console.error('Record consent error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const validateSession = async (req, res) => {
  try {
    const { token } = req.params;
    const session = await guestService.validateSession(token);
    res.status(200).json(session);
  } catch (error) {
    console.error('Validate session error:', error);
    res.status(401).json({ error: error.message });
  }
};
