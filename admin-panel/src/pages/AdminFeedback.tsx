import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Star as StarIcon,
  ThumbUp as ThumbUpIcon,
  SentimentSatisfied as SentimentSatisfiedIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
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

  const activeFeedback = showModal ? selectedFeedback : null;

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
        <div>
          <p className="feedback-eyebrow">Communications</p>
          <h1 className="feedback-title">Client feedback</h1>
          <p className="feedback-subtitle">
            Review client satisfaction submissions and testimonials.
          </p>
        </div>
        <span className="feedback-inbox-pill">
          <span className="feedback-inbox-dot" /> Inbox active
        </span>
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
            placeholder="Search by client, assignment or submitter"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button
          className="feedback-btn feedback-btn-icon icon-refresh"
          onClick={fetchFeedbacks}
          title="Refresh"
        >
          <RefreshIcon sx={{ fontSize: 20 }} />
        </button>
      </div>

      {/* Main Content */}
      <div className="feedback-main-card">
        {loading ? (
          <div className="feedback-loading">
            <div className="feedback-spinner"></div>
          </div>
        ) : filteredFeedbacks.length === 0 ? (
          <div className="feedback-empty">
            <div className="empty-icon">
              <StarIcon sx={{ fontSize: 64, color: '#cbd5e1' }} />
            </div>
            <h3>No feedback submissions found</h3>
            <p>Client feedback submissions will appear here when users submit the feedback form on your website.</p>
          </div>
        ) : (
          <div className="feedback-inbox-layout">
            {/* Left: submissions list */}
            <div className="feedback-inbox-list">
              <div className="feedback-inbox-list-header">
                <span>Inbox</span>
                <span className="feedback-inbox-list-controls">
                  <span className="feedback-inbox-list-count">{filteredFeedbacks.length} submissions</span>
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
              <div className="feedback-inbox-list-scroll">
                {paginatedFeedbacks.map((feedback) => {
                  const isActive = activeFeedback?.id === feedback.id;
                  return (
                    <button
                      key={feedback.id}
                      className={`feedback-inbox-item ${isActive ? 'active' : ''}`}
                      onClick={() => handleView(feedback)}
                    >
                      <span className="feedback-avatar">{feedback.client_name.charAt(0).toUpperCase()}</span>
                      <span className="feedback-inbox-item-body">
                        <span className="feedback-inbox-item-top">
                          <span className="feedback-inbox-item-name">{feedback.client_name}</span>
                          <span className="feedback-inbox-item-time">{formatTimeAgo(feedback.created_at)}</span>
                        </span>
                        <span className="feedback-inbox-item-preview">{feedback.nature_of_assignment}</span>
                        <span className="feedback-inbox-item-rating">{renderStars(feedback.overall)} {calculateAverageRating(feedback)}/5</span>
                      </span>
                    </button>
                  );
                })}
              </div>
              {totalPages > 1 && (
                <div className="feedback-pagination">
                  <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}>← Prev</button>
                  <span>Page {page + 1} of {totalPages}</span>
                  <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1}>Next →</button>
                </div>
              )}
            </div>

            {/* Right: detail pane */}
            <div className="feedback-inbox-detail">
              {activeFeedback ? (
                <>
                  <div className="feedback-detail-head">
                    <span className="feedback-avatar large">{activeFeedback.client_name.charAt(0).toUpperCase()}</span>
                    <div className="feedback-detail-head-text">
                      <h3>{activeFeedback.client_name}</h3>
                      <p>{activeFeedback.nature_of_assignment}</p>
                    </div>
                    <button
                      className="feedback-btn feedback-btn-outline feedback-delete-btn"
                      onClick={() => handleDelete(activeFeedback.id)}
                      title="Delete this feedback"
                    >
                      <DeleteIcon sx={{ fontSize: 16 }} /> Delete
                    </button>
                  </div>

                  <div className="feedback-detail-infogrid">
                    <div className="feedback-info-box">
                      <span className="feedback-info-label">Period</span>
                      <span className="feedback-info-value">{activeFeedback.period_of_assignment || 'N/A'}</span>
                    </div>
                    <div className="feedback-info-box">
                      <span className="feedback-info-label">Assignment SPOC</span>
                      <span className="feedback-info-value">{activeFeedback.assignment_spoc || 'N/A'}</span>
                    </div>
                    <div className="feedback-info-box">
                      <span className="feedback-info-label">Overall Rating</span>
                      <span className="feedback-info-value">{calculateAverageRating(activeFeedback)}/5</span>
                    </div>
                  </div>

                  <div className="feedback-badges">
                    {activeFeedback.would_refer === 'Yes' && (
                      <span className="badge badge-success">Would Refer ✓</span>
                    )}
                    {activeFeedback.delighted_by_service === 'Yes' && (
                      <span className="badge badge-info">Delighted ✓</span>
                    )}
                  </div>

                  <section className="feedback-detail-section">
                    <h4>Ratings Overview</h4>
                    <div className="ratings-grid">
                      <div className="rating-item">
                        <label>Overall:</label>
                        {renderStars(activeFeedback.overall)}
                      </div>
                      <div className="rating-item">
                        <label>Service Objectives:</label>
                        {renderStars(activeFeedback.meet_service_objectives)}
                      </div>
                      <div className="rating-item">
                        <label>Knowledge:</label>
                        {renderStars(activeFeedback.knowledge)}
                      </div>
                      <div className="rating-item">
                        <label>Communication:</label>
                        {renderStars(activeFeedback.project_team)}
                      </div>
                      <div className="rating-item">
                        <label>Delivery:</label>
                        {renderStars(activeFeedback.delivery)}
                      </div>
                      <div className="rating-item">
                        <label>Response Time:</label>
                        {renderStars(activeFeedback.response_time)}
                      </div>
                    </div>
                  </section>

                  {activeFeedback.testimonial && (
                    <section className="feedback-detail-section">
                      <h4>Testimonial</h4>
                      <div className="testimonial-box">
                        "{activeFeedback.testimonial}"
                      </div>
                    </section>
                  )}

                  {activeFeedback.references && activeFeedback.references.length > 0 && activeFeedback.references[0].company_name && (
                    <section className="feedback-detail-section">
                      <h4>References</h4>
                      {activeFeedback.references.map((ref, idx) => (
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

                  <section className="feedback-detail-section">
                    <h4>Submitted By</h4>
                    <div className="feedback-detail-infogrid">
                      <div className="feedback-info-box">
                        <span className="feedback-info-label">Name</span>
                        <span className="feedback-info-value">{activeFeedback.name}</span>
                      </div>
                      <div className="feedback-info-box">
                        <span className="feedback-info-label">Designation</span>
                        <span className="feedback-info-value">{activeFeedback.designation}</span>
                      </div>
                    </div>
                  </section>

                  <p className="feedback-detail-footnote">
                    Submitted on {new Date(activeFeedback.created_at).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'short', day: 'numeric',
                    })}
                  </p>
                </>
              ) : (
                <div className="feedback-detail-placeholder">
                  <VisibilityIcon sx={{ fontSize: 40, color: '#cbd5e1' }} />
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

export default AdminFeedback;
