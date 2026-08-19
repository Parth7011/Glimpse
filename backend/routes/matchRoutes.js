import express from 'express';
import { 
  matchSelfie, 
  getMatches 
} from '../controllers/matchController.js';

const router = express.Router();

// Match routes are public for guests
router.post('/selfie', matchSelfie);
router.get('/:sessionId', getMatches);

export default router;
