import express from 'express';
import { 
  listEvents, 
  getDashboardStats, 
  createEvent, 
  getEvent, 
  getEventBySlug, 
  updateEvent, 
  getShareInfo 
} from '../controllers/eventController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/slug/:slug', getEventBySlug);

// Protected routes
router.use(authMiddleware);

router.get('/', listEvents);
router.post('/', createEvent);
router.get('/stats', getDashboardStats);
router.get('/:id', getEvent);
router.put('/:id', updateEvent);
router.get('/:id/share', getShareInfo);

export default router;
