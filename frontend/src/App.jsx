import { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import AppProviders from './components/AppProviders.jsx';
import Footer from './components/Footer.jsx';
import Navbar from './components/Navbar.jsx';
import RequireAuth from './components/RequireAuth.jsx';
import WakeBanner from './components/WakeBanner.jsx';
import About from './pages/About.jsx';
import CarDetails from './pages/CarDetails.jsx';
import Cars from './pages/Cars.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import NotFound from './pages/NotFound.jsx';
import Register from './pages/Register.jsx';
import Trips from './pages/Trips.jsx';

/** SPA navigation does not scroll on its own: go to the #hash target or the top on route change. */
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const target = hash && document.getElementById(hash.slice(1));
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (target) target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
      else window.scrollTo(0, 0);
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProviders>
        <ScrollManager />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Navbar />
        <WakeBanner />
        <main id="main" tabIndex={-1}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cars" element={<Cars />} />
            <Route path="/cars/:id" element={<CarDetails />} />
            <Route
              path="/trips"
              element={
                <RequireAuth>
                  <Trips />
                </RequireAuth>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </AppProviders>
    </BrowserRouter>
  );
}
