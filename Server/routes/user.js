import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getUser,
  updateUser,
  updatePassword,
  uploadImage,
} from '../controllers/user.js';
const router = express.Router();

router.get('/', protect, getUser);
router.post('/', protect, updateUser);
router.post('/updatepassword', protect, updatePassword);
router.post('/upload', protect, uploadImage);
export default router;
