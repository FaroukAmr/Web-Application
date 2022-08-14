import express from 'express';
const router = express.Router();
import {
  register,
  login,
  forgotpassword,
  resetpassword,
  verifyUser,
  handleExternalAuth,
} from '../controllers/auth.js';

router.post('/register', register);
router.post('/login', login);
router.post('/forgotpassword', forgotpassword);
router.put('/passwordreset/:resetToken', resetpassword);
router.get('/verify/:id/:token', verifyUser);
router.post('/login/external', handleExternalAuth);

export default router;
