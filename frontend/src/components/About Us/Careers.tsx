import { Fragment, useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { imageUrl } from '../../utils/imageUrl'
import { useSiteAuth } from '../../context/SiteAuthContext'

/* ─── Types ─────────────────────────────────────────────── */
type ApplicationForm = {
  job_id: string
  full_name: string
  email: string
  phone: string
  place_of_residence: string
  highest_qualification: string
  highest_qualification_other: string
  profile: string
  profile_other: string
  current_ctc: string
  expected_ctc: string
  how_heard: string
  how_heard_detail: string
  remark: string
}

type FormErrors = Partial<Record<keyof ApplicationForm | 'resume', string>>

type JobStatus = 'draft' | 'open' | 'closed'

interface Job {
  id: string
  title: string
  department: string
  location: string
  employment_type: string
  experience: string
  description: string
  status: JobStatus
}

const emptyForm: ApplicationForm = {
  job_id: '',
  full_name: '',
  email: '',
  phone: '',
  place_of_residence: '',
  highest_qualification: '',
  highest_qualification_other: '',
  profile: '',
  profile_other: '',
  current_ctc: '',
  expected_ctc: '',
  how_heard: '',
  how_heard_detail: '',
  remark: '',
}

/* Pastel badge colors cycled by department, for a bit of visual variety
   in the roles grid (matches the reference design's per-category tinting). */
const DEPT_BADGE_COLORS = [
  { bg: '#fde8e0', fg: '#b0521e' },
  { bg: '#e3f3ea', fg: '#1f7a4d' },
  { bg: '#eee6fb', fg: '#5b3aa8' },
  { bg: '#e5f0fb', fg: '#1d5fa3' },
  { bg: '#fdeef1', fg: '#b0245c' },
]
const badgeColorFor = (department: string) => {
  let hash = 0
  for (let i = 0; i < department.length; i++) hash = (hash * 31 + department.charCodeAt(i)) >>> 0
  return DEPT_BADGE_COLORS[hash % DEPT_BADGE_COLORS.length]
}

/* ─── Constants ──────────────────────────────────────────── */
const BRAND = '#B01E2E'
const BRAND_DARK = '#8f1620'
const FONT = "'DM Sans', 'Helvetica Neue', sans-serif"

const QUALIFICATIONS = ['Graduate', 'Post Graduate', 'Pursuing CA', 'Pursuing CS', 'Others']
const PROFILES = ['CA Articles', 'CS Intern', 'Fresher', 'Semi Qualified CA', 'CS Inter', 'Qualified CA', 'Qualified CS', 'Other']
const HOW_HEARD = ['LinkedIn', 'Indeed', 'Naukri', 'Employee', 'Google', 'Social Media', 'Advertise', 'Other']

const HOW_HEARD_DETAIL_LABEL: Record<string, string> = {
  Employee: 'Employee Name',
  Google: 'Where on Google',
  'Social Media': 'Which platform',
  Advertise: 'Where did you see it',
}

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

  /* ── Roles section ── */
  .careers-roles-section { padding: 5rem 6rem !important; }
  .careers-roles-grid    { grid-template-columns: repeat(3, 1fr) !important; }

  /* ── Apply section ── */
  .careers-apply-section { padding: 4rem 4rem 5rem !important; }
  .careers-apply-card    { max-width: 760px !important; margin: 0 auto !important; }
  .careers-form-grid     { grid-template-columns: 1fr 1fr !important; }


  /* TABLET  601–900 */
  @media (max-width: 900px) {
    .careers-life-section { padding: 3.5rem 2.5rem !important; }
    .careers-life-grid    { grid-template-columns: 1fr !important; gap: 2rem !important; }
    .careers-culture-img  { height: 260px !important; }

    .careers-roles-section { padding: 3.5rem 2.5rem !important; }
    .careers-roles-grid    { grid-template-columns: repeat(2, 1fr) !important; }

    .careers-apply-section { padding: 3rem 2rem 4rem !important; }
  }

  /* MOBILE  ≤600 */
  @media (max-width: 600px) {
    .careers-hero-content { padding: 5rem 1.25rem 2rem !important; }
    .careers-stats-bar    { gap: 1.2rem !important; padding: 1.1rem 1rem !important; }
    .careers-stat-num     { font-size: 1.3rem !important; }

    .careers-life-section { padding: 2.5rem 1.25rem !important; }
    .careers-culture-img  { height: 200px !important; border-radius: 10px !important; }

    .careers-roles-section { padding: 2.5rem 1.25rem !important; }
    .careers-roles-grid    { grid-template-columns: 1fr !important; }

    .careers-apply-section { padding: 2rem 1rem 3rem !important; }
    .careers-form-grid     { grid-template-columns: 1fr !important; }
  }

  .careers-apply-btn:hover { background: ${BRAND_DARK} !important; }
`

/* ═══════════════════════════════════════════════════════════
   Component
═══════════════════════════════════════════════════════════ */
export default function Careers() {
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState<ApplicationForm>(emptyForm)
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<FormErrors>({})

  const [jobs, setJobs] = useState<Job[]>([])
  const [jobsLoading, setJobsLoading] = useState(true)
  const [jobsError, setJobsError] = useState(false)
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null)

  /* Sign-in is handled by the site-wide account system (shared AuthModal)
     rather than a Careers-specific Google flow. */
  const { user: applicant, token: careerToken, openAuthModal, logout: signOutApplicant } = useSiteAuth()

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string

  /* Prefill from the signed-in account, same as Request a Proposal / Book
     an Appointment do. */
  useEffect(() => {
    if (!applicant) return
    setFormData(c => ({ ...c, full_name: c.full_name || applicant.name, email: applicant.email }))
  }, [applicant])

  /* Fetch live open roles from the database (managed via the admin panel) */
  useEffect(() => {
    let cancelled = false
    const loadJobs = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/careers/jobs`)
        if (!res.ok) throw new Error()
        const data: Job[] = await res.json()
        if (!cancelled) setJobs(data)
      } catch {
        if (!cancelled) setJobsError(true)
      } finally {
        if (!cancelled) setJobsLoading(false)
      }
    }
    loadJobs()
    return () => { cancelled = true }
  }, [API_BASE_URL])

  const selectedJob = jobs.find(j => j.id === formData.job_id) ?? null

  const applyForJob = (jobId: string) => {
    setFormData(c => ({ ...c, job_id: jobId }))
    document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const clearJobSelection = () => setFormData(c => ({ ...c, job_id: '' }))

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

  const updateField = (f: keyof ApplicationForm, v: string) => {
    setFormData(c => ({ ...c, [f]: v }))
    if (errors[f]) setErrors(prev => ({ ...prev, [f]: undefined }))
  }

  const showQualOther = formData.highest_qualification === 'Others'
  const showProfileOther = formData.profile === 'Other'
  const showCtcFields = formData.profile !== '' && formData.profile !== 'Fresher'
  const howHeardDetailLabel = HOW_HEARD_DETAIL_LABEL[formData.how_heard]

  const validate = (): boolean => {
    const e: FormErrors = {}

    if (!formData.full_name.trim()) e.full_name = 'Full name is required'
    else if (formData.full_name.trim().length < 2) e.full_name = 'Full name must be at least 2 characters'

    if (!formData.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) e.email = 'Your email format is incorrect'

    if (!formData.phone.trim()) e.phone = 'Contact number is required'
    else if (!/^\+?[\d\s\-()]{7,20}$/.test(formData.phone.trim())) e.phone = 'Your phone number is incorrect'
    else {
      const digits = formData.phone.replace(/\D/g, '')
      if (digits.length < 10 || digits.length > 15) e.phone = 'Enter a valid contact number (10-15 digits)'
      else if (digits.length === 10 && !/^[6-9]/.test(digits)) e.phone = 'Enter a valid 10-digit mobile number'
    }

    if (!formData.highest_qualification) e.highest_qualification = 'Please select your highest qualification'
    else if (showQualOther && !formData.highest_qualification_other.trim()) e.highest_qualification_other = 'Please specify your qualification'

    if (!formData.profile) e.profile = 'Please select your profile'
    else if (showProfileOther && !formData.profile_other.trim()) e.profile_other = 'Please specify your profile'

    if (showCtcFields) {
      if (!formData.current_ctc.trim()) e.current_ctc = 'Please enter your current CTC'
      if (!formData.expected_ctc.trim()) e.expected_ctc = 'Please enter your expected CTC'
    }

    if (!formData.how_heard) e.how_heard = 'Please select an option'
    else if (howHeardDetailLabel && !formData.how_heard_detail.trim()) e.how_heard_detail = `Please provide the ${howHeardDetailLabel.toLowerCase()}`

    if (!resumeFile) e.resume = 'Resume (PDF) is required'

    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submitApplication = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!careerToken) { openAuthModal('apply for this role'); return }
    if (!validate()) return
    setSubmitting(true); setMessage('')
    try {
      const payload = new FormData()
      if (formData.job_id) payload.append('job_id', formData.job_id)
      payload.append('full_name', formData.full_name)
      payload.append('email', formData.email)
      payload.append('phone', formData.phone)
      payload.append('place_of_residence', formData.place_of_residence)
      payload.append('highest_qualification', formData.highest_qualification)
      payload.append('highest_qualification_other', showQualOther ? formData.highest_qualification_other : '')
      payload.append('profile', formData.profile)
      payload.append('profile_other', showProfileOther ? formData.profile_other : '')
      payload.append('current_ctc', showCtcFields ? formData.current_ctc : '')
      payload.append('expected_ctc', showCtcFields ? formData.expected_ctc : '')
      payload.append('how_heard', formData.how_heard)
      payload.append('how_heard_detail', howHeardDetailLabel ? formData.how_heard_detail : '')
      payload.append('cover_letter', formData.remark)
      payload.append('resume', resumeFile as File)

      const res = await fetch(`${API_BASE_URL}/careers/applications/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${careerToken}` },
        body: payload,
      })
      if (res.status === 401) { signOutApplicant(); throw new Error('unauthorized') }
      if (!res.ok) throw new Error()
      setFormData(c => ({ ...emptyForm, full_name: c.full_name, email: c.email }))
      setResumeFile(null); setErrors({})
      setMessage('Application submitted successfully. Our HR team will review it soon.')
    } catch {
      setMessage('Could not submit your application right now. Please try again.')
    } finally { setSubmitting(false) }
  }

  const inputStyle = (name: keyof FormErrors) =>
    errors[name] ? { ...ss.formInput, ...ss.formInputError } : ss.formInput

  /* ─── render ──────────────────────────────────────────── */
  return (
    <div style={{ fontFamily: FONT, color: '#1a1a1a' }}>

      {/* ══ HERO ══ */}
      <section style={ss.hero}>
        <div style={{ ...ss.heroBg, backgroundImage: `url(${imageUrl('Career-Page-Bg.png')})` }} />
        <div style={ss.heroOverlay} />
        <div className="careers-hero-content" style={ss.heroContent}>
          <p style={ss.heroEyebrow}>Join JHS</p>
          <h1 style={ss.heroTitle}>Shape What's Next</h1>
          <p style={ss.heroSub}>Build a rewarding career helping high-growth organizations reach their full potential.</p>
          <a href="#apply" style={ss.heroCta}>Apply Now ↓</a>
        </div>
        <div className="careers-stats-bar" style={ss.statsBar}>
          {[['700+', 'Team Members'], ['50+', 'Annual Hires'], ['100%', 'Growth Culture']].map(([num, lbl], i) => (
            <Fragment key={lbl}>
              {i > 0 && <div style={ss.statDiv} />}
              <div style={ss.stat}>
                <span className="careers-stat-num" style={ss.statNum}>{num}</span>
                <span style={ss.statLabel}>{lbl}</span>
              </div>
            </Fragment>
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
        <img src={imageUrl('growthposter.webp')} alt="JHS Office Culture" className="careers-culture-img" style={ss.cultureImg} loading="lazy" />
      </section>

      {/* ══ OPEN ROLES ══ */}
      <section className="careers-roles-section" style={ss.rolesSection} id="roles">
        <div style={ss.rolesHeader}>
          <div>
            <p style={ss.eyebrow}>We're Hiring</p>
            <h2 style={ss.sectionTitle}>Open Roles</h2>
          </div>
          {!jobsLoading && !jobsError && (
            <p style={ss.rolesCount}>{jobs.length} open {jobs.length === 1 ? 'position' : 'positions'}</p>
          )}
        </div>

        {jobsLoading && <p style={ss.rolesStateMsg}>Loading open roles…</p>}

        {!jobsLoading && jobsError && (
          <p style={ss.rolesStateMsg}>Couldn't load open roles right now. Please check back shortly, or apply below.</p>
        )}

        {!jobsLoading && !jobsError && jobs.length === 0 && (
          <p style={ss.rolesStateMsg}>No open positions at the moment — check back soon, or send us a general application below.</p>
        )}

        {!jobsLoading && !jobsError && jobs.length > 0 && (
          <div className="careers-roles-grid" style={ss.rolesGrid}>
            {jobs.map(job => {
              const isExpanded = expandedJobId === job.id
              const badge = badgeColorFor(job.department)
              return (
                <div key={job.id} style={ss.roleCard}>
                  <div style={ss.roleCardTop}>
                    <span style={{ ...ss.roleBadge, background: badge.bg, color: badge.fg }}>{job.department}</span>
                    <span style={ss.roleLocation}>{job.location}</span>
                  </div>
                  <h3 style={ss.roleTitle}>{job.title}</h3>
                  <div style={ss.roleTags}>
                    <span style={ss.roleTag}>{job.employment_type}</span>
                    <span style={ss.roleTag}>{job.experience}</span>
                  </div>

                  {isExpanded && (
                    <div style={ss.roleDetails}>
                      <p style={ss.roleDetailsLabel}>Role Description</p>
                      <p style={ss.roleDetailsText}>{job.description}</p>
                    </div>
                  )}

                  <div style={ss.roleCardActions}>
                    <button type="button" style={ss.roleViewBtn} onClick={() => setExpandedJobId(isExpanded ? null : job.id)}>
                      {isExpanded ? 'Hide Details' : 'View Role'}
                    </button>
                    <button type="button" className="careers-apply-btn" style={ss.roleApplyBtn} onClick={() => applyForJob(job.id)}>
                      Apply Now
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* ══ APPLY TO JOIN US ══ */}
      <section className="careers-apply-section" style={ss.applySection} id="apply">
        <div className="careers-apply-card" style={ss.applyCard}>
          <div style={ss.applyHeader}>
            <span style={ss.boardEyebrow}>Careers at JHS</span>
            <h2 style={ss.boardTitle}>Apply to Join Us</h2>
            <p style={ss.boardSub}>Tell us a bit about yourself — our HR team reviews every submission.</p>
          </div>

          {!applicant && (
            <div style={ss.authGate}>
              {selectedJob && (
                <div style={ss.jobBanner}>
                  <span>Applying for <strong>{selectedJob.title}</strong> ({selectedJob.location})</span>
                  <button type="button" style={ss.jobBannerClear} onClick={clearJobSelection}>Apply generally instead</button>
                </div>
              )}
              <p style={ss.authGateText}>Sign in to apply. We'll use your account to submit your application and let you track it.</p>
              <button type="button" style={ss.applyBtn} onClick={() => openAuthModal('apply for this role')}>Sign In / Sign Up</button>
              {message && <p style={ss.formErr}>{message}</p>}
            </div>
          )}

          {applicant && (
          <form onSubmit={submitApplication} noValidate style={{ padding: '1.4rem 1.5rem 2rem' }}>
            <div style={ss.signedInBar}>
              <span>Signed in as <strong>{applicant.email}</strong></span>
              <button type="button" style={ss.jobBannerClear} onClick={signOutApplicant}>Sign out</button>
            </div>

            {selectedJob ? (
              <div style={ss.jobBanner}>
                <span>Applying for <strong>{selectedJob.title}</strong> ({selectedJob.location})</span>
                <button type="button" style={ss.jobBannerClear} onClick={clearJobSelection}>Apply generally instead</button>
              </div>
            ) : jobs.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginBottom: '0.85rem' }}>
                <label style={ss.formLabel} htmlFor="career-job">Which role are you interested in?</label>
                <select
                  id="career-job"
                  style={ss.formInput}
                  value={formData.job_id}
                  onChange={e => updateField('job_id', e.target.value)}
                >
                  <option value="">General Application</option>
                  {jobs.map(job => <option key={job.id} value={job.id}>{job.title} — {job.location}</option>)}
                </select>
              </div>
            )}

            <div className="careers-form-grid" style={ss.formGrid}>
              {[
                { label: 'Full Name *', field: 'full_name' as const, placeholder: 'Enter your full name', type: 'text', required: true, autoComplete: 'name' },
                { label: 'Email *', field: 'email' as const, placeholder: 'Enter your email', type: 'email', required: true, autoComplete: 'email' },
                { label: 'Contact Number *', field: 'phone' as const, placeholder: 'Enter your contact number', type: 'tel', required: true, autoComplete: 'tel' },
                { label: 'Place of Residence', field: 'place_of_residence' as const, placeholder: 'City, State', type: 'text', required: false, autoComplete: 'address-level2' },
              ].map(({ label, field, placeholder, type, required, autoComplete }) => (
                <div key={field} style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <label style={ss.formLabel} htmlFor={`career-${field}`}>{label}</label>
                  <input
                    id={`career-${field}`}
                    style={field === 'email' ? { ...inputStyle(field), background: '#f4f4f2', color: '#666' } : inputStyle(field)}
                    type={type}
                    value={formData[field]}
                    onChange={e => updateField(field, e.target.value)}
                    placeholder={placeholder}
                    required={required}
                    autoComplete={autoComplete}
                    readOnly={field === 'email'}
                  />
                  {field === 'email' && <span style={{ fontSize: '0.72rem', color: '#888' }}>Verified via your Google account</span>}
                  {errors[field] && <span style={ss.formErr}>{errors[field]}</span>}
                </div>
              ))}

              {/* Highest Qualification */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <label style={ss.formLabel} htmlFor="career-qualification">Highest Qualification *</label>
                <select
                  id="career-qualification"
                  style={inputStyle('highest_qualification')}
                  value={formData.highest_qualification}
                  onChange={e => updateField('highest_qualification', e.target.value)}
                  required
                >
                  <option value="" disabled>Select an option…</option>
                  {QUALIFICATIONS.map(q => <option key={q} value={q}>{q}</option>)}
                </select>
                {errors.highest_qualification && <span style={ss.formErr}>{errors.highest_qualification}</span>}
              </div>
              {showQualOther && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <label style={ss.formLabel} htmlFor="career-qualification-other">Please specify *</label>
                  <input
                    id="career-qualification-other"
                    style={inputStyle('highest_qualification_other')}
                    type="text"
                    value={formData.highest_qualification_other}
                    onChange={e => updateField('highest_qualification_other', e.target.value)}
                    placeholder="Your qualification"
                    required
                  />
                  {errors.highest_qualification_other && <span style={ss.formErr}>{errors.highest_qualification_other}</span>}
                </div>
              )}

              {/* Profile */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <label style={ss.formLabel} htmlFor="career-profile">Profile *</label>
                <select
                  id="career-profile"
                  style={inputStyle('profile')}
                  value={formData.profile}
                  onChange={e => updateField('profile', e.target.value)}
                  required
                >
                  <option value="" disabled>Select an option…</option>
                  {PROFILES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                {errors.profile && <span style={ss.formErr}>{errors.profile}</span>}
              </div>
              {showProfileOther && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <label style={ss.formLabel} htmlFor="career-profile-other">Please specify *</label>
                  <input
                    id="career-profile-other"
                    style={inputStyle('profile_other')}
                    type="text"
                    value={formData.profile_other}
                    onChange={e => updateField('profile_other', e.target.value)}
                    placeholder="Your profile"
                    required
                  />
                  {errors.profile_other && <span style={ss.formErr}>{errors.profile_other}</span>}
                </div>
              )}

              {showCtcFields && (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    <label style={ss.formLabel} htmlFor="career-current-ctc">Current CTC *</label>
                    <input
                      id="career-current-ctc"
                      style={inputStyle('current_ctc')}
                      type="text"
                      value={formData.current_ctc}
                      onChange={e => updateField('current_ctc', e.target.value)}
                      placeholder="e.g. 6 LPA"
                      required
                    />
                    {errors.current_ctc && <span style={ss.formErr}>{errors.current_ctc}</span>}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    <label style={ss.formLabel} htmlFor="career-expected-ctc">Expected CTC *</label>
                    <input
                      id="career-expected-ctc"
                      style={inputStyle('expected_ctc')}
                      type="text"
                      value={formData.expected_ctc}
                      onChange={e => updateField('expected_ctc', e.target.value)}
                      placeholder="e.g. 8 LPA"
                      required
                    />
                    {errors.expected_ctc && <span style={ss.formErr}>{errors.expected_ctc}</span>}
                  </div>
                </>
              )}

              {/* How did you hear about us */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <label style={ss.formLabel} htmlFor="career-how-heard">How did you hear about us? *</label>
                <select
                  id="career-how-heard"
                  style={inputStyle('how_heard')}
                  value={formData.how_heard}
                  onChange={e => updateField('how_heard', e.target.value)}
                  required
                >
                  <option value="" disabled>Select an option…</option>
                  {HOW_HEARD.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
                {errors.how_heard && <span style={ss.formErr}>{errors.how_heard}</span>}
              </div>
              {howHeardDetailLabel && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <label style={ss.formLabel} htmlFor="career-how-heard-detail">{howHeardDetailLabel} *</label>
                  <input
                    id="career-how-heard-detail"
                    style={inputStyle('how_heard_detail')}
                    type="text"
                    value={formData.how_heard_detail}
                    onChange={e => updateField('how_heard_detail', e.target.value)}
                    placeholder={howHeardDetailLabel}
                    required
                  />
                  {errors.how_heard_detail && <span style={ss.formErr}>{errors.how_heard_detail}</span>}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <label style={ss.formLabel} htmlFor="career-resume">Resume (PDF) *</label>
                <label style={errors.resume ? { ...ss.uploadLabel, ...ss.uploadLabelError } : ss.uploadLabel}>
                  {resumeFile ? `✓ ${resumeFile.name}` : '📎 Upload PDF'}
                  <input
                    id="career-resume"
                    type="file"
                    accept="application/pdf,.pdf"
                    required
                    style={{ display: 'none' }}
                    onChange={e => {
                      setResumeFile(e.target.files?.[0] ?? null)
                      if (errors.resume) setErrors(prev => ({ ...prev, resume: undefined }))
                    }}
                  />
                </label>
                {errors.resume && <span style={ss.formErr}>{errors.resume}</span>}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginTop: '0.5rem' }}>
              <label style={ss.formLabel} htmlFor="career-remark">Remark</label>
              <textarea
                id="career-remark"
                style={ss.formTextarea}
                value={formData.remark}
                onChange={e => updateField('remark', e.target.value)}
                placeholder="Anything else you'd like us to know… (optional)"
                rows={4}
              />
            </div>

            <button type="submit" className="careers-apply-btn" style={{ ...ss.applyBtn, width: '100%', padding: '0.88rem', marginTop: '1rem', fontSize: '0.9rem', display: 'block', textAlign: 'center', opacity: submitting ? 0.65 : 1, cursor: submitting ? 'not-allowed' : 'pointer' }} disabled={submitting}>
              {submitting ? 'Submitting…' : 'Submit Application'}
            </button>

            {message && (
              <p style={{ fontSize: '0.85rem', fontWeight: 500, borderRadius: '8px', padding: '0.65rem 1rem', marginTop: '0.75rem', background: message.startsWith('Could') ? '#fdecea' : '#eef6ee', color: message.startsWith('Could') ? '#a63222' : '#2d6a2d' }}>
                {message}
              </p>
            )}
          </form>
          )}
        </div>
      </section>
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

  rolesSection: { padding: '5rem 6rem', background: '#fff' },
  rolesHeader: { display: 'flex', flexWrap: 'wrap' as const, alignItems: 'flex-end', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '2.2rem' },
  rolesCount: { fontSize: '0.85rem', fontWeight: 600, color: '#888', margin: 0 },
  rolesStateMsg: { fontSize: '0.95rem', color: '#777', padding: '2rem 0', margin: 0 },
  rolesGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' },

  roleCard: { display: 'flex', flexDirection: 'column' as const, background: '#faf8f5', border: '1.5px solid #eeebe4', borderRadius: '14px', padding: '1.5rem' },
  roleCardTop: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.9rem' },
  roleBadge: { fontSize: '0.7rem', fontWeight: 700, padding: '0.25rem 0.65rem', borderRadius: '999px', letterSpacing: '0.02em' },
  roleLocation: { fontSize: '0.78rem', fontWeight: 600, color: '#888' },
  roleTitle: { fontSize: '1.15rem', fontWeight: 800, color: '#111', margin: '0 0 0.5rem' },
  roleTags: { display: 'flex', flexWrap: 'wrap' as const, gap: '0.4rem', marginBottom: '1.1rem' },
  roleTag: { fontSize: '0.72rem', fontWeight: 600, color: '#666', background: '#efece5', padding: '0.25rem 0.6rem', borderRadius: '999px' },

  roleDetails: { borderTop: '1px solid #eeebe4', paddingTop: '1rem', marginBottom: '1.1rem' },
  roleDetailsLabel: { fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.05em', color: BRAND, margin: '0 0 0.3rem' },
  roleDetailsText: { fontSize: '0.85rem', color: '#555', lineHeight: 1.65, margin: '0 0 0.9rem', whiteSpace: 'pre-wrap' as const },

  roleCardActions: { display: 'flex', gap: '0.6rem', marginTop: 'auto' },
  roleViewBtn: { flex: 1, padding: '0.6rem', background: '#fff', color: '#333', border: '1.5px solid #ddd8cf', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', fontFamily: FONT },
  roleApplyBtn: { flex: 1, padding: '0.6rem', background: BRAND, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', fontFamily: FONT },

  jobBanner: { display: 'flex', flexWrap: 'wrap' as const, alignItems: 'center', justifyContent: 'space-between', gap: '0.6rem', background: '#fdf2f2', border: '1.5px solid #f6d9d9', borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.85rem', color: '#333' },
  jobBannerClear: { background: 'none', border: 'none', color: BRAND, fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', fontFamily: FONT, textDecoration: 'underline', padding: 0 },

  authGate: { display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '0.9rem', padding: '2.2rem 1.5rem 2.6rem', textAlign: 'center' as const },
  authGateText: { fontSize: '0.9rem', color: '#555', lineHeight: 1.6, margin: 0, maxWidth: '420px' },
  signedInBar: { display: 'flex', flexWrap: 'wrap' as const, alignItems: 'center', justifyContent: 'space-between', gap: '0.6rem', background: '#f2f7f2', border: '1.5px solid #dcecdc', borderRadius: '10px', padding: '0.65rem 1rem', marginBottom: '1rem', fontSize: '0.85rem', color: '#2d6a2d' },

  applySection: { padding: '4rem 4rem 5rem', background: '#f7f6f3', fontFamily: FONT },
  applyCard: { background: '#fff', borderRadius: '16px', border: '1.5px solid #e8e5df', overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.06)' },
  applyHeader: { padding: '1.6rem 1.5rem 0.4rem', borderBottom: '1px solid #f0ede6', background: '#faf8f5' },
  boardEyebrow: { fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: BRAND, margin: '0 0 0.3rem', display: 'block' },
  boardTitle: { fontSize: 'clamp(1.3rem,2.2vw,2rem)', fontWeight: 800, lineHeight: 1.1, margin: '0 0 0.3rem', color: '#111' },
  boardSub: { fontSize: '0.88rem', color: '#777', margin: '0 0 1.4rem', lineHeight: 1.55 },

  applyBtn: { padding: '0.55rem 1.15rem', background: BRAND, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', fontFamily: FONT, letterSpacing: '0.03em', whiteSpace: 'nowrap' as const, transition: 'background .15s' },

  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '0.85rem' },
  formLabel: { fontSize: '0.7rem', fontWeight: 700, color: '#777', letterSpacing: '0.04em', textTransform: 'uppercase' as const },
  formInput: { padding: '0.6rem 0.8rem', border: '1.5px solid #e0ddd6', borderRadius: '8px', fontSize: '0.875rem', color: '#222', background: '#fff', fontFamily: FONT, outline: 'none', width: '100%' },
  formInputError: { borderColor: '#dc2626', background: '#fdf2f2' },
  formErr: { fontSize: '0.75rem', fontWeight: 500, color: '#dc2626' },
  uploadLabel: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0.8rem', border: '1.5px dashed #d0ccc3', borderRadius: '8px', cursor: 'pointer', fontSize: '0.82rem', color: '#666', background: '#faf8f5' },
  uploadLabelError: { borderColor: '#dc2626', background: '#fdf2f2' },
  formTextarea: { padding: '0.6rem 0.8rem', border: '1.5px solid #e0ddd6', borderRadius: '8px', fontSize: '0.875rem', color: '#222', background: '#fff', fontFamily: FONT, resize: 'vertical' as const, outline: 'none', width: '100%', boxSizing: 'border-box' as const },
}
