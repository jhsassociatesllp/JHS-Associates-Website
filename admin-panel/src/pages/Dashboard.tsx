import React, { useEffect, useState } from 'react';
import {
  Typography, Grid, Box, CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  LinearProgress, IconButton, Avatar, Card, CardContent
} from '@mui/material';
import {
  Person as PersonIcon,
  ShoppingCart as ShoppingCartIcon,
  ThumbUp as ThumbUpIcon,
  TouchApp as TouchAppIcon,
  MoreVert as MoreVertIcon,
  ArrowUpward as ArrowUpwardIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Google as GoogleIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  created_at: string;
}

// ─── Design tokens matching the Pluto admin panel ───────────────────────────
const ORANGE = '#f97316';
const DARK_NAVY = '#1e2a3b';
const CARD_BG = '#ffffff';
const PAGE_BG = '#f4f6f9';
const TEXT_MAIN = '#344767';
const TEXT_MUTED = '#8392ab';
const SHADOW = '0 2px 12px rgba(0,0,0,0.08)';
const RADIUS = 3;

// Stat card icon colours (teal, blue, pink, green) as seen in image
const STAT_ICON_COLORS = ['#26c6da', '#42a5f5', '#ec407a', '#66bb6a'];

// Social card colours
const SOCIAL = [
  { label: 'Facebook', color: '#3b5998', icon: <FacebookIcon />, fans: '35k', likes: '128' },
  { label: 'Twitter', color: '#1da1f2', icon: <TwitterIcon />, fans: '58.4k', likes: '978' },
  { label: 'LinkedIn', color: '#0077b5', icon: <LinkedInIcon />, fans: '750+', likes: '305' },
  { label: 'Google+', color: '#dd4b39', icon: <GoogleIcon />, fans: '450', likes: '97' },
];

