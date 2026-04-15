import { useEffect } from 'react';

export default function AIAutomation() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ paddingTop: '120px', minHeight: '100vh', padding: '120px 48px', backgroundColor: '#f9f9f7' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '3rem', color: '#1e3a5f', fontWeight: 'bold' }}>AI & Automation</h1>
        <p style={{ marginTop: '20px', fontSize: '1.2rem', color: '#4a4a4a', lineHeight: '1.6', maxWidth: '800px' }}>
          Explore our AI & Automation strategies. We leverage cutting-edge artificial intelligence systems to optimize your business processes, reduce manual overhead, and accelerate high-value decision making.
        </p>
      </div>
    </div>
  );
}
