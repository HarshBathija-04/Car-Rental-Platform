import { useState } from 'react';
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import AvailabilityPicker from '../components/AvailabilityPicker.jsx';
import { CarSpecs } from '../components/CarCard.jsx';
import { EmptyState, ErrorState } from '../components/States.jsx';
import { api } from '../lib/api.js';
import { useAuth, useToast } from '../lib/context.js';
import { addDays, daysBetween, formatDate, formatINR, todayIso, validateRange } from '../lib/dates.js';
import { useApi } from '../lib/useApi.js';

function DetailsSkeleton() {
  return (
    <div className="details" aria-busy="true" aria-label="Loading car">
      <div className="skeleton details__media"></div>
      <div className="details__panel">
        <div className="skeleton skeleton--text" style={{ width: '60%' }}></div>
        <div className="skeleton skeleton--block"></div>
        <div className="skeleton skeleton--block"></div>
      </div>
    </div>
  );
}

export default function CarDetails() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const toast = useToast();
  const today = todayIso();

  const carReq = useApi(`/api/cars/${encodeURIComponent(id)}`);
  const availReq = useApi(`/api/cars/${encodeURIComponent(id)}/availability`);
  const booked = availReq.data?.booked ?? [];

  const [range, setRange] = useState({ start: params.get('from') || '', end: params.get('to') || '' });
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState(false);

  if (carReq.error?.status === 404 || carReq.error?.code === 'VALIDATION_ERROR') {
    return (
      <div className="page">
        <div className="container">
          <EmptyState
            headingLevel={1}
            title="We could not find that car"
            action={
              <Link to="/cars" className="btn btn--primary">
                Browse the fleet
              </Link>
            }
          >
            It may have been retired from the fleet.
          </EmptyState>
        </div>
      </div>
    );
  }

  const car = carReq.data?.car;
  const days = range.start && range.end && range.end > range.start ? daysBetween(range.start, range.end) : 0;
  const problem = validateRange(range.start, range.end, booked, today);
  const showProblem = touched && problem;

  const book = async (e) => {
    e.preventDefault();
    setTouched(true);
    if (problem) return;
    if (!user) {
      toast('Sign in to finish your booking. Your dates are saved.', 'info');
      navigate('/login', {
        state: { from: { pathname: location.pathname, search: `?from=${range.start}&to=${range.end}` } },
      });
      return;
    }
    setSubmitting(true);
    try {
      await api('/api/bookings', {
        method: 'POST',
        body: { carId: car.id, startDate: range.start, endDate: range.end },
      });
      toast(`Booked! Pick up your ${car.make} on ${formatDate(range.start, { day: 'numeric', month: 'long' })}.`);
      navigate('/trips');
    } catch (err) {
      toast(err.message, 'error');
      if (err.code === 'DATES_UNAVAILABLE') availReq.reload();
      setSubmitting(false);
    }
  };

  return (
    <div className="page">
      <div className="container">
        <nav aria-label="Breadcrumb" className="breadcrumb">
          <Link to="/cars">Fleet</Link>
          <ion-icon name="chevron-forward" aria-hidden="true"></ion-icon>
          <span aria-current="page">{car ? `${car.make} ${car.model}` : 'Loading'}</span>
        </nav>

        {carReq.error ? (
          <ErrorState error={carReq.error} onRetry={carReq.reload} />
        ) : !car ? (
          <DetailsSkeleton />
        ) : (
          <div className="details">
            <div className="details__main">
              <figure className="details__media">
                <img
                  src={car.image}
                  alt={`${car.color} ${car.year} ${car.make} ${car.model}`}
                  width="440"
                  height="300"
                />
              </figure>
              <div className="details__intro">
                <div className="details__chips">
                  <span className="chip">{car.category}</span>
                  <span className="chip chip--muted">
                    <ion-icon name="location-outline" aria-hidden="true"></ion-icon>
                    {car.city}
                  </span>
                </div>
                <h1 className="page__title">
                  {car.make} {car.model} <span className="details__year">{car.year}</span>
                </h1>
                <p className="details__desc">{car.description}</p>
                <CarSpecs car={car} />
                <h2 className="details__subtitle">Included</h2>
                <ul className="features">
                  {car.features.map((f) => (
                    <li key={f}>
                      <ion-icon name="checkmark-circle" aria-hidden="true"></ion-icon>
                      {f}
                    </li>
                  ))}
                  <li>
                    <ion-icon name="checkmark-circle" aria-hidden="true"></ion-icon>
                    {car.color} paint
                  </li>
                </ul>
              </div>
            </div>

            <aside className="details__panel booking" aria-labelledby="booking-title">
              <div className="booking__head">
                <h2 id="booking-title" className="booking__title">
                  Book this car
                </h2>
                <p className="price price--lg">
                  <strong>{formatINR(car.pricePerDay)}</strong>
                  <span> / day</span>
                </p>
              </div>

              <form onSubmit={book} noValidate>
                {availReq.error ? (
                  <p className="notice notice--error">
                    Could not load availability.{' '}
                    <button type="button" className="link-button" onClick={availReq.reload}>
                      Retry
                    </button>
                  </p>
                ) : availReq.loading && !availReq.data ? (
                  <div className="skeleton picker-skeleton" aria-label="Loading availability"></div>
                ) : (
                  <AvailabilityPicker
                    today={today}
                    booked={booked}
                    start={range.start}
                    end={range.end}
                    onChange={(r) => {
                      setRange(r);
                      setTouched(Boolean(r.end));
                    }}
                  />
                )}

                <div className="booking__dates">
                  <div className="field">
                    <label htmlFor="b-start" className="field__label">
                      Pick-up
                    </label>
                    <input
                      id="b-start"
                      className="field__control"
                      type="date"
                      min={today}
                      value={range.start}
                      onChange={(e) => setRange((r) => ({ ...r, start: e.target.value }))}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="b-end" className="field__label">
                      Return
                    </label>
                    <input
                      id="b-end"
                      className="field__control"
                      type="date"
                      min={range.start ? addDays(range.start, 1) : today}
                      value={range.end}
                      aria-invalid={Boolean(showProblem)}
                      aria-describedby={showProblem ? 'booking-problem' : undefined}
                      onChange={(e) => {
                        setRange((r) => ({ ...r, end: e.target.value }));
                        setTouched(true);
                      }}
                    />
                  </div>
                </div>

                {showProblem && (
                  <p id="booking-problem" className="notice notice--error" role="alert">
                    {problem}
                  </p>
                )}

                <dl className="quote">
                  <div>
                    <dt>
                      {days ? `${formatINR(car.pricePerDay)} × ${days} ${days === 1 ? 'day' : 'days'}` : 'Rental'}
                    </dt>
                    <dd>{days ? formatINR(car.pricePerDay * days) : 'Choose dates'}</dd>
                  </div>
                  <div className="quote__total">
                    <dt>Total</dt>
                    <dd>{days ? formatINR(car.pricePerDay * days) : '–'}</dd>
                  </div>
                </dl>

                <button type="submit" className="btn btn--primary btn--lg btn--block" disabled={submitting}>
                  {submitting ? 'Locking your dates…' : user ? 'Confirm booking' : 'Sign in to book'}
                </button>
                <p className="booking__fine">Free cancellation until the day before pick-up.</p>
              </form>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
