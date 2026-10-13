import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './AdminNotifications.css';

interface Job {
  id: string;
  kind: string;
  title: string;
  status: 'scheduled' | 'sending' | 'sent' | 'cancelled';
  send_at: string;
  created_at: string;
  finished_at: string | null;
  sent: number;
  failed: number;
  total: number | null;
}

interface Overview {
  settings: { enabled: boolean; delay_minutes: number };
  stats: { subscribers: number; unsubscribed: number; verified_accounts: number };
  jobs: Job[];
}

const KIND_LABEL: Record<string, string> = {
  white_paper: 'White Paper', article: 'Article', newsletter: 'Newsletter', regulatory: 'Regulatory',
  reg_watch: 'Reg-Watch', knowledge: 'Knowledge Resource', excellencia: 'Excellencia', podcast: 'Podcast',
};
const DELAYS = [0, 5, 10, 30, 60, 180, 1440];
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;
const fmt = (iso: string | null) =>
  iso ? new Date(iso.endsWith('Z') || iso.includes('+') ? iso : `${iso}Z`).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }) : '—';
const delayLabel = (m: number) => (m === 0 ? 'Send immediately' : m < 60 ? `${m} minutes` : m === 60 ? '1 hour' : m < 1440 ? `${m / 60} hours` : '24 hours');

