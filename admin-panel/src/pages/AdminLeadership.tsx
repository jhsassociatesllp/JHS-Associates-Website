import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './AdminLeadership.css';

interface Person {
  id: string;
  name: string;
  education: string;
  description: string;
  location: string;
  email: string | null;
  linkedin: string | null;
  services: string[];
  sectors: string[];
  cities: string[];
  service_points: string[];
  specializations: string[];
  roles: string[];
  section: string | null;
  status: 'Active' | 'Inactive';
  display_order: number;
  photo_id: string | null;
  photo_file: string | null;
}

interface Options {
  roles: string[];
  services: string[];
  sectors: string[];
  cities: string[];
  statuses: string[];
}

interface CatalogService {
  key: string;
  name: string;
  points: { id: string; title: string; desc: string }[];
}

interface FormState {
  name: string;
  education: string;
  description: string;
  location: string;
  email: string;
  linkedin: string;
  services: string[];
  sectors: string[];
  cities: string[];
  service_points: string[];
  specializations: string;
  roles: string[];
  section: string;
  status: 'Active' | 'Inactive';
  display_order: string;
  photo: File | null;
  remove_photo: boolean;
}

const EMPTY_FORM: FormState = {
  name: '',
  education: '',
  description: '',
  location: '',
  email: '',
  linkedin: '',
  services: [],
  sectors: [],
  cities: [],
  service_points: [],
  specializations: '',
  roles: [],
  section: '',
  status: 'Active',
  display_order: '',
  photo: null,
  remove_photo: false,
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;
// Seeded people reference photos bundled with the public website. Set
// VITE_IMAGE_BASE to that site's image folder to preview them here.
const IMAGE_BASE = (import.meta.env.VITE_IMAGE_BASE as string | undefined) ?? '';

const photoSrc = (p: Pick<Person, 'photo_id' | 'photo_file'>): string => {
  if (p.photo_id) return `${API_BASE_URL}/leadership/photo/${p.photo_id}`;
  if (p.photo_file && IMAGE_BASE) return `${IMAGE_BASE}/${p.photo_file}`;
  return '';
};

type CheckField = 'roles' | 'services' | 'sectors' | 'cities';

const CheckGroup: React.FC<{
  label: string;
  items: string[];
  selected: string[];
  onToggle: (value: string) => void;
}> = ({ label, items, selected, onToggle }) => (
  <div className="leadership-field leadership-field-full">
    <label className="leadership-label">
      {label} <span className="leadership-count">({selected.length} selected)</span>
    </label>
    <div className="leadership-checks">
      {items.map((item) => (
        <label key={item} className={`leadership-check ${selected.includes(item) ? 'on' : ''}`}>
          <input type="checkbox" checked={selected.includes(item)} onChange={() => onToggle(item)} />
          <span>{item}</span>
        </label>
      ))}
    </div>
  </div>
);

const AdminLeadership: React.FC = () => {
  const { token } = useAuth();
  const authHeaders = { Authorization: `Bearer ${token}` };

  const [people, setPeople] = useState<Person[]>([]);
  const [options, setOptions] = useState<Options>({ roles: [], services: [], sectors: [], cities: [], statuses: [] });
  const [catalog, setCatalog] = useState<CatalogService[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [formError, setFormError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [existingPhoto, setExistingPhoto] = useState('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchPeople = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/leadership/admin/all`, { headers: authHeaders });
      if (res.ok) setPeople(await res.json());
      else setMessage({ type: 'error', text: 'Unable to load leadership members.' });
    } catch (err) {
      console.error('Error fetching leadership members:', err);
      setMessage({ type: 'error', text: 'Unable to load leadership members.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPeople();
    Promise.all([
      fetch(`${API_BASE_URL}/leadership/options`).then((r) => (r.ok ? r.json() : null)),
      fetch(`${API_BASE_URL}/catalog/services`).then((r) => (r.ok ? r.json() : null)),
      fetch(`${API_BASE_URL}/catalog/sectors`).then((r) => (r.ok ? r.json() : null)),
    ])
      .then(([o, services, sectors]) => {
        if (!o) return;
        // Services and sectors are managed on the "Services & Sectors" page.
        setCatalog(services ?? []);
        setOptions({
          ...o,
          services: services ? services.map((s: CatalogService) => s.name) : o.services,
          sectors: sectors ? sectors.map((s: { name: string }) => s.name) : o.sectors,
        });
      })
      .catch((err) => console.error('Error fetching options:', err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sectionSuggestions = useMemo(
    () => Array.from(new Set(people.map((p) => p.section).filter((s): s is string => !!s))),
    [people]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return people.filter((p) => {
      if (q && !p.name.toLowerCase().includes(q) && !p.location.toLowerCase().includes(q)) return false;
      if (roleFilter !== 'All' && !p.roles.includes(roleFilter)) return false;
      if (statusFilter !== 'All' && p.status !== statusFilter) return false;
      return true;
    });
  }, [people, search, roleFilter, statusFilter]);

  const toggle = (key: CheckField, value: string) =>
    setForm((f) => ({
      ...f,
      [key]: f[key].includes(value) ? f[key].filter((v) => v !== value) : [...f[key], value],
    }));

  const toggleService = (name: string) =>
    setForm((f) => {
      const svc = catalog.find((c) => c.name === name);
      const on = f.services.includes(name);
      const prefix = svc ? `${svc.key}:` : '';
      return {
        ...f,
        services: on ? f.services.filter((v) => v !== name) : [...f.services, name],
        // unticking a service also clears its sub-services
        service_points: on ? f.service_points.filter((sp) => !sp.startsWith(prefix)) : f.service_points,
      };
    });

  const togglePoint = (svc: CatalogService, pointId: string) =>
    setForm((f) => {
      const ref = `${svc.key}:${pointId}`;
      const on = f.service_points.includes(ref);
      return {
        ...f,
        service_points: on ? f.service_points.filter((v) => v !== ref) : [...f.service_points, ref],
        // ticking a sub-service also ticks its service
        services: !on && !f.services.includes(svc.name) ? [...f.services, svc.name] : f.services,
      };
    });

  const openCreate = () => {
    const nextOrder = people.reduce((max, p) => Math.max(max, p.display_order), 0) + 1;
    setForm({ ...EMPTY_FORM, roles: ['Partner'], display_order: String(nextOrder) });
    setFormError('');
    setExistingPhoto('');
    setEditingId(null);
    setMessage(null);
    setShowForm(true);
  };

  const openEdit = (p: Person) => {
    setForm({
      name: p.name,
      education: p.education,
      description: p.description,
      location: p.location,
      email: p.email ?? '',
      linkedin: p.linkedin ?? '',
      services: p.services,
      sectors: p.sectors,
      cities: p.cities ?? [],
      service_points: p.service_points ?? [],
      specializations: p.specializations.join(', '),
      roles: p.roles,
      section: p.section ?? '',
      status: p.status,
      display_order: String(p.display_order),
      photo: null,
      remove_photo: false,
    });
    setExistingPhoto(photoSrc(p));
    setEditingId(p.id);
    setFormError('');
    setMessage(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!form.name.trim()) return setFormError('Name is required.');
    if (form.roles.length === 0) return setFormError('Select at least one Leadership Role.');

    const body = new FormData();
    body.append('name', form.name);
    body.append('education', form.education);
    body.append('description', form.description);
    body.append('location', form.location);
    body.append('email', form.email);
    body.append('linkedin', form.linkedin);
    body.append('section', form.section);
    body.append('status', form.status);
    body.append('display_order', form.display_order || '0');
    form.roles.forEach((v) => body.append('roles', v));
    form.services.forEach((v) => body.append('services', v));
    form.sectors.forEach((v) => body.append('sectors', v));
    form.cities.forEach((v) => body.append('cities', v));
    form.service_points.forEach((v) => body.append('service_points', v));
    form.specializations
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((v) => body.append('specializations', v));
    if (form.photo) body.append('photo', form.photo);
    if (editingId) body.append('remove_photo', String(form.remove_photo));

    setSubmitting(true);
    try {
      const res = await fetch(
        editingId ? `${API_BASE_URL}/leadership/${editingId}` : `${API_BASE_URL}/leadership/`,
        { method: editingId ? 'PUT' : 'POST', headers: authHeaders, body }
      );
      if (res.ok) {
        closeForm();
        setMessage({ type: 'success', text: editingId ? 'Member updated.' : 'Member added.' });
        fetchPeople();
      } else {
        const err = await res.json().catch(() => null);
        const detail = typeof err?.detail === 'string'
          ? err.detail
          : Array.isArray(err?.detail)
            ? err.detail.map((d: { loc?: string[]; msg?: string }) => `${d.loc?.slice(-1)[0] ?? 'field'}: ${d.msg}`).join('; ')
            : 'Unable to save member.';
        setFormError(detail);
      }
    } catch (err) {
      console.error('Error saving member:', err);
      setFormError('Unable to reach the server. Is the backend running?');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (p: Person) => {
    if (!window.confirm(`Delete ${p.name}? This removes them from the website.`)) return;
    try {
      const res = await fetch(`${API_BASE_URL}/leadership/${p.id}`, { method: 'DELETE', headers: authHeaders });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Member deleted.' });
        fetchPeople();
      } else {
        setMessage({ type: 'error', text: 'Unable to delete member.' });
      }
    } catch (err) {
      console.error('Error deleting member:', err);
      setMessage({ type: 'error', text: 'Unable to delete member.' });
    }
  };

  const previewSrc = form.photo ? URL.createObjectURL(form.photo) : form.remove_photo ? '' : existingPhoto;

  return (
    <div className="leadership-container">
      <div className="leadership-header">
        <div>
          <p className="leadership-eyebrow">Website Content</p>
          <h1 className="leadership-title">Leadership &amp; Partners</h1>
          <p className="leadership-subtitle">
            Manage Partners, Governance Council, Advisory Board Members and Associates shown on the Leadership page.
          </p>
        </div>
        <button className="leadership-btn leadership-btn-primary" onClick={openCreate}>+ Add Member</button>
      </div>

      {message && <div className={`leadership-alert ${message.type}`}>{message.text}</div>}

      <div className="leadership-action-bar">
        <input
          className="leadership-input leadership-search"
          type="text"
          placeholder="Search by name or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="leadership-input" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="All">All Roles</option>
          {options.roles.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
        <select className="leadership-input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <div className="leadership-card">
        {loading ? (
          <div className="leadership-loading">Loading…</div>
        ) : (
          <div className="leadership-table-wrap">
            <table className="leadership-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Member</th>
                  <th>Roles</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id}>
                    <td>{p.display_order}</td>
                    <td>
                      <div className="leadership-person">
                        {photoSrc(p) ? (
                          <img className="leadership-avatar" src={photoSrc(p)} alt={p.name} />
                        ) : (
                          <div className="leadership-avatar leadership-avatar-fallback">{p.name.charAt(0)}</div>
                        )}
                        <div>
                          <div className="leadership-name">{p.name}</div>
                          <div className="leadership-edu">{p.education}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      {p.roles.map((r) => <span key={r} className="leadership-chip">{r}</span>)}
                    </td>
                    <td>{p.location}</td>
                    <td>
                      <span className={`leadership-status ${p.status === 'Active' ? 'active' : 'inactive'}`}>{p.status}</span>
                    </td>
                    <td>
                      <button className="leadership-link" onClick={() => openEdit(p)}>Edit</button>
                      <button className="leadership-link danger" onClick={() => handleDelete(p)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="leadership-empty">No members found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <div className="leadership-overlay" onClick={closeForm}>
          <form className="leadership-modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
            <h2>{editingId ? 'Edit Member' : 'Add Member'}</h2>
            {formError && <div className="leadership-alert error">{formError}</div>}

            <div className="leadership-grid">
              <div className="leadership-field">
                <label className="leadership-label">Name *</label>
                <input className="leadership-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="leadership-field">
                <label className="leadership-label">Education / Degree</label>
                <input className="leadership-input" value={form.education} onChange={(e) => setForm({ ...form, education: e.target.value })} placeholder="FCA, CISA" />
              </div>
              <div className="leadership-field leadership-field-full">
                <label className="leadership-label">Short Description</label>
                <textarea className="leadership-input" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="leadership-field">
                <label className="leadership-label">Email ID</label>
                <input className="leadership-input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="leadership-field">
                <label className="leadership-label">LinkedIn URL</label>
                <input className="leadership-input" value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} placeholder="https://www.linkedin.com/in/..." />
              </div>
              <div className="leadership-field">
                <label className="leadership-label">Location</label>
                <input className="leadership-input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Mumbai" />
              </div>
              <div className="leadership-field">
                <label className="leadership-label">Page Section</label>
                <input className="leadership-input" list="leadership-sections" value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })} placeholder="Heading on the Leadership page" />
                <datalist id="leadership-sections">
                  {sectionSuggestions.map((s) => <option key={s} value={s} />)}
                </datalist>
                <span className="leadership-hint">Pick an existing heading (e.g. “Gujarat Partners”) to place them in that group; left blank they appear under “Partners”. Governance Council members always appear under “Governance Council”.</span>
              </div>
              <div className="leadership-field leadership-field-full">
                <label className="leadership-label">Expertise Tags</label>
                <input className="leadership-input" value={form.specializations} onChange={(e) => setForm({ ...form, specializations: e.target.value })} placeholder="Comma-separated, e.g. Risk & Governance, Internal Audit" />
                <span className="leadership-hint">Shown on the profile card and used by the website’s sector filter.</span>
              </div>

              <CheckGroup label="Leadership Roles *" items={options.roles} selected={form.roles} onToggle={(v) => toggle('roles', v)} />
              <div className="leadership-field leadership-field-full">
                <label className="leadership-label">
                  Services &amp; Sub-services <span className="leadership-count">({form.service_points.length} sub-services selected)</span>
                </label>
                <div className="leadership-checks">
                  {options.services.map((name) => (
                    <label key={name} className={`leadership-check ${form.services.includes(name) ? 'on' : ''}`}>
                      <input type="checkbox" checked={form.services.includes(name)} onChange={() => toggleService(name)} />
                      <span>{name}</span>
                    </label>
                  ))}
                </div>
                {catalog
                  .filter((svc) => form.services.includes(svc.name) && svc.points.length > 0)
                  .map((svc) => (
                    <div key={svc.key} className="leadership-subservices">
                      <div className="leadership-subservices__title">{svc.name} — pick the sub-services this person handles</div>
                      {svc.points.map((pt) => (
                        <label key={pt.id} className="leadership-subservice">
                          <input
                            type="checkbox"
                            checked={form.service_points.includes(`${svc.key}:${pt.id}`)}
                            onChange={() => togglePoint(svc, pt.id)}
                          />
                          <span className="leadership-subservice__num">{pt.id}</span>
                          <span>{pt.title}</span>
                        </label>
                      ))}
                    </div>
                  ))}
              </div>
              <CheckGroup label="Sectors" items={options.sectors} selected={form.sectors} onToggle={(v) => toggle('sectors', v)} />
              <CheckGroup label="Show on City Pages" items={options.cities} selected={form.cities} onToggle={(v) => toggle('cities', v)} />

              <div className="leadership-field">
                <label className="leadership-label">Status</label>
                <select className="leadership-input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as 'Active' | 'Inactive' })}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="leadership-field">
                <label className="leadership-label">Display Order</label>
                <input className="leadership-input" type="number" min={0} value={form.display_order} onChange={(e) => setForm({ ...form, display_order: e.target.value })} />
                <span className="leadership-hint">Lower numbers appear first.</span>
              </div>

              <div className="leadership-field leadership-field-full">
                <label className="leadership-label">Photo</label>
                <div className="leadership-photo-row">
                  {previewSrc ? (
                    <img className="leadership-avatar leadership-avatar-lg" src={previewSrc} alt="Preview" />
                  ) : (
                    <div className="leadership-avatar leadership-avatar-lg leadership-avatar-fallback">{form.name.charAt(0) || '?'}</div>
                  )}
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setForm({ ...form, photo: e.target.files?.[0] ?? null, remove_photo: false })}
                    />
                    {editingId && (existingPhoto || form.photo) && (
                      <label className="leadership-inline-check">
                        <input
                          type="checkbox"
                          checked={form.remove_photo}
                          onChange={(e) => setForm({ ...form, remove_photo: e.target.checked, photo: null })}
                        />
                        Remove current photo
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="leadership-modal-actions">
              <button type="button" className="leadership-btn" onClick={closeForm}>Cancel</button>
              <button type="submit" className="leadership-btn leadership-btn-primary" disabled={submitting}>
                {submitting ? 'Saving…' : editingId ? 'Save Changes' : 'Add Member'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminLeadership;
