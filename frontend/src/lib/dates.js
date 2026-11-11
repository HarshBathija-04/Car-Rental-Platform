const DAY_MS = 86_400_000;

/** Today in India as YYYY-MM-DD, matching the API wherever the visitor is. */
export const todayIso = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
export const addDays = (iso, n) => new Date(Date.parse(iso) + n * DAY_MS).toISOString().slice(0, 10);
export const daysBetween = (start, end) => Math.round((Date.parse(end) - Date.parse(start)) / DAY_MS);

/** Half-open ranges [start, end): a return day can be the next renter's pick-up day. */
export const overlaps = (aStart, aEnd, bStart, bEnd) => aStart < bEnd && bStart < aEnd;
export const isRangeFree = (start, end, booked) => !booked.some((b) => overlaps(start, end, b.startDate, b.endDate));
export const isDayBooked = (day, booked) => booked.some((b) => b.startDate <= day && day < b.endDate);

const asDate = (iso) => new Date(`${iso}T00:00:00`);
export const formatDate = (iso, options = { day: 'numeric', month: 'short' }) =>
  asDate(iso).toLocaleDateString('en-IN', options);
export const weekday = (iso) => asDate(iso).toLocaleDateString('en-IN', { weekday: 'short' });

export function formatRange(start, end) {
  const sameYear = start.slice(0, 4) === end.slice(0, 4);
  const opts = { day: 'numeric', month: 'short', ...(sameYear ? {} : { year: 'numeric' }) };
  return `${formatDate(start, opts)} – ${formatDate(end, { day: 'numeric', month: 'short', year: 'numeric' })}`;
}

const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
export const formatINR = (n) => inr.format(n);

export const MAX_RENTAL_DAYS = 30;

/** Client-side mirror of the API rules, so the form can explain problems before submitting. */
export function validateRange(start, end, booked = [], today = todayIso()) {
  if (!start || !end) return 'Choose a pick-up and a return date';
  if (start < today) return 'Pick-up date cannot be in the past';
  if (end <= start) return 'Return date must be after pick-up date';
  if (daysBetween(start, end) > MAX_RENTAL_DAYS) return `Rentals can be at most ${MAX_RENTAL_DAYS} days`;
  if (!isRangeFree(start, end, booked)) return 'This car is already booked for some of those dates';
  return null;
}
