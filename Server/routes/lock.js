import {
  createLock,
  deleteLock,
  exportLocks,
  exportLocksXcel,
  getLock,
  getLocks,
} from '../controllers/lock.js';

import express from 'express';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/create', protect, createLock);
router.post('/getLock', protect, getLock);
router.get('/all', protect, getLocks);
router.post('/delete', protect, deleteLock);
router.get('/export', protect, exportLocks);
router.get('/exportXsl', protect, exportLocksXcel);
export default router;
