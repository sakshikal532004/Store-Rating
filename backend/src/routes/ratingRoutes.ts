import express = require('express');
import { getAllRatings, getUserRatings, getStoreRatings, addOrUpdateRating } from '../controllers/ratingController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', protect, admin, getAllRatings);
router.get('/user', protect, getUserRatings);
router.get('/store/:id', protect, getStoreRatings);
router.post('/', protect, addOrUpdateRating);

export default router;