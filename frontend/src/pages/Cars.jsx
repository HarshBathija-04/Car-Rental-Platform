import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CarGrid } from '../components/CarCard.jsx';
import { EmptyState, ErrorState } from '../components/States.jsx';
import { CATEGORIES, CITIES, PRICE_OPTIONS, SEAT_OPTIONS } from '../lib/constants.js';
import { addDays, formatINR, formatRange, todayIso } from '../lib/dates.js';
import { useApi } from '../lib/useApi.js';

const FILTER_KEYS = ['q', 'city', 'category', 'seats', 'maxPrice', 'from', 'to'];
const SELECTS = [
  { key: 'city', label: 'City', any: 'Any city', options: CITIES.map((c) => [c, c]) },
  { key: 'category', label: 'Type', any: 'Any type', options: CATEGORIES.map((c) => [c, c]) },
  { key: 'seats', label: 'Seats', any: 'Any', options: SEAT_OPTIONS.map((n) => [n, `${n}+ seats`]) },
  {
    key: 'maxPrice',
    label: 'Budget',
    any: 'Any budget',
    options: PRICE_OPTIONS.map((n) => [n, `Up to ${formatINR(n)} / day`]),
  },
];

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
                placeholder="e.g. BMW"
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
          {SELECTS.map(({ key, label, any, options }) => (
            <div className="field" key={key}>
              <label htmlFor={`f-${key}`} className="field__label">
                {label}
              </label>
              <select
                id={`f-${key}`}
                className="field__control"
                value={get(key)}
                onChange={(e) => update(key, e.target.value)}
              >
                <option value="">{any}</option>
                {options.map(([value, text]) => (
                  <option key={value} value={value}>
                    {text}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </form>

        <div className="results-bar" aria-live="polite">
          <p>
            {cars ? (
              <>
                <strong>{cars.length}</strong> {cars.length === 1 ? 'car' : 'cars'}
                {datesValid
                  ? ` free for ${formatRange(from, to)}`
                  : hasFilters
                    ? ` ${cars.length === 1 ? 'matches' : 'match'} your filters`
                    : ' in the fleet'}
              </>
            ) : (
              'Loading cars…'
            )}
            {(from || to) && !datesValid && (
              <span className="results-bar__hint"> · add both dates to check availability</span>
            )}
          </p>
          {hasFilters && cars?.length > 0 && (
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
              : 'Try another make or model, or loosen the city, type, seats or budget.'}
          </EmptyState>
        ) : (
          <CarGrid cars={cars} loading={loading} search={dateSearch} skeletons={6} />
        )}
      </div>
    </div>
  );
}
