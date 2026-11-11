const DAY_MS = 86_400_000;

/** Whole days between two ISO dates; end is the exclusive return day. */
export const rentalDays = (start, end) => Math.round((Date.parse(end) - Date.parse(start)) / DAY_MS);

// The shop is in India, so "today" is the IST calendar date, not UTC.
export const todayIso = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });

export const addDays = (iso, days) => new Date(Date.parse(iso) + days * DAY_MS).toISOString().slice(0, 10);