const AdminNotifications: React.FC = () => {
  const { token } = useAuth();
  const auth = { Authorization: `Bearer ${token}` };
  const json = { ...auth, 'Content-Type': 'application/json' };

  const [data, setData] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [enabled, setEnabled] = useState(true);
  const [delay, setDelay] = useState(10);
  const [dirty, setDirty] = useState(false);
  const [testKind, setTestKind] = useState('white_paper');
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/notifications/admin/overview`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error();
      const d: Overview = await res.json();
      setData(d);
      setDirty((wasDirty) => {
        if (!wasDirty) { setEnabled(d.settings.enabled); setDelay(d.settings.delay_minutes); }
        return wasDirty;
      });
    } catch {
      setMsg({ type: 'error', text: 'Unable to load notifications.' });
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    const t = window.setInterval(load, 15000); // progress of a running send updates by itself
    return () => window.clearInterval(t);
  }, [load]);

  const call = async (path: string, init: RequestInit, ok: string) => {
    setBusy(true);
    try {
      const res = await fetch(`${API_BASE_URL}/notifications/admin/${path}`, init);
      const body = await res.json().catch(() => null);
      if (!res.ok) throw new Error(typeof body?.detail === 'string' ? body.detail : 'Something went wrong.');
      setMsg({ type: 'success', text: body?.message || ok });
      await load();
      return true;
    } catch (err) {
      setMsg({ type: 'error', text: err instanceof Error ? err.message : 'Something went wrong.' });
      return false;
    } finally {
      setBusy(false);
    }
  };

  const saveSettings = async () => {
    const done = await call('settings', { method: 'PUT', headers: json, body: JSON.stringify({ enabled, delay_minutes: delay }) }, 'Settings saved.');
    if (done) setDirty(false);
  };

  const cancel = (j: Job) => {
    if (window.confirm(`Stop the email about “${j.title}”? Subscribers who have not received it yet will not get it.`)) {
      call(`jobs/${j.id}/cancel`, { method: 'POST', headers: auth }, 'Cancelled.');
    }
  };

  const sendNow = (j: Job) => {
    if (window.confirm(`Send the email about “${j.title}” to all subscribers now?`)) {
      call(`jobs/${j.id}/send-now`, { method: 'POST', headers: auth }, 'Queued to send now.');
    }
  };

  return (
    <div className="nta">
      <div className="nta__header">
        <div>
          <p className="nta__eyebrow">Website Content</p>
          <h1 className="nta__title">Email Notifications</h1>
          <p className="nta__subtitle">
            When you publish a White Paper, Article, Newsletter, Regulatory update, Reg-Watch update, Knowledge resource, Excellencia entry or Podcast,
            every website user who signed in with Google gets an email about it. You have a short window to cancel before it goes out.
          </p>
        </div>
      </div>

      {msg && <div className={`nta__alert nta__alert--${msg.type}`} onClick={() => setMsg(null)}>{msg.text}</div>}

      {data && (
        <div className="nta__stats">
          <div className="nta__stat nta__stat--green"><span>Subscribers</span><strong>{data.stats.subscribers}</strong></div>
          <div className="nta__stat nta__stat--amber"><span>Unsubscribed</span><strong>{data.stats.unsubscribed}</strong></div>
          <div className="nta__stat nta__stat--blue"><span>Verified accounts</span><strong>{data.stats.verified_accounts}</strong></div>
          <div className="nta__stat"><span>Emails sent</span><strong>{data.jobs.reduce((n, j) => n + j.sent, 0)}</strong></div>
        </div>
      )}

      <div className="nta__panel">
        <div className="nta__panel-row">
          <label className="nta__switch">
            <input type="checkbox" checked={enabled} onChange={(e) => { setEnabled(e.target.checked); setDirty(true); }} />
            <span>Send an email automatically when new content is published</span>
          </label>
          <div className="nta__field">
            <label htmlFor="nta-delay">Wait before sending</label>
            <select id="nta-delay" value={delay} onChange={(e) => { setDelay(Number(e.target.value)); setDirty(true); }}>
              {(DELAYS.includes(delay) ? DELAYS : [...DELAYS, delay].sort((a, b) => a - b)).map((m) => <option key={m} value={m}>{delayLabel(m)}</option>)}
            </select>
          </div>
          <button className="nta__btn nta__btn--primary" disabled={!dirty || busy} onClick={saveSettings}>Save</button>
        </div>
        <div className="nta__panel-row nta__panel-row--test">
          <span>See how the email looks — a sample goes <strong>only to you</strong>:</span>
          <select value={testKind} onChange={(e) => setTestKind(e.target.value)}>
            {Object.entries(KIND_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <button className="nta__btn" disabled={busy} onClick={() => call('test', { method: 'POST', headers: json, body: JSON.stringify({ kind: testKind }) }, 'Test email sent.')}>Send me a test</button>
        </div>
      </div>

      <div className="nta__card">
        {loading ? (
          <div className="nta__empty">Loading…</div>
        ) : !data || data.jobs.length === 0 ? (
          <div className="nta__empty">Nothing has been sent yet. The next piece of content you publish will appear here.</div>
        ) : (
          <div className="nta__table-wrap">
            <table className="nta__table">
              <thead><tr><th>Content</th><th>When</th><th>Status</th><th>Delivered</th><th>Actions</th></tr></thead>
              <tbody>
                {data.jobs.map((j) => (
                  <tr key={j.id}>
                    <td>
                      <div className="nta__name">{j.title}</div>
                      <span className="nta__type">{KIND_LABEL[j.kind] ?? j.kind}</span>
                    </td>
                    <td>{j.status === 'scheduled' ? `Goes out ${fmt(j.send_at)}` : j.status === 'sent' ? `Finished ${fmt(j.finished_at)}` : fmt(j.send_at)}</td>
                    <td><span className={`nta__chip nta__chip--${j.status}`}>{{ scheduled: 'Scheduled', sending: 'Sending', sent: 'Sent', cancelled: 'Cancelled' }[j.status]}</span></td>
                    <td>
                      <strong>{j.sent}</strong>{j.total !== null ? ` / ${j.total}` : ''}
                      {j.failed > 0 && <span className="nta__fail"> · {j.failed} failed</span>}
                    </td>
                    <td className="nta__actions">
                      {j.status === 'scheduled' && <button disabled={busy} onClick={() => sendNow(j)}>Send now</button>}
                      {(j.status === 'scheduled' || j.status === 'sending') && <button className="danger" disabled={busy} onClick={() => cancel(j)}>Cancel</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNotifications;
