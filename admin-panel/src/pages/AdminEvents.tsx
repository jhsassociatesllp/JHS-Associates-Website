import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './AdminEvents.css';

type EventStatus = 'draft' | 'published' | 'cancelled';

interface EventRow {
  id: string;
  title: string;
  event_type: string;
  summary: string;
  description: string;
  start_at: string;
  end_at: string;
  mode: string;
  venue: string | null;
  join_link: string | null;
  external_registration_url: string | null;
  capacity: number;
  registered: number;
  spots_left: number | null;
  registration_deadline: string | null;
  host: string | null;
  status: EventStatus;
  state: 'upcoming' | 'live' | 'past';
  registration_open: boolean;
}

interface Registration {
  id: string;
  name: string;
  email: string;
  phone: string;
  organization: string | null;
  designation: string | null;
  city: string | null;
  attended: boolean;
  created_at: string;
}

interface Summary { events: number; upcoming: number; registrations: number; last_7_days: number }

interface FormState {
  title: string;
  event_type: string;
  summary: string;
  description: string;
  start_at: string; // datetime-local, Indian Standard Time
  end_at: string;
  mode: string;
  venue: string;
  join_link: string;
  external_registration_url: string;
  capacity: string;
  registration_deadline: string;
  host: string;
  status: EventStatus;
}

const EVENT_TYPES = ['Excellencia', 'Knowledge Setu', 'Office Event', 'Webinar', 'Other'];
const MODES = ['Online', 'In-person', 'Hybrid'];
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;
const SITE_URL = (import.meta.env.VITE_PUBLIC_SITE_URL as string | undefined) ?? 'https://jhsassociates.in';
const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
const PAGE_SIZE = 25;

const EMPTY_FORM: FormState = {
  title: '', event_type: 'Excellencia', summary: '', description: '', start_at: '', end_at: '', mode: 'Online',
  venue: '', join_link: '', external_registration_url: '', capacity: '0', registration_deadline: '', host: '', status: 'published',
};

// The admin types times in Indian Standard Time; the server stores UTC.
const istInputToIso = (v: string) => (v ? `${v}:00+05:30` : null);
const isoToIstInput = (iso: string | null) => (iso ? new Date(new Date(iso).getTime() + IST_OFFSET_MS).toISOString().slice(0, 16) : '');
const fmt = (iso: string | null) =>
  iso ? new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }).format(new Date(iso)) + ' IST' : '—';

