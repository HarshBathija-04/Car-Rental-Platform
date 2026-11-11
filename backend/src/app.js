import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { config } from './config.js';
import { errorHandler, notFound } from './errors.js';
import { aiRouter } from './routes/ai.js';
import { authRouter } from './routes/auth.js';
import { bookingsRouter } from './routes/bookings.js';
import { carsRouter } from './routes/cars.js';
import { healthRouter } from './routes/health.js';

const limiter = (limit, windowMs) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { error: { code: 'RATE_LIMITED', message: 'Too many requests, please slow down' } },
  });

export function createApp() {
  const app = express();
  app.set('trust proxy', 1); // Render terminates TLS in front of the app
  app.disable('x-powered-by');
  app.use(helmet());
  app.use(
    cors({
      origin: config.frontendUrls,
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      maxAge: 600,
    }),
  );
  app.use(express.json({ limit: '20kb' }));

  app.use(healthRouter);
  app.get('/', (req, res) => res.json({ name: 'ridex-api', docs: '/health, /api/cars' }));
  app.use('/api/auth', limiter(20, 15 * 60_000), authRouter);
  app.use('/api/cars', carsRouter);
  app.use('/api/bookings', bookingsRouter);
  app.use('/api/ai', limiter(8, 60_000), aiRouter);

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
