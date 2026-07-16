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
  Timeline as ActivityIcon,
  Article as ArticleIcon,
  RssFeed as BlogIcon,
  Psychology as KnowledgeIcon,
  Description as WhitePaperIcon,
  EmojiEvents as ExcellenciaIcon,
  MarkEmailUnread as NewsletterIcon,
  ContactMail as ContactIcon,
  School as AlumniIcon,
  Feedback as FeedbackIcon,
  Work as WorkIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const DRAWER_WIDTH = 260;
const SIDEBAR_BG = '#ffffff';
const SIDEBAR_TEXT = '#6c757d';
const SIDEBAR_ACTIVE = '#696cff';

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
      { text: 'Excellencia', icon: ExcellenciaIcon, path: '/excellencia', requiredFeature: 'excellencia' },
      { text: 'Newsletters', icon: NewsletterIcon, path: '/newsletters', requiredFeature: 'newsletters' },
    ],
  },
  {
    label: 'COMMUNICATIONS',
    items: [
      { text: 'Contacts', icon: ContactIcon, path: '/contacts', requiredFeature: 'contacts' },
      { text: 'Alumni', icon: AlumniIcon, path: '/alumni', requiredFeature: 'alumni' },
      { text: 'Client Feedback', icon: FeedbackIcon, path: '/feedback', requiredFeature: 'feedback' },
      { text: 'Careers', icon: WorkIcon, path: '/careers', requiredFeature: 'careers' },
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
    <Box sx={{ bgcolor: SIDEBAR_BG, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRight: '1px solid rgba(0,0,0,0.08)' }}>
      {/* ── Logo ─────────────────────────────────────────────── */}
      <Box sx={{ p: '20px 20px 16px', display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <Box sx={{
          width: 36, height: 36, borderRadius: 1.5,
          background: 'linear-gradient(135deg, #696cff 0%, #4a4cf7 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(105,108,255,0.25)',
        }}>
          <DashboardIcon sx={{ color: '#fff', fontSize: 20 }} />
        </Box>
        <Typography sx={{ color: '#2d3748', fontWeight: 700, fontSize: '1.05rem', letterSpacing: 0.3, fontFamily: 'Inter, sans-serif' }}>
          JHS Admin
        </Typography>
      </Box>

      {/* ── Nav Groups ───────────────────────────────────────── */}
      <Box sx={{
        flex: 1, overflowY: 'auto', px: 1.5, pb: 2,
        '&::-webkit-scrollbar': { width: 4 },
        '&::-webkit-scrollbar-track': { background: 'transparent' },
        '&::-webkit-scrollbar-thumb': { background: 'rgba(0,0,0,0.1)', borderRadius: 2 },
      }}>
        {menuGroups.map((group) => {
          // Filter items based on user permissions
          const visibleItems = group.items.filter(item => canAccess(item.requiredFeature));
          
          // Only show the group if it has visible items
          if (visibleItems.length === 0) return null;
          
          return (
            <Box key={group.label}>
              <Typography sx={{
                color: '#9ca3af', fontSize: '0.65rem', fontWeight: 700,
                letterSpacing: 1.5, px: 1.5, pt: 2, pb: 0.75,
                userSelect: 'none', textTransform: 'uppercase',
              }}>
                {group.label}
              </Typography>

              {visibleItems.map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.path;
                return (
                  <Box
                    key={item.text}
                    onClick={() => onNavigate(item.path)}
                    sx={{
                      display: 'flex', alignItems: 'center', gap: 1.5,
                      px: 1.5, py: '9px', borderRadius: 1.5, mb: 0.25,
                      cursor: 'pointer',
                      bgcolor: active ? 'rgba(105,108,255,0.08)' : 'transparent',
                      borderLeft: active ? `3px solid ${SIDEBAR_ACTIVE}` : '3px solid transparent',
                      '&:hover': { bgcolor: active ? 'rgba(105,108,255,0.08)' : 'rgba(0,0,0,0.03)' },
                      transition: 'all 0.18s',
                    }}
                  >
                    <Icon sx={{ fontSize: 18, color: active ? SIDEBAR_ACTIVE : SIDEBAR_TEXT, flexShrink: 0 }} />
                    <Typography sx={{
                      fontSize: '0.875rem', fontWeight: active ? 600 : 500,
                      color: active ? SIDEBAR_ACTIVE : SIDEBAR_TEXT, flex: 1,
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
        p: 2, borderTop: '1px solid rgba(0,0,0,0.06)',
        display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0,
        bgcolor: '#fafbfc',
      }}>
        <Avatar sx={{ 
          width: 34, 
          height: 34, 
          bgcolor: user?.role === 'super_admin' ? '#ef4444' : user?.role === 'hr_admin' ? '#f59e0b' : '#696cff', 
          fontSize: '0.8rem', 
          fontWeight: 700 
        }}>
          {user?.name?.charAt(0) || 'A'}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ color: '#2d3748', fontSize: '0.82rem', fontWeight: 600, lineHeight: 1.4 }}>
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
            sx={{ color: SIDEBAR_TEXT, '&:hover': { color: '#ef4444', bgcolor: 'rgba(239,68,68,0.08)' } }}>
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
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f4f5fa', minHeight: '100vh' }}>

      {/* ── Top AppBar ─────────────────────────────────────── */}
      <AppBar position="fixed" elevation={0} sx={{
        width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
        ml: { sm: `${DRAWER_WIDTH}px` },
        bgcolor: '#fff',
        borderBottom: '1px solid rgba(0,0,0,0.07)',
        color: '#2d3748',
      }}>
        <Toolbar sx={{ gap: 1.5, minHeight: '60px !important' }}>
          <IconButton edge="start" onClick={() => setMobileOpen(true)}
            sx={{ display: { sm: 'none' }, color: '#2d3748' }}>
            <MenuIcon />
          </IconButton>

          {/* Search */}
          <TextField size="small" placeholder="Search (Ctrl+/)"
            sx={{
              maxWidth: 260,
              '& .MuiOutlinedInput-root': {
                bgcolor: '#f4f5fa', borderRadius: 2, fontSize: '0.85rem',
                '& fieldset': { border: 'none' },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#8a8d93', fontSize: 18 }} />
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ flex: 1 }} />

          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton sx={{ color: '#8a8d93' }}>
              <Badge badgeContent={4} color="error" sx={{ '& .MuiBadge-badge': { fontSize: 10, minWidth: 16, height: 16 } }}>
                <NotificationsIcon fontSize="small" />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Settings */}
          <Tooltip title="Settings">
            <IconButton sx={{ color: '#8a8d93' }}>
              <SettingsIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          {/* Avatar */}
          <Avatar sx={{ width: 34, height: 34, bgcolor: '#696cff', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>
            A
          </Avatar>
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
        mt: '60px',
        minHeight: 'calc(100vh - 60px)',
      }}>
        <Outlet />
      </Box>

    </Box>
  );
}