const AdminEvents: React.FC = () => {
  const { token } = useAuth();
  const auth = { Authorization: `Bearer ${token}` };
  const json = { ...auth, 'Content-Type': 'application/json' };

  const [events, setEvents] = useState<EventRow[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [editing, setEditing] = useState<EventRow | 'new' | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const [viewing, setViewing] = useState<EventRow | null>(null);
  const [regs, setRegs] = useState<Registration[]>([]);
  const [regTotal, setRegTotal] = useState(0);
  const [regPage, setRegPage] = useState(0);
  const [regSearch, setRegSearch] = useState('');

  const load = useCallback(async () => {
    try {
      const [e, s] = await Promise.all([
        fetch(`${API_BASE_URL}/events/admin/all`, { headers: auth }),
        fetch(`${API_BASE_URL}/events/admin/summary`, { headers: auth }),
      ]);
      if (!e.ok || !s.ok) throw new Error();
      setEvents(await e.json());
      setSummary(await s.json());
    } catch {
      setMsg({ type: 'error', text: 'Unable to load events.' });
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const loadRegs = useCallback(async () => {
    if (!viewing) return;
    const qs = new URLSearchParams({ skip: String(regPage * PAGE_SIZE), limit: String(PAGE_SIZE) });
    if (regSearch.trim()) qs.set('search', regSearch.trim());
    const res = await fetch(`${API_BASE_URL}/events/admin/${viewing.id}/registrations?${qs}`, { headers: auth });
    if (res.ok) {
      const data = await res.json();
      setRegs(data.items);
      setRegTotal(data.total);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewing, regPage, regSearch, token]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadRegs();
  }, [loadRegs]);

  /* ── event form ── */
  const openNew = () => {
    setForm(EMPTY_FORM);
    setFormError('');
    setEditing('new');
  };

  const openEdit = (e: EventRow) => {
    setForm({
      title: e.title, event_type: e.event_type, summary: e.summary, description: e.description,
      start_at: isoToIstInput(e.start_at), end_at: isoToIstInput(e.end_at), mode: e.mode, venue: e.venue ?? '',
      join_link: e.join_link ?? '', external_registration_url: e.external_registration_url ?? '',
      capacity: String(e.capacity), registration_deadline: isoToIstInput(e.registration_deadline), host: e.host ?? '', status: e.status,
    });
    setFormError('');
    setEditing(e);
  };

  const set = (key: keyof FormState, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const save = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!form.title.trim()) return setFormError('Title is required.');
    if (!form.start_at) return setFormError('Start date and time are required.');
    const body = {
      title: form.title.trim(),
      event_type: form.event_type,
      summary: form.summary.trim(),
      description: form.description.trim(),
      start_at: istInputToIso(form.start_at),
      end_at: istInputToIso(form.end_at),
      mode: form.mode,
      venue: form.venue.trim() || null,
      join_link: form.join_link.trim() || null,
      external_registration_url: form.external_registration_url.trim() || null,
      capacity: Math.max(0, parseInt(form.capacity || '0', 10) || 0),
      registration_deadline: istInputToIso(form.registration_deadline),
      host: form.host.trim() || null,
      status: form.status,
    };
    setSaving(true);
    setFormError('');
    try {
      const isNew = editing === 'new';
      const res = await fetch(isNew ? `${API_BASE_URL}/events/admin` : `${API_BASE_URL}/events/admin/${(editing as EventRow).id}`, {
        method: isNew ? 'POST' : 'PUT', headers: json, body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        const detail = Array.isArray(err?.detail)
          ? err.detail.map((d: { loc?: string[]; msg?: string }) => `${d.loc?.slice(-1)[0] ?? 'field'}: ${d.msg}`).join('; ')
          : err?.detail;
        return setFormError(typeof detail === 'string' ? detail : 'Unable to save the event.');
      }
      setEditing(null);
      setMsg({ type: 'success', text: isNew ? 'Event created.' : 'Event updated.' });
      load();
    } finally {
      setSaving(false);
    }
  };

  const remove = async (e: EventRow) => {
    if (!window.confirm(`Delete “${e.title}”? Its ${e.registered} registration(s) will be deleted too.`)) return;
    const res = await fetch(`${API_BASE_URL}/events/admin/${e.id}`, { method: 'DELETE', headers: auth });
    if (res.ok) {
      setMsg({ type: 'success', text: 'Event deleted.' });
      load();
    } else setMsg({ type: 'error', text: 'Unable to delete the event.' });
  };

  const copyLink = async (e: EventRow) => {
    try {
      await navigator.clipboard.writeText(`${SITE_URL.replace(/\/$/, '')}/events/${e.id}`);
      setMsg({ type: 'success', text: 'Registration link copied.' });
    } catch {
      setMsg({ type: 'error', text: 'Could not copy the link.' });
    }
  };

  /* ── registrations ── */
  const openRegs = (e: EventRow) => {
    setRegPage(0);
    setRegSearch('');
    setRegs([]);
    setViewing(e);
  };

  const toggleAttended = async (r: Registration) => {
    const res = await fetch(`${API_BASE_URL}/events/admin/registrations/${r.id}/attended?attended=${!r.attended}`, { method: 'PATCH', headers: auth });
    if (res.ok) setRegs((list) => list.map((x) => (x.id === r.id ? { ...x, attended: !r.attended } : x)));
  };

  const removeReg = async (r: Registration) => {
    if (!window.confirm(`Remove ${r.name}'s registration?`)) return;
    const res = await fetch(`${API_BASE_URL}/events/admin/registrations/${r.id}`, { method: 'DELETE', headers: auth });
    if (res.ok) {
      loadRegs();
      load();
    }
  };

  const exportCsv = async () => {
    if (!viewing) return;
    const res = await fetch(`${API_BASE_URL}/events/admin/${viewing.id}/registrations/export`, { headers: auth });
    if (!res.ok) return setMsg({ type: 'error', text: 'Unable to export.' });
    const url = URL.createObjectURL(await res.blob());
    const a = document.createElement('a');
    a.href = url;
    a.download = `${viewing.title.replace(/[^\w]+/g, '-').toLowerCase()}-registrations.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const pages = Math.max(1, Math.ceil(regTotal / PAGE_SIZE));
  const showVenue = form.mode !== 'Online';
  const attendedCount = regs.filter((r) => r.attended).length;

  return (
    <div className="ae">
      <div className="ae__header">
        <div>
          <p className="ae__eyebrow">Website Content</p>
          <h1 className="ae__title">Events &amp; Registrations</h1>
          <p className="ae__subtitle">
            Create Excellencia, Knowledge Setu and office events. The next event appears on the website's home page, visitors register online, and you track everyone who joins here.
          </p>
        </div>
        <button className="ae__btn ae__btn--primary" onClick={openNew}>+ New Event</button>
      </div>

      {msg && <div className={`ae__alert ae__alert--${msg.type}`} onClick={() => setMsg(null)}>{msg.text}</div>}

      {summary && (
        <div className="ae__stats">
          <div className="ae__stat"><span>Total events</span><strong>{summary.events}</strong></div>
          <div className="ae__stat ae__stat--blue"><span>Upcoming / live</span><strong>{summary.upcoming}</strong></div>
          <div className="ae__stat ae__stat--green"><span>Total registrations</span><strong>{summary.registrations}</strong></div>
          <div className="ae__stat ae__stat--amber"><span>Registered in last 7 days</span><strong>{summary.last_7_days}</strong></div>
        </div>
      )}

      <div className="ae__card">
        {loading ? (
          <div className="ae__empty">Loading…</div>
        ) : events.length === 0 ? (
          <div className="ae__empty">No events yet. Click “New Event” to create the first one.</div>
        ) : (
          <div className="ae__table-wrap">
            <table className="ae__table">
              <thead>
                <tr><th>Event</th><th>Date &amp; time</th><th>Format</th><th>Status</th><th>Registrations</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {events.map((e) => (
                  <tr key={e.id}>
                    <td>
                      <div className="ae__name">{e.title}</div>
                      <span className="ae__type">{e.event_type}</span>
                    </td>
                    <td>{fmt(e.start_at)}</td>
                    <td>{e.mode}</td>
                    <td>
                      <span className={`ae__chip ae__chip--${e.status === 'published' ? e.state : e.status}`}>
                        {e.status === 'published' ? (e.state === 'upcoming' ? 'Upcoming' : e.state === 'live' ? 'Live' : 'Completed') : e.status === 'draft' ? 'Draft' : 'Cancelled'}
                      </span>
                    </td>
                    <td>
                      <strong>{e.registered}</strong>{e.capacity ? ` / ${e.capacity}` : ''}
                      {e.external_registration_url && <span className="ae__ext"> · external link</span>}
                    </td>
                    <td className="ae__actions">
                      <button onClick={() => openRegs(e)}>Registrations</button>
                      <button onClick={() => openEdit(e)}>Edit</button>
                      <button onClick={() => copyLink(e)}>Copy link</button>
                      <button className="danger" onClick={() => remove(e)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── create / edit ── */}
      {editing && (
        <div className="ae__overlay" onClick={() => setEditing(null)}>
          <form className="ae__modal" onClick={(e) => e.stopPropagation()} onSubmit={save}>
            <h2>{editing === 'new' ? 'New Event' : 'Edit Event'}</h2>
            {formError && <div className="ae__alert ae__alert--error">{formError}</div>}

            <div className="ae__grid">
              <div className="ae__field ae__field--full">
                <label>Title *</label>
                <input value={form.title} onChange={(e) => set('title', e.target.value)} maxLength={160} placeholder="e.g. Excellencia — Union Budget Special" />
              </div>
              <div className="ae__field">
                <label>Event type</label>
                <select value={form.event_type} onChange={(e) => set('event_type', e.target.value)}>
                  {EVENT_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="ae__field">
                <label>Format</label>
                <select value={form.mode} onChange={(e) => set('mode', e.target.value)}>
                  {MODES.map((m) => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div className="ae__field ae__field--full">
                <label>Short summary <small>(shown on the home page card)</small></label>
                <input value={form.summary} onChange={(e) => set('summary', e.target.value)} maxLength={300} />
              </div>
              <div className="ae__field ae__field--full">
                <label>Description</label>
                <textarea rows={4} value={form.description} onChange={(e) => set('description', e.target.value)} maxLength={4000} />
              </div>
              <div className="ae__field">
                <label>Starts * <small>(Indian time)</small></label>
                <input type="datetime-local" value={form.start_at} onChange={(e) => set('start_at', e.target.value)} />
              </div>
              <div className="ae__field">
                <label>Ends <small>(optional, Indian time)</small></label>
                <input type="datetime-local" value={form.end_at} onChange={(e) => set('end_at', e.target.value)} />
              </div>
              {showVenue && (
                <div className="ae__field ae__field--full">
                  <label>Venue / address</label>
                  <input value={form.venue} onChange={(e) => set('venue', e.target.value)} maxLength={300} placeholder="e.g. Navkar Chambers, Andheri (East), Mumbai" />
                </div>
              )}
              <div className="ae__field ae__field--full">
                <label>Joining link <small>(Zoom / Teams / Meet — private: shown only to people who register)</small></label>
                <input value={form.join_link} onChange={(e) => set('join_link', e.target.value)} maxLength={500} placeholder="https://" />
              </div>
              <div className="ae__field">
                <label>Seat limit <small>(0 = unlimited)</small></label>
                <input type="number" min={0} value={form.capacity} onChange={(e) => set('capacity', e.target.value)} />
              </div>
              <div className="ae__field">
                <label>Registration closes <small>(optional, Indian time)</small></label>
                <input type="datetime-local" value={form.registration_deadline} onChange={(e) => set('registration_deadline', e.target.value)} />
              </div>
              <div className="ae__field">
                <label>Host / speaker</label>
                <input value={form.host} onChange={(e) => set('host', e.target.value)} maxLength={160} />
              </div>
              <div className="ae__field">
                <label>Status</label>
                <select value={form.status} onChange={(e) => set('status', e.target.value as EventStatus)}>
                  <option value="published">Published (visible on website)</option>
                  <option value="draft">Draft (hidden)</option>
                  <option value="cancelled">Cancelled (hidden)</option>
                </select>
              </div>
              <div className="ae__field ae__field--full">
                <label>External registration link <small>(optional — only if registrations are collected on another site; they will not be tracked here)</small></label>
                <input value={form.external_registration_url} onChange={(e) => set('external_registration_url', e.target.value)} maxLength={500} placeholder="https://" />
              </div>
            </div>

            <div className="ae__modal-actions">
              <button type="button" className="ae__btn" onClick={() => setEditing(null)}>Cancel</button>
              <button type="submit" className="ae__btn ae__btn--primary" disabled={saving}>{saving ? 'Saving…' : editing === 'new' ? 'Create Event' : 'Save Changes'}</button>
            </div>
          </form>
        </div>
      )}

      {/* ── registrations ── */}
      {viewing && (
        <div className="ae__overlay" onClick={() => setViewing(null)}>
          <div className="ae__modal ae__modal--wide" onClick={(e) => e.stopPropagation()}>
            <div className="ae__regs-head">
              <div>
                <h2>{viewing.title}</h2>
                <p>{fmt(viewing.start_at)} · {regTotal} registered{viewing.capacity ? ` of ${viewing.capacity} seats` : ''}{regs.length > 0 ? ` · ${attendedCount} marked attended on this page` : ''}</p>
              </div>
              <div className="ae__regs-tools">
                <input
                  className="ae__search"
                  placeholder="Search name, email, organisation…"
                  value={regSearch}
                  onChange={(e) => { setRegSearch(e.target.value); setRegPage(0); }}
                />
                <button className="ae__btn" onClick={exportCsv}>Export CSV</button>
                <button className="ae__btn" onClick={() => setViewing(null)}>Close</button>
              </div>
            </div>

            {regs.length === 0 ? (
              <div className="ae__empty">{regSearch ? 'No registrations match your search.' : 'No registrations yet.'}</div>
            ) : (
              <div className="ae__table-wrap">
                <table className="ae__table">
                  <thead>
                    <tr><th>Name</th><th>Email</th><th>Phone</th><th>Organisation</th><th>City</th><th>Registered</th><th>Attended</th><th /></tr>
                  </thead>
                  <tbody>
                    {regs.map((r) => (
                      <tr key={r.id}>
                        <td><div className="ae__name">{r.name}</div><span className="ae__type">{r.designation ?? ''}</span></td>
                        <td>{r.email}</td>
                        <td>{r.phone}</td>
                        <td>{r.organization ?? '—'}</td>
                        <td>{r.city ?? '—'}</td>
                        <td>{fmt(r.created_at)}</td>
                        <td><input type="checkbox" checked={r.attended} onChange={() => toggleAttended(r)} aria-label={`Mark ${r.name} attended`} /></td>
                        <td className="ae__actions"><button className="danger" onClick={() => removeReg(r)}>Remove</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {regTotal > PAGE_SIZE && (
              <div className="ae__pager">
                <button disabled={regPage === 0} onClick={() => setRegPage(regPage - 1)}>‹ Prev</button>
                <span>Page {regPage + 1} of {pages}</span>
                <button disabled={regPage >= pages - 1} onClick={() => setRegPage(regPage + 1)}>Next ›</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEvents;
