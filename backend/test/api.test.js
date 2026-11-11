import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';
import { config } from '../src/config.js';
import { migrate } from '../src/db/migrate.js';
import { pool } from '../src/db/pool.js';
import { DEMO_USER, seed } from '../src/db/seed.js';
import { addDays, todayIso } from '../src/services/pricing.js';

const app = createApp();
let token;

beforeAll(async () => {
  expect(config.dbSchema).toBe('car_rental_test'); // never wipe a real schema
  await pool.query(`DROP SCHEMA IF EXISTS ${config.dbSchema} CASCADE`);
  await migrate();
  await seed();
  await seed(); // idempotent
});

afterAll(() => pool.end());

describe('health', () => {
  it('reports db ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok', db: 'ok' });
  });
});

describe('cars', () => {
  it('lists the seeded fleet sorted by price', async () => {
    const res = await request(app).get('/api/cars');
    expect(res.status).toBe(200);
    expect(res.body.cars).toHaveLength(6);
    const prices = res.body.cars.map((c) => c.pricePerDay);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  it('filters by text, seats and price', async () => {
    const res = await request(app).get('/api/cars?q=bmw&maxPrice=8000');
    expect(res.body.cars.map((c) => c.make)).toEqual(['BMW', 'BMW']);
    expect((await request(app).get('/api/cars?seats=6')).body.cars).toHaveLength(1);
  });

  it('validates query params', async () => {
    const res = await request(app).get('/api/cars?from=2026-01-01');
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('returns 404 for unknown cars', async () => {
    expect((await request(app).get('/api/cars/9999')).status).toBe(404);
  });
});

describe('auth', () => {
  const user = { name: 'Test Renter', email: `renter${Date.now()}@example.com`, password: 'correct-horse' };

  it('registers, rejects duplicates and returns the profile', async () => {
    const res = await request(app).post('/api/auth/register').send(user);
    expect(res.status).toBe(201);
    expect(res.body.user).not.toHaveProperty('password_hash');
    token = res.body.token;
    expect((await request(app).post('/api/auth/register').send(user)).status).toBe(409);
    const me = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`);
    expect(me.body.user.email).toBe(user.email);
  });

  it('logs the demo user in and rejects a wrong password', async () => {
    const ok = await request(app).post('/api/auth/login').send(DEMO_USER);
    expect(ok.status).toBe(200);
    const bad = await request(app)
      .post('/api/auth/login')
      .send({ ...DEMO_USER, password: 'nope-nope' });
    expect(bad.status).toBe(401);
  });

  it('rejects invalid input and bad tokens', async () => {
    expect((await request(app).post('/api/auth/register').send({ email: 'x' })).status).toBe(400);
    expect((await request(app).get('/api/auth/me').set('Authorization', 'Bearer junk')).status).toBe(401);
  });
});

describe('bookings', () => {
  const start = addDays(todayIso(), 60);
  const end = addDays(start, 3);
  const book = (body) => request(app).post('/api/bookings').set('Authorization', `Bearer ${token}`).send(body);

  it('requires auth', async () => {
    expect((await request(app).post('/api/bookings').send({})).status).toBe(401);
  });

  it('creates a booking with a server-side price and blocks overlaps', async () => {
    const res = await book({ carId: 3, startDate: start, endDate: end });
    expect(res.status).toBe(201);
    expect(res.body.booking.totalPrice).toBe(3 * 2200);

    const overlap = await book({ carId: 3, startDate: addDays(start, 2), endDate: addDays(start, 5) });
    expect(overlap.status).toBe(409);
    expect(overlap.body.error.code).toBe('DATES_UNAVAILABLE');

    // back-to-back is fine because the return day is exclusive
    expect((await book({ carId: 3, startDate: end, endDate: addDays(end, 1) })).status).toBe(201);
  });

  it('allows exactly one of many concurrent requests for the same dates', async () => {
    const s = addDays(todayIso(), 90);
    const results = await Promise.all(
      Array.from({ length: 6 }, () => book({ carId: 5, startDate: s, endDate: addDays(s, 2) })),
    );
    expect(results.map((r) => r.status).sort()).toEqual([201, 409, 409, 409, 409, 409]);
  });

  it('hides booked cars from date searches and exposes availability', async () => {
    const res = await request(app).get(`/api/cars?from=${start}&to=${end}`);
    expect(res.body.cars.map((c) => c.id)).not.toContain(3);
    const av = await request(app).get('/api/cars/3/availability');
    expect(av.body.booked).toContainEqual({ startDate: start, endDate: end });
  });

  it('lists and cancels my bookings, freeing the dates', async () => {
    const mine = await request(app).get('/api/bookings/me').set('Authorization', `Bearer ${token}`);
    expect(mine.body.bookings.length).toBeGreaterThanOrEqual(3);
    const target = mine.body.bookings.find((b) => b.startDate === start);
    expect(target.car.make).toBe('Volkswagen');

    const cancel = await request(app).post(`/api/bookings/${target.id}/cancel`).set('Authorization', `Bearer ${token}`);
    expect(cancel.body.booking.status).toBe('cancelled');
    const again = await request(app).post(`/api/bookings/${target.id}/cancel`).set('Authorization', `Bearer ${token}`);
    expect(again.status).toBe(409);
    expect((await book({ carId: 3, startDate: start, endDate: end })).status).toBe(201);
  });
});

describe('platform', () => {
  it('returns JSON 404s and only allows the configured origin', async () => {
    const res = await request(app).get('/nope');
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
    const evil = await request(app).get('/health').set('Origin', 'https://evil.example');
    expect(evil.headers['access-control-allow-origin']).toBeUndefined();
    const good = await request(app).get('/health').set('Origin', 'http://localhost:5206');
    expect(good.headers['access-control-allow-origin']).toBe('http://localhost:5206');
  });

  it('degrades gracefully when the AI key is missing', async () => {
    const res = await request(app).post('/api/ai/recommend').send({ message: 'Weekend trip for four to Goa' });
    expect(res.status).toBe(503);
    expect(res.body.error.code).toBe('AI_UNAVAILABLE');
  });
});
