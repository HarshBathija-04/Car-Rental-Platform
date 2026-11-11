import { query } from '../db/pool.js';

export const CAR_COLUMNS = `
  c.id, c.slug, c.make, c.model, c.year, c.category, c.seats, c.fuel, c.transmission,
  c.efficiency_kmpl::float AS "efficiencyKmpl", c.price_per_day AS "pricePerDay",
  c.city, c.color, c.image, c.description, c.features`;

export async function searchCars({ q, maxPrice, minYear, category, seats, city, from, to }) {
  const where = [];
  const params = [];
  const p = (value) => {
    params.push(value);
    return `$${params.length}`;
  };
  if (q) where.push(`(c.make || ' ' || c.model) ILIKE '%' || ${p(q)} || '%'`);
  if (maxPrice) where.push(`c.price_per_day <= ${p(maxPrice)}`);
  if (minYear) where.push(`c.year >= ${p(minYear)}`);
  if (category) where.push(`c.category = ${p(category)}`);
  if (seats) where.push(`c.seats >= ${p(seats)}`);
  if (city) where.push(`c.city = ${p(city)}`);
  if (from && to) {
    where.push(`NOT EXISTS (SELECT 1 FROM bookings b WHERE b.car_id = c.id AND b.status = 'confirmed'
      AND b.start_date < ${p(to)} AND b.end_date > ${p(from)})`);
  }
  const { rows } = await query(
    `SELECT ${CAR_COLUMNS} FROM cars c ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
     ORDER BY c.price_per_day`,
    params,
  );
  return rows;
}

export async function getCar(id) {
  return (await query(`SELECT ${CAR_COLUMNS} FROM cars c WHERE c.id = $1`, [id])).rows[0];
}

/** Confirmed booked ranges for a car that end after `from`. No customer data is exposed. */
export async function bookedRanges(carId, from) {
  const { rows } = await query(
    `SELECT start_date AS "startDate", end_date AS "endDate" FROM bookings
     WHERE car_id = $1 AND status = 'confirmed' AND end_date > $2 ORDER BY start_date`,
    [carId, from],
  );
  return rows;
}
