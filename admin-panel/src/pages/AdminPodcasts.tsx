import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './AdminPodcasts.css';

interface Episode {
  id: string;
  title: string;
  description: string;
  guest: string | null;
  duration: string | null;
  platform: string;
  listen_url: string;
  published_on: string;
  image_id: string | null;
  status: 'draft' | 'published';
  created_at: string;
}

interface FormState {
  title: string;
  description: string;
  guest: string;
  duration: string;
  platform: string;
  listen_url: string;
  published_on: string;
  status: 'draft' | 'published';
}

const PLATFORMS = ['YouTube', 'Spotify', 'Apple Podcasts', 'Website', 'Other'];
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;
const today = () => new Date().toISOString().slice(0, 10);
const EMPTY: FormState = { title: '', description: '', guest: '', duration: '', platform: 'YouTube', listen_url: '', published_on: today(), status: 'published' };
const fmt = (d: string) => (d ? new Date(`${d}T00:00:00`).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—');

const AdminPodcasts: React.FC = () => {
  const { token } = useAuth();
  const auth = { Authorization: `Bearer ${token}` };

  const [items, setItems] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [editing, setEditing] = useState<Episode | 'new' | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [image, setImage] = useState<File | null>(null);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/podcasts/admin/all`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error();
      setItems(await res.json());
    } catch {
      setMsg({ type: 'error', text: 'Unable to load podcasts.' });
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }));

  const openNew = () => { setForm({ ...EMPTY, published_on: today() }); setImage(null); setFormError(''); setEditing('new'); };
  const openEdit = (ep: Episode) => {
    setForm({
      title: ep.title, description: ep.description, guest: ep.guest ?? '', duration: ep.duration ?? '',
      platform: ep.platform, listen_url: ep.listen_url, published_on: ep.published_on, status: ep.status,
    });
    setImage(null); setFormError(''); setEditing(ep);
  };

  const buildBody = (f: FormState, file: File | null) => {
    const body = new FormData();
    body.append('title', f.title.trim());
    body.append('description', f.description.trim());
    body.append('guest', f.guest.trim());
    body.append('duration', f.duration.trim());
    body.append('platform', f.platform);
    body.append('listen_url', f.listen_url.trim());
    body.append('published_on', f.published_on);
    body.append('status', f.status);
    if (file) body.append('image', file);
    return body;
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (form.title.trim().length < 3) return setFormError('Please enter the episode title.');
    if (form.description.trim().length < 3) return setFormError('Please enter a short description.');
    if (!/^https?:\/\/\S+$/i.test(form.listen_url.trim())) return setFormError('Please enter the listen link, starting with https://');
    if (image && image.size > 5 * 1024 * 1024) return setFormError('The cover image must be under 5 MB.');

    const isNew = editing === 'new';
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/podcasts/admin${isNew ? '' : `/${(editing as Episode).id}`}`, {
        method: isNew ? 'POST' : 'PUT', headers: auth, body: buildBody(form, image),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(typeof data?.detail === 'string' ? data.detail : 'Could not save. Please try again.');
      }
      setEditing(null);
      setMsg({ type: 'success', text: isNew ? 'Podcast added.' : 'Podcast saved.' });
      load();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Could not save.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (ep: Episode) => {
    if (!window.confirm(`Delete “${ep.title}”? This cannot be undone.`)) return;
    const res = await fetch(`${API_BASE_URL}/podcasts/admin/${ep.id}`, { method: 'DELETE', headers: auth });
    setMsg(res.ok ? { type: 'success', text: 'Deleted.' } : { type: 'error', text: 'Could not delete.' });
    if (res.ok) load();
  };

  const toggle = async (ep: Episode) => {
    const next: FormState = {
      title: ep.title, description: ep.description, guest: ep.guest ?? '', duration: ep.duration ?? '',
      platform: ep.platform, listen_url: ep.listen_url, published_on: ep.published_on,
      status: ep.status === 'published' ? 'draft' : 'published',
    };
    const res = await fetch(`${API_BASE_URL}/podcasts/admin/${ep.id}`, { method: 'PUT', headers: auth, body: buildBody(next, null) });
    if (res.ok) load(); else setMsg({ type: 'error', text: 'Could not change status.' });
  };

  const published = items.filter((i) => i.status === 'published').length;

  return (
    <div className="pca">
      <div className="pca__header">
        <div>
          <p className="pca__eyebrow">Website Content</p>
          <h1 className="pca__title">Podcasts</h1>
          <p className="pca__subtitle">
            Add podcast episodes with a cover image and a listen link (YouTube, Spotify, Apple Podcasts…). They appear on the website’s
            Podcasts page, and the newest episode is featured as a card in the home page hero.
          </p>
        </div>
        <button className="pca__btn pca__btn--primary" onClick={openNew}>+ New Episode</button>
      </div>

      {msg && <div className={`pca__alert pca__alert--${msg.type}`} onClick={() => setMsg(null)}>{msg.text}</div>}

      <div className="pca__stats">
        <div className="pca__stat"><span>Total episodes</span><strong>{items.length}</strong></div>
        <div className="pca__stat pca__stat--green"><span>Published</span><strong>{published}</strong></div>
        <div className="pca__stat pca__stat--amber"><span>Drafts</span><strong>{items.length - published}</strong></div>
      </div>

      <div className="pca__card">
        {loading ? (
          <div className="pca__empty">Loading…</div>
        ) : items.length === 0 ? (
          <div className="pca__empty">No episodes yet. Click “New Episode” to add the first one.</div>
        ) : (
          <div className="pca__table-wrap">
            <table className="pca__table">
              <thead><tr><th>Episode</th><th>Platform</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {items.map((ep) => (
                  <tr key={ep.id}>
                    <td>
                      <div className="pca__name">{ep.title}</div>
                      {(ep.guest || ep.duration) && <span className="pca__type">{[ep.guest && `With ${ep.guest}`, ep.duration].filter(Boolean).join(' · ')}</span>}
                    </td>
                    <td>{ep.platform}</td>
                    <td>{fmt(ep.published_on)}</td>
                    <td><span className={`pca__chip pca__chip--${ep.status}`}>{ep.status === 'published' ? 'Published' : 'Draft'}</span></td>
                    <td className="pca__actions">
                      <button onClick={() => openEdit(ep)}>Edit</button>
                      <button onClick={() => toggle(ep)}>{ep.status === 'published' ? 'Unpublish' : 'Publish'}</button>
                      <button onClick={() => window.open(ep.listen_url, '_blank', 'noopener,noreferrer')}>Open link</button>
                      <button className="danger" onClick={() => remove(ep)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editing && (
        <div className="pca__overlay" onClick={() => setEditing(null)}>
          <form className="pca__modal" onClick={(e) => e.stopPropagation()} onSubmit={save}>
            <h2>{editing === 'new' ? 'New Podcast Episode' : 'Edit Episode'}</h2>
            {formError && <div className="pca__alert pca__alert--error">{formError}</div>}
            <div className="pca__grid">
              <div className="pca__field pca__field--full">
                <label>Episode title *</label>
                <input value={form.title} maxLength={200} onChange={(e) => set('title', e.target.value)} placeholder="e.g. How GST changes affect your business" />
              </div>
              <div className="pca__field pca__field--full">
                <label>Short description * <small>(shown on the card, max 500 characters)</small></label>
                <textarea rows={3} maxLength={500} value={form.description} onChange={(e) => set('description', e.target.value)} />
              </div>
              <div className="pca__field">
                <label>Guest / speaker <small>(optional)</small></label>
                <input value={form.guest} maxLength={120} onChange={(e) => set('guest', e.target.value)} placeholder="e.g. CA Huzefa Unwala" />
              </div>
              <div className="pca__field">
                <label>Duration <small>(optional)</small></label>
                <input value={form.duration} maxLength={30} onChange={(e) => set('duration', e.target.value)} placeholder="e.g. 32 min" />
              </div>
              <div className="pca__field">
                <label>Platform *</label>
                <select value={form.platform} onChange={(e) => set('platform', e.target.value)}>
                  {PLATFORMS.map((p) => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div className="pca__field">
                <label>Release date *</label>
                <input type="date" value={form.published_on} onChange={(e) => set('published_on', e.target.value)} />
              </div>
              <div className="pca__field pca__field--full">
                <label>Listen link * <small>(where the episode plays)</small></label>
                <input value={form.listen_url} maxLength={500} onChange={(e) => set('listen_url', e.target.value)} placeholder="https://www.youtube.com/watch?v=…" />
              </div>
              <div className="pca__field">
                <label>Cover image <small>{editing === 'new' ? '(optional)' : '(leave empty to keep current)'}</small></label>
                <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => setImage(e.target.files?.[0] ?? null)} />
                <small className="pca__hint">JPG / PNG / WebP, up to 5 MB.</small>
              </div>
              <div className="pca__field">
                <label>Status</label>
                <select value={form.status} onChange={(e) => set('status', e.target.value as FormState['status'])}>
                  <option value="published">Published (visible on website)</option>
                  <option value="draft">Draft (hidden)</option>
                </select>
              </div>
            </div>
            <div className="pca__modal-actions">
              <button type="button" className="pca__btn" onClick={() => setEditing(null)}>Cancel</button>
              <button type="submit" className="pca__btn pca__btn--primary" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminPodcasts;
