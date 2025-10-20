import express from 'express';
import path, { dirname } from 'path';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import logger from 'morgan';
import cors from 'cors';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

// підключаємо indexRouter замість superheroesRouter
import indexRouter from './routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Налаштування шаблонів
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// CORS
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://puppyish-renay-tenaciously.ngrok-free.dev',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }),
);

// Сесії
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // або true на продакшн з HTTPS
  }),
);

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Роути
app.use('/', indexRouter);

export default app;
