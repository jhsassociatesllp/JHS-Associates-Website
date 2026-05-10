import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Drawer, AppBar, Toolbar, Typography, IconButton,
  Avatar, TextField, InputAdornment, Badge, Tooltip,
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
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const DRAWER_WIDTH = 260;
const SIDEBAR_BG = '#222736';
const SIDEBAR_TEXT = '#8a8d93';

const menuGroups = [
  {
    label: 'DASHBOARDS',
    items: [
      { text: 'Overview', icon: DashboardIcon, path: '/' },
      // { text: 'Analytics', icon: AnalyticsIcon, path: '/analytics' },
      // { text: 'CRM', icon: PeopleIcon, path: '/crm' },
      // { text: 'eCommerce', icon: StoreIcon, path: '/ecommerce' },
      // { text: 'SaaS', icon: SaaSIcon, path: '/saas' },
    ],
  },
  // {
  //   label: 'COMMERCE',
  //   items: [
  //     { text: 'Orders', icon: OrdersIcon, path: '/orders' },
  //     { text: 'Customers', icon: PeopleIcon, path: '/customers' },
  //     { text: 'Invoices', icon: OrdersIcon, path: '/invoices' },
  //     { text: 'Products', icon: ProductsIcon, path: '/products' },
  //   ],
  // },
  {
    label: 'APPS',
    items: [
      // { text: 'Mail', icon: MailIcon, path: '/mail' },
      // { text: 'Chat', icon: ChatIcon, path: '/chat' },
      // { text: 'Calendar', icon: CalendarIcon, path: '/calendar' },
      // { text: 'Kanban', icon: KanbanIcon, path: '/kanban' },
      // { text: 'Projects', icon: ProjectsIcon, path: '/projects' },
      // { text: 'Team', icon: TeamIcon, path: '/team' },
      // { text: 'Activity', icon: ActivityIcon, path: '/activity' },
    ],
  },
  {
    label: 'CONTENT',
    items: [
      { text: 'Articles', icon: ArticleIcon, path: '/articles' },
      { text: 'Blogs', icon: BlogIcon, path: '/blogs' },
    ],
  },
];

function SidebarContent({ onNavigate }: { onNavigate: (path: string) => void }) {
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <Box sx={{ bgcolor: SIDEBAR_BG, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* ── Logo ─────────────────────────────────────────────── */}
      <Box sx={{ p: '20px 20px 16px', display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
        <Box sx={{
          width: 36, height: 36, borderRadius: 1.5,
          background: 'linear-gradient(135deg, #696cff 0%, #4a4cf7 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <DashboardIcon sx={{ color: '#fff', fontSize: 20 }} />
        </Box>
        <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '1.05rem', letterSpacing: 0.3, fontFamily: 'Inter, sans-serif' }}>
          JHS Admin
        </Typography>
      </Box>

      {/* ── Nav Groups ───────────────────────────────────────── */}
      <Box sx={{
        flex: 1, overflowY: 'auto', px: 1.5, pb: 2,
        '&::-webkit-scrollbar': { width: 4 },
        '&::-webkit-scrollbar-track': { background: 'transparent' },
        '&::-webkit-scrollbar-thumb': { background: 'rgba(255,255,255,0.1)', borderRadius: 2 },
      }}>
        {menuGroups.map((group) => (
          <Box key={group.label}>
            <Typography sx={{
              color: '#4a4f68', fontSize: '0.65rem', fontWeight: 700,
              letterSpacing: 1.5, px: 1.5, pt: 2, pb: 0.75,
              userSelect: 'none', textTransform: 'uppercase',
            }}>
              {group.label}
            </Typography>

            {group.items.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <Box
                  key={item.text}
                  onClick={() => onNavigate(item.path)}
                  sx={{
                    display: 'flex', alignItems: 'center', gap: 1.5,
                    px: 1.5, py: '8px', borderRadius: 1.5, mb: 0.25,
                    cursor: 'pointer',
                    bgcolor: active ? 'rgba(105,108,255,0.16)' : 'transparent',
                    '&:hover': { bgcolor: active ? 'rgba(105,108,255,0.16)' : 'rgba(255,255,255,0.05)' },
                    transition: 'background 0.18s',
                  }}
                >
                  <Icon sx={{ fontSize: 18, color: active ? '#696cff' : SIDEBAR_TEXT, flexShrink: 0 }} />
                  <Typography sx={{
                    fontSize: '0.875rem', fontWeight: active ? 600 : 400,
                    color: active ? '#fff' : SIDEBAR_TEXT, flex: 1,
                    fontFamily: 'Inter, sans-serif',
                  }}>
                    {item.text}
                  </Typography>
                  {active && (
                    <Box sx={{ width: 3, height: 18, borderRadius: 4, bgcolor: '#696cff', flexShrink: 0 }} />
                  )}
                </Box>
              );
            })}
          </Box>
        ))}
      </Box>

      {/* ── User Footer ──────────────────────────────────────── */}
      <Box sx={{
        p: 2, borderTop: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0,
      }}>
        <Avatar sx={{ width: 34, height: 34, bgcolor: '#696cff', fontSize: '0.8rem', fontWeight: 700 }}>A</Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ color: '#fff', fontSize: '0.82rem', fontWeight: 600, lineHeight: 1.4 }}>Admin User</Typography>
          <Typography sx={{ color: SIDEBAR_TEXT, fontSize: '0.7rem', lineHeight: 1.4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            admin@jhs.com
          </Typography>
        </Box>
        <Tooltip title="Logout">
          <IconButton size="small" onClick={() => { logout(); navigate('/login'); }}
            sx={{ color: SIDEBAR_TEXT, '&:hover': { color: '#ef4444' } }}>
            <LogoutIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
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