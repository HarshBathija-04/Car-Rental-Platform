import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api, fieldErrors } from './api.js';
import { useAuth, useToast } from './context.js';

/** Shared sign-in / sign-up form state: local checks, API errors per field, then redirect back. */
export function useAuthForm({ initial, endpoint, validate, toBody = (form) => form, welcome, fallback }) {
  const { user, signIn } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;
  const target = from ? `${from.pathname}${from.search || ''}` : fallback;

  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const local = validate(form);
    setErrors(local);
    setFormError('');
    if (Object.keys(local).length) return;
    setSubmitting(true);
    try {
      const session = await api(endpoint, { method: 'POST', body: toBody(form) });
      signIn(session);
      toast(welcome(session.user));
      navigate(target, { replace: true });
    } catch (err) {
      setErrors(fieldErrors(err));
      setFormError(err.message);
      setSubmitting(false);
    }
  };

  return { form, setForm, set, errors, formError, submitting, submit, target, signedIn: Boolean(user) && !submitting };
}
