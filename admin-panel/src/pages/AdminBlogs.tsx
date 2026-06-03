import React, { useState, useEffect } from 'react';
import './AdminBlogs.css';

interface Blog {
  id: string;
  title: string;
  short_description: string;
  content: string;
  author: string;
  category: string;
  publish_date: string;
  image_id: string;
  created_at: string;
  last_edited_by?: string;
  last_edited_at?: string;
}

interface FormData {
  title: string;
  short_description: string;
  content: string;
  author: string;
  category: string;
  publish_date: string;
  image: File | null;
}

const AdminBlogs: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
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
    category: '',
    publish_date: '',
    image: null
  });

  // const API_BASE = 'http://localhost:8000';
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string
  console.log("API Base URL", API_BASE_URL)

  // Blog categories
  const categories = [
    'Technology',
    'Business',
    'Finance',
    'Healthcare',
    'Education',
    'Marketing',
    'Legal',
    'Industry News',
    'Case Studies',
    'Best Practices'
  ];

  // Fetch blogs
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/blogs/`);
      if (response.ok) {
        const data = await response.json();
        setBlogs(data);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.short_description || !formData.content || !formData.author || !formData.category) {
      return;
    }

    if (!editingId && !formData.image) {
      return;
    }

    setSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('short_description', formData.short_description);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('author', formData.author);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('publish_date', formData.publish_date || new Date().toISOString().split('T')[0]);
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      let response;
      if (editingId) {
        formDataToSend.append('edited_by', 'Admin User');
        response = await fetch(`${API_BASE_URL}/blogs/${editingId}`, {
          method: 'PUT',
          body: formDataToSend,
        });
      } else {
        response = await fetch(`${API_BASE_URL}/blogs/`, {
          method: 'POST',
          body: formDataToSend,
        });
      }

      if (response.ok) {
        resetForm();
        fetchBlogs();
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
      author: '',
      category: '',
      publish_date: '',
      image: null
    });
    setEditingId(null);
  };

  // Handle edit
  const handleEdit = (blog: Blog) => {
    setFormData({
      title: blog.title,
      short_description: blog.short_description,
      content: blog.content,
      author: blog.author || '',
      category: blog.category || '',
      publish_date: blog.publish_date || '',
      image: null
    });
    setEditingId(blog.id);
    setShowForm(true);
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchBlogs();
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  // Handle file change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
    }
  };

  // Filter blogs based on search
  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.short_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (blog.author && blog.author.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (blog.category && blog.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Pagination
  const paginatedBlogs = filteredBlogs.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const totalPages = Math.ceil(filteredBlogs.length / rowsPerPage);

  return (
    <div className="blogs-container">
      {/* Header */}
      <div className="blogs-header">
        <h1 className="blogs-title">Blog Posts</h1>
        <p className="blogs-subtitle">
          Create and manage blog posts for your website
        </p>
      </div>

      {/* Action Bar */}
      <div className="blogs-action-bar">
        <div className="blogs-search">
          <input
            type="text"
            placeholder="Search blog posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="blogs-actions">
          <button 
            className="blogs-btn blogs-btn-icon icon-refresh"
            onClick={fetchBlogs}
            title="Refresh"
          >
          </button>
          
          <button
            className="blogs-btn blogs-btn-primary"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
          >
            <span className="icon-plus"></span>
            Add Blog Post
          </button>
        </div>
      </div>

      {/* Blogs Table */}
      <div className="blogs-main-card">
        <div className="blogs-gradient-header">
          <div className="blogs-header-content">
            <div className="blogs-header-avatar">
            </div>
            <div className="blogs-header-text">
              <h3>Blog Posts</h3>
              <p>{filteredBlogs.length} total blog posts</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="blogs-loading">
            <div className="blogs-spinner"></div>
          </div>
        ) : (
          <>
            <div className="blogs-table-container">
              <table className="blogs-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Author</th>
                    <th>Category</th>
                    <th>Published</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedBlogs.map((blog) => (
                    <tr key={blog.id}>
                      <td>
                        <h4 className="blogs-table-title">
                          {blog.title}
                        </h4>
                      </td>
                      <td>
                        <p className="blogs-table-description">
                          {blog.short_description}
                        </p>
                      </td>
                      <td>
                        <span className="blogs-table-author">
                          {blog.author || 'Unknown'}
                        </span>
                      </td>
                      <td>
                        <span className="blogs-category-chip">
                          {blog.category || 'Uncategorized'}
                        </span>
                      </td>
                      <td>
                        <span className="blogs-table-date">
                          {blog.publish_date ? new Date(blog.publish_date).toLocaleDateString() : 'Not set'}
                        </span>
                      </td>
                      <td>
                        <span 
                          className={`blogs-status-chip ${
                            blog.last_edited_at ? 'blogs-status-updated' : 'blogs-status-published'
                          }`}
                        >
                          {blog.last_edited_at ? 'Updated' : 'Published'}
                        </span>
                      </td>
                      <td>
                        <div className="blogs-table-actions">
                          <button
                            className="blogs-action-btn blogs-action-edit"
                            onClick={() => handleEdit(blog)}
                            title="Edit"
                          >
                          </button>
                          <button
                            className="blogs-action-btn blogs-action-delete"
                            onClick={() => handleDelete(blog.id)}
                            title="Delete"
                          >
                          </button>
                          <a
                            href={`${API_BASE_URL}/blogs/image/${blog.image_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="blogs-action-btn blogs-action-view"
                            title="View Image"
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
            <div className="blogs-pagination">
              <div>
                Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, filteredBlogs.length)} of {filteredBlogs.length} blog posts
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
        <div className="blogs-dialog-backdrop" onClick={() => setShowForm(false)}>
          <div className="blogs-dialog" onClick={(e) => e.stopPropagation()}>
            {/* Stunning Header */}
            <div className="blogs-form-header">
              <div className="blogs-form-header-content">
                <div className={`blogs-form-avatar ${editingId ? 'edit' : ''}`}>
                </div>
                <div>
                  <h1 className="blogs-form-title">
                    {editingId ? 'Edit Blog Post' : 'Create New Blog Post'}
                  </h1>
                  <p className="blogs-form-subtitle">
                    {editingId ? 'Update your blog post information' : 'Add a new blog post to your website'}
                  </p>
                </div>
              </div>
              
              <button
                className="blogs-close-btn"
                onClick={() => setShowForm(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit}>
              <div className="blogs-form-content">
                <div className="blogs-form-container">
                  
                  {/* Basic Information Section */}
                  <div className="blogs-form-section">
                    <div className="blogs-section-header">
                      <div className="blogs-section-avatar info">
                      </div>
                      <div>
                        <h2 className="blogs-section-title">
                          Blog Post Information
                        </h2>
                        <p className="blogs-section-subtitle">
                          Provide the basic details for your blog post
                        </p>
                      </div>
                    </div>

                    <div className="blogs-form-field">
                      <label className="blogs-form-label">
                        Blog Title *
                      </label>
                      <input
                        type="text"
                        className="blogs-form-input"
                        placeholder="Enter a compelling title for your blog post..."
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="blogs-form-field">
                      <label className="blogs-form-label">
                        Short Description *
                      </label>
                      <textarea
                        className="blogs-form-input blogs-form-textarea"
                        rows={3}
                        placeholder="Write a brief, compelling summary that will appear on blog cards..."
                        value={formData.short_description}
                        onChange={(e) => setFormData(prev => ({ ...prev, short_description: e.target.value }))}
                        required
                      />
                      <p className="blogs-form-helper">
                        This description will be displayed on the blog cards. Keep it engaging and informative.
                      </p>
                    </div>

                    <div className="blogs-form-field">
                      <label className="blogs-form-label">
                        Full Content *
                      </label>
                      <textarea
                        className="blogs-form-input blogs-form-textarea"
                        rows={8}
                        placeholder="Write comprehensive, valuable content for your blog post. Include detailed information, insights, and engaging storytelling..."
                        value={formData.content}
                        onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                        required
                      />
                      <p className="blogs-form-helper">
                        This is the main content that readers will see. Make it informative and engaging.
                      </p>
                    </div>

                    <div className="blogs-form-grid">
                      <div className="blogs-form-field">
                        <label className="blogs-form-label">
                          Author *
                        </label>
                        <input
                          type="text"
                          className="blogs-form-input"
                          placeholder="Enter author name..."
                          value={formData.author}
                          onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                          required
                        />
                      </div>

                      <div className="blogs-form-field">
                        <label className="blogs-form-label">
                          Category *
                        </label>
                        <select
                          className="blogs-form-select"
                          value={formData.category}
                          onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                          required
                        >
                          <option value="">Select a category...</option>
                          {categories.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="blogs-form-field">
                        <label className="blogs-form-label">
                          Publish Date
                        </label>
                        <input
                          type="date"
                          className="blogs-form-input"
                          value={formData.publish_date}
                          onChange={(e) => setFormData(prev => ({ ...prev, publish_date: e.target.value }))}
                        />
                        <p className="blogs-form-helper">
                          Leave empty to use current date
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Image Upload Section */}
                  <div className="blogs-form-section">
                    <div className="blogs-section-header">
                      <div className="blogs-section-avatar upload">
                      </div>
                      <div>
                        <h2 className="blogs-section-title">
                          Featured Image
                        </h2>
                        <p className="blogs-section-subtitle">
                          Upload a featured image for your blog post
                        </p>
                      </div>
                    </div>
                    
                    <div className="blogs-form-field">
                      <label className="blogs-form-label">
                        Blog Image {!editingId && '*'}
                      </label>
                      <div 
                        className="blogs-upload-zone"
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
                        
                        <div className="blogs-upload-avatar">
                        </div>
                        
                        <h3 className="blogs-upload-title">
                          {formData.image ? 'Image Selected' : 'Upload Featured Image'}
                        </h3>
                        
                        {formData.image ? (
                          <div>
                            <p className="blogs-upload-filename">
                              {formData.image.name}
                            </p>
                            <span className="blogs-upload-chip size">
                              {(formData.image.size / 1024 / 1024).toFixed(2)} MB
                            </span>
                          </div>
                        ) : (
                          <div>
                            <p className="blogs-upload-description">
                              Click to browse and select an image file
                            </p>
                            <p className="blogs-upload-hint">
                              Recommended: High-quality images (JPG, PNG, WebP) - 1200x630px for best results
                            </p>
                            <span className="blogs-upload-chip">
                              Max size: 10MB
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {!editingId && (
                      <div className="blogs-upload-required">
                        <p className="blogs-upload-required-text">
                          Featured image is required for new blog posts
                        </p>
                      </div>
                    )}
                  </div>

                </div>
              </div>

              {/* Beautiful Footer */}
              <div className="blogs-form-footer">
                <div className="blogs-form-footer-info">
                  <h4>
                    {editingId ? 'Updating existing blog post' : 'Creating new blog post'}
                  </h4>
                  <p>
                    All fields marked with * are required
                  </p>
                </div>
                
                <div className="blogs-form-footer-actions">
                  <button
                    type="button"
                    className="blogs-form-btn blogs-form-btn-cancel"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                  
                  <button
                    type="submit"
                    className="blogs-form-btn blogs-form-btn-submit"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <div className="blogs-form-btn-loading">
                        <div className="blogs-form-spinner"></div>
                        <span>Saving...</span>
                      </div>
                    ) : (
                      <span>{editingId ? 'Update Blog Post' : 'Create Blog Post'}</span>
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

export default AdminBlogs;