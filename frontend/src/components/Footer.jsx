import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">

        <div className="footer-top">

          <div className="footer-brand">
            <Link to="/" className="logo">
              <img src="/images/logo.svg" alt="Ridex logo" />
            </Link>

            <p className="footer-text">
              Search for cheap rental cars in New York. With a diverse fleet of 19,000 vehicles, Waydex offers its consumers an attractive and fun selection.
            </p>
          </div>

          <ul className="footer-list">
            <li>
              <p className="footer-list-title">Company</p>
            </li>
            <li>
              <Link to="/about" className="footer-link">About us</Link>
            </li>
            <li>
              <Link to="/pricing" className="footer-link">Pricing plans</Link>
            </li>
            <li>
              <Link to="/blog" className="footer-link">Our blog</Link>
            </li>
            <li>
              <Link to="/contact" className="footer-link">Contacts</Link>
            </li>
          </ul>

          <ul className="footer-list">
            <li>
              <p className="footer-list-title">Support</p>
            </li>
            <li>
              <Link to="/help" className="footer-link">Help center</Link>
            </li>
            <li>
              <Link to="/faq" className="footer-link">Ask a question</Link>
            </li>
            <li>
              <Link to="/privacy" className="footer-link">Privacy policy</Link>
            </li>
            <li>
              <Link to="/terms" className="footer-link">Terms & conditions</Link>
            </li>
          </ul>

          <ul className="footer-list">
            <li>
              <p className="footer-list-title">Neighborhoods in New York</p>
            </li>
            <li><a href="#" className="footer-link">Manhattan</a></li>
            <li><a href="#" className="footer-link">Central New York City</a></li>
            <li><a href="#" className="footer-link">Upper East Side</a></li>
            <li><a href="#" className="footer-link">Queens</a></li>
            <li><a href="#" className="footer-link">Theater District</a></li>
            <li><a href="#" className="footer-link">Midtown</a></li>
            <li><a href="#" className="footer-link">SoHo</a></li>
            <li><a href="#" className="footer-link">Chelsea</a></li>
          </ul>

        </div>

        <div className="footer-bottom">

          <ul className="social-list">
            <li>
              <a href="#" className="social-link">
                <ion-icon name="logo-facebook"></ion-icon>
              </a>
            </li>
            <li>
              <a href="#" className="social-link">
                <ion-icon name="logo-instagram"></ion-icon>
              </a>
            </li>
            <li>
              <a href="#" className="social-link">
                <ion-icon name="logo-twitter"></ion-icon>
              </a>
            </li>
            <li>
              <a href="#" className="social-link">
                <ion-icon name="logo-linkedin"></ion-icon>
              </a>
            </li>
            <li>
              <a href="#" className="social-link">
                <ion-icon name="logo-skype"></ion-icon>
              </a>
            </li>
            <li>
              <a href="#" className="social-link">
                <ion-icon name="mail-outline"></ion-icon>
              </a>
            </li>
          </ul>

          <p className="copyright">
            &copy; 2026 Car Rental Platform. All Rights Reserved
          </p>

        </div>

      </div>
    </footer>
  );
}

export default Footer;
