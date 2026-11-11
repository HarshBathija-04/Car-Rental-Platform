const env = process.env;
const isProd = env.NODE_ENV === 'production';

export const config = {
  isProd,
  port: Number(env.PORT) || 5112,
  databaseUrl: env.DATABASE_URL,
  dbSchema: env.DB_SCHEMA || 'car_rental',
  jwtSecret: env.JWT_SECRET || (isProd ? '' : 'dev-only-insecure-jwt-secret'),
  frontendUrls: (env.FRONTEND_URL || 'http://localhost:5206')
    .split(',')
    .map((s) => s.trim().replace(/\/$/, ''))
    .filter(Boolean),
  groqApiKey: env.GROQ_API_KEY || '',
};

if (!config.databaseUrl) throw new Error('DATABASE_URL is required');
if (!config.jwtSecret) throw new Error('JWT_SECRET is required in production');
// The schema name is interpolated into DDL, so it must be a plain identifier.
if (!/^[a-z_][a-z0-9_]{0,62}$/.test(config.dbSchema)) {
  throw new Error('DB_SCHEMA must be a lowercase SQL identifier');
}
