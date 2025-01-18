import express, { NextFunction, Request, Response } from 'express';

import { createUser, getUser, login } from '../../controllers/user.controller';
import authMiddleware from '../../middlewares/middleware';
import {
  createContent,
  deleteContent,
  findContents,
  getContents,
  getCount,
  searchContent,
} from '../../controllers/content.controller';
import { createLink, sharedLink } from '../../controllers/share.controller';
import multer from 'multer';

const router = express.Router();

router.get('/getUser', authMiddleware, getUser);
router.post('/signup', createUser);
router.post('/signin', login);
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });
// POST route to handle content creation
router.post('/content', authMiddleware, upload.single('files'), createContent);

router.get('/content', authMiddleware, getContents);

router.get('/count', authMiddleware, getCount);
router.delete('/content', authMiddleware, deleteContent);

router.post('/brain/share', authMiddleware, createLink);

router.get('/brain/:shareLink', sharedLink);

router.get('/search', authMiddleware, searchContent);
router.get('/searchcontent', authMiddleware, findContents);

export default router;
