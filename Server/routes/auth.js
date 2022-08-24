import express from 'express';
import csrf from 'csurf';
import rateLimit from 'express-rate-limit';
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

const emailLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 2, // Limit each IP to 2 requests per `window` (here, per 15 minute)
  message: 'Too many requests, try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 60 seconds
  max: 10, // Limit each IP to 10 requests per `window` (here, per 1 minute)
  message: 'Too many requests, try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
router.post('/register', apiLimiter, csrfProtection, register);
router.post('/login', apiLimiter, csrfProtection, login);
router.post('/forgotpassword', emailLimiter, csrfProtection, forgotpassword);
router.put(
  '/passwordreset/:resetToken',
  apiLimiter,
  csrfProtection,
  resetpassword
);
router.get('/verify/:id/:token', apiLimiter, csrfProtection, verifyUser);
router.post('/login/external', apiLimiter, handleExternalAuth);

export default router;
