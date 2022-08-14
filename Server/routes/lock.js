import express from 'express';
const router = express.Router();
import {
  createLock,
  getLocks,
  getLock,
  deleteLock,
  exportLocks,
} from '../controllers/lock.js';
import { protect } from '../middleware/auth.js';

router.post('/create', protect, createLock);
router.post('/getLock', protect, getLock);
router.get('/all', protect, getLocks);
router.post('/delete', protect, deleteLock);
router.get('/export', protect, exportLocks);

export default router;
