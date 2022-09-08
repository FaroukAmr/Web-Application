import { exportLogs, exportLogsXcel, getLogs } from '../controllers/logs.js';

import express from 'express';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, getLogs);
router.post('/export', protect, exportLogs);
router.post('/exportExcel', protect, exportLogsXcel);
export default router;
