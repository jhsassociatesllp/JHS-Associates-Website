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
  keywords?: string[];
  created_at: string;
};

type AtsDetails = {
  threshold: number;
  components: Record<string, { score: number; max: number }>;
  matched_keywords: string[];
  missing_keywords: string[];
  experience_years: number | null;
  flags: string[];
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
  ats_score?: number | null;
  ats_status?: 'matched' | 'below' | 'unreadable' | 'not_applicable' | null;
  ats_match?: boolean | null;
  ats_details?: AtsDetails | null;
  status: ApplicationStatus;
  created_at: string;
};

type JobForm = Omit<Job, 'id' | 'created_at' | 'keywords'>;

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

const ATS_THRESHOLD = 60;
const COMPONENT_LABELS: Record<string, string> = {
  keywords: 'Keywords & skills',
  title: 'Job title match',
  experience: 'Experience',
  education: 'Qualifications',
  format: 'ATS-readable format',
};
type AtsGroup = 'matched' | 'below' | 'unreadable' | 'general' | 'unscored';
const GROUP_LABEL: Record<AtsGroup, string> = {
  matched: `Top matches — ${ATS_THRESHOLD}% and above`,
  below: `Below ${ATS_THRESHOLD}%`,
  unreadable: 'Resume could not be read — review manually',
  general: 'General applications (no vacancy to match)',
  unscored: 'Not scored yet',
};
const atsGroup = (a: Application): AtsGroup => {
  if (a.ats_status === 'matched') return 'matched';
  if (a.ats_status === 'below') return 'below';
  if (a.ats_status === 'unreadable') return 'unreadable';
  if (a.ats_status === 'not_applicable') return 'general';
  return 'unscored';
};

const parseKeywords = (text: string): string[] =>
  text.split(/[,\n]/).map((k) => k.trim()).filter(Boolean);

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

const AtsBadge: React.FC<{ application: Application }> = ({ application }) => {
  const group = atsGroup(application);
  if (group === 'matched' || group === 'below') {
    return (
      <div className={`ats-badge ats-badge--${group}`} title={`ATS resume match: ${application.ats_score}%`}>
        <span className="ats-badge__score">{application.ats_score}%</span>
        <span className="ats-badge__label">{group === 'matched' ? 'Match' : `Below ${ATS_THRESHOLD}%`}</span>
      </div>
    );
  }
  const text = group === 'unreadable' ? 'Unreadable' : group === 'general' ? 'No vacancy' : 'Not scored';
  return <span className={`ats-badge ats-badge--${group}`}><span className="ats-badge__label">{text}</span></span>;
};

