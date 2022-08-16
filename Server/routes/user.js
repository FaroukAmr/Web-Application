import express from 'express';
import { protect } from '../middleware/auth.js';
import { getUser, updateUser } from '../controllers/user.js';
const router = express.Router();

router.get('/', protect, getUser);
router.post('/', protect, updateUser);

export default router;
