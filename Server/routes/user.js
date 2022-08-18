import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getUser,
  updateUser,
  updatePassword,
  testSMS,
} from '../controllers/user.js';
const router = express.Router();

router.get('/', protect, getUser);
router.post('/', protect, updateUser);
router.post('/sendsms', protect, testSMS);

router.post('/updatepassword', protect, updatePassword);
export default router;
