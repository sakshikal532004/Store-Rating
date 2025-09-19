import express = require('express');
import { getUsers, addUser, updateUserPassword } from '../controllers/userController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').get(protect, admin, getUsers).post(protect, admin, addUser);
router.put('/password', protect, updateUserPassword);

export default router;