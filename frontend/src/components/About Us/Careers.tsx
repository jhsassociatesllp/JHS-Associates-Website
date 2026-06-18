import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { imageUrl } from '../../utils/imageUrl'

type Job = {
  id: string
  title: string
  department: string
  location: string
  employment_type: string
  experience: string
  summary: string
  description: string
  requirements: string
  status: 'draft' | 'open' | 'closed'
}

type ApplicationForm = {
  full_name: string
  email: string
  phone: string
  current_location: string
  experience_years: string
  cover_letter: string
}

const emptyForm: ApplicationForm = {
  full_name: '',
  email: '',
  phone: '',
  current_location: '',
  experience_years: '',
  cover_letter: '',
}

const BRAND = '#B01E2E'
const BRAND_DARK = '#8f1620'
const FONT = "'DM Sans', 'Helvetica Neue', sans-serif"

/* ─── style objects ─────────────────────────────────────── */
const S = {
  page: { fontFamily: FONT, color: '#1a1a1a' } as React.CSSProperties,

  /* ── HERO ── */
  hero: {
    position: 'relative' as const,
    minHeight: '92vh',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  heroBg: {
    position: 'absolute' as const,
    inset: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    zIndex: 0,
  },
  heroOverlay: {
    position: 'absolute' as const,
    inset: 0,
    background: 'linear-gradient(160deg,rgba(10,20,50,0.82) 0%,rgba(10,20,50,0.6) 60%,rgba(10,20,50,0.78) 100%)',
    zIndex: 1,
  },
  heroContent: {
    position: 'relative' as const,
    zIndex: 2,
    padding: '7rem 2rem 3rem',
    width: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    textAlign: 'center' as const,
    gap: '1rem',
  },
  heroEyebrow: {
    fontSize: '0.72rem',
    fontWeight: 700,
    letterSpacing: '0.16em',
    textTransform: 'uppercase' as const,
    color: 'rgba(255,255,255,0.6)',
    margin: 0,
  },
  heroTitle: {
    fontSize: 'clamp(2.8rem,6vw,5rem)',
    fontWeight: 800,
    lineHeight: 1.05,
    color: '#fff',
    margin: 0,
    maxWidth: '800px',
  },
  heroSub: {
    fontSize: 'clamp(1rem,1.6vw,1.18rem)',
    color: 'rgba(255,255,255,0.78)',
    lineHeight: 1.65,
    margin: 0,
    maxWidth: '520px',
  },
  heroCta: {
    display: 'inline-block',
    marginTop: '0.5rem',
    padding: '0.72rem 1.8rem',
    border: '1.5px solid rgba(255,255,255,0.75)',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '0.88rem',
    fontWeight: 700,
    letterSpacing: '0.05em',
    textDecoration: 'none',
    background: 'transparent',
    cursor: 'pointer',
  },
  statsBar: {
    position: 'relative' as const,
    zIndex: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '3rem',
    padding: '1.5rem 2rem',
    background: 'rgba(255,255,255,0.08)',
    backdropFilter: 'blur(12px)',
    borderTop: '1px solid rgba(255,255,255,0.12)',
  },
  stat: { display: 'flex', flexDirection: 'column' as const, gap: '0.15rem' },
  statNum: { fontSize: '1.8rem', fontWeight: 800, color: '#fff', lineHeight: 1 },
  statLabel: {
    fontSize: '0.7rem',
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
    color: 'rgba(255,255,255,0.55)',
  },
  statDiv: { width: '1px', height: '2.8rem', background: 'rgba(255,255,255,0.2)' },

  /* ── LIFE SECTION ── */
  lifeSection: { padding: '5rem 6rem', background: '#f7f6f3' },
  lifeGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.7fr',
    gap: '4rem',
    alignItems: 'start',
    marginBottom: '3rem',
  },
  eyebrow: {
    fontSize: '0.7rem',
    fontWeight: 700,
    letterSpacing: '0.14em',
    textTransform: 'uppercase' as const,
    color: BRAND,
    margin: '0 0 0.6rem',
  },
  sectionTitle: {
    fontSize: 'clamp(1.6rem,2.5vw,2.4rem)',
    fontWeight: 800,
    lineHeight: 1.15,
    margin: '0 0 0.8rem',
    color: '#111',
  },
  lifeTagline: { fontSize: '1.05rem', fontStyle: 'italic', color: '#666', lineHeight: 1.6, margin: 0 },
  lifeBody: { color: '#444', lineHeight: 1.75, margin: '0 0 1rem', fontSize: '0.97rem' },
  perksList: { listStyle: 'none', padding: 0, margin: '1.2rem 0 0', display: 'flex', flexDirection: 'column' as const, gap: '0.6rem' },
  perkItem: { display: 'flex', alignItems: 'baseline', gap: '0.65rem', fontSize: '0.94rem', color: '#333', lineHeight: 1.5 },
  perkDot: { width: '6px', height: '6px', borderRadius: '50%', background: BRAND, flexShrink: 0, marginTop: '1px' },
  cultureImg: { width: '100%', height: '380px', objectFit: 'cover' as const, borderRadius: '16px', display: 'block', boxShadow: '0 8px 40px rgba(0,0,0,0.1)' },

  /* ══════════════════════════════════════
     ── BOARD SECTION (reference design) ──
  ══════════════════════════════════════ */
  boardSection: {
    padding: '5rem 4rem 6rem',
    background: '#f7f6f3',
    fontFamily: FONT,
  },

  /* Section header */
  boardHeader: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: '2rem',
    gap: '1.5rem',
    flexWrap: 'wrap' as const,
  },
  boardHeaderLeft: {},
  boardEyebrow: {
    fontSize: '0.68rem',
    fontWeight: 700,
    letterSpacing: '0.18em',
    textTransform: 'uppercase' as const,
    color: BRAND,
    margin: '0 0 0.3rem',
    display: 'block',
  },
  boardTitle: {
    fontSize: 'clamp(1.5rem,2.2vw,2rem)',
    fontWeight: 800,
    lineHeight: 1.1,
    margin: '0 0 0.3rem',
    color: '#111',
  },
  boardSub: { fontSize: '0.9rem', color: '#777', margin: 0 },

  /* Search bar */
  searchWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: '#fff',
    border: '1.5px solid #e0ddd8',
    borderRadius: '8px',
    padding: '0 0.85rem',
    minWidth: '280px',
    height: '42px',
  },
  searchIcon: { fontSize: '1rem', color: '#aaa', flexShrink: 0 },
  searchInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: '0.875rem',
    color: '#333',
    background: 'transparent',
    fontFamily: FONT,
  },

  /* Two-column layout */
  boardBody: {
    display: 'grid',
    gridTemplateColumns: '230px 1fr',
    gap: '1.5rem',
    alignItems: 'start',
  },

  /* ── FILTER SIDEBAR ── */
  sidebar: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0',
    position: 'sticky' as const,
    top: '80px',
  },
  sidebarCard: {
    background: '#fff',
    borderRadius: '12px',
    border: '1.5px solid #e8e5df',
    overflow: 'hidden',
  },
  filterHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.9rem 1.1rem 0.75rem',
    borderBottom: '1px solid #f0ede6',
  },
  filterTitle: { fontSize: '0.82rem', fontWeight: 700, color: '#111', margin: 0 },
  clearBtn: {
    fontSize: '0.72rem',
    fontWeight: 600,
    color: BRAND,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    fontFamily: FONT,
  },
  filterGroup: { padding: '0.85rem 1.1rem', borderBottom: '1px solid #f5f3ef' },
  filterGroupLast: { padding: '0.85rem 1.1rem' },
  filterGroupLabel: {
    fontSize: '0.63rem',
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
    color: '#aaa',
    margin: '0 0 0.6rem',
    display: 'block',
  },
  filterSelect: {
    width: '100%',
    padding: '0.5rem 0.75rem',
    border: '1.5px solid #e0ddd8',
    borderRadius: '7px',
    fontSize: '0.82rem',
    color: '#333',
    background: '#fff',
    fontFamily: FONT,
    outline: 'none',
    cursor: 'pointer',
    appearance: 'none' as const,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23999' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 0.65rem center',
    paddingRight: '2rem',
  },
  checkboxItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.55rem',
    marginBottom: '0.45rem',
    cursor: 'pointer',
  },
  checkboxItemLast: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.55rem',
    cursor: 'pointer',
  },
  checkbox: {
    width: '15px',
    height: '15px',
    accentColor: BRAND,
    cursor: 'pointer',
    flexShrink: 0,
  },
  checkboxLabel: { fontSize: '0.82rem', color: '#444', cursor: 'pointer', lineHeight: 1.4 },

  /* Community card at bottom of sidebar */
  communityCard: {
    marginTop: '1rem',
    background: BRAND,
    borderRadius: '12px',
    padding: '1.3rem 1.1rem',
    position: 'relative' as const,
    overflow: 'hidden',
  },
  communityTitle: { fontSize: '0.88rem', fontWeight: 700, color: '#fff', margin: '0 0 0.4rem', lineHeight: 1.35 },
  communitySub: { fontSize: '0.78rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.55, margin: '0 0 1rem' },
  communityBtn: {
    display: 'inline-block',
    padding: '0.5rem 1.1rem',
    background: '#fff',
    color: BRAND,
    border: 'none',
    borderRadius: '7px',
    fontSize: '0.78rem',
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: FONT,
  },

  /* ── JOB ROWS ── */
  jobRows: { display: 'flex', flexDirection: 'column' as const, gap: '0.75rem' },

  jobRow: {
    background: '#fff',
    border: '1.5px solid #e8e5df',
    borderRadius: '12px',
    padding: '1.2rem 1.4rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    transition: 'border-color .15s, box-shadow .15s',
    cursor: 'pointer',
  },
  jobRowMain: { flex: 1, minWidth: 0 },
  jobRowTopLine: { display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem', flexWrap: 'wrap' as const },

  deptTag: (dept: string): React.CSSProperties => {
    const colors: Record<string, { bg: string; color: string }> = {
      'Human Resources': { bg: '#fff0e0', color: '#b85c00' },
      'Finance': { bg: '#e8f4ff', color: '#1a6fb5' },
      'Technology': { bg: '#eef5e8', color: '#2d7a1f' },
      'Operations': { bg: '#f3eeff', color: '#5c35b0' },
      'Sales': { bg: '#fff0f0', color: '#b01e2e' },
      'Marketing': { bg: '#fdf0fb', color: '#8f1a80' },
    }
    const c = colors[dept] ?? { bg: '#f0f0f0', color: '#444' }
    return {
      fontSize: '0.67rem',
      fontWeight: 700,
      padding: '0.2rem 0.6rem',
      borderRadius: '5px',
      background: c.bg,
      color: c.color,
      letterSpacing: '0.03em',
    }
  },
  empTypeTag: {
    fontSize: '0.67rem',
    fontWeight: 600,
    color: '#888',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
  },

  jobRowTitle: {
    fontSize: '1rem',
    fontWeight: 700,
    color: '#111',
    margin: '0 0 0.45rem',
    lineHeight: 1.3,
  },
  jobRowMeta: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap' as const,
    gap: '0.3rem 1rem',
    fontSize: '0.78rem',
    color: '#888',
  },
  metaItem: { display: 'flex', alignItems: 'center', gap: '0.3rem' },
  metaDot: { width: '3px', height: '3px', borderRadius: '50%', background: '#ccc' },

  jobRowActions: { display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 },
  bookmarkBtn: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    border: '1.5px solid #e8e5df',
    background: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '1rem',
    color: '#bbb',
    transition: 'border-color .15s, color .15s',
    flexShrink: 0,
  },
  applyBtn: {
    padding: '0.55rem 1.15rem',
    background: BRAND,
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.8rem',
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: FONT,
    letterSpacing: '0.03em',
    whiteSpace: 'nowrap' as const,
    transition: 'background .15s',
    flexShrink: 0,
  },

  /* View more */
  viewMoreBtn: {
    display: 'block',
    width: '100%',
    marginTop: '0.75rem',
    padding: '0.85rem',
    background: '#fff',
    border: '1.5px solid #e8e5df',
    borderRadius: '12px',
    fontSize: '0.85rem',
    fontWeight: 700,
    color: '#555',
    cursor: 'pointer',
    textAlign: 'center' as const,
    fontFamily: FONT,
    transition: 'border-color .15s, color .15s',
  },

  emptyBox: { textAlign: 'center' as const, padding: '4rem 0', color: '#999' },

  /* ── MODAL ── */
  modalWrap: {
    position: 'fixed' as const,
    inset: 0,
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
  },
  backdrop: {
    position: 'absolute' as const,
    inset: 0,
    background: 'rgba(0,0,0,0.55)',
    border: 'none',
    cursor: 'pointer',
  },
  panel: {
    position: 'relative' as const,
    zIndex: 1,
    background: '#fff',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '620px',
    maxHeight: '90vh',
    overflowY: 'auto' as const,
    boxShadow: '0 24px 64px rgba(0,0,0,0.22)',
    fontFamily: FONT,
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '1rem',
    padding: '1.6rem 1.8rem 1.2rem',
    borderBottom: '1px solid #f0ede6',
    background: '#faf8f5',
    borderRadius: '16px 16px 0 0',
  },
  modalDept: {
    fontSize: '0.63rem',
    fontWeight: 700,
    letterSpacing: '0.13em',
    textTransform: 'uppercase' as const,
    color: BRAND,
    display: 'block',
    marginBottom: '0.3rem',
  },
  modalTitle: { fontSize: '1.1rem', fontWeight: 700, color: '#111', margin: '0 0 0.25rem', lineHeight: 1.3 },
  modalMeta: { fontSize: '0.78rem', color: '#888', margin: 0 },
  closeBtn: {
    flexShrink: 0,
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    border: '1.5px solid #e0ddd6',
    background: '#fff',
    fontSize: '0.9rem',
    color: '#666',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    fontFamily: FONT,
  },
  form: { padding: '1.6rem 1.8rem 2rem' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' },
  formField: { display: 'flex', flexDirection: 'column' as const, gap: '0.3rem' },
  formLabel: {
    fontSize: '0.73rem',
    fontWeight: 700,
    color: '#777',
    letterSpacing: '0.04em',
    textTransform: 'uppercase' as const,
  },
  formInput: {
    padding: '0.65rem 0.85rem',
    border: '1.5px solid #e0ddd6',
    borderRadius: '8px',
    fontSize: '0.875rem',
    color: '#222',
    background: '#fff',
    fontFamily: FONT,
    outline: 'none',
  },
  formTextarea: {
    padding: '0.65rem 0.85rem',
    border: '1.5px solid #e0ddd6',
    borderRadius: '8px',
    fontSize: '0.875rem',
    color: '#222',
    background: '#fff',
    fontFamily: FONT,
    resize: 'vertical' as const,
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box' as const,
  },
  uploadLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.6rem 0.85rem',
    border: '1.5px dashed #d0ccc3',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.82rem',
    color: '#666',
    background: '#faf8f5',
  },
  submitBtn: (disabled: boolean): React.CSSProperties => ({
    width: '100%',
    padding: '0.88rem',
    background: disabled ? '#ccc' : BRAND,
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: 700,
    letterSpacing: '0.04em',
    cursor: disabled ? 'not-allowed' : 'pointer',
    marginTop: '1rem',
    fontFamily: FONT,
  }),
  msgOk: {
    fontSize: '0.85rem',
    fontWeight: 500,
    borderRadius: '8px',
    padding: '0.65rem 1rem',
    marginTop: '0.75rem',
    background: '#eef6ee',
    color: '#2d6a2d',
  },
  msgErr: {
    fontSize: '0.85rem',
    fontWeight: 500,
    borderRadius: '8px',
    padding: '0.65rem 1rem',
    marginTop: '0.75rem',
    background: '#fdecea',
    color: '#a63222',
  },
}

