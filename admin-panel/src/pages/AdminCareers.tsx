import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import './AdminCareers.css';

type JobStatus = 'draft' | 'open' | 'closed';
type ApplicationStatus = 'new' | 'reviewing' | 'shortlisted' | 'rejected' | 'hired';

type Job = {
  id: string;
  title: string;
  department: string;
  location: string;
  employment_type: string;
  experience: string;
  description: string;
  status: JobStatus;
  created_at: string;
};

type Application = {
  id: string;
  job_id?: string;
  job_title?: string;
  full_name: string;
  email: string;
  phone: string;
  current_location?: string;
  experience_years?: string;
  resume_file_id?: string;
  resume_filename?: string;
  resume_content_type?: string;
  resume_size?: number;
  cover_letter?: string;
  place_of_residence?: string;
  highest_qualification?: string;
  highest_qualification_other?: string;
  profile?: string;
  profile_other?: string;
  current_ctc?: string;
  expected_ctc?: string;
  how_heard?: string;
  how_heard_detail?: string;
  status: ApplicationStatus;
  created_at: string;
};

type JobForm = Omit<Job, 'id' | 'created_at'>;

const initialJobForm: JobForm = {
  title: '',
  department: '',
  location: '',
  employment_type: 'Full Time',
  experience: '',
  description: '',
  status: 'open',
};

const APPLICATION_STATUSES: ApplicationStatus[] = ['new', 'reviewing', 'shortlisted', 'rejected', 'hired'];

const formatApiError = (payload: unknown) => {
  if (!payload || typeof payload !== 'object') return 'Unable to save vacancy.';
  const detail = (payload as { detail?: unknown }).detail;

  if (typeof detail === 'string') return detail;
  if (!Array.isArray(detail)) return 'Unable to save vacancy.';

  return detail
    .map((item) => {
      if (!item || typeof item !== 'object') return '';
      const issue = item as { loc?: unknown[]; msg?: string };
      const field = Array.isArray(issue.loc) ? String(issue.loc[issue.loc.length - 1]) : 'field';
      return issue.msg ? `${field}: ${issue.msg}` : '';
    })
    .filter(Boolean)
    .join(' ');
};

