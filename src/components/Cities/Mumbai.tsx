import { useEffect } from 'react';

export default function Mumbai() {
  useEffect(() => {
    // Let Lenis handle routing scroll if implemented natively
  }, []);

  return (
    <main className="ct-page" style={{ paddingTop: '150px', paddingBottom: '100px', minHeight: '100vh', backgroundColor: '#f9f9f7', display: 'flex', flexDirection: 'column' }}>
      <div className="container" style={{ flex: 1, padding: '40px 20px' }}>
        <span style={{ color: '#d72020', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '12px' }}>Our Presence</span>
        <h1 style={{ fontSize: '3.5rem', color: '#1e3a5f', fontWeight: 'bold', marginTop: '15px' }}>Mumbai Office</h1>
        <h2 style={{ fontSize: '1.5rem', color: '#4a4a4a', margin: '20px 0 30px 0', fontWeight: '400' }}>Headquarters, Andheri</h2>
        <div style={{ height: '2px', width: '60px', backgroundColor: '#d72020', marginBottom: '30px' }} />
        <p style={{ fontSize: '1.15rem', color: '#6b6b6b', lineHeight: '1.8', maxWidth: '800px' }}>
          Welcome to our Mumbai headquarters. As our central hub, this office coordinates our nationwide operations and provides comprehensive financial and advisory services to our top-tier clients. Let us navigate the complexities of corporate governance and tax compliance alongside you.
        </p>
      </div>
    </main>
  );
}
