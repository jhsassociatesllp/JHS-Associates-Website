import React, { useEffect, useMemo, useState } from 'react';
import { Download, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { formatCompact, formatExact, istDay as sharedIstDay } from '../utils/dateTime';
import './AdminContacts.css';
import './AdminProposals.css';

// Days are Indian Standard Time days, whatever the viewer's own time zone is.
const IST_TIME_ZONE = 'Asia/Kolkata';
const istDay = (iso: string | Date) => sharedIstDay(iso); // 2026-10-28
const addDays = (day: string, n: number) => {
  const d = new Date(`${day}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};

type Status = 'new' | 'in_review' | 'proposal_sent' | 'closed';

const STATUS_LABEL: Record<Status, string> = {
  new: 'New',
  in_review: 'In review',
  proposal_sent: 'Proposal sent',
  closed: 'Closed',
};
const STATUSES = Object.keys(STATUS_LABEL) as Status[];

interface Proposal {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  inquiry_reason: string;
  subject: string;
  message?: string | null;
  created_at: string;
  status: Status;
  admin_note?: string | null;
  handled_by?: string | null;
  updated_at?: string | null;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

const formatIst = (iso?: string | null) => (iso ? formatExact(iso) : '');

const AdminProposals: React.FC = () => {
  const { token } = useAuth();
  const [items, setItems] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Status>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // what the team is typing for the selected request (saved only when "Save" is pressed)
  const [draftStatus, setDraftStatus] = useState<Status>('new');
  const [draftNote, setDraftNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);
  const [exporting, setExporting] = useState(false);

  const authHeaders = { Authorization: `Bearer ${token}` };

  const fetchProposals = async (spinner = true) => {
    try {
      if (spinner) {
        setLoading(true);
        setLoadError('');
      }
      const response = await fetch(`${API_BASE_URL}/proposal/`, { headers: authHeaders });
      if (!response.ok) throw new Error('Could not load the proposal requests.');
      setItems(await response.json());
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Could not load the proposal requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals(false); // the page starts in its loading state, so no spinner reset is needed here
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const today = istDay(new Date());

  const stats = useMemo(() => ({
    total: items.length,
    fresh: items.filter((p) => p.status === 'new').length,
    inReview: items.filter((p) => p.status === 'in_review').length,
    sent: items.filter((p) => p.status === 'proposal_sent').length,
    today: items.filter((p) => istDay(p.created_at) === today).length,
  }), [items, today]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((p) => {
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      const day = istDay(p.created_at);
      if (dateFrom && day < dateFrom) return false;
      if (dateTo && day > dateTo) return false;
      if (!q) return true;
      return [p.first_name, p.last_name, p.email, p.phone ?? '', p.subject, p.inquiry_reason, p.message ?? '']
        .join(' ').toLowerCase().includes(q);
    });
  }, [items, search, statusFilter, dateFrom, dateTo]);

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const pageRows = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const active = items.find((p) => p.id === selectedId) ?? null;

  const open = (p: Proposal) => {
    setSelectedId(p.id);
    setDraftStatus(p.status);
    setDraftNote(p.admin_note ?? '');
    setMessage(null);
  };

  const pickRange = (from: string, to: string) => {
    setDateFrom(from);
    setDateTo(to);
    setPage(0);
  };

  const save = async () => {
    if (!active) return;
    setSaving(true);
    setMessage(null);
    try {
      const response = await fetch(`${API_BASE_URL}/proposal/${active.id}/status`, {
        method: 'PATCH',
        headers: { ...authHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: draftStatus, note: draftNote }),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => null);
        const detail = Array.isArray(err?.detail) ? err.detail[0]?.msg : err?.detail;
        throw new Error(typeof detail === 'string' ? detail : 'Could not save. Please try again.');
      }
      const updated: Proposal = await response.json();
      setItems((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      setMessage({ kind: 'ok', text: 'Saved.' });
    } catch (error) {
      setMessage({ kind: 'error', text: error instanceof Error ? error.message : 'Could not save. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const exportExcel = async () => {
    setExporting(true);
    setMessage(null);
    try {
      const qs = new URLSearchParams();
      if (dateFrom) qs.set('date_from', dateFrom);
      if (dateTo) qs.set('date_to', dateTo);
      if (statusFilter !== 'all') qs.set('status', statusFilter);
      const response = await fetch(`${API_BASE_URL}/proposal/export?${qs.toString()}`, { headers: authHeaders });
      if (!response.ok) {
        const err = await response.json().catch(() => null);
        throw new Error(typeof err?.detail === 'string' ? err.detail : 'Could not prepare the Excel file.');
      }
      const blob = await response.blob();
      const named = /filename="([^"]+)"/.exec(response.headers.get('Content-Disposition') || '');
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = named?.[1] || 'JHS_Proposal_Requests.xlsx';
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (error) {
      setMessage({ kind: 'error', text: error instanceof Error ? error.message : 'Could not prepare the Excel file.' });
    } finally {
      setExporting(false);
    }
  };

  const fullName = (p: Proposal) => `${p.first_name} ${p.last_name}`.trim();
  const unchanged = !!active && draftStatus === active.status && draftNote.trim() === (active.admin_note ?? '');

  return (
    <div className="contacts-container">
      {/* Header */}
      <div className="contacts-header">
        <div>
          <p className="contacts-eyebrow">Business enquiries</p>
          <h1 className="contacts-title">Proposal requests</h1>
          <p className="contacts-subtitle">Every Request for Proposal from the website, with its follow-up status.</p>
        </div>
        <button className="contacts-btn contacts-btn-primary" onClick={exportExcel} disabled={exporting}>
          <Download size={15} /> {exporting ? 'Preparing…' : 'Download Excel'}
        </button>
      </div>

      {/* Stats */}
      <div className="contacts-stats-row">
        <div className="contacts-stat-card">
          <p className="contacts-stat-label">Total requests</p>
          <p className="contacts-stat-value">{stats.total}</p>
          <p className="contacts-stat-sub">{stats.today === 0 ? 'None received today' : `${stats.today} received today`}</p>
        </div>
        <div className="contacts-stat-card">
          <p className="contacts-stat-label">New</p>
          <p className="contacts-stat-value">{stats.fresh}</p>
          <p className="contacts-stat-sub">Needs a first look</p>
        </div>
        <div className="contacts-stat-card">
          <p className="contacts-stat-label">In review</p>
          <p className="contacts-stat-value">{stats.inReview}</p>
          <p className="contacts-stat-sub">Being worked on</p>
        </div>
        <div className="contacts-stat-card">
          <p className="contacts-stat-label">Proposal sent</p>
          <p className="contacts-stat-value">{stats.sent}</p>
          <p className="contacts-stat-sub">Waiting for the client</p>
        </div>
      </div>

      {/* Action bar */}
      <div className="contacts-action-bar prop-bar">
        <div className="contacts-search">
          <input
            type="text"
            placeholder="Search name, email, phone or subject"
            value={search}
            maxLength={80}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          />
        </div>

        <div className="contacts-filter-tabs">
          <button className={statusFilter === 'all' ? 'active' : ''} onClick={() => { setStatusFilter('all'); setPage(0); }}>All</button>
          {STATUSES.map((s) => (
            <button key={s} className={statusFilter === s ? 'active' : ''} onClick={() => { setStatusFilter(s); setPage(0); }}>
              {STATUS_LABEL[s]}
            </button>
          ))}
        </div>

        <button className="contacts-btn contacts-btn-icon icon-refresh" onClick={() => fetchProposals()} title="Refresh">
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Date filter */}
      <div className="prop-dates">
        <label>
          From
          <input type="date" value={dateFrom} max={dateTo || undefined} onChange={(e) => { setDateFrom(e.target.value); setPage(0); }} />
        </label>
        <label>
          To
          <input type="date" value={dateTo} min={dateFrom || undefined} onChange={(e) => { setDateTo(e.target.value); setPage(0); }} />
        </label>
        <div className="prop-quick">
          <button type="button" className={dateFrom === today && dateTo === today ? 'on' : ''} onClick={() => pickRange(today, today)}>Today</button>
          <button type="button" onClick={() => pickRange(addDays(today, -6), today)}>Last 7 days</button>
          <button type="button" onClick={() => pickRange(addDays(today, -29), today)}>Last 30 days</button>
          <button type="button" className={!dateFrom && !dateTo ? 'on' : ''} onClick={() => pickRange('', '')}>All dates</button>
        </div>
        <span className="prop-count"><strong>{filtered.length}</strong> request{filtered.length === 1 ? '' : 's'}</span>
      </div>

      {message && message.kind === 'error' && !active && <div className="prop-msg prop-msg--error" role="alert">{message.text}</div>}

      {/* Main */}
      <div className="contacts-main-card">
        {loading ? (
          <div className="contacts-loading"><div className="contacts-spinner"></div></div>
        ) : loadError ? (
          <div className="contacts-empty">
            <h3>Could not load</h3>
            <p>{loadError}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="contacts-empty">
            <div className="empty-icon">📄</div>
            <h3>No proposal requests found</h3>
            <p>Requests sent from the Request for Proposal page on your website will appear here.</p>
          </div>
        ) : (
          <div className="contacts-inbox-layout">
            {/* List */}
            <div className="contacts-inbox-list">
              <div className="contacts-inbox-list-header">
                <span>Requests</span>
                <span className="contacts-inbox-list-controls">
                  <span className="contacts-inbox-list-count">{filtered.length} total</span>
                  <select value={rowsPerPage} onChange={(e) => { setRowsPerPage(parseInt(e.target.value)); setPage(0); }} title="Rows per page">
                    <option value={6}>6 / page</option>
                    <option value={12}>12 / page</option>
                    <option value={24}>24 / page</option>
                  </select>
                </span>
              </div>
              <div className="contacts-inbox-list-scroll">
                {pageRows.map((p) => (
                  <button key={p.id} className={`contacts-inbox-item ${active?.id === p.id ? 'active' : ''}`} onClick={() => open(p)}>
                    <span className="contact-avatar">{(p.first_name || '?').charAt(0).toUpperCase()}</span>
                    <span className="contacts-inbox-item-body">
                      <span className="contacts-inbox-item-top">
                        <span className="contacts-inbox-item-name">{fullName(p)}</span>
                        <span className="contacts-inbox-item-time">{formatCompact(p.created_at)}</span>
                      </span>
                      <span className="contacts-inbox-item-preview">{p.subject}</span>
                      <span className="contacts-inbox-item-email">{p.email}</span>
                    </span>
                    <span className={`prop-pill prop-pill--${p.status}`}>{STATUS_LABEL[p.status]}</span>
                  </button>
                ))}
              </div>
              {totalPages > 1 && (
                <div className="contacts-pagination">
                  <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}>← Prev</button>
                  <span>Page {page + 1} of {totalPages}</span>
                  <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1}>Next →</button>
                </div>
              )}
            </div>

            {/* Detail */}
            <div className="contacts-inbox-detail">
              {active ? (
                <>
                  <div className="contacts-detail-head">
                    <span className="contact-avatar large">{(active.first_name || '?').charAt(0).toUpperCase()}</span>
                    <div className="contacts-detail-head-text">
                      <h3>{fullName(active)} <span className={`prop-pill prop-pill--${active.status}`}>{STATUS_LABEL[active.status]}</span></h3>
                      <a href={`mailto:${active.email}`} className="contacts-detail-email">{active.email}</a>
                    </div>
                  </div>

                  <div className="contacts-detail-infogrid">
                    {active.phone && (
                      <div className="contacts-info-box">
                        <span className="contacts-info-label">Phone</span>
                        <span className="contacts-info-value">{active.phone}</span>
                      </div>
                    )}
                    <div className="contacts-info-box">
                      <span className="contacts-info-label">Inquiry reason</span>
                      <span className="contacts-info-value">{active.inquiry_reason}</span>
                    </div>
                    <div className="contacts-info-box">
                      <span className="contacts-info-label">Submitted</span>
                      <span className="contacts-info-value">{formatIst(active.created_at)}</span>
                    </div>
                  </div>

                  <div className="contacts-detail-subject">
                    <span className="contacts-info-label">Subject</span>
                    <p>{active.subject}</p>
                  </div>

                  <div className="contacts-detail-message">
                    <p>{active.message}</p>
                  </div>

                  {/* Follow-up tracking */}
                  <div className="prop-track">
                    <h4>Follow-up</h4>
                    <div className="prop-track__row">
                      <label>
                        Status
                        <select value={draftStatus} onChange={(e) => setDraftStatus(e.target.value as Status)}>
                          {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
                        </select>
                      </label>
                    </div>
                    <label className="prop-track__note">
                      Team note (only your team sees this)
                      <textarea
                        value={draftNote}
                        maxLength={1000}
                        rows={3}
                        placeholder="For example: called on 25 Oct, proposal sent by email…"
                        onChange={(e) => setDraftNote(e.target.value)}
                      />
                      <span className="prop-track__count">{draftNote.length} / 1000</span>
                    </label>
                    <div className="prop-track__actions">
                      <button className="contacts-btn contacts-btn-primary" onClick={save} disabled={saving || unchanged}>
                        {saving ? 'Saving…' : 'Save'}
                      </button>
                      {message && <span className={`prop-msg-inline prop-msg-inline--${message.kind}`} role="status">{message.text}</span>}
                    </div>
                    {active.handled_by && active.updated_at && (
                      <p className="prop-track__who">Last updated by {active.handled_by} on {formatIst(active.updated_at)}</p>
                    )}
                  </div>

                  <div className="contacts-detail-actions">
                    <button className="contacts-btn contacts-btn-outline" onClick={() => window.open(`mailto:${active.email}`, '_blank')}>✉ Reply by email</button>
                    {active.phone && (
                      <button className="contacts-btn contacts-btn-outline" onClick={() => window.open(`tel:${active.phone}`, '_blank')}>📞 Call</button>
                    )}
                  </div>
                </>
              ) : (
                <div className="contacts-detail-placeholder">
                  <div className="empty-icon">📥</div>
                  <p>Select a request to see its details and update its status.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProposals;
