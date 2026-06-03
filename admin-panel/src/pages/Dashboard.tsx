import { useEffect, useState } from 'react';
import {
  Typography, Box, Card, CardContent, Chip,
  ToggleButtonGroup, ToggleButton, CircularProgress,
} from '@mui/material';
import {
  Article as ArticleIcon,
  Description as BlogIcon,
  Email as EmailIcon,
  Assessment as AssessmentIcon,
  MenuBook as KnowledgeIcon,
} from '@mui/icons-material';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie,
} from 'recharts';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string
console.log("API Base URL", API_BASE_URL)

/* ─── Design Tokens ────────────────────────────────────────── */
const C = {
  pageBg:   '#f4f5fa',
  cardBg:   '#ffffff',
  textMain: '#2d3748',
  textMuted:'#8a8d93',
  border:   'rgba(0,0,0,0.07)',
  shadow:   '0 2px 8px rgba(0,0,0,0.08)',
  accent:   '#696cff',
  success:  '#10b981',
  warning:  '#f59e0b',
  danger:   '#ef4444',
  info:     '#3b82f6',
};

/* ─── Interfaces ───────────────────────────────────────────── */
interface DashboardStats {
  totalArticles: number;
  totalBlogs: number;
  totalKnowledge: number;
  totalContacts: number;
  pendingContacts: number;
}

interface ActivityItem {
  id: string;
  type: 'article' | 'blog' | 'knowledge' | 'contact';
  title: string;
  time: string;
  status: 'published' | 'updated' | 'pending' | 'resolved';
  author?: string;
}

interface MonthlyData {
  month: string;
  articles: number;
  blogs: number;
  knowledge: number;
  contacts: number;
}

/* ─── Static Data ──────────────────────────────────────────── */
const weeklyData = [
  { day: 'Mon', value: 32 },
  { day: 'Tue', value: 48 },
  { day: 'Wed', value: 41 },
  { day: 'Thu', value: 61 },
  { day: 'Fri', value: 54 },
  { day: 'Sat', value: 38 },
  { day: 'Sun', value: 45 },
];

/* ─── Component ─────────────────────────────────────────────── */
export default function Dashboard() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [stats, setStats] = useState<DashboardStats>({
    totalArticles: 0,
    totalBlogs: 0,
    totalKnowledge: 0,
    totalContacts: 0,
    pendingContacts: 0,
  });
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [contentDistribution, setContentDistribution] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);

  // Generate monthly data based on real data
  const generateMonthlyData = (articles: any[], blogs: any[], knowledge: any[], contacts: any[]) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    
    return months.slice(Math.max(0, currentMonth - 5), currentMonth + 1).map((month, index) => {
      const monthIndex = currentMonth - 5 + index;
      const articlesCount = articles.filter(item => {
        const date = new Date(item.created_at || item.publish_date);
        return date.getMonth() === monthIndex;
      }).length;
      
      const blogsCount = blogs.filter(item => {
        const date = new Date(item.created_at || item.publish_date);
        return date.getMonth() === monthIndex;
      }).length;
      
      const knowledgeCount = knowledge.filter(item => {
        const date = new Date(item.created_at);
        return date.getMonth() === monthIndex;
      }).length;
      
      const contactsCount = contacts.filter(item => {
        const date = new Date(item.created_at);
        return date.getMonth() === monthIndex;
      }).length;

      return {
        month,
        articles: articlesCount,
        blogs: blogsCount,
        knowledge: knowledgeCount,
        contacts: contactsCount,
      };
    });
  };

  // Generate content distribution
  const generateContentDistribution = (articlesCount: number, blogsCount: number, knowledgeCount: number) => {
    const total = articlesCount + blogsCount + knowledgeCount;
    if (total === 0) return [];

    return [
      { 
        name: 'Articles', 
        value: Math.round((articlesCount / total) * 100), 
        color: C.accent,
        count: articlesCount 
      },
      { 
        name: 'Blogs', 
        value: Math.round((blogsCount / total) * 100), 
        color: C.success,
        count: blogsCount 
      },
      { 
        name: 'Knowledge', 
        value: Math.round((knowledgeCount / total) * 100), 
        color: C.info,
        count: knowledgeCount 
      },
    ];
  };

  // Generate recent activity from real data
  const generateRecentActivity = (articles: any[], blogs: any[], knowledge: any[], contacts: any[], alumni: any[]) => {
    const activities: ActivityItem[] = [];

    // Add recent articles
    articles.slice(0, 3).forEach(article => {
      activities.push({
        id: article.id,
        type: 'article',
        title: article.title,
        time: formatTimeAgo(article.last_edited_at || article.created_at),
        status: article.last_edited_at ? 'updated' : 'published',
        author: article.author,
      });
    });

    // Add recent blogs
    blogs.slice(0, 3).forEach(blog => {
      activities.push({
        id: blog.id,
        type: 'blog',
        title: blog.title,
        time: formatTimeAgo(blog.last_edited_at || blog.created_at),
        status: blog.last_edited_at ? 'updated' : 'published',
        author: blog.author,
      });
    });

    // Add recent knowledge resources
    knowledge.slice(0, 2).forEach(resource => {
      activities.push({
        id: resource.id,
        type: 'knowledge',
        title: resource.title,
        time: formatTimeAgo(resource.last_edited_at || resource.created_at),
        status: resource.last_edited_at ? 'updated' : 'published',
      });
    });

    // Add recent contacts
    contacts.slice(0, 2).forEach(contact => {
      activities.push({
        id: contact.id,
        type: 'contact',
        title: `New inquiry from ${contact.name}`,
        time: formatTimeAgo(contact.created_at),
        status: contact.resolved ? 'resolved' : 'pending',
      });
    });

    // Add recent alumni
    alumni.slice(0, 2).forEach(person => {
      activities.push({
        id: person.id,
        type: 'contact', // Using contact type for alumni as well since we don't have a separate alumni icon
        title: `Alumni registration: ${person.first_name} ${person.last_name}`,
        time: formatTimeAgo(person.created_at),
        status: 'published',
      });
    });

    // Sort by most recent and limit to 8 items
    return activities
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 8);
  };

  // Format time ago helper
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks} weeks ago`;
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [articlesRes, blogsRes, knowledgeRes, contactsRes, alumniRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/articles`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_BASE_URL}/blogs`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_BASE_URL}/knowledge`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_BASE_URL}admin/contacts`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_BASE_URL}/admin/alumni`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const articles = articlesRes.data || [];
        const blogs = blogsRes.data || [];
        const knowledge = knowledgeRes.data || [];
        const contacts = contactsRes.data || [];
        const alumni = alumniRes.data || [];

        setStats({
          totalArticles: articles.length,
          totalBlogs: blogs.length,
          totalKnowledge: knowledge.length,
          totalContacts: contacts.length,
          pendingContacts: contacts.filter((c: any) => !c.resolved).length,
        });

        setMonthlyData(generateMonthlyData(articles, blogs, knowledge, contacts));
        setContentDistribution(generateContentDistribution(articles.length, blogs.length, knowledge.length));
        setRecentActivity(generateRecentActivity(articles, blogs, knowledge, contacts, alumni));

      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <CircularProgress sx={{ color: C.accent }} />
      </Box>
    );
  }

  const STAT_CARDS = [
    {
      label: 'Total Articles',
      value: stats.totalArticles,
      icon: ArticleIcon,
      iconColor: C.accent,
      change: '+12%',
      sub: 'from last month',
      bgGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
      label: 'Total Blogs',
      value: stats.totalBlogs,
      icon: BlogIcon,
      iconColor: C.success,
      change: '+8%',
      sub: 'from last month',
      bgGradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
    {
      label: 'Knowledge Resources',
      value: stats.totalKnowledge,
      icon: KnowledgeIcon,
      iconColor: C.info,
      change: '+15%',
      sub: 'from last month',
      bgGradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    },
    {
      label: 'Total Contacts',
      value: stats.totalContacts,
      icon: EmailIcon,
      iconColor: C.warning,
      change: '+23%',
      sub: 'from last month',
      bgGradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: C.pageBg, minHeight: '100%' }}>

      {/* ── Page Header ─────────────────────────────────────── */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography sx={{ fontSize: '1.75rem', fontWeight: 700, color: C.textMain, fontFamily: 'Inter,sans-serif' }}>
              Dashboard
            </Typography>
            <Typography sx={{ fontSize: '0.875rem', color: C.textMuted, mt: 0.5 }}>
              Welcome back, Admin. Here's what's happening with your content.
            </Typography>
          </Box>
          <Chip
            label="Last updated: Just now"
            size="small"
            sx={{
              bgcolor: `${C.success}15`,
              color: C.success,
              fontWeight: 600,
              fontSize: '0.75rem',
              px: 1,
            }}
          />
        </Box>
      </Box>

      {/* ── Row 1: Stat Cards ───────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        {STAT_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <Card
              key={card.label}
              elevation={0}
              sx={{
                bgcolor: C.cardBg,
                border: `1px solid ${C.border}`,
                borderRadius: 2,
                overflow: 'hidden',
                position: 'relative',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                },
              }}
            >
                {/* Gradient background strip */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: card.bgGradient,
                  }}
                />

                <CardContent sx={{ p: '20px !important' }}>
                  {/* Top Row: Icon + Label */}
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        background: card.bgGradient,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      }}
                    >
                      <Icon sx={{ fontSize: 24, color: '#fff' }} />
                    </Box>
                    <Chip
                      label={card.change}
                      size="small"
                      sx={{
                        bgcolor: card.change.startsWith('+') ? `${C.success}15` : `${C.danger}15`,
                        color: card.change.startsWith('+') ? C.success : C.danger,
                        fontWeight: 700,
                        fontSize: '0.7rem',
                      }}
                    />
                  </Box>

                  {/* Label */}
                  <Typography
                    sx={{
                      fontSize: '0.8rem',
                      color: C.textMuted,
                      fontWeight: 600,
                      fontFamily: 'Inter,sans-serif',
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                      mb: 0.5,
                    }}
                  >
                    {card.label}
                  </Typography>

                  {/* Value */}
                  <Typography
                    sx={{
                      fontSize: '2rem',
                      fontWeight: 700,
                      color: C.textMain,
                      lineHeight: 1.2,
                      fontFamily: 'Inter,sans-serif',
                      mb: 0.5,
                    }}
                  >
                    {card.value}
                  </Typography>

                  {/* Subtitle */}
                  <Typography sx={{ fontSize: '0.75rem', color: C.textMuted }}>
                    {card.sub}
                  </Typography>
                </CardContent>
              </Card>
          );
        })}
      </div>

      {/* ── Row 2: Charts ────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '24px' }}>
        {/* Content Overview Chart */}
        <Card elevation={0} sx={{ bgcolor: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 2, height: '100%' }}>
          <CardContent sx={{ p: '20px !important' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box>
                <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: C.textMain, fontFamily: 'Inter,sans-serif' }}>
                  Content Overview
                </Typography>
                <Typography sx={{ fontSize: '0.8rem', color: C.textMuted, mt: 0.25 }}>
                  Monthly content creation trends
                </Typography>
              </Box>
              <ToggleButtonGroup
                size="small"
                value={timeRange}
                exclusive
                onChange={(_, v) => v && setTimeRange(v)}
                sx={{
                  '& .MuiToggleButton-root': {
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    px: 1.5,
                    py: 0.5,
                    border: `1px solid ${C.border}`,
                    color: C.textMuted,
                    textTransform: 'none',
                    '&.Mui-selected': { bgcolor: C.accent, color: '#fff', borderColor: C.accent },
                    '&.Mui-selected:hover': { bgcolor: '#5a5de0' },
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
                <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: C.textMuted }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: C.textMuted }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: '#fff',
                      border: `1px solid ${C.border}`,
                      borderRadius: 8,
                      fontSize: 12,
                      boxShadow: C.shadow,
                    }}
                  />
                  <Bar dataKey="articles" fill={C.accent} radius={[8, 8, 0, 0]} />
                  <Bar dataKey="blogs" fill={C.success} radius={[8, 8, 0, 0]} />
                  <Bar dataKey="knowledge" fill={C.info} radius={[8, 8, 0, 0]} />
                  <Bar dataKey="contacts" fill={C.warning} radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>

            {/* Legend */}
            <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', mt: 2 }}>
              {[
                { label: 'Articles', color: C.accent },
                { label: 'Blogs', color: C.success },
                { label: 'Knowledge', color: C.info },
                { label: 'Contacts', color: C.warning },
              ].map((item) => (
                <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: 1, bgcolor: item.color }} />
                  <Typography sx={{ fontSize: '0.8rem', color: C.textMuted, fontWeight: 500 }}>
                    {item.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>

        {/* Content Distribution Pie Chart */}
        <Card elevation={0} sx={{ bgcolor: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 2, height: '100%' }}>
          <CardContent sx={{ p: '20px !important' }}>
            <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: C.textMain, fontFamily: 'Inter,sans-serif', mb: 0.5 }}>
              Content Distribution
            </Typography>
            <Typography sx={{ fontSize: '0.8rem', color: C.textMuted, mb: 2 }}>
              Current content breakdown
            </Typography>

            <Box sx={{ height: 240, position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={contentDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                  >
                    {contentDistribution.map((entry, i) => (
                      <g key={i}>
                        <path fill={entry.color} />
                      </g>
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Center label */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                  pointerEvents: 'none',
                }}
              >
                <Typography sx={{ fontSize: '1.75rem', fontWeight: 700, color: C.textMain, lineHeight: 1.1, fontFamily: 'Inter,sans-serif' }}>
                  {stats.totalArticles + stats.totalBlogs + stats.totalKnowledge}
                </Typography>
                <Typography sx={{ fontSize: '0.7rem', color: C.textMuted, fontWeight: 600 }}>
                  Total Items
                </Typography>
              </Box>
            </Box>

            {/* Legend */}
            <Box sx={{ mt: 2 }}>
              {contentDistribution.map((item) => (
                <Box key={item.name} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: item.color, flexShrink: 0 }} />
                    <Typography sx={{ fontSize: '0.85rem', color: C.textMuted, fontWeight: 500 }}>
                      {item.name}
                    </Typography>
                  </Box>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: C.textMain }}>
                    {item.count}
                  </Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </div>

      {/* ── Row 3: Recent Activity & Weekly Trend ─────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Recent Activity */}
        <Card elevation={0} sx={{ bgcolor: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 2 }}>
          <CardContent sx={{ p: '20px !important' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box>
                <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: C.textMain, fontFamily: 'Inter,sans-serif' }}>
                  Recent Activity
                </Typography>
                <Typography sx={{ fontSize: '0.8rem', color: C.textMuted, mt: 0.25 }}>
                  Latest updates and changes
                </Typography>
              </Box>
              <AssessmentIcon sx={{ fontSize: 20, color: C.accent }} />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {recentActivity.length > 0 ? recentActivity.map((activity) => (
                <Box
                  key={activity.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    p: 1.5,
                    bgcolor: '#fafafa',
                    borderRadius: 1.5,
                    border: `1px solid ${C.border}`,
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: '#f5f5f5',
                      borderColor: C.accent,
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 1.5,
                      bgcolor:
                        activity.type === 'article'
                          ? `${C.accent}15`
                          : activity.type === 'blog'
                          ? `${C.success}15`
                          : activity.type === 'knowledge'
                          ? `${C.info}15`
                          : `${C.warning}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {activity.type === 'article' ? (
                      <ArticleIcon sx={{ fontSize: 18, color: C.accent }} />
                    ) : activity.type === 'blog' ? (
                      <BlogIcon sx={{ fontSize: 18, color: C.success }} />
                    ) : activity.type === 'knowledge' ? (
                      <KnowledgeIcon sx={{ fontSize: 18, color: C.info }} />
                    ) : (
                      <EmailIcon sx={{ fontSize: 18, color: C.warning }} />
                    )}
                  </Box>

                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: C.textMain,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {activity.title}
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: C.textMuted }}>
                      {activity.time} {activity.author && `• by ${activity.author}`}
                    </Typography>
                  </Box>

                  <Chip
                    label={activity.status}
                    size="small"
                    sx={{
                      bgcolor: 
                        activity.status === 'published' ? `${C.success}15` : 
                        activity.status === 'updated' ? `${C.info}15` :
                        activity.status === 'resolved' ? `${C.success}15` : `${C.warning}15`,
                      color: 
                        activity.status === 'published' ? C.success : 
                        activity.status === 'updated' ? C.info :
                        activity.status === 'resolved' ? C.success : C.warning,
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      textTransform: 'capitalize',
                    }}
                  />
                </Box>
              )) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography sx={{ fontSize: '0.9rem', color: C.textMuted }}>
                    No recent activity
                  </Typography>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Weekly Trend */}
        <Card elevation={0} sx={{ bgcolor: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 2 }}>
          <CardContent sx={{ p: '20px !important' }}>
            <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: C.textMain, fontFamily: 'Inter,sans-serif', mb: 0.5 }}>
              Weekly Activity Trend
            </Typography>
            <Typography sx={{ fontSize: '0.8rem', color: C.textMuted, mb: 2 }}>
              User engagement over the past week
            </Typography>

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
                  <YAxis tick={{ fontSize: 11, fill: C.textMuted }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: '#fff',
                      border: `1px solid ${C.border}`,
                      borderRadius: 8,
                      fontSize: 12,
                      boxShadow: C.shadow,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={C.accent}
                    strokeWidth={3}
                    fill="url(#weeklyGrad)"
                    dot={{ r: 4, fill: C.accent, strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 6, fill: C.accent }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </div>
    </Box>
  );
}
