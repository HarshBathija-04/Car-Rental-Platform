import { randomBytes } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import bcrypt from 'bcryptjs';
import { addDays, todayIso } from '../services/pricing.js';
import { migrate } from './migrate.js';
import { pool } from './pool.js';

export const DEMO_USER = { name: 'Demo Driver', email: 'demo@ridex.app', password: 'ridex-demo-2026' };

const CUSTOMERS = [
  { name: 'Aarav Mehta', email: 'aarav.mehta@example.com' },
  { name: 'Priya Nair', email: 'priya.nair@example.com' },
  { name: 'Kabir Singh', email: 'kabir.singh@example.com' },
];

export const CARS = [
  {
    slug: 'toyota-rav4-hybrid-2021',
    make: 'Toyota',
    model: 'RAV4 Hybrid',
    year: 2021,
    category: 'SUV',
    seats: 5,
    fuel: 'Hybrid',
    transmission: 'Automatic',
    efficiencyKmpl: 21.4,
    pricePerDay: 3400,
    city: 'Bengaluru',
    color: 'Cavalry Blue',
    image: '/images/car-1.jpg',
    description:
      'A quiet, frugal hybrid SUV with a roomy cabin and a big boot. Ideal for family weekends to Coorg or long highway runs.',
    features: ['All-wheel drive', 'Apple CarPlay', 'Adaptive cruise control', '580 L boot'],
  },
  {
    slug: 'bmw-6-series-gran-coupe-2019',
    make: 'BMW',
    model: '6 Series Gran Coupé',
    year: 2019,
    category: 'Luxury',
    seats: 5,
    fuel: 'Petrol',
    transmission: 'Automatic',
    efficiencyKmpl: 12.1,
    pricePerDay: 7800,
    city: 'Mumbai',
    color: 'Carbon Black',
    image: '/images/car-2.jpg',
    description:
      'A four-door coupé with a long wheelbase and a hushed ride. Made for client meetings, weddings and coastal drives.',
    features: ['Leather seats', 'Harman Kardon audio', 'Head-up display', 'Parking assistant'],
  },
  {
    slug: 'volkswagen-polo-gti-2020',
    make: 'Volkswagen',
    model: 'Polo GTI',
    year: 2020,
    category: 'Hatchback',
    seats: 5,
    fuel: 'Petrol',
    transmission: 'Automatic',
    efficiencyKmpl: 16.8,
    pricePerDay: 2200,
    city: 'Pune',
    color: 'Pure White',
    image: '/images/car-3.jpg',
    description:
      'Compact, punchy and easy to park. The smart pick for city errands and quick trips to Lonavala.',
    features: ['DSG gearbox', 'Sport suspension', 'Android Auto', 'Rear camera'],
  },
  {
    slug: 'cadillac-escalade-2020',
    make: 'Cadillac',
    model: 'Escalade',
    year: 2020,
    category: 'SUV',
    seats: 7,
    fuel: 'Petrol',
    transmission: 'Automatic',
    efficiencyKmpl: 7.7,
    pricePerDay: 11500,
    city: 'Mumbai',
    color: 'Black Raven',
    image: '/images/car-4.jpg',
    description:
      'A full-size, seven-seat luxury SUV with three rows of space. The choice for group travel and airport transfers.',
    features: ['Seven seats', 'Rear-seat entertainment', 'Massage seats', 'Tri-zone climate'],
  },
  {
    slug: 'bmw-m4-competition-2021',
    make: 'BMW',
    model: 'M4 Competition',
    year: 2021,
    category: 'Sports',
    seats: 4,
    fuel: 'Petrol',
    transmission: 'Automatic',
    efficiencyKmpl: 9.6,
    pricePerDay: 14000,
    city: 'Bengaluru',
    color: 'Toronto Red',
    image: '/images/car-5.jpg',
    description:
      'A 510 hp twin-turbo coupé for drivers who want the long way round, with a cabin that still works on the commute.',
    features: ['510 hp', 'M carbon seats', 'Launch control', 'Track mode'],
  },
  {
    slug: 'bmw-5-series-530i-2019',
    make: 'BMW',
    model: '5 Series 530i M Sport',
    year: 2019,
    category: 'Sedan',
    seats: 5,
    fuel: 'Petrol',
    transmission: 'Automatic',
    efficiencyKmpl: 13.2,
    pricePerDay: 6200,
    city: 'Pune',
    color: 'Bluestone Metallic',
    image: '/images/car-6.jpg',
    description:
      'An executive sedan that balances comfort and composure. Great for business travel between Pune and Mumbai.',
    features: ['M Sport package', 'Ambient lighting', 'Wireless charging', 'Lane assist'],
  },
];

