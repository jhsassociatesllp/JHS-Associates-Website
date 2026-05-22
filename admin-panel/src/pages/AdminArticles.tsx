import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './AdminArticles.css';

interface Article {
  id: string;
  title: string;
  short_description: string;
  content: string;
  author: string;
  publish_date: string;
  image_id: string;
  pdf_id: string;
  created_at: string;
  last_edited_by?: string;
  last_edited_at?: string;
}

interface FormData {
  title: string;
  short_description: string;
  content: string;
  author: string;
  publish_date: string;
  image: File | null;
  pdf: File | null;
}

const AdminArticles: React.FC = () => {
  const { token } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    short_description: '',
    content: '',
    author: '',
    publish_date: '',
    image: null,
    pdf: null
  });

  const API_BASE = 'http://localhost:8000';

  // Helper function to get auth headers
  const getAuthHeaders = () => {
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  // Fetch articles
  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/articles/`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setArticles(data);
      } else {
        console.error('Failed to fetch articles:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.short_description || !formData.content || !formData.author) {
      alert('Please fill in all required fields');
      return;
    }

    if (!editingId && (!formData.image || !formData.pdf)) {
      alert('Please select both image and PDF files for new articles');
      return;
    }

    setSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('short_description', formData.short_description);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('author', formData.author);
      formDataToSend.append('publish_date', formData.publish_date || new Date().toISOString().split('T')[0]);
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }
      if (formData.pdf) {
        formDataToSend.append('pdf', formData.pdf);
      }

      let response;
      const headers = getAuthHeaders();
      
      if (editingId) {
        formDataToSend.append('edited_by', 'Admin User');
        response = await fetch(`${API_BASE}/articles/${editingId}`, {
          method: 'PUT',
          headers,
          body: formDataToSend,
        });
      } else {
        // Use the correct endpoint for creating articles
        response = await fetch(`${API_BASE}/articles/upload`, {
          method: 'POST',
          headers,
          body: formDataToSend,
        });
      }

      if (response.ok) {
        const result = await response.json();
        console.log('Article saved successfully:', result);
        resetForm();
        fetchArticles();
        setShowForm(false);
        alert(editingId ? 'Article updated successfully!' : 'Article created successfully!');
      } else {
        const errorData = await response.text();
        console.error('Failed to save article:', response.status, response.statusText, errorData);
        alert(`Failed to save article: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred while saving the article. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      short_description: '',
      content: '',
      author: '',
      publish_date: '',
      image: null,
      pdf: null
    });
    setEditingId(null);
  };

  // Handle edit
  const handleEdit = (article: Article) => {
    setFormData({
      title: article.title,
      short_description: article.short_description,
      content: article.content,
      author: article.author || '',
      publish_date: article.publish_date || '',
      image: null,
      pdf: null
    });
    setEditingId(article.id);
    setShowForm(true);
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      const response = await fetch(`${API_BASE}/articles/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        fetchArticles();
        alert('Article deleted successfully!');
      } else {
        console.error('Failed to delete article:', response.status, response.statusText);
        alert('Failed to delete article. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('An error occurred while deleting the article. Please try again.');
    }
  };

  // Handle file change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
    }
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, pdf: file }));
    }
  };

  // Filter articles based on search
  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.short_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (article.author && article.author.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Pagination
  const paginatedArticles = filteredArticles.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const totalPages = Math.ceil(filteredArticles.length / rowsPerPage);

  return (
    <div className="articles-container">
      {/* Header */}
      <div className="articles-header">
        <h1 className="articles-title">Articles</h1>
        <p className="articles-subtitle">
          Create and manage articles for your website
        </p>
      </div>

      {/* Action Bar */}
      <div className="articles-action-bar">
        <div className="articles-search">
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="articles-actions">
          <button 
            className="articles-btn articles-btn-icon icon-refresh"
            onClick={fetchArticles}
            title="Refresh"
          >
          </button>
          
          <button
            className="articles-btn articles-btn-primary"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
          >
            <span className="icon-plus"></span>
            Add Article
          </button>
        </div>
      </div>

      {/* Articles Table */}
      <div className="articles-main-card">
        <div className="articles-gradient-header">
          <div className="articles-header-content">
            <div className="articles-header-avatar">
            </div>
            <div className="articles-header-text">
              <h3>Articles</h3>
              <p>{filteredArticles.length} total articles</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="articles-loading">
            <div className="articles-spinner"></div>
          </div>
        ) : (
          <>
            <div className="articles-table-container">
              <table className="articles-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Author</th>
                    <th>Published</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedArticles.map((article) => (
                    <tr key={article.id}>
                      <td>
                        <h4 className="articles-table-title">
                          {article.title}
                        </h4>
                      </td>
                      <td>
                        <p className="articles-table-description">
                          {article.short_description}
                        </p>
                      </td>
                      <td>
                        <span className="articles-table-author">
                          {article.author || 'Unknown'}
                        </span>
                      </td>
                      <td>
                        <span className="articles-table-date">
                          {article.publish_date ? new Date(article.publish_date).toLocaleDateString() : 'Not set'}
                        </span>
                      </td>
                      <td>
                        <span 
                          className={`articles-status-chip ${
                            article.last_edited_at ? 'articles-status-updated' : 'articles-status-published'
                          }`}
                        >
                          {article.last_edited_at ? 'Updated' : 'Published'}
                        </span>
                      </td>
                      <td>
                        <div className="articles-table-actions">
                          <button
                            className="articles-action-btn articles-action-edit"
                            onClick={() => handleEdit(article)}
                            title="Edit"
                          >
                          </button>
                          <button
                            className="articles-action-btn articles-action-delete"
                            onClick={() => handleDelete(article.id)}
                            title="Delete"
                          >
                          </button>
                          <a
                            href={`${API_BASE}/articles/pdf/${article.pdf_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="articles-action-btn articles-action-download"
                            title="Download PDF"
                          >
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="articles-pagination">
              <div>
                Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, filteredArticles.length)} of {filteredArticles.length} articles
              </div>
              <div>
                <select 
                  value={rowsPerPage} 
                  onChange={(e) => {
                    setRowsPerPage(parseInt(e.target.value));
                    setPage(0);
                  }}
                >
                  <option value={5}>5 per page</option>
                  <option value={10}>10 per page</option>
                  <option value={25}>25 per page</option>
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
          </>
        )}
      </div>
      {/* Beautiful Form Dialog */}
      {showForm && (
        <div className="articles-dialog-backdrop" onClick={() => setShowForm(false)}>
          <div className="articles-dialog" onClick={(e) => e.stopPropagation()}>
            {/* Stunning Header */}
            <div className="articles-form-header">
              <div className="articles-form-header-content">
                <div className={`articles-form-avatar ${editingId ? 'edit' : ''}`}>
                </div>
                <div>
                  <h1 className="articles-form-title">
                    {editingId ? 'Edit Article' : 'Create New Article'}
                  </h1>
                  <p className="articles-form-subtitle">
                    {editingId ? 'Update your article information' : 'Add a new article to your website'}
                  </p>
                </div>
              </div>
              
              <button
                className="articles-close-btn"
                onClick={() => setShowForm(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit}>
              <div className="articles-form-content">
                <div className="articles-form-container">
                  
                  {/* Basic Information Section */}
                  <div className="articles-form-section">
                    <div className="articles-section-header">
                      <div className="articles-section-avatar info">
                      </div>
                      <div>
                        <h2 className="articles-section-title">
                          Article Information
                        </h2>
                        <p className="articles-section-subtitle">
                          Provide the basic details for your article
                        </p>
                      </div>
                    </div>

                    <div className="articles-form-field">
                      <label className="articles-form-label">
                        Article Title *
                      </label>
                      <input
                        type="text"
                        className="articles-form-input"
                        placeholder="Enter a compelling title for your article..."
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="articles-form-field">
                      <label className="articles-form-label">
                        Short Description *
                      </label>
                      <textarea
                        className="articles-form-input articles-form-textarea"
                        rows={3}
                        placeholder="Write a brief, compelling summary that will appear on article cards..."
                        value={formData.short_description}
                        onChange={(e) => setFormData(prev => ({ ...prev, short_description: e.target.value }))}
                        required
                      />
                      <p className="articles-form-helper">
                        This description will be displayed on the article cards. Keep it engaging and informative.
                      </p>
                    </div>

                    <div className="articles-form-field">
                      <label className="articles-form-label">
                        Full Content *
                      </label>
                      <textarea
                        className="articles-form-input articles-form-textarea"
                        rows={8}
                        placeholder="Provide comprehensive, valuable content for your article. Include detailed information, insights, and actionable guidance..."
                        value={formData.content}
                        onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                        required
                      />
                      <p className="articles-form-helper">
                        This is the main content that users will read. Make it informative and valuable.
                      </p>
                    </div>

                    <div className="articles-form-grid">
                      <div className="articles-form-field">
                        <label className="articles-form-label">
                          Author *
                        </label>
                        <input
                          type="text"
                          className="articles-form-input"
                          placeholder="Enter author name..."
                          value={formData.author}
                          onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                          required
                        />
                      </div>

                      <div className="articles-form-field">
                        <label className="articles-form-label">
                          Publish Date
                        </label>
                        <input
                          type="date"
                          className="articles-form-input"
                          value={formData.publish_date}
                          onChange={(e) => setFormData(prev => ({ ...prev, publish_date: e.target.value }))}
                        />
                        <p className="articles-form-helper">
                          Leave empty to use current date
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* File Upload Section */}
                  <div className="articles-form-section">
                    <div className="articles-section-header">
                      <div className="articles-section-avatar upload">
                      </div>
                      <div>
                        <h2 className="articles-section-title">
                          Article Files
                        </h2>
                        <p className="articles-section-subtitle">
                          Upload the visual and document files for your article
                        </p>
                      </div>
                    </div>
                    
                    <div className="articles-upload-grid">
                      {/* Image Upload */}
                      <div className="articles-form-field">
                        <label className="articles-form-label">
                          Article Image {!editingId && '*'}
                        </label>
                        <div 
                          className="articles-upload-zone"
                          onClick={() => document.getElementById('image-upload')?.click()}
                        >
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                            id="image-upload"
                            required={!editingId}
                          />
                          
                          <div className="articles-upload-avatar image">
                          </div>
                          
                          <h3 className="articles-upload-title">
                            {formData.image ? 'Image Selected' : 'Upload Image'}
                          </h3>
                          
                          {formData.image ? (
                            <div>
                              <p className="articles-upload-filename">
                                {formData.image.name}
                              </p>
                              <span className="articles-upload-chip size">
                                {(formData.image.size / 1024 / 1024).toFixed(2)} MB
                              </span>
                            </div>
                          ) : (
                            <div>
                              <p className="articles-upload-description">
                                Click to browse and select an image file
                              </p>
                              <p className="articles-upload-hint">
                                Recommended: High-quality images (JPG, PNG, WebP)
                              </p>
                              <span className="articles-upload-chip image">
                                Max size: 10MB
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* PDF Upload */}
                      <div className="articles-form-field">
                        <label className="articles-form-label">
                          Article PDF {!editingId && '*'}
                        </label>
                        <div 
                          className="articles-upload-zone pdf"
                          onClick={() => document.getElementById('pdf-upload')?.click()}
                        >
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={handlePdfChange}
                            style={{ display: 'none' }}
                            id="pdf-upload"
                            required={!editingId}
                          />
                          
                          <div className="articles-upload-avatar pdf">
                          </div>
                          
                          <h3 className="articles-upload-title">
                            {formData.pdf ? 'PDF Selected' : 'Upload PDF'}
                          </h3>
                          
                          {formData.pdf ? (
                            <div>
                              <p className="articles-upload-filename">
                                {formData.pdf.name}
                              </p>
                              <span className="articles-upload-chip pdf-size">
                                {(formData.pdf.size / 1024 / 1024).toFixed(2)} MB
                              </span>
                            </div>
                          ) : (
                            <div>
                              <p className="articles-upload-description">
                                Click to browse and select a PDF document
                              </p>
                              <p className="articles-upload-hint">
                                This will be available for download by users
                              </p>
                              <span className="articles-upload-chip pdf">
                                PDF files only
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {!editingId && (
                      <div className="articles-upload-required">
                        <p className="articles-upload-required-text">
                          Both image and PDF files are required for new articles
                        </p>
                      </div>
                    )}
                  </div>

                </div>
              </div>

              {/* Beautiful Footer */}
              <div className="articles-form-footer">
                <div className="articles-form-footer-info">
                  <h4>
                    {editingId ? 'Updating existing article' : 'Creating new article'}
                  </h4>
                  <p>
                    All fields marked with * are required
                  </p>
                </div>
                
                <div className="articles-form-footer-actions">
                  <button
                    type="button"
                    className="articles-form-btn articles-form-btn-cancel"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                  
                  <button
                    type="submit"
                    className="articles-form-btn articles-form-btn-submit"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <div className="articles-form-btn-loading">
                        <div className="articles-form-spinner"></div>
                        <span>Saving...</span>
                      </div>
                    ) : (
                      <span>{editingId ? 'Update Article' : 'Create Article'}</span>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminArticles;