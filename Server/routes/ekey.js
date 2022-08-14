import express from 'express';
const router = express.Router();
import {
  createEkey,
  getEkeys,
  getLockEkeys,
  deleteLockEkeys,
  deleteEkey,
  updateEkey,
} from '../controllers/ekey.js';
import { protect } from '../middleware/auth.js';

router.post('/create', protect, createEkey);
router.get('/all', protect, getEkeys);
router.post('/lock', protect, getLockEkeys);
router.post('/deletemany', protect, deleteLockEkeys);
router.post('/delete', protect, deleteEkey);
router.post('/update', protect, updateEkey);
export default router;
