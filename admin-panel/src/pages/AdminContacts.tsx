import React, { useMemo, useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './AdminContacts.css';

// All admin-facing timestamps are shown in Indian Standard Time regardless
// of the viewer's own machine/browser timezone, since the team reviewing
// these submissions is based in India.
const IST_TIME_ZONE = 'Asia/Kolkata';
const istDateKey = (d: Date) => d.toLocaleDateString('en-CA', { timeZone: IST_TIME_ZONE });

interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  message: string;
  created_at: string;
}

const AdminContacts: React.FC = () => {
  const { token } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'read'>('all');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  // "Read" is a view-only affordance (which submissions this admin has opened
  // this session) — Contact has no persisted read/resolved field, so this
  // never touches the backend and resets on refresh, same as the rest of
  // this page's client-side state.
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string

  // Fetch contacts
  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/admin/contacts`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setContacts(data);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
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
      total: contacts.length,
      today: contacts.filter((c) => istDateKey(new Date(c.created_at)) === todayKey).length,
      thisWeek: contacts.filter((c) => new Date(c.created_at).getTime() >= weekAgo).length,
    };
  }, [contacts]);

  const newCount = contacts.filter((c) => !readIds.has(c.id)).length;

  const markAsRead = (id: string) => {
    setReadIds((prev) => (prev.has(id) ? prev : new Set(prev).add(id)));
  };

  const openContact = (contact: Contact) => {
    setSelectedContact(contact);
    markAsRead(contact.id);
  };

  // Filter contacts based on search
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contact.company && contact.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (contact.service && contact.service.toLowerCase().includes(searchTerm.toLowerCase()));
    const isRead = readIds.has(contact.id);
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'new' && !isRead) ||
      (statusFilter === 'read' && isRead);
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const paginatedContacts = filteredContacts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const totalPages = Math.ceil(filteredContacts.length / rowsPerPage);

  const activeContact = selectedContact && contacts.some(c => c.id === selectedContact.id)
    ? (contacts.find(c => c.id === selectedContact.id) as Contact)
    : null;

  return (
    <div className="contacts-container">
      {/* Header */}
      <div className="contacts-header">
        <div>
          <p className="contacts-eyebrow">Communications</p>
          <h1 className="contacts-title">Contact submissions</h1>
          <p className="contacts-subtitle">
            Review enquiries and keep every conversation moving.
          </p>
        </div>
        <span className="contacts-inbox-pill">
          <span className="contacts-inbox-dot" /> Inbox active
        </span>
      </div>

      {/* Stats */}
      <div className="contacts-stats-row">
        <div className="contacts-stat-card">
          <p className="contacts-stat-label">Total Submissions</p>
          <p className="contacts-stat-value">{stats.total}</p>
          <p className="contacts-stat-sub">All website enquiries</p>
        </div>
        <div className="contacts-stat-card">
          <p className="contacts-stat-label">New Messages</p>
          <p className="contacts-stat-value">{newCount}</p>
          <p className="contacts-stat-sub">Needs attention</p>
        </div>
        <div className="contacts-stat-card">
          <p className="contacts-stat-label">Today</p>
          <p className="contacts-stat-value">{stats.today}</p>
          <p className="contacts-stat-sub">{stats.today === 0 ? 'No new submissions' : 'Received today'}</p>
        </div>
        <div className="contacts-stat-card">
          <p className="contacts-stat-label">This Week</p>
          <p className="contacts-stat-value">{stats.thisWeek}</p>
          <p className="contacts-stat-sub">Last 7 days</p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="contacts-action-bar">
        <div className="contacts-search">
          <input
            type="text"
            placeholder="Search people, email or company"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="contacts-filter-tabs">
          <button className={statusFilter === 'all' ? 'active' : ''} onClick={() => setStatusFilter('all')}>All</button>
          <button className={statusFilter === 'new' ? 'active' : ''} onClick={() => setStatusFilter('new')}>New</button>
          <button className={statusFilter === 'read' ? 'active' : ''} onClick={() => setStatusFilter('read')}>Read</button>
        </div>

        <button
          className="contacts-btn contacts-btn-icon icon-refresh"
          onClick={fetchContacts}
          title="Refresh"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Main Content */}
      <div className="contacts-main-card">
        {loading ? (
          <div className="contacts-loading">
            <div className="contacts-spinner"></div>
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="contacts-empty">
            <div className="empty-icon">📧</div>
            <h3>No contact submissions found</h3>
            <p>Contact form submissions will appear here when users submit the form on your website.</p>
          </div>
        ) : (
          <div className="contacts-inbox-layout">
            {/* Left: submissions list */}
            <div className="contacts-inbox-list">
              <div className="contacts-inbox-list-header">
                <span>Inbox</span>
                <span className="contacts-inbox-list-controls">
                  <span className="contacts-inbox-list-count">{filteredContacts.length} submissions</span>
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
              <div className="contacts-inbox-list-scroll">
                {paginatedContacts.map((contact) => {
                  const isRead = readIds.has(contact.id);
                  const isActive = activeContact?.id === contact.id;
                  return (
                    <button
                      key={contact.id}
                      className={`contacts-inbox-item ${isActive ? 'active' : ''}`}
                      onClick={() => openContact(contact)}
                    >
                      <span className="contact-avatar">{contact.name.charAt(0).toUpperCase()}</span>
                      <span className="contacts-inbox-item-body">
                        <span className="contacts-inbox-item-top">
                          <span className="contacts-inbox-item-name">{contact.name}</span>
                          <span className="contacts-inbox-item-time">{formatTimeAgo(contact.created_at)}</span>
                        </span>
                        <span className="contacts-inbox-item-preview">
                          {contact.service || contact.message}
                        </span>
                        <span className="contacts-inbox-item-email">{contact.email}</span>
                      </span>
                      {!isRead && <span className="contacts-inbox-item-dot" />}
                    </button>
                  );
                })}
              </div>
              {totalPages > 1 && (
                <div className="contacts-pagination">
                  <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}>← Prev</button>
                  <span>Page {page + 1} of {totalPages}</span>
                  <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1}>Next →</button>
                </div>
              )}
            </div>

            {/* Right: detail pane */}
            <div className="contacts-inbox-detail">
              {activeContact ? (
                <>
                  <div className="contacts-detail-head">
                    <span className="contact-avatar large">{activeContact.name.charAt(0).toUpperCase()}</span>
                    <div className="contacts-detail-head-text">
                      <h3>
                        {activeContact.name}
                        {!readIds.has(activeContact.id) && <span className="contacts-new-badge">NEW</span>}
                      </h3>
                      <a href={`mailto:${activeContact.email}`} className="contacts-detail-email">{activeContact.email}</a>
                    </div>
                  </div>

                  <div className="contacts-detail-infogrid">
                    {activeContact.company && (
                      <div className="contacts-info-box">
                        <span className="contacts-info-label">Company</span>
                        <span className="contacts-info-value">{activeContact.company}</span>
                      </div>
                    )}
                    {activeContact.phone && (
                      <div className="contacts-info-box">
                        <span className="contacts-info-label">Phone</span>
                        <span className="contacts-info-value">{activeContact.phone}</span>
                      </div>
                    )}
                    <div className="contacts-info-box">
                      <span className="contacts-info-label">Received</span>
                      <span className="contacts-info-value">{formatTimeAgo(activeContact.created_at)}</span>
                    </div>
                  </div>

                  {activeContact.service && (
                    <div className="contacts-detail-subject">
                      <span className="contacts-info-label">Subject</span>
                      <p>{activeContact.service}</p>
                    </div>
                  )}

                  <div className="contacts-detail-message">
                    <p>{activeContact.message}</p>
                  </div>

                  <div className="contacts-detail-actions">
                    <button
                      className="contacts-btn contacts-btn-primary"
                      onClick={() => window.open(`mailto:${activeContact.email}`, '_blank')}
                    >
                      ✉ Reply by email
                    </button>
                    {activeContact.phone && (
                      <button
                        className="contacts-btn contacts-btn-outline"
                        onClick={() => window.open(`tel:${activeContact.phone}`, '_blank')}
                      >
                        📞 Call
                      </button>
                    )}
                    {!readIds.has(activeContact.id) && (
                      <button
                        className="contacts-btn contacts-btn-outline"
                        onClick={() => markAsRead(activeContact.id)}
                      >
                        ✓ Mark as read
                      </button>
                    )}
                  </div>

                  <p className="contacts-detail-footnote">
                    Submitted on {new Date(activeContact.created_at).toLocaleDateString('en-US', {
                      timeZone: IST_TIME_ZONE,
                      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                    })} IST
                  </p>
                </>
              ) : (
                <div className="contacts-detail-placeholder">
                  <div className="empty-icon">📥</div>
                  <p>Select a submission from the inbox to view its details.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminContacts;