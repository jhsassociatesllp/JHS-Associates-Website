import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './AdminContacts.css';
import './AdminEmailCheck.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

interface Health {
  graph: { configured: boolean; tenant_id: string; client_id: string; client_secret: string; sender: string };
  smtp: { configured: boolean; login: string; password: string; server: string };
  inboxes: { hr: string; contact_and_proposals: string; appointments: string };
  will_use: string;
}

interface TestResult {
  to: string;
  ok: boolean;
  method: string;
  graph_error: string;
  smtp_error: string;
}

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="ec-row">
    <span>{label}</span>
    <b className={value === 'NOT SET' ? 'ec-bad' : ''}>{value}</b>
  </div>
);

const AdminEmailCheck: React.FC = () => {
  const { token } = useAuth();
  const [health, setHealth] = useState<Health | null>(null);
  const [loadError, setLoadError] = useState('');
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);
  const [error, setError] = useState('');

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/admin/email-health`, { headers: { Authorization: `Bearer ${token}` } });
        if (!response.ok) throw new Error(response.status === 403 ? 'Only a Super Admin can open this page.' : 'Could not load the email set-up.');
        setHealth(await response.json());
      } catch (err) {
        setLoadError(err instanceof Error ? err.message : 'Could not load the email set-up.');
      }
    })();
  }, [token]);

  const sendTest = async () => {
    setTesting(true);
    setResult(null);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/admin/email-health/test`, { method: 'POST', headers });
      if (!response.ok) {
        const err = await response.json().catch(() => null);
        throw new Error(typeof err?.detail === 'string' ? err.detail : 'The test could not be started.');
      }
      setResult(await response.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'The test could not be started.');
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="contacts-container">
      <div className="contacts-header">
        <div>
          <p className="contacts-eyebrow">System</p>
          <h1 className="contacts-title">Email check</h1>
          <p className="contacts-subtitle">See how the website sends email, and test it. Secrets are never shown here.</p>
        </div>
      </div>

      {loadError && <div className="ec-box ec-box--bad" role="alert">{loadError}</div>}

      {health && (
        <div className="ec-grid">
          <div className="ec-card">
            <h3>Microsoft Graph <span className={`ec-tag ${health.graph.configured ? 'ec-tag--ok' : 'ec-tag--bad'}`}>{health.graph.configured ? 'Ready' : 'Not set up'}</span></h3>
            <Row label="Tenant ID" value={health.graph.tenant_id} />
            <Row label="Client ID" value={health.graph.client_id} />
            <Row label="Client secret" value={health.graph.client_secret} />
            <Row label="Sends as" value={health.graph.sender} />
          </div>
          <div className="ec-card">
            <h3>SMTP (backup) <span className={`ec-tag ${health.smtp.configured ? 'ec-tag--ok' : 'ec-tag--warn'}`}>{health.smtp.configured ? 'Ready' : 'Not set up'}</span></h3>
            <Row label="Login" value={health.smtp.login} />
            <Row label="Password" value={health.smtp.password} />
            <Row label="Server" value={health.smtp.server} />
          </div>
          <div className="ec-card">
            <h3>Where alerts go</h3>
            <Row label="Careers / Alumni (HR)" value={health.inboxes.hr} />
            <Row label="Contact / Proposals" value={health.inboxes.contact_and_proposals} />
            <Row label="Appointments" value={health.inboxes.appointments} />
            <p className="ec-note">Website will use: <b>{health.will_use}</b></p>
          </div>
        </div>
      )}

      <div className="ec-test">
        <button className="contacts-btn contacts-btn-primary" onClick={sendTest} disabled={testing || !health}>
          {testing ? 'Sending…' : 'Send a test email to me'}
        </button>
        <span className="ec-hint">The test goes to your own admin email address.</span>
      </div>

      {error && <div className="ec-box ec-box--bad" role="alert">{error}</div>}

      {result && result.ok && (
        <div className="ec-box ec-box--ok" role="status">
          <strong>Sent through {result.method}.</strong> Check the inbox of <b>{result.to}</b> (and the Junk folder).
          {result.graph_error && (
            <p className="ec-detail">Microsoft Graph failed, so the backup (SMTP) was used. Fix Graph: {result.graph_error}</p>
          )}
        </div>
      )}

      {result && !result.ok && (
        <div className="ec-box ec-box--bad" role="alert">
          <strong>The test email could not be sent.</strong>
          {result.graph_error && <p className="ec-detail"><b>Microsoft Graph:</b> {result.graph_error}</p>}
          {result.smtp_error && <p className="ec-detail"><b>SMTP:</b> {result.smtp_error}</p>}
          {!result.graph_error && !result.smtp_error && <p className="ec-detail">Neither Graph nor SMTP is set up. Add the GRAPH_* secrets in GitHub and deploy again.</p>}
        </div>
      )}
    </div>
  );
};

export default AdminEmailCheck;
