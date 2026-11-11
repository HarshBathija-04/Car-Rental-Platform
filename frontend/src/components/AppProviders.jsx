import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { api, tokenStore } from '../lib/api.js';
import { AuthContext, ToastContext } from '../lib/context.js';

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id) => setToasts((list) => list.filter((t) => t.id !== id)), []);
  const toast = useCallback(
    (message, tone = 'success') => {
      nextId.current += 1;
      const id = nextId.current;
      setToasts((list) => [...list.slice(-2), { id, message, tone }]);
      setTimeout(() => dismiss(id), 5000);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toast-region" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast--${t.tone}`}>
            <ion-icon
              name={t.tone === 'error' ? 'alert-circle' : t.tone === 'info' ? 'information-circle' : 'checkmark-circle'}
              aria-hidden="true"
            ></ion-icon>
            <p>{t.message}</p>
            <button type="button" className="toast__close" onClick={() => dismiss(t.id)} aria-label="Dismiss">
              <ion-icon name="close" aria-hidden="true"></ion-icon>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(() => !tokenStore.get());

  useEffect(() => {
    if (!tokenStore.get()) return;
    api('/api/auth/me')
      .then((d) => setUser(d.user))
      .catch((err) => {
        // Only forget the token when the server rejects it, not when it is asleep or offline.
        if (err.status === 401) tokenStore.set(null);
      })
      .finally(() => setReady(true));
  }, []);

  const signIn = useCallback(({ token, user: next }) => {
    tokenStore.set(token);
    setUser(next);
  }, []);
  const signOut = useCallback(() => {
    tokenStore.set(null);
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, ready, signIn, signOut }), [user, ready, signIn, signOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default function AppProviders({ children }) {
  return (
    <ToastProvider>
      <AuthProvider>{children}</AuthProvider>
    </ToastProvider>
  );
}
