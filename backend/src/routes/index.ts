import express from 'express';
const router = express.Router();
import UserRoutes from './v1/user.routes';

router.get('/user', UserRoutes);

export default router;
