import { Router } from 'express';
import { z } from 'zod';
import { HttpError } from '../errors.js';
import { bookedRanges, getCar, searchCars } from '../services/cars.js';
import { todayIso } from '../services/pricing.js';
import { id, isoDate } from '../validation.js';

export const carsRouter = Router();

const blankToUndefined = (schema) => z.preprocess((v) => (v === '' ? undefined : v), schema.optional());

const searchSchema = z
  .object({
    q: blankToUndefined(z.string().trim().max(60)),
    category: blankToUndefined(z.string().trim().max(40)),
    city: blankToUndefined(z.string().trim().max(40)),
    maxPrice: blankToUndefined(z.coerce.number().int().positive()),
    minYear: blankToUndefined(z.coerce.number().int().min(1990).max(2100)),
    seats: blankToUndefined(z.coerce.number().int().positive().max(12)),
    from: blankToUndefined(isoDate),
    to: blankToUndefined(isoDate),
  })
  .refine((s) => !s.from === !s.to, { message: 'Provide both pick-up and return dates', path: ['to'] })
  .refine((s) => !s.from || s.to > s.from, { message: 'Return date must be after pick-up date', path: ['to'] });

carsRouter.get('/', async (req, res) => {
  res.json({ cars: await searchCars(searchSchema.parse(req.query)) });
});

carsRouter.get('/:id', async (req, res) => {
  const car = await getCar(id.parse(req.params.id));
  if (!car) throw new HttpError(404, 'CAR_NOT_FOUND', 'That car does not exist');
  res.json({ car });
});

carsRouter.get('/:id/availability', async (req, res) => {
  const carId = id.parse(req.params.id);
  if (!(await getCar(carId))) throw new HttpError(404, 'CAR_NOT_FOUND', 'That car does not exist');
  const from = todayIso();
  res.json({ carId, from, booked: await bookedRanges(carId, from) });
});
