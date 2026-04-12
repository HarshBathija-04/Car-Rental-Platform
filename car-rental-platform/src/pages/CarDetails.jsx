import { useParams, Link } from 'react-router-dom';
import carsData from '../data/cars.json';

function CarDetails() {
  const { id } = useParams();
  const car = carsData.find(c => c.id === parseInt(id));

  if (!car) {
    return <div className="container" style={{ paddingTop: '150px', minHeight: '80vh' }}>Car not found!</div>;
  }

  return (
    <section className="section" style={{ paddingTop: '150px', minHeight: '80vh' }}>
      <div className="container">
        <h2 className="h2 section-title">{car.make} {car.model}</h2>
        
        <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '300px' }}>
            <img src={car.image} alt={car.model} style={{ width: '100%', borderRadius: '10px' }} />
          </div>
          
          <div style={{ flex: '1', minWidth: '300px', backgroundColor: '#f8f8f8', padding: '20px', borderRadius: '10px' }}>
            <h3 className="h3">Specifications</h3>
            <ul style={{ margin: '20px 0', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <li><strong>Year:</strong> {car.year}</li>
              <li><strong>Capacity:</strong> {car.capacity} People</li>
              <li><strong>Type:</strong> {car.type}</li>
              <li><strong>Mileage:</strong> {car.mileage}</li>
              <li><strong>Transmission:</strong> {car.transmission}</li>
              <li><strong>Description:</strong> {car.description}</li>
            </ul>
            
            <div style={{ marginTop: '30px' }}>
              <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
                ₹{car.price} <span style={{ fontSize: '16px', fontWeight: 'normal' }}>/ month</span>
              </p>
              <Link to={`/booking/${car.id}`} className="btn" style={{ marginTop: '20px', display: 'inline-block' }}>Book This Car</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CarDetails;
