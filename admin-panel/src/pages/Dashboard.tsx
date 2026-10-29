import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography, Box, Card, CardContent, Chip,
  ToggleButtonGroup, ToggleButton, CircularProgress,
} from '@mui/material';
import {
  Article as ArticleIcon,
  Gavel as RegulatoryIcon,
  Radar as RegWatchIcon,
  Description as WhitePaperIcon,
  MenuBook as KnowledgeIcon,
  Layers as AllContentIcon,
  ContactMail as ContactIcon,
  RequestQuote as ProposalIcon,
  Work as WorkIcon,
  Event as AppointmentIcon,
  School as AlumniIcon,
  Feedback as FeedbackIcon,
  People as PeopleIcon,
  ConfirmationNumber as RegistrationIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { timeAgo } from '../utils/dateTime';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string
const REFRESH_EVERY_MS = 20000; // the dashboard re-reads the live numbers every 20 seconds

/* ─── Design Tokens ────────────────────────────────────────── */
const C = {
  pageBg:   '#eef2f9',
  cardBg:   '#ffffff',
  textMain: '#1e293b',
  textMuted:'#6b7a90',
  border:   'rgba(15,35,64,0.06)',
  shadow:   '0 6px 22px rgba(15,35,64,0.07)',
  accent:   '#2563eb',
  success:  '#16a34a',
  warning:  '#f59e0b',
  danger:   '#ef4444',
  info:     '#3b82f6',
};

/* ─── Types (what /dashboard/stats returns) ─────────────────── */
interface Counter { label: string; path: string; total: number; today: number; week: number; month: number; attention?: number }
type SeriesRow = { label: string } & Record<string, number | string>;
interface Series { week: SeriesRow[]; month: SeriesRow[]; year: SeriesRow[] }
interface RecentItem { type: string; title: string; subtitle: string; at: string | null; path: string }
interface Stats {
  generated_at: string;
  role: string;
  content: Record<string, Counter> | null;
  submissions: Record<string, Counter> | null;
  content_series: Series | null;
  submission_series: Series | null;
  recent: RecentItem[];
}

/* ─── What each number looks like ───────────────────────────── */
const KPI_STYLE: Record<string, { icon: typeof ArticleIcon; from: string; to: string; color: string }> = {
  articles:            { icon: ArticleIcon,      from: '#7c3aed', to: '#4f46e5', color: '#7c3aed' },
  regulatory:          { icon: RegulatoryIcon,   from: '#ef4444', to: '#b91c1c', color: '#ef4444' },
  reg_watch:           { icon: RegWatchIcon,     from: '#06b6d4', to: '#0e7490', color: '#06b6d4' },
  white_papers:        { icon: WhitePaperIcon,   from: '#22c55e', to: '#15803d', color: '#22c55e' },
  knowledge:           { icon: KnowledgeIcon,    from: '#f97316', to: '#ea580c', color: '#f97316' },
  blogs:               { icon: ArticleIcon,      from: '#84cc16', to: '#4d7c0f', color: '#84cc16' },
  excellencia:         { icon: KnowledgeIcon,    from: '#a855f7', to: '#7e22ce', color: '#a855f7' },
  newsletters:         { icon: ArticleIcon,      from: '#0ea5e9', to: '#0369a1', color: '#0ea5e9' },
  podcasts:            { icon: ArticleIcon,      from: '#f43f5e', to: '#be123c', color: '#f43f5e' },
  contacts:            { icon: ContactIcon,      from: '#3b82f6', to: '#1d4ed8', color: '#3b82f6' },
  proposals:           { icon: ProposalIcon,     from: '#ec4899', to: '#be185d', color: '#ec4899' },
  applications:        { icon: WorkIcon,         from: '#14b8a6', to: '#0f766e', color: '#14b8a6' },
  appointments:        { icon: AppointmentIcon,  from: '#f59e0b', to: '#b45309', color: '#f59e0b' },
  alumni:              { icon: AlumniIcon,       from: '#8b5cf6', to: '#6d28d9', color: '#8b5cf6' },
  feedback:            { icon: FeedbackIcon,     from: '#10b981', to: '#047857', color: '#10b981' },
  users:               { icon: PeopleIcon,       from: '#6366f1', to: '#4338ca', color: '#6366f1' },
  event_registrations: { icon: RegistrationIcon, from: '#d946ef', to: '#a21caf', color: '#d946ef' },
};
const CONTENT_CARDS = ['articles', 'regulatory', 'reg_watch', 'white_papers', 'knowledge'];
const CHART_KEYS = ['articles', 'knowledge', 'regulatory', 'reg_watch', 'white_papers'];
const SUBMISSION_CHART_KEYS = ['contacts', 'proposals', 'applications', 'appointments'];

const kindLabel = (type: string, stats: Stats | null) => stats?.content?.[type]?.label ?? stats?.submissions?.[type]?.label ?? type;
const isContent = (type: string, stats: Stats | null) => !!stats?.content && type in stats.content;

/* ─── Component ─────────────────────────────────────────────── */
export default function Dashboard() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [now, setNow] = useState(() => Date.now());
  const [lastOkAt, setLastOkAt] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (showBusy = true) => {
    try {
      if (showBusy) setRefreshing(true);
      const response = await axios.get<Stats>(`${API_BASE_URL}/dashboard/stats`, { headers: { Authorization: `Bearer ${token}` } });
      setStats(response.data);
      setLastOkAt(Date.now());
      setOffline(false);
    } catch (error) {
      console.error('Failed to fetch dashboard numbers:', error);
      setOffline(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token]);

  // first load, then every 20 s, and straight away when the tab comes back into view
  useEffect(() => {
    load(false);
    const timer = window.setInterval(() => { if (document.visibilityState === 'visible') load(false); }, REFRESH_EVERY_MS);
    const onVisible = () => { if (document.visibilityState === 'visible') load(false); };
    document.addEventListener('visibilitychange', onVisible);
    return () => { window.clearInterval(timer); document.removeEventListener('visibilitychange', onVisible); };
  }, [load]);

  // keeps the "updated 12 s ago" label ticking
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 5000);
    return () => window.clearInterval(t);
  }, []);

  const secondsAgo = Math.max(0, Math.round((now - lastOkAt) / 1000));
  const updatedText = !lastOkAt ? 'Loading…' : secondsAgo < 10 ? 'just now' : secondsAgo < 60 ? `${secondsAgo}s ago` : `${Math.round(secondsAgo / 60)} min ago`;

  const contentSeries = stats?.content_series?.[timeRange] ?? [];
  const submissionSeries = stats?.submission_series?.[timeRange] ?? [];
  const chartKeys = stats?.content ? CHART_KEYS : SUBMISSION_CHART_KEYS;
  const chartData = (stats?.content ? contentSeries : submissionSeries) as SeriesRow[];
  const chartLabelOf = (key: string) => kindLabel(key, stats);

  /* donut: content mix for content roles, submission mix otherwise */
  const mixSource = stats?.content ?? stats?.submissions ?? {};
  const distribution = Object.entries(mixSource)
    .map(([key, v]) => ({ key, name: v.label, count: v.total, color: KPI_STYLE[key]?.color ?? C.accent }))
    .filter((d) => d.count > 0)
    .sort((a, b) => b.count - a.count);
  const distributionTotal = distribution.reduce((n, d) => n + d.count, 0);
  const mixTitle = stats?.content ? 'Content Distribution' : 'Submissions Breakdown';
  const mixSub = stats?.content ? 'Current content breakdown' : 'Where the requests come from';
  const mixCenter = stats?.content ? 'Total Items' : 'Total Requests';

  /* last 7 days: form submissions, or content added for content-only roles */
  const weekRows = (stats?.submissions ? stats.submission_series?.week : stats?.content_series?.week) ?? [];
  const weeklyData = weekRows.map((r) => ({
    day: r.label,
    value: Object.entries(r).filter(([k, v]) => k !== 'label' && k !== 'date' && typeof v === 'number').reduce((n, [, v]) => n + (v as number), 0),
  }));
  const weeklyTitle = stats?.submissions ? 'Weekly Submissions Trend' : 'Weekly Content Trend';
  const weeklySub = stats?.submissions ? 'Form submissions received, last 7 days' : 'Content added, last 7 days';

  const sparkOf = (key: string) => (stats?.content_series?.month ?? stats?.submission_series?.month ?? []).map((m) => ({ v: Number(m[key] ?? 0) }));

  const allContentTotal = stats?.content ? Object.values(stats.content).reduce((n, c) => n + c.total, 0) : 0;
  const allContentMonth = stats?.content ? Object.values(stats.content).reduce((n, c) => n + c.month, 0) : 0;
  const allContentToday = stats?.content ? Object.values(stats.content).reduce((n, c) => n + c.today, 0) : 0;

  interface Card { key: string; label: string; value: number; icon: typeof ArticleIcon; from: string; to: string; pill: string; sub: string; spark: { v: number }[]; path?: string }
  const contentCards: Card[] = stats?.content ? [
    ...CONTENT_CARDS.filter((k) => stats.content![k]).map((k): Card => {
      const c = stats.content![k];
      return { key: k, label: c.label, value: c.total, ...KPI_STYLE[k], pill: c.today ? `+${c.today} today` : '', sub: `${c.month} added this month`, spark: sparkOf(k), path: c.path };
    }),
    { key: 'all', label: 'All Content Items', value: allContentTotal, ...KPI_STYLE.blogs, icon: AllContentIcon, from: '#14b8a6', to: '#0f766e',
      pill: allContentToday ? `+${allContentToday} today` : '', sub: `${allContentMonth} added this month`, spark: (stats.content_series?.month ?? []).map((m) => ({ v: Object.entries(m).filter(([k, v]) => k !== 'label' && k !== 'month' && typeof v === 'number').reduce((n, [, v]) => n + (v as number), 0) })) },
  ] : [];
  const submissionCards: Card[] = stats?.submissions ? Object.entries(stats.submissions).map(([k, c]): Card => ({
    key: k, label: c.label, value: c.total, ...KPI_STYLE[k], pill: c.today ? `+${c.today} today` : '',
    sub: c.attention ? `${c.attention} new · need attention` : `${c.week} in the last 7 days`, spark: sparkOf(k), path: c.path,
  })) : [];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <CircularProgress sx={{ color: C.accent }} />
      </Box>
    );
  }

  const KpiCard = ({ card, idx, group }: { card: Card; idx: number; group: string }) => {
    const Icon = card.icon;
    return (
      <Card
        elevation={0}
        onClick={card.path ? () => navigate(card.path!) : undefined}
        sx={{
          background: `linear-gradient(135deg, ${card.from} 0%, ${card.to} 100%)`,
          borderRadius: 3, overflow: 'hidden', position: 'relative', color: '#fff',
          cursor: card.path ? 'pointer' : 'default',
          boxShadow: `0 10px 24px -10px ${card.to}`,
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': { transform: 'translateY(-4px)', boxShadow: `0 16px 30px -10px ${card.to}` },
        }}
      >
        <CardContent sx={{ p: '18px !important', position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 1.4 }}>
            <Box sx={{ width: 38, height: 38, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon sx={{ fontSize: 20, color: '#fff' }} />
            </Box>
            <Typography sx={{ fontSize: '0.74rem', fontWeight: 600, lineHeight: 1.25, opacity: 0.95, fontFamily: 'Inter,sans-serif' }}>
              {card.label}
            </Typography>
          </Box>
          <Typography sx={{ fontSize: '1.9rem', fontWeight: 800, lineHeight: 1.1, fontFamily: 'Inter,sans-serif', mb: 0.6 }}>
            {card.value}
          </Typography>
          <Typography sx={{ fontSize: '0.72rem', opacity: 0.9, display: 'flex', alignItems: 'center', gap: 0.6, flexWrap: 'wrap' }}>
            {card.pill && (
              <Box component="span" sx={{ px: 0.8, py: 0.1, borderRadius: 1, bgcolor: 'rgba(255,255,255,0.22)', fontWeight: 700 }}>
                {card.pill}
              </Box>
            )}
            {card.sub}
          </Typography>
        </CardContent>
        <Box sx={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 46, opacity: 0.9, pointerEvents: 'none' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={card.spark.length ? card.spark : [{ v: 0 }, { v: 0 }]} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`kpi-${group}-${idx}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fff" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#fff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="v" stroke="rgba(255,255,255,0.85)" strokeWidth={2} fill={`url(#kpi-${group}-${idx})`} dot={false} isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </Card>
    );
  };

  const firstName = (user?.name || 'Admin').split(' ')[0];

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: C.pageBg, minHeight: '100%' }}>

      {/* ── Page Header ─────────────────────────────────────── */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography sx={{
              fontSize: '0.7rem', fontWeight: 700, color: C.accent, letterSpacing: 1.2,
              textTransform: 'uppercase', mb: 0.5, fontFamily: 'Inter,sans-serif',
            }}>
              Content Command Center
            </Typography>
            <Typography sx={{ fontSize: '1.75rem', fontWeight: 800, color: C.textMain, fontFamily: 'Inter,sans-serif' }}>
              Dashboard overview
            </Typography>
            <Typography sx={{ fontSize: '0.875rem', color: C.textMuted, mt: 0.5 }}>
              Welcome back, {firstName}. Here's what's happening across your website, live.
            </Typography>
          </Box>
          <Chip
            onClick={() => load()}
            label={offline ? 'Offline · retrying' : refreshing ? 'Updating…' : `Live · updated ${updatedText}`}
            size="small"
            icon={<Box sx={{
              width: 7, height: 7, borderRadius: '50%', ml: '10px !important',
              bgcolor: offline ? C.danger : C.success,
              animation: offline ? 'none' : 'livePulse 1.8s ease-in-out infinite',
              '@keyframes livePulse': { '0%,100%': { opacity: 1, transform: 'scale(1)' }, '50%': { opacity: 0.4, transform: 'scale(1.5)' } },
            }} />}
            sx={{
              bgcolor: '#fff', border: `1px solid ${C.border}`, color: C.textMain, fontWeight: 700, fontSize: '0.72rem',
              letterSpacing: 0.4, textTransform: 'uppercase', px: 0.5, boxShadow: C.shadow, cursor: 'pointer',
            }}
          />
        </Box>
      </Box>

      {/* ── Row 1: Content cards ─────────────────────────────── */}
      {contentCards.length > 0 && (
        <>
          <Typography sx={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: C.textMuted, mb: 1.2 }}>Website content</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)', xl: 'repeat(6, 1fr)' }, gap: '18px', mb: 3 }}>
            {contentCards.map((card, idx) => <KpiCard key={card.key} card={card} idx={idx} group="c" />)}
          </Box>
        </>
      )}

      {/* ── Row 2: Form submissions ──────────────────────────── */}
      {submissionCards.length > 0 && (
        <>
          <Typography sx={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: C.textMuted, mb: 1.2 }}>Form submissions &amp; accounts</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: '18px', mb: 3 }}>
            {submissionCards.map((card, idx) => <KpiCard key={card.key} card={card} idx={idx} group="s" />)}
          </Box>
        </>
      )}

      {/* ── Row 3: Charts ────────────────────────────────────── */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: '20px', mb: 3 }}>
        {/* Overview chart */}
        <Card elevation={0} sx={{ bgcolor: C.cardBg, border: `1px solid ${C.border}`, boxShadow: C.shadow, borderRadius: 3, height: '100%' }}>
          <CardContent sx={{ p: '20px !important' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
              <Box>
                <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: C.textMain, fontFamily: 'Inter,sans-serif' }}>
                  {stats?.content ? 'Content Overview' : 'Submissions Overview'}
                </Typography>
                <Typography sx={{ fontSize: '0.8rem', color: C.textMuted, mt: 0.25 }}>
                  {stats?.content ? 'Content added over time' : 'Requests received over time'}
                </Typography>
              </Box>
              <ToggleButtonGroup
                size="small" value={timeRange} exclusive onChange={(_, v) => v && setTimeRange(v)}
                sx={{
                  '& .MuiToggleButton-root': {
                    fontSize: '0.72rem', fontWeight: 600, px: 1.5, py: 0.5, border: `1px solid ${C.border}`, color: C.textMuted, textTransform: 'none',
                    '&.Mui-selected': { bgcolor: C.accent, color: '#fff', borderColor: C.accent },
                    '&.Mui-selected:hover': { bgcolor: '#1d4fd8' },
                  },
                }}
              >
                <ToggleButton value="week">Week</ToggleButton>
                <ToggleButton value="month">Month</ToggleButton>
                <ToggleButton value="year">Year</ToggleButton>
              </ToggleButtonGroup>
            </Box>

            <Box sx={{ height: 320, mt: 2 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: C.textMuted }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: C.textMuted }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12, boxShadow: C.shadow }} />
                  {chartKeys.map((key) => (
                    <Bar key={key} dataKey={key} name={chartLabelOf(key)} fill={KPI_STYLE[key]?.color ?? C.accent} radius={[6, 6, 0, 0]} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </Box>

            <Box sx={{ display: 'flex', gap: 2.5, justifyContent: 'center', mt: 2, flexWrap: 'wrap' }}>
              {chartKeys.map((key) => (
                <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: 1, bgcolor: KPI_STYLE[key]?.color ?? C.accent }} />
                  <Typography sx={{ fontSize: '0.8rem', color: C.textMuted, fontWeight: 500 }}>{chartLabelOf(key)}</Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>

        {/* Distribution donut */}
        <Card elevation={0} sx={{ bgcolor: C.cardBg, border: `1px solid ${C.border}`, boxShadow: C.shadow, borderRadius: 3, height: '100%' }}>
          <CardContent sx={{ p: '20px !important' }}>
            <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: C.textMain, fontFamily: 'Inter,sans-serif', mb: 0.5 }}>
              {mixTitle}
            </Typography>
            <Typography sx={{ fontSize: '0.8rem', color: C.textMuted, mb: 2 }}>{mixSub}</Typography>

            <Box sx={{ height: 240, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* Hand-drawn SVG donut (stroke-dasharray per segment): Recharts' <Pie> draws zero-width segments here (upstream bug). */}
              {(() => {
                const total = distributionTotal || 1;
                const radius = 80;
                const circumference = 2 * Math.PI * radius;
                const gap = 3;
                const segments = distribution.map((entry, i) => ({ entry, before: distribution.slice(0, i).reduce((n, d) => n + d.count, 0) }));
                return (
                  <svg width={200} height={200} viewBox="0 0 200 200">
                    {segments.map(({ entry, before }) => {
                      const dash = (entry.count / total) * circumference;
                      const rotation = (before / total) * 360 - 90;
                      return (
                        <circle
                          key={entry.key} cx={100} cy={100} r={radius} fill="none" stroke={entry.color} strokeWidth={28}
                          strokeDasharray={`${Math.max(dash - gap, 0)} ${circumference - Math.max(dash - gap, 0)}`}
                          strokeLinecap="round" transform={`rotate(${rotation} 100 100)`}
                        />
                      );
                    })}
                  </svg>
                );
              })()}
              <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none' }}>
                <Typography sx={{ fontSize: '1.75rem', fontWeight: 700, color: C.textMain, lineHeight: 1.1, fontFamily: 'Inter,sans-serif' }}>
                  {distributionTotal}
                </Typography>
                <Typography sx={{ fontSize: '0.7rem', color: C.textMuted, fontWeight: 600 }}>{mixCenter}</Typography>
              </Box>
            </Box>

            <Box sx={{ mt: 2 }}>
              {distribution.map((item) => (
                <Box key={item.key} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: item.color, flexShrink: 0 }} />
                    <Typography sx={{ fontSize: '0.85rem', color: C.textMuted, fontWeight: 500 }}>{item.name}</Typography>
                  </Box>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: C.textMain }}>{item.count}</Typography>
                </Box>
              ))}
              {distribution.length === 0 && <Typography sx={{ fontSize: '0.85rem', color: C.textMuted }}>Nothing to show yet.</Typography>}
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* ── Row 4: Recent Activity & Weekly Trend ─────────────── */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: '20px' }}>
        <Card elevation={0} sx={{ bgcolor: C.cardBg, border: `1px solid ${C.border}`, boxShadow: C.shadow, borderRadius: 3 }}>
          <CardContent sx={{ p: '20px !important' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box>
                <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: C.textMain, fontFamily: 'Inter,sans-serif' }}>Recent Activity</Typography>
                <Typography sx={{ fontSize: '0.8rem', color: C.textMuted, mt: 0.25 }}>Newest content and submissions, updated live</Typography>
              </Box>
              <AssessmentIcon sx={{ fontSize: 20, color: C.accent }} />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {stats && stats.recent.length > 0 ? stats.recent.slice(0, 10).map((activity, i) => {
                const style = KPI_STYLE[activity.type] ?? KPI_STYLE.articles;
                const Icon = style.icon;
                const content = isContent(activity.type, stats);
                return (
                  <Box
                    key={`${activity.type}-${i}-${activity.at}`}
                    onClick={() => navigate(activity.path)}
                    sx={{
                      display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, bgcolor: '#fafafa', borderRadius: 1.5,
                      border: `1px solid ${C.border}`, cursor: 'pointer', transition: 'all 0.2s',
                      '&:hover': { bgcolor: '#f5f5f5', borderColor: C.accent },
                    }}
                  >
                    <Box sx={{ width: 40, height: 40, borderRadius: 1.5, bgcolor: `${style.color}1f`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon sx={{ fontSize: 18, color: style.color }} />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: C.textMain, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {activity.title}
                      </Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: C.textMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {timeAgo(activity.at)}{activity.subtitle ? ` • ${activity.subtitle}` : ''}
                      </Typography>
                    </Box>
                    <Chip
                      label={kindLabel(activity.type, stats)}
                      size="small"
                      sx={{ bgcolor: content ? `${C.info}15` : `${C.warning}1f`, color: content ? C.info : '#b45309', fontWeight: 600, fontSize: '0.7rem' }}
                    />
                  </Box>
                );
              }) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography sx={{ fontSize: '0.9rem', color: C.textMuted }}>No recent activity</Typography>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>

        <Card elevation={0} sx={{ bgcolor: C.cardBg, border: `1px solid ${C.border}`, boxShadow: C.shadow, borderRadius: 3 }}>
          <CardContent sx={{ p: '20px !important' }}>
            <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: C.textMain, fontFamily: 'Inter,sans-serif', mb: 0.5 }}>{weeklyTitle}</Typography>
            <Typography sx={{ fontSize: '0.8rem', color: C.textMuted, mb: 2 }}>{weeklySub}</Typography>

            <Box sx={{ height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="weeklyGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={C.accent} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={C.accent} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: C.textMuted }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: C.textMuted }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12, boxShadow: C.shadow }} />
                  <Area
                    type="monotone" dataKey="value" name={stats?.submissions ? 'Submissions' : 'Items added'} stroke={C.accent} strokeWidth={3} fill="url(#weeklyGrad)"
                    dot={{ r: 4, fill: C.accent, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6, fill: C.accent }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

