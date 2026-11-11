import { z } from 'zod';

export const isoDate = z.iso.date({ error: 'Use the YYYY-MM-DD date format' });
export const id = z.coerce.number().int().positive();
