import React, { useState, useEffect } from 'react';
import './AdminWhitePapers.css';

interface WhitePaper {
  id: string;
  title: string;
  short_description: string;
  pdf_id: string;
  image_id?: string;
  created_at: string;
  last_edited_by?: string;
  last_edited_at?: string;
}

interface FormData {
  title: string;
  short_description: string;
  pdf: File | null;
  image: File | null;
}

const AdminWhitePapers: React.FC = () => {
  const [whitePapers, setWhitePapers] = useState<WhitePaper[]>([]);
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
    pdf: null,
    image: null
  });

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string

  // Fetch white papers
  const fetchWhitePapers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/whitepapers/`);
      if (response.ok) {
        const data = await response.json();
        setWhitePapers(data);
      }
    } catch (error) {
      console.error('Error fetching white papers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWhitePapers();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.short_description) {
      return;
    }

    if (!editingId && !formData.pdf) {
      return;
    }

    setSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
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
        response = await fetch(`${API_BASE_URL}/whitepapers/${editingId}`, {
          method: 'PUT',
          body: formDataToSend,
        });
      } else {
        response = await fetch(`${API_BASE_URL}/whitepapers/upload`, {
          method: 'POST',
          body: formDataToSend,
        });
      }

      if (response.ok) {
        resetForm();
        fetchWhitePapers();
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
      title: '',
      short_description: '',
      pdf: null,
      image: null
    });
    setEditingId(null);
  };

  // Handle edit
  const handleEdit = (paper: WhitePaper) => {
    setFormData({
      title: paper.title,
      short_description: paper.short_description,
      pdf: null,
      image: null
    });
    setEditingId(paper.id);
    setShowForm(true);
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this white paper?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/whitepapers/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchWhitePapers();
      }
    } catch (error) {
      console.error('Error deleting white paper:', error);
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

  // Filter white papers based on search
  const filteredWhitePapers = whitePapers.filter(paper =>
    paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paper.short_description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const paginatedWhitePapers = filteredWhitePapers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const totalPages = Math.ceil(filteredWhitePapers.length / rowsPerPage);

  return (
    <div className="whitepaper-container">
      {/* Header */}
      <div className="whitepaper-header">
        <h1 className="whitepaper-title">White Papers</h1>
        <p className="whitepaper-subtitle">
          Create and manage white papers for your website
        </p>
      </div>

      {/* Action Bar */}
      <div className="whitepaper-action-bar">
        <div className="whitepaper-search">
          <input
            type="text"
            placeholder="Search white papers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="whitepaper-actions">
          <button
            className="whitepaper-btn whitepaper-btn-icon icon-refresh"
            onClick={fetchWhitePapers}
            title="Refresh"
          >
          </button>

          <button
            className="whitepaper-btn whitepaper-btn-primary"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
          >
            <span className="icon-plus"></span>
            Add White Paper
          </button>
        </div>
      </div>

      {/* White Papers Table */}
      <div className="whitepaper-main-card">
        <div className="whitepaper-gradient-header">
          <div className="whitepaper-header-content">
            <div className="whitepaper-header-avatar">
            </div>
            <div className="whitepaper-header-text">
              <h3>White Papers</h3>
              <p>{filteredWhitePapers.length} total white papers</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="whitepaper-loading">
            <div className="whitepaper-spinner"></div>
          </div>
        ) : (
          <>
            <div className="whitepaper-table-container">
              <table className="whitepaper-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Created</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedWhitePapers.map((paper) => (
                    <tr key={paper.id}>
                      <td>
                        <h4 className="whitepaper-table-title">
                          {paper.title}
                        </h4>
                      </td>
                      <td>
                        <p className="whitepaper-table-description">
                          {paper.short_description}
                        </p>
                      </td>
                      <td>
                        <span className="whitepaper-table-date">
                          {new Date(paper.created_at).toLocaleDateString()}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`whitepaper-status-chip ${
                            paper.last_edited_at ? 'whitepaper-status-updated' : 'whitepaper-status-published'
                          }`}
                        >
                          {paper.last_edited_at ? 'Updated' : 'Published'}
                        </span>
                      </td>
                      <td>
                        <div className="whitepaper-table-actions">
                          <button
                            className="whitepaper-action-btn whitepaper-action-edit"
                            onClick={() => handleEdit(paper)}
                            title="Edit"
                          >
                          </button>
                          <button
                            className="whitepaper-action-btn whitepaper-action-delete"
                            onClick={() => handleDelete(paper.id)}
                            title="Delete"
                          >
                          </button>
                          <a
                            href={`${API_BASE_URL}/whitepapers/pdf/${paper.pdf_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="whitepaper-action-btn whitepaper-action-download"
                            title="Download PDF"
                          >
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredWhitePapers.length === 0 && (
                <div className="whitepaper-empty-state">
                  <p>No white papers yet. Click "Add White Paper" to create your first one.</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {filteredWhitePapers.length > 0 && (
              <div className="whitepaper-pagination">
                <div>
                  Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, filteredWhitePapers.length)} of {filteredWhitePapers.length} white papers
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
        <div className="whitepaper-dialog-backdrop" onClick={() => setShowForm(false)}>
          <div className="whitepaper-dialog" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="whitepaper-form-header">
              <div className="whitepaper-form-header-content">
                <div className={`whitepaper-form-avatar ${editingId ? 'edit' : ''}`}>
                </div>
                <div>
                  <h1 className="whitepaper-form-title">
                    {editingId ? 'Edit White Paper' : 'Create New White Paper'}
                  </h1>
                  <p className="whitepaper-form-subtitle">
                    {editingId ? 'Update your white paper information' : 'Add a new white paper to your library'}
                  </p>
                </div>
              </div>

              <button
                className="whitepaper-close-btn"
                onClick={() => setShowForm(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit}>
              <div className="whitepaper-form-content">
                <div className="whitepaper-form-container">

                  {/* Basic Information Section */}
                  <div className="whitepaper-form-section">
                    <div className="whitepaper-section-header">
                      <div className="whitepaper-section-avatar info">
                      </div>
                      <div>
                        <h2 className="whitepaper-section-title">
                          White Paper Information
                        </h2>
                        <p className="whitepaper-section-subtitle">
                          Provide the title and short description for your white paper
                        </p>
                      </div>
                    </div>

                    <div className="whitepaper-form-field">
                      <label className="whitepaper-form-label">
                        Title *
                      </label>
                      <input
                        type="text"
                        className="whitepaper-form-input"
                        placeholder="Enter a compelling title for your white paper..."
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="whitepaper-form-field">
                      <label className="whitepaper-form-label">
                        Short Description *
                      </label>
                      <textarea
                        className="whitepaper-form-input whitepaper-form-textarea"
                        rows={3}
                        placeholder="Write a brief, compelling summary that will appear on the white paper card..."
                        value={formData.short_description}
                        onChange={(e) => setFormData(prev => ({ ...prev, short_description: e.target.value }))}
                        required
                      />
                      <p className="whitepaper-form-helper">
                        This description will be displayed on the white paper card on your website.
                      </p>
                    </div>
                  </div>

                  {/* File Upload Section */}
                  <div className="whitepaper-form-section">
                    <div className="whitepaper-section-header">
                      <div className="whitepaper-section-avatar upload">
                      </div>
                      <div>
                        <h2 className="whitepaper-section-title">
                          White Paper PDF
                        </h2>
                        <p className="whitepaper-section-subtitle">
                          Upload the PDF document visitors will be able to view/download
                        </p>
                      </div>
                    </div>

                    <div className="whitepaper-upload-grid">
                      {/* PDF Upload */}
                      <div className="whitepaper-form-field">
                        <label className="whitepaper-form-label">
                          White Paper PDF {!editingId && '*'}
                        </label>
                        <div
                          className="whitepaper-upload-zone pdf"
                          onClick={() => document.getElementById('whitepaper-pdf-upload')?.click()}
                        >
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={handlePdfChange}
                            style={{ display: 'none' }}
                            id="whitepaper-pdf-upload"
                            required={!editingId}
                          />

                          <div className="whitepaper-upload-avatar pdf">
                          </div>

                          <h3 className="whitepaper-upload-title">
                            {formData.pdf ? 'PDF Selected' : 'Upload PDF'}
                          </h3>

                          {formData.pdf ? (
                            <div>
                              <p className="whitepaper-upload-filename">
                                {formData.pdf.name}
                              </p>
                              <span className="whitepaper-upload-chip pdf-size">
                                {(formData.pdf.size / 1024 / 1024).toFixed(2)} MB
                              </span>
                            </div>
                          ) : (
                            <div>
                              <p className="whitepaper-upload-description">
                                Click to browse and select a PDF document
                              </p>
                              <p className="whitepaper-upload-hint">
                                {editingId
                                  ? 'Leave empty to keep the current PDF'
                                  : 'This will be available for viewing/download by users'}
                              </p>
                              <span className="whitepaper-upload-chip pdf">
                                PDF files only
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Cover Image Upload */}
                      <div className="whitepaper-form-field">
                        <label className="whitepaper-form-label">
                          Cover Image
                        </label>
                        <div
                          className="whitepaper-upload-zone image"
                          onClick={() => document.getElementById('whitepaper-image-upload')?.click()}
                        >
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                            id="whitepaper-image-upload"
                          />

                          <div className="whitepaper-upload-avatar image">
                          </div>

                          <h3 className="whitepaper-upload-title">
                            {formData.image ? 'Image Selected' : 'Upload Cover Image'}
                          </h3>

                          {formData.image ? (
                            <div>
                              <p className="whitepaper-upload-filename">
                                {formData.image.name}
                              </p>
                              <span className="whitepaper-upload-chip size">
                                {(formData.image.size / 1024 / 1024).toFixed(2)} MB
                              </span>
                            </div>
                          ) : (
                            <div>
                              <p className="whitepaper-upload-description">
                                Click to browse and select a cover image
                              </p>
                              <p className="whitepaper-upload-hint">
                                {editingId
                                  ? 'Leave empty to keep the current image'
                                  : 'Optional — shown as the thumbnail for this white paper'}
                              </p>
                              <span className="whitepaper-upload-chip image">
                                Image files only
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {!editingId && (
                      <div className="whitepaper-upload-required">
                        <p className="whitepaper-upload-required-text">
                          A PDF file is required for new white papers
                        </p>
                      </div>
                    )}
                  </div>

                </div>
              </div>

              {/* Footer */}
              <div className="whitepaper-form-footer">
                <div className="whitepaper-form-footer-info">
                  <h4>
                    {editingId ? 'Updating existing white paper' : 'Creating new white paper'}
                  </h4>
                  <p>
                    All fields marked with * are required
                  </p>
                </div>

                <div className="whitepaper-form-footer-actions">
                  <button
                    type="button"
                    className="whitepaper-form-btn whitepaper-form-btn-cancel"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="whitepaper-form-btn whitepaper-form-btn-submit"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <div className="whitepaper-form-btn-loading">
                        <div className="whitepaper-form-spinner"></div>
                        <span>Saving...</span>
                      </div>
                    ) : (
                      <span>{editingId ? 'Update White Paper' : 'Create White Paper'}</span>
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

export default AdminWhitePapers;
