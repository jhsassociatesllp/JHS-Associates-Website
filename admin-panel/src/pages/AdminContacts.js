import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './AdminContacts.css';
const AdminContacts = () => {
    const { token } = useAuth();
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(12);
    const [searchTerm, setSearchTerm] = useState('');
    const API_BASE = 'http://localhost:8000';
    // Fetch contacts
    const fetchContacts = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE}/admin/contacts`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const data = await response.json();
                setContacts(data);
            }
        }
        catch (error) {
            console.error('Error fetching contacts:', error);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchContacts();
    }, []);
    // Format time ago helper
    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
        if (diffInHours < 1)
            return 'Just now';
        if (diffInHours < 24)
            return `${diffInHours} hours ago`;
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7)
            return `${diffInDays} days ago`;
        const diffInWeeks = Math.floor(diffInDays / 7);
        if (diffInWeeks < 4)
            return `${diffInWeeks} weeks ago`;
        const diffInMonths = Math.floor(diffInDays / 30);
        return `${diffInMonths} months ago`;
    };
    // Filter contacts based on search
    const filteredContacts = contacts.filter(contact => contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (contact.company && contact.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (contact.service && contact.service.toLowerCase().includes(searchTerm.toLowerCase())));
    // Pagination
    const paginatedContacts = filteredContacts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    const totalPages = Math.ceil(filteredContacts.length / rowsPerPage);
    return (<div className="contacts-container">
      {/* Header */}
      <div className="contacts-header">
        <h1 className="contacts-title">Contact Submissions</h1>
        <p className="contacts-subtitle">
          View and manage contact form submissions from your website
        </p>
      </div>

      {/* Action Bar */}
      <div className="contacts-action-bar">
        <div className="contacts-search">
          <input type="text" placeholder="Search contacts..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
        </div>
        
        <div className="contacts-actions">
          <button className="contacts-btn contacts-btn-icon icon-refresh" onClick={fetchContacts} title="Refresh">
          </button>
          
          <div className="contacts-stats">
            <span className="contacts-count">{filteredContacts.length} contacts</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="contacts-main-card">
        <div className="contacts-gradient-header">
          <div className="contacts-header-content">
            <div className="contacts-header-avatar">
            </div>
            <div className="contacts-header-text">
              <h3>Contact Submissions</h3>
              <p>{filteredContacts.length} total submissions</p>
            </div>
          </div>
        </div>

        {loading ? (<div className="contacts-loading">
            <div className="contacts-spinner"></div>
          </div>) : (<>
            {/* Cards Grid */}
            <div className="contacts-cards-grid">
              {paginatedContacts.map((contact) => (<div key={contact.id} className="contact-card">
                  <div className="contact-card-header">
                    <div className="contact-avatar">
                      {contact.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="contact-info">
                      <h4 className="contact-name">{contact.name}</h4>
                      <p className="contact-email">{contact.email}</p>
                    </div>
                    <div className="contact-time">
                      <span className="time-badge">
                        {formatTimeAgo(contact.created_at)}
                      </span>
                    </div>
                  </div>

                  <div className="contact-card-body">
                    {contact.company && (<div className="contact-detail">
                        <span className="detail-label">Company:</span>
                        <span className="detail-value">{contact.company}</span>
                      </div>)}
                    
                    {contact.phone && (<div className="contact-detail">
                        <span className="detail-label">Phone:</span>
                        <span className="detail-value">{contact.phone}</span>
                      </div>)}
                    
                    {contact.service && (<div className="contact-detail">
                        <span className="detail-label">Service:</span>
                        <span className="detail-value">{contact.service}</span>
                      </div>)}

                    <div className="contact-message">
                      <span className="detail-label">Message:</span>
                      <p className="message-text">{contact.message}</p>
                    </div>
                  </div>

                  <div className="contact-card-footer">
                    <div className="contact-date">
                      Submitted on {new Date(contact.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })}
                    </div>
                    <div className="contact-actions">
                      <button className="contact-action-btn reply" onClick={() => window.open(`mailto:${contact.email}`, '_blank')} title="Reply via Email">
                        ✉
                      </button>
                      {contact.phone && (<button className="contact-action-btn call" onClick={() => window.open(`tel:${contact.phone}`, '_blank')} title="Call">
                          📞
                        </button>)}
                    </div>
                  </div>
                </div>))}
            </div>

            {/* Empty State */}
            {filteredContacts.length === 0 && !loading && (<div className="contacts-empty">
                <div className="empty-icon">📧</div>
                <h3>No contact submissions found</h3>
                <p>Contact form submissions will appear here when users submit the form on your website.</p>
              </div>)}

            {/* Pagination */}
            {filteredContacts.length > 0 && (<div className="contacts-pagination">
                <div>
                  Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, filteredContacts.length)} of {filteredContacts.length} contacts
                </div>
                <div>
                  <select value={rowsPerPage} onChange={(e) => {
                    setRowsPerPage(parseInt(e.target.value));
                    setPage(0);
                }}>
                    <option value={6}>6 per page</option>
                    <option value={12}>12 per page</option>
                    <option value={24}>24 per page</option>
                  </select>
                  <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}>
                    ← Previous
                  </button>
                  <span>Page {page + 1} of {totalPages}</span>
                  <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1}>
                    Next →
                  </button>
                </div>
              </div>)}
          </>)}
      </div>
    </div>);
};
export default AdminContacts;