export default function Dashboard() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/admin/contacts', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setContacts(response.data);
      } catch (error) {
        console.error("Failed to fetch contacts", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, [token]);

  // ─── Stat cards data (matching the 4 cards in the image) ──────────────────
  const statCards = [
    {
      label: 'Total Contacts',
      value: loading ? null : contacts.length,
      icon: <PersonIcon />,
      change: '+55%',
    },
    {
      label: 'Click Events',
      value: '2500',
      icon: <TouchAppIcon />,
      change: '+124%',
    },
    {
      label: 'Service Inquiries',
      value: '123.50',
      icon: <ShoppingCartIcon />,
      change: '+15%',
    },
    {
      label: 'Likes',
      value: '54',
      icon: <ThumbUpIcon />,
      change: '+90%',
    },
  ];

  return (
    <Box sx={{ bgcolor: PAGE_BG, minHeight: '100vh', p: 3 }}>

      {/* ── Page Title ────────────────────────────────────────────────────── */}
      <Typography
        variant="h5"
        sx={{ fontWeight: 700, color: TEXT_MAIN, mb: 3, fontFamily: "'Nunito', sans-serif" }}
      >
        Dashboard
      </Typography>

      {/* ── Row 1: Stat Cards ─────────────────────────────────────────────── */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {statCards.map((card, i) => (
          <Grid xs={12} sm={6} md={3} key={card.label}>
            <Card sx={{ bgcolor: CARD_BG, borderRadius: RADIUS, boxShadow: SHADOW, overflow: 'visible' }}>
              <CardContent sx={{ p: 2.5, pb: '20px !important' }}>
                {/* Icon bubble — coloured circle like the image */}
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    bgcolor: STAT_ICON_COLORS[i],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    mb: 1.5,
                    boxShadow: `0 4px 14px ${STAT_ICON_COLORS[i]}55`,
                  }}
                >
                  {card.icon}
                </Box>

                <Typography variant="h4" sx={{ fontWeight: 700, color: TEXT_MAIN, lineHeight: 1, fontFamily: "'Nunito', sans-serif" }}>
                  {card.value !== null ? card.value : <CircularProgress size={22} />}
                </Typography>
                <Typography variant="body2" sx={{ color: TEXT_MUTED, mt: 0.5, fontWeight: 500 }}>
                  {card.label}
                </Typography>

                {/* Divider + change */}
                <Box sx={{ borderTop: '1px solid #e9ecef', mt: 1.5, pt: 1.2, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <ArrowUpwardIcon sx={{ fontSize: 14, color: '#4caf50' }} />
                  <Typography variant="caption" sx={{ color: '#4caf50', fontWeight: 700 }}>{card.change}</Typography>
                  <Typography variant="caption" sx={{ color: TEXT_MUTED }}>&nbsp;since last month</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ── Row 2: Social Cards ───────────────────────────────────────────── */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {SOCIAL.map((s) => (
          <Grid xs={12} sm={6} md={3} key={s.label}>
            <Card sx={{ bgcolor: s.color, borderRadius: RADIUS, boxShadow: SHADOW, color: '#fff' }}>
              <CardContent sx={{ p: 0, pb: '0 !important' }}>
                {/* Top section: icon + label */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 2, pb: 1.5 }}>
                  <Box sx={{ opacity: 0.9, display: 'flex' }}>{s.icon}</Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, fontFamily: "'Nunito', sans-serif" }}>
                    {s.label}
                  </Typography>
                </Box>
                {/* Bottom section: fans / likes — slightly darker */}
                <Box
                  sx={{
                    bgcolor: 'rgba(0,0,0,0.18)',
                    display: 'flex',
                    justifyContent: 'space-around',
                    py: 1,
                    px: 2,
                  }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{s.fans}</Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>Fans</Typography>
                  </Box>
                  <Box sx={{ width: '1px', bgcolor: 'rgba(255,255,255,0.2)' }} />
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{s.likes}</Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>Likes</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ── Row 3: Submissions Table + Client Sentiment ───────────────────── */}
      <Grid container spacing={2.5}>

        {/* Submissions Table */}
        <Grid xs={12} md={8}>
          <Card sx={{ bgcolor: CARD_BG, borderRadius: RADIUS, boxShadow: SHADOW, height: '100%' }}>
            <Box sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e9ecef' }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: TEXT_MAIN, fontFamily: "'Nunito', sans-serif" }}>
                  Recent Submissions
                </Typography>
                <Typography variant="body2" sx={{ color: TEXT_MUTED, display: 'flex', alignItems: 'center', mt: 0.3 }}>
                  <Box component="span" sx={{ color: '#4caf50', display: 'flex', mr: 0.5 }}>
                    <ArrowUpwardIcon fontSize="small" />
                  </Box>
                  <Box component="span" sx={{ fontWeight: 700, color: TEXT_MAIN }}>30 done</Box>
                  &nbsp;this month
                </Typography>
              </Box>
              <IconButton size="small">
                <MoreVertIcon />
              </IconButton>
            </Box>

            <TableContainer>
              <Table aria-label="contacts table">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#fafbfc' }}>
                    {['Client / Service', 'Email', 'Message'].map((h) => (
                      <TableCell
                        key={h}
                        sx={{
                          color: TEXT_MUTED,
                          fontWeight: 700,
                          fontSize: '0.72rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          borderBottom: '1px solid #e9ecef',
                          py: 1.2,
                        }}
                      >
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center" sx={{ py: 4, border: 0 }}>
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : contacts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center" sx={{ py: 4, border: 0, color: TEXT_MUTED }}>
                        No submissions found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    contacts.slice(0, 5).map((row) => (
                      <TableRow key={row.id} hover sx={{ '&:last-child td': { border: 0 } }}>
                        <TableCell sx={{ py: 1.8, borderBottom: '1px solid #e9ecef' }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: TEXT_MAIN }}>
                            {row.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: TEXT_MUTED }}>
                            {row.service || 'General Query'}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 1.8, borderBottom: '1px solid #e9ecef', color: TEXT_MUTED, fontSize: '0.84rem' }}>
                          {row.email}
                        </TableCell>
                        <TableCell
                          sx={{
                            py: 1.8,
                            borderBottom: '1px solid #e9ecef',
                            maxWidth: 200,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            color: TEXT_MUTED,
                            fontSize: '0.84rem',
                          }}
                        >
                          {row.message}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>

        {/* Client Sentiment */}
        <Grid xs={12} md={4}>
          <Card sx={{ bgcolor: CARD_BG, borderRadius: RADIUS, boxShadow: SHADOW, height: '100%' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: TEXT_MAIN, mb: 2.5, fontFamily: "'Nunito', sans-serif" }}>
                Client Sentiment
              </Typography>

              {[
                { label: 'Positive Reviews', pct: 80, color: ORANGE },
                { label: 'Neutral Reviews', pct: 17, color: DARK_NAVY },
                { label: 'Negative Reviews', pct: 3, color: '#ea0606' },
              ].map((item) => (
                <Box sx={{ mb: 2.5 }} key={item.label}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: TEXT_MAIN }}>
                      {item.label}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: TEXT_MUTED }}>
                      {item.pct}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={item.pct}
                    sx={{
                      height: 6,
                      borderRadius: 5,
                      bgcolor: '#e9ecef',
                      '& .MuiLinearProgress-bar': { bgcolor: item.color, borderRadius: 5 },
                    }}
                  />
                </Box>
              ))}

              <Typography variant="body2" sx={{ color: TEXT_MUTED, lineHeight: 1.7, mt: 1 }}>
                More than <strong style={{ color: TEXT_MAIN }}>1,500,000</strong> clients trust our professional
                services and consulting expertise.
              </Typography>

              <Box
                component="button"
                sx={{
                  mt: 3,
                  width: '100%',
                  bgcolor: DARK_NAVY,
                  color: '#fff',
                  border: 'none',
                  borderRadius: 2,
                  py: 1.4,
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  fontFamily: "'Nunito', sans-serif",
                  transition: 'background 0.2s',
                  '&:hover': { bgcolor: '#16202e' },
                }}
              >
                View all reviews
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}