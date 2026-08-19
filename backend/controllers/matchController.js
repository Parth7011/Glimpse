import * as matchService from '../services/matchService.js';

export const matchSelfie = async (req, res) => {
  try {
    const { eventId, sessionId } = req.body;
    // req.file would contain the selfie if using multer.
    // For now, we are just mocking the ML payload response.
    const result = await matchService.matchSelfie(eventId, sessionId, null);
    res.status(200).json(result);
  } catch (error) {
    console.error('Match selfie error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getMatches = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const result = await matchService.getMatches(sessionId);
    // Return array directly or the whole object depending on frontend expectation.
    // Frontend matchingService.getMatches returns the array.
    res.status(200).json(result.matches);
  } catch (error) {
    console.error('Get matches error:', error);
    res.status(500).json({ error: error.message });
  }
};
