import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Field from '../components/Field.jsx';
import { api, fieldErrors } from '../lib/api.js';
import { useAuth, useToast } from '../lib/context.js';

export default function Register() {
  const { user, signIn } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;
  const target = from ? `${from.pathname}${from.search || ''}` : '/cars';

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (user && !submitting) return <Navigate to={target} replace />;

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const local = {};
    if (form.name.trim().length < 2) local.name = 'Enter your name';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) local.email = 'Enter a valid email address';
    if (form.password.length < 8) local.password = 'Use at least 8 characters';
    if (form.confirm !== form.password) local.confirm = 'Passwords do not match';
    setErrors(local);
    setFormError('');
    if (Object.keys(local).length) return;
    setSubmitting(true);
    try {
      const { name, email, password } = form;
      const session = await api('/api/auth/register', { method: 'POST', body: { name, email, password } });
      signIn(session);
      toast('Account created. Pick a car and some dates.');
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
        <h1 className="auth-card__title">Create your account</h1>
        <p className="muted">It takes a few seconds and keeps your trips in one place.</p>

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
            {submitting ? 'Creating account…' : 'Create account'}
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
