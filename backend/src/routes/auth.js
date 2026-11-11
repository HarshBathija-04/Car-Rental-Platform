import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { query } from '../db/pool.js';
import { HttpError } from '../errors.js';
import { requireAuth, signToken } from '../middleware/auth.js';

export const authRouter = Router();

const email = z
  .email('Enter a valid email address')
  .max(254)
  .transform((e) => e.toLowerCase());
const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(80),
  email,
  // bcrypt only uses the first 72 bytes
  password: z.string().min(8, 'Password must be at least 8 characters').max(72),
});
const loginSchema = z.object({ email, password: z.string().min(1, 'Password is required').max(72) });

const publicUser = (u) => ({ id: u.id, name: u.name, email: u.email, createdAt: u.created_at });

authRouter.post('/register', async (req, res) => {
  const { name, email, password } = registerSchema.parse(req.body ?? {});
  const hash = await bcrypt.hash(password, 12);
  const { rows } = await query(
    `INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3)
     ON CONFLICT ((lower(email))) DO NOTHING RETURNING *`,
    [name, email, hash],
  );
  if (!rows[0]) throw new HttpError(409, 'EMAIL_TAKEN', 'An account with this email already exists');
  res.status(201).json({ token: signToken(rows[0]), user: publicUser(rows[0]) });
});

authRouter.post('/login', async (req, res) => {
  const { email, password } = loginSchema.parse(req.body ?? {});
  const user = (await query('SELECT * FROM users WHERE lower(email) = $1', [email])).rows[0];
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    throw new HttpError(401, 'INVALID_CREDENTIALS', 'Email or password is incorrect');
  }
  res.json({ token: signToken(user), user: publicUser(user) });
});

authRouter.get('/me', requireAuth, async (req, res) => {
  const user = (await query('SELECT * FROM users WHERE id = $1', [req.userId])).rows[0];
  if (!user) throw new HttpError(401, 'UNAUTHENTICATED', 'Your account no longer exists');
  res.json({ user: publicUser(user) });
});
