import express from 'express';
const router = express.Router();
import { getLogs, exportLogs, exportLogsXcel } from '../controllers/logs.js';
import { protect } from '../middleware/auth.js';

router.post('/', protect, getLogs);
router.post('/export', protect, exportLogs);
router.post('/exportExcel', protect, exportLogsXcel);
export default router;
