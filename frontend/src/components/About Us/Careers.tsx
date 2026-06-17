import { useEffect, useMemo, useState } from 'react'
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
const BRAND_LIGHT = 'rgba(176,30,46,0.08)'
const FONT = "'DM Sans', 'Helvetica Neue', sans-serif"

/* ─── inline style objects ─────────────────────────────────────── */
const S = {
  /* page */
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
    transition: 'background .2s,color .2s',
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
  lifeTagline: {
    fontSize: '1.05rem',
    fontStyle: 'italic',
    color: '#666',
    lineHeight: 1.6,
    margin: 0,
  },
  lifeBody: { color: '#444', lineHeight: 1.75, margin: '0 0 1rem', fontSize: '0.97rem' },
  perksList: { listStyle: 'none', padding: 0, margin: '1.2rem 0 0', display: 'flex', flexDirection: 'column' as const, gap: '0.6rem' },
  perkItem: { display: 'flex', alignItems: 'baseline', gap: '0.65rem', fontSize: '0.94rem', color: '#333', lineHeight: 1.5 },
  perkDot: { width: '6px', height: '6px', borderRadius: '50%', background: BRAND, flexShrink: 0, marginTop: '1px' },
  cultureImg: { width: '100%', height: '380px', objectFit: 'cover' as const, borderRadius: '16px', display: 'block', boxShadow: '0 8px 40px rgba(0,0,0,0.1)' },

  /* ══════════════════════════════════════
     ── REDESIGNED BOARD SECTION ──
  ══════════════════════════════════════ */
  boardSection: {
    padding: '5rem 4rem 6rem',
    background: '#fff',
    fontFamily: FONT,
  },

  /* Editorial top bar */
  boardTopBar: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    borderBottom: `1.5px solid #1a1a1a`,
    paddingBottom: '1rem',
    marginBottom: '2.5rem',
    gap: '1rem',
  },
  boardEyebrow: {
    fontSize: '0.68rem',
    fontWeight: 700,
    letterSpacing: '0.18em',
    textTransform: 'uppercase' as const,
    color: BRAND,
    margin: '0 0 0.35rem',
    display: 'block',
  },
  boardTitle: {
    fontSize: 'clamp(1.6rem,2.2vw,2.1rem)',
    fontWeight: 800,
    lineHeight: 1.1,
    margin: 0,
    color: '#111',
  },
  boardCount: {
    fontSize: '0.78rem',
    color: '#999',
    fontWeight: 500,
    whiteSpace: 'nowrap' as const,
    paddingBottom: '0.1rem',
  },

  emptyBox: { textAlign: 'center' as const, padding: '4rem 0', color: '#999' },

  flow: { display: 'grid', gridTemplateColumns: '300px 1fr', gap: '1.5rem', alignItems: 'start' },
  jobList: { display: 'flex', flexDirection: 'column' as const, gap: '0.5rem' },

  /* ── Job card ── */
  jobCard: (active: boolean): React.CSSProperties => ({
    border: active ? `1.5px solid ${BRAND}` : '1.5px solid #e8e5df',
    borderRadius: '10px',
    background: '#fff',
    overflow: 'hidden',
    boxShadow: active ? `0 0 0 3px ${BRAND_LIGHT}` : 'none',
    transition: 'border-color .15s, box-shadow .15s',
    cursor: 'pointer',
  }),
  jobCardBtn: {
    display: 'block',
    width: '100%',
    textAlign: 'left' as const,
    background: 'none',
    border: 'none',
    padding: '1rem 1.1rem 0.85rem',
    cursor: 'pointer',
    fontFamily: FONT,
  },
  jobCardDept: {
    fontSize: '0.63rem',
    fontWeight: 700,
    letterSpacing: '0.13em',
    textTransform: 'uppercase' as const,
    color: BRAND,
    display: 'block',
    marginBottom: '0.2rem',
  },
  jobCardTitle: {
    fontSize: '0.92rem',
    fontWeight: 700,
    color: '#111',
    margin: '0 0 0.3rem',
    lineHeight: 1.35,
  },
  jobCardSummary: {
    fontSize: '0.78rem',
    color: '#888',
    lineHeight: 1.5,
    margin: '0 0 0.7rem',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical' as const,
    overflow: 'hidden',
  },
  jobCardTags: { display: 'flex', flexWrap: 'wrap' as const, gap: '0.25rem' },
  jobCardTag: {
    fontSize: '0.67rem',
    fontWeight: 600,
    padding: '0.18rem 0.55rem',
    background: '#f5f3ef',
    borderRadius: '4px',
    color: '#555',
    letterSpacing: '0.02em',
  },
  jobCardApply: (active: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: '0.55rem 1.1rem',
    border: 'none',
    borderTop: active ? `1px solid ${BRAND}` : '1px solid #f0ede6',
    background: active ? BRAND : '#faf8f5',
    color: active ? '#fff' : BRAND,
    fontSize: '0.75rem',
    fontWeight: 700,
    letterSpacing: '0.03em',
    textAlign: 'left' as const,
    cursor: 'pointer',
    fontFamily: FONT,
    transition: 'background .15s, color .15s',
  }),

  /* ── Detail pane ── */
  detail: {
    position: 'sticky' as const,
    top: '80px',
    background: '#fff',
    border: '1.5px solid #e8e5df',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  detailHeader: {
    padding: '1.8rem 2rem 1.4rem',
    borderBottom: '1.5px solid #e8e5df',
    background: '#faf8f5',
  },
  detailDept: {
    fontSize: '0.63rem',
    fontWeight: 700,
    letterSpacing: '0.14em',
    textTransform: 'uppercase' as const,
    color: BRAND,
    display: 'block',
    marginBottom: '0.3rem',
  },
  detailTitle: {
    fontSize: '1.25rem',
    fontWeight: 800,
    color: '#111',
    margin: '0 0 0.8rem',
    lineHeight: 1.2,
  },
  detailChips: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '0.4rem',
    marginBottom: '1.2rem',
  },
  detailChip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.3rem',
    fontSize: '0.73rem',
    fontWeight: 500,
    color: '#666',
    padding: '0.22rem 0.7rem',
    border: '1px solid #e0ddd8',
    borderRadius: '999px',
    background: '#fff',
  },
  detailApply: {
    display: 'inline-block',
    padding: '0.65rem 1.4rem',
    background: BRAND,
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.82rem',
    fontWeight: 700,
    letterSpacing: '0.04em',
    cursor: 'pointer',
    fontFamily: FONT,
  },
  detailBody: { padding: '1.5rem 2rem' },
  detailSection: { marginBottom: '1.6rem' },
  detailSectionLabel: {
    fontSize: '0.65rem',
    fontWeight: 700,
    letterSpacing: '0.13em',
    textTransform: 'uppercase' as const,
    color: '#aaa',
    margin: '0 0 0.5rem',
  },
  detailSectionText: {
    fontSize: '0.87rem',
    color: '#444',
    lineHeight: 1.8,
    margin: 0,
    whiteSpace: 'pre-line' as const,
  },
  detailDivider: {
    border: 'none',
    borderTop: '1px solid #f0ede6',
    margin: '0 0 1.4rem',
  },

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
    lineHeight: 1,
    padding: 0,
    fontFamily: FONT,
  },

  /* form */
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
    transition: 'border-color .15s',
  },
  submitBtn: (disabled: boolean): React.CSSProperties => ({
    width: '100%',
    padding: '0.88rem',
    background: disabled ? '#d4b870' : BRAND,
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

export default function Careers() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [selectedJobId, setSelectedJobId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState<ApplicationForm>(emptyForm)
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [applicationJob, setApplicationJob] = useState<Job | null>(null)

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string
  const selectedJob = useMemo(
    () => jobs.find((job) => job.id === selectedJobId) ?? jobs[0],
    [jobs, selectedJobId],
  )

  useEffect(() => { window.scrollTo({ top: 0 }) }, [])

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${API_BASE_URL}/careers/jobs`)
        if (response.ok) {
          const data = await response.json()
          setJobs(data)
          setSelectedJobId(data[0]?.id ?? '')
        }
      } catch (error) {
        console.error('Unable to load jobs', error)
      } finally {
        setLoading(false)
      }
    }
    fetchJobs()
  }, [API_BASE_URL])

  const updateField = (field: keyof ApplicationForm, value: string) =>
    setFormData((c) => ({ ...c, [field]: value }))

  const openApplicationForm = (job: Job) => {
    setApplicationJob(job)
    setSelectedJobId(job.id)
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
          <div style={S.stat}>
            <span style={S.statNum}>700+</span>
            <span style={S.statLabel}>Team Members</span>
          </div>
          <div style={S.statDiv} />
          <div style={S.stat}>
            <span style={S.statNum}>50+</span>
            <span style={S.statLabel}>Annual Hires</span>
          </div>
          <div style={S.statDiv} />
          <div style={S.stat}>
            <span style={S.statNum}>100%</span>
            <span style={S.statLabel}>Growth Culture</span>
          </div>
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
              ].map((item) => (
                <li key={item} style={S.perkItem}>
                  <span style={S.perkDot} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <img
          src={imageUrl('growthposter.jpg')}
          alt="JHS Office Culture"
          style={S.cultureImg}
          loading="lazy"
        />
      </section>

      {/* ══════════════════════════════════════
          ── REDESIGNED JOB BOARD ──
      ══════════════════════════════════════ */}
      <section style={S.boardSection} id="openings">

        {/* Editorial top bar */}
        <div style={S.boardTopBar}>
          <div>
            <span style={S.boardEyebrow}>Current Openings</span>
            <h2 style={S.boardTitle}>Find your next role at JHS</h2>
          </div>
          {!loading && (
            <span style={S.boardCount}>
              {jobs.length} active position{jobs.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {loading ? (
          <div style={S.emptyBox}>Loading current openings…</div>
        ) : jobs.length === 0 ? (
          <div style={S.emptyBox}>
            <p style={{ fontWeight: 600, color: '#444', marginBottom: '0.5rem' }}>No active openings right now</p>
            <p>Please check back soon or send your profile to <a href="mailto:hr@jhsassociates.in">hr@jhsassociates.in</a>.</p>
          </div>
        ) : (
          <div style={S.flow}>

            {/* LEFT: job list */}
            <div style={S.jobList}>
              {jobs.map((job) => {
                const active = selectedJob?.id === job.id
                return (
                  <article key={job.id} style={S.jobCard(active)}>
                    <button
                      style={S.jobCardBtn}
                      type="button"
                      onClick={() => { setSelectedJobId(job.id); setMessage('') }}
                    >
                      <span style={S.jobCardDept}>{job.department}</span>
                      <h3 style={S.jobCardTitle}>{job.title}</h3>
                      <p style={S.jobCardSummary}>{job.summary}</p>
                      <div style={S.jobCardTags}>
                        <span style={S.jobCardTag}>{job.location}</span>
                        <span style={S.jobCardTag}>{job.employment_type}</span>
                        <span style={S.jobCardTag}>{job.experience}</span>
                      </div>
                    </button>
                    <button
                      style={S.jobCardApply(active)}
                      type="button"
                      onClick={() => openApplicationForm(job)}
                    >
                      <span>Apply Now</span>
                      <span>→</span>
                    </button>
                  </article>
                )
              })}
            </div>

            {/* RIGHT: detail pane */}
            {selectedJob && (
              <div style={S.detail}>
                <div style={S.detailHeader}>
                  <span style={S.detailDept}>{selectedJob.department}</span>
                  <h3 style={S.detailTitle}>{selectedJob.title}</h3>

                  {/* Pill chips for meta */}
                  <div style={S.detailChips}>
                    <span style={S.detailChip}>📍 {selectedJob.location}</span>
                    <span style={S.detailChip}>💼 {selectedJob.employment_type}</span>
                    <span style={S.detailChip}>🗓 {selectedJob.experience}</span>
                  </div>

                  <button
                    style={S.detailApply}
                    type="button"
                    onClick={() => openApplicationForm(selectedJob)}
                  >
                    Apply for this Role →
                  </button>
                </div>

                <div style={S.detailBody}>
                  <div style={S.detailSection}>
                    <p style={S.detailSectionLabel}>Role Overview</p>
                    <p style={S.detailSectionText}>{selectedJob.description}</p>
                  </div>
                  <hr style={S.detailDivider} />
                  <div style={S.detailSection}>
                    <p style={S.detailSectionLabel}>Requirements</p>
                    <p style={{ ...S.detailSectionText, marginBottom: 0 }}>{selectedJob.requirements}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ── MODAL ── */}
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
                {/* Full Name */}
                <div style={S.formField}>
                  <label style={S.formLabel}>Full Name *</label>
                  <input
                    style={S.formInput}
                    value={formData.full_name}
                    onChange={(e) => updateField('full_name', e.target.value)}
                    placeholder="Your full name"
                    required
                  />
                </div>
                {/* Email */}
                <div style={S.formField}>
                  <label style={S.formLabel}>Email *</label>
                  <input
                    style={S.formInput}
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="your@email.com"
                    required
                  />
                </div>
                {/* Phone */}
                <div style={S.formField}>
                  <label style={S.formLabel}>Phone *</label>
                  <input
                    style={S.formInput}
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>
                {/* Location */}
                <div style={S.formField}>
                  <label style={S.formLabel}>Current Location</label>
                  <input
                    style={S.formInput}
                    value={formData.current_location}
                    onChange={(e) => updateField('current_location', e.target.value)}
                    placeholder="City, State"
                  />
                </div>
                {/* Experience */}
                <div style={S.formField}>
                  <label style={S.formLabel}>Years of Experience</label>
                  <input
                    style={S.formInput}
                    value={formData.experience_years}
                    onChange={(e) => updateField('experience_years', e.target.value)}
                    placeholder="e.g. 3 years"
                  />
                </div>
                {/* Resume upload */}
                <div style={S.formField}>
                  <label style={S.formLabel}>Resume (PDF) *</label>
                  <label style={S.uploadLabel}>
                    {resumeFile ? `✓ ${resumeFile.name}` : '📎 Upload PDF'}
                    <input
                      type="file"
                      accept="application/pdf,.pdf"
                      required
                      style={{ display: 'none' }}
                      onChange={(e) => setResumeFile(e.target.files?.[0] ?? null)}
                    />
                  </label>
                </div>
              </div>

              {/* Cover note — full width */}
              <div style={{ ...S.formField, marginBottom: '0.25rem' }}>
                <label style={S.formLabel}>Cover Note</label>
                <textarea
                  style={S.formTextarea}
                  value={formData.cover_letter}
                  onChange={(e) => updateField('cover_letter', e.target.value)}
                  placeholder="Tell us why you're a great fit for this role…"
                  rows={4}
                />
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