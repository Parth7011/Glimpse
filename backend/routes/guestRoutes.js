import express from 'express';
import { 
  createSession, 
  recordConsent, 
  validateSession 
} from '../controllers/guestController.js';

const router = express.Router();

// Guest routes are public
router.post('/session', createSession);
router.post('/consent', recordConsent);
router.get('/validate/:token', validateSession);

export default router;
