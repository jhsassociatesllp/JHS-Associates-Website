import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

type JobStatus = 'draft' | 'open' | 'closed';
type ApplicationStatus = 'new' | 'reviewing' | 'shortlisted' | 'rejected' | 'hired';

type Job = {
  id: string;
  title: string;
  department: string;
  location: string;
  employment_type: string;
  experience: string;
  summary: string;
  description: string;
  requirements: string;
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
  reference?: string;
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
  summary: '',
  description: '',
  requirements: '',
  status: 'open',
};

const statusColors: Record<ApplicationStatus, 'default' | 'primary' | 'success' | 'warning' | 'error'> = {
  new: 'default',
  reviewing: 'primary',
  shortlisted: 'warning',
  rejected: 'error',
  hired: 'success',
};

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
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<JobForm>(initialJobForm);
  const [message, setMessage] = useState('');
  const [selectedJobFilter, setSelectedJobFilter] = useState('all');
  const [viewApplication, setViewApplication] = useState<Application | null>(null);

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
      summary: job.summary,
      description: job.description,
      requirements: job.requirements,
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

  const openResume = async (application: Application) => {
    try {
      const response = await fetch(`${API_BASE_URL}/careers/admin/applications/${application.id}/resume`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Resume download failed');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank', 'noopener,noreferrer');
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (error) {
      console.error('Unable to open resume', error);
      setMessage('Unable to open resume.');
    }
  };

  const filteredApplications = useMemo(() => {
    if (selectedJobFilter === 'all') return applications;
    if (selectedJobFilter === 'general') return applications.filter((application) => !application.job_id);
    return applications.filter((application) => application.job_id === selectedJobFilter);
  }, [applications, selectedJobFilter]);

  const withOther = (value?: string, other?: string) => {
    if (!value) return '—';
    return other ? `${value} (${other})` : value;
  };

  const openJobs = jobs.filter((job) => job.status === 'open').length;

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2} sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#1f2937' }}>
            Careers
          </Typography>
          <Typography sx={{ color: '#6b7280', mt: 0.5 }}>
            Post vacancies and review candidate applications from the website.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={fetchCareers}>Refresh</Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreateDialog}>Post Vacancy</Button>
        </Stack>
      </Stack>

      {message && (
        <Alert severity={message.includes('successfully') ? 'success' : 'error'} onClose={() => setMessage('')} sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <Paper sx={{ p: 2, flex: 1, borderRadius: 2 }}>
          <Typography sx={{ color: '#6b7280', fontSize: 14 }}>Total Vacancies</Typography>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>{jobs.length}</Typography>
        </Paper>
        <Paper sx={{ p: 2, flex: 1, borderRadius: 2 }}>
          <Typography sx={{ color: '#6b7280', fontSize: 14 }}>Open Vacancies</Typography>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>{openJobs}</Typography>
        </Paper>
        <Paper sx={{ p: 2, flex: 1, borderRadius: 2 }}>
          <Typography sx={{ color: '#6b7280', fontSize: 14 }}>Applications</Typography>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>{applications.length}</Typography>
        </Paper>
      </Stack>

      <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Tabs value={tab} onChange={(_, value) => setTab(value)} sx={{ borderBottom: '1px solid #e5e7eb', px: 2 }}>
          <Tab label="Vacancies" />
          <Tab label="Applications" />
        </Tabs>

        {tab === 0 && (
          <Box sx={{ overflowX: 'auto' }}>
            <table className="admin-careers-table">
              <thead>
                <tr>
                  <th>Role</th>
                  <th>Location</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Posted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id}>
                    <td><strong>{job.title}</strong><span>{job.department}</span></td>
                    <td>{job.location}</td>
                    <td>{job.employment_type}</td>
                    <td><Chip size="small" label={job.status} color={job.status === 'open' ? 'success' : 'default'} /></td>
                    <td>{new Date(job.created_at).toLocaleDateString()}</td>
                    <td>
                      <Stack direction="row" spacing={1}>
                        <Button size="small" startIcon={<EditIcon />} onClick={() => openEditDialog(job)}>Edit</Button>
                        <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => deleteJob(job.id)}>Delete</Button>
                      </Stack>
                    </td>
                  </tr>
                ))}
                {!loading && jobs.length === 0 && <tr><td colSpan={6}>No vacancies posted yet.</td></tr>}
              </tbody>
            </table>
          </Box>
        )}

        {tab === 1 && (
          <Box>
            <Box sx={{ p: 2, maxWidth: 360 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Filter by vacancy</InputLabel>
                <Select value={selectedJobFilter} label="Filter by vacancy" onChange={(e) => setSelectedJobFilter(e.target.value)}>
                  <MenuItem value="all">All vacancies</MenuItem>
                  <MenuItem value="general">General Applications</MenuItem>
                  {jobs.map((job) => <MenuItem key={job.id} value={job.id}>{job.title}</MenuItem>)}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ overflowX: 'auto' }}>
              <table className="admin-careers-table">
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
                        <strong>{application.full_name}</strong>
                        <span>{application.email} | {application.phone}</span>
                        {application.current_location && <small>{application.current_location}</small>}
                      </td>
                      <td>{application.job_title || 'General Application'}</td>
                      <td>
                        <span>{withOther(application.highest_qualification, application.highest_qualification_other)}</span>
                        <small>{withOther(application.profile, application.profile_other)}</small>
                      </td>
                      <td>
                        {application.resume_file_id ? (
                          <Button size="small" variant="outlined" onClick={() => openResume(application)}>
                            {application.resume_filename || 'Open Resume'}
                          </Button>
                        ) : '-'}
                      </td>
                      <td>
                        <FormControl size="small" sx={{ minWidth: 150 }}>
                          <Select
                            value={application.status}
                            onChange={(e) => updateApplicationStatus(application.id, e.target.value as ApplicationStatus)}
                            renderValue={(value) => <Chip size="small" label={value} color={statusColors[value as ApplicationStatus]} />}
                          >
                            {Object.keys(statusColors).map((status) => <MenuItem key={status} value={status}>{status}</MenuItem>)}
                          </Select>
                        </FormControl>
                      </td>
                      <td>{new Date(application.created_at).toLocaleDateString()}</td>
                      <td>
                        <Button size="small" onClick={() => setViewApplication(application)}>View</Button>
                      </td>
                    </tr>
                  ))}
                  {!loading && filteredApplications.length === 0 && <tr><td colSpan={7}>No applications found.</td></tr>}
                </tbody>
              </table>
            </Box>
          </Box>
        )}
      </Paper>

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
              <TextField label="Short Summary" value={formData.summary} onChange={(e) => updateForm('summary', e.target.value)} required fullWidth multiline minRows={2} />
              <TextField label="Role Description" value={formData.description} onChange={(e) => updateForm('description', e.target.value)} required fullWidth multiline minRows={4} />
              <TextField label="Requirements" value={formData.requirements} onChange={(e) => updateForm('requirements', e.target.value)} required fullWidth multiline minRows={4} />
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
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ color: '#6b7280', fontSize: 13 }}>Reference</Typography>
                <Typography sx={{ textAlign: 'right' }}>{viewApplication.reference || '—'}</Typography>
              </Stack>
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
                <Button variant="outlined" onClick={() => openResume(viewApplication)} sx={{ alignSelf: 'flex-start' }}>
                  {viewApplication.resume_filename || 'Open Resume'}
                </Button>
              )}
            </Stack>
          </DialogContent>
        )}
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setViewApplication(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      <style>{`
        .admin-careers-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 900px;
        }
        .admin-careers-table th {
          text-align: left;
          color: #6b7280;
          font-size: 0.78rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          padding: 14px 18px;
          background: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
        }
        .admin-careers-table td {
          padding: 16px 18px;
          border-bottom: 1px solid #eef2f7;
          color: #374151;
          vertical-align: top;
        }
        .admin-careers-table td strong,
        .admin-careers-table td span,
        .admin-careers-table td small {
          display: block;
        }
        .admin-careers-table td span,
        .admin-careers-table td small {
          color: #6b7280;
          margin-top: 4px;
        }
      `}</style>
    </Box>
  );
};

export default AdminCareers;
