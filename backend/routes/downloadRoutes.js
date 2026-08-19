import express from 'express';
import { 
  downloadPhoto, 
  requestZipDownload, 
  getZipProgress 
} from '../controllers/downloadController.js';

const router = express.Router();

// Download routes are public for guests
router.get('/photo/:photoId', downloadPhoto);
router.post('/zip', requestZipDownload);
router.get('/zip/:downloadId', getZipProgress);

export default router;
