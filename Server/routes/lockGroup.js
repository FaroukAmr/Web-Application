import {
  createGroup,
  deleteGroup,
  getGroups,
  updateGroup,
} from '../controllers/lockGroup.js';

import express from 'express';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/create', protect, createGroup);
router.post('/delete', protect, deleteGroup);
router.post('/update', protect, updateGroup);
router.get('/', protect, getGroups);

export default router;
