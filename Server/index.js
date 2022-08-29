import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import lockRoutes from './routes/lock.js';
import cardRoutes from './routes/card.js';
import ekeyRoutes from './routes/ekey.js';
import logsRoutes from './routes/logs.js';
import lockGroupRoutes from './routes/lockGroup.js';
import userRoutes from './routes/user.js';
import errorHandler from './middleware/error.js';
import cors from 'cors';
import herokuSSLRedirect from 'heroku-ssl-redirect';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import compress from 'compression';
import csrf from 'csurf';
import bodyParser from 'body-parser';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
const sslRedirect = herokuSSLRedirect.default;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
var csrfProtection = csrf({ cookie: true });

dotenv.config();
const dbUrl = process.env.DBURL;
const CONNECTION_URL = dbUrl;
const PORT = process.env.PORT;

//express rate limiter
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 60 seconds
  max: 30, // Limit each IP to max requests per `window` (here, per 1 minute)
  message: 'Too many requests, try again later',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const app = express();

app.disable('x-powered-by');
app.use((req, res, next) => {
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=()');
  res.setHeader(
    'Access-Control-Allow-Origin',
    'https://asg-smartlock.herokuapp.com/'
  );
  next();
});
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        'img-src': ["'self'", 'data:', '*.googleusercontent.com'],
        'script-src': [
          "'self'",
          'accounts.google.com',
          'https://accounts.google.com/gsi/client',
        ],
        'style-src': [
          "'self'",
          "'unsafe-inline'",
          '*.googleapis.com',
          '*.google.com',
        ],
        'connect-src': ["'self'", 'accounts.google.com/gsi', '*.google.com'],
        'frame-src': [
          "'self'",
          'accounts.google.com/',
          '*.google.com',
          'https://*.google.com/gsi/',
        ],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
    referrerPolicy: {
      policy: 'strict-origin-when-cross-origin',
    },
  })
);

app.use(compress());
app.use(cors({ origin: 'https://asg-smartlock.herokuapp.com/' }));
app.use(express.json());
app.use(sslRedirect());
app.use(cookieParser());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

//Cross-Site Request Forgery (CSRF) protection
app.get('/api/csrf', csrfProtection, function (req, res) {
  res.send({ csrfToken: req.csrfToken() });
});

//Routes
app.use('/api/lock', apiLimiter, csrfProtection, lockRoutes);
app.use('/api/card', apiLimiter, csrfProtection, cardRoutes);
app.use('/api/ekey', apiLimiter, csrfProtection, ekeyRoutes);
app.use('/api/logs', apiLimiter, csrfProtection, logsRoutes);
app.use('/api/lockgroup', apiLimiter, csrfProtection, lockGroupRoutes);
app.use('/api/user', apiLimiter, csrfProtection, userRoutes);
app.use('/api/auth', authRoutes);

//PRODUCTION BUILD
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('public'));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
  });
}

//Keep errorhandler last middleware
app.use(errorHandler);

mongoose
  .connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    app.listen(PORT, () =>
      console.log(`Conntected to MongoDB, Running on port ${PORT}!`)
    )
  )
  .catch((error) => console.log(error.message));
