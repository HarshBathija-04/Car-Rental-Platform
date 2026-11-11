const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5112').replace(/\/$/, '');
const TOKEN_KEY = 'ridex.token';
// Render's free tier sleeps when idle; after this long we tell the user the server is waking up.
const SLOW_MS = 4000;

export const tokenStore = {
  get() {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set(token) {
    try {
      if (token) localStorage.setItem(TOKEN_KEY, token);
      else localStorage.removeItem(TOKEN_KEY);
    } catch {
      // storage blocked (private mode): the session just won't survive a reload
    }
  },
};

export class ApiError extends Error {
  constructor(status, code, message, details) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

let slowRequests = 0;
const slowListeners = new Set();
const notifySlow = () => slowListeners.forEach((fn) => fn(slowRequests > 0));

/** Subscribe to "a request is taking unusually long" changes. Returns an unsubscribe function. */
export function onSlowChange(fn) {
  slowListeners.add(fn);
  return () => slowListeners.delete(fn);
}

export async function api(path, { method = 'GET', body, signal } = {}) {
  const token = tokenStore.get();
  let slow = false;
  const timer = setTimeout(() => {
    slow = true;
    slowRequests += 1;
    notifySlow();
  }, SLOW_MS);
  try {
    let res;
    try {
      res = await fetch(BASE + path, {
        method,
        signal,
        headers: {
          ...(body && { 'Content-Type': 'application/json' }),
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: body && JSON.stringify(body),
      });
    } catch (err) {
      if (err.name === 'AbortError') throw err;
      throw new ApiError(0, 'NETWORK', 'We could not reach the server. Check your connection and try again.');
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new ApiError(
        res.status,
        data.error?.code || `HTTP_${res.status}`,
        data.error?.message || 'Something went wrong. Please try again.',
        data.error?.details,
      );
    }
    return data;
  } finally {
    clearTimeout(timer);
    if (slow) {
      slowRequests -= 1;
      notifySlow();
    }
  }
}

/** Maps zod-style `details` from the API to `{ field: message }` for inline form errors. */
export function fieldErrors(err) {
  if (!Array.isArray(err?.details)) return {};
  return Object.fromEntries(err.details.map((d) => [d.path, d.message]));
}