const AdminCareers: React.FC = () => {
  const { token } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [tab, setTab] = useState<0 | 1>(0);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<JobForm>(initialJobForm);
  const [message, setMessage] = useState('');
  const [selectedJobFilter, setSelectedJobFilter] = useState('all');
  const [viewApplication, setViewApplication] = useState<Application | null>(null);
  const [vacancySearch, setVacancySearch] = useState('');
  const [applicationSearch, setApplicationSearch] = useState('');

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

  const fetchCareers = async () => {
    try {
      setLoading(true);
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      const [jobsResponse, applicationsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/careers/admin/jobs`, { headers }),
        fetch(`${API_BASE_URL}/careers/admin/applications`, { headers }),
      ]);

      if (jobsResponse.ok) setJobs(await jobsResponse.json());
      if (applicationsResponse.ok) setApplications(await applicationsResponse.json());
    } catch (error) {
      console.error('Unable to load careers data', error);
      setMessage('Unable to load careers data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // The admin pages in this app fetch their table data on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCareers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCreateDialog = () => {
    setEditingId(null);
    setFormData(initialJobForm);
    setDialogOpen(true);
  };

  const openEditDialog = (job: Job) => {
    setEditingId(job.id);
    setFormData({
      title: job.title,
      department: job.department,
      location: job.location,
      employment_type: job.employment_type,
      experience: job.experience,
      description: job.description,
      status: job.status,
    });
    setDialogOpen(true);
  };

  const updateForm = (field: keyof JobForm, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const saveJob = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch(
        editingId ? `${API_BASE_URL}/careers/admin/jobs/${editingId}` : `${API_BASE_URL}/careers/admin/jobs`,
        {
          method: editingId ? 'PUT' : 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        },
      );

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => null);
        throw new Error(formatApiError(errorPayload));
      }

      setDialogOpen(false);
      setMessage(editingId ? 'Vacancy updated successfully.' : 'Vacancy posted successfully.');
      fetchCareers();
    } catch (error) {
      console.error('Unable to save job', error);
      setMessage(error instanceof Error ? error.message : 'Unable to save vacancy.');
    }
  };

  const deleteJob = async (jobId: string) => {
    if (!confirm('Delete this vacancy? Applications will remain stored.')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/careers/admin/jobs/${jobId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setMessage('Vacancy deleted successfully.');
        fetchCareers();
      }
    } catch (error) {
      console.error('Unable to delete job', error);
      setMessage('Unable to delete vacancy.');
    }
  };

  const updateApplicationStatus = async (applicationId: string, status: ApplicationStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/careers/admin/applications/${applicationId}/status`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        const updated = await response.json();
        setApplications((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      }
    } catch (error) {
      console.error('Unable to update application', error);
      setMessage('Unable to update application status.');
    }
  };

  const fetchResumeBlob = async (application: Application) => {
    const response = await fetch(`${API_BASE_URL}/careers/admin/applications/${application.id}/resume`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Resume fetch failed');
    return response.blob();
  };

  const openResume = async (application: Application) => {
    try {
      const blob = await fetchResumeBlob(application);
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank', 'noopener,noreferrer');
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (error) {
      console.error('Unable to open resume', error);
      setMessage('Unable to open resume.');
    }
  };

  /** Forces an actual file download rather than an inline browser preview,
      regardless of the response's Content-Disposition header, by driving
      the save through a same-origin blob: URL and a synthetic <a download>. */
  const downloadResume = async (application: Application) => {
    try {
      const blob = await fetchResumeBlob(application);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = application.resume_filename || `${application.full_name.replace(/\s+/g, '_')}_resume.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (error) {
      console.error('Unable to download resume', error);
      setMessage('Unable to download resume.');
    }
  };

  const filteredApplications = useMemo(() => {
    let list = applications;
    if (selectedJobFilter === 'general') list = list.filter((application) => !application.job_id);
    else if (selectedJobFilter !== 'all') list = list.filter((application) => application.job_id === selectedJobFilter);

    const q = applicationSearch.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (application) =>
          application.full_name.toLowerCase().includes(q) ||
          application.email.toLowerCase().includes(q) ||
          (application.job_title || '').toLowerCase().includes(q),
      );
    }
    return list;
  }, [applications, selectedJobFilter, applicationSearch]);

  const filteredJobs = useMemo(() => {
    const q = vacancySearch.trim().toLowerCase();
    if (!q) return jobs;
    return jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(q) ||
        job.department.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q),
    );
  }, [jobs, vacancySearch]);

  const withOther = (value?: string, other?: string) => {
    if (!value) return '—';
    return other ? `${value} (${other})` : value;
  };

  const openJobs = jobs.filter((job) => job.status === 'open').length;

  return (
    <div className="careers-container">
      <div className="careers-header">
        <div>
          <h1 className="careers-title">Careers</h1>
          <p className="careers-subtitle">Post vacancies and review candidate applications from the website.</p>
        </div>
        <div className="careers-header-actions">
          <Button variant="outlined" onClick={fetchCareers}>Refresh</Button>
          <Button variant="contained" onClick={openCreateDialog}>Post Vacancy</Button>
        </div>
      </div>

      {message && (
        <Alert severity={message.includes('successfully') ? 'success' : 'error'} onClose={() => setMessage('')} sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      <div className="careers-stats-row">
        <div className="careers-stat-card">
          <p className="careers-stat-label">Total Vacancies</p>
          <p className="careers-stat-value">{jobs.length}</p>
        </div>
        <div className="careers-stat-card">
          <p className="careers-stat-label">Open Vacancies</p>
          <p className="careers-stat-value">{openJobs}</p>
        </div>
        <div className="careers-stat-card">
          <p className="careers-stat-label">Applications</p>
          <p className="careers-stat-value">{applications.length}</p>
        </div>
      </div>

      <div className="careers-main-card">
        <div className="careers-tabs-row">
          {(['Vacancies', 'Applications'] as const).map((label, idx) => (
            <button
              key={label}
              className={`careers-tab-btn ${tab === idx ? 'active' : ''}`}
              onClick={() => setTab(idx as 0 | 1)}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === 0 && (
          <div className="careers-tabs-bar">
            <div className="careers-search">
              <input
                type="text"
                placeholder="Search vacancies by title, department, location…"
                value={vacancySearch}
                onChange={(e) => setVacancySearch(e.target.value)}
              />
            </div>
            <span className="careers-result-count">{filteredJobs.length} vacancies</span>
          </div>
        )}

        {tab === 1 && (
          <div className="careers-tabs-bar">
            <div className="careers-search">
              <input
                type="text"
                placeholder="Search candidates by name, email…"
                value={applicationSearch}
                onChange={(e) => setApplicationSearch(e.target.value)}
              />
            </div>
            <div className="careers-filter">
              <select value={selectedJobFilter} onChange={(e) => setSelectedJobFilter(e.target.value)}>
                <option value="all">All vacancies</option>
                <option value="general">General Applications</option>
                {jobs.map((job) => <option key={job.id} value={job.id}>{job.title}</option>)}
              </select>
            </div>
          </div>
        )}

        {loading ? (
          <div className="careers-loading"><div className="careers-spinner" /></div>
        ) : tab === 0 ? (
          filteredJobs.length === 0 ? (
            <div className="careers-empty">
              <h3>No vacancies found</h3>
              <p>Post your first vacancy to start receiving applications from the website.</p>
            </div>
          ) : (
            <div className="careers-table-scroll">
              <table className="careers-table">
                <thead>
                  <tr>
                    <th>Role</th>
                    <th>Location</th>
                    <th>Type</th>
                    <th>Experience</th>
                    <th>Status</th>
                    <th>Posted</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredJobs.map((job) => (
                    <tr key={job.id}>
                      <td>
                        <p className="cell-primary">{job.title}</p>
                        <p className="cell-secondary">{job.department}</p>
                      </td>
                      <td>{job.location}</td>
                      <td>{job.employment_type}</td>
                      <td>{job.experience}</td>
                      <td><span className={`status-pill ${job.status}`}>{job.status}</span></td>
                      <td>{new Date(job.created_at).toLocaleDateString()}</td>
                      <td>
                        <div className="cell-actions">
                          <button className="link-btn edit" onClick={() => openEditDialog(job)}>Edit</button>
                          <button className="link-btn delete" onClick={() => deleteJob(job.id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : filteredApplications.length === 0 ? (
          <div className="careers-empty">
            <h3>No applications found</h3>
            <p>Candidate applications submitted from the website will appear here.</p>
          </div>
        ) : (
          <div className="careers-table-scroll">
            <table className="careers-table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Vacancy</th>
                  <th>Qualification / Profile</th>
                  <th>Resume</th>
                  <th>Status</th>
                  <th>Applied</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((application) => (
                  <tr key={application.id}>
                    <td>
                      <p className="cell-primary">{application.full_name}</p>
                      <p className="cell-secondary">{application.email}</p>
                      <p className="cell-secondary">{application.phone}</p>
                    </td>
                    <td>{application.job_title || 'General Application'}</td>
                    <td>
                      <p className="cell-primary" style={{ fontWeight: 500 }}>{withOther(application.highest_qualification, application.highest_qualification_other)}</p>
                      <p className="cell-secondary">{withOther(application.profile, application.profile_other)}</p>
                    </td>
                    <td>
                      {application.resume_file_id ? (
                        <div className="resume-cell">
                          <span className="resume-filename" title={application.resume_filename}>{application.resume_filename || 'resume.pdf'}</span>
                          <div className="cell-actions">
                            <button className="link-btn view" onClick={() => openResume(application)}>View</button>
                            <button className="link-btn download" onClick={() => downloadResume(application)}>Download</button>
                          </div>
                        </div>
                      ) : '—'}
                    </td>
                    <td>
                      <div className="status-select-wrap">
                        <select
                          className={`status-pill ${application.status}`}
                          value={application.status}
                          onChange={(e) => updateApplicationStatus(application.id, e.target.value as ApplicationStatus)}
                        >
                          {APPLICATION_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
                        </select>
                      </div>
                    </td>
                    <td>{new Date(application.created_at).toLocaleDateString()}</td>
                    <td>
                      <button className="link-btn view" onClick={() => setViewApplication(application)}>View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingId ? 'Edit Vacancy' : 'Post New Vacancy'}</DialogTitle>
        <form onSubmit={saveJob}>
          <DialogContent>
            <Stack spacing={2}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField label="Job Title" value={formData.title} onChange={(e) => updateForm('title', e.target.value)} required fullWidth />
                <TextField label="Department" value={formData.department} onChange={(e) => updateForm('department', e.target.value)} required fullWidth />
              </Stack>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField label="Location" value={formData.location} onChange={(e) => updateForm('location', e.target.value)} required fullWidth />
                <TextField label="Employment Type" value={formData.employment_type} onChange={(e) => updateForm('employment_type', e.target.value)} required fullWidth />
              </Stack>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField label="Experience" value={formData.experience} onChange={(e) => updateForm('experience', e.target.value)} required fullWidth />
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select value={formData.status} label="Status" onChange={(e) => updateForm('status', e.target.value)}>
                    <MenuItem value="draft">Draft</MenuItem>
                    <MenuItem value="open">Open</MenuItem>
                    <MenuItem value="closed">Closed</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
              <TextField label="Role Description" value={formData.description} onChange={(e) => updateForm('description', e.target.value)} required fullWidth multiline minRows={4} />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">{editingId ? 'Update Vacancy' : 'Post Vacancy'}</Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={!!viewApplication} onClose={() => setViewApplication(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Application Details</DialogTitle>
        {viewApplication && (
          <DialogContent>
            <Stack spacing={1.5} sx={{ pt: 1 }}>
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ color: '#6b7280', fontSize: 13 }}>Full Name</Typography>
                <Typography sx={{ fontWeight: 600, textAlign: 'right' }}>{viewApplication.full_name}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ color: '#6b7280', fontSize: 13 }}>Email</Typography>
                <Typography sx={{ textAlign: 'right' }}>{viewApplication.email}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ color: '#6b7280', fontSize: 13 }}>Contact Number</Typography>
                <Typography sx={{ textAlign: 'right' }}>{viewApplication.phone}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ color: '#6b7280', fontSize: 13 }}>Vacancy</Typography>
                <Typography sx={{ textAlign: 'right' }}>{viewApplication.job_title || 'General Application'}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ color: '#6b7280', fontSize: 13 }}>Place of Residence</Typography>
                <Typography sx={{ textAlign: 'right' }}>{viewApplication.place_of_residence || '—'}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ color: '#6b7280', fontSize: 13 }}>Highest Qualification</Typography>
                <Typography sx={{ textAlign: 'right' }}>{withOther(viewApplication.highest_qualification, viewApplication.highest_qualification_other)}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ color: '#6b7280', fontSize: 13 }}>Profile</Typography>
                <Typography sx={{ textAlign: 'right' }}>{withOther(viewApplication.profile, viewApplication.profile_other)}</Typography>
              </Stack>
              {viewApplication.current_ctc && (
                <Stack direction="row" justifyContent="space-between">
                  <Typography sx={{ color: '#6b7280', fontSize: 13 }}>Current CTC</Typography>
                  <Typography sx={{ textAlign: 'right' }}>{viewApplication.current_ctc}</Typography>
                </Stack>
              )}
              {viewApplication.expected_ctc && (
                <Stack direction="row" justifyContent="space-between">
                  <Typography sx={{ color: '#6b7280', fontSize: 13 }}>Expected CTC</Typography>
                  <Typography sx={{ textAlign: 'right' }}>{viewApplication.expected_ctc}</Typography>
                </Stack>
              )}
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ color: '#6b7280', fontSize: 13 }}>How They Heard About Us</Typography>
                <Typography sx={{ textAlign: 'right' }}>{withOther(viewApplication.how_heard, viewApplication.how_heard_detail)}</Typography>
              </Stack>
              {viewApplication.experience_years && (
                <Stack direction="row" justifyContent="space-between">
                  <Typography sx={{ color: '#6b7280', fontSize: 13 }}>Experience</Typography>
                  <Typography sx={{ textAlign: 'right' }}>{viewApplication.experience_years}</Typography>
                </Stack>
              )}
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ color: '#6b7280', fontSize: 13 }}>Applied</Typography>
                <Typography sx={{ textAlign: 'right' }}>{new Date(viewApplication.created_at).toLocaleString()}</Typography>
              </Stack>
              <Stack>
                <Typography sx={{ color: '#6b7280', fontSize: 13, mb: 0.5 }}>Remark</Typography>
                <Typography sx={{ whiteSpace: 'pre-wrap' }}>{viewApplication.cover_letter || '—'}</Typography>
              </Stack>
              {viewApplication.resume_file_id && (
                <Stack direction="row" spacing={1}>
                  <Button variant="outlined" onClick={() => openResume(viewApplication)}>View Resume</Button>
                  <Button variant="contained" onClick={() => downloadResume(viewApplication)}>Download Resume</Button>
                </Stack>
              )}
            </Stack>
          </DialogContent>
        )}
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setViewApplication(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminCareers;
