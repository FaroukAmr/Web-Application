import express from 'express';
const router = express.Router();
import { getLogs, exportLogs } from '../controllers/logs.js';
import { protect } from '../middleware/auth.js';

router.post('/', protect, getLogs);
router.post('/export', protect, exportLogs);

export default router;
