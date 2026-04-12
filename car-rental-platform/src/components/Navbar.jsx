import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const [isNavActive, setIsNavActive] = useState(false);
  const [isHeaderActive, setIsHeaderActive] = useState(false);
  const location = useLocation();

  const toggleNav = () => {
    setIsNavActive(!isNavActive);
  };

  const closeNav = () => {
    setIsNavActive(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 20) {
        setIsHeaderActive(true);
      } else {
        setIsHeaderActive(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header ${isHeaderActive ? 'active' : ''}`}>
      <div className="container">
        
        <div className={`overlay ${isNavActive ? 'active' : ''}`} onClick={closeNav}></div>

        <Link to="/" className="logo">
          <img src="/images/logo.svg" alt="Ridex logo" />
        </Link>

        <nav className={`navbar ${isNavActive ? 'active' : ''}`}>
          <ul className="navbar-list">
            <li>
              <Link to="/" className="navbar-link" onClick={closeNav}>Home</Link>
            </li>
            <li>
              <Link to="/cars" className="navbar-link" onClick={closeNav}>Explore cars</Link>
            </li>
            <li>
              <Link to="/about" className="navbar-link" onClick={closeNav}>About us</Link>
            </li>
            <li>
              <Link to="/dashboard" className="navbar-link" onClick={closeNav}>Dashboard</Link>
            </li>
          </ul>
        </nav>

        <div className="header-actions">
          <div className="header-contact">
            <a href="tel:+9193245XXXXX" className="contact-link">+91 93245XXXXX</a>
            <span className="contact-time">Mon - Sat: 9:00 am - 6:00 pm</span>
          </div>

          <Link to="/cars" className="btn" aria-labelledby="aria-label-txt">
            <ion-icon name="car-outline"></ion-icon>
            <span id="aria-label-txt">Explore cars</span>
          </Link>

          <Link to="/login" className="btn user-btn" aria-label="Profile">
            <ion-icon name="person-outline"></ion-icon>
          </Link>

          <button className={`nav-toggle-btn ${isNavActive ? 'active' : ''}`} onClick={toggleNav} aria-label="Toggle Menu">
            <span className="one"></span>
            <span className="two"></span>
            <span className="three"></span>
          </button>
        </div>

      </div>
    </header>
  );
}

export default Navbar;