const AtsPanel: React.FC<{ application: Application; busy: boolean; onRescore: () => void }> = ({ application, busy, onRescore }) => {
  const group = atsGroup(application);
  const d = application.ats_details;
  const scored = group === 'matched' || group === 'below';
  return (
    <div className={`ats-panel ats-panel--${group}`}>
      <div className="ats-panel__head">
        <div
          className="ats-ring"
          style={scored ? ({ ['--pct' as string]: `${application.ats_score ?? 0}%` } as React.CSSProperties) : undefined}
        >
          <span>{scored ? `${application.ats_score}%` : '—'}</span>
        </div>
        <div className="ats-panel__title">
          <strong>ATS Resume Match</strong>
          <span className="ats-panel__verdict">
            {group === 'matched' && `Matches the job description (${ATS_THRESHOLD}% or higher)`}
            {group === 'below' && `Below the ${ATS_THRESHOLD}% match line`}
            {group === 'unreadable' && 'Resume text could not be read'}
            {group === 'general' && 'General application — nothing to match against'}
            {group === 'unscored' && 'Not scored yet'}
          </span>
        </div>
        {application.resume_file_id && (
          <button className="ats-btn" onClick={onRescore} disabled={busy}>{busy ? 'Scoring…' : 'Re-score'}</button>
        )}
      </div>

      {d && scored && (
        <>
          <div className="ats-bars">
            {Object.entries(d.components).map(([key, c]) => (
              <div key={key} className="ats-bar">
                <div className="ats-bar__top">
                  <span>{COMPONENT_LABELS[key] ?? key}</span>
                  <span>{c.score} / {c.max}</span>
                </div>
                <div className="ats-bar__track"><div className="ats-bar__fill" style={{ width: `${c.max ? (c.score / c.max) * 100 : 0}%` }} /></div>
              </div>
            ))}
          </div>
          {d.matched_keywords.length > 0 && (
            <div className="ats-chips">
              <span className="ats-chips__label">Found in resume</span>
              {d.matched_keywords.map((k) => <span key={k} className="ats-chip ats-chip--ok">{k}</span>)}
            </div>
          )}
          {d.missing_keywords.length > 0 && (
            <div className="ats-chips">
              <span className="ats-chips__label">Not found</span>
              {d.missing_keywords.map((k) => <span key={k} className="ats-chip ats-chip--miss">{k}</span>)}
            </div>
          )}
          {d.experience_years != null && <p className="ats-note">Experience detected in resume: about {d.experience_years} year(s).</p>}
        </>
      )}
      {d && d.flags.length > 0 && (
        <ul className="ats-flags">{d.flags.map((f) => <li key={f}>{f}</li>)}</ul>
      )}
    </div>
  );
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
  const [keywordsText, setKeywordsText] = useState('');
  const [topOnly, setTopOnly] = useState(false);
  const [scoring, setScoring] = useState(false);
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
    setKeywordsText('');
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
    setKeywordsText((job.keywords ?? []).join(', '));
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
          body: JSON.stringify({ ...formData, keywords: parseKeywords(keywordsText) }),
        },
      );

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => null);
        throw new Error(formatApiError(errorPayload));
      }

      setDialogOpen(false);
      let note = '';
      if (editingId) {
        // the description / keywords may have changed, so refresh this vacancy's ATS scores
        const rescored = await fetch(`${API_BASE_URL}/careers/admin/jobs/${editingId}/rescore`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        }).then((r) => (r.ok ? r.json() : null)).catch(() => null);
        if (rescored?.rescored) note = ` ${rescored.rescored} application(s) re-scored.`;
      }
      setMessage((editingId ? 'Vacancy updated successfully.' : 'Vacancy posted successfully.') + note);
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

  const rescoreApplication = async (application: Application) => {
    setScoring(true);
    try {
      const response = await fetch(`${API_BASE_URL}/careers/admin/applications/${application.id}/rescore`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('rescore failed');
      const updated: Application = await response.json();
      setApplications((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      setViewApplication((current) => (current && current.id === updated.id ? updated : current));
      setMessage('Resume re-scored successfully.');
    } catch {
      setMessage('Unable to re-score this resume.');
    } finally {
      setScoring(false);
    }
  };

  const scoreOlderApplications = async () => {
    setScoring(true);
    try {
      const response = await fetch(`${API_BASE_URL}/careers/admin/applications/rescore-unscored`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('rescore failed');
      const result = await response.json();
      setMessage(`${result.rescored} older application(s) scored successfully.`);
      await fetchCareers();
    } catch {
      setMessage('Unable to score older applications.');
    } finally {
      setScoring(false);
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

    if (topOnly) list = list.filter((application) => application.ats_status === 'matched');

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
  }, [applications, selectedJobFilter, applicationSearch, topOnly]);

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
  const topMatches = applications.filter((a) => a.ats_status === 'matched').length;
  const unscored = applications.filter((a) => !a.ats_status).length;

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
        <div className="careers-stat-card ats-stat">
          <p className="careers-stat-label">Top ATS Matches ({ATS_THRESHOLD}%+)</p>
          <p className="careers-stat-value">{topMatches}</p>
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
            <label className="ats-toggle">
              <input type="checkbox" checked={topOnly} onChange={(e) => setTopOnly(e.target.checked)} />
              Top matches only ({ATS_THRESHOLD}%+)
            </label>
            {unscored > 0 && (
              <button className="ats-btn" onClick={scoreOlderApplications} disabled={scoring}>
                {scoring ? 'Scoring…' : `Score ${unscored} older application${unscored === 1 ? '' : 's'}`}
              </button>
            )}
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
                  <th>ATS Match</th>
                  <th>Qualification / Profile</th>
                  <th>Resume</th>
                  <th>Status</th>
                  <th>Applied</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((application, index) => {
                  const group = atsGroup(application);
                  const startsGroup = index === 0 || atsGroup(filteredApplications[index - 1]) !== group;
                  const groupCount = filteredApplications.filter((a) => atsGroup(a) === group).length;
                  return (
                  <React.Fragment key={application.id}>
                    {startsGroup && (
                      <tr className={`ats-group-row ats-group-row--${group}`}>
                        <td colSpan={8}>{GROUP_LABEL[group]} <span className="ats-group-row__count">{groupCount}</span></td>
                      </tr>
                    )}
                  <tr>
                    <td>
                      <p className="cell-primary">{application.full_name}</p>
                      <p className="cell-secondary">{application.email}</p>
                      <p className="cell-secondary">{application.phone}</p>
                    </td>
                    <td>{application.job_title || 'General Application'}</td>
                    <td><AtsBadge application={application} /></td>
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
                  </React.Fragment>
                  );
                })}
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
              <TextField
                label="ATS Keywords (optional)"
                value={keywordsText}
                onChange={(e) => setKeywordsText(e.target.value)}
                fullWidth
                multiline
                minRows={2}
                placeholder="statutory audit, internal audit, Ind AS, GST, MS Excel"
                helperText={`Skills and terms the resume should contain, separated by commas. These count double when matching candidates (a ${ATS_THRESHOLD}% score or higher is a match); the description is analysed automatically too.`}
              />
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
              <AtsPanel application={viewApplication} busy={scoring} onRescore={() => rescoreApplication(viewApplication)} />
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
