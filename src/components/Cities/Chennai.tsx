import { useEffect } from 'react';

export default function Chennai() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ paddingTop: '120px', minHeight: '100vh', padding: '120px 48px', backgroundColor: '#f9f9f7' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '3rem', color: '#1e3a5f', fontWeight: 'bold' }}>Chennai Office</h1>
        <h2 style={{ fontSize: '1.5rem', color: '#d72020', margin: '10px 0 20px 0' }}>T Nagar</h2>
        <p style={{ fontSize: '1.2rem', color: '#4a4a4a', lineHeight: '1.6', maxWidth: '800px' }}>
          Welcome to our Chennai branch. From T Nagar, our expert teams manage risk advisory, compliance structures, and deep-dive audits for vital industries across the South.
        </p>
      </div>
    </div>
  );
}
