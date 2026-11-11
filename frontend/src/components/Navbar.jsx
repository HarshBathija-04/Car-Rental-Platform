import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth, useToast } from '../lib/context.js';

const links = [
  { to: '/cars', label: 'Fleet' },
  { to: '/#advisor', label: 'Trip advisor', hash: true },
  { to: '/about', label: 'About' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, signOut } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const close = () => setOpen(false);
  const handleSignOut = () => {
    signOut();
    close();
    toast('You are signed out', 'info');
    navigate('/');
  };

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="container header__inner">
        <Link to="/" className="logo" onClick={close}>
          <img src="/images/logo.svg" alt="Ridex home" width="70" height="21" />
        </Link>

        <button
          type="button"
          className="icon-btn nav-toggle"
          aria-expanded={open}
          aria-controls="primary-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((o) => !o)}
        >
          <ion-icon name={open ? 'close-outline' : 'menu-outline'} aria-hidden="true"></ion-icon>
        </button>

        <nav id="primary-nav" className={`nav ${open ? 'nav--open' : ''}`} aria-label="Primary">
          <ul className="nav__list">
            {links.map((l) => (
              <li key={l.to}>
                {/* NavLink ignores the hash, so a hash link would look active on every visit to / */}
                {l.hash ? (
                  <Link to={l.to} className="nav__link" onClick={close}>
                    {l.label}
                  </Link>
                ) : (
                  <NavLink to={l.to} className="nav__link" onClick={close} end>
                    {l.label}
                  </NavLink>
                )}
              </li>
            ))}
            {user && (
              <li>
                <NavLink to="/trips" className="nav__link" onClick={close}>
                  My trips
                </NavLink>
              </li>
            )}
          </ul>
          <div className="nav__actions">
            {user ? (
              <>
                <span className="nav__user" title={user.email}>
                  <span className="avatar" aria-hidden="true">
                    {user.name.slice(0, 1).toUpperCase()}
                  </span>
                  <span className="nav__user-name">{user.name.split(' ')[0]}</span>
                </span>
                <button type="button" className="btn btn--ghost" onClick={handleSignOut}>
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn--ghost" onClick={close}>
                  Sign in
                </Link>
                <Link to="/cars" className="btn btn--primary" onClick={close}>
                  <ion-icon name="car-sport-outline" aria-hidden="true"></ion-icon>
                  Find a car
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
      {open && <div className="nav-overlay" onClick={close} aria-hidden="true"></div>}
    </header>
  );
}
