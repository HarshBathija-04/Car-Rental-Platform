import { Link, Navigate, useLocation } from 'react-router-dom';
import Field from '../components/Field.jsx';
import { DEMO_ACCOUNT } from '../lib/constants.js';
import { useAuthForm } from '../lib/useAuthForm.js';

const validate = (form) => ({
  ...(!form.email && { email: 'Enter your email' }),
  ...(!form.password && { password: 'Enter your password' }),
});

export default function Login() {
  const location = useLocation();
  const { form, setForm, set, errors, formError, submitting, submit, target, signedIn } = useAuthForm({
    initial: { email: '', password: '' },
    endpoint: '/api/auth/login',
    validate,
    welcome: (user) => `Welcome back, ${user.name.split(' ')[0]}`,
    fallback: '/trips',
  });

  if (signedIn) return <Navigate to={target} replace />;

  return (
    <div className="page page--auth">
      <div className="auth-card">
        <h1 className="auth-card__title">Welcome back</h1>
        <p className="muted">Sign in to book cars and manage your trips.</p>

        <div className="demo-hint">
          <ion-icon name="key-outline" aria-hidden="true"></ion-icon>
          <p>
            Just looking around? The demo account already has upcoming and past trips.
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
