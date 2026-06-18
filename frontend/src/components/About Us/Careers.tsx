import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { imageUrl } from '../../utils/imageUrl'

/* ─── Types ─────────────────────────────────────────────── */
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

/* ─── Constants ──────────────────────────────────────────── */
const BRAND = '#B01E2E'
const BRAND_DARK = '#8f1620'
const FONT = "'DM Sans', 'Helvetica Neue', sans-serif"

const LOCATIONS = ['All Locations', 'Mumbai', 'Pune', 'Delhi', 'Bangalore', 'Remote']
const EXP_LEVELS = ['Entry Level', 'Mid-Senior', 'Director+']
const EMP_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship']

/* ─── Responsive CSS injected once ──────────────────────── */
const RESPONSIVE_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300..800&display=swap');

  * { box-sizing: border-box; }

  /* ── Hero ── */
  .careers-hero-content { padding: 7rem 2rem 3rem !important; }
  .careers-stats-bar    { gap: 3rem !important; }

  /* ── Life section ── */
  .careers-life-section { padding: 5rem 6rem !important; }
  .careers-life-grid    { grid-template-columns: 1fr 1.7fr !important; gap: 4rem !important; }
  .careers-culture-img  { height: 380px !important; }

  /* ── Board section ── */
  .careers-board-section { padding: 4rem 4rem 5rem !important; }
  .careers-board-header  { flex-direction: row !important; align-items: flex-end !important; }
  .careers-search-wrap   { min-width: 280px !important; }
  .careers-board-body    { grid-template-columns: 230px 1fr !important; }
  .careers-sidebar       { display: flex !important; }
  .careers-filter-fab    { display: none !important; }
  .careers-filter-drawer { display: none !important; }

  /* job row desktop */
  .careers-job-row       { flex-direction: row !important; align-items: center !important; }
  .careers-job-actions   { flex-direction: row !important; align-items: center !important; margin-top: 0 !important; }
  .careers-apply-btn     { width: auto !important; }

  /* modal form grid */
  .careers-form-grid     { grid-template-columns: 1fr 1fr !important; }

  /* TABLET  601–900 */
  @media (max-width: 900px) {
    .careers-life-section { padding: 3.5rem 2.5rem !important; }
    .careers-life-grid    { grid-template-columns: 1fr !important; gap: 2rem !important; }
    .careers-culture-img  { height: 260px !important; }

    .careers-board-section { padding: 3rem 2rem 4rem !important; }
    .careers-board-header  { flex-direction: column !important; align-items: flex-start !important; gap: 1rem !important; }
    .careers-search-wrap   { width: 100% !important; min-width: unset !important; }
    .careers-board-body    { grid-template-columns: 1fr !important; }
    .careers-sidebar       { display: none !important; }
    .careers-filter-fab    { display: flex !important; }

    .careers-job-row       { flex-direction: row !important; align-items: center !important; }
    .careers-job-actions   { flex-shrink: 0 !important; }
  }

  /* MOBILE  ≤600 */
  @media (max-width: 600px) {
    .careers-hero-content { padding: 5rem 1.25rem 2rem !important; }
    .careers-stats-bar    { gap: 1.2rem !important; padding: 1.1rem 1rem !important; }
    .careers-stat-num     { font-size: 1.3rem !important; }

    .careers-life-section { padding: 2.5rem 1.25rem !important; }
    .careers-culture-img  { height: 200px !important; border-radius: 10px !important; }

    .careers-board-section { padding: 2rem 1rem 3rem !important; }
    .careers-board-body    { grid-template-columns: 1fr !important; }
    .careers-sidebar       { display: none !important; }
    .careers-filter-fab    { display: flex !important; }

    /* job row stacks on very small */
    .careers-job-row       { flex-direction: column !important; align-items: flex-start !important; gap: 0.75rem !important; }
    .careers-job-actions   { flex-direction: row !important; width: 100% !important; margin-top: 0 !important; justify-content: flex-end !important; }
    .careers-apply-btn     { flex: 1 !important; text-align: center !important; }

    /* modal full-screen on mobile */
    .careers-modal-panel   { border-radius: 12px 12px 0 0 !important; max-height: 95vh !important; position: fixed !important; bottom: 0 !important; left: 0 !important; right: 0 !important; top: auto !important; max-width: 100% !important; }
    .careers-form-grid     { grid-template-columns: 1fr !important; }

    /* filter drawer */
    .careers-filter-drawer {
      position: fixed !important; inset: 0 !important; z-index: 900 !important;
      display: flex !important; flex-direction: column !important;
    }
  }

  /* Filter drawer slide-in panel */
  .careers-filter-drawer-panel {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    background: #fff;
    border-radius: 20px 20px 0 0;
    max-height: 80vh;
    overflow-y: auto;
    padding: 1.5rem 1.25rem 2rem;
  }
  .careers-filter-drawer-backdrop {
    position: absolute; inset: 0;
    background: rgba(0,0,0,0.45);
    border: none; cursor: pointer; width: 100%; height: 100%;
  }

  /* hover effects */
  .careers-job-row:hover {
    border-color: ${BRAND} !important;
    box-shadow: 0 4px 20px rgba(176,30,46,0.09) !important;
  }
  .careers-view-more-btn:hover {
    border-color: ${BRAND} !important;
    color: ${BRAND} !important;
  }
  .careers-apply-btn:hover  { background: ${BRAND_DARK} !important; }
  .careers-bookmark-btn:hover { border-color: ${BRAND} !important; }
