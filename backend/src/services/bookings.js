import { query, withTransaction } from '../db/pool.js';
import { HttpError } from '../errors.js';
import { quote } from './pricing.js';

const BOOKING_COLUMNS = `
  b.id, b.car_id AS "carId", b.start_date AS "startDate", b.end_date AS "endDate",
  b.total_price AS "totalPrice", b.status, b.created_at AS "createdAt"`;

export async function createBooking({ userId, carId, startDate, endDate }) {
  return withTransaction(async (client) => {
    // Locking the car row serialises concurrent bookings for this car,
    // so the overlap check and the insert below cannot interleave.
    const car = (await client.query('SELECT id, price_per_day FROM cars WHERE id = $1 FOR UPDATE', [carId])).rows[0];
    if (!car) throw new HttpError(404, 'CAR_NOT_FOUND', 'That car does not exist');

    const clash = await client.query(
      `SELECT start_date AS "startDate", end_date AS "endDate" FROM bookings
       WHERE car_id = $1 AND status = 'confirmed' AND start_date < $3 AND end_date > $2
       ORDER BY start_date LIMIT 1`,
      [carId, startDate, endDate],
    );
    if (clash.rows.length) {
      throw new HttpError(409, 'DATES_UNAVAILABLE', 'This car is already booked for some of those dates', clash.rows[0]);
    }

    const { total } = quote(car.price_per_day, startDate, endDate);
    const { rows } = await client.query(
      `INSERT INTO bookings AS b (user_id, car_id, start_date, end_date, total_price)
       VALUES ($1, $2, $3, $4, $5) RETURNING ${BOOKING_COLUMNS}`,
      [userId, carId, startDate, endDate, total],
    );
    return rows[0];
  });
}

export async function listUserBookings(userId) {
  const { rows } = await query(
    `SELECT ${BOOKING_COLUMNS},
       json_build_object('id', c.id, 'make', c.make, 'model', c.model, 'year', c.year,
                         'image', c.image, 'city', c.city, 'pricePerDay', c.price_per_day) AS car
     FROM bookings b JOIN cars c ON c.id = b.car_id
     WHERE b.user_id = $1
     ORDER BY b.start_date DESC`,
    [userId],
  );
  return rows;
}

export async function cancelBooking({ userId, bookingId, today }) {
  const { rows } = await query(
    `UPDATE bookings AS b SET status = 'cancelled'
     WHERE id = $1 AND user_id = $2 AND status = 'confirmed' AND start_date > $3
     RETURNING ${BOOKING_COLUMNS}`,
    [bookingId, userId, today],
  );
  if (rows[0]) return rows[0];
  const existing = (await query('SELECT status FROM bookings WHERE id = $1 AND user_id = $2', [bookingId, userId]))
    .rows[0];
  if (!existing) throw new HttpError(404, 'BOOKING_NOT_FOUND', 'Booking not found');
  throw new HttpError(409, 'NOT_CANCELLABLE', 'Only upcoming, confirmed bookings can be cancelled');
}
