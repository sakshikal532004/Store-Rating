import express = require('express');
import { getStores, addStore } from '../controllers/storeController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').get(protect, getStores).post(protect, admin, addStore);

export default router;