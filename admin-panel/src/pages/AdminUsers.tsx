import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Tab,
  Tabs,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import './AdminUsers.css';

const IST_TIME_ZONE = 'Asia/Kolkata';

type SiteUser = {
  id: string;
  first_name?: string;
  last_name?: string;
  name: string;
  email: string;
  auth_provider: string;
  is_verified: boolean;
  status: string;
  created_at: string;
  last_login?: string;
};

type ActivityRow = {
  id: string;
  created_at: string;
  [key: string]: unknown;
};

type ActivitySummary = {
  downloads: ActivityRow[];
  job_applications: ActivityRow[];
  proposals: ActivityRow[];
  appointments: ActivityRow[];
  consultation_requests: ActivityRow[];
};

const EMPTY_SUMMARY: ActivitySummary = {
  downloads: [],
  job_applications: [],
  proposals: [],
  appointments: [],
  consultation_requests: [],
};

const formatIST = (iso?: string) => {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('en-IN', {
      timeZone: IST_TIME_ZONE,
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
};

const TABS: { key: keyof ActivitySummary; label: string }[] = [
  { key: 'downloads', label: 'Downloads' },
  { key: 'job_applications', label: 'Job Applications' },
  { key: 'proposals', label: 'Proposals' },
  { key: 'appointments', label: 'Appointments' },
  { key: 'consultation_requests', label: 'Consultations' },
];

const AdminUsers: React.FC = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState<SiteUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');

  const [selectedUser, setSelectedUser] = useState<SiteUser | null>(null);
  const [activity, setActivity] = useState<ActivitySummary>(EMPTY_SUMMARY);
  const [activityLoading, setActivityLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/users/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) setUsers(await response.json());
      else setMessage('Unable to load users.');
    } catch (error) {
      console.error('Unable to load users', error);
      setMessage('Unable to load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openActivity = async (user: SiteUser) => {
    setSelectedUser(user);
    setActiveTab(0);
    setActivity(EMPTY_SUMMARY);
    setActivityLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/users/admin/${user.id}/activity`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) setActivity(await response.json());
    } catch (error) {
      console.error('Unable to load user activity', error);
    } finally {
      setActivityLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
    );
  }, [users, search]);

  const counts = useMemo(() => {
    const todayKey = new Date().toLocaleDateString('en-CA', { timeZone: IST_TIME_ZONE });
    return {
      total: users.length,
      today: users.filter(
        (u) => new Date(u.created_at).toLocaleDateString('en-CA', { timeZone: IST_TIME_ZONE }) === todayKey,
      ).length,
      google: users.filter((u) => u.auth_provider === 'google').length,
      password: users.filter((u) => u.auth_provider === 'password').length,
    };
  }, [users]);

  const activeRows = selectedUser ? activity[TABS[activeTab].key] : [];

  return (
    <div className="users-container">
      <div className="users-header">
        <div>
          <h1 className="users-title">Users</h1>
          <p className="users-subtitle">
            Everyone who has created a site account — see what they downloaded, applied for, or requested.
          </p>
        </div>
        <Button variant="outlined" onClick={fetchUsers}>Refresh</Button>
      </div>

      {message && (
        <Alert severity="error" onClose={() => setMessage('')} sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      <div className="users-stats-row">
        <div className="users-stat-card">
          <p className="users-stat-label">Total Users</p>
          <p className="users-stat-value">{counts.total}</p>
        </div>
        <div className="users-stat-card">
          <p className="users-stat-label">New Today</p>
          <p className="users-stat-value">{counts.today}</p>
        </div>
        <div className="users-stat-card">
          <p className="users-stat-label">Google Sign-In</p>
          <p className="users-stat-value">{counts.google}</p>
        </div>
        <div className="users-stat-card">
          <p className="users-stat-label">Email &amp; Password</p>
          <p className="users-stat-value">{counts.password}</p>
        </div>
      </div>

      <div className="users-main-card">
        <div className="users-tabs-bar">
          <div className="users-search">
            <input
              type="text"
              placeholder="Search by name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <span className="users-result-count">{filteredUsers.length} users</span>
        </div>

        {loading ? (
          <div className="users-loading"><div className="users-spinner" /></div>
        ) : filteredUsers.length === 0 ? (
          <div className="users-empty">
            <h3>No users yet</h3>
            <p>Accounts created via the site's Sign Up / Google sign-in will appear here.</p>
          </div>
        ) : (
          <div className="users-table-scroll">
            <table className="users-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Sign-in Method</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Last Login</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <p className="users-cell-primary">{u.name}</p>
                      <p className="users-cell-secondary">{u.email}</p>
                    </td>
                    <td>
                      <span className={`users-provider-pill ${u.auth_provider}`}>{u.auth_provider}</span>
                    </td>
                    <td>
                      <span className={`users-status-pill ${u.status}`}>{u.status}</span>
                    </td>
                    <td>{formatIST(u.created_at)}</td>
                    <td>{formatIST(u.last_login)}</td>
                    <td>
                      <button className="link-btn" onClick={() => openActivity(u)}>View Activity</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={!!selectedUser} onClose={() => setSelectedUser(null)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            {selectedUser?.name}
            <div style={{ fontSize: '0.8rem', fontWeight: 400, color: '#8a8d93' }}>{selectedUser?.email}</div>
          </div>
          <IconButton onClick={() => setSelectedUser(null)}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Tabs
            value={activeTab}
            onChange={(_, v) => setActiveTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ mb: 2 }}
          >
            {TABS.map((t, i) => (
              <Tab key={t.key} label={`${t.label} (${activity[t.key].length})`} value={i} />
            ))}
          </Tabs>

          {activityLoading ? (
            <div className="users-loading"><div className="users-spinner" /></div>
          ) : activeRows.length === 0 ? (
            <p className="users-activity-empty">No {TABS[activeTab].label.toLowerCase()} yet.</p>
          ) : (
            <div className="users-activity-list">
              {activeRows.map((row) => (
                <div key={row.id} className="users-activity-row">
                  <div className="users-activity-row__main">
                    {'resource_title' in row && <strong>{String(row.resource_title)}</strong>}
                    {'job_title' in row && <strong>{String(row.job_title || 'General Application')}</strong>}
                    {'subject' in row && <strong>{String(row.subject)}</strong>}
                    {'partner_name' in row && <strong>{String(row.partner_name)}</strong>}
                    {'partner' in row && !('partner_name' in row) && (
                      <strong>{String(row.partner || 'Any available partner')} — {String(row.speciality ?? '')}</strong>
                    )}
                    {'status' in row && <span className={`users-status-pill ${String(row.status)}`}>{String(row.status)}</span>}
                  </div>
                  <span className="users-activity-row__date">{formatIST(row.created_at)}</span>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsers;
