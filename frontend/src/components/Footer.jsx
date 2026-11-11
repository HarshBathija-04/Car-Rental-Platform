import { Link } from 'react-router-dom';
import { CITIES, REPO_URL } from '../lib/constants.js';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <Link to="/" className="logo">
            <img src="/images/logo.svg" alt="Ridex home" width="70" height="21" />
          </Link>
          <p>
            Self-drive rentals with live availability. Pick your dates first, then choose from the cars that are
            actually free.
          </p>
        </div>

        <nav aria-label="Explore">
          <p className="footer__title">Explore</p>
          <ul className="footer__list">
            <li>
              <Link to="/cars">All cars</Link>
            </li>
            <li>
              <Link to="/#advisor">Trip advisor</Link>
            </li>
            <li>
              <Link to="/trips">My trips</Link>
            </li>
            <li>
              <Link to="/about">About Ridex</Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Cities">
          <p className="footer__title">Pick-up cities</p>
          <ul className="footer__list">
            {CITIES.map((city) => (
              <li key={city}>
                <Link to={`/cars?city=${city}`}>{city}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="footer__title">Project</p>
          <ul className="footer__list">
            <li>
              <a href={REPO_URL} target="_blank" rel="noreferrer">
                Source on GitHub
                <ion-icon name="open-outline" aria-hidden="true"></ion-icon>
              </a>
            </li>
            <li>
              <a href="https://github.com/HarshBathija-04" target="_blank" rel="noreferrer">
                Harsh Bathija
                <ion-icon name="open-outline" aria-hidden="true"></ion-icon>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container footer__bottom">
        <p>&copy; {new Date().getFullYear()} Ridex. A portfolio project: bookings are real, the cars are not.</p>
      </div>
    </footer>
  );
}
