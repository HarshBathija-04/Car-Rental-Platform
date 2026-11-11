import { Link } from 'react-router-dom';
import SearchFilter from '../components/SearchFilter';
import CarCard from '../components/CarCard';
import carsData from '../data/cars.json';

function Home() {
  const featuredCars = carsData.slice(0, 6); // Just returning 6 for now

  return (
    <article>
      {/* HERO SECTION */}
      <section className="section hero" id="home">
        <div className="container">

          <div className="hero-content">
            <h2 className="h1 hero-title">The easy way to takeover a lease</h2>
            <p className="hero-text">
              Live in New York, New Jersey and Connecticut!
            </p>
          </div>

          <div className="hero-banner"></div>

          <SearchFilter />

        </div>
      </section>

      {/* FEATURED CAR SECTION */}
      <section className="section featured-car" id="featured-car">
        <div className="container">

          <div className="title-wrapper">
            <h2 className="h2 section-title">Featured cars</h2>
            <Link to="/cars" className="featured-car-link">
              <span>View more</span>
              <ion-icon name="arrow-forward-outline"></ion-icon>
            </Link>
          </div>

          <ul className="featured-car-list">
            {featuredCars.map(car => (
              <CarCard key={car.id} car={car} />
            ))}
          </ul>

        </div>
      </section>

      {/* GET STARTED SECTION */}
      <section className="section get-start">
        <div className="container">

          <h2 className="h2 section-title">Get started with 4 simple steps</h2>

          <ul className="get-start-list">
            <li>
              <div className="get-start-card">
                <div className="card-icon icon-1">
                  <ion-icon name="person-add-outline"></ion-icon>
                </div>
                <h3 className="card-title">Create a profile</h3>
                <p className="card-text">
                  If you are going to use a passage of Lorem Ipsum, you need to be sure.
                </p>
                <Link to="/register" className="card-link">Get started</Link>
              </div>
            </li>

            <li>
              <div className="get-start-card">
                <div className="card-icon icon-2">
                  <ion-icon name="car-outline"></ion-icon>
                </div>
                <h3 className="card-title">Tell us what car you want</h3>
                <p className="card-text">
                  Various versions have evolved over the years, sometimes by accident, sometimes on purpose
                </p>
              </div>
            </li>

            <li>
              <div className="get-start-card">
                <div className="card-icon icon-3">
                  <ion-icon name="person-outline"></ion-icon>
                </div>
                <h3 className="card-title">Match with seller</h3>
                <p className="card-text">
                  It to make a type specimen book. It has survived not only five centuries.
                </p>
              </div>
            </li>

            <li>
              <div className="get-start-card">
                <div className="card-icon icon-4">
                  <ion-icon name="card-outline"></ion-icon>
                </div>
                <h3 className="card-title">Make a deal</h3>
                <p className="card-text">
                  There are many variations of passages of Lorem available.
                </p>
              </div>
            </li>
          </ul>

        </div>
      </section>

      {/* BLOG SECTION */}
      <section className="section blog" id="blog">
        <div className="container">
          <h2 className="h2 section-title">Our Blog</h2>

          <ul className="blog-list has-scrollbar">
            <li>
              <div className="blog-card">
                <figure className="card-banner">
                  <a href="#">
                    <img src="/images/blog-1.jpg" alt="Opening of new offices of the company" loading="lazy" className="w-100" />
                  </a>
                  <a href="#" className="btn card-badge">Company</a>
                </figure>
                <div className="card-content">
                  <h3 className="h3 card-title"><a href="#">Opening of new offices of the company</a></h3>
                  <div className="card-meta">
                    <div className="publish-date">
                      <ion-icon name="time-outline"></ion-icon>
                      <time dateTime="2022-01-14">January 14, 2026</time>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            
            <li>
              <div className="blog-card">
                <figure className="card-banner">
                  <a href="#">
                    <img src="/images/blog-2.jpg" alt="What cars are most vulnerable" loading="lazy" className="w-100" />
                  </a>
                  <a href="#" className="btn card-badge">Repair</a>
                </figure>
                <div className="card-content">
                  <h3 className="h3 card-title"><a href="#">What cars are most vulnerable</a></h3>
                  <div className="card-meta">
                    <div className="publish-date">
                      <ion-icon name="time-outline"></ion-icon>
                      <time dateTime="2022-01-14">January 14, 2026</time>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            
            <li>
              <div className="blog-card">
                <figure className="card-banner">
                  <a href="#">
                    <img src="/images/blog-3.jpg" alt="Statistics showed which average age" loading="lazy" className="w-100" />
                  </a>
                  <a href="#" className="btn card-badge">Cars</a>
                </figure>
                <div className="card-content">
                  <h3 className="h3 card-title"><a href="#">Statistics showed which average age</a></h3>
                  <div className="card-meta">
                    <div className="publish-date">
                      <ion-icon name="time-outline"></ion-icon>
                      <time dateTime="2022-01-14">January 14, 2026</time>
                    </div>
                  </div>
                </div>
              </div>
            </li>

          </ul>
        </div>
      </section>

    </article>
  );
}

export default Home;
