import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CarGrid } from '../components/CarCard.jsx';
import { EmptyState, ErrorState } from '../components/States.jsx';
import { CATEGORIES, CITIES, PRICE_OPTIONS, SEAT_OPTIONS } from '../lib/constants.js';
import { addDays, formatINR, formatRange, todayIso } from '../lib/dates.js';
import { useApi } from '../lib/useApi.js';

const FILTER_KEYS = ['q', 'city', 'category', 'seats', 'maxPrice', 'from', 'to'];

export default function Cars() {
  const [params, setParams] = useSearchParams();
  const get = (k) => params.get(k) || '';
  const [q, setQ] = useState(get('q'));
  const today = todayIso();

  const from = get('from');
  const to = get('to');
  const datesValid = Boolean(from && to && to > from);

  // Only send complete, valid filters to the API.
  const query = new URLSearchParams();
  for (const k of FILTER_KEYS) {
    if ((k === 'from' || k === 'to') && !datesValid) continue;
    if (get(k)) query.set(k, get(k));
  }
  const qs = query.toString();
  const { data, error, loading, reload } = useApi(`/api/cars${qs ? `?${qs}` : ''}`);

  const update = (key, value) => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value) next.set(key, value);
        else next.delete(key);
        if (key === 'from' && value && next.get('to') && next.get('to') <= value) next.set('to', addDays(value, 1));
        return next;
      },
      { replace: true },
    );
  };

  // Debounce the free-text search so typing does not fire a request per key.
  useEffect(() => {
    const t = setTimeout(() => {
      if (q !== (params.get('q') || '')) update('q', q.trim());
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only re-run when the typed text changes
  }, [q]);

  const reset = () => {
    setQ('');
    setParams({}, { replace: true });
  };
  const hasFilters = FILTER_KEYS.some((k) => get(k));
  const dateSearch = datesValid ? `?from=${from}&to=${to}` : '';
  const cars = data?.cars;

  return (
    <div className="page">
      <div className="container">
        <header className="page__head">
          <p className="eyebrow">The fleet</p>
          <h1 className="page__title">Find a car for your dates</h1>
        </header>

        <form className="filters" role="search" onSubmit={(e) => e.preventDefault()}>
          <div className="field filters__search">
            <label htmlFor="f-q" className="field__label">
              Make or model
            </label>
            <div className="input-icon">
              <ion-icon name="search-outline" aria-hidden="true"></ion-icon>
              <input
                id="f-q"
                className="field__control"
                type="search"
                value={q}
                placeholder="e.g. BMW, Escalade"
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
          </div>
          <div className="field">
            <label htmlFor="f-from" className="field__label">
              Pick-up
            </label>
            <input
              id="f-from"
              className="field__control"
              type="date"
              min={today}
              value={from}
              onChange={(e) => update('from', e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="f-to" className="field__label">
              Return
            </label>
            <input
              id="f-to"
              className="field__control"
              type="date"
              min={from ? addDays(from, 1) : today}
              value={to}
              onChange={(e) => update('to', e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="f-city" className="field__label">
              City
            </label>
            <select
              id="f-city"
              className="field__control"
              value={get('city')}
              onChange={(e) => update('city', e.target.value)}
            >
              <option value="">Any city</option>
              {CITIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="f-category" className="field__label">
              Type
            </label>
            <select
              id="f-category"
              className="field__control"
              value={get('category')}
              onChange={(e) => update('category', e.target.value)}
            >
              <option value="">Any type</option>
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="f-seats" className="field__label">
              Seats
            </label>
            <select
              id="f-seats"
              className="field__control"
              value={get('seats')}
              onChange={(e) => update('seats', e.target.value)}
            >
              <option value="">Any</option>
              {SEAT_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}+ seats
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="f-price" className="field__label">
              Budget
            </label>
            <select
              id="f-price"
              className="field__control"
              value={get('maxPrice')}
              onChange={(e) => update('maxPrice', e.target.value)}
            >
              <option value="">Any budget</option>
              {PRICE_OPTIONS.map((p) => (
                <option key={p} value={p}>
                  Up to {formatINR(p)} / day
                </option>
              ))}
            </select>
          </div>
        </form>

        <div className="results-bar" aria-live="polite">
          <p>
            {cars ? (
              <>
                <strong>{cars.length}</strong> {cars.length === 1 ? 'car' : 'cars'}
                {datesValid ? ` free for ${formatRange(from, to)}` : ' in the fleet'}
              </>
            ) : (
              'Loading cars…'
            )}
            {(from || to) && !datesValid && (
              <span className="results-bar__hint"> · add both dates to check availability</span>
            )}
          </p>
          {hasFilters && (
            <button type="button" className="btn btn--ghost btn--sm" onClick={reset}>
              Clear filters
            </button>
          )}
        </div>

        {error ? (
          <ErrorState error={error} onRetry={reload} />
        ) : cars && cars.length === 0 && !loading ? (
          <EmptyState
            icon="search-outline"
            title="No cars match"
            action={
              <button type="button" className="btn btn--primary" onClick={reset}>
                Clear filters
              </button>
            }
          >
            {datesValid
              ? 'Everything that fits is booked for those dates. Try shifting by a day or widening the filters.'
              : 'Try a different city, type or budget.'}
          </EmptyState>
        ) : (
          <CarGrid cars={cars} loading={loading} search={dateSearch} skeletons={6} />
        )}
      </div>
    </div>
  );
}
