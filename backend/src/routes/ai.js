import { Router } from 'express';
import { z } from 'zod';
import { recommendCars } from '../services/advisor.js';

export const aiRouter = Router();

const schema = z.object({
  message: z.string().trim().min(5, 'Tell us a little more about your trip').max(500),
});

aiRouter.post('/recommend', async (req, res) => {
  const { message } = schema.parse(req.body ?? {});
  res.json(await recommendCars(message));
});
