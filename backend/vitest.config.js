import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // API tests use their own throwaway schema in the shared database.
    env: { DB_SCHEMA: 'car_rental_test', NODE_ENV: 'test', GROQ_API_KEY: '', FRONTEND_URL: 'http://localhost:5206' },
    fileParallelism: false,
    testTimeout: 20_000,
    hookTimeout: 60_000,
  },
});
