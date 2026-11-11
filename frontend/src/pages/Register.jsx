import { Link, Navigate, useLocation } from 'react-router-dom';
import Field from '../components/Field.jsx';
import { useAuthForm } from '../lib/useAuthForm.js';

const validate = (form) => ({
  ...(form.name.trim().length < 2 && { name: 'Enter your name' }),
  ...(!/^\S+@\S+\.\S+$/.test(form.email) && { email: 'Enter a valid email address' }),
  ...(form.password.length < 8 && { password: 'Use at least 8 characters' }),
  ...(form.confirm !== form.password && { confirm: 'Passwords do not match' }),
});

export default function Register() {
  const location = useLocation();
  const { form, set, errors, formError, submitting, submit, target, signedIn } = useAuthForm({
    initial: { name: '', email: '', password: '', confirm: '' },
    endpoint: '/api/auth/register',
    validate,
    toBody: ({ name, email, password }) => ({ name, email, password }),
    welcome: (user) => `Welcome to Ridex, ${user.name.split(' ')[0]}. Pick a car and some dates.`,
    fallback: '/cars',
  });

  if (signedIn) return <Navigate to={target} replace />;

  return (
    <div className="page page--auth">
      <div className="auth-card">
        <h1 className="auth-card__title">Create your account</h1>
        <p className="muted">It takes a few seconds and keeps all your trips in one place.</p>

        {formError && (
          <p className="notice notice--error" role="alert">
            {formError}
          </p>
        )}

        <form onSubmit={submit} noValidate className="stack">
          <Field
            id="name"
            label="Full name"
            autoComplete="name"
            value={form.name}
            onChange={set('name')}
            error={errors.name}
          />
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
            autoComplete="new-password"
            hint="At least 8 characters"
            value={form.password}
            onChange={set('password')}
            error={errors.password}
          />
          <Field
            id="confirm"
            label="Confirm password"
            type="password"
            autoComplete="new-password"
            value={form.confirm}
            onChange={set('confirm')}
            error={errors.confirm}
          />
          <button type="submit" className="btn btn--primary btn--lg btn--block" disabled={submitting}>
            {submitting ? 'Creating your account…' : 'Create account'}
          </button>
        </form>
        <p className="auth-card__switch">
          Already have an account?{' '}
          <Link to="/login" state={location.state}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
