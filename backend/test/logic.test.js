import { afterEach, describe, expect, it, vi } from 'vitest';
import { bookingSchema } from '../src/routes/bookings.js';
import { parseAdvice } from '../src/services/advisor.js';
import { addDays, rentalDays, todayIso } from '../src/services/pricing.js';

describe('todayIso', () => {
  afterEach(() => vi.useRealTimers());
  it('uses the India calendar date, not UTC', () => {
    vi.useFakeTimers({ now: new Date('2026-11-11T20:00:00Z') }); // 01:30 IST on the 12th
    expect(todayIso()).toBe('2026-11-12');
  });
});

describe('pricing', () => {
  it('counts rental days with an exclusive return day', () => {
    expect(rentalDays('2026-03-01', '2026-03-04')).toBe(3);
    expect(rentalDays('2026-02-28', '2026-03-01')).toBe(1);
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
