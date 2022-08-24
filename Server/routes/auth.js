import express from 'express';
import csrf from 'csurf';
var csrfProtection = csrf({ cookie: true });
const router = express.Router();

import {
  register,
  login,
  forgotpassword,
  resetpassword,
  verifyUser,
  handleExternalAuth,
} from '../controllers/auth.js';

router.post('/register', csrfProtection, register);
router.post('/login', csrfProtection, login);
router.post('/forgotpassword', csrfProtection, forgotpassword);
router.put('/passwordreset/:resetToken', csrfProtection, resetpassword);
router.get('/verify/:id/:token', csrfProtection, verifyUser);
router.post('/login/external', handleExternalAuth);

export default router;
