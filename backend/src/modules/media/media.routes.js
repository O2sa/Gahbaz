import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { authenticateUser } from '../../core/middleware/auth.middleware.js';
import * as mediaController from './media.controller.js';

const uploadDir = path.resolve(process.cwd(), process.env.UPLOAD_DIR || 'uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = req.body.folder || 'general';
    const isPrivate = req.body.isPrivate === 'true' || req.body.isPrivate === true;
    const dest = path.join(uploadDir, isPrivate ? path.join('private', folder) : folder);
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    const uniqueId = crypto.randomUUID();
    cb(null, `${uniqueId}-${safeName}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB limit for high-res videos
});

const router = Router();

router.post('/presigned-url', authenticateUser, mediaController.getPresignedUrl);
router.post('/upload', authenticateUser, upload.single('file'), mediaController.uploadLocalFile);
router.get('/stream/*', mediaController.streamVideo);
router.get('/private/*', authenticateUser, mediaController.getPrivateFile);
router.delete('/*', authenticateUser, mediaController.deleteMedia);

export default router;
