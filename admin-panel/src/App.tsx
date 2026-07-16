import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminArticles from './pages/AdminArticles';   // ✅ NEW
import AdminBlogs from './pages/AdminBlogs';         // ✅ NEW
import AdminKnowledge from './pages/AdminKnowledge'; // ✅ NEW
import AdminWhitePapers from './pages/AdminWhitePapers'; // ✅ NEW
import AdminExcellencia from './pages/AdminExcellencia'; // ✅ NEW
import AdminNewsletters from './pages/AdminNewsletters'; // ✅ NEW
import AdminContacts from './pages/AdminContacts';   // ✅ NEW
import AdminAlumni from './pages/AdminAlumni';       // ✅ NEW
import AdminFeedback from './pages/AdminFeedback';   // ✅ FEEDBACK
import AdminCareers from './pages/AdminCareers';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/articles" element={<AdminArticles />} />  {/* ✅ NEW */}
              <Route path="/blogs" element={<AdminBlogs />} />        {/* ✅ NEW */}
              <Route path="/knowledge" element={<AdminKnowledge />} /> {/* ✅ NEW */}
              <Route path="/white-papers" element={<AdminWhitePapers />} /> {/* ✅ NEW */}
              <Route path="/excellencia" element={<AdminExcellencia />} /> {/* ✅ NEW */}
              <Route path="/newsletters" element={<AdminNewsletters />} /> {/* ✅ NEW */}
              <Route path="/contacts" element={<AdminContacts />} />   {/* ✅ NEW */}
              <Route path="/alumni" element={<AdminAlumni />} />       {/* ✅ NEW */}
              <Route path="/feedback" element={<AdminFeedback />} />   {/* ✅ FEEDBACK */}
              <Route path="/careers" element={<AdminCareers />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}
