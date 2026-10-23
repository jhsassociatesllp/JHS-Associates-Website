import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, TextField, Button, Alert,
  InputAdornment, IconButton,
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility, VisibilityOff,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string
console.log("API Base URL", API_BASE_URL)

const fieldSx = {
  mb: 2,
  '& .MuiOutlinedInput-root': {
    borderRadius: '999px',
    fontSize: '0.9rem',
    backgroundColor: '#fff',
    transition: 'all 0.2s',
    '& fieldset': { borderColor: '#dbe3ef' },
    '&:hover fieldset': { borderColor: '#2563eb' },
    '&.Mui-focused fieldset': { borderColor: '#2563eb', borderWidth: 2 },
  },
  '& .MuiOutlinedInput-input': { py: 1.5 },
};

/** "Good morning / afternoon / evening / night" from the visitor's own clock. */
function greeting(now: Date = new Date()): string {
  const h = now.getHours();
  if (h >= 5 && h < 12) return 'Good Morning';
  if (h >= 12 && h < 17) return 'Good Afternoon';
  if (h >= 17 && h < 21) return 'Good Evening';
  return 'Good Night';
}

export default function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [hello]                 = useState(() => `Hey, ${greeting()}!`);
  const { login }    = useAuth();
  const navigate     = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data?.access_token) {
          login(data.access_token);
          navigate('/');
        }
      } else {
        const errorData = await response.json().catch(() => ({ detail: 'Login failed' }));
        setError(errorData.detail || 'Login failed. Please try again.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f2340 0%, #1d4fd8 55%, #3b82f6 100%)',
      position: 'relative', overflow: 'hidden', p: { xs: 2, md: 6 },
    }}>
      {/* soft decorative glows */}
      <Box sx={{ position: 'absolute', width: 520, height: 520, borderRadius: '50%', top: -180, left: -160, background: 'radial-gradient(circle, rgba(255,255,255,0.14), transparent 70%)' }} />
      <Box sx={{ position: 'absolute', width: 420, height: 420, borderRadius: '50%', bottom: -160, right: '30%', background: 'radial-gradient(circle, rgba(147,197,253,0.22), transparent 70%)' }} />

      <Box sx={{
        position: 'relative', width: '100%', maxWidth: 1120, display: 'flex',
        alignItems: 'center', justifyContent: 'space-between', gap: 6,
      }}>
        {/* ── Brand side ── */}
        <Box sx={{ display: { xs: 'none', md: 'block' }, flex: 1, maxWidth: 480, color: '#fff' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 6 }}>
            <Box component="img" src="/logo.webp" alt="JHS" sx={{ width: 56, height: 56, borderRadius: 2, objectFit: 'contain', bgcolor: '#fff', p: '4px', boxShadow: '0 8px 24px rgba(0,0,0,0.25)' }} />
            <Typography sx={{ fontWeight: 700, fontSize: '1.5rem', fontFamily: 'Inter, sans-serif' }}>JHS Admin</Typography>
          </Box>
          <Typography sx={{ fontSize: '2.8rem', fontWeight: 700, lineHeight: 1.15, fontFamily: 'Inter, sans-serif', mb: 2 }}>
            {hello}
          </Typography>
          <Typography sx={{ fontSize: '1.05rem', mb: 2.5, opacity: 0.95 }}>
            Welcome to the JHS &amp; Associates LLP admin panel.
          </Typography>
          <Typography sx={{ fontSize: '0.95rem', lineHeight: 1.7, opacity: 0.7 }}>
            Manage contacts, careers and résumés, events, podcasts and website content securely, all in one place.
          </Typography>
        </Box>

        {/* ── Sign-in card ── */}
        <Box sx={{
          width: '100%', maxWidth: 440, bgcolor: '#fff', borderRadius: '28px',
          p: { xs: 3.5, sm: 5 }, boxShadow: '0 30px 80px -20px rgba(8,20,50,0.55)',
        }}>
          {/* Mobile logo */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', justifyContent: 'center', gap: 1.25, mb: 3 }}>
            <Box component="img" src="/logo.webp" alt="JHS" sx={{ width: 44, height: 44, borderRadius: 1.5, objectFit: 'contain', border: '1px solid #e6e8ee', p: '3px' }} />
            <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#0f2340', fontFamily: 'Inter, sans-serif' }}>JHS Admin</Typography>
          </Box>

          <Typography sx={{ textAlign: 'center', fontSize: '1.6rem', fontWeight: 700, color: '#0f2340', fontFamily: 'Inter, sans-serif', mb: 0.75 }}>
            Welcome Back
          </Typography>
          <Typography sx={{ textAlign: 'center', fontSize: '0.85rem', color: '#64748b', mb: 3.5 }}>
            Sign in to continue to your dashboard
          </Typography>

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 2.5, borderRadius: 3, fontSize: '0.85rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca',
                '& .MuiAlert-icon': { color: '#dc2626' }, '& .MuiAlert-message': { color: '#991b1b' },
              }}
            >
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleLogin}>
            <TextField
              required fullWidth id="email" name="email"
              placeholder="Email / Username"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ fontSize: 18, color: '#94a3b8' }} />
                  </InputAdornment>
                ),
              }}
              sx={fieldSx}
            />

            <TextField
              required fullWidth id="password" name="password"
              placeholder="Password"
              type={showPw ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ fontSize: 18, color: '#94a3b8' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setShowPw(!showPw)} edge="end" aria-label={showPw ? 'Hide password' : 'Show password'}>
                      {showPw ? <VisibilityOff sx={{ fontSize: 18, color: '#94a3b8' }} /> : <Visibility sx={{ fontSize: 18, color: '#94a3b8' }} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ ...fieldSx, mb: 3 }}
            />

            <Button
              type="submit" fullWidth variant="contained"
              disabled={loading}
              sx={{
                py: 1.5, borderRadius: '999px',
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4fd8 100%)',
                fontWeight: 600, fontSize: '0.95rem', textTransform: 'none', fontFamily: 'Inter, sans-serif',
                boxShadow: '0 10px 24px -10px rgba(37,99,235,0.8)',
                transition: 'all 0.3s ease',
                '&:hover': { background: 'linear-gradient(135deg, #1d4fd8 0%, #173fb0 100%)', transform: 'translateY(-1px)' },
                '&.Mui-disabled': { background: '#e2e8f0', color: '#94a3b8', boxShadow: 'none', transform: 'none' },
              }}
            >
              {loading ? 'Signing in…' : 'Login'}
            </Button>

            <Typography sx={{ mt: 3.5, textAlign: 'center', fontSize: '0.75rem', color: '#94a3b8' }}>
              Secure login for authorised JHS staff only
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
