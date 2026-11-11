import { Link } from 'react-router-dom';
import { formatINR } from '../lib/dates.js';

export function CarSpecs({ car }) {
  return (
    <ul className="specs">
      <li>
        <ion-icon name="people-outline" aria-hidden="true"></ion-icon>
        {car.seats} seats
      </li>
      <li>
        <ion-icon name={car.fuel === 'Hybrid' ? 'leaf-outline' : 'flame-outline'} aria-hidden="true"></ion-icon>
        {car.fuel}
      </li>
      <li>
        <ion-icon name="speedometer-outline" aria-hidden="true"></ion-icon>
        {car.efficiencyKmpl} km/l
      </li>
      <li>
        <ion-icon name="cog-outline" aria-hidden="true"></ion-icon>
        {car.transmission}
      </li>
    </ul>
  );
}

/** `search` carries the selected dates through to the details page. */
export default function CarCard({ car, search = '' }) {
  const href = `/cars/${car.id}${search}`;
  return (
    <article className="car-card">
      <Link to={href} className="car-card__media" tabIndex={-1} aria-hidden="true">
        <img src={car.image} alt="" loading="lazy" width="440" height="300" />
      </Link>
      <span className="chip car-card__chip">{car.category}</span>
      <div className="car-card__body">
        <div className="car-card__heading">
          <h3 className="car-card__title">
            <Link to={href}>
              {car.make} {car.model}
            </Link>
          </h3>
          <span className="car-card__year">{car.year}</span>
        </div>
        <p className="car-card__city">
          <ion-icon name="location-outline" aria-hidden="true"></ion-icon>
          {car.city}
        </p>
        <CarSpecs car={car} />
        <div className="car-card__footer">
          <p className="price">
            <strong>{formatINR(car.pricePerDay)}</strong>
            <span> / day</span>
          </p>
          <Link to={href} className="btn btn--primary btn--sm">
            View dates
          </Link>
        </div>
      </div>
    </article>
  );
}

function CarCardSkeleton() {
  return (
    <div className="car-card car-card--skeleton" aria-hidden="true">
      <div className="skeleton car-card__media"></div>
      <div className="car-card__body">
        <div className="skeleton skeleton--text" style={{ width: '70%' }}></div>
        <div className="skeleton skeleton--text" style={{ width: '35%' }}></div>
        <div className="skeleton skeleton--block"></div>
        <div className="skeleton skeleton--text" style={{ width: '50%' }}></div>
      </div>
    </div>
  );
}

export function CarGrid({ cars, loading, search, skeletons = 3 }) {
  if (loading && !cars) {
    return (
      <div className="car-grid" aria-busy="true" aria-label="Loading cars">
        {Array.from({ length: skeletons }, (_, i) => (
          <CarCardSkeleton key={i} />
        ))}
      </div>
    );
  }
  return (
    <ul className={`car-grid ${loading ? 'is-refreshing' : ''}`} aria-busy={loading}>
      {cars.map((car) => (
        <li key={car.id}>
          <CarCard car={car} search={search} />
        </li>
      ))}
    </ul>
  );
}
