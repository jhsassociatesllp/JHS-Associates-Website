import { Box, CircularProgress } from '@mui/material';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = () => {
  const { isAuthenticated, initializing } = useAuth();

  // A stored token is still being verified against /admin/me — showing this
  // briefly instead of redirecting is what stops a page refresh (and the
  // instant after a successful login) from bouncing back to /login before
  // the profile fetch has had a chance to resolve.
  if (initializing) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f4f5fa' }}>
        <CircularProgress sx={{ color: '#696cff' }} />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
