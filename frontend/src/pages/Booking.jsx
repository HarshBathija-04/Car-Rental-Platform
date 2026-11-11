import { useParams } from 'react-router-dom';
import BookingForm from '../components/BookingForm';
import carsData from '../data/cars.json';

function Booking() {
  const { id } = useParams();
  const car = carsData.find(c => c.id === parseInt(id));

  if (!car) {
    return <div className="container" style={{ paddingTop: '150px', minHeight: '80vh' }}>Car not found!</div>;
  }

  return (
    <section className="section" style={{ paddingTop: '150px', minHeight: '80vh' }}>
      <div className="container">
        <h2 className="h2 section-title">Finalize Booking</h2>
        
        <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '300px' }}>
            <img src={car.image} alt={car.model} style={{ width: '100%', borderRadius: '10px' }} />
            <div style={{ marginTop: '20px' }}>
              <h3 className="h3">{car.make} {car.model}</h3>
              <p>Year: {car.year}</p>
              <p>Type: {car.type}</p>
              <p>Price: ₹{car.price} / month</p>
            </div>
          </div>
          
          <div style={{ flex: '1', minWidth: '300px' }}>
            <BookingForm car={car} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Booking;
