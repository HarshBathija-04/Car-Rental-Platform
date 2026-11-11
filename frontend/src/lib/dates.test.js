import { afterEach, describe, expect, it, vi } from 'vitest';
import { addDays, daysBetween, formatINR, isDayBooked, isRangeFree, todayIso, validateRange } from './dates.js';

const booked = [{ startDate: '2026-03-10', endDate: '2026-03-13' }];

describe('date helpers', () => {
  afterEach(() => vi.useRealTimers());

  it('uses the India calendar date for today', () => {
    vi.useFakeTimers({ now: new Date('2026-11-11T20:00:00Z') }); // 01:30 IST on the 12th
    expect(todayIso()).toBe('2026-11-12');
  });

  it('adds days across month ends', () => {
    expect(addDays('2026-02-27', 3)).toBe('2026-03-02');
    expect(daysBetween('2026-02-27', '2026-03-02')).toBe(3);
  });

  it('treats the return day as free for the next renter', () => {
    expect(isDayBooked('2026-03-12', booked)).toBe(true);
    expect(isDayBooked('2026-03-13', booked)).toBe(false);
    expect(isRangeFree('2026-03-13', '2026-03-15', booked)).toBe(true);
    expect(isRangeFree('2026-03-08', '2026-03-10', booked)).toBe(true);
    expect(isRangeFree('2026-03-08', '2026-03-11', booked)).toBe(false);
  });

  it('validates a requested range', () => {
    const today = '2026-03-01';
    expect(validateRange('2026-03-02', '2026-03-05', booked, today)).toBeNull();
    expect(validateRange('2026-02-20', '2026-03-05', booked, today)).toMatch(/past/);
    expect(validateRange('2026-03-05', '2026-03-05', booked, today)).toMatch(/after/);
    expect(validateRange('2026-03-02', '2026-04-05', [], today)).toMatch(/at most/);
    expect(validateRange('2026-03-09', '2026-03-11', booked, today)).toMatch(/already booked/);
  });

  it('formats rupees the Indian way', () => {
    expect(formatINR(1150000)).toBe('₹11,50,000');
  });
});
