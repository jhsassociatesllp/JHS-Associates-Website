import { useEffect } from 'react';

export default function Alumni() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ paddingTop: '120px', minHeight: '100vh', padding: '120px 48px', backgroundColor: '#f9f9f7' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '3rem', color: '#1e3a5f', fontWeight: 'bold' }}>Alumni Network</h1>
        <p style={{ marginTop: '20px', fontSize: '1.2rem', color: '#4a4a4a', lineHeight: '1.6', maxWidth: '800px' }}>
          Welcome to the JHS Alumni portal. Reconnect with past colleagues, discover new networking opportunities, and stay tuned to our latest firm successes around the globe.
        </p>
      </div>
    </div>
  );
}
