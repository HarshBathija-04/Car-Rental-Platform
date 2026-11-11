import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { HttpError } from '../errors.js';

export const signToken = (user) =>
  jwt.sign({ sub: String(user.id), name: user.name }, config.jwtSecret, { expiresIn: '7d' });

export function requireAuth(req, res, next) {
  const [scheme, token] = (req.get('authorization') || '').split(' ');
  if (scheme !== 'Bearer' || !token) throw new HttpError(401, 'UNAUTHENTICATED', 'Please sign in to continue');
  try {
    const payload = jwt.verify(token, config.jwtSecret);
    req.userId = Number(payload.sub);
  } catch {
    throw new HttpError(401, 'UNAUTHENTICATED', 'Your session has expired, please sign in again');
  }
  next();
}
