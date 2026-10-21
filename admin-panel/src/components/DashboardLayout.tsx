import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Drawer, AppBar, Toolbar, Typography, IconButton,
  Avatar, TextField, InputAdornment, Badge, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Analytics as AnalyticsIcon,
  People as PeopleIcon,
  Store as StoreIcon,
  CloudQueue as SaaSIcon,
  Receipt as OrdersIcon,
  Inventory as ProductsIcon,
  Mail as MailIcon,
  Chat as ChatIcon,
  CalendarToday as CalendarIcon,
  ViewKanban as KanbanIcon,
  Assignment as ProjectsIcon,
  Groups as TeamIcon,
  Badge as LeadershipIcon,
  Category as CatalogIcon,
  PrivacyTip as CookieIcon,
  EventAvailable as EventsIcon,
  Timeline as ActivityIcon,
  Article as ArticleIcon,
  RssFeed as BlogIcon,
  Psychology as KnowledgeIcon,
  Description as WhitePaperIcon,
  Gavel as RegulatoryIcon,
  Radar as RegWatchIcon,
  Mic as PodcastIcon,
  NotificationsActive as NotifyIcon,
  EmojiEvents as ExcellenciaIcon,
  MarkEmailUnread as NewsletterIcon,
  ContactMail as ContactIcon,
  School as AlumniIcon,
  Feedback as FeedbackIcon,
  Work as WorkIcon,
  Event as AppointmentIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  CalendarMonth as DateIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const DRAWER_WIDTH = 252;
const SIDEBAR_BG = '#0a1330';
const SIDEBAR_BG_2 = '#0e1a40';
const SIDEBAR_TEXT = 'rgba(255,255,255,0.78)';
const SIDEBAR_TEXT_DIM = 'rgba(255,255,255,0.38)';
const SIDEBAR_ACTIVE = '#2563eb';
// every menu icon gets its own colour, so the list is easy to scan
const ICON_COLORS = ['#60a5fa', '#34d399', '#fbbf24', '#f472b6', '#a78bfa', '#fb923c', '#2dd4bf', '#f87171', '#38bdf8', '#a3e635'];

const menuGroups = [
  {
    label: 'DASHBOARDS',
    items: [
      { text: 'Overview', icon: DashboardIcon, path: '/', requiredFeature: 'dashboard' },
    ],
  },
  {
    label: 'CONTENT',
    items: [
      { text: 'Articles', icon: ArticleIcon, path: '/articles', requiredFeature: 'articles' },
      { text: 'Blogs', icon: BlogIcon, path: '/blogs', requiredFeature: 'blogs' },
      { text: 'Knowledge Resources', icon: KnowledgeIcon, path: '/knowledge', requiredFeature: 'knowledge' },
      { text: 'White Papers', icon: WhitePaperIcon, path: '/white-papers', requiredFeature: 'white_papers' },
      { text: 'Regulatory', icon: RegulatoryIcon, path: '/regulatory', requiredFeature: 'regulatory' },
      { text: 'Reg-Watch', icon: RegWatchIcon, path: '/reg-watch', requiredFeature: 'reg_watch' },
      { text: 'Podcasts', icon: PodcastIcon, path: '/podcasts', requiredFeature: 'podcasts' },
      { text: 'Email Notifications', icon: NotifyIcon, path: '/notifications', requiredFeature: 'notifications' },
      { text: 'Excellencia', icon: ExcellenciaIcon, path: '/excellencia', requiredFeature: 'excellencia' },
      { text: 'Newsletters', icon: NewsletterIcon, path: '/newsletters', requiredFeature: 'newsletters' },
      { text: 'Leadership', icon: LeadershipIcon, path: '/leadership', requiredFeature: 'leadership' },
      { text: 'Services & Sectors', icon: CatalogIcon, path: '/services-sectors', requiredFeature: 'catalog' },
      { text: 'Events', icon: EventsIcon, path: '/events', requiredFeature: 'events' },
    ],
  },
  {
    label: 'COMMUNICATIONS',
    items: [
      { text: 'Contacts', icon: ContactIcon, path: '/contacts', requiredFeature: 'contacts' },
      { text: 'Alumni', icon: AlumniIcon, path: '/alumni', requiredFeature: 'alumni' },
      { text: 'Client Feedback', icon: FeedbackIcon, path: '/feedback', requiredFeature: 'feedback' },
      { text: 'Careers', icon: WorkIcon, path: '/careers', requiredFeature: 'careers' },
      { text: 'Appointments', icon: AppointmentIcon, path: '/appointments', requiredFeature: 'appointments' },
      { text: 'Users', icon: PeopleIcon, path: '/users', requiredFeature: 'users' },
      { text: 'Cookie Consent', icon: CookieIcon, path: '/cookie-consent', requiredFeature: 'cookies' },
    ],
  },
];

