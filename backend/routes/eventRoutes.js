import express from 'express';
import { 
  listEvents, 
  getDashboardStats, 
  createEvent, 
  getEvent, 
  getEventBySlug, 
  updateEvent, 
  getShareInfo,
  searchEvents,
  deleteEvent,
  uploadCoverPhoto
} from '../controllers/eventController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

// Public routes
router.get('/search', searchEvents);
router.get('/slug/:slug', getEventBySlug);

// Protected routes
router.use(authMiddleware);

router.get('/', listEvents);
router.post('/', createEvent);
router.get('/stats', getDashboardStats);
router.get('/:id', getEvent);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);
router.post('/:id/cover', upload.single('cover'), uploadCoverPhoto);
router.get('/:id/share', getShareInfo);

export default router;
