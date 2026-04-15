import { useEffect } from 'react';

export default function Bengaluru() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ paddingTop: '120px', minHeight: '100vh', padding: '120px 48px', backgroundColor: '#f9f9f7' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '3rem', color: '#1e3a5f', fontWeight: 'bold' }}>Bengaluru Office</h1>
        <h2 style={{ fontSize: '1.5rem', color: '#d72020', margin: '10px 0 20px 0' }}>UB City, Vittal Mallya Road</h2>
        <p style={{ fontSize: '1.2rem', color: '#4a4a4a', lineHeight: '1.6', maxWidth: '800px' }}>
          Welcome to our Bengaluru branch. Working closely with the IT and technology sector, we offer tailored compliance and financial optimization solutions.
        </p>
      </div>
    </div>
  );
}
