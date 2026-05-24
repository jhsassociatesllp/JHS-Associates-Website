import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Alert, InputAdornment, IconButton, } from '@mui/material';
import { Email as EmailIcon, Lock as LockIcon, Visibility, VisibilityOff, Dashboard as DashboardIcon, } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/admin/login', {
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
            }
            else {
                const errorData = await response.json().catch(() => ({ detail: 'Login failed' }));
                setError(errorData.detail || 'Login failed. Please try again.');
            }
        }
        catch (err) {
            console.error('Login error:', err);
            setError('Network error. Please check your connection and try again.');
        }
        finally {
            setLoading(false);
        }
    };
    return (<Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: '#f4f5fa' }}>

      {/* ── Left Brand Panel ─────────────────────────────────── */}
      <Box sx={{
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: 420,
            flexShrink: 0,
            background: 'linear-gradient(160deg, #1e2130 0%, #2a2f4a 100%)',
            p: 6,
            position: 'relative',
            overflow: 'hidden',
        }}>
        {/* Decorative circles */}
        <Box sx={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', border: '1px solid rgba(105,108,255,0.15)', top: -60, right: -60 }}/>
        <Box sx={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', border: '1px solid rgba(105,108,255,0.1)', bottom: 40, left: -40 }}/>

        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 5 }}>
          <Box sx={{
            width: 44, height: 44, borderRadius: 2,
            background: 'linear-gradient(135deg, #696cff 0%, #4a4cf7 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
            <DashboardIcon sx={{ color: '#fff', fontSize: 24 }}/>
          </Box>
          <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '1.3rem', fontFamily: 'Inter, sans-serif' }}>
            JHS Admin
          </Typography>
        </Box>

        <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '1.8rem', textAlign: 'center', lineHeight: 1.3, fontFamily: 'Inter, sans-serif', mb: 2 }}>
          Welcome to JHS &amp; Associates
        </Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', textAlign: 'center', lineHeight: 1.6, mb: 1 }}>
          Admin panel for managing contacts, articles, and blog content.
        </Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', textAlign: 'center', lineHeight: 1.5 }}>
          Secure access to your business management dashboard
        </Typography>

        {/* Stats */}
        {/* <Box sx={{ display: 'flex', gap: 4, mt: 6 }}>
          {[['500+', 'Contacts'], ['120+', 'Articles'], ['80+', 'Alumni']].map(([val, lbl]) => (
            <Box key={lbl} sx={{ textAlign: 'center' }}>
              <Typography sx={{ color: '#696cff', fontWeight: 700, fontSize: '1.4rem', fontFamily: 'Inter, sans-serif' }}>{val}</Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>{lbl}</Typography>
            </Box>
          ))}
        </Box> */}
      </Box>

      {/* ── Right Form Panel ─────────────────────────────────── */}
      <Box sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: { xs: 3, md: 6 },
        }}>
        <Box sx={{ width: '100%', maxWidth: 420 }}>

          {/* Header */}
          <Box sx={{ mb: 4 }}>
            {/* Mobile logo */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1.5, mb: 3 }}>
              <Box sx={{ width: 36, height: 36, borderRadius: 1.5, background: 'linear-gradient(135deg, #696cff 0%, #4a4cf7 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <DashboardIcon sx={{ color: '#fff', fontSize: 20 }}/>
              </Box>
              <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#2d3748', fontFamily: 'Inter, sans-serif' }}>JHS Admin</Typography>
            </Box>

            <Typography sx={{ fontSize: '1.6rem', fontWeight: 700, color: '#2d3748', fontFamily: 'Inter, sans-serif', mb: 0.5 }}>
              Sign in to your account
            </Typography>
            <Typography sx={{ fontSize: '0.9rem', color: '#8a8d93', mb: 0.5 }}>
              Enter your credentials to access the dashboard
            </Typography>
            <Typography sx={{ fontSize: '0.8rem', color: '#a0a3a8' }}>
              Secure login to JHS Associates Admin Panel
            </Typography>
          </Box>

          {error && (<Alert severity="error" sx={{
                mb: 3,
                borderRadius: 2,
                fontSize: '0.85rem',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                '& .MuiAlert-icon': { color: '#dc2626' },
                '& .MuiAlert-message': { color: '#991b1b' }
            }}>
              {error}
            </Alert>)}

          <Box component="form" onSubmit={handleLogin}>
            {/* Email */}
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#2d3748', mb: 0.75, fontFamily: 'Inter, sans-serif' }}>
              Email / Username
            </Typography>
            <TextField required fullWidth id="email" name="email" placeholder="admin@jhs.com" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} slotProps={{
            input: {
                startAdornment: (<InputAdornment position="start">
                      <EmailIcon sx={{ fontSize: 18, color: '#8a8d93' }}/>
                    </InputAdornment>),
            }
        }} sx={{
            mb: 2.5,
            '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                fontSize: '0.875rem',
                backgroundColor: '#fafbfc',
                transition: 'all 0.2s',
                '& fieldset': { borderColor: '#e2e8f0' },
                '&:hover fieldset': { borderColor: '#696cff', backgroundColor: '#fff' },
                '&.Mui-focused fieldset': { borderColor: '#696cff', borderWidth: 2 },
                '&.Mui-focused': { backgroundColor: '#fff' },
            },
        }}/>

            {/* Password */}
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#2d3748', mb: 0.75, fontFamily: 'Inter, sans-serif' }}>
              Password
            </Typography>
            <TextField required fullWidth id="password" name="password" placeholder="············" type={showPw ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} slotProps={{
            input: {
                startAdornment: (<InputAdornment position="start">
                      <LockIcon sx={{ fontSize: 18, color: '#8a8d93' }}/>
                    </InputAdornment>),
                endAdornment: (<InputAdornment position="end">
                      <IconButton size="small" onClick={() => setShowPw(!showPw)} edge="end">
                        {showPw ? <VisibilityOff sx={{ fontSize: 18, color: '#8a8d93' }}/> : <Visibility sx={{ fontSize: 18, color: '#8a8d93' }}/>}
                      </IconButton>
                    </InputAdornment>),
            }
        }} sx={{
            mb: 1.5,
            '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                fontSize: '0.875rem',
                backgroundColor: '#fafbfc',
                transition: 'all 0.2s',
                '& fieldset': { borderColor: '#e2e8f0' },
                '&:hover fieldset': { borderColor: '#696cff', backgroundColor: '#fff' },
                '&.Mui-focused fieldset': { borderColor: '#696cff', borderWidth: 2 },
                '&.Mui-focused': { backgroundColor: '#fff' },
            },
        }}/>

            {/* Remember me */}
            {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <FormControlLabel
            control={<Checkbox size="small" sx={{ color: '#8a8d93', '&.Mui-checked': { color: '#696cff' } }} />}
            // label={<Typography sx={{ fontSize: '0.8rem', color: '#8a8d93' }}>Remember me</Typography>}
          />
          <Typography sx={{ fontSize: '0.8rem', color: '#696cff', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
            Forgot password?
          </Typography>
        </Box> */}

            {/* Submit */}
            <Button type="submit" fullWidth variant="contained" disabled={loading} sx={{
            py: 1.5,
            borderRadius: 2,
            background: 'linear-gradient(135deg, #696cff 0%, #4a4cf7 100%)',
            fontWeight: 600,
            fontSize: '0.95rem',
            textTransform: 'none',
            fontFamily: 'Inter, sans-serif',
            boxShadow: '0 4px 16px rgba(105,108,255,0.4)',
            transition: 'all 0.3s ease',
            '&:hover': {
                background: 'linear-gradient(135deg, #5a5de0 0%, #3a3cd8 100%)',
                boxShadow: '0 6px 20px rgba(105,108,255,0.5)',
                transform: 'translateY(-1px)'
            },
            '&.Mui-disabled': {
                background: '#e0e0e0',
                color: '#9e9e9e',
                boxShadow: 'none',
                transform: 'none'
            },
        }}>
              {loading ? 'Signing in…' : 'Sign In'}
            </Button>

            {/* Additional Info */}
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Typography sx={{ fontSize: '0.75rem', color: '#a0a3a8', mb: 1 }}>
                Secure login protected by enterprise-grade security
              </Typography>
              {/* <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Typography sx={{ fontSize: '0.7rem', color: '#c1c5ca' }}>
            🔒 SSL Encrypted
          </Typography>
          <Typography sx={{ fontSize: '0.7rem', color: '#c1c5ca' }}>
            🛡️ 2FA Ready
          </Typography>
        </Box> */}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>);
}
