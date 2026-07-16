import React, { useState, useEffect } from 'react';
import './AdminExcellencia.css';

interface Excellencia {
  id: string;
  heading: string;
  short_description: string;
  image_id?: string;
  button_text?: string;
  button_url?: string;
  created_at: string;
  last_edited_by?: string;
  last_edited_at?: string;
}

interface FormData {
  heading: string;
  short_description: string;
  button_text: string;
  button_url: string;
  image: File | null;
}

const AdminExcellencia: React.FC = () => {
  const [entries, setEntries] = useState<Excellencia[]>([]);
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
    button_text: '',
    button_url: '',
    image: null
  });

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string

  // Fetch Excellencia entries
  const fetchEntries = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/excellencia/`);
      if (response.ok) {
        const data = await response.json();
        setEntries(data);
      }
    } catch (error) {
      console.error('Error fetching Excellencia entries:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.heading || !formData.short_description) {
      return;
    }

    setSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('heading', formData.heading);
      formDataToSend.append('short_description', formData.short_description);
      formDataToSend.append('button_text', formData.button_text);
      formDataToSend.append('button_url', formData.button_url);

      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      let response;
      if (editingId) {
        formDataToSend.append('edited_by', 'Admin User');
        response = await fetch(`${API_BASE_URL}/excellencia/${editingId}`, {
          method: 'PUT',
          body: formDataToSend,
        });
      } else {
        response = await fetch(`${API_BASE_URL}/excellencia/upload`, {
          method: 'POST',
          body: formDataToSend,
        });
      }

      if (response.ok) {
        resetForm();
        fetchEntries();
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
      button_text: '',
      button_url: '',
      image: null
    });
    setEditingId(null);
  };

  // Handle edit
  const handleEdit = (entry: Excellencia) => {
    setFormData({
      heading: entry.heading,
      short_description: entry.short_description,
      button_text: entry.button_text || '',
      button_url: entry.button_url || '',
      image: null
    });
    setEditingId(entry.id);
    setShowForm(true);
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this Excellencia entry?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/excellencia/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchEntries();
      }
    } catch (error) {
      console.error('Error deleting Excellencia entry:', error);
    }
  };

  // Handle image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
    }
  };

  // Filter entries based on search
  const filteredEntries = entries.filter(entry =>
    entry.heading.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.short_description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const paginatedEntries = filteredEntries.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const totalPages = Math.ceil(filteredEntries.length / rowsPerPage);

  return (
    <div className="excellencia-container">
      {/* Header */}
      <div className="excellencia-header">
        <h1 className="excellencia-title">Excellencia</h1>
        <p className="excellencia-subtitle">
          Create and manage Excellencia entries for your website
        </p>
      </div>

      {/* Action Bar */}
      <div className="excellencia-action-bar">
        <div className="excellencia-search">
          <input
            type="text"
            placeholder="Search Excellencia entries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="excellencia-actions">
          <button
            className="excellencia-btn excellencia-btn-icon icon-refresh"
            onClick={fetchEntries}
            title="Refresh"
          >
          </button>

          <button
            className="excellencia-btn excellencia-btn-primary"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
          >
            <span className="icon-plus"></span>
            Add Excellencia
          </button>
        </div>
      </div>

      {/* Excellencia Table */}
      <div className="excellencia-main-card">
        <div className="excellencia-gradient-header">
          <div className="excellencia-header-content">
            <div className="excellencia-header-avatar">
            </div>
            <div className="excellencia-header-text">
              <h3>Excellencia</h3>
              <p>{filteredEntries.length} total entries</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="excellencia-loading">
            <div className="excellencia-spinner"></div>
          </div>
        ) : (
          <>
            <div className="excellencia-table-container">
              <table className="excellencia-table">
                <thead>
                  <tr>
                    <th>Heading</th>
                    <th>Description</th>
                    <th>Button</th>
                    <th>Created</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedEntries.map((entry) => (
                    <tr key={entry.id}>
                      <td>
                        <h4 className="excellencia-table-title">
                          {entry.heading}
                        </h4>
                      </td>
                      <td>
                        <p className="excellencia-table-description">
                          {entry.short_description}
                        </p>
                      </td>
                      <td>
                        <span className="excellencia-table-date">
                          {entry.button_text || '—'}
                        </span>
                      </td>
                      <td>
                        <span className="excellencia-table-date">
                          {new Date(entry.created_at).toLocaleDateString()}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`excellencia-status-chip ${
                            entry.last_edited_at ? 'excellencia-status-updated' : 'excellencia-status-published'
                          }`}
                        >
                          {entry.last_edited_at ? 'Updated' : 'Published'}
                        </span>
                      </td>
                      <td>
                        <div className="excellencia-table-actions">
                          <button
                            className="excellencia-action-btn excellencia-action-edit"
                            onClick={() => handleEdit(entry)}
                            title="Edit"
                          >
                          </button>
                          <button
                            className="excellencia-action-btn excellencia-action-delete"
                            onClick={() => handleDelete(entry.id)}
                            title="Delete"
                          >
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredEntries.length === 0 && (
                <div className="excellencia-empty-state">
                  <p>No Excellencia entries yet. Click "Add Excellencia" to create your first one.</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {filteredEntries.length > 0 && (
              <div className="excellencia-pagination">
                <div>
                  Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, filteredEntries.length)} of {filteredEntries.length} entries
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
        <div className="excellencia-dialog-backdrop" onClick={() => setShowForm(false)}>
          <div className="excellencia-dialog" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="excellencia-form-header">
              <div className="excellencia-form-header-content">
                <div className={`excellencia-form-avatar ${editingId ? 'edit' : ''}`}>
                </div>
                <div>
                  <h1 className="excellencia-form-title">
                    {editingId ? 'Edit Excellencia' : 'Create New Excellencia'}
                  </h1>
                  <p className="excellencia-form-subtitle">
                    {editingId ? 'Update this Excellencia entry' : 'Add a new Excellencia entry to your website'}
                  </p>
                </div>
              </div>

              <button
                className="excellencia-close-btn"
                onClick={() => setShowForm(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit}>
              <div className="excellencia-form-content">
                <div className="excellencia-form-container">

                  {/* Basic Information Section */}
                  <div className="excellencia-form-section">
                    <div className="excellencia-section-header">
                      <div className="excellencia-section-avatar info">
                      </div>
                      <div>
                        <h2 className="excellencia-section-title">
                          Excellencia Information
                        </h2>
                        <p className="excellencia-section-subtitle">
                          Provide the heading, description, and button for this entry
                        </p>
                      </div>
                    </div>

                    <div className="excellencia-form-field">
                      <label className="excellencia-form-label">
                        Heading *
                      </label>
                      <input
                        type="text"
                        className="excellencia-form-input"
                        placeholder="Enter a heading..."
                        value={formData.heading}
                        onChange={(e) => setFormData(prev => ({ ...prev, heading: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="excellencia-form-field">
                      <label className="excellencia-form-label">
                        Short Description *
                      </label>
                      <textarea
                        className="excellencia-form-input excellencia-form-textarea"
                        rows={3}
                        placeholder="Write a brief, compelling summary that will appear on the card..."
                        value={formData.short_description}
                        onChange={(e) => setFormData(prev => ({ ...prev, short_description: e.target.value }))}
                        required
                      />
                      <p className="excellencia-form-helper">
                        This description will be displayed on the Excellencia card on your website.
                      </p>
                    </div>

                    <div className="excellencia-form-field">
                      <label className="excellencia-form-label">
                        Button Text
                      </label>
                      <input
                        type="text"
                        className="excellencia-form-input"
                        placeholder="e.g. Learn More"
                        value={formData.button_text}
                        onChange={(e) => setFormData(prev => ({ ...prev, button_text: e.target.value }))}
                      />
                    </div>

                    <div className="excellencia-form-field">
                      <label className="excellencia-form-label">
                        Button URL
                      </label>
                      <input
                        type="text"
                        className="excellencia-form-input"
                        placeholder="e.g. /contact or https://example.com"
                        value={formData.button_url}
                        onChange={(e) => setFormData(prev => ({ ...prev, button_url: e.target.value }))}
                      />
                      <p className="excellencia-form-helper">
                        Can be an internal path (e.g. /contact) or a full external link.
                      </p>
                    </div>
                  </div>

                  {/* Image Upload Section */}
                  <div className="excellencia-form-section">
                    <div className="excellencia-section-header">
                      <div className="excellencia-section-avatar upload">
                      </div>
                      <div>
                        <h2 className="excellencia-section-title">
                          Excellencia Image
                        </h2>
                        <p className="excellencia-section-subtitle">
                          Upload the image shown on the card
                        </p>
                      </div>
                    </div>

                    <div className="excellencia-upload-grid excellencia-upload-grid-single">
                      <div className="excellencia-form-field">
                        <label className="excellencia-form-label">
                          Image
                        </label>
                        <div
                          className="excellencia-upload-zone image"
                          onClick={() => document.getElementById('excellencia-image-upload')?.click()}
                        >
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                            id="excellencia-image-upload"
                          />

                          <div className="excellencia-upload-avatar image">
                          </div>

                          <h3 className="excellencia-upload-title">
                            {formData.image ? 'Image Selected' : 'Upload Image'}
                          </h3>

                          {formData.image ? (
                            <div>
                              <p className="excellencia-upload-filename">
                                {formData.image.name}
                              </p>
                              <span className="excellencia-upload-chip size">
                                {(formData.image.size / 1024 / 1024).toFixed(2)} MB
                              </span>
                            </div>
                          ) : (
                            <div>
                              <p className="excellencia-upload-description">
                                Click to browse and select an image
                              </p>
                              <p className="excellencia-upload-hint">
                                {editingId
                                  ? 'Leave empty to keep the current image'
                                  : 'Shown as the visual for this entry'}
                              </p>
                              <span className="excellencia-upload-chip image">
                                Image files only
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Footer */}
              <div className="excellencia-form-footer">
                <div className="excellencia-form-footer-info">
                  <h4>
                    {editingId ? 'Updating existing entry' : 'Creating new entry'}
                  </h4>
                  <p>
                    Fields marked with * are required
                  </p>
                </div>

                <div className="excellencia-form-footer-actions">
                  <button
                    type="button"
                    className="excellencia-form-btn excellencia-form-btn-cancel"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="excellencia-form-btn excellencia-form-btn-submit"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <div className="excellencia-form-btn-loading">
                        <div className="excellencia-form-spinner"></div>
                        <span>Saving...</span>
                      </div>
                    ) : (
                      <span>{editingId ? 'Update Excellencia' : 'Create Excellencia'}</span>
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

export default AdminExcellencia;
