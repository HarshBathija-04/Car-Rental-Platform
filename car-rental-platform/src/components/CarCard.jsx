import { Link } from 'react-router-dom';

function CarCard({ car }) {
  return (
    <li>
      <div className="featured-car-card">
        <figure className="card-banner">
          <img 
            src={car.image} 
            alt={`${car.make} ${car.model} ${car.year}`} 
            loading="lazy" 
            width="440" 
            height="300"
            className="w-100" 
          />
        </figure>

        <div className="card-content">
          <div className="card-title-wrapper">
            <h3 className="h3 card-title">
              <Link to={`/cars/${car.id}`}>{car.make} {car.model}</Link>
            </h3>
            <data className="year" value={car.year}>{car.year}</data>
          </div>

          <ul className="card-list">
            <li className="card-list-item">
              <ion-icon name="people-outline"></ion-icon>
              <span className="card-item-text">{car.capacity} People</span>
            </li>

            <li className="card-list-item">
              <ion-icon name="flash-outline"></ion-icon>
              <span className="card-item-text">{car.type}</span>
            </li>

            <li className="card-list-item">
              <ion-icon name="speedometer-outline"></ion-icon>
              <span className="card-item-text">{car.mileage}</span>
            </li>

            <li className="card-list-item">
              <ion-icon name="hardware-chip-outline"></ion-icon>
              <span className="card-item-text">{car.transmission}</span>
            </li>
          </ul>

          <div className="card-price-wrapper">
            <p className="card-price">
              <strong>₹{car.price}</strong> / month
            </p>

            <button className="btn fav-btn" aria-label="Add to favourite list">
              <ion-icon name="heart-outline"></ion-icon>
            </button>

            <Link to={`/booking/${car.id}`} className="btn">Rent now</Link>
          </div>
        </div>
      </div>
    </li>
  );
}

export default CarCard;
