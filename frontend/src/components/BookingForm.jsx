import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function BookingForm({ car }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    duration: '',
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.date || !formData.duration) {
      setMessage('Please fill in all fields.');
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      alert(`Booking confirmed for ${car.make} ${car.model}!`);
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="booking-form-wrapper" style={{ padding: '20px', background: '#f8f8f8', borderRadius: '10px' }}>
      <h3 className="h3">Book {car.make} {car.model}</h3>
      <p style={{ marginBottom: '20px' }}>Rate: ₹{car.price} / month</p>

      {message && <p style={{ color: 'red', marginBottom: '10px' }}>{message}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="text" 
          name="name" 
          placeholder="Full Name" 
          value={formData.name}
          onChange={handleChange}
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <input 
          type="email" 
          name="email" 
          placeholder="Email Address" 
          value={formData.email}
          onChange={handleChange}
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <input 
          type="tel" 
          name="phone" 
          placeholder="Phone Number" 
          value={formData.phone}
          onChange={handleChange}
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <label>Start Date</label>
        <input 
          type="date" 
          name="date" 
          value={formData.date}
          onChange={handleChange}
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <input 
          type="number" 
          name="duration" 
          placeholder="Duration (Months)" 
          value={formData.duration}
          onChange={handleChange}
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <button type="submit" className="btn" style={{ marginTop: '10px' }}>Confirm Booking</button>
      </form>
    </div>
  );
}

export default BookingForm;
