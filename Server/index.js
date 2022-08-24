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

const sslRedirect = herokuSSLRedirect.default;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
var csrfProtection = csrf({ cookie: true });

dotenv.config();
const dbUrl = process.env.DBURL;
const CONNECTION_URL = dbUrl;
const PORT = process.env.PORT;

const app = express();
app.disable('x-powered-by');
app.use(compress());
app.use(cors());
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
app.use('/api/lock', csrfProtection, lockRoutes);
app.use('/api/card', csrfProtection, cardRoutes);
app.use('/api/ekey', csrfProtection, ekeyRoutes);
app.use('/api/logs', csrfProtection, logsRoutes);
app.use('/api/lockgroup', csrfProtection, lockGroupRoutes);
app.use('/api/user', csrfProtection, userRoutes);
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
