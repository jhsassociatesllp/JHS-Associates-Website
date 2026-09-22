import React, { useMemo, useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './AdminAlumni.css';

// All admin-facing timestamps are shown in Indian Standard Time regardless
// of the viewer's own machine/browser timezone, since the team reviewing
// these registrations is based in India.
const IST_TIME_ZONE = 'Asia/Kolkata';
const istDateKey = (d: Date) => d.toLocaleDateString('en-CA', { timeZone: IST_TIME_ZONE });

interface Alumni {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  company: string;
  designation: string;
  tenure: string;
  last_role: string;
  message?: string;
  created_at: string;
}

const AdminAlumni: React.FC = () => {
  const { token } = useAuth();
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'read'>('all');
  const [selectedAlumni, setSelectedAlumni] = useState<Alumni | null>(null);
  // "Read" is a view-only affordance (which registrations this admin has
  // opened this session) — Alumni has no persisted read field, so this
  // never touches the backend and resets on refresh.
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string

  // Fetch alumni
  const fetchAlumni = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/admin/alumni`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setAlumni(data);
      }
    } catch (error) {
      console.error('Error fetching alumni:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlumni();
  }, []);

  // Format time ago helper
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks} weeks ago`;
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths} months ago`;
  };

  const stats = useMemo(() => {
    const now = new Date();
    const todayKey = istDateKey(now);
    const weekAgo = now.getTime() - 7 * 24 * 60 * 60 * 1000;
    return {
      total: alumni.length,
      today: alumni.filter((a) => istDateKey(new Date(a.created_at)) === todayKey).length,
      thisWeek: alumni.filter((a) => new Date(a.created_at).getTime() >= weekAgo).length,
    };
  }, [alumni]);

  const newCount = alumni.filter((a) => !readIds.has(a.id)).length;

  const markAsRead = (id: string) => {
    setReadIds((prev) => (prev.has(id) ? prev : new Set(prev).add(id)));
  };

  const openAlumni = (person: Alumni) => {
    setSelectedAlumni(person);
    markAsRead(person.id);
  };

  // Filter alumni based on search
  const filteredAlumni = alumni.filter(person => {
    const matchesSearch =
      person.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.designation.toLowerCase().includes(searchTerm.toLowerCase());
    const isRead = readIds.has(person.id);
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'new' && !isRead) ||
      (statusFilter === 'read' && isRead);
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const paginatedAlumni = filteredAlumni.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const totalPages = Math.ceil(filteredAlumni.length / rowsPerPage);

  const activeAlumni = selectedAlumni && alumni.some(a => a.id === selectedAlumni.id)
    ? (alumni.find(a => a.id === selectedAlumni.id) as Alumni)
    : null;

  return (
    <div className="alumni-container">
      {/* Header */}
      <div className="alumni-header">
        <div>
          <p className="alumni-eyebrow">Communications</p>
          <h1 className="alumni-title">Alumni network</h1>
          <p className="alumni-subtitle">
            Review registrations and stay in touch with former colleagues.
          </p>
        </div>
        <span className="alumni-inbox-pill">
          <span className="alumni-inbox-dot" /> Inbox active
        </span>
      </div>

      {/* Stats */}
      <div className="alumni-stats-row">
        <div className="alumni-stat-card">
          <p className="alumni-stat-label">Total Registrations</p>
          <p className="alumni-stat-value">{stats.total}</p>
          <p className="alumni-stat-sub">All alumni sign-ups</p>
        </div>
        <div className="alumni-stat-card">
          <p className="alumni-stat-label">New</p>
          <p className="alumni-stat-value">{newCount}</p>
          <p className="alumni-stat-sub">Not yet reviewed</p>
        </div>
        <div className="alumni-stat-card">
          <p className="alumni-stat-label">Today</p>
          <p className="alumni-stat-value">{stats.today}</p>
          <p className="alumni-stat-sub">{stats.today === 0 ? 'No new registrations' : 'Registered today'}</p>
        </div>
        <div className="alumni-stat-card">
          <p className="alumni-stat-label">This Week</p>
          <p className="alumni-stat-value">{stats.thisWeek}</p>
          <p className="alumni-stat-sub">Last 7 days</p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="alumni-action-bar">
        <div className="alumni-search">
          <input
            type="text"
            placeholder="Search name, email or company"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="alumni-filter-tabs">
          <button className={statusFilter === 'all' ? 'active' : ''} onClick={() => setStatusFilter('all')}>All</button>
          <button className={statusFilter === 'new' ? 'active' : ''} onClick={() => setStatusFilter('new')}>New</button>
          <button className={statusFilter === 'read' ? 'active' : ''} onClick={() => setStatusFilter('read')}>Read</button>
        </div>

        <button
          className="alumni-btn alumni-btn-icon icon-refresh"
          onClick={fetchAlumni}
          title="Refresh"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Main Content */}
      <div className="alumni-main-card">
        {loading ? (
          <div className="alumni-loading">
            <div className="alumni-spinner"></div>
          </div>
        ) : filteredAlumni.length === 0 ? (
          <div className="alumni-empty">
            <div className="empty-icon">🎓</div>
            <h3>No alumni registrations found</h3>
            <p>Alumni registrations will appear here when users submit the alumni form on your website.</p>
          </div>
        ) : (
          <div className="alumni-inbox-layout">
            {/* Left: registrations list */}
            <div className="alumni-inbox-list">
              <div className="alumni-inbox-list-header">
                <span>Inbox</span>
                <span className="alumni-inbox-list-controls">
                  <span className="alumni-inbox-list-count">{filteredAlumni.length} registrations</span>
                  <select
                    value={rowsPerPage}
                    onChange={(e) => { setRowsPerPage(parseInt(e.target.value)); setPage(0); }}
                    title="Rows per page"
                  >
                    <option value={6}>6 / page</option>
                    <option value={12}>12 / page</option>
                    <option value={24}>24 / page</option>
                  </select>
                </span>
              </div>
              <div className="alumni-inbox-list-scroll">
                {paginatedAlumni.map((person) => {
                  const isRead = readIds.has(person.id);
                  const isActive = activeAlumni?.id === person.id;
                  return (
                    <button
                      key={person.id}
                      className={`alumni-inbox-item ${isActive ? 'active' : ''}`}
                      onClick={() => openAlumni(person)}
                    >
                      <span className="alumni-avatar">
                        {person.first_name.charAt(0).toUpperCase()}{person.last_name.charAt(0).toUpperCase()}
                      </span>
                      <span className="alumni-inbox-item-body">
                        <span className="alumni-inbox-item-top">
                          <span className="alumni-inbox-item-name">{person.first_name} {person.last_name}</span>
                          <span className="alumni-inbox-item-time">{formatTimeAgo(person.created_at)}</span>
                        </span>
                        <span className="alumni-inbox-item-preview">{person.designation} · {person.company}</span>
                        <span className="alumni-inbox-item-email">{person.email}</span>
                      </span>
                      {!isRead && <span className="alumni-inbox-item-dot" />}
                    </button>
                  );
                })}
              </div>
              {totalPages > 1 && (
                <div className="alumni-pagination">
                  <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}>← Prev</button>
                  <span>Page {page + 1} of {totalPages}</span>
                  <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1}>Next →</button>
                </div>
              )}
            </div>

            {/* Right: detail pane */}
            <div className="alumni-inbox-detail">
              {activeAlumni ? (
                <>
                  <div className="alumni-detail-head">
                    <span className="alumni-avatar large">
                      {activeAlumni.first_name.charAt(0).toUpperCase()}{activeAlumni.last_name.charAt(0).toUpperCase()}
                    </span>
                    <div className="alumni-detail-head-text">
                      <h3>
                        {activeAlumni.first_name} {activeAlumni.last_name}
                        {!readIds.has(activeAlumni.id) && <span className="alumni-new-badge">NEW</span>}
                      </h3>
                      <a href={`mailto:${activeAlumni.email}`} className="alumni-detail-email">{activeAlumni.email}</a>
                    </div>
                  </div>

                  <div className="alumni-detail-infogrid">
                    <div className="alumni-info-box">
                      <span className="alumni-info-label">Company</span>
                      <span className="alumni-info-value">{activeAlumni.company}</span>
                    </div>
                    <div className="alumni-info-box">
                      <span className="alumni-info-label">Position</span>
                      <span className="alumni-info-value">{activeAlumni.designation}</span>
                    </div>
                    <div className="alumni-info-box">
                      <span className="alumni-info-label">Tenure</span>
                      <span className="alumni-info-value">{activeAlumni.tenure}</span>
                    </div>
                    <div className="alumni-info-box">
                      <span className="alumni-info-label">Last Role</span>
                      <span className="alumni-info-value">{activeAlumni.last_role}</span>
                    </div>
                    {activeAlumni.phone && (
                      <div className="alumni-info-box">
                        <span className="alumni-info-label">Phone</span>
                        <span className="alumni-info-value">{activeAlumni.phone}</span>
                      </div>
                    )}
                    <div className="alumni-info-box">
                      <span className="alumni-info-label">Registered</span>
                      <span className="alumni-info-value">{formatTimeAgo(activeAlumni.created_at)}</span>
                    </div>
                  </div>

                  {activeAlumni.message && (
                    <div className="alumni-detail-message">
                      <span className="alumni-info-label">Message</span>
                      <p>{activeAlumni.message}</p>
                    </div>
                  )}

                  <div className="alumni-detail-actions">
                    <button
                      className="alumni-btn alumni-btn-primary"
                      onClick={() => window.open(`mailto:${activeAlumni.email}`, '_blank')}
                    >
                      ✉ Send email
                    </button>
                    {activeAlumni.phone && (
                      <button
                        className="alumni-btn alumni-btn-outline"
                        onClick={() => window.open(`tel:${activeAlumni.phone}`, '_blank')}
                      >
                        📞 Call
                      </button>
                    )}
                    {!readIds.has(activeAlumni.id) && (
                      <button
                        className="alumni-btn alumni-btn-outline"
                        onClick={() => markAsRead(activeAlumni.id)}
                      >
                        ✓ Mark as read
                      </button>
                    )}
                  </div>

                  <p className="alumni-detail-footnote">
                    Registered on {new Date(activeAlumni.created_at).toLocaleDateString('en-US', {
                      timeZone: IST_TIME_ZONE,
                      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                    })} IST
                  </p>
                </>
              ) : (
                <div className="alumni-detail-placeholder">
                  <div className="empty-icon">🎓</div>
                  <p>Select a registration from the inbox to view its details.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAlumni;