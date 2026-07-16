import React, { useState, useEffect } from 'react';
import './AdminNewsletters.css';

interface Newsletter {
  id: string;
  heading: string;
  short_description: string;
  pdf_id: string;
  image_id?: string;
  created_at: string;
  last_edited_by?: string;
  last_edited_at?: string;
}

interface FormData {
  heading: string;
  short_description: string;
  pdf: File | null;
  image: File | null;
}

const AdminNewsletters: React.FC = () => {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    heading: '',
    short_description: '',
    pdf: null,
    image: null
  });

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string

  // Fetch newsletters
  const fetchNewsletters = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/newsletters/`);
      if (response.ok) {
        const data = await response.json();
        setNewsletters(data);
      }
    } catch (error) {
      console.error('Error fetching newsletters:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewsletters();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.heading || !formData.short_description) {
      return;
    }

    if (!editingId && !formData.pdf) {
      return;
    }

    setSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('heading', formData.heading);
      formDataToSend.append('short_description', formData.short_description);

      if (formData.pdf) {
        formDataToSend.append('pdf', formData.pdf);
      }

      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      let response;
      if (editingId) {
        formDataToSend.append('edited_by', 'Admin User');
        response = await fetch(`${API_BASE_URL}/newsletters/${editingId}`, {
          method: 'PUT',
          body: formDataToSend,
        });
      } else {
        response = await fetch(`${API_BASE_URL}/newsletters/upload`, {
          method: 'POST',
          body: formDataToSend,
        });
      }

      if (response.ok) {
        resetForm();
        fetchNewsletters();
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      heading: '',
      short_description: '',
      pdf: null,
      image: null
    });
    setEditingId(null);
  };

  // Handle edit
  const handleEdit = (newsletter: Newsletter) => {
    setFormData({
      heading: newsletter.heading,
      short_description: newsletter.short_description,
      pdf: null,
      image: null
    });
    setEditingId(newsletter.id);
    setShowForm(true);
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this newsletter?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/newsletters/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchNewsletters();
      }
    } catch (error) {
      console.error('Error deleting newsletter:', error);
    }
  };

  // Handle file change
  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, pdf: file }));
    }
  };

  // Handle image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
    }
  };

  // Filter newsletters based on search
  const filteredNewsletters = newsletters.filter(newsletter =>
    newsletter.heading.toLowerCase().includes(searchTerm.toLowerCase()) ||
    newsletter.short_description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const paginatedNewsletters = filteredNewsletters.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const totalPages = Math.ceil(filteredNewsletters.length / rowsPerPage);

  return (
    <div className="newsletter-container">
      {/* Header */}
      <div className="newsletter-header">
        <h1 className="newsletter-title">Newsletters</h1>
        <p className="newsletter-subtitle">
          Create and manage newsletters for your website
        </p>
      </div>

      {/* Action Bar */}
      <div className="newsletter-action-bar">
        <div className="newsletter-search">
          <input
            type="text"
            placeholder="Search newsletters..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="newsletter-actions">
          <button
            className="newsletter-btn newsletter-btn-icon icon-refresh"
            onClick={fetchNewsletters}
            title="Refresh"
          >
          </button>

          <button
            className="newsletter-btn newsletter-btn-primary"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
          >
            <span className="icon-plus"></span>
            Add Newsletter
          </button>
        </div>
      </div>

      {/* Newsletters Table */}
      <div className="newsletter-main-card">
        <div className="newsletter-gradient-header">
          <div className="newsletter-header-content">
            <div className="newsletter-header-avatar">
            </div>
            <div className="newsletter-header-text">
              <h3>Newsletters</h3>
              <p>{filteredNewsletters.length} total newsletters</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="newsletter-loading">
            <div className="newsletter-spinner"></div>
          </div>
        ) : (
          <>
            <div className="newsletter-table-container">
              <table className="newsletter-table">
                <thead>
                  <tr>
                    <th>Heading</th>
                    <th>Description</th>
                    <th>Created</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedNewsletters.map((newsletter) => (
                    <tr key={newsletter.id}>
                      <td>
                        <h4 className="newsletter-table-title">
                          {newsletter.heading}
                        </h4>
                      </td>
                      <td>
                        <p className="newsletter-table-description">
                          {newsletter.short_description}
                        </p>
                      </td>
                      <td>
                        <span className="newsletter-table-date">
                          {new Date(newsletter.created_at).toLocaleDateString()}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`newsletter-status-chip ${
                            newsletter.last_edited_at ? 'newsletter-status-updated' : 'newsletter-status-published'
                          }`}
                        >
                          {newsletter.last_edited_at ? 'Updated' : 'Published'}
                        </span>
                      </td>
                      <td>
                        <div className="newsletter-table-actions">
                          <button
                            className="newsletter-action-btn newsletter-action-edit"
                            onClick={() => handleEdit(newsletter)}
                            title="Edit"
                          >
                          </button>
                          <button
                            className="newsletter-action-btn newsletter-action-delete"
                            onClick={() => handleDelete(newsletter.id)}
                            title="Delete"
                          >
                          </button>
                          <a
                            href={`${API_BASE_URL}/newsletters/pdf/${newsletter.pdf_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="newsletter-action-btn newsletter-action-download"
                            title="Download PDF"
                          >
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredNewsletters.length === 0 && (
                <div className="newsletter-empty-state">
                  <p>No newsletters yet. Click "Add Newsletter" to create your first one.</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {filteredNewsletters.length > 0 && (
              <div className="newsletter-pagination">
                <div>
                  Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, filteredNewsletters.length)} of {filteredNewsletters.length} newsletters
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
                  <span>Page {page + 1} of {Math.max(totalPages, 1)}</span>
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

      {/* Form Dialog */}
      {showForm && (
        <div className="newsletter-dialog-backdrop" onClick={() => setShowForm(false)}>
          <div className="newsletter-dialog" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="newsletter-form-header">
              <div className="newsletter-form-header-content">
                <div className={`newsletter-form-avatar ${editingId ? 'edit' : ''}`}>
                </div>
                <div>
                  <h1 className="newsletter-form-title">
                    {editingId ? 'Edit Newsletter' : 'Create New Newsletter'}
                  </h1>
                  <p className="newsletter-form-subtitle">
                    {editingId ? 'Update your newsletter information' : 'Add a new newsletter to your library'}
                  </p>
                </div>
              </div>

              <button
                className="newsletter-close-btn"
                onClick={() => setShowForm(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit}>
              <div className="newsletter-form-content">
                <div className="newsletter-form-container">

                  {/* Basic Information Section */}
                  <div className="newsletter-form-section">
                    <div className="newsletter-section-header">
                      <div className="newsletter-section-avatar info">
                      </div>
                      <div>
                        <h2 className="newsletter-section-title">
                          Newsletter Information
                        </h2>
                        <p className="newsletter-section-subtitle">
                          Provide the heading and short description for your newsletter
                        </p>
                      </div>
                    </div>

                    <div className="newsletter-form-field">
                      <label className="newsletter-form-label">
                        Heading *
                      </label>
                      <input
                        type="text"
                        className="newsletter-form-input"
                        placeholder="Enter a compelling heading for your newsletter..."
                        value={formData.heading}
                        onChange={(e) => setFormData(prev => ({ ...prev, heading: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="newsletter-form-field">
                      <label className="newsletter-form-label">
                        Short Description *
                      </label>
                      <textarea
                        className="newsletter-form-input newsletter-form-textarea"
                        rows={3}
                        placeholder="Write a brief, compelling summary that will appear on the newsletter card..."
                        value={formData.short_description}
                        onChange={(e) => setFormData(prev => ({ ...prev, short_description: e.target.value }))}
                        required
                      />
                      <p className="newsletter-form-helper">
                        This description will be displayed on the newsletter card on your website.
                      </p>
                    </div>
                  </div>

                  {/* File Upload Section */}
                  <div className="newsletter-form-section">
                    <div className="newsletter-section-header">
                      <div className="newsletter-section-avatar upload">
                      </div>
                      <div>
                        <h2 className="newsletter-section-title">
                          Newsletter PDF
                        </h2>
                        <p className="newsletter-section-subtitle">
                          Upload the PDF document visitors will be able to view/download
                        </p>
                      </div>
                    </div>

                    <div className="newsletter-upload-grid">
                      {/* PDF Upload */}
                      <div className="newsletter-form-field">
                        <label className="newsletter-form-label">
                          Newsletter PDF {!editingId && '*'}
                        </label>
                        <div
                          className="newsletter-upload-zone pdf"
                          onClick={() => document.getElementById('newsletter-pdf-upload')?.click()}
                        >
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={handlePdfChange}
                            style={{ display: 'none' }}
                            id="newsletter-pdf-upload"
                            required={!editingId}
                          />

                          <div className="newsletter-upload-avatar pdf">
                          </div>

                          <h3 className="newsletter-upload-title">
                            {formData.pdf ? 'PDF Selected' : 'Upload PDF'}
                          </h3>

                          {formData.pdf ? (
                            <div>
                              <p className="newsletter-upload-filename">
                                {formData.pdf.name}
                              </p>
                              <span className="newsletter-upload-chip pdf-size">
                                {(formData.pdf.size / 1024 / 1024).toFixed(2)} MB
                              </span>
                            </div>
                          ) : (
                            <div>
                              <p className="newsletter-upload-description">
                                Click to browse and select a PDF document
                              </p>
                              <p className="newsletter-upload-hint">
                                {editingId
                                  ? 'Leave empty to keep the current PDF'
                                  : 'This will be available for viewing/download by users'}
                              </p>
                              <span className="newsletter-upload-chip pdf">
                                PDF files only
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Cover Image Upload */}
                      <div className="newsletter-form-field">
                        <label className="newsletter-form-label">
                          Cover Image
                        </label>
                        <div
                          className="newsletter-upload-zone image"
                          onClick={() => document.getElementById('newsletter-image-upload')?.click()}
                        >
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                            id="newsletter-image-upload"
                          />

                          <div className="newsletter-upload-avatar image">
                          </div>

                          <h3 className="newsletter-upload-title">
                            {formData.image ? 'Image Selected' : 'Upload Cover Image'}
                          </h3>

                          {formData.image ? (
                            <div>
                              <p className="newsletter-upload-filename">
                                {formData.image.name}
                              </p>
                              <span className="newsletter-upload-chip size">
                                {(formData.image.size / 1024 / 1024).toFixed(2)} MB
                              </span>
                            </div>
                          ) : (
                            <div>
                              <p className="newsletter-upload-description">
                                Click to browse and select a cover image
                              </p>
                              <p className="newsletter-upload-hint">
                                {editingId
                                  ? 'Leave empty to keep the current image'
                                  : 'Optional — shown as the thumbnail for this newsletter'}
                              </p>
                              <span className="newsletter-upload-chip image">
                                Image files only
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {!editingId && (
                      <div className="newsletter-upload-required">
                        <p className="newsletter-upload-required-text">
                          A PDF file is required for new newsletters
                        </p>
                      </div>
                    )}
                  </div>

                </div>
              </div>

              {/* Footer */}
              <div className="newsletter-form-footer">
                <div className="newsletter-form-footer-info">
                  <h4>
                    {editingId ? 'Updating existing newsletter' : 'Creating new newsletter'}
                  </h4>
                  <p>
                    All fields marked with * are required
                  </p>
                </div>

                <div className="newsletter-form-footer-actions">
                  <button
                    type="button"
                    className="newsletter-form-btn newsletter-form-btn-cancel"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="newsletter-form-btn newsletter-form-btn-submit"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <div className="newsletter-form-btn-loading">
                        <div className="newsletter-form-spinner"></div>
                        <span>Saving...</span>
                      </div>
                    ) : (
                      <span>{editingId ? 'Update Newsletter' : 'Create Newsletter'}</span>
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

export default AdminNewsletters;
