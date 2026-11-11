import { useCallback, useEffect, useState } from 'react';
import { api } from './api.js';

/**
 * GET `path` and track loading/error. Keeps the previous data while a new
 * request is in flight so lists do not flash empty. Pass a falsy path to skip.
 */
export function useApi(path) {
  const [nonce, setNonce] = useState(0);
  const [state, setState] = useState({ key: null, data: null, error: null });
  const key = path ? `${path}#${nonce}` : null;

  useEffect(() => {
    if (!key) return undefined;
    const controller = new AbortController();
    api(path, { signal: controller.signal }).then(
      (data) => setState({ key, data, error: null }),
      (error) => {
        if (error.name !== 'AbortError') setState((s) => ({ key, data: s.data, error }));
      },
    );
    return () => controller.abort();
  }, [key, path]);

  const reload = useCallback(() => setNonce((n) => n + 1), []);
  const loading = Boolean(key) && state.key !== key;
  return { data: state.data, error: loading ? null : state.error, loading, reload };
}
