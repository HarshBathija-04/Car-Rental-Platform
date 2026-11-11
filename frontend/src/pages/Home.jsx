import { Link } from 'react-router-dom';
import { CarGrid } from '../components/CarCard.jsx';
import SearchFilter from '../components/SearchFilter.jsx';
import { ErrorState } from '../components/States.jsx';
import TripAdvisor from '../components/TripAdvisor.jsx';
import { CITIES } from '../lib/constants.js';
import { formatINR } from '../lib/dates.js';
import { useApi } from '../lib/useApi.js';

const STEPS = [
  {
    icon: 'calendar-outline',
    title: 'Choose your dates',
    text: 'Start with when you need the car. The fleet filters itself to what is actually free.',
  },
  {
    icon: 'car-sport-outline',
    title: 'Pick the right car',
    text: 'Compare seats, fuel and efficiency side by side, or ask the trip advisor for a shortlist.',
  },
  {
    icon: 'key-outline',
    title: 'Book and drive',
    text: 'Your dates are locked the moment you confirm. Change of plan? Cancel upcoming trips from My trips.',
  },
];

export default function Home() {
  const { data, error, loading, reload } = useApi('/api/cars');
  const cars = data?.cars;
  const from = cars?.length ? Math.min(...cars.map((c) => c.pricePerDay)) : null;

  return (
    <>
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__content">
            <p className="eyebrow">Self-drive rentals in {new Intl.ListFormat('en-GB').format(CITIES)}</p>
            <h1 className="hero__title">Pick the dates. We will show you what is free.</h1>
            <p className="hero__text">
              No more enquiring about cars that turn out to be booked. Every car on Ridex shows live availability, and
              your booking locks the dates instantly.
            </p>
          </div>
          <figure className="hero__media">
            <img src="/images/hero-banner.jpg" alt="A BMW i8 driving through a tunnel" width="1391" height="1198" />
            <figcaption className="hero__stat" aria-live="polite">
              {cars ? (
                <>
                  <strong>{cars.length} cars</strong>
                  <span>from {formatINR(from)} / day</span>
                </>
              ) : (
                <span>Loading the fleet…</span>
              )}
            </figcaption>
          </figure>
          <SearchFilter />
        </div>
      </section>

      <section className="section" aria-labelledby="featured-title">
        <div className="container">
          <div className="section__head">
            <div>
              <p className="eyebrow">The fleet</p>
              <h2 id="featured-title" className="section__title">
                Easy on the wallet
              </h2>
            </div>
            <Link to="/cars" className="link-arrow">
              See all cars <ion-icon name="arrow-forward-outline" aria-hidden="true"></ion-icon>
            </Link>
          </div>
          {error ? (
            <ErrorState error={error} onRetry={reload} />
          ) : (
            <CarGrid cars={cars?.slice(0, 3)} loading={loading} />
          )}
        </div>
      </section>

      <section className="section section--tinted" id="advisor" aria-labelledby="advisor-title">
        <div className="container advisor-section">
          <div className="advisor-section__intro">
            <p className="eyebrow">
              <ion-icon name="sparkles" aria-hidden="true"></ion-icon> AI trip advisor
            </p>
            <h2 id="advisor-title" className="section__title">
              Not sure which car fits?
            </h2>
            <p>
              Describe the trip in your own words. The advisor reads the live fleet and suggests up to three cars, with
              the reason for each.
            </p>
          </div>
          <TripAdvisor cars={cars} />
        </div>
      </section>

      <section className="section" aria-labelledby="steps-title">
        <div className="container">
          <p className="eyebrow">How it works</p>
          <h2 id="steps-title" className="section__title">
            From dates to driving in three steps
          </h2>
          <ol className="steps">
            {STEPS.map((s, i) => (
              <li key={s.title} className="step">
                <span className={`step__icon step__icon--${i + 1}`} aria-hidden="true">
                  <ion-icon name={s.icon}></ion-icon>
                </span>
                <h3 className="step__title">{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
