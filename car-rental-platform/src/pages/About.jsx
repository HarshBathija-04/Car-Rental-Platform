function About() {
  return (
    <section className="section" style={{ paddingTop: '150px', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <h2 className="h2 section-title" style={{ marginBottom: '30px' }}>About Us</h2>
        
        <div style={{ backgroundColor: '#f8f8f8', padding: '40px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h3 className="h3" style={{ marginBottom: '20px' }}>Welcome to Car Rental Platform</h3>
          <p style={{ marginBottom: '20px', lineHeight: '1.6' }}>
            We are dedicated to providing the best car rental experience in New York, New Jersey, and Connecticut. 
            Our platform allows you to easily browse, search, and book a wide variety of vehicles ranging from 
            economical compacts to luxurious full-size SUVs.
          </p>
          
          <h4 style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '30px', marginBottom: '15px' }}>Our Mission</h4>
          <p style={{ marginBottom: '20px', lineHeight: '1.6' }}>
            To simplify the process of renting cars by offering a transparent, efficient, and user-friendly online marketplace. 
            We strive to match every customer with the perfect vehicle for their needs and budget.
          </p>
          
          <h4 style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '30px', marginBottom: '15px' }}>Contact Us</h4>
          <p style={{ lineHeight: '1.6' }}>
            <strong>Email:</strong> support@carrental.example.com<br />
            <strong>Phone:</strong> 8 800 234 56 78<br />
            <strong>Address:</strong> 123 Main Street, New York, NY 10001
          </p>
        </div>
      </div>
    </section>
  );
}

export default About;