/* ── filter config ── */
const LOCATIONS = ['All Locations', 'Mumbai', 'Pune', 'Delhi', 'Bangalore', 'Remote']
const EXP_LEVELS = ['Entry Level', 'Mid-Senior', 'Director+']
const EMP_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship']

export default function Careers() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState<ApplicationForm>(emptyForm)
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [applicationJob, setApplicationJob] = useState<Job | null>(null)
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set())
  const [showAll, setShowAll] = useState(false)

  // Filter state
  const [searchText, setSearchText] = useState('')
  const [deptFilter, setDeptFilter] = useState('All Departments')
  const [locationFilter, setLocationFilter] = useState('All Locations')
  const [expFilters, setExpFilters] = useState<string[]>([])
  const [typeFilters, setTypeFilters] = useState<string[]>([])

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string

  useEffect(() => { window.scrollTo({ top: 0 }) }, [])

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${API_BASE_URL}/careers/jobs`)
        if (response.ok) {
          const data = await response.json()
          setJobs(data)
        }
      } catch (error) {
        console.error('Unable to load jobs', error)
      } finally {
        setLoading(false)
      }
    }
    fetchJobs()
  }, [API_BASE_URL])

  // Derive departments list from jobs
  const departments = ['All Departments', ...Array.from(new Set(jobs.map(j => j.department)))]

  // Filtered jobs
  const filteredJobs = jobs.filter(job => {
    const q = searchText.toLowerCase()
    if (q && !job.title.toLowerCase().includes(q) && !job.department.toLowerCase().includes(q) && !job.location.toLowerCase().includes(q)) return false
    if (deptFilter !== 'All Departments' && job.department !== deptFilter) return false
    if (locationFilter !== 'All Locations' && !job.location.toLowerCase().includes(locationFilter.toLowerCase())) return false
    if (expFilters.length > 0 && !expFilters.some(e => job.experience.toLowerCase().includes(e.toLowerCase().split(' ')[0]))) return false
    if (typeFilters.length > 0 && !typeFilters.some(t => job.employment_type.toLowerCase().includes(t.toLowerCase().split('-')[0]))) return false
    return true
  })

  const visibleJobs = showAll ? filteredJobs : filteredJobs.slice(0, 5)

  const toggleExp = (val: string) =>
    setExpFilters(p => p.includes(val) ? p.filter(x => x !== val) : [...p, val])

  const toggleType = (val: string) =>
    setTypeFilters(p => p.includes(val) ? p.filter(x => x !== val) : [...p, val])

  const clearFilters = () => {
    setSearchText('')
    setDeptFilter('All Departments')
    setLocationFilter('All Locations')
    setExpFilters([])
    setTypeFilters([])
  }

  const toggleBookmark = (id: string) =>
    setBookmarked(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n })

  const updateField = (field: keyof ApplicationForm, value: string) =>
    setFormData(c => ({ ...c, [field]: value }))

  const openApplicationForm = (job: Job) => {
    setApplicationJob(job)
    setMessage('')
  }

  const closeApplicationForm = () => {
    if (submitting) return
    setApplicationJob(null)
    setMessage('')
  }

  const submitApplication = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!applicationJob || !resumeFile) return
    setSubmitting(true)
    setMessage('')
    try {
      const payload = new FormData()
      payload.append('job_id', applicationJob.id)
      Object.entries(formData).forEach(([key, value]) => payload.append(key, value))
      payload.append('resume', resumeFile)
      const response = await fetch(`${API_BASE_URL}/careers/applications/upload`, {
        method: 'POST',
        body: payload,
      })
      if (!response.ok) throw new Error('Application failed')
      setFormData(emptyForm)
      setResumeFile(null)
      setMessage('Application submitted successfully. Our HR team will review it soon.')
      setTimeout(() => { setApplicationJob(null); setMessage('') }, 1800)
    } catch (error) {
      console.error('Unable to submit application', error)
      setMessage('Could not submit your application right now. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={S.page}>

      {/* ── HERO ── */}
      <section style={S.hero}>
        <div style={{ ...S.heroBg, backgroundImage: `url(${imageUrl('WebPoster4.jpeg')})` }} />
        <div style={S.heroOverlay} />
        <div style={S.heroContent}>
          <p style={S.heroEyebrow}>Join JHS</p>
          <h1 style={S.heroTitle}>Shape What's Next</h1>
          <p style={S.heroSub}>
            Build a rewarding career helping high-growth organizations reach their full potential.
          </p>
          <a href="#openings" style={S.heroCta}>View Open Roles ↓</a>
        </div>
        <div style={S.statsBar}>
          <div style={S.stat}><span style={S.statNum}>700+</span><span style={S.statLabel}>Team Members</span></div>
          <div style={S.statDiv} />
          <div style={S.stat}><span style={S.statNum}>50+</span><span style={S.statLabel}>Annual Hires</span></div>
          <div style={S.statDiv} />
          <div style={S.stat}><span style={S.statNum}>100%</span><span style={S.statLabel}>Growth Culture</span></div>
        </div>
      </section>

      {/* ── LIFE AT JHS ── */}
      <section style={S.lifeSection}>
        <div style={S.lifeGrid}>
          <div>
            <p style={S.eyebrow}>Our Culture</p>
            <h2 style={S.sectionTitle}>Life at JHS</h2>
            <p style={S.lifeTagline}>More than a job — a launchpad for your professional journey.</p>
          </div>
          <div>
            <p style={S.lifeBody}>
              We believe our firm is only as good as the people within it. At JHS &amp; Associates, we
              foster an inclusive, dynamic, and high-performance culture that rewards innovation and hard work.
            </p>
            <p style={{ ...S.lifeBody, marginBottom: 0 }}>
              Whether you're an aspiring articled assistant seeking deep foundational training or an
              experienced professional aiming to lead advisory verticals, JHS gives you the platform to excel.
            </p>
            <ul style={S.perksList}>
              {[
                'Continuous learning and development programs',
                'Direct mentorship from industry veterans',
                'Exposure to diverse industries and large enterprise clients',
                'Meritocratic growth opportunities',
              ].map(item => (
                <li key={item} style={S.perkItem}>
                  <span style={S.perkDot} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <img src={imageUrl('growthposter.jpg')} alt="JHS Office Culture" style={S.cultureImg} loading="lazy" />
      </section>

      {/* ══════════════════════════════════════
          ── JOB BOARD (reference design) ──
      ══════════════════════════════════════ */}
      <section style={S.boardSection} id="openings">

        {/* Header row */}
        <div style={S.boardHeader}>
          <div style={S.boardHeaderLeft}>
            <span style={S.boardEyebrow}>Current Openings</span>
            <h2 style={S.boardTitle}>Explore Open Roles</h2>
            <p style={S.boardSub}>
              Find your next challenge. We're looking for passionate individuals to join our teams.
            </p>
          </div>
          {/* Search bar */}
          <div style={S.searchWrap}>
            <span style={S.searchIcon}></span>
            <input
              style={S.searchInput}
              placeholder="Search by title or keyword…"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
            />
            {searchText && (
              <button
                onClick={() => setSearchText('')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', fontSize: '0.85rem', padding: 0, fontFamily: FONT }}
              >✕</button>
            )}
          </div>
        </div>

        {loading ? (
          <div style={S.emptyBox}>Loading current openings…</div>
        ) : (
          <div style={S.boardBody}>

            {/* ── LEFT SIDEBAR: Filters ── */}
            <div style={S.sidebar}>
              <div style={S.sidebarCard}>
                <div style={S.filterHeader}>
                  <p style={S.filterTitle}>Filters</p>
                  <button style={S.clearBtn} onClick={clearFilters} type="button">Clear All</button>
                </div>

                {/* Department */}
                <div style={S.filterGroup}>
                  <span style={S.filterGroupLabel}>Department</span>
                  <select
                    style={S.filterSelect}
                    value={deptFilter}
                    onChange={e => setDeptFilter(e.target.value)}
                  >
                    {departments.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>

                {/* Location */}
                <div style={S.filterGroup}>
                  <span style={S.filterGroupLabel}>Location</span>
                  <select
                    style={S.filterSelect}
                    value={locationFilter}
                    onChange={e => setLocationFilter(e.target.value)}
                  >
                    {LOCATIONS.map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>

                {/* Experience Level */}
                <div style={S.filterGroup}>
                  <span style={S.filterGroupLabel}>Experience Level</span>
                  {EXP_LEVELS.map((lvl, i) => (
                    <label
                      key={lvl}
                      style={i === EXP_LEVELS.length - 1 ? S.checkboxItemLast : S.checkboxItem}
                    >
                      <input
                        type="checkbox"
                        style={S.checkbox}
                        checked={expFilters.includes(lvl)}
                        onChange={() => toggleExp(lvl)}
                      />
                      <span style={S.checkboxLabel}>{lvl}</span>
                    </label>
                  ))}
                </div>

                {/* Employment Type */}
                <div style={S.filterGroupLast}>
                  <span style={S.filterGroupLabel}>Employment Type</span>
                  {EMP_TYPES.map((t, i) => (
                    <label
                      key={t}
                      style={i === EMP_TYPES.length - 1 ? S.checkboxItemLast : S.checkboxItem}
                    >
                      <input
                        type="checkbox"
                        style={S.checkbox}
                        checked={typeFilters.includes(t)}
                        onChange={() => toggleType(t)}
                      />
                      <span style={S.checkboxLabel}>{t}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Community card */}
              {/* <div style={S.communityCard}>
                <p style={S.communityTitle}>Can't find a role?</p>
                <p style={S.communitySub}>
                  Join our talent community and we'll notify you when a match opens up.
                </p>
                <button
                  style={S.communityBtn}
                  type="button"
                  onClick={() => window.location.href = 'mailto:hr@jhsassociates.in'}
                >
                  Join Community
                </button>
              </div> */}
            </div>

            {/* ── RIGHT: Job rows ── */}
            <div>
              {filteredJobs.length === 0 ? (
                <div style={S.emptyBox}>
                  <p style={{ fontWeight: 600, color: '#444', marginBottom: '0.5rem' }}>No roles match your filters</p>
                  <p>Try adjusting your search or <button onClick={clearFilters} style={{ background: 'none', border: 'none', color: BRAND, cursor: 'pointer', fontWeight: 600, fontSize: 'inherit', fontFamily: FONT }}>clear all filters</button></p>
                </div>
              ) : (
                <div style={S.jobRows}>
                  {visibleJobs.map(job => (
                    <div
                      key={job.id}
                      style={S.jobRow}
                      onMouseEnter={e => {
                        ; (e.currentTarget as HTMLDivElement).style.borderColor = BRAND
                          ; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 20px rgba(176,30,46,0.08)'
                      }}
                      onMouseLeave={e => {
                        ; (e.currentTarget as HTMLDivElement).style.borderColor = '#e8e5df'
                          ; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'
                      }}
                    >
                      {/* Main info */}
                      <div style={S.jobRowMain}>
                        {/* Top line: dept tag + type */}
                        <div style={S.jobRowTopLine}>
                          <span style={S.deptTag(job.department)}>{job.department}</span>
                          <span style={S.empTypeTag}>
                            {job.employment_type}
                          </span>
                        </div>
                        {/* Title */}
                        <h3 style={S.jobRowTitle}>{job.title}</h3>
                        {/* Meta row */}
                        <div style={S.jobRowMeta}>
                          <span style={S.metaItem}>{job.location}</span>
                          <span style={S.metaDot} />
                          <span style={S.metaItem}>{job.experience}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div style={S.jobRowActions}>
                        {/* <button
                          style={{
                            ...S.bookmarkBtn,
                            color: bookmarked.has(job.id) ? BRAND : '#bbb',
                            borderColor: bookmarked.has(job.id) ? BRAND : '#e8e5df',
                          }}
                          type="button"
                          aria-label={bookmarked.has(job.id) ? 'Remove bookmark' : 'Bookmark job'}
                          onClick={() => toggleBookmark(job.id)}
                        >
                          {bookmarked.has(job.id) ? '🔖' : '🔖'}
                        </button> */}
                        <button
                          style={S.applyBtn}
                          type="button"
                          onClick={() => openApplicationForm(job)}
                          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = BRAND_DARK }}
                          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = BRAND }}
                        >
                          Apply Now
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* View more / less */}
                  {filteredJobs.length > 5 && (
                    <button
                      style={S.viewMoreBtn}
                      type="button"
                      onClick={() => setShowAll(p => !p)}
                      onMouseEnter={e => {
                        ; (e.currentTarget as HTMLButtonElement).style.borderColor = BRAND
                          ; (e.currentTarget as HTMLButtonElement).style.color = BRAND
                      }}
                      onMouseLeave={e => {
                        ; (e.currentTarget as HTMLButtonElement).style.borderColor = '#e8e5df'
                          ; (e.currentTarget as HTMLButtonElement).style.color = '#555'
                      }}
                    >
                      {showAll
                        ? `Show Fewer Positions`
                        : `View ${filteredJobs.length - 5} More Position${filteredJobs.length - 5 !== 1 ? 's' : ''}`}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* ── APPLICATION MODAL ── */}
      {applicationJob && (
        <div style={S.modalWrap} role="dialog" aria-modal="true" aria-labelledby="career-apply-title">
          <button style={S.backdrop} type="button" aria-label="Close" onClick={closeApplicationForm} />
          <div style={S.panel}>
            <div style={S.modalHeader}>
              <div>
                <span style={S.modalDept}>{applicationJob.department}</span>
                <h3 id="career-apply-title" style={S.modalTitle}>Apply — {applicationJob.title}</h3>
                <p style={S.modalMeta}>
                  {applicationJob.location} · {applicationJob.employment_type} · {applicationJob.experience}
                </p>
              </div>
              <button style={S.closeBtn} type="button" aria-label="Close" onClick={closeApplicationForm}>✕</button>
            </div>

            <form style={S.form} onSubmit={submitApplication}>
              <div style={S.formGrid}>
                <div style={S.formField}>
                  <label style={S.formLabel}>Full Name *</label>
                  <input style={S.formInput} value={formData.full_name} onChange={e => updateField('full_name', e.target.value)} placeholder="Your full name" required />
                </div>
                <div style={S.formField}>
                  <label style={S.formLabel}>Email *</label>
                  <input style={S.formInput} type="email" value={formData.email} onChange={e => updateField('email', e.target.value)} placeholder="your@email.com" required />
                </div>
                <div style={S.formField}>
                  <label style={S.formLabel}>Phone *</label>
                  <input style={S.formInput} value={formData.phone} onChange={e => updateField('phone', e.target.value)} placeholder="+91 98765 43210" required />
                </div>
                <div style={S.formField}>
                  <label style={S.formLabel}>Current Location</label>
                  <input style={S.formInput} value={formData.current_location} onChange={e => updateField('current_location', e.target.value)} placeholder="City, State" />
                </div>
                <div style={S.formField}>
                  <label style={S.formLabel}>Years of Experience</label>
                  <input style={S.formInput} value={formData.experience_years} onChange={e => updateField('experience_years', e.target.value)} placeholder="e.g. 3 years" />
                </div>
                <div style={S.formField}>
                  <label style={S.formLabel}>Resume (PDF) *</label>
                  <label style={S.uploadLabel}>
                    {resumeFile ? `✓ ${resumeFile.name}` : '📎 Upload PDF'}
                    <input type="file" accept="application/pdf,.pdf" required style={{ display: 'none' }} onChange={e => setResumeFile(e.target.files?.[0] ?? null)} />
                  </label>
                </div>
              </div>
              <div style={{ ...S.formField, marginBottom: '0.25rem' }}>
                <label style={S.formLabel}>Cover Note</label>
                <textarea style={S.formTextarea} value={formData.cover_letter} onChange={e => updateField('cover_letter', e.target.value)} placeholder="Tell us why you're a great fit for this role…" rows={4} />
              </div>
              <button type="submit" style={S.submitBtn(submitting)} disabled={submitting}>
                {submitting ? 'Submitting…' : 'Submit Application'}
              </button>
              {message && (
                <p style={message.startsWith('Could') ? S.msgErr : S.msgOk}>{message}</p>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  )
}