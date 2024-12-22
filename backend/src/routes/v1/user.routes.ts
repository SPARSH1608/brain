import express from 'express';
import { createUser, login } from '../../controllers/user.controller';
import authMiddleware from '../../middlewares/middleware';
import {
  createContent,
  deleteContent,
  getContents,
} from '../../controllers/content.controller';
import { createLink, sharedLink } from '../../controllers/share.controller';

const router = express.Router();

router.post('/signup', createUser);
router.post('/signin', login);

router.post('/content', authMiddleware, createContent);

router.get('/content', authMiddleware, getContents);

router.delete('/content', authMiddleware, deleteContent);

router.post('/brain/share', authMiddleware, createLink);

router.get('/brain/:shareLink', sharedLink);

export default router;
