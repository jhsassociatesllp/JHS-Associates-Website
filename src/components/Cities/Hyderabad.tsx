import { useEffect } from 'react';

export default function Hyderabad() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ paddingTop: '120px', minHeight: '100vh', padding: '120px 48px', backgroundColor: '#f9f9f7' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '3rem', color: '#1e3a5f', fontWeight: 'bold' }}>Hyderabad Office</h1>
        <h2 style={{ fontSize: '1.5rem', color: '#d72020', margin: '10px 0 20px 0' }}>HITEC City</h2>
        <p style={{ fontSize: '1.2rem', color: '#4a4a4a', lineHeight: '1.6', maxWidth: '800px' }}>
          Welcome to our Hyderabad branch. Located in HITEC City, we partner with innovative tech firms and local enterprises to ensure robust corporate governance and tax compliance.
        </p>
      </div>
    </div>
  );
}
