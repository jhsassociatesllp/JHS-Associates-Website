import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './AdminRegWatch.css';

interface Item {
  id: string;
  title: string;
  summary: string;
  regulator: string;
  reference: string | null;
  published_on: string;
  pdf_id: string;
  image_id: string | null;
  status: 'draft' | 'published';
  created_at: string;
  last_edited_by?: string | null;
}

interface FormState {
  title: string;
  summary: string;
  regulator: string;
  reference: string;
  published_on: string;
  status: 'draft' | 'published';
}

const REGULATORS = ['SEBI', 'RBI', 'MCA', 'GST', 'Income Tax', 'FEMA', 'IRDAI', 'Other'];
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;
const today = () => new Date().toISOString().slice(0, 10);
const EMPTY: FormState = { title: '', summary: '', regulator: 'SEBI', reference: '', published_on: today(), status: 'published' };
const fmt = (d: string) => (d ? new Date(`${d}T00:00:00`).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—');

const AdminRegWatch: React.FC = () => {
  const { token } = useAuth();
  const auth = { Authorization: `Bearer ${token}` };

  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [editing, setEditing] = useState<Item | 'new' | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [pdf, setPdf] = useState<File | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const pdfInput = useRef<HTMLInputElement>(null);
  const imageInput = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/reg-watch/admin/all`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error();
      setItems(await res.json());
    } catch {
      setMsg({ type: 'error', text: 'Unable to load Reg-Watch updates.' });
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }));

  const openNew = () => {
    setForm({ ...EMPTY, published_on: today() });
    setPdf(null); setImage(null); setFormError(''); setEditing('new');
  };
  const openEdit = (it: Item) => {
    setForm({ title: it.title, summary: it.summary, regulator: it.regulator, reference: it.reference ?? '', published_on: it.published_on, status: it.status });
    setPdf(null); setImage(null); setFormError(''); setEditing(it);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (form.title.trim().length < 3) return setFormError('Please enter a title.');
    if (form.summary.trim().length < 3) return setFormError('Please enter a short summary.');
    if (editing === 'new' && !pdf) return setFormError('Please attach the PDF of the circular / notification.');
    if (pdf && pdf.type !== 'application/pdf' && !pdf.name.toLowerCase().endsWith('.pdf')) return setFormError('The document must be a PDF.');
    if (pdf && pdf.size > 10 * 1024 * 1024) return setFormError('The PDF must be under 10 MB.');
    if (image && image.size > 5 * 1024 * 1024) return setFormError('The cover image must be under 5 MB.');

    const body = new FormData();
    body.append('title', form.title.trim());
    body.append('summary', form.summary.trim());
    body.append('regulator', form.regulator);
    body.append('reference', form.reference.trim());
    body.append('published_on', form.published_on);
    body.append('status', form.status);
    if (pdf) body.append('pdf', pdf);
    if (image) body.append('image', image);

    const isNew = editing === 'new';
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/reg-watch/admin${isNew ? '' : `/${(editing as Item).id}`}`, {
        method: isNew ? 'POST' : 'PUT', headers: auth, body,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(typeof data?.detail === 'string' ? data.detail : 'Could not save. Please try again.');
      }
      setEditing(null);
      setMsg({ type: 'success', text: isNew ? 'Reg-Watch update published.' : 'Update saved.' });
      load();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Could not save.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (it: Item) => {
    if (!window.confirm(`Delete “${it.title}”? The PDF is deleted too. This cannot be undone.`)) return;
    const res = await fetch(`${API_BASE_URL}/reg-watch/admin/${it.id}`, { method: 'DELETE', headers: auth });
    setMsg(res.ok ? { type: 'success', text: 'Deleted.' } : { type: 'error', text: 'Could not delete.' });
    if (res.ok) load();
  };

  const toggle = async (it: Item) => {
    const body = new FormData();
    body.append('title', it.title); body.append('summary', it.summary); body.append('regulator', it.regulator);
    body.append('reference', it.reference ?? ''); body.append('published_on', it.published_on);
    body.append('status', it.status === 'published' ? 'draft' : 'published');
    const res = await fetch(`${API_BASE_URL}/reg-watch/admin/${it.id}`, { method: 'PUT', headers: auth, body });
    if (res.ok) load(); else setMsg({ type: 'error', text: 'Could not change status.' });
  };

  const openPdf = async (it: Item) => {
    // A plain link can't carry the admin login, so fetch the file and open it as a blob.
    const res = await fetch(`${API_BASE_URL}/reg-watch/admin/${it.id}/pdf`, { headers: auth });
    if (!res.ok) { setMsg({ type: 'error', text: 'Could not open the PDF.' }); return; }
    const url = URL.createObjectURL(await res.blob());
    window.open(url, '_blank', 'noopener,noreferrer');
    window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
  };

  const published = items.filter((i) => i.status === 'published').length;

  return (
    <div className="rwa">
      <div className="rwa__header">
        <div>
          <p className="rwa__eyebrow">Website Content</p>
          <h1 className="rwa__title">Reg-Watch</h1>
          <p className="rwa__subtitle">
            Upload regulatory circulars and notifications (SEBI, RBI, MCA, GST…). They appear on the website under Insights → Reg-Watch,
            and the newest one is featured as a card in the home page hero.
          </p>
        </div>
        <button className="rwa__btn rwa__btn--primary" onClick={openNew}>+ New Update</button>
      </div>

      {msg && <div className={`rwa__alert rwa__alert--${msg.type}`} onClick={() => setMsg(null)}>{msg.text}</div>}

      <div className="rwa__stats">
        <div className="rwa__stat"><span>Total updates</span><strong>{items.length}</strong></div>
        <div className="rwa__stat rwa__stat--green"><span>Published</span><strong>{published}</strong></div>
        <div className="rwa__stat rwa__stat--amber"><span>Drafts</span><strong>{items.length - published}</strong></div>
      </div>

      <div className="rwa__card">
        {loading ? (
          <div className="rwa__empty">Loading…</div>
        ) : items.length === 0 ? (
          <div className="rwa__empty">No updates yet. Click “New Update” to upload the first one.</div>
        ) : (
          <div className="rwa__table-wrap">
            <table className="rwa__table">
              <thead><tr><th>Update</th><th>Regulator</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {items.map((it) => (
                  <tr key={it.id}>
                    <td>
                      <div className="rwa__name">{it.title}</div>
                      {it.reference && <span className="rwa__type">Ref: {it.reference}</span>}
                    </td>
                    <td>{it.regulator}</td>
                    <td>{fmt(it.published_on)}</td>
                    <td><span className={`rwa__chip rwa__chip--${it.status}`}>{it.status === 'published' ? 'Published' : 'Draft'}</span></td>
                    <td className="rwa__actions">
                      <button onClick={() => openEdit(it)}>Edit</button>
                      <button onClick={() => toggle(it)}>{it.status === 'published' ? 'Unpublish' : 'Publish'}</button>
                      <button onClick={() => openPdf(it)}>View PDF</button>
                      <button className="danger" onClick={() => remove(it)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editing && (
        <div className="rwa__overlay" onClick={() => setEditing(null)}>
          <form className="rwa__modal" onClick={(e) => e.stopPropagation()} onSubmit={save}>
            <h2>{editing === 'new' ? 'New Reg-Watch Update' : 'Edit Update'}</h2>
            {formError && <div className="rwa__alert rwa__alert--error">{formError}</div>}
            <div className="rwa__grid">
              <div className="rwa__field rwa__field--full">
                <label>Title *</label>
                <input value={form.title} maxLength={200} onChange={(e) => set('title', e.target.value)} placeholder="e.g. SEBI revises the timeline for…" />
              </div>
              <div className="rwa__field rwa__field--full">
                <label>Short summary * <small>(shown on the card, max 500 characters)</small></label>
                <textarea rows={3} maxLength={500} value={form.summary} onChange={(e) => set('summary', e.target.value)} />
              </div>
              <div className="rwa__field">
                <label>Regulator *</label>
                <select value={form.regulator} onChange={(e) => set('regulator', e.target.value)}>
                  {REGULATORS.map((r) => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div className="rwa__field">
                <label>Circular / notification date *</label>
                <input type="date" value={form.published_on} onChange={(e) => set('published_on', e.target.value)} />
              </div>
              <div className="rwa__field">
                <label>Reference no. <small>(optional)</small></label>
                <input value={form.reference} maxLength={120} onChange={(e) => set('reference', e.target.value)} placeholder="e.g. SEBI/HO/CFD/…" />
              </div>
              <div className="rwa__field">
                <label>Status</label>
                <select value={form.status} onChange={(e) => set('status', e.target.value as FormState['status'])}>
                  <option value="published">Published (visible on website)</option>
                  <option value="draft">Draft (hidden)</option>
                </select>
              </div>
              <div className="rwa__field">
                <label>PDF {editing === 'new' ? '*' : <small>(leave empty to keep current)</small>}</label>
                <input ref={pdfInput} type="file" accept="application/pdf,.pdf" onChange={(e) => setPdf(e.target.files?.[0] ?? null)} />
                <small className="rwa__hint">PDF only, up to 10 MB.</small>
              </div>
              <div className="rwa__field">
                <label>Cover image <small>(optional)</small></label>
                <input ref={imageInput} type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => setImage(e.target.files?.[0] ?? null)} />
                <small className="rwa__hint">Shown on the card and in the hero. JPG / PNG / WebP, up to 5 MB.</small>
              </div>
            </div>
            <div className="rwa__modal-actions">
              <button type="button" className="rwa__btn" onClick={() => setEditing(null)}>Cancel</button>
              <button type="submit" className="rwa__btn rwa__btn--primary" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminRegWatch;
