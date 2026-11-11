import { useState } from 'react';
import { api } from '../lib/api.js';
import CarCard from './CarCard.jsx';

const EXAMPLES = [
  'Six of us, Mumbai airport to Lonavala for a wedding weekend',
  'Solo work trip around Pune, cheap and easy to park',
  'Something fun for a Nandi Hills sunrise drive from Bengaluru',
];

export default function TripAdvisor({ cars }) {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | done | error
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const ask = async (e) => {
    e.preventDefault();
    if (message.trim().length < 5) {
      setError('Tell us a little more about your trip.');
      setStatus('error');
      return;
    }
    setStatus('loading');
    setError('');
    try {
      setResult(await api('/api/ai/recommend', { method: 'POST', body: { message } }));
      setStatus('done');
    } catch (err) {
      setError(
        err.code === 'AI_UNAVAILABLE'
          ? 'The advisor is offline right now. Browse the fleet instead: every car lists its seats, fuel and efficiency.'
          : err.message,
      );
      setStatus('error');
    }
  };

  const picks = result && cars ? result.carIds.map((id) => cars.find((c) => c.id === id)).filter(Boolean) : [];

  return (
    <div className="advisor">
      <form className="advisor__form" onSubmit={ask}>
        <label htmlFor="advisor-input" className="advisor__label">
          Describe your trip
        </label>
        <textarea
          id="advisor-input"
          rows={3}
          maxLength={500}
          value={message}
          placeholder="Who is coming, where you are going and what matters most"
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className="advisor__examples">
          <span className="advisor__examples-label">Try:</span>
          {EXAMPLES.map((ex) => (
            <button key={ex} type="button" className="chip chip--button" onClick={() => setMessage(ex)}>
              {ex}
            </button>
          ))}
        </div>
        <button type="submit" className="btn btn--primary" disabled={status === 'loading'}>
          <ion-icon name="sparkles-outline" aria-hidden="true"></ion-icon>
          {status === 'loading' ? 'Finding your match…' : 'Recommend a car'}
        </button>
      </form>

      <div className="advisor__result" aria-live="polite" aria-busy={status === 'loading'}>
        {status === 'idle' && (
          <p className="advisor__placeholder">
            Recommendations come only from cars in the fleet, with the reason for each pick.
          </p>
        )}
        {status === 'loading' && (
          <div className="advisor__thinking">
            <div className="skeleton skeleton--text" style={{ width: '90%' }}></div>
            <div className="skeleton skeleton--text" style={{ width: '75%' }}></div>
            <div className="skeleton skeleton--text" style={{ width: '60%' }}></div>
          </div>
        )}
        {status === 'error' && (
          <p className="notice notice--error" role="alert">
            {error}
          </p>
        )}
        {status === 'done' && result && (
          <>
            <p className="advisor__reply">{result.reply}</p>
            {picks.length > 0 && (
              <ul className="advisor__picks">
                {picks.map((car) => (
                  <li key={car.id}>
                    <CarCard car={car} />
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
}
