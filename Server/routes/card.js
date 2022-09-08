import {
  createCard,
  deleteCard,
  getCards,
  shareCard,
  updateCard,
} from '../controllers/card.js';

import express from 'express';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/create', protect, createCard);
router.get('/', protect, getCards);
router.post('/delete', protect, deleteCard);
router.post('/update', protect, updateCard);
router.post('/share', protect, shareCard);

export default router;