function SidebarContent({ onNavigate }: { onNavigate: (path: string) => void }) {
  const location = useLocation();
  const { logout, user, canAccess } = useAuth();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    logout();
    navigate('/login');
    setShowLogoutModal(false);
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  return (
    <Box sx={{ bgcolor: SIDEBAR_BG, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* ── Logo ─────────────────────────────────────────────── */}
      <Box sx={{ p: '20px 20px 16px', display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
        <Box
          component="img"
          src="/logo.webp"
          alt="JHS"
          sx={{
            width: 40, height: 40, borderRadius: 1.5, objectFit: 'contain', bgcolor: '#fff', p: '3px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.35)', flexShrink: 0,
          }}
        />
        <Box sx={{ lineHeight: 1.15 }}>
          <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '1.05rem', letterSpacing: 0.3, fontFamily: 'Inter, sans-serif' }}>
            JHS Admin
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.7rem', letterSpacing: 0.4, fontFamily: 'Inter, sans-serif' }}>
            Management console
          </Typography>
        </Box>
      </Box>

      {/* ── Nav Groups ───────────────────────────────────────── */}
      <Box sx={{
        flex: 1, overflowY: 'auto', px: 1.5, pb: 2, pt: 0.5,
        '&::-webkit-scrollbar': { width: 4 },
        '&::-webkit-scrollbar-track': { background: 'transparent' },
        '&::-webkit-scrollbar-thumb': { background: 'rgba(255,255,255,0.12)', borderRadius: 2 },
      }}>
        {menuGroups.map((group) => {
          // Filter items based on user permissions
          const visibleItems = group.items.filter(item => canAccess(item.requiredFeature));

          // Only show the group if it has visible items
          if (visibleItems.length === 0) return null;

          return (
            <Box key={group.label}>
              <Typography sx={{
                color: SIDEBAR_TEXT_DIM, fontSize: '0.65rem', fontWeight: 700,
                letterSpacing: 1.5, px: 1.5, pt: 2, pb: 0.75,
                userSelect: 'none', textTransform: 'uppercase',
              }}>
                {group.label}
              </Typography>

              {visibleItems.map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.path;
                const iconColor = ICON_COLORS[menuGroups.flatMap((g) => g.items).findIndex((i) => i.path === item.path) % ICON_COLORS.length];
                return (
                  <Box
                    key={item.text}
                    onClick={() => onNavigate(item.path)}
                    sx={{
                      display: 'flex', alignItems: 'center', gap: 1.5,
                      px: 1.5, py: '10px', borderRadius: 1.5, mb: 0.4,
                      cursor: 'pointer',
                      bgcolor: active ? SIDEBAR_ACTIVE : 'transparent',
                      boxShadow: active ? '0 6px 18px rgba(37,99,235,0.45)' : 'none',
                      '&:hover': { bgcolor: active ? SIDEBAR_ACTIVE : 'rgba(255,255,255,0.07)' },
                      transition: 'all 0.18s',
                    }}
                  >
                    <Icon sx={{ fontSize: 20, color: active ? '#fff' : iconColor, flexShrink: 0 }} />
                    <Typography sx={{
                      fontSize: '0.875rem', fontWeight: active ? 600 : 500,
                      color: active ? '#fff' : SIDEBAR_TEXT, flex: 1,
                      fontFamily: 'Inter, sans-serif',
                    }}>
                      {item.text}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          );
        })}
      </Box>

      {/* ── User Footer ──────────────────────────────────────── */}
      <Box sx={{
        p: 2, borderTop: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0,
        bgcolor: SIDEBAR_BG_2,
      }}>
        <Avatar sx={{
          width: 34,
          height: 34,
          bgcolor: user?.role === 'super_admin' ? '#ef4444' : user?.role === 'hr_admin' ? '#f59e0b' : '#2563eb',
          fontSize: '0.8rem',
          fontWeight: 700
        }}>
          {user?.name?.charAt(0) || 'A'}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ color: '#fff', fontSize: '0.82rem', fontWeight: 600, lineHeight: 1.4 }}>
            {user?.name || 'Admin User'}
          </Typography>
          <Typography sx={{ color: SIDEBAR_TEXT, fontSize: '0.7rem', lineHeight: 1.4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {user?.role === 'super_admin' ? '🔴 Super Admin' :
             user?.role === 'hr_admin' ? '🟡 HR Admin' :
             '🟢 Content Admin'} • {user?.email}
          </Typography>
        </Box>
        <Tooltip title="Logout">
          <IconButton size="small" onClick={handleLogoutClick}
            sx={{ color: SIDEBAR_TEXT, '&:hover': { color: '#ef4444', bgcolor: 'rgba(239,68,68,0.12)' } }}>
            <LogoutIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Logout Confirmation Modal */}
      <Dialog
        open={showLogoutModal}
        onClose={handleLogoutCancel}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            overflow: 'visible',
          }
        }}
      >
        <DialogTitle sx={{ 
          textAlign: 'center', 
          pt: 4, 
          pb: 2,
          fontSize: '1.25rem',
          fontWeight: 700,
          color: '#2d3748',
          fontFamily: 'Inter, sans-serif'
        }}>
          <Box sx={{ 
            width: 64, 
            height: 64, 
            borderRadius: '50%', 
            bgcolor: '#fef2f2', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            mx: 'auto',
            mb: 2,
            border: '3px solid #fee2e2'
          }}>
            <LogoutIcon sx={{ fontSize: 28, color: '#ef4444' }} />
          </Box>
          Confirm Logout
        </DialogTitle>
        
        <DialogContent sx={{ textAlign: 'center', pb: 2 }}>
          <Typography sx={{ 
            fontSize: '0.95rem', 
            color: '#64748b', 
            lineHeight: 1.6,
            mb: 1
          }}>
            Are you sure you want to logout from your admin session?
          </Typography>
          <Typography sx={{ 
            fontSize: '0.85rem', 
            color: '#94a3b8'
          }}>
          </Typography>
        </DialogContent>
        
        <DialogActions sx={{ 
          justifyContent: 'center', 
          gap: 2, 
          px: 3, 
          pb: 4 
        }}>
          <Button
            onClick={handleLogoutCancel}
            variant="outlined"
            sx={{
              minWidth: 100,
              py: 1.2,
              borderRadius: 2,
              borderColor: '#e2e8f0',
              color: '#64748b',
              fontWeight: 600,
              fontSize: '0.875rem',
              textTransform: 'none',
              fontFamily: 'Inter, sans-serif',
              '&:hover': {
                borderColor: '#cbd5e1',
                bgcolor: '#f8fafc'
              }
            }}
          >
            Cancel
          </Button>
          
          <Button
            onClick={handleLogoutConfirm}
            variant="contained"
            sx={{
              minWidth: 100,
              py: 1.2,
              borderRadius: 2,
              bgcolor: '#ef4444',
              fontWeight: 600,
              fontSize: '0.875rem',
              textTransform: 'none',
              fontFamily: 'Inter, sans-serif',
              boxShadow: '0 4px 12px rgba(239,68,68,0.3)',
              '&:hover': {
                bgcolor: '#dc2626',
                boxShadow: '0 6px 16px rgba(239,68,68,0.4)'
              }
            }}
          >
            Yes, Logout
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const roleLabel = user?.role === 'super_admin' ? 'Super Admin' : user?.role === 'hr_admin' ? 'HR Admin' : 'Content Admin';

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().then(() => setFullscreen(false)).catch(() => undefined);
    } else {
      document.documentElement.requestFullscreen().then(() => setFullscreen(true)).catch(() => undefined);
    }
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: '#eef2f9', minHeight: '100vh' }}>

      {/* ── Top AppBar ─────────────────────────────────────── */}
      <AppBar position="fixed" elevation={0} sx={{
        width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
        ml: { sm: `${DRAWER_WIDTH}px` },
        bgcolor: '#fff',
        borderBottom: '1px solid rgba(15,35,64,0.06)',
        boxShadow: '0 4px 20px rgba(15,35,64,0.05)',
        color: '#1e293b',
      }}>
        <Toolbar sx={{ gap: 1.5, minHeight: '64px !important' }}>
          <IconButton edge="start" onClick={() => setMobileOpen(true)}
            sx={{ display: { sm: 'none' }, color: '#1e293b' }}>
            <MenuIcon />
          </IconButton>

          {/* Search */}
          <TextField size="small" placeholder="Search records"
            sx={{
              flex: { xs: 1, sm: '0 1 420px' },
              '& .MuiOutlinedInput-root': {
                bgcolor: '#f1f5fb', borderRadius: 999, fontSize: '0.85rem',
                '& fieldset': { borderColor: 'transparent' },
                '&:hover fieldset': { borderColor: '#d6dfee' },
                '&.Mui-focused fieldset': { borderColor: '#2563eb' },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#7b8aa5', fontSize: 19 }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Box sx={{
                    display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.3,
                    px: 0.8, py: 0.15, borderRadius: 1, bgcolor: '#fff',
                    border: '1px solid #dbe3ef', color: '#8a97ad', fontSize: '0.7rem', fontWeight: 600,
                  }}>
                    ⌘ /
                  </Box>
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ flex: 1 }} />

          {/* Today */}
          <Box sx={{
            display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.8,
            px: 1.6, py: 0.8, borderRadius: 999, border: '1px solid #dbe3ef', bgcolor: '#fff',
            color: '#334155', fontSize: '0.8rem', fontWeight: 600,
          }}>
            <DateIcon sx={{ fontSize: 17, color: '#2563eb' }} />
            {today}
          </Box>

          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton sx={{ color: '#64748b' }}>
              <Badge badgeContent={4} color="error" sx={{ '& .MuiBadge-badge': { fontSize: 10, minWidth: 16, height: 16 } }}>
                <NotificationsIcon fontSize="small" />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Settings */}
          <Tooltip title="Settings">
            <IconButton sx={{ color: '#64748b', display: { xs: 'none', sm: 'inline-flex' } }}>
              <SettingsIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          {/* Full screen */}
          <Tooltip title={fullscreen ? 'Exit full screen' : 'Full screen'}>
            <IconButton onClick={toggleFullscreen} sx={{ color: '#64748b', display: { xs: 'none', sm: 'inline-flex' } }}>
              {fullscreen ? <FullscreenExitIcon fontSize="small" /> : <FullscreenIcon fontSize="small" />}
            </IconButton>
          </Tooltip>

          {/* User */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, pl: 1.2, ml: 0.5, borderLeft: '1px solid #e5eaf3' }}>
            <Box sx={{ display: { xs: 'none', md: 'block' }, textAlign: 'right', lineHeight: 1.2 }}>
              <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e293b' }}>{user?.name || 'Admin'}</Typography>
              <Typography sx={{ fontSize: '0.7rem', color: '#16a34a', fontWeight: 600 }}>{roleLabel}</Typography>
            </Box>
            <Avatar sx={{ width: 36, height: 36, bgcolor: '#2563eb', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(37,99,235,0.35)' }}>
              {user?.name?.charAt(0) || 'A'}
            </Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      {/* ── Sidebar ────────────────────────────────────────── */}
      <Box component="nav" sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}>
        {/* Mobile */}
        <Drawer variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { width: DRAWER_WIDTH, bgcolor: SIDEBAR_BG, border: 'none' } }}>
          <SidebarContent onNavigate={handleNavigate} />
        </Drawer>
        {/* Desktop */}
        <Drawer variant="permanent" open
          sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { width: DRAWER_WIDTH, bgcolor: SIDEBAR_BG, border: 'none' } }}>
          <SidebarContent onNavigate={handleNavigate} />
        </Drawer>
      </Box>

      {/* ── Main Content ───────────────────────────────────── */}
      <Box component="main" sx={{
        flexGrow: 1,
        width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
        mt: '64px',
        minHeight: 'calc(100vh - 64px)',
      }}>
        <Outlet />
      </Box>

    </Box>
  );
}
