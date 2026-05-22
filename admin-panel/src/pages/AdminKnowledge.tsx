import React, { useState, useEffect } from 'react';
import './AdminKnowledge.css';

interface KnowledgeResource {
  id: string;
  title: string;
  short_description: string;
  content: string;
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
  image: File | null;
  pdf: File | null;
}

const AdminKnowledge: React.FC = () => {
  const [knowledgeResources, setKnowledgeResources] = useState<KnowledgeResource[]>([]);
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
    image: null,
    pdf: null
  });

  const API_BASE = 'http://localhost:8000';

  // Fetch knowledge resources
  const fetchKnowledgeResources = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/knowledge/`);
      if (response.ok) {
        const data = await response.json();
        setKnowledgeResources(data);
      }
    } catch (error) {
      console.error('Error fetching knowledge resources:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKnowledgeResources();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.short_description || !formData.content) {
      return;
    }

    if (!editingId && (!formData.image || !formData.pdf)) {
      return;
    }

    setSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('short_description', formData.short_description);
      formDataToSend.append('content', formData.content);
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }
      if (formData.pdf) {
        formDataToSend.append('pdf', formData.pdf);
      }

      let response;
      if (editingId) {
        formDataToSend.append('edited_by', 'Admin User');
        response = await fetch(`${API_BASE}/knowledge/${editingId}`, {
          method: 'PUT',
          body: formDataToSend,
        });
      } else {
        response = await fetch(`${API_BASE}/knowledge/upload`, {
          method: 'POST',
          body: formDataToSend,
        });
      }

      if (response.ok) {
        resetForm();
        fetchKnowledgeResources();
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
      content: '',
      image: null,
      pdf: null
    });
    setEditingId(null);
  };

  // Handle edit
  const handleEdit = (resource: KnowledgeResource) => {
    setFormData({
      title: resource.title,
      short_description: resource.short_description,
      content: resource.content,
      image: null,
      pdf: null
    });
    setEditingId(resource.id);
    setShowForm(true);
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this knowledge resource?')) return;

    try {
      const response = await fetch(`${API_BASE}/knowledge/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchKnowledgeResources();
      }
    } catch (error) {
      console.error('Error deleting knowledge resource:', error);
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

  // Filter resources based on search
  const filteredResources = knowledgeResources.filter(resource =>
    resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.short_description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const paginatedResources = filteredResources.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const totalPages = Math.ceil(filteredResources.length / rowsPerPage);

  return (
    <div className="knowledge-container">
      {/* Header */}
      <div className="knowledge-header">
        <h1 className="knowledge-title">Knowledge Resources</h1>
        <p className="knowledge-subtitle">
          Create and manage knowledge resources for your website
        </p>
      </div>

      {/* Action Bar */}
      <div className="knowledge-action-bar">
        <div className="knowledge-search">
          <input
            type="text"
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="knowledge-actions">
          <button 
            className="knowledge-btn knowledge-btn-icon icon-refresh"
            onClick={fetchKnowledgeResources}
            title="Refresh"
          >
          </button>
          
          <button
            className="knowledge-btn knowledge-btn-primary"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
          >
            <span className="icon-plus"></span>
            Add Resource
          </button>
        </div>
      </div>

      {/* Resources Table */}
      <div className="knowledge-main-card">
        <div className="knowledge-gradient-header">
          <div className="knowledge-header-content">
            <div className="knowledge-header-avatar">
            </div>
            <div className="knowledge-header-text">
              <h3>Knowledge Resources</h3>
              <p>{filteredResources.length} total resources</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="knowledge-loading">
            <div className="knowledge-spinner"></div>
          </div>
        ) : (
          <>
            <div className="knowledge-table-container">
              <table className="knowledge-table">
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
                  {paginatedResources.map((resource) => (
                    <tr key={resource.id}>
                      <td>
                        <h4 className="knowledge-table-title">
                          {resource.title}
                        </h4>
                      </td>
                      <td>
                        <p className="knowledge-table-description">
                          {resource.short_description}
                        </p>
                      </td>
                      <td>
                        <span className="knowledge-table-date">
                          {new Date(resource.created_at).toLocaleDateString()}
                        </span>
                      </td>
                      <td>
                        <span 
                          className={`knowledge-status-chip ${
                            resource.last_edited_at ? 'knowledge-status-updated' : 'knowledge-status-published'
                          }`}
                        >
                          {resource.last_edited_at ? 'Updated' : 'Published'}
                        </span>
                      </td>
                      <td>
                        <div className="knowledge-table-actions">
                          <button
                            className="knowledge-action-btn knowledge-action-edit"
                            onClick={() => handleEdit(resource)}
                            title="Edit"
                          >
                          </button>
                          <button
                            className="knowledge-action-btn knowledge-action-delete"
                            onClick={() => handleDelete(resource.id)}
                            title="Delete"
                          >
                          </button>
                          <a
                            href={`${API_BASE}/knowledge/pdf/${resource.pdf_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="knowledge-action-btn knowledge-action-download"
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
            <div className="knowledge-pagination">
              <div>
                Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, filteredResources.length)} of {filteredResources.length} resources
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
        <div className="knowledge-dialog-backdrop" onClick={() => setShowForm(false)}>
          <div className="knowledge-dialog" onClick={(e) => e.stopPropagation()}>
            {/* Stunning Header */}
            <div className="knowledge-form-header">
              <div className="knowledge-form-header-content">
                <div className={`knowledge-form-avatar ${editingId ? 'edit' : ''}`}>
                </div>
                <div>
                  <h1 className="knowledge-form-title">
                    {editingId ? 'Edit Resource' : 'Create New Resource'}
                  </h1>
                  <p className="knowledge-form-subtitle">
                    {editingId ? 'Update your knowledge resource information' : 'Add a new knowledge resource to your library'}
                  </p>
                </div>
              </div>
              
              <button
                className="knowledge-close-btn"
                onClick={() => setShowForm(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit}>
              <div className="knowledge-form-content">
                <div className="knowledge-form-container">
                  
                  {/* Basic Information Section */}
                  <div className="knowledge-form-section">
                    <div className="knowledge-section-header">
                      <div className="knowledge-section-avatar info">
                      </div>
                      <div>
                        <h2 className="knowledge-section-title">
                          Resource Information
                        </h2>
                        <p className="knowledge-section-subtitle">
                          Provide the basic details for your knowledge resource
                        </p>
                      </div>
                    </div>

                    <div className="knowledge-form-field">
                      <label className="knowledge-form-label">
                        Resource Title *
                      </label>
                      <input
                        type="text"
                        className="knowledge-form-input"
                        placeholder="Enter a compelling title that captures the essence of your resource..."
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="knowledge-form-field">
                      <label className="knowledge-form-label">
                        Short Description *
                      </label>
                      <textarea
                        className="knowledge-form-input knowledge-form-textarea"
                        rows={3}
                        placeholder="Write a brief, compelling summary that will appear on resource cards and attract users to learn more..."
                        value={formData.short_description}
                        onChange={(e) => setFormData(prev => ({ ...prev, short_description: e.target.value }))}
                        required
                      />
                      <p className="knowledge-form-helper">
                        This description will be displayed on the resource cards. Keep it engaging and informative.
                      </p>
                    </div>

                    <div className="knowledge-form-field">
                      <label className="knowledge-form-label">
                        Full Content *
                      </label>
                      <textarea
                        className="knowledge-form-input knowledge-form-textarea"
                        rows={8}
                        placeholder="Provide comprehensive, valuable content that users will see when they open the resource modal. Include detailed information, insights, and actionable guidance..."
                        value={formData.content}
                        onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                        required
                      />
                      <p className="knowledge-form-helper">
                        This is the main content that users will read. Make it informative and valuable.
                      </p>
                    </div>
                  </div>

                  {/* File Upload Section */}
                  <div className="knowledge-form-section">
                    <div className="knowledge-section-header">
                      <div className="knowledge-section-avatar upload">
                      </div>
                      <div>
                        <h2 className="knowledge-section-title">
                          Resource Files
                        </h2>
                        <p className="knowledge-section-subtitle">
                          Upload the visual and document files for your resource
                        </p>
                      </div>
                    </div>
                    
                    <div className="knowledge-upload-grid">
                      {/* Image Upload */}
                      <div className="knowledge-form-field">
                        <label className="knowledge-form-label">
                          Resource Image {!editingId && '*'}
                        </label>
                        <div 
                          className="knowledge-upload-zone"
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
                          
                          <div className="knowledge-upload-avatar image">
                          </div>
                          
                          <h3 className="knowledge-upload-title">
                            {formData.image ? 'Image Selected' : 'Upload Image'}
                          </h3>
                          
                          {formData.image ? (
                            <div>
                              <p className="knowledge-upload-filename">
                                {formData.image.name}
                              </p>
                              <span className="knowledge-upload-chip size">
                                {(formData.image.size / 1024 / 1024).toFixed(2)} MB
                              </span>
                            </div>
                          ) : (
                            <div>
                              <p className="knowledge-upload-description">
                                Click to browse and select an image file
                              </p>
                              <p className="knowledge-upload-hint">
                                Recommended: High-quality images (JPG, PNG, WebP)
                              </p>
                              {/* <span className="knowledge-upload-chip image">
                                Max size: 10MB
                              </span> */}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* PDF Upload */}
                      <div className="knowledge-form-field">
                        <label className="knowledge-form-label">
                          Resource PDF {!editingId && '*'}
                        </label>
                        <div 
                          className="knowledge-upload-zone pdf"
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
                          
                          <div className="knowledge-upload-avatar pdf">
                          </div>
                          
                          <h3 className="knowledge-upload-title">
                            {formData.pdf ? 'PDF Selected' : 'Upload PDF'}
                          </h3>
                          
                          {formData.pdf ? (
                            <div>
                              <p className="knowledge-upload-filename">
                                {formData.pdf.name}
                              </p>
                              <span className="knowledge-upload-chip pdf-size">
                                {(formData.pdf.size / 1024 / 1024).toFixed(2)} MB
                              </span>
                            </div>
                          ) : (
                            <div>
                              <p className="knowledge-upload-description">
                                Click to browse and select a PDF document
                              </p>
                              <p className="knowledge-upload-hint">
                                This will be available for download by users
                              </p>
                              <span className="knowledge-upload-chip pdf">
                                PDF files only
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {!editingId && (
                      <div className="knowledge-upload-required">
                        <p className="knowledge-upload-required-text">
                          Both image and PDF files are required for new resources
                        </p>
                      </div>
                    )}
                  </div>

                </div>
              </div>

              {/* Beautiful Footer */}
              <div className="knowledge-form-footer">
                <div className="knowledge-form-footer-info">
                  <h4>
                    {editingId ? 'Updating existing resource' : 'Creating new resource'}
                  </h4>
                  <p>
                    All fields marked with * are required
                  </p>
                </div>
                
                <div className="knowledge-form-footer-actions">
                  <button
                    type="button"
                    className="knowledge-form-btn knowledge-form-btn-cancel"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                  
                  <button
                    type="submit"
                    className="knowledge-form-btn knowledge-form-btn-submit"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <div className="knowledge-form-btn-loading">
                        <div className="knowledge-form-spinner"></div>
                        <span>Saving...</span>
                      </div>
                    ) : (
                      <span>{editingId ? 'Update Resource' : 'Create Resource'}</span>
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

export default AdminKnowledge;