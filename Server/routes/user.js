import {
  getUser,
  testSMS,
  updatePassword,
  updateUser,
} from '../controllers/user.js';

import express from 'express';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getUser);
router.post('/', protect, updateUser);
router.post('/sendsms', protect, testSMS);

router.post('/updatepassword', protect, updatePassword);
export default router;
