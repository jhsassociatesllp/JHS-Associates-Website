import React, { useState, useEffect } from 'react';
import './AdminRegulatory.css';

interface Regulatory {
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

const AdminRegulatory: React.FC = () => {
  const [regulatoryItems, setRegulatoryItems] = useState<Regulatory[]>([]);
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

  // Fetch regulatory documents
  const fetchRegulatory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/regulatory/`);
      if (response.ok) {
        const data = await response.json();
        setRegulatoryItems(data);
      }
    } catch (error) {
      console.error('Error fetching regulatory documents:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegulatory();
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
        response = await fetch(`${API_BASE_URL}/regulatory/${editingId}`, {
          method: 'PUT',
          body: formDataToSend,
        });
      } else {
        response = await fetch(`${API_BASE_URL}/regulatory/upload`, {
          method: 'POST',
          body: formDataToSend,
        });
      }

      if (response.ok) {
        resetForm();
        fetchRegulatory();
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
  const handleEdit = (paper: Regulatory) => {
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
    if (!confirm('Are you sure you want to delete this regulatory document?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/regulatory/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchRegulatory();
      }
    } catch (error) {
      console.error('Error deleting regulatory document:', error);
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

  // Filter regulatory documents based on search
  const filteredRegulatory = regulatoryItems.filter(paper =>
    paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paper.short_description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const paginatedRegulatory = filteredRegulatory.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const totalPages = Math.ceil(filteredRegulatory.length / rowsPerPage);

  return (
    <div className="regulatory-container">
      {/* Header */}
      <div className="regulatory-header">
        <h1 className="regulatory-title">Regulatory</h1>
        <p className="regulatory-subtitle">
          Create and manage regulatory documents for your website
        </p>
      </div>

      {/* Action Bar */}
      <div className="regulatory-action-bar">
        <div className="regulatory-search">
          <input
            type="text"
            placeholder="Search regulatory documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="regulatory-actions">
          <button
            className="regulatory-btn regulatory-btn-icon icon-refresh"
            onClick={fetchRegulatory}
            title="Refresh"
          >
          </button>

          <button
            className="regulatory-btn regulatory-btn-primary"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
          >
            <span className="icon-plus"></span>
            Add Regulatory Document
          </button>
        </div>
      </div>

      {/* Regulatory Table */}
      <div className="regulatory-main-card">
        <div className="regulatory-gradient-header">
          <div className="regulatory-header-content">
            <div className="regulatory-header-avatar">
            </div>
            <div className="regulatory-header-text">
              <h3>Regulatory Documents</h3>
              <p>{filteredRegulatory.length} total regulatory documents</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="regulatory-loading">
            <div className="regulatory-spinner"></div>
          </div>
        ) : (
          <>
            <div className="regulatory-table-container">
              <table className="regulatory-table">
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
                  {paginatedRegulatory.map((paper) => (
                    <tr key={paper.id}>
                      <td>
                        <h4 className="regulatory-table-title">
                          {paper.title}
                        </h4>
                      </td>
                      <td>
                        <p className="regulatory-table-description">
                          {paper.short_description}
                        </p>
                      </td>
                      <td>
                        <span className="regulatory-table-date">
                          {new Date(paper.created_at).toLocaleDateString()}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`regulatory-status-chip ${
                            paper.last_edited_at ? 'regulatory-status-updated' : 'regulatory-status-published'
                          }`}
                        >
                          {paper.last_edited_at ? 'Updated' : 'Published'}
                        </span>
                      </td>
                      <td>
                        <div className="regulatory-table-actions">
                          <button
                            className="regulatory-action-btn regulatory-action-edit"
                            onClick={() => handleEdit(paper)}
                            title="Edit"
                          >
                          </button>
                          <button
                            className="regulatory-action-btn regulatory-action-delete"
                            onClick={() => handleDelete(paper.id)}
                            title="Delete"
                          >
                          </button>
                          <a
                            href={`${API_BASE_URL}/regulatory/pdf/${paper.pdf_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="regulatory-action-btn regulatory-action-download"
                            title="Download PDF"
                          >
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredRegulatory.length === 0 && (
                <div className="regulatory-empty-state">
                  <p>No regulatory documents yet. Click "Add Regulatory Document" to create your first one.</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {filteredRegulatory.length > 0 && (
              <div className="regulatory-pagination">
                <div>
                  Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, filteredRegulatory.length)} of {filteredRegulatory.length} regulatory documents
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
        <div className="regulatory-dialog-backdrop" onClick={() => setShowForm(false)}>
          <div className="regulatory-dialog" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="regulatory-form-header">
              <div className="regulatory-form-header-content">
                <div className={`regulatory-form-avatar ${editingId ? 'edit' : ''}`}>
                </div>
                <div>
                  <h1 className="regulatory-form-title">
                    {editingId ? 'Edit Regulatory Document' : 'Create New Regulatory Document'}
                  </h1>
                  <p className="regulatory-form-subtitle">
                    {editingId ? 'Update your regulatory document information' : 'Add a new regulatory document to your library'}
                  </p>
                </div>
              </div>

              <button
                className="regulatory-close-btn"
                onClick={() => setShowForm(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit}>
              <div className="regulatory-form-content">
                <div className="regulatory-form-container">

                  {/* Basic Information Section */}
                  <div className="regulatory-form-section">
                    <div className="regulatory-section-header">
                      <div className="regulatory-section-avatar info">
                      </div>
                      <div>
                        <h2 className="regulatory-section-title">
                          Regulatory Information
                        </h2>
                        <p className="regulatory-section-subtitle">
                          Provide the title and short description for your regulatory document
                        </p>
                      </div>
                    </div>

                    <div className="regulatory-form-field">
                      <label className="regulatory-form-label">
                        Title *
                      </label>
                      <input
                        type="text"
                        className="regulatory-form-input"
                        placeholder="Enter a compelling title for your regulatory document..."
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="regulatory-form-field">
                      <label className="regulatory-form-label">
                        Short Description *
                      </label>
                      <textarea
                        className="regulatory-form-input regulatory-form-textarea"
                        rows={3}
                        placeholder="Write a brief, compelling summary that will appear on the regulatory card on your website..."
                        value={formData.short_description}
                        onChange={(e) => setFormData(prev => ({ ...prev, short_description: e.target.value }))}
                        required
                      />
                      <p className="regulatory-form-helper">
                        This description will be displayed on the regulatory card on your website.
                      </p>
                    </div>
                  </div>

                  {/* File Upload Section */}
                  <div className="regulatory-form-section">
                    <div className="regulatory-section-header">
                      <div className="regulatory-section-avatar upload">
                      </div>
                      <div>
                        <h2 className="regulatory-section-title">
                          Regulatory PDF
                        </h2>
                        <p className="regulatory-section-subtitle">
                          Upload the PDF document visitors will be able to view/download
                        </p>
                      </div>
                    </div>

                    <div className="regulatory-upload-grid">
                      {/* PDF Upload */}
                      <div className="regulatory-form-field">
                        <label className="regulatory-form-label">
                          Regulatory PDF {!editingId && '*'}
                        </label>
                        <div
                          className="regulatory-upload-zone pdf"
                          onClick={() => document.getElementById('regulatory-pdf-upload')?.click()}
                        >
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={handlePdfChange}
                            style={{ display: 'none' }}
                            id="regulatory-pdf-upload"
                            required={!editingId}
                          />

                          <div className="regulatory-upload-avatar pdf">
                          </div>

                          <h3 className="regulatory-upload-title">
                            {formData.pdf ? 'PDF Selected' : 'Upload PDF'}
                          </h3>

                          {formData.pdf ? (
                            <div>
                              <p className="regulatory-upload-filename">
                                {formData.pdf.name}
                              </p>
                              <span className="regulatory-upload-chip pdf-size">
                                {(formData.pdf.size / 1024 / 1024).toFixed(2)} MB
                              </span>
                            </div>
                          ) : (
                            <div>
                              <p className="regulatory-upload-description">
                                Click to browse and select a PDF document
                              </p>
                              <p className="regulatory-upload-hint">
                                {editingId
                                  ? 'Leave empty to keep the current PDF'
                                  : 'This will be available for viewing/download by users'}
                              </p>
                              <span className="regulatory-upload-chip pdf">
                                PDF files only
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Cover Image Upload */}
                      <div className="regulatory-form-field">
                        <label className="regulatory-form-label">
                          Cover Image
                        </label>
                        <div
                          className="regulatory-upload-zone image"
                          onClick={() => document.getElementById('regulatory-image-upload')?.click()}
                        >
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                            id="regulatory-image-upload"
                          />

                          <div className="regulatory-upload-avatar image">
                          </div>

                          <h3 className="regulatory-upload-title">
                            {formData.image ? 'Image Selected' : 'Upload Cover Image'}
                          </h3>

                          {formData.image ? (
                            <div>
                              <p className="regulatory-upload-filename">
                                {formData.image.name}
                              </p>
                              <span className="regulatory-upload-chip size">
                                {(formData.image.size / 1024 / 1024).toFixed(2)} MB
                              </span>
                            </div>
                          ) : (
                            <div>
                              <p className="regulatory-upload-description">
                                Click to browse and select a cover image
                              </p>
                              <p className="regulatory-upload-hint">
                                {editingId
                                  ? 'Leave empty to keep the current image'
                                  : 'Optional — shown as the thumbnail for this regulatory document'}
                              </p>
                              <span className="regulatory-upload-chip image">
                                Image files only
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {!editingId && (
                      <div className="regulatory-upload-required">
                        <p className="regulatory-upload-required-text">
                          A PDF file is required for new regulatory documents
                        </p>
                      </div>
                    )}
                  </div>

                </div>
              </div>

              {/* Footer */}
              <div className="regulatory-form-footer">
                <div className="regulatory-form-footer-info">
                  <h4>
                    {editingId ? 'Updating existing regulatory document' : 'Creating new regulatory document'}
                  </h4>
                  <p>
                    All fields marked with * are required
                  </p>
                </div>

                <div className="regulatory-form-footer-actions">
                  <button
                    type="button"
                    className="regulatory-form-btn regulatory-form-btn-cancel"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="regulatory-form-btn regulatory-form-btn-submit"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <div className="regulatory-form-btn-loading">
                        <div className="regulatory-form-spinner"></div>
                        <span>Saving...</span>
                      </div>
                    ) : (
                      <span>{editingId ? 'Update Regulatory Document' : 'Create Regulatory Document'}</span>
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

export default AdminRegulatory;
