import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import CarCard from '../components/CarCard';
import carsData from '../data/cars.json';

function Cars() {
  const [cars, setCars] = useState(carsData);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const model = params.get('model')?.toLowerCase();
    const payment = params.get('payment');
    const year = params.get('year');

    let filteredCars = carsData;

    if (model) {
      filteredCars = filteredCars.filter(car => 
        car.make.toLowerCase().includes(model) || 
        car.model.toLowerCase().includes(model)
      );
    }
    if (payment) {
      filteredCars = filteredCars.filter(car => car.price <= parseInt(payment));
    }
    if (year) {
      filteredCars = filteredCars.filter(car => car.year >= parseInt(year));
    }

    setCars(filteredCars);
  }, [location.search]);

  return (
    <section className="section featured-car" style={{ paddingTop: '150px', minHeight: '80vh' }}>
      <div className="container">
        <div className="title-wrapper">
          <h2 className="h2 section-title">All Cars</h2>
        </div>

        {cars.length > 0 ? (
          <ul className="featured-car-list">
            {cars.map(car => (
              <CarCard key={car.id} car={car} />
            ))}
          </ul>
        ) : (
          <p>No cars found matching your criteria. Try adjusting your search filters.</p>
        )}
      </div>
    </section>
  );
}

export default Cars;
