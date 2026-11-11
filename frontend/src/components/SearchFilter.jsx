import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CITIES } from '../lib/constants.js';
import { addDays, todayIso } from '../lib/dates.js';

/** Date-first hero search: dates and city go to the fleet page as query params. */
export default function SearchFilter() {
  const navigate = useNavigate();
  const today = todayIso();
  const [city, setCity] = useState('');
  const [from, setFrom] = useState(addDays(today, 1));
  const [to, setTo] = useState(addDays(today, 4));
  const invalid = to <= from;

  const submit = (e) => {
    e.preventDefault();
    if (invalid) return;
    navigate(`/cars?${new URLSearchParams({ ...(city && { city }), from, to })}`);
  };

  const changeFrom = (value) => {
    setFrom(value);
    if (value && to <= value) setTo(addDays(value, 1));
  };

  return (
    <form className="hero-search" onSubmit={submit} aria-label="Search available cars">
      <div className="hero-search__field">
        <label htmlFor="hs-city">Pick-up city</label>
        <select id="hs-city" value={city} onChange={(e) => setCity(e.target.value)}>
          <option value="">Any city</option>
          {CITIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>
      <div className="hero-search__field">
        <label htmlFor="hs-from">Pick-up</label>
        <input
          id="hs-from"
          type="date"
          min={today}
          value={from}
          required
          onChange={(e) => changeFrom(e.target.value)}
        />
      </div>
      <div className="hero-search__field">
        <label htmlFor="hs-to">Return</label>
        <input
          id="hs-to"
          type="date"
          min={from ? addDays(from, 1) : today}
          value={to}
          required
          aria-invalid={invalid}
          aria-describedby={invalid ? 'hs-error' : undefined}
          onChange={(e) => setTo(e.target.value)}
        />
      </div>
      <button type="submit" className="btn btn--primary btn--lg" disabled={invalid}>
        <ion-icon name="search-outline" aria-hidden="true"></ion-icon>
        Show free cars
      </button>
      {invalid && (
        <p id="hs-error" className="hero-search__error" role="alert">
          Return date must be after pick-up.
        </p>
      )}
    </form>
  );
}
