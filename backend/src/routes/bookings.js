import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.js';
import { cancelBooking, createBooking, listUserBookings } from '../services/bookings.js';
import { addDays, rentalDays, todayIso } from '../services/pricing.js';
import { id, isoDate } from '../validation.js';

const MAX_RENTAL_DAYS = 30;
const MAX_ADVANCE_DAYS = 365;

export const bookingSchema = z
  .object({ carId: id, startDate: isoDate, endDate: isoDate })
  .refine((b) => b.startDate >= todayIso(), { message: 'Pick-up date cannot be in the past', path: ['startDate'] })
  .refine((b) => b.startDate <= addDays(todayIso(), MAX_ADVANCE_DAYS), {
    message: `Bookings open up to ${MAX_ADVANCE_DAYS} days ahead`,
    path: ['startDate'],
  })
  .refine((b) => b.endDate > b.startDate, { message: 'Return date must be after pick-up date', path: ['endDate'] })
  .refine((b) => rentalDays(b.startDate, b.endDate) <= MAX_RENTAL_DAYS, {
    message: `Rentals can be at most ${MAX_RENTAL_DAYS} days`,
    path: ['endDate'],
  });

export const bookingsRouter = Router();
bookingsRouter.use(requireAuth);

bookingsRouter.post('/', async (req, res) => {
  const input = bookingSchema.parse(req.body ?? {});
  res.status(201).json({ booking: await createBooking({ ...input, userId: req.userId }) });
});

bookingsRouter.get('/me', async (req, res) => {
  res.json({ bookings: await listUserBookings(req.userId) });
});

bookingsRouter.post('/:id/cancel', async (req, res) => {
  const booking = await cancelBooking({ userId: req.userId, bookingId: id.parse(req.params.id), today: todayIso() });
  res.json({ booking });
});
