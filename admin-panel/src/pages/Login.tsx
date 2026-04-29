import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, TextField, Button, Alert, Paper, Checkbox, FormControlLabel, Link, IconButton
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/admin/login', {
        email,
        password,
      });

      if (response.data && response.data.access_token) {
        login(response.data.access_token);
        navigate('/');
      }
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const primaryColor = '#ff4b68';

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      bgcolor: '#f4f5f7'
    }}>
      <Paper elevation={3} sx={{
        display: 'flex',
        width: '100%',
        maxWidth: 900,
        minHeight: 500,
        borderRadius: 2,
        overflow: 'hidden',
        m: 2
      }}>
        {/* Left Side - Form */}
        <Box sx={{ flex: 1, p: { xs: 4, md: 6 }, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h5" component="h1" sx={{ color: '#333' }}>
              Sign In
            </Typography>

          </Box>

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleLogin}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#333', fontSize: '0.75rem', letterSpacing: 1, textTransform: 'uppercase' }}>
              USERNAME
            </Typography>
            <TextField
              required
              fullWidth
              id="email"
              placeholder="Username"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 50,
                  bgcolor: '#f5f5f5',
                  '& fieldset': { border: 'none' },
                  '& input': { padding: '12px 20px', fontSize: '0.9rem' }
                },
              }}
            />

            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#333', fontSize: '0.75rem', letterSpacing: 1, textTransform: 'uppercase' }}>
              PASSWORD
            </Typography>
            <TextField
              required
              fullWidth
              name="password"
              placeholder="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 50,
                  bgcolor: '#f5f5f5',
                  '& fieldset': { border: 'none' },
                  '& input': { padding: '12px 20px', fontSize: '0.9rem' }
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                py: 1.5,
                borderRadius: 50,
                bgcolor: primaryColor,
                fontWeight: 'normal',
                textTransform: 'none',
                fontSize: '1rem',
                boxShadow: 'none',
                '&:hover': {
                  bgcolor: '#e63e5b',
                  boxShadow: 'none',
                }
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </Box>
        </Box>

        {/* Right Side - Welcome Graphic */}
        <Box sx={{
          flex: 1,
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #ff5b77 0%, #ff3b5b 100%)',
          color: '#fff',
          p: 6,
          textAlign: 'center'
        }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
            Welcome to JHS
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}