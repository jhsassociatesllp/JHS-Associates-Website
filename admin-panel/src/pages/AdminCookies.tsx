import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './AdminCookies.css';

type Status = 'accepted' | 'rejected' | 'custom';

interface Summary {
  total: number;
  accepted: number;
  rejected: number;
  custom: number;
  preferences_on: number;
  events: number;
  acceptance_rate: number;
  retention_days: number;
  policy_version: string;
  daily: { date: string; accepted: number; rejected: number; custom: number }[];
}

interface Row {
  id: string;
  status: Status;
  preferences: boolean;
  browser: string;
  device: string;
  page: string | null;
  policy_version: string | null;
  changes: number;
  first_seen: string | null;
  updated_at: string | null;
  expires_at: string | null;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;
const PAGE_SIZE = 25;

const LABELS: Record<Status, string> = { accepted: 'Accepted all', rejected: 'Rejected', custom: 'Customised' };

const fmt = (iso: string | null) =>
  iso ? new Date(iso.endsWith('Z') || iso.includes('+') ? iso : `${iso}Z`).toLocaleString() : '—';

const AdminCookies: React.FC = () => {
  const { token } = useAuth();
  const authHeaders = { Authorization: `Bearer ${token}` };

  const [summary, setSummary] = useState<Summary | null>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState<'all' | Status>('all');
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const qs = new URLSearchParams({ skip: String(page * PAGE_SIZE), limit: String(PAGE_SIZE) });
      if (filter !== 'all') qs.set('status', filter);
      const [s, r] = await Promise.all([
        fetch(`${API_BASE_URL}/cookie-consent/admin/summary?days=30`, { headers: authHeaders }),
        fetch(`${API_BASE_URL}/cookie-consent/admin/records?${qs}`, { headers: authHeaders }),
      ]);
      if (!s.ok || !r.ok) throw new Error('request failed');
      setSummary(await s.json());
      const list = await r.json();
      setRows(list.items);
      setTotal(list.total);
    } catch {
      setError('Unable to load cookie consent data.');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, page, token]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const exportCsv = async () => {
    const res = await fetch(`${API_BASE_URL}/cookie-consent/admin/export`, { headers: authHeaders });
    if (!res.ok) return setError('Unable to export.');
    const url = URL.createObjectURL(await res.blob());
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cookie-consents.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const pct = (n: number) => (summary && summary.total ? Math.round((n / summary.total) * 100) : 0);
  const maxDay = summary ? Math.max(1, ...summary.daily.map((d) => d.accepted + d.rejected + d.custom)) : 1;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="ck-admin">
      <div className="ck-admin__header">
        <div>
          <p className="ck-admin__eyebrow">Compliance</p>
          <h1 className="ck-admin__title">Cookie Consent</h1>
          <p className="ck-admin__subtitle">
            How many visitors accepted, rejected or customised cookies on the website. Each visitor is counted once, by their latest choice.
          </p>
        </div>
        <div className="ck-admin__header-actions">
          <button className="ck-admin__btn" onClick={load}>Refresh</button>
          <button className="ck-admin__btn ck-admin__btn--primary" onClick={exportCsv}>Export CSV</button>
        </div>
      </div>

      {error && <div className="ck-admin__alert">{error}</div>}

      {summary && (
        <>
          <div className="ck-admin__stats">
            <div className="ck-admin__stat">
              <span className="ck-admin__stat-label">Total visitors</span>
              <span className="ck-admin__stat-value">{summary.total}</span>
              <span className="ck-admin__stat-sub">{summary.events} choices recorded</span>
            </div>
            <div className="ck-admin__stat ck-admin__stat--green">
              <span className="ck-admin__stat-label">Accepted all</span>
              <span className="ck-admin__stat-value">{summary.accepted}</span>
              <span className="ck-admin__stat-sub">{pct(summary.accepted)}% of visitors</span>
            </div>
            <div className="ck-admin__stat ck-admin__stat--red">
              <span className="ck-admin__stat-label">Rejected</span>
              <span className="ck-admin__stat-value">{summary.rejected}</span>
              <span className="ck-admin__stat-sub">{pct(summary.rejected)}% of visitors</span>
            </div>
            <div className="ck-admin__stat ck-admin__stat--amber">
              <span className="ck-admin__stat-label">Customised</span>
              <span className="ck-admin__stat-value">{summary.custom}</span>
              <span className="ck-admin__stat-sub">{pct(summary.custom)}% of visitors</span>
            </div>
            <div className="ck-admin__stat ck-admin__stat--blue">
              <span className="ck-admin__stat-label">Acceptance rate</span>
              <span className="ck-admin__stat-value">{summary.acceptance_rate}%</span>
              <span className="ck-admin__stat-sub">{summary.preferences_on} allow preference cookies</span>
            </div>
          </div>

          <div className="ck-admin__card">
            <div className="ck-admin__card-head">
              <h2>Choices per day — last 30 days</h2>
              <div className="ck-admin__legend">
                <span><i className="dot dot--accepted" />Accepted</span>
                <span><i className="dot dot--custom" />Customised</span>
                <span><i className="dot dot--rejected" />Rejected</span>
              </div>
            </div>
            <div className="ck-admin__chart" role="img" aria-label="Cookie choices per day">
              {summary.daily.map((d) => {
                const t = d.accepted + d.custom + d.rejected;
                return (
                  <div
                    key={d.date}
                    className="ck-admin__bar"
                    title={`${d.date}: ${d.accepted} accepted, ${d.custom} customised, ${d.rejected} rejected`}
                  >
                    <div className="ck-admin__bar-stack" style={{ height: `${(t / maxDay) * 100}%` }}>
                      <span className="seg seg--rejected" style={{ flexGrow: d.rejected }} />
                      <span className="seg seg--custom" style={{ flexGrow: d.custom }} />
                      <span className="seg seg--accepted" style={{ flexGrow: d.accepted }} />
                    </div>
                    <span className="ck-admin__bar-day">{d.date.slice(8)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      <div className="ck-admin__card">
        <div className="ck-admin__card-head">
          <h2>Visitor choices</h2>
          <div className="ck-admin__tabs">
            {(['all', 'accepted', 'custom', 'rejected'] as const).map((f) => (
              <button
                key={f}
                className={filter === f ? 'active' : ''}
                onClick={() => { setFilter(f); setPage(0); }}
              >
                {f === 'all' ? 'All' : LABELS[f]}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="ck-admin__empty">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="ck-admin__empty">No cookie choices recorded yet.</div>
        ) : (
          <div className="ck-admin__table-wrap">
            <table className="ck-admin__table">
              <thead>
                <tr>
                  <th>Ref</th>
                  <th>Choice</th>
                  <th>Preferences</th>
                  <th>Browser / Device</th>
                  <th>Page</th>
                  <th>Changes</th>
                  <th>Last updated</th>
                  <th>Expires</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td><code>{r.id}</code></td>
                    <td><span className={`ck-admin__chip ck-admin__chip--${r.status}`}>{LABELS[r.status]}</span></td>
                    <td>{r.preferences ? 'Allowed' : 'Off'}</td>
                    <td>{r.browser} · {r.device}</td>
                    <td className="ck-admin__page">{r.page ?? '—'}</td>
                    <td>{r.changes}</td>
                    <td>{fmt(r.updated_at)}</td>
                    <td>{fmt(r.expires_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {total > PAGE_SIZE && (
          <div className="ck-admin__pager">
            <button disabled={page === 0} onClick={() => setPage(page - 1)}>‹ Prev</button>
            <span>Page {page + 1} of {pages} · {total} visitors</span>
            <button disabled={page >= pages - 1} onClick={() => setPage(page + 1)}>Next ›</button>
          </div>
        )}
      </div>

      <div className="ck-admin__note">
        <strong>How this works.</strong> A visitor's choice is stored in their browser for {summary?.retention_days ?? 365} days and
        recorded here under a random anonymous reference. We keep only the choice, date, page, and browser/device type — never the
        visitor's IP address (only a one-way hash used to block abuse), name, or email. Records delete themselves when the
        {' '}{summary?.retention_days ?? 365}-day period ends. Policy version: {summary?.policy_version ?? '1.0'}.
      </div>
    </div>
  );
};

export default AdminCookies;
