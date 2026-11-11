import { Link } from 'react-router-dom';
import carsData from '../data/cars.json';

function Dashboard() {
  const user = { name: "John Doe", email: "john@example.com" };
  const mockBookings = [
    { id: 101, carId: 1, date: "2026-03-01", duration: 2, status: "Confirmed" },
    { id: 102, carId: 3, date: "2026-04-15", duration: 1, status: "Pending" }
  ];

  return (
    <section className="section" style={{ paddingTop: '150px', minHeight: '80vh' }}>
      <div className="container">
        <h2 className="h2 section-title">User Dashboard</h2>
        
        <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
          
          <div style={{ flex: '1', minWidth: '300px', backgroundColor: '#f8f8f8', padding: '20px', borderRadius: '10px' }}>
            <h3 className="h3">Profile Output</h3>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <Link to="/edit-profile" className="btn" style={{ marginTop: '20px', display: 'inline-block' }}>Edit Profile</Link>
          </div>
          
          <div style={{ flex: '2', minWidth: '400px' }}>
            <h3 className="h3">My Bookings</h3>
            
            {mockBookings.length > 0 ? (
              <ul style={{ listStyleType: 'none', padding: '0' }}>
                {mockBookings.map(booking => {
                  const car = carsData.find(c => c.id === booking.carId);
                  return (
                    <li key={booking.id} style={{ border: '1px solid #ddd', margin: '10px 0', padding: '15px', borderRadius: '5px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <h4 style={{ fontSize: '18px', fontWeight: 'bold' }}>{car ? `${car.make} ${car.model}` : "Unknown Car"}</h4>
                          <p>Booking ID: #{booking.id}</p>
                          <p>Start Date: {booking.date}</p>
                          <p>Duration: {booking.duration} Month(s)</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ 
                            padding: '5px 10px', 
                            borderRadius: '5px', 
                            color: 'white', 
                            backgroundColor: booking.status === "Confirmed" ? 'green' : 'orange' 
                          }}>
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p>No active bookings found.</p>
            )}
            
          </div>

        </div>
      </div>
    </section>
  );
}

export default Dashboard;
