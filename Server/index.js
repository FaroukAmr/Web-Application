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
dotenv.config();
const dbUrl = process.env.DBURL;
const CONNECTION_URL = dbUrl;
const PORT = process.env.PORT;
const app = express();
app.use(compress());
app.use(cors());
app.use(express.json());
app.use(sslRedirect());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(cookieParser());
app.use(
  csrf({
    cookie: {
      // here you can configure your cookie. Default values are ok, but I decided to be more explicit
      // http://expressjs.com/en/4x/api.html#req.cookies
      key: '_csrf',
      path: '/',
      httpOnly: true, // if you want you can use true here
      secure: false, // if you are using HTTPS I suggest true here
      signed: false, // I don't know if csurf supports signed cookies, so I used false
      sameSite: 'strict',
      maxAge: 12 * 60 * 60 * 1000, // 24 hours
    },
  })
);

app.get('/api/csurf', (req, res, next) => {
  console.log('here');
  const csrfTokenToSendToFrontEnd = req.csrfToken();
  console.log('csrfTokenToSendToFrontEnd: ', csrfTokenToSendToFrontEnd);
  res.cookie('XSRF-TOKEN', csrfTokenToSendToFrontEnd);
});

app.use('/api/auth', authRoutes);
app.use('/api/lock', lockRoutes);
app.use('/api/card', cardRoutes);
app.use('/api/ekey', ekeyRoutes);
app.use('/api/logs', logsRoutes);
app.use('/api/lockgroup', lockGroupRoutes);
app.use('/api/user', userRoutes);
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
