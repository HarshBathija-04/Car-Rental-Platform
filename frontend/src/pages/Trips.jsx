import { useState } from 'react';
import { Link } from 'react-router-dom';
import { EmptyState, ErrorState } from '../components/States.jsx';
import { api } from '../lib/api.js';
import { useAuth, useToast } from '../lib/context.js';
import { daysBetween, formatINR, formatRange, todayIso } from '../lib/dates.js';
import { useApi } from '../lib/useApi.js';

function TripRow({ booking, today, onCancelled }) {
  const toast = useToast();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const { car } = booking;
  const upcoming = booking.status === 'confirmed' && booking.startDate > today;
  const active = booking.status === 'confirmed' && booking.startDate <= today && booking.endDate > today;
  const status =
    booking.status === 'cancelled' ? 'Cancelled' : active ? 'On the road' : upcoming ? 'Upcoming' : 'Completed';
  const days = daysBetween(booking.startDate, booking.endDate);

  const cancel = async () => {
    setBusy(true);
    try {
      await api(`/api/bookings/${booking.id}/cancel`, { method: 'POST' });
      toast('Trip cancelled. The dates are free for others again.', 'info');
      onCancelled();
    } catch (err) {
      toast(err.message, 'error');
      setBusy(false);
      setConfirming(false);
    }
  };

  return (
    <li className={`trip ${booking.status === 'cancelled' ? 'trip--cancelled' : ''}`}>
      <img className="trip__img" src={car.image} alt="" width="440" height="300" loading="lazy" />
      <div className="trip__body">
        <div className="trip__top">
          <h3 className="trip__title">
            <Link to={`/cars/${car.id}`}>
              {car.make} {car.model}
            </Link>
          </h3>
          <span className={`badge badge--${status.toLowerCase().replace(/\s/g, '-')}`}>{status}</span>
        </div>
        <p className="trip__meta">
          <ion-icon name="calendar-outline" aria-hidden="true"></ion-icon>
          {formatRange(booking.startDate, booking.endDate)} · {days} {days === 1 ? 'day' : 'days'}
        </p>
        <p className="trip__meta">
          <ion-icon name="location-outline" aria-hidden="true"></ion-icon>
          Pick-up in {car.city} · Booking #{booking.id}
        </p>
      </div>
      <div className="trip__side">
        <p className="trip__price">{formatINR(booking.totalPrice)}</p>
        {upcoming &&
          (confirming ? (
            <div className="trip__confirm" role="group" aria-label="Confirm cancellation">
              <button type="button" className="btn btn--danger btn--sm" onClick={cancel} disabled={busy}>
                {busy ? 'Cancelling…' : 'Yes, cancel'}
              </button>
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={() => setConfirming(false)}
                disabled={busy}
              >
                Keep it
              </button>
            </div>
          ) : (
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => setConfirming(true)}>
              Cancel trip
            </button>
          ))}
      </div>
    </li>
  );
}

function TripSkeleton() {
  return (
    <ul className="trips" aria-busy="true" aria-label="Loading trips">
      {[0, 1].map((i) => (
        <li key={i} className="trip">
          <div className="skeleton trip__img"></div>
          <div className="trip__body">
            <div className="skeleton skeleton--text" style={{ width: '50%' }}></div>
            <div className="skeleton skeleton--text" style={{ width: '70%' }}></div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function Trips() {
  const { user } = useAuth();
  const { data, error, loading, reload } = useApi('/api/bookings/me');
  const today = todayIso();
  const bookings = data?.bookings;

  const upcoming = bookings?.filter((b) => b.status === 'confirmed' && b.endDate > today).reverse() ?? [];
  const history = bookings?.filter((b) => !(b.status === 'confirmed' && b.endDate > today)) ?? [];
  const spent = bookings?.filter((b) => b.status === 'confirmed').reduce((sum, b) => sum + b.totalPrice, 0) ?? 0;

  return (
    <div className="page">
      <div className="container container--narrow">
        <header className="page__head trips-head">
          <div>
            <p className="eyebrow">My trips</p>
            <h1 className="page__title">Hi, {user.name.split(' ')[0]}</h1>
            <p className="muted">{user.email}</p>
          </div>
          {bookings && (
            <dl className="stats">
              <div>
                <dt>Upcoming</dt>
                <dd>{upcoming.length}</dd>
              </div>
              <div>
                <dt>All trips</dt>
                <dd>{bookings.filter((b) => b.status === 'confirmed').length}</dd>
              </div>
              <div>
                <dt>Total booked</dt>
                <dd>{formatINR(spent)}</dd>
              </div>
            </dl>
          )}
        </header>

        {error ? (
          <ErrorState error={error} onRetry={reload} />
        ) : loading && !bookings ? (
          <TripSkeleton />
        ) : bookings.length === 0 ? (
          <EmptyState
            icon="map-outline"
            title="No trips yet"
            action={
              <Link to="/cars" className="btn btn--primary">
                Find a car
              </Link>
            }
          >
            Pick your dates and book a car. It will show up here.
          </EmptyState>
        ) : (
          <>
            <section aria-labelledby="upcoming-title" className="trips-section">
              <h2 id="upcoming-title" className="trips-section__title">
                Upcoming and active
              </h2>
              {upcoming.length ? (
                <ul className="trips">
                  {upcoming.map((b) => (
                    <TripRow key={b.id} booking={b} today={today} onCancelled={reload} />
                  ))}
                </ul>
              ) : (
                <p className="muted">
                  Nothing planned. <Link to="/cars">Book your next drive</Link>.
                </p>
              )}
            </section>
            {history.length > 0 && (
              <section aria-labelledby="history-title" className="trips-section">
                <h2 id="history-title" className="trips-section__title">
                  Past and cancelled
                </h2>
                <ul className="trips">
                  {history.map((b) => (
                    <TripRow key={b.id} booking={b} today={today} onCancelled={reload} />
                  ))}
                </ul>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
