import express from 'express';
import multer from 'multer';
import { createUser, login } from '../../controllers/user.controller';
import authMiddleware from '../../middlewares/middleware';
import {
  createContent,
  deleteContent,
  findContents,
  getContents,
  searchContent,
} from '../../controllers/content.controller';
import { createLink, sharedLink } from '../../controllers/share.controller';
const router = express.Router();
import { uploadMiddleware } from '../../middlewares/multer.middleware';
router.post('/signup', createUser);
router.post('/signin', login);
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory to save files
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB file size limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'video/mp4',
      'audio/mpeg',
      'audio/wav',
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true); // Accept file
    } else {
      cb(null, false); // Reject file
    }
  },
});

router.post('/content', authMiddleware, upload.single('files'), createContent);

router.get('/content', authMiddleware, getContents);

router.delete('/content', authMiddleware, deleteContent);

router.post('/brain/share', authMiddleware, createLink);

router.get('/brain/:shareLink', sharedLink);

router.get('/search', authMiddleware, searchContent);
router.get('/searchcontent', authMiddleware, findContents);

export default router;
