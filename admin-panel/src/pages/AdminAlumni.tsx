import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './AdminAlumni.css';

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

  // const API_BASE = 'http://localhost:8000';
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string
  console.log("API Base URL", API_BASE_URL)

  // Fetch alumni
  const fetchAlumni = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/admin/alumni/`, {
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

  // Filter alumni based on search
  const filteredAlumni = alumni.filter(person =>
    person.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.designation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const paginatedAlumni = filteredAlumni.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const totalPages = Math.ceil(filteredAlumni.length / rowsPerPage);

  return (
    <div className="alumni-container">
      {/* Header */}
      <div className="alumni-header">
        <h1 className="alumni-title">Alumni Network</h1>
        <p className="alumni-subtitle">
          View and manage alumni registrations from your website
        </p>
      </div>

      {/* Action Bar */}
      <div className="alumni-action-bar">
        <div className="alumni-search">
          <input
            type="text"
            placeholder="Search alumni..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="alumni-actions">
          <button 
            className="alumni-btn alumni-btn-icon icon-refresh"
            onClick={fetchAlumni}
            title="Refresh"
          >
          </button>
          
          <div className="alumni-stats">
            <span className="alumni-count">{filteredAlumni.length} alumni</span>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="alumni-main-card">
        <div className="alumni-gradient-header">
          <div className="alumni-header-content">
            <div className="alumni-header-avatar">
            </div>
            <div className="alumni-header-text">
              <h3>Alumni Network</h3>
              <p>{filteredAlumni.length} total registrations</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="alumni-loading">
            <div className="alumni-spinner"></div>
          </div>
        ) : (
          <>
            {/* Cards Grid */}
            <div className="alumni-cards-grid">
              {paginatedAlumni.map((person) => (
                <div key={person.id} className="alumni-card">
                  <div className="alumni-card-header">
                    <div className="alumni-avatar">
                      {person.first_name.charAt(0).toUpperCase()}{person.last_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="alumni-info">
                      <h4 className="alumni-name">{person.first_name} {person.last_name}</h4>
                      <p className="alumni-email">{person.email}</p>
                    </div>
                    <div className="alumni-time">
                      <span className="time-badge">
                        {formatTimeAgo(person.created_at)}
                      </span>
                    </div>
                  </div>

                  <div className="alumni-card-body">
                    <div className="alumni-detail">
                      <span className="detail-label">Company:</span>
                      <span className="detail-value">{person.company}</span>
                    </div>
                    
                    <div className="alumni-detail">
                      <span className="detail-label">Position:</span>
                      <span className="detail-value">{person.designation}</span>
                    </div>
                    
                    <div className="alumni-detail">
                      <span className="detail-label">Tenure:</span>
                      <span className="detail-value">{person.tenure}</span>
                    </div>

                    <div className="alumni-detail">
                      <span className="detail-label">Last Role:</span>
                      <span className="detail-value">{person.last_role}</span>
                    </div>
                    
                    {person.phone && (
                      <div className="alumni-detail">
                        <span className="detail-label">Phone:</span>
                        <span className="detail-value">{person.phone}</span>
                      </div>
                    )}

                    {person.message && (
                      <div className="alumni-message">
                        <span className="detail-label">Message:</span>
                        <p className="message-text">{person.message}</p>
                      </div>
                    )}
                  </div>

                  <div className="alumni-card-footer">
                    <div className="alumni-date">
                      Registered on {new Date(person.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                    <div className="alumni-actions">
                      <button 
                        className="alumni-action-btn reply"
                        onClick={() => window.open(`mailto:${person.email}`, '_blank')}
                        title="Send Email"
                      >
                        ✉
                      </button>
                      {person.phone && (
                        <button 
                          className="alumni-action-btn call"
                          onClick={() => window.open(`tel:${person.phone}`, '_blank')}
                          title="Call"
                        >
                          📞
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Empty State */}
            {filteredAlumni.length === 0 && !loading && (
              <div className="alumni-empty">
                <div className="empty-icon">🎓</div>
                <h3>No alumni registrations found</h3>
                <p>Alumni registrations will appear here when users submit the alumni form on your website.</p>
              </div>
            )}

            {/* Pagination */}
            {filteredAlumni.length > 0 && (
              <div className="alumni-pagination">
                <div>
                  Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, filteredAlumni.length)} of {filteredAlumni.length} alumni
                </div>
                <div>
                  <select 
                    value={rowsPerPage} 
                    onChange={(e) => {
                      setRowsPerPage(parseInt(e.target.value));
                      setPage(0);
                    }}
                  >
                    <option value={6}>6 per page</option>
                    <option value={12}>12 per page</option>
                    <option value={24}>24 per page</option>
                  </select>
                  <button 
                    onClick={() => setPage(Math.max(0, page - 1))}
                    disabled={page === 0}
                  >
                    ← Previous
                  </button>
                  <span>Page {page + 1} of {totalPages}</span>
                  <button 
                    onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                    disabled={page >= totalPages - 1}
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminAlumni;