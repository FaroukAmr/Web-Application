import express from 'express';
import { getDemo } from '../controllers/demo.js';

const router = express.Router();

router.get('/', getDemo);
export default router;
