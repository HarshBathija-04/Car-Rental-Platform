import { describe, expect, it } from 'vitest';
import { bookingSchema } from '../src/routes/bookings.js';
import { parseAdvice } from '../src/services/advisor.js';
import { addDays, quote, rangesOverlap, rentalDays, todayIso } from '../src/services/pricing.js';

describe('pricing', () => {
  it('counts rental days with an exclusive return day', () => {
    expect(rentalDays('2026-03-01', '2026-03-04')).toBe(3);
    expect(rentalDays('2026-02-28', '2026-03-01')).toBe(1);
    expect(quote(2200, '2026-03-01', '2026-03-04')).toEqual({ days: 3, total: 6600 });
  });

  it('detects half-open range overlap', () => {
    expect(rangesOverlap('2026-03-01', '2026-03-04', '2026-03-03', '2026-03-05')).toBe(true);
    expect(rangesOverlap('2026-03-01', '2026-03-04', '2026-02-27', '2026-03-10')).toBe(true);
    // back-to-back: return on the 4th, next pick-up on the 4th
    expect(rangesOverlap('2026-03-01', '2026-03-04', '2026-03-04', '2026-03-06')).toBe(false);
  });
});

describe('booking validation', () => {
  const start = addDays(todayIso(), 2);
  it('accepts a valid future range', () => {
    expect(bookingSchema.safeParse({ carId: 1, startDate: start, endDate: addDays(start, 3) }).success).toBe(true);
  });
  it.each([
    ['past pick-up', { carId: 1, startDate: addDays(todayIso(), -1), endDate: start }],
    ['return before pick-up', { carId: 1, startDate: start, endDate: start }],
    ['too long', { carId: 1, startDate: start, endDate: addDays(start, 31) }],
    ['too far ahead', { carId: 1, startDate: addDays(todayIso(), 400), endDate: addDays(todayIso(), 402) }],
    ['bad date', { carId: 1, startDate: '2026-13-01', endDate: '2026-13-03' }],
  ])('rejects %s', (_, input) => {
    expect(bookingSchema.safeParse(input).success).toBe(false);
  });
});

describe('advisor output parsing', () => {
  it('keeps only known car ids, deduplicated, max 3', () => {
    const raw = JSON.stringify({ reply: 'Try these', carIds: [4, 4, 99, '2', 1, 3] });
    expect(parseAdvice(raw, [1, 2, 3, 4])).toEqual({ reply: 'Try these', carIds: [4, 2, 1] });
  });
  it('falls back to plain text when the model returns invalid JSON', () => {
    expect(parseAdvice('not json', [1])).toEqual({ reply: 'not json', carIds: [] });
  });
});
