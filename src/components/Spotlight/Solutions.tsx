import { useEffect } from 'react';

export default function Solutions() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ paddingTop: '120px', minHeight: '100vh', padding: '120px 48px', backgroundColor: '#f9f9f7' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '3rem', color: '#1e3a5f', fontWeight: 'bold' }}>Our Solutions</h1>
        <p style={{ marginTop: '20px', fontSize: '1.2rem', color: '#4a4a4a', lineHeight: '1.6', maxWidth: '800px' }}>
          At JHS, we deliver robust, tailored solutions designed specifically to meet the complicated challenges inside today's competitive and highly-regulated capital environments.
        </p>
      </div>
    </div>
  );
}
