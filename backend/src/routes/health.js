import { Router } from 'express';
import { query } from '../db/pool.js';

export const healthRouter = Router();

healthRouter.get('/health', async (req, res) => {
  try {
    await query('SELECT 1');
    res.json({ status: 'ok', db: 'ok' });
  } catch (err) {
    console.error('health check failed:', err.message);
    res.status(503).json({ status: 'error', db: 'error' });
  }
});
