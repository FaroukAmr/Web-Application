import {
  createEkey,
  deleteEkey,
  deleteLockEkeys,
  getEkeys,
  getLockEkeys,
  updateEkey,
} from '../controllers/ekey.js';

import express from 'express';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/create', protect, createEkey);
router.get('/all', protect, getEkeys);
router.post('/lock', protect, getLockEkeys);
router.post('/deletemany', protect, deleteLockEkeys);
router.post('/delete', protect, deleteEkey);
router.post('/update', protect, updateEkey);
export default router;
