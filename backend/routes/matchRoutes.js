import express from 'express';
import multer from 'multer';
import { matchSelfie, getMatches } from '../controllers/matchController.js';
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
router.post('/selfie', upload.single('selfie'), matchSelfie);
router.get('/:sessionId', getMatches);
export default router;
