import express from 'express';
const router = express.Router();
import {
  createLock,
  getLocks,
  getLock,
  deleteLock,
  exportLocks,
  exportLocksXcel,
} from '../controllers/lock.js';
import { protect } from '../middleware/auth.js';

router.post('/create', protect, createLock);
router.post('/getLock', protect, getLock);
router.get('/all', protect, getLocks);
router.post('/delete', protect, deleteLock);
router.get('/export', protect, exportLocks);
router.get('/exportXsl', protect, exportLocksXcel);
export default router;
