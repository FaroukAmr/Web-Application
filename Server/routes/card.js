import express from 'express';
const router = express.Router();
import {
  createCard,
  getCards,
  deleteCard,
  updateCard,
  shareCard,
} from '../controllers/card.js';
import { protect } from '../middleware/auth.js';

router.post('/create', protect, createCard);
router.get('/', protect, getCards);
router.post('/delete', protect, deleteCard);
router.post('/update', protect, updateCard);
router.post('/share', protect, shareCard);

export default router;