`

/* ─── Dept tag colours ───────────────────────────────────── */
function deptTagStyle(dept: string): React.CSSProperties {
  const map: Record<string, { bg: string; color: string }> = {
    'Human Resources': { bg: '#fff0e0', color: '#b85c00' },
    Finance: { bg: '#e8f4ff', color: '#1a6fb5' },
    Technology: { bg: '#eef5e8', color: '#2d7a1f' },
    Operations: { bg: '#f3eeff', color: '#5c35b0' },
    Sales: { bg: '#fff0f0', color: '#a0192a' },
    Marketing: { bg: '#fdf0fb', color: '#8f1a80' },
  }
  const c = map[dept] ?? { bg: '#f0f0f0', color: '#444' }
  return {
    fontSize: '0.67rem', fontWeight: 700, padding: '0.22rem 0.65rem',
    borderRadius: '5px', background: c.bg, color: c.color, letterSpacing: '0.03em',
    whiteSpace: 'nowrap' as const,
  }
}

/* ═══════════════════════════════════════════════════════════
   Component
═══════════════════════════════════════════════════════════ */
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
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)

  // Filters
  const [searchText, setSearchText] = useState('')
  const [deptFilter, setDeptFilter] = useState('All Departments')
  const [locationFilter, setLocationFilter] = useState('All Locations')
  const [expFilters, setExpFilters] = useState<string[]>([])
  const [typeFilters, setTypeFilters] = useState<string[]>([])

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string

  /* Inject CSS once */
  useEffect(() => {
    const id = 'careers-responsive-css'
    if (!document.getElementById(id)) {
      const tag = document.createElement('style')
      tag.id = id
      tag.textContent = RESPONSIVE_CSS
      document.head.appendChild(tag)
    }
    return () => { /* keep style on unmount — harmless */ }
  }, [])

  useEffect(() => { window.scrollTo({ top: 0 }) }, [])

  useEffect(() => {
    ; (async () => {
      try {
        setLoading(true)
        const res = await fetch(`${API_BASE_URL}/careers/jobs`)
        if (res.ok) setJobs(await res.json())
      } catch (e) { console.error('Unable to load jobs', e) }
      finally { setLoading(false) }
    })()
  }, [API_BASE_URL])

  /* Close filter drawer on ESC */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setFilterDrawerOpen(false) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  /* Lock body scroll when modal or drawer open */
  useEffect(() => {
    document.body.style.overflow = (applicationJob || filterDrawerOpen) ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [applicationJob, filterDrawerOpen])

  const departments = ['All Departments', ...Array.from(new Set(jobs.map(j => j.department)))]
  const activeFilters = (deptFilter !== 'All Departments' ? 1 : 0)
    + (locationFilter !== 'All Locations' ? 1 : 0)
    + expFilters.length + typeFilters.length

  const filteredJobs = jobs.filter(job => {
    const q = searchText.toLowerCase()
    if (q && !job.title.toLowerCase().includes(q)
      && !job.department.toLowerCase().includes(q)
      && !job.location.toLowerCase().includes(q)) return false
    if (deptFilter !== 'All Departments' && job.department !== deptFilter) return false
    if (locationFilter !== 'All Locations'
      && !job.location.toLowerCase().includes(locationFilter.toLowerCase())) return false
    if (expFilters.length > 0
      && !expFilters.some(e => job.experience.toLowerCase().includes(e.toLowerCase().split(' ')[0]))) return false
    if (typeFilters.length > 0
      && !typeFilters.some(t => job.employment_type.toLowerCase().includes(t.toLowerCase().split('-')[0]))) return false
    return true
  })

  const visibleJobs = showAll ? filteredJobs : filteredJobs.slice(0, 5)

  const toggleExp = (v: string) => setExpFilters(p => p.includes(v) ? p.filter(x => x !== v) : [...p, v])
  const toggleType = (v: string) => setTypeFilters(p => p.includes(v) ? p.filter(x => x !== v) : [...p, v])
  const clearFilters = () => {
    setSearchText(''); setDeptFilter('All Departments')
    setLocationFilter('All Locations'); setExpFilters([]); setTypeFilters([])
  }
  const toggleBookmark = (id: string) =>
    setBookmarked(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n })

  const updateField = (f: keyof ApplicationForm, v: string) =>
    setFormData(c => ({ ...c, [f]: v }))

  const openApplicationForm = (job: Job) => { setApplicationJob(job); setMessage('') }
  const closeApplicationForm = () => { if (!submitting) { setApplicationJob(null); setMessage('') } }

  const submitApplication = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!applicationJob || !resumeFile) return
    setSubmitting(true); setMessage('')
    try {
      const payload = new FormData()
      payload.append('job_id', applicationJob.id)
      Object.entries(formData).forEach(([k, v]) => payload.append(k, v))
      payload.append('resume', resumeFile)
      const res = await fetch(`${API_BASE_URL}/careers/applications/upload`, { method: 'POST', body: payload })
      if (!res.ok) throw new Error()
      setFormData(emptyForm); setResumeFile(null)
      setMessage('Application submitted successfully. Our HR team will review it soon.')
      setTimeout(() => { setApplicationJob(null); setMessage('') }, 1800)
    } catch {
      setMessage('Could not submit your application right now. Please try again.')
    } finally { setSubmitting(false) }
  }

  /* ── Shared filter panel markup (used in sidebar + drawer) ── */
  const FilterPanel = () => (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#111', margin: 0 }}>Filters</p>
        {activeFilters > 0 && (
          <button onClick={clearFilters} style={{ fontSize: '0.72rem', fontWeight: 600, color: BRAND, background: 'none', border: 'none', cursor: 'pointer', fontFamily: FONT }}>
            Clear All ({activeFilters})
          </button>
        )}
      </div>

      {/* Department */}
      <div style={{ marginBottom: '1.1rem' }}>
        <span style={fs.filterGroupLabel}>Department</span>
        <select style={fs.filterSelect} value={deptFilter} onChange={e => setDeptFilter(e.target.value)}>
          {departments.map(d => <option key={d}>{d}</option>)}
        </select>
      </div>

      {/* Location */}
      <div style={{ marginBottom: '1.1rem' }}>
        <span style={fs.filterGroupLabel}>Location</span>
        <select style={fs.filterSelect} value={locationFilter} onChange={e => setLocationFilter(e.target.value)}>
          {LOCATIONS.map(l => <option key={l}>{l}</option>)}
        </select>
      </div>

      {/* Experience Level */}
      <div style={{ marginBottom: '1.1rem' }}>
        <span style={fs.filterGroupLabel}>Experience Level</span>
        {EXP_LEVELS.map(lvl => (
          <label key={lvl} style={fs.checkboxRow}>
            <input type="checkbox" style={fs.checkbox} checked={expFilters.includes(lvl)} onChange={() => toggleExp(lvl)} />
            <span style={fs.checkboxLabel}>{lvl}</span>
          </label>
        ))}
      </div>

      {/* Employment Type */}
      <div>
        <span style={fs.filterGroupLabel}>Employment Type</span>
        {EMP_TYPES.map(t => (
          <label key={t} style={fs.checkboxRow}>
            <input type="checkbox" style={fs.checkbox} checked={typeFilters.includes(t)} onChange={() => toggleType(t)} />
            <span style={fs.checkboxLabel}>{t}</span>
          </label>
        ))}
      </div>
    </>
  )

  /* ─── render ──────────────────────────────────────────── */
  return (
    <div style={{ fontFamily: FONT, color: '#1a1a1a' }}>

      {/* ══ HERO ══ */}
      <section style={ss.hero}>
        <div style={{ ...ss.heroBg, backgroundImage: `url(${imageUrl('WebPoster4.jpeg')})` }} />
        <div style={ss.heroOverlay} />
        <div className="careers-hero-content" style={ss.heroContent}>
          <p style={ss.heroEyebrow}>Join JHS</p>
          <h1 style={ss.heroTitle}>Shape What's Next</h1>
          <p style={ss.heroSub}>Build a rewarding career helping high-growth organizations reach their full potential.</p>
          <a href="#openings" style={ss.heroCta}>View Open Roles ↓</a>
        </div>
        <div className="careers-stats-bar" style={ss.statsBar}>
          {[['700+', 'Team Members'], ['50+', 'Annual Hires'], ['100%', 'Growth Culture']].map(([num, lbl], i) => (
            <>
              {i > 0 && <div key={`d${i}`} style={ss.statDiv} />}
              <div key={lbl} style={ss.stat}>
                <span className="careers-stat-num" style={ss.statNum}>{num}</span>
                <span style={ss.statLabel}>{lbl}</span>
              </div>
            </>
          ))}
        </div>
      </section>

      {/* ══ LIFE AT JHS ══ */}
      <section className="careers-life-section" style={ss.lifeSection}>
        <div className="careers-life-grid" style={ss.lifeGrid}>
          <div>
            <p style={ss.eyebrow}>Our Culture</p>
            <h2 style={ss.sectionTitle}>Life at JHS</h2>
            <p style={ss.lifeTagline}>More than a job — a launchpad for your professional journey.</p>
          </div>
          <div>
            <p style={ss.lifeBody}>
              We believe our firm is only as good as the people within it. At JHS &amp; Associates, we foster an inclusive, dynamic, and high-performance culture that rewards innovation and hard work.
            </p>
            <p style={{ ...ss.lifeBody, marginBottom: 0 }}>
              Whether you're an aspiring articled assistant seeking deep foundational training or an experienced professional aiming to lead advisory verticals, JHS gives you the platform to excel.
            </p>
            <ul style={ss.perksList}>
              {['Continuous learning and development programs', 'Direct mentorship from industry veterans', 'Exposure to diverse industries and large enterprise clients', 'Meritocratic growth opportunities'].map(item => (
                <li key={item} style={ss.perkItem}><span style={ss.perkDot} />{item}</li>
              ))}
            </ul>
          </div>
        </div>
        <img src={imageUrl('growthposter.jpg')} alt="JHS Office Culture" className="careers-culture-img" style={ss.cultureImg} loading="lazy" />
      </section>

      {/* ══ JOB BOARD ══ */}
      <section className="careers-board-section" style={ss.boardSection} id="openings">

        {/* Header */}
        <div className="careers-board-header" style={ss.boardHeader}>
          <div>
            <span style={ss.boardEyebrow}>Current Openings</span>
            <h2 style={ss.boardTitle}>Explore Open Roles</h2>
            <p style={ss.boardSub}>Find your next challenge we're looking for passionate people to join our teams.</p>
          </div>
          <div className="careers-search-wrap" style={ss.searchWrap}>
            <span style={{ fontSize: '1rem', color: '#aaa', flexShrink: 0 }}>🔍</span>
            <input
              style={ss.searchInput}
              placeholder="Search title or keyword…"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
            />
            {searchText && (
              <button onClick={() => setSearchText('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', fontSize: '0.85rem', padding: 0, fontFamily: FONT }}>✕</button>
            )}
          </div>
        </div>

        {/* Mobile filter FAB */}
        <button
          className="careers-filter-fab"
          style={ss.filterFab}
          onClick={() => setFilterDrawerOpen(true)}
        >
          <span>⚙</span>
          Filters
          {activeFilters > 0 && <span style={ss.filterBadge}>{activeFilters}</span>}
        </button>

        {loading ? (
          <div style={ss.emptyBox}>Loading current openings…</div>
        ) : (
          <div className="careers-board-body" style={ss.boardBody}>

            {/* ── SIDEBAR (desktop/tablet) ── */}
            <div className="careers-sidebar" style={ss.sidebar}>
              <div style={ss.sidebarCard}>
                <div style={{ padding: '1rem 1.1rem 0.85rem', borderBottom: '1px solid #f0ede6' }}>
                  <FilterPanel />
                </div>
              </div>
              {/* Community card */}
              <div style={ss.communityCard}>
                <p style={ss.communityTitle}>Can't find a role?</p>
                <p style={ss.communitySub}>Join our talent community and we'll notify you when a match opens up.</p>
                <button style={ss.communityBtn} type="button" onClick={() => { window.location.href = 'mailto:hr@jhsassociates.in' }}>
                  Join Community
                </button>
              </div>
            </div>

            {/* ── JOB ROWS ── */}
            <div>
              {/* Results count + sort hint */}
              {!loading && filteredJobs.length > 0 && (
                <p style={{ fontSize: '0.78rem', color: '#999', margin: '0 0 0.85rem', fontWeight: 500 }}>
                  Showing {visibleJobs.length} of {filteredJobs.length} position{filteredJobs.length !== 1 ? 's' : ''}
                </p>
              )}

              {filteredJobs.length === 0 ? (
                <div style={ss.emptyBox}>
                  <p style={{ fontWeight: 600, color: '#444', marginBottom: '0.5rem' }}>No roles match your filters</p>
                  <p style={{ margin: 0 }}>Try adjusting your search or{' '}
                    <button onClick={clearFilters} style={{ background: 'none', border: 'none', color: BRAND, cursor: 'pointer', fontWeight: 600, fontFamily: FONT, fontSize: 'inherit' }}>
                      clear all filters
                    </button>
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {visibleJobs.map(job => (
                    <div key={job.id} className="careers-job-row" style={ss.jobRow}>
                      {/* Main info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                          <span style={deptTagStyle(job.department)}>{job.department}</span>
                          <span style={{ fontSize: '0.67rem', fontWeight: 600, color: '#888' }}>🕐 {job.employment_type}</span>
                        </div>
                        <h3 style={ss.jobRowTitle}>{job.title}</h3>
                        <p style={ss.jobRowSummary}>{job.summary}</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem 0.9rem', fontSize: '0.78rem', color: '#888' }}>
                          <span>📍 {job.location}</span>
                          <span>🎓 {job.experience}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="careers-job-actions" style={ss.jobActions}>
                        <button
                          className="careers-bookmark-btn"
                          style={{ ...ss.bookmarkBtn, color: bookmarked.has(job.id) ? BRAND : '#bbb', borderColor: bookmarked.has(job.id) ? BRAND : '#e8e5df' }}
                          type="button"
                          aria-label="Bookmark"
                          onClick={() => toggleBookmark(job.id)}
                        >
                          {bookmarked.has(job.id) ? '❤' : '♡'}
                        </button>
                        <button
                          className="careers-apply-btn"
                          style={ss.applyBtn}
                          type="button"
                          onClick={() => openApplicationForm(job)}
                        >
                          Apply Now
                        </button>
                      </div>
                    </div>
                  ))}

                  {filteredJobs.length > 5 && (
                    <button
                      className="careers-view-more-btn"
                      style={ss.viewMoreBtn}
                      type="button"
                      onClick={() => setShowAll(p => !p)}
                    >
                      {showAll ? 'Show Fewer Positions' : `View ${filteredJobs.length - 5} More Position${filteredJobs.length - 5 !== 1 ? 's' : ''}`}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* ══ FILTER DRAWER (mobile/tablet) ══ */}
      {filterDrawerOpen && (
        <div className="careers-filter-drawer" style={{ position: 'fixed', inset: 0, zIndex: 900, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <button
            className="careers-filter-drawer-backdrop"
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', border: 'none', cursor: 'pointer', width: '100%', height: '100%' }}
            onClick={() => setFilterDrawerOpen(false)}
            aria-label="Close filters"
          />
          <div className="careers-filter-drawer-panel" style={{ position: 'relative', background: '#fff', borderRadius: '20px 20px 0 0', maxHeight: '80vh', overflowY: 'auto', padding: '1.5rem 1.25rem 2.5rem', zIndex: 1 }}>
            <div style={{ width: '36px', height: '4px', borderRadius: '2px', background: '#e0ddd8', margin: '0 auto 1.2rem' }} />
            <FilterPanel />
            <button
              style={{ ...ss.applyBtn, width: '100%', marginTop: '1.5rem', padding: '0.85rem', textAlign: 'center', display: 'block', fontSize: '0.9rem' }}
              onClick={() => setFilterDrawerOpen(false)}
            >
              Show {filteredJobs.length} Result{filteredJobs.length !== 1 ? 's' : ''}
            </button>
          </div>
        </div>
      )}

      {/* ══ APPLICATION MODAL ══ */}
      {applicationJob && (
        <div style={ss.modalWrap} role="dialog" aria-modal="true" aria-labelledby="career-apply-title">
          <button style={ss.backdrop} type="button" aria-label="Close" onClick={closeApplicationForm} />
          <div className="careers-modal-panel" style={ss.modalPanel}>
            <div style={ss.modalHeader}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={ss.modalDept}>{applicationJob.department}</span>
                <h3 id="career-apply-title" style={ss.modalTitle}>Apply — {applicationJob.title}</h3>
                <p style={ss.modalMeta}>{applicationJob.location} · {applicationJob.employment_type} · {applicationJob.experience}</p>
              </div>
              <button style={ss.closeBtn} type="button" aria-label="Close" onClick={closeApplicationForm}>✕</button>
            </div>

            <form style={{ padding: '1.4rem 1.5rem 2rem' }} onSubmit={submitApplication}>
              <div className="careers-form-grid" style={ss.formGrid}>
                {[
                  { label: 'Full Name *', field: 'full_name' as const, placeholder: 'Your full name', type: 'text', required: true },
                  { label: 'Email *', field: 'email' as const, placeholder: 'your@email.com', type: 'email', required: true },
                  { label: 'Phone *', field: 'phone' as const, placeholder: '+91 98765 43210', type: 'text', required: true },
                  { label: 'Current Location', field: 'current_location' as const, placeholder: 'City, State', type: 'text', required: false },
                  { label: 'Years of Experience', field: 'experience_years' as const, placeholder: 'e.g. 3 years', type: 'text', required: false },
                ].map(({ label, field, placeholder, type, required }) => (
                  <div key={field} style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    <label style={ss.formLabel}>{label}</label>
                    <input
                      style={ss.formInput}
                      type={type}
                      value={formData[field]}
                      onChange={e => updateField(field, e.target.value)}
                      placeholder={placeholder}
                      required={required}
                    />
                  </div>
                ))}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <label style={ss.formLabel}>Resume (PDF) *</label>
                  <label style={ss.uploadLabel}>
                    {resumeFile ? `✓ ${resumeFile.name}` : '📎 Upload PDF'}
                    <input type="file" accept="application/pdf,.pdf" required style={{ display: 'none' }} onChange={e => setResumeFile(e.target.files?.[0] ?? null)} />
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginTop: '0.5rem' }}>
                <label style={ss.formLabel}>Cover Note</label>
                <textarea
                  style={ss.formTextarea}
                  value={formData.cover_letter}
                  onChange={e => updateField('cover_letter', e.target.value)}
                  placeholder="Tell us why you're a great fit for this role…"
                  rows={4}
                />
              </div>

              <button type="submit" style={{ ...ss.applyBtn, width: '100%', padding: '0.88rem', marginTop: '1rem', fontSize: '0.9rem', display: 'block', textAlign: 'center', opacity: submitting ? 0.65 : 1, cursor: submitting ? 'not-allowed' : 'pointer' }} disabled={submitting}>
                {submitting ? 'Submitting…' : 'Submit Application'}
              </button>

              {message && (
                <p style={{ fontSize: '0.85rem', fontWeight: 500, borderRadius: '8px', padding: '0.65rem 1rem', marginTop: '0.75rem', background: message.startsWith('Could') ? '#fdecea' : '#eef6ee', color: message.startsWith('Could') ? '#a63222' : '#2d6a2d' }}>
                  {message}
                </p>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Static style objects (no media-query needed) ───────── */
const ss = {
  hero: { position: 'relative' as const, minHeight: '92vh', display: 'flex', flexDirection: 'column' as const, justifyContent: 'space-between', overflow: 'hidden' },
  heroBg: { position: 'absolute' as const, inset: 0, backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 0 },
  heroOverlay: { position: 'absolute' as const, inset: 0, background: 'linear-gradient(160deg,rgba(10,20,50,0.82) 0%,rgba(10,20,50,0.6) 60%,rgba(10,20,50,0.78) 100%)', zIndex: 1 },
  heroContent: { position: 'relative' as const, zIndex: 2, padding: '7rem 2rem 3rem', width: '100%', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', textAlign: 'center' as const, gap: '1rem' },
  heroEyebrow: { fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.6)', margin: 0 },
  heroTitle: { fontSize: 'clamp(2rem,6vw,5rem)', fontWeight: 800, lineHeight: 1.05, color: '#fff', margin: 0, maxWidth: '800px' },
  heroSub: { fontSize: 'clamp(0.95rem,1.6vw,1.18rem)', color: 'rgba(255,255,255,0.78)', lineHeight: 1.65, margin: 0, maxWidth: '520px' },
  heroCta: { display: 'inline-block', marginTop: '0.5rem', padding: '0.72rem 1.8rem', border: '1.5px solid rgba(255,255,255,0.75)', borderRadius: '6px', color: '#fff', fontSize: '0.88rem', fontWeight: 700, letterSpacing: '0.05em', textDecoration: 'none', background: 'transparent', cursor: 'pointer' },
  statsBar: { position: 'relative' as const, zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3rem', padding: '1.5rem 2rem', background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)', borderTop: '1px solid rgba(255,255,255,0.12)' },
  stat: { display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '0.15rem' },
  statNum: { fontSize: '1.8rem', fontWeight: 800, color: '#fff', lineHeight: 1 },
  statLabel: { fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.55)' },
  statDiv: { width: '1px', height: '2.8rem', background: 'rgba(255,255,255,0.2)' },

  lifeSection: { padding: '5rem 6rem', background: '#f7f6f3' },
  lifeGrid: { display: 'grid', gridTemplateColumns: '1fr 1.7fr', gap: '4rem', alignItems: 'start', marginBottom: '3rem' },
  eyebrow: { fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: BRAND, margin: '0 0 0.6rem' },
  sectionTitle: { fontSize: 'clamp(1.4rem,2.5vw,2.4rem)', fontWeight: 800, lineHeight: 1.15, margin: '0 0 0.8rem', color: '#111' },
  lifeTagline: { fontSize: '1.05rem', fontStyle: 'italic', color: '#666', lineHeight: 1.6, margin: 0 },
  lifeBody: { color: '#444', lineHeight: 1.75, margin: '0 0 1rem', fontSize: '0.97rem' },
  perksList: { listStyle: 'none', padding: 0, margin: '1.2rem 0 0', display: 'flex', flexDirection: 'column' as const, gap: '0.6rem' },
  perkItem: { display: 'flex', alignItems: 'baseline', gap: '0.65rem', fontSize: '0.94rem', color: '#333', lineHeight: 1.5 },
  perkDot: { width: '6px', height: '6px', borderRadius: '50%', background: BRAND, flexShrink: 0, marginTop: '1px' },
  cultureImg: { width: '100%', height: '380px', objectFit: 'cover' as const, borderRadius: '16px', display: 'block', boxShadow: '0 8px 40px rgba(0,0,0,0.1)' },

  boardSection: { padding: '4rem 4rem 5rem', background: '#f7f6f3', fontFamily: FONT },
  boardHeader: { display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' as const },
  boardEyebrow: { fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: BRAND, margin: '0 0 0.3rem', display: 'block' },
  boardTitle: { fontSize: 'clamp(1.3rem,2.2vw,2rem)', fontWeight: 800, lineHeight: 1.1, margin: '0 0 0.3rem', color: '#111' },
  boardSub: { fontSize: '0.88rem', color: '#777', margin: 0, lineHeight: 1.55 },
  searchWrap: { display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#fff', border: '1.5px solid #e0ddd8', borderRadius: '8px', padding: '0 0.85rem', height: '44px', minWidth: '280px' },
  searchInput: { flex: 1, border: 'none', outline: 'none', fontSize: '0.875rem', color: '#333', background: 'transparent', fontFamily: FONT, minWidth: 0 },

  filterFab: { display: 'none', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.1rem', background: '#fff', border: '1.5px solid #e0ddd8', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700, color: '#333', cursor: 'pointer', fontFamily: FONT, marginBottom: '1rem' } as React.CSSProperties,
  filterBadge: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '18px', height: '18px', borderRadius: '50%', background: BRAND, color: '#fff', fontSize: '0.65rem', fontWeight: 700, marginLeft: '0.1rem' } as React.CSSProperties,

  boardBody: { display: 'grid', gridTemplateColumns: '230px 1fr', gap: '1.5rem', alignItems: 'start' },

  sidebar: { display: 'flex', flexDirection: 'column' as const, gap: '1rem', position: 'sticky' as const, top: '80px' },
  sidebarCard: { background: '#fff', borderRadius: '12px', border: '1.5px solid #e8e5df', overflow: 'hidden', padding: '1rem 1.1rem' },

  communityCard: { background: BRAND, borderRadius: '12px', padding: '1.3rem 1.1rem', overflow: 'hidden' },
  communityTitle: { fontSize: '0.88rem', fontWeight: 700, color: '#fff', margin: '0 0 0.4rem', lineHeight: 1.35 },
  communitySub: { fontSize: '0.78rem', color: 'rgba(255,255,255,0.82)', lineHeight: 1.55, margin: '0 0 1rem' },
  communityBtn: { display: 'inline-block', padding: '0.5rem 1.1rem', background: '#fff', color: BRAND, border: 'none', borderRadius: '7px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', fontFamily: FONT },

  jobRow: { background: '#fff', border: '1.5px solid #e8e5df', borderRadius: '12px', padding: '1.1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'border-color .15s, box-shadow .15s', cursor: 'default' },
  jobRowTitle: { fontSize: '0.98rem', fontWeight: 700, color: '#111', margin: '0 0 0.3rem', lineHeight: 1.3 },
  jobRowSummary: { fontSize: '0.8rem', color: '#888', lineHeight: 1.5, margin: '0 0 0.5rem', display: '-webkit-box' as const, WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' },
  jobActions: { display: 'flex', alignItems: 'center', gap: '0.55rem', flexShrink: 0 },
  bookmarkBtn: { width: '36px', height: '36px', borderRadius: '8px', border: '1.5px solid #e8e5df', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '1rem', transition: 'border-color .15s, color .15s', flexShrink: 0 },
  applyBtn: { padding: '0.55rem 1.15rem', background: BRAND, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', fontFamily: FONT, letterSpacing: '0.03em', whiteSpace: 'nowrap' as const, transition: 'background .15s' },

  viewMoreBtn: { display: 'block', width: '100%', padding: '0.85rem', background: '#fff', border: '1.5px solid #e8e5df', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 700, color: '#555', cursor: 'pointer', textAlign: 'center' as const, fontFamily: FONT, transition: 'border-color .15s, color .15s' },

  emptyBox: { textAlign: 'center' as const, padding: '4rem 1rem', color: '#999' },

  modalWrap: { position: 'fixed' as const, inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' },
  backdrop: { position: 'absolute' as const, inset: 0, background: 'rgba(0,0,0,0.55)', border: 'none', cursor: 'pointer' },
  modalPanel: { position: 'relative' as const, zIndex: 1, background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '620px', maxHeight: '90vh', overflowY: 'auto' as const, boxShadow: '0 24px 64px rgba(0,0,0,0.22)', fontFamily: FONT },
  modalHeader: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', padding: '1.4rem 1.5rem 1rem', borderBottom: '1px solid #f0ede6', background: '#faf8f5', borderRadius: '16px 16px 0 0' },
  modalDept: { fontSize: '0.63rem', fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase' as const, color: BRAND, display: 'block', marginBottom: '0.25rem' },
  modalTitle: { fontSize: '1.05rem', fontWeight: 700, color: '#111', margin: '0 0 0.2rem', lineHeight: 1.3 },
  modalMeta: { fontSize: '0.75rem', color: '#888', margin: 0 },
  closeBtn: { flexShrink: 0, width: '32px', height: '32px', borderRadius: '50%', border: '1.5px solid #e0ddd6', background: '#fff', fontSize: '0.85rem', color: '#666', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, fontFamily: FONT },

  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '0.85rem' },
  formLabel: { fontSize: '0.7rem', fontWeight: 700, color: '#777', letterSpacing: '0.04em', textTransform: 'uppercase' as const },
  formInput: { padding: '0.6rem 0.8rem', border: '1.5px solid #e0ddd6', borderRadius: '8px', fontSize: '0.875rem', color: '#222', background: '#fff', fontFamily: FONT, outline: 'none', width: '100%' },
  uploadLabel: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0.8rem', border: '1.5px dashed #d0ccc3', borderRadius: '8px', cursor: 'pointer', fontSize: '0.82rem', color: '#666', background: '#faf8f5' },
  formTextarea: { padding: '0.6rem 0.8rem', border: '1.5px solid #e0ddd6', borderRadius: '8px', fontSize: '0.875rem', color: '#222', background: '#fff', fontFamily: FONT, resize: 'vertical' as const, outline: 'none', width: '100%', boxSizing: 'border-box' as const },
}

/* ─── Filter panel local styles (not affected by breakpoints) ── */
const fs = {
  filterGroupLabel: { fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#aaa', margin: '0 0 0.5rem', display: 'block' },
  filterSelect: { width: '100%', padding: '0.45rem 2rem 0.45rem 0.7rem', border: '1.5px solid #e0ddd8', borderRadius: '7px', fontSize: '0.82rem', color: '#333', background: '#fff', fontFamily: FONT, outline: 'none', cursor: 'pointer', appearance: 'none' as const, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23999' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.6rem center' },
  checkboxRow: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', cursor: 'pointer' } as React.CSSProperties,
  checkbox: { width: '15px', height: '15px', accentColor: BRAND, cursor: 'pointer', flexShrink: 0 },
  checkboxLabel: { fontSize: '0.82rem', color: '#444', cursor: 'pointer', lineHeight: 1.4 },
}

