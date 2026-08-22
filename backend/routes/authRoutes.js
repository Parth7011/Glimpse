import express from 'express';
import { register, login, getMe, updateMe, uploadLogo } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, getMe);
router.put('/me', authMiddleware, updateMe);
router.post('/me/logo', authMiddleware, upload.single('logo'), uploadLogo);

export default router;
