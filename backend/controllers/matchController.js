import * as matchService from '../services/matchService.js';
export const matchSelfie = async (req, res) => {
  try {
    const { eventId, sessionId } = req.body;
    const selfieFile = req.file;
    if (!selfieFile) return res.status(400).json({ error: "Missing selfie file" });
    const result = await matchService.matchSelfie(eventId, sessionId, selfieFile);
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
    res.status(200).json(result.matches);
  } catch (error) {
    console.error('Get matches error:', error);
    res.status(500).json({ error: error.message });
  }
};
