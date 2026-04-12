import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SearchFilter() {
  const [model, setModel] = useState('');
  const [payment, setPayment] = useState('');
  const [year, setYear] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const query = new URLSearchParams({
      model: model || '',
      payment: payment || '',
      year: year || ''
    }).toString();
    navigate(`/cars?${query}`);
  };

  return (
    <form className="hero-form" onSubmit={handleSearch}>
      <div className="input-wrapper">
        <label htmlFor="input-1" className="input-label">Car, model, or brand</label>
        <input 
          type="text" 
          id="input-1" 
          className="input-field"
          placeholder="What car are you looking for?"
          value={model}
          onChange={(e) => setModel(e.target.value)}
        />
      </div>

      <div className="input-wrapper">
        <label htmlFor="input-2" className="input-label">Max. monthly payment</label>
        <input 
          type="number" 
          id="input-2" 
          className="input-field" 
          placeholder="Add an amount in ₹"
          value={payment}
          onChange={(e) => setPayment(e.target.value)}
        />
      </div>

      <div className="input-wrapper">
        <label htmlFor="input-3" className="input-label">Make Year</label>
        <input 
          type="number" 
          id="input-3" 
          className="input-field" 
          placeholder="Add a minimal make year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
      </div>

      <button type="submit" className="btn">Search</button>
    </form>
  );
}

export default SearchFilter;
