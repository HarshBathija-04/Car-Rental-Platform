import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Field from '../components/Field.jsx';
import { api, fieldErrors } from '../lib/api.js';
import { DEMO_ACCOUNT } from '../lib/constants.js';
import { useAuth, useToast } from '../lib/context.js';

export default function Login() {
  const { user, signIn } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;
  const target = from ? `${from.pathname}${from.search || ''}` : '/trips';

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (user && !submitting) return <Navigate to={target} replace />;

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const local = {};
    if (!form.email) local.email = 'Enter your email';
    if (!form.password) local.password = 'Enter your password';
    setErrors(local);
    setFormError('');
    if (Object.keys(local).length) return;
    setSubmitting(true);
    try {
      const session = await api('/api/auth/login', { method: 'POST', body: form });
      signIn(session);
      toast(`Welcome back, ${session.user.name.split(' ')[0]}`);
      navigate(target, { replace: true });
    } catch (err) {
      setErrors(fieldErrors(err));
      setFormError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="page page--auth">
      <div className="auth-card">
        <h1 className="auth-card__title">Sign in</h1>
        <p className="muted">Book cars and manage your trips.</p>

        <div className="demo-hint">
          <ion-icon name="key-outline" aria-hidden="true"></ion-icon>
          <p>
            Just looking around? Use the demo account to see bookings and trips.
            <button type="button" className="link-button" onClick={() => setForm(DEMO_ACCOUNT)}>
              Fill in demo details
            </button>
          </p>
        </div>

        {formError && (
          <p className="notice notice--error" role="alert">
            {formError}
          </p>
        )}

        <form onSubmit={submit} noValidate className="stack">
          <Field
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={set('email')}
            error={errors.email}
          />
          <Field
            id="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            value={form.password}
            onChange={set('password')}
            error={errors.password}
          />
          <button type="submit" className="btn btn--primary btn--lg btn--block" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p className="auth-card__switch">
          New to Ridex?{' '}
          <Link to="/register" state={location.state}>
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
