import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './AdminCatalog.css';

interface SubService {
  id: string; // empty until the sub-service has been saved
  title: string;
  desc: string;
  uid: string; // client-side key only
}

interface Service {
  key: string;
  name: string;
  order: number;
  points: { id: string; title: string; desc: string }[];
}

interface Sector {
  id: string;
  name: string;
  order: number;
}

interface Draft {
  key: string | null; // null = new service
  name: string;
  points: SubService[];
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

let uidCounter = 0;
const uid = () => `p${++uidCounter}`;

const toDraft = (s: Service): Draft => ({
  key: s.key,
  name: s.name,
  points: s.points.map((p) => ({ id: p.id, title: p.title, desc: p.desc ?? '', uid: uid() })),
});

const AdminCatalog: React.FC = () => {
  const { token } = useAuth();
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  const [tab, setTab] = useState<'services' | 'sectors'>('services');
  const [services, setServices] = useState<Service[]>([]);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [newSector, setNewSector] = useState('');
  const [sectorEdits, setSectorEdits] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const flash = (type: 'success' | 'error', text: string) => setMsg({ type, text });
  const clearEdit = (id: string) =>
    setSectorEdits((m) => {
      const next = { ...m };
      delete next[id];
      return next;
    });

  const detail = async (res: Response, fallback: string) => {
    const err = await res.json().catch(() => null);
    return typeof err?.detail === 'string' ? err.detail : fallback;
  };

  const load = async () => {
    try {
      const [s, c] = await Promise.all([
        fetch(`${API_BASE_URL}/catalog/services`).then((r) => r.json()),
        fetch(`${API_BASE_URL}/catalog/sectors`).then((r) => r.json()),
      ]);
      setServices(s);
      setSectors(c);
      return s as Service[];
    } catch {
      flash('error', 'Unable to load services and sectors.');
      return [] as Service[];
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load().then((s) => s[0] && setDraft(toDraft(s[0])));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ───────────── Services ───────────── */
  const selectService = (s: Service) => {
    setMsg(null);
    setDraft(toDraft(s));
  };

  const newService = () => {
    setMsg(null);
    setDraft({ key: null, name: '', points: [{ id: '', title: '', desc: '', uid: uid() }] });
  };

  const patchPoint = (u: string, patch: Partial<SubService>) =>
    setDraft((d) => d && { ...d, points: d.points.map((p) => (p.uid === u ? { ...p, ...patch } : p)) });

  const movePoint = (index: number, dir: -1 | 1) =>
    setDraft((d) => {
      if (!d) return d;
      const next = [...d.points];
      const j = index + dir;
      if (j < 0 || j >= next.length) return d;
      [next[index], next[j]] = [next[j], next[index]];
      return { ...d, points: next };
    });

  const removePoint = (u: string) => setDraft((d) => d && { ...d, points: d.points.filter((p) => p.uid !== u) });

  const addPoint = () =>
    setDraft((d) => d && { ...d, points: [...d.points, { id: '', title: '', desc: '', uid: uid() }] });

  const saveService = async () => {
    if (!draft) return;
    if (!draft.name.trim()) return flash('error', 'Service name is required.');
    const body = JSON.stringify({
      name: draft.name,
      points: draft.points
        .filter((p) => p.title.trim())
        .map((p) => ({ id: p.id, title: p.title, desc: p.desc })),
    });
    setBusy(true);
    try {
      const res = await fetch(
        draft.key ? `${API_BASE_URL}/catalog/services/${draft.key}` : `${API_BASE_URL}/catalog/services`,
        { method: draft.key ? 'PUT' : 'POST', headers, body }
      );
      if (!res.ok) return flash('error', await detail(res, 'Unable to save the service.'));
      const saved: Service = await res.json();
      await load();
      setDraft(toDraft(saved));
      flash('success', draft.key ? 'Service saved.' : 'Service added.');
    } finally {
      setBusy(false);
    }
  };

  const deleteService = async () => {
    if (!draft?.key) return;
    if (!window.confirm(`Delete “${draft.name}” and all its sub-services? Partners assigned to it will be unassigned.`)) return;
    const res = await fetch(`${API_BASE_URL}/catalog/services/${draft.key}`, { method: 'DELETE', headers });
    if (!res.ok) return flash('error', await detail(res, 'Unable to delete the service.'));
    const s = await load();
    setDraft(s[0] ? toDraft(s[0]) : null);
    flash('success', 'Service deleted.');
  };

  const moveService = async (index: number, dir: -1 | 1) => {
    const a = services[index];
    const b = services[index + dir];
    if (!a || !b) return;
    const put = (svc: Service, order: number) =>
      fetch(`${API_BASE_URL}/catalog/services/${svc.key}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ name: svc.name, order, points: svc.points }),
      });
    await Promise.all([put(a, b.order), put(b, a.order)]);
    await load();
  };

  /* ───────────── Sectors ───────────── */
  const addSector = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSector.trim()) return;
    const res = await fetch(`${API_BASE_URL}/catalog/sectors`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ name: newSector }),
    });
    if (!res.ok) return flash('error', await detail(res, 'Unable to add the sector.'));
    setNewSector('');
    await load();
    flash('success', 'Sector added.');
  };

  const renameSector = async (s: Sector) => {
    const name = (sectorEdits[s.id] ?? s.name).trim();
    if (!name || name === s.name) return clearEdit(s.id);
    const res = await fetch(`${API_BASE_URL}/catalog/sectors/${s.id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ name }),
    });
    if (!res.ok) flash('error', await detail(res, 'Unable to rename the sector.'));
    else flash('success', 'Sector renamed.');
    clearEdit(s.id);
    await load();
  };

  const deleteSector = async (s: Sector) => {
    if (!window.confirm(`Delete the sector “${s.name}”? Partners tagged with it will be untagged.`)) return;
    const res = await fetch(`${API_BASE_URL}/catalog/sectors/${s.id}`, { method: 'DELETE', headers });
    if (!res.ok) return flash('error', await detail(res, 'Unable to delete the sector.'));
    await load();
    flash('success', 'Sector deleted.');
  };

  const moveSector = async (index: number, dir: -1 | 1) => {
    const a = sectors[index];
    const b = sectors[index + dir];
    if (!a || !b) return;
    const put = (s: Sector, order: number) =>
      fetch(`${API_BASE_URL}/catalog/sectors/${s.id}`, { method: 'PUT', headers, body: JSON.stringify({ name: s.name, order }) });
    await Promise.all([put(a, b.order), put(b, a.order)]);
    await load();
  };

  return (
    <div className="catalog-container">
      <div className="catalog-header">
        <div>
          <p className="catalog-eyebrow">Website Content</p>
          <h1 className="catalog-title">Services &amp; Sectors</h1>
          <p className="catalog-subtitle">
            Add or edit the services (and their sub-services) and sectors the website offers. Assign partners to them from the Leadership page.
          </p>
        </div>
      </div>

      <div className="catalog-tabs">
        <button className={tab === 'services' ? 'active' : ''} onClick={() => setTab('services')}>Services</button>
        <button className={tab === 'sectors' ? 'active' : ''} onClick={() => setTab('sectors')}>Sectors</button>
      </div>

      {msg && <div className={`catalog-alert ${msg.type}`}>{msg.text}</div>}

      {tab === 'services' && (
        <div className="catalog-split">
          <aside className="catalog-list">
            <button className="catalog-btn catalog-btn-primary catalog-add" onClick={newService}>+ Add Service</button>
            {services.map((s, i) => (
              <div key={s.key} className={`catalog-list__item ${draft?.key === s.key ? 'active' : ''}`}>
                <button className="catalog-list__main" onClick={() => selectService(s)}>
                  <span className="catalog-list__name">{s.name}</span>
                  <span className="catalog-list__count">{s.points.length} sub-service{s.points.length === 1 ? '' : 's'}</span>
                </button>
                <span className="catalog-list__move">
                  <button title="Move up" disabled={i === 0} onClick={() => moveService(i, -1)}>▲</button>
                  <button title="Move down" disabled={i === services.length - 1} onClick={() => moveService(i, 1)}>▼</button>
                </span>
              </div>
            ))}
          </aside>

          <section className="catalog-editor">
            {!draft ? (
              <p className="catalog-empty">Select a service, or add a new one.</p>
            ) : (
              <>
                <h2>{draft.key ? 'Edit service' : 'New service'}</h2>
                <label className="catalog-label">Service name</label>
                <input
                  className="catalog-input"
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  placeholder="e.g. Assurance"
                />

                <div className="catalog-points__head">
                  <label className="catalog-label">Sub-services ({draft.points.filter((p) => p.title.trim()).length})</label>
                  <span className="catalog-hint">Shown on the website's service page in this order.</span>
                </div>

                {draft.points.map((p, i) => (
                  <div key={p.uid} className="catalog-point">
                    <span className="catalog-point__num">{String(i + 1).padStart(2, '0')}</span>
                    <div className="catalog-point__fields">
                      <input
                        className="catalog-input"
                        value={p.title}
                        onChange={(e) => patchPoint(p.uid, { title: e.target.value })}
                        placeholder="Sub-service title"
                      />
                      <input
                        className="catalog-input catalog-input-sm"
                        value={p.desc}
                        onChange={(e) => patchPoint(p.uid, { desc: e.target.value })}
                        placeholder="Short description (optional)"
                      />
                    </div>
                    <span className="catalog-point__actions">
                      <button title="Move up" disabled={i === 0} onClick={() => movePoint(i, -1)}>▲</button>
                      <button title="Move down" disabled={i === draft.points.length - 1} onClick={() => movePoint(i, 1)}>▼</button>
                      <button title="Remove" className="danger" onClick={() => removePoint(p.uid)}>✕</button>
                    </span>
                  </div>
                ))}

                <button className="catalog-btn" onClick={addPoint}>+ Add sub-service</button>

                <div className="catalog-editor__actions">
                  {draft.key && (
                    <button className="catalog-btn catalog-btn-danger" onClick={deleteService}>Delete service</button>
                  )}
                  <button className="catalog-btn catalog-btn-primary" onClick={saveService} disabled={busy}>
                    {busy ? 'Saving…' : 'Save changes'}
                  </button>
                </div>
              </>
            )}
          </section>
        </div>
      )}

      {tab === 'sectors' && (
        <section className="catalog-sectors">
          <form className="catalog-sector-add" onSubmit={addSector}>
            <input
              className="catalog-input"
              value={newSector}
              onChange={(e) => setNewSector(e.target.value)}
              placeholder="New sector name"
            />
            <button className="catalog-btn catalog-btn-primary" type="submit">+ Add Sector</button>
          </form>

          {sectors.map((s, i) => (
            <div key={s.id} className="catalog-sector">
              <span className="catalog-point__num">{String(i + 1).padStart(2, '0')}</span>
              <input
                className="catalog-input"
                value={sectorEdits[s.id] ?? s.name}
                onChange={(e) => setSectorEdits((m) => ({ ...m, [s.id]: e.target.value }))}
                onBlur={() => renameSector(s)}
                onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
              />
              <span className="catalog-point__actions">
                <button title="Move up" disabled={i === 0} onClick={() => moveSector(i, -1)}>▲</button>
                <button title="Move down" disabled={i === sectors.length - 1} onClick={() => moveSector(i, 1)}>▼</button>
                <button title="Delete" className="danger" onClick={() => deleteSector(s)}>✕</button>
              </span>
            </div>
          ))}
          <p className="catalog-hint">
            Each sector listed here can be ticked for a partner on the Leadership page. A new sector needs its own page on the website to be visible there.
          </p>
        </section>
      )}
    </div>
  );
};

export default AdminCatalog;