// Offsets in days from today, so the demo always has upcoming and past trips.
const DEMO_HISTORY = [
  { email: DEMO_USER.email, slug: 'volkswagen-polo-gti-2020', start: -40, days: 3 },
  { email: DEMO_USER.email, slug: 'bmw-5-series-530i-2019', start: -12, days: 2, status: 'cancelled' },
];
const UPCOMING = [
  { email: DEMO_USER.email, slug: 'toyota-rav4-hybrid-2021', start: 6, days: 4 },
  { email: 'aarav.mehta@example.com', slug: 'toyota-rav4-hybrid-2021', start: 1, days: 3 },
  { email: 'priya.nair@example.com', slug: 'cadillac-escalade-2020', start: 0, days: 5 },
  { email: 'kabir.singh@example.com', slug: 'bmw-m4-competition-2021', start: 3, days: 2 },
  { email: 'priya.nair@example.com', slug: 'bmw-m4-competition-2021', start: 12, days: 4 },
  { email: 'aarav.mehta@example.com', slug: 'bmw-6-series-gran-coupe-2019', start: 9, days: 6 },
];

async function insertBookings(client, specs, today) {
  for (const b of specs) {
    const start = addDays(today, b.start);
    const end = addDays(start, b.days);
    // Skips any spec that would overlap an existing confirmed booking.
    await client.query(
      `INSERT INTO bookings (user_id, car_id, start_date, end_date, total_price, status)
       SELECT u.id, c.id, $3::date, $4::date, c.price_per_day * $5, $6
       FROM users u, cars c
       WHERE lower(u.email) = $1 AND c.slug = $2
         AND ($6 = 'cancelled' OR NOT EXISTS (
           SELECT 1 FROM bookings x WHERE x.car_id = c.id AND x.status = 'confirmed'
             AND x.start_date < $4::date AND x.end_date > $3::date))`,
      [b.email, b.slug, start, end, b.days, b.status ?? 'confirmed'],
    );
  }
}

export async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const demoHash = await bcrypt.hash(DEMO_USER.password, 12);
    await client.query(
      `INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3)
       ON CONFLICT ((lower(email))) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
      [DEMO_USER.name, DEMO_USER.email, demoHash],
    );
    for (const c of CUSTOMERS) {
      // Seed customers get a random password nobody knows.
      const hash = await bcrypt.hash(randomBytes(24).toString('hex'), 10);
      await client.query(
        `INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) ON CONFLICT ((lower(email))) DO NOTHING`,
        [c.name, c.email, hash],
      );
    }
    for (const c of CARS) {
      await client.query(
        `INSERT INTO cars (slug, make, model, year, category, seats, fuel, transmission, efficiency_kmpl,
                           price_per_day, city, color, image, description, features)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
         ON CONFLICT (slug) DO UPDATE SET make = EXCLUDED.make, model = EXCLUDED.model, year = EXCLUDED.year,
           category = EXCLUDED.category, seats = EXCLUDED.seats, fuel = EXCLUDED.fuel,
           transmission = EXCLUDED.transmission, efficiency_kmpl = EXCLUDED.efficiency_kmpl,
           price_per_day = EXCLUDED.price_per_day, city = EXCLUDED.city, color = EXCLUDED.color,
           image = EXCLUDED.image, description = EXCLUDED.description, features = EXCLUDED.features`,
        [
          c.slug,
          c.make,
          c.model,
          c.year,
          c.category,
          c.seats,
          c.fuel,
          c.transmission,
          c.efficiencyKmpl,
          c.pricePerDay,
          c.city,
          c.color,
          c.image,
          c.description,
          c.features,
        ],
      );
    }

    const today = todayIso();
    const demo = await client.query(
      `SELECT count(*)::int AS total,
              count(*) FILTER (WHERE b.status = 'confirmed' AND b.end_date > $2)::int AS upcoming
       FROM bookings b JOIN users u ON u.id = b.user_id WHERE lower(u.email) = $1`,
      [DEMO_USER.email, today],
    );
    if (demo.rows[0].total === 0) await insertBookings(client, DEMO_HISTORY, today);
    // Re-fill the calendar when the demo has run out of upcoming trips (e.g. a visitor cancelled them).
    if (demo.rows[0].upcoming === 0) await insertBookings(client, UPCOMING, today);
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  migrate()
    .then(seed)
    .then(() => console.log(`seeded ${CARS.length} cars and demo user ${DEMO_USER.email}`))
    .catch((err) => {
      console.error(err);
      process.exitCode = 1;
    })
    .finally(() => pool.end());
}
