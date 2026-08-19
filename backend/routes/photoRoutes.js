import express from 'express';
import multer from 'multer';
import { 
  listPhotos, 
  uploadPhoto, 
  getSignedUrl, 
  getProcessingProgress, 
  triggerProcessing 
} from '../controllers/photoController.js';
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

// Get signed URL is used by guests too, so it might need different auth,
// but for simplicity we will make them all public or selectively protected.
// For now, let's keep them public for easy guest access, or protect the upload ones.
// The ML schema doesn't strictly dictate this, but to keep the frontend working easily:

router.get('/event/:eventId', listPhotos);
router.post('/event/:eventId/upload', upload.single('photo'), uploadPhoto);
router.get('/:photoId/url', getSignedUrl);
router.get('/event/:eventId/progress', getProcessingProgress);
router.post('/event/:eventId/process', triggerProcessing);

export default router;
