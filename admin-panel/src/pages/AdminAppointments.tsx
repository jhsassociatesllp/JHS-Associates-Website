import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Button } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import './AdminAppointments.css';

type AppointmentStatus = 'new' | 'confirmed' | 'completed' | 'cancelled';

type Appointment = {
  id: string;
  mobile: string;
  full_name: string;
  email: string;
  city?: string;
  message?: string;
  speciality: string;
  partner?: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  created_at: string;
};

const APPOINTMENT_STATUSES: AppointmentStatus[] = ['new', 'confirmed', 'completed', 'cancelled'];

const AdminAppointments: React.FC = () => {
  const { token } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/appointments/admin`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) setAppointments(await response.json());
    } catch (error) {
      console.error('Unable to load appointments', error);
      setMessage('Unable to load appointments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateStatus = async (appointmentId: string, status: AppointmentStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/admin/${appointmentId}/status`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        const updated = await response.json();
        setAppointments((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      }
    } catch (error) {
      console.error('Unable to update appointment', error);
      setMessage('Unable to update appointment status.');
    }
  };

  const filteredAppointments = useMemo(() => {
    let list = appointments;
    if (statusFilter !== 'all') list = list.filter((a) => a.status === statusFilter);

    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (a) =>
          a.full_name.toLowerCase().includes(q) ||
          a.email.toLowerCase().includes(q) ||
          a.mobile.toLowerCase().includes(q) ||
          a.speciality.toLowerCase().includes(q),
      );
    }
    return list;
  }, [appointments, search, statusFilter]);

  const counts = useMemo(() => {
    return {
      total: appointments.length,
      new: appointments.filter((a) => a.status === 'new').length,
      confirmed: appointments.filter((a) => a.status === 'confirmed').length,
      completed: appointments.filter((a) => a.status === 'completed').length,
    };
  }, [appointments]);

  return (
    <div className="appointments-container">
      <div className="appointments-header">
        <div>
          <h1 className="appointments-title">Appointments</h1>
          <p className="appointments-subtitle">Review consultation requests booked from the website.</p>
        </div>
        <Button variant="outlined" onClick={fetchAppointments}>Refresh</Button>
      </div>

      {message && (
        <Alert severity="error" onClose={() => setMessage('')} sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      <div className="appointments-stats-row">
        <div className="appointments-stat-card">
          <p className="appointments-stat-label">Total</p>
          <p className="appointments-stat-value">{counts.total}</p>
        </div>
        <div className="appointments-stat-card">
          <p className="appointments-stat-label">New</p>
          <p className="appointments-stat-value">{counts.new}</p>
        </div>
        <div className="appointments-stat-card">
          <p className="appointments-stat-label">Confirmed</p>
          <p className="appointments-stat-value">{counts.confirmed}</p>
        </div>
        <div className="appointments-stat-card">
          <p className="appointments-stat-label">Completed</p>
          <p className="appointments-stat-value">{counts.completed}</p>
        </div>
      </div>

      <div className="appointments-main-card">
        <div className="appointments-tabs-bar">
          <div className="appointments-search">
            <input
              type="text"
              placeholder="Search by name, email, mobile, speciality…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="appointments-filter">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All statuses</option>
              {APPOINTMENT_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
          </div>
          <span className="appointments-result-count">{filteredAppointments.length} appointments</span>
        </div>

        {loading ? (
          <div className="appointments-loading"><div className="appointments-spinner" /></div>
        ) : filteredAppointments.length === 0 ? (
          <div className="appointments-empty">
            <h3>No appointments found</h3>
            <p>Appointments booked from the website's Book Appointment page will appear here.</p>
          </div>
        ) : (
          <div className="appointments-table-scroll">
            <table className="appointments-table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Speciality</th>
                  <th>Partner</th>
                  <th>Preferred Date &amp; Time</th>
                  <th>Status</th>
                  <th>Requested</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td>
                      <p className="appt-cell-primary">{appointment.full_name}</p>
                      <p className="appt-cell-secondary">{appointment.email}</p>
                      <p className="appt-cell-secondary">+91 {appointment.mobile}</p>
                      {appointment.city && <p className="appt-cell-secondary">{appointment.city}</p>}
                    </td>
                    <td>{appointment.speciality}</td>
                    <td>{appointment.partner || 'Any available partner'}</td>
                    <td>
                      <p className="appt-cell-primary" style={{ fontWeight: 500 }}>{appointment.date}</p>
                      <p className="appt-cell-secondary">{appointment.time}</p>
                    </td>
                    <td>
                      <div className="appt-status-select-wrap">
                        <select
                          className={`appt-status-pill ${appointment.status}`}
                          value={appointment.status}
                          onChange={(e) => updateStatus(appointment.id, e.target.value as AppointmentStatus)}
                        >
                          {APPOINTMENT_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
                        </select>
                      </div>
                    </td>
                    <td>{new Date(appointment.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAppointments;
