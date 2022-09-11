import { WebSocketServer } from 'ws';
import authRoutes from './routes/auth.js';
import bodyParser from 'body-parser';
import cardRoutes from './routes/card.js';
import compress from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import csrf from 'csurf';
import { dirname } from 'path';
import dotenv from 'dotenv';
import ekeyRoutes from './routes/ekey.js';
import errorHandler from './middleware/error.js';
import express from 'express';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import herokuSSLRedirect from 'heroku-ssl-redirect';
import http from 'http';
import lockGroupRoutes from './routes/lockGroup.js';
import lockRoutes from './routes/lock.js';
import logsRoutes from './routes/logs.js';
import mongoose from 'mongoose';
import path from 'path';
import rateLimit from 'express-rate-limit';
import userRoutes from './routes/user.js';

const server = http.createServer();

const cacheTime = 86400000 * 1; //1 day
const sslRedirect = herokuSSLRedirect.default;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
var csrfProtection = csrf({ cookie: true });
dotenv.config();
const CONNECTION_URL = process.env.DBURL;
const PORT = process.env.PORT;

//express rate limiter
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 60 seconds
  max: 30, // Limit each IP to max requests per `window` (here, 30 per 1 minute)
  message: 'Too many requests, try again later',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const app = express();
const wss = new WebSocketServer({ server: server });

server.on('request', app);

wss.on('connection', function connection(ws) {
  ws.send('hello');
  console.log('here');
  ws.on('message', function message(data) {
    console.log('received: %s', data);
  });

  ws.send('something');
});

app.disable('x-powered-by');
app.use((req, res, next) => {
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=()');
  res.setHeader(
    'Access-Control-Allow-Origin',
    'https://asg-smartlock.herokuapp.com/'
  );
  res.setHeader('Cache-Control', `must-revalidate`);
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

//static
app.use(
  express.static('public', {
    maxAge: cacheTime,
  })
);

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
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
  });
}

//Keep errorhandler last middleware
app.use(errorHandler);

mongoose
  .connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    server.listen(PORT, () =>
      console.log(`Conntected to MongoDB, Running on port ${PORT}!`)
    )
  )
  .catch((error) => console.log(error.message));
