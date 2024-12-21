import express from 'express';
const router = express.Router();

router.post('/signup', (req, res, next) => {});
router.post('/signin', (req, res, next) => {});

router.post('/content', (req, res, next) => {});

router.get('/content', (req, res, next) => {});

router.delete('/content', (req, res, next) => {});

router.post('/brain/share', (req, res, next) => {});

router.get('/brain/:shareLink', (req, res, next) => {});
export default router;
