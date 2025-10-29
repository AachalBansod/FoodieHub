import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

import { PORT, NODE_ENV, ALLOWED_ORIGIN } from './lib/config.js';
import { connectMongo } from './lib/db.js';
import healthRouter from './routes/health.js';
import swiggyRouter from './routes/swiggy.js';
import favoritesRouter from './routes/favorites.js';
import recentlyViewedRouter from './routes/recentlyViewed.js';
import authRouter from './routes/auth.js';

const app = express();

// Trust proxy for render
app.set('trust proxy', 1);

// Core middleware
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'));

// CORS
const allowedOrigins = ALLOWED_ORIGIN === '*' ? undefined : [ALLOWED_ORIGIN];
app.use(cors({
  origin: allowedOrigins || true,
  credentials: false,
}));

// Basic rate limiter to protect proxy endpoints
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120, // 120 req/min per IP
});
app.use(limiter);

// Routes
app.use('/', healthRouter);
app.use('/', authRouter);
app.use('/', swiggyRouter);
app.use('/', favoritesRouter);
app.use('/', recentlyViewedRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ ok: false, error: 'Not Found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(err.status || 500).json({ ok: false, error: err.message || 'Internal Server Error' });
});

async function start() {
  await connectMongo();
  app.listen(PORT, () => {
    console.log(`FoodieHub backend listening on port ${PORT}`);
  });
}

start();
