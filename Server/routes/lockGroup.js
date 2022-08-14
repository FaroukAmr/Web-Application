import express from 'express';
const router = express.Router();
import {
  createGroup,
  getGroups,
  deleteGroup,
  updateGroup,
} from '../controllers/lockGroup.js';
import { protect } from '../middleware/auth.js';

router.post('/create', protect, createGroup);
router.post('/delete', protect, deleteGroup);
router.post('/update', protect, updateGroup);
router.get('/', protect, getGroups);

export default router;
