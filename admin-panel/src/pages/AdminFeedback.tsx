import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Star as StarIcon,
  ThumbUp as ThumbUpIcon,
  SentimentSatisfied as SentimentSatisfiedIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import './AdminFeedback.css';

interface Reference {
  company_name: string;
  name_designation: string;
  phone: string;
  email: string;
}

interface Feedback {
  id: string;
  client_name: string;
  nature_of_assignment: string;
  period_of_assignment: string;
  assignment_reporting: string;
  assignment_spoc: string;
  
  onboarding_reason: number;
  competitive_fees: number;
  technically_better: number;
  referred_by_someone: number;
  
  value_for_money: number;
  reasonable: number;
  
  delivery: number;
  status_review: number;
  draft_discussions: number;
  reporting: number;
  timelines: number;
  
  project_team: number;
  response_time: number;
  
  overall: number;
  meet_service_objectives: number;
  knowledge: number;
  research_publications: number;
  
  would_refer: string;
  delighted_by_service: string;
  
  references: Reference[];
  testimonial: string;
  
  name: string;
  designation: string;
  created_at: string;
}

const AdminFeedback: React.FC = () => {
  const { token } = useAuth();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [showModal, setShowModal] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string
  console.log("API Base URL", API_BASE_URL)

  // Fetch feedbacks
  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/feedback/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setFeedbacks(data);
      }
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  // Calculate average rating
  const calculateAverageRating = (feedback: Feedback) => {
    const ratings = [
      feedback.onboarding_reason,
      feedback.competitive_fees,
      feedback.technically_better,
      feedback.referred_by_someone,
      feedback.value_for_money,
      feedback.reasonable,
      feedback.delivery,
      feedback.status_review,
      feedback.draft_discussions,
      feedback.reporting,
      feedback.timelines,
      feedback.project_team,
      feedback.response_time,
      feedback.overall,
      feedback.meet_service_objectives,
      feedback.knowledge,
      feedback.research_publications,
    ];
    const validRatings = ratings.filter(r => r > 0);
    return validRatings.length > 0 
      ? (validRatings.reduce((a, b) => a + b, 0) / validRatings.length).toFixed(1)
      : '0';
  };

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

  // Delete feedback
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/feedback/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setFeedbacks(feedbacks.filter(f => f.id !== id));
        alert('Feedback deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting feedback:', error);
      alert('Failed to delete feedback');
    }
  };

  // View feedback details
  const handleView = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setShowModal(true);
  };

  // Filter feedbacks based on search
  const filteredFeedbacks = feedbacks.filter(feedback =>
    feedback.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    feedback.nature_of_assignment.toLowerCase().includes(searchTerm.toLowerCase()) ||
    feedback.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const paginatedFeedbacks = filteredFeedbacks.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const totalPages = Math.ceil(filteredFeedbacks.length / rowsPerPage);

  // Calculate stats
  const totalFeedbacks = feedbacks.length;
  const wouldReferCount = feedbacks.filter(f => f.would_refer === 'Yes').length;
  const delightedCount = feedbacks.filter(f => f.delighted_by_service === 'Yes').length;
  const avgRating = feedbacks.length > 0
    ? (feedbacks.reduce((sum, f) => sum + parseFloat(calculateAverageRating(f)), 0) / feedbacks.length).toFixed(1)
    : '0';

  // Render stars
  const renderStars = (rating: number) => {
    return (
      <div className="star-display">
        {[1, 2, 3, 4, 5].map(star => (
          <span key={star} className={star <= rating ? 'star filled' : 'star'}>
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="feedback-container">
      {/* Header */}
      <div className="feedback-header">
        <h1 className="feedback-title">Client Feedback</h1>
        <p className="feedback-subtitle">
          View and manage client feedback submissions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="feedback-stats-grid">
        <div className="stat-card stat-blue">
          <div className="stat-icon">
            <StarIcon sx={{ fontSize: 28, color: 'white' }} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{totalFeedbacks}</div>
            <div className="stat-label">Total Feedbacks</div>
          </div>
        </div>
        
        <div className="stat-card stat-green">
          <div className="stat-icon">
            <ThumbUpIcon sx={{ fontSize: 28, color: 'white' }} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{wouldReferCount}</div>
            <div className="stat-label">Would Refer</div>
          </div>
        </div>
        
        <div className="stat-card stat-pink">
          <div className="stat-icon">
            <SentimentSatisfiedIcon sx={{ fontSize: 28, color: 'white' }} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{delightedCount}</div>
            <div className="stat-label">Delighted Clients</div>
          </div>
        </div>
        
        <div className="stat-card stat-orange">
          <div className="stat-icon">
            <StarIcon sx={{ fontSize: 28, color: 'white' }} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{avgRating}</div>
            <div className="stat-label">Avg Rating</div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="feedback-action-bar">
        <div className="feedback-search">
          <input
            type="text"
            placeholder="Search feedbacks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="feedback-actions">
          <button 
            className="feedback-btn feedback-btn-icon icon-refresh"
            onClick={fetchFeedbacks}
            title="Refresh"
          >
            <RefreshIcon sx={{ fontSize: 20 }} />
          </button>
          
          <div className="feedback-stats-count">
            <span className="feedback-count">{filteredFeedbacks.length} feedbacks</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="feedback-main-card">
        <div className="feedback-gradient-header">
          <div className="feedback-header-content">
            <div className="feedback-header-avatar">
              <StarIcon sx={{ fontSize: 24, color: 'white' }} />
            </div>
            <div className="feedback-header-text">
              <h3>Feedback Submissions</h3>
              <p>{filteredFeedbacks.length} total submissions</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="feedback-loading">
            <div className="feedback-spinner"></div>
          </div>
        ) : (
          <>
            {/* Cards Grid */}
            <div className="feedback-cards-grid">
              {paginatedFeedbacks.map((feedback) => (
                <div key={feedback.id} className="feedback-card">
                  <div className="feedback-card-header">
                    <div className="feedback-avatar">
                      {feedback.client_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="feedback-info">
                      <h4 className="feedback-client-name">{feedback.client_name}</h4>
                      <p className="feedback-assignment">{feedback.nature_of_assignment}</p>
                    </div>
                    <div className="feedback-time">
                      <span className="time-badge">
                        {formatTimeAgo(feedback.created_at)}
                      </span>
                    </div>
                  </div>

                  <div className="feedback-card-body">
                    <div className="feedback-rating-row">
                      <span className="rating-label">Overall Rating:</span>
                      {renderStars(feedback.overall)}
                      <span className="rating-value">{calculateAverageRating(feedback)}/5</span>
                    </div>

                    <div className="feedback-detail">
                      <span className="detail-label">Submitted by:</span>
                      <span className="detail-value">{feedback.name} ({feedback.designation})</span>
                    </div>

                    {feedback.period_of_assignment && (
                      <div className="feedback-detail">
                        <span className="detail-label">Period:</span>
                        <span className="detail-value">{feedback.period_of_assignment}</span>
                      </div>
                    )}

                    <div className="feedback-badges">
                      {feedback.would_refer === 'Yes' && (
                        <span className="badge badge-success">Would Refer ✓</span>
                      )}
                      {feedback.delighted_by_service === 'Yes' && (
                        <span className="badge badge-info">Delighted ✓</span>
                      )}
                    </div>

                    {feedback.testimonial && (
                      <div className="feedback-testimonial">
                        <span className="detail-label">Testimonial:</span>
                        <p className="testimonial-text">
                          {feedback.testimonial.length > 150 
                            ? feedback.testimonial.substring(0, 150) + '...' 
                            : feedback.testimonial}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="feedback-card-footer">
                    <div className="feedback-date">
                      Submitted on {new Date(feedback.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="feedback-actions-btns">
                      <button 
                        className="feedback-action-btn view"
                        onClick={() => handleView(feedback)}
                        title="View Details"
                      >
                        <VisibilityIcon sx={{ fontSize: 16 }} />
                      </button>
                      <button 
                        className="feedback-action-btn delete"
                        onClick={() => handleDelete(feedback.id)}
                        title="Delete"
                      >
                        <DeleteIcon sx={{ fontSize: 16 }} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredFeedbacks.length === 0 && !loading && (
              <div className="feedback-empty">
                <div className="empty-icon">
                  <StarIcon sx={{ fontSize: 64, color: '#cbd5e1' }} />
                </div>
                <h3>No feedback submissions found</h3>
                <p>Client feedback submissions will appear here when users submit the feedback form on your website.</p>
              </div>
            )}

            {/* Pagination */}
            {filteredFeedbacks.length > 0 && (
              <div className="feedback-pagination">
                <div>
                  Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, filteredFeedbacks.length)} of {filteredFeedbacks.length} feedbacks
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

      {/* Modal for viewing details */}
      {showModal && selectedFeedback && (
        <div className="feedback-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="feedback-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Feedback Details</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <CloseIcon sx={{ fontSize: 20 }} />
              </button>
            </div>
            
            <div className="modal-body">
              {/* Basic Info */}
              <section className="modal-section">
                <h3>Basic Information</h3>
                <div className="modal-grid">
                  <div className="modal-field">
                    <label>Client Name:</label>
                    <span>{selectedFeedback.client_name}</span>
                  </div>
                  <div className="modal-field">
                    <label>Nature of Assignment:</label>
                    <span>{selectedFeedback.nature_of_assignment}</span>
                  </div>
                  <div className="modal-field">
                    <label>Period:</label>
                    <span>{selectedFeedback.period_of_assignment || 'N/A'}</span>
                  </div>
                  <div className="modal-field">
                    <label>Assignment SPOC:</label>
                    <span>{selectedFeedback.assignment_spoc || 'N/A'}</span>
                  </div>
                </div>
              </section>

              {/* Ratings */}
              <section className="modal-section">
                <h3>Ratings Overview</h3>
                <div className="ratings-grid">
                  <div className="rating-item">
                    <label>Overall:</label>
                    {renderStars(selectedFeedback.overall)}
                  </div>
                  <div className="rating-item">
                    <label>Service Objectives:</label>
                    {renderStars(selectedFeedback.meet_service_objectives)}
                  </div>
                  <div className="rating-item">
                    <label>Knowledge:</label>
                    {renderStars(selectedFeedback.knowledge)}
                  </div>
                  <div className="rating-item">
                    <label>Communication:</label>
                    {renderStars(selectedFeedback.project_team)}
                  </div>
                  <div className="rating-item">
                    <label>Delivery:</label>
                    {renderStars(selectedFeedback.delivery)}
                  </div>
                  <div className="rating-item">
                    <label>Response Time:</label>
                    {renderStars(selectedFeedback.response_time)}
                  </div>
                </div>
              </section>

              {/* Testimonial */}
              {selectedFeedback.testimonial && (
                <section className="modal-section">
                  <h3>Testimonial</h3>
                  <div className="testimonial-box">
                    "{selectedFeedback.testimonial}"
                  </div>
                </section>
              )}

              {/* References */}
              {selectedFeedback.references && selectedFeedback.references.length > 0 && selectedFeedback.references[0].company_name && (
                <section className="modal-section">
                  <h3>References</h3>
                  {selectedFeedback.references.map((ref, idx) => (
                    ref.company_name && (
                      <div key={idx} className="reference-box">
                        <p><strong>Company:</strong> {ref.company_name}</p>
                        <p><strong>Contact:</strong> {ref.name_designation}</p>
                        <p><strong>Phone:</strong> {ref.phone}</p>
                        <p><strong>Email:</strong> {ref.email}</p>
                      </div>
                    )
                  ))}
                </section>
              )}

              {/* Submitted By */}
              <section className="modal-section">
                <h3>Submitted By</h3>
                <div className="modal-grid">
                  <div className="modal-field">
                    <label>Name:</label>
                    <span>{selectedFeedback.name}</span>
                  </div>
                  <div className="modal-field">
                    <label>Designation:</label>
                    <span>{selectedFeedback.designation}</span>
                  </div>
                  <div className="modal-field">
                    <label>Submitted on:</label>
                    <span>{new Date(selectedFeedback.created_at).toLocaleString()}</span>
                  </div>
                </div>
              </section>
            </div>

            <div className="modal-footer">
              <button className="modal-btn modal-btn-close" onClick={() => setShowModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFeedback;
