import React, { useEffect, useState } from 'react';
import {
  Typography, Box, Card, CardContent, LinearProgress,
  ToggleButtonGroup, ToggleButton, CircularProgress,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  ShoppingCart as ShoppingCartIcon,
  FlashOn as FlashOnIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
} from '@mui/icons-material';
import {
  AreaChart, Area, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

/* ─── Design Tokens ────────────────────────────────────────── */
const C = {
  pageBg:   '#f4f5fa',
  cardBg:   '#ffffff',
  textMain: '#2d3748',
  textMuted:'#8a8d93',
  border:   'rgba(0,0,0,0.07)',
  shadow:   '0 2px 8px rgba(0,0,0,0.08)',
};

/* ─── Static Data ──────────────────────────────────────────── */
const sparkSets = [
  [20, 35, 28, 45, 38, 52, 75].map(v => ({ v })),
  [5,  8,  6, 12,  8, 10, 16].map(v => ({ v })),
  [80, 95, 88,110,102,118,122].map(v => ({ v })),
  [200,350,280,420,380,490,573].map(v => ({ v })),
];

const dailyRevenue = [
  { day: 'Mon', revenue: 32000 },
  { day: 'Tue', revenue: 48000 },
  { day: 'Wed', revenue: 41000 },
  { day: 'Thu', revenue: 61000 },
  { day: 'Fri', revenue: 54000 },
  { day: 'Sat', revenue: 72000 },
  { day: 'Sun', revenue: 68000 },
];
const weeklyRevenue = [
  { day: 'W1', revenue: 180000 },
  { day: 'W2', revenue: 220000 },
  { day: 'W3', revenue: 195000 },
  { day: 'W4', revenue: 260000 },
];
const monthlyRevenue = [
  { day: 'Jan', revenue: 420000 },
  { day: 'Feb', revenue: 380000 },
  { day: 'Mar', revenue: 510000 },
  { day: 'Apr', revenue: 470000 },
  { day: 'May', revenue: 620000 },
  { day: 'Jun', revenue: 590000 },
];

const trafficData = [
  { name: 'Direct',   value: 45, color: '#3b82f6' },
  { name: 'Organic',  value: 30, color: '#10b981' },
  { name: 'Social',   value: 15, color: '#8b5cf6' },
  { name: 'Referral', value: 10, color: '#f59e0b' },
];

const goalsData = [
  { label: 'New Signups',      current: 842,   target: '04/21/232', pct: 84, color: '#696cff' },
  { label: 'Revenue Target',   current: 34200, target: '34000/50000', pct: 68, color: '#10b981' },
  { label: 'Feature Adoption', current: 6285,  target: '62855',    pct: 63, color: '#ff9f43' },
];

const STAT_CARDS = [
  {
    label: 'Total Revenue',
    value: '$45,231.89',
    icon: TrendingUpIcon,
    iconColor: '#10b981',
    change: '+20.1%',
    sub: 'from last month',
    positive: true,
    sparkIdx: 0,
    lineColor: '#10b981',
  },
  {
    label: 'Active Users',
    value: '16',
    icon: PeopleIcon,
    iconColor: '#3b82f6',
    change: '+180.1%',
    sub: 'from last month',
    positive: true,
    sparkIdx: 1,
    lineColor: '#3b82f6',
  },
  {
    label: 'Sales',
    value: '+12,234',
    icon: ShoppingCartIcon,
    iconColor: '#ec4899',
    change: '+19%',
    sub: 'from last month',
    positive: true,
    sparkIdx: 2,
    lineColor: '#ec4899',
  },
  {
    label: 'Active Now',
    value: '+573',
    icon: FlashOnIcon,
    iconColor: '#f59e0b',
    change: '+201',
    sub: 'since last hour',
    positive: true,
    sparkIdx: 3,
    lineColor: '#f59e0b',
  },
];

const rangeDataMap: Record<string, typeof dailyRevenue> = {
  '1d': dailyRevenue,
  '3d': weeklyRevenue,
  '1m': monthlyRevenue,
};



/* ─── Component ─────────────────────────────────────────────── */
export default function Dashboard() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [revenueRange, setRevenueRange] = useState<'1d' | '3d' | '1m'>('1d');
  const revenueData = rangeDataMap[revenueRange];

  useEffect(() => {
    axios.get('http://localhost:8000/admin/contacts', {
      headers: { Authorization: `Bearer ${token}` },
    }).finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <CircularProgress sx={{ color: '#696cff' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: C.pageBg, minHeight: '100%' }}>

      {/* ── Page Header ─────────────────────────────────────── */}
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontSize: '1.4rem', fontWeight: 700, color: C.textMain, fontFamily: 'Inter,sans-serif' }}>
          Dashboard
        </Typography>
        <Typography sx={{ fontSize: '0.85rem', color: C.textMuted, mt: 0.25 }}>
          Welcome back, Admin. Here's what's happening.
        </Typography>
      </Box>

      {/* ── Row 1: Stat Cards ───────────────────────────────── */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' }, gap: 2.5, mb: 2.5 }}>
        {STAT_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.label} elevation={0} sx={{ bgcolor: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 2, overflow: 'visible' }}>
              <CardContent sx={{ p: '20px !important' }}>
                {/* Top Row: Label + Icon */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
                  <Typography sx={{ fontSize: '0.78rem', color: C.textMuted, fontWeight: 500, fontFamily: 'Inter,sans-serif', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    {card.label}
                  </Typography>
                  <Box sx={{
                    width: 38, height: 38, borderRadius: 1.5,
                    bgcolor: `${card.iconColor}18`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <Icon sx={{ fontSize: 20, color: card.iconColor }} />
                  </Box>
                </Box>

                {/* Value */}
                <Typography sx={{ fontSize: '1.75rem', fontWeight: 700, color: C.textMain, lineHeight: 1.2, fontFamily: 'Inter,sans-serif', mb: 1 }}>
                  {card.value}
                </Typography>

                {/* Sparkline */}
                <Box sx={{ height: 44, mb: 1 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sparkSets[card.sparkIdx]}>
                      <Line type="monotone" dataKey="v" stroke={card.lineColor} strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>

                {/* Change */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {card.positive
                    ? <ArrowUpIcon sx={{ fontSize: 13, color: '#10b981' }} />
                    : <ArrowDownIcon sx={{ fontSize: 13, color: '#ef4444' }} />}
                  <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: card.positive ? '#10b981' : '#ef4444' }}>
                    {card.change}
                  </Typography>
                  <Typography sx={{ fontSize: '0.78rem', color: C.textMuted }}>
                    {card.sub}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Box>

      {/* ── Row 2: Revenue Chart + Right Panel ──────────────── */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 340px' }, gap: 2.5, alignItems: 'start' }}>

        {/* Revenue Area Chart */}
        <Card elevation={0} sx={{ bgcolor: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 2 }}>
          <CardContent sx={{ p: '20px !important' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 0.5 }}>
              <Box>
                <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: C.textMain, fontFamily: 'Inter,sans-serif' }}>
                  Revenue
                </Typography>
                <Typography sx={{ fontSize: '0.78rem', color: C.textMuted }}>
                  Gross revenue by day
                </Typography>
              </Box>
              <ToggleButtonGroup
                size="small"
                value={revenueRange}
                exclusive
                onChange={(_, v) => v && setRevenueRange(v)}
                sx={{
                  '& .MuiToggleButton-root': {
                    fontSize: '0.72rem', fontWeight: 600, px: 1.5, py: 0.4, border: '1px solid #e0e0e0',
                    color: C.textMuted, textTransform: 'none',
                    '&.Mui-selected': { bgcolor: '#696cff', color: '#fff', borderColor: '#696cff' },
                    '&.Mui-selected:hover': { bgcolor: '#5a5de0' },
                  },
                }}
              >
                <ToggleButton value="1d">1d</ToggleButton>
                <ToggleButton value="3d">3d</ToggleButton>
                <ToggleButton value="1m">1m</ToggleButton>
              </ToggleButtonGroup>
            </Box>

            <Box sx={{ height: 260, mt: 2 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#10b981" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#8a8d93' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#8a8d93' }} axisLine={false} tickLine={false}
                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 12 }}
                    formatter={(v: number) => [`$${v.toLocaleString()}`, 'Revenue']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2.5} fill="url(#revGrad)" dot={false} activeDot={{ r: 5, fill: '#10b981' }} />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>

        {/* Right Panel: Traffic + Goals */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>

          {/* Traffic Sources */}
          <Card elevation={0} sx={{ bgcolor: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 2 }}>
            <CardContent sx={{ p: '20px !important' }}>
              <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: C.textMain, fontFamily: 'Inter,sans-serif', mb: 0.25 }}>
                Traffic Sources
              </Typography>
              <Typography sx={{ fontSize: '0.78rem', color: C.textMuted, mb: 1.5 }}>
                Where your visitors came from
              </Typography>

              {/* Donut */}
              <Box sx={{ height: 160, position: 'relative' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={trafficData}
                      cx="50%" cy="50%"
                      innerRadius={52} outerRadius={72}
                      paddingAngle={2}
                      dataKey="value"
                      startAngle={90} endAngle={-270}
                    >
                      {trafficData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                {/* Center label overlay */}
                <Box sx={{
                  position: 'absolute', top: '50%', left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center', pointerEvents: 'none',
                }}>
                  <Typography sx={{ fontSize: '1.3rem', fontWeight: 700, color: '#2d3748', lineHeight: 1.1, fontFamily: 'Inter,sans-serif' }}>100</Typography>
                  <Typography sx={{ fontSize: '0.7rem', color: '#8a8d93' }}>Total</Typography>
                </Box>
              </Box>

              {/* Legend */}
              <Box sx={{ mt: 1 }}>
                {trafficData.map((src) => (
                  <Box key={src.name} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.75 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: src.color, flexShrink: 0 }} />
                      <Typography sx={{ fontSize: '0.8rem', color: C.textMuted }}>{src.name}</Typography>
                    </Box>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: C.textMain }}>{src.value}%</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* Goals */}
          <Card elevation={0} sx={{ bgcolor: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 2 }}>
            <CardContent sx={{ p: '20px !important' }}>
              <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: C.textMain, fontFamily: 'Inter,sans-serif', mb: 0.25 }}>
                Goals
              </Typography>
              <Typography sx={{ fontSize: '0.78rem', color: C.textMuted, mb: 2 }}>
                Quarterly progress
              </Typography>

              {goalsData.map((goal) => (
                <Box key={goal.label} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.6 }}>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: C.textMain }}>{goal.label}</Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: C.textMuted }}>{goal.target}</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={goal.pct}
                    sx={{
                      height: 6, borderRadius: 3,
                      bgcolor: '#f0f0f5',
                      '& .MuiLinearProgress-bar': { bgcolor: goal.color, borderRadius: 3 },
                    }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>

        </Box>
      </Box>
    </Box>
  );
}