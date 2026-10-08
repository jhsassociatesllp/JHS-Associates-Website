import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import {
  Phone,
  ShieldCheck,
  User,
  CalendarClock,
  CheckCircle2,
  Pencil,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import { imageUrl } from '../utils/imageUrl'
import { useLeadership } from '../data/leadership'
import { useSiteAuth } from '../context/SiteAuthContext'
import './BookAppointment.css'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string

/* ─── Mobile OTP (MSG91 via our backend) ──────────────────────────
   The signed-in user asks for a code, then verifies it. A successful
   check returns a short-lived, single-use token that the booking call
   must carry — without it the server refuses to book. */
async function otpRequest(path: 'send' | 'verify', body: object, token: string) {
  const response = await fetch(`${API_BASE_URL}/otp/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  })
  const json = await response.json().catch(() => null)
  if (response.status === 401) throw new Error('session-expired')
  if (!response.ok) {
    const detail = typeof json?.detail === 'string' ? json.detail : 'Something went wrong. Please try again.'
    throw new Error(detail)
  }
  return json
}

async function sendOtp(mobile: string, token: string): Promise<void> {
  await otpRequest('send', { mobile }, token)
}

async function verifyOtp(mobile: string, otp: string, token: string): Promise<string> {
  const json = await otpRequest('verify', { mobile, otp }, token)
  return json.otp_token as string
}

async function submitAppointment(payload: AppointmentData, token: string, otpToken: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/appointments/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, 'X-OTP-Token': otpToken },
    body: JSON.stringify({
      mobile: payload.mobile,
      full_name: payload.fullName,
      email: payload.email,
      city: payload.city || null,
      message: payload.message || null,
      speciality: payload.speciality,
      partner: payload.partner || null,
      source: 'book_appointment_page',
      source_page: window.location.pathname,
    }),
  })
  if (response.status === 401) throw new Error('session-expired')
  if (response.status === 403) throw new Error('otp-required')
  if (!response.ok) throw new Error('Failed to submit appointment')
}

/* ─── Static data ─────────────────────────────────────────────── */
const SPECIALITIES = [
  'Assurance',
  'Consulting',
  'IT Assurance',
  'Taxation',
  'Outsourcing',
  'Corporate Finance',
  'Learning & Development',
  'Compliance & Governance',
  'Single Window Assistance',
  'SOC Attestation',
]


const STEP_LABELS = ['Verify Mobile', 'Your Details', 'Appointment', 'Confirm']

interface PartnerOption {
  name: string
  role: string
  location: string
  category: string
  sector: string[]
}

interface AppointmentData {
  mobile: string
  fullName: string
  email: string
  city: string
  message: string
  speciality: string
  partner: string
}

const INITIAL_DATA: AppointmentData = {
  mobile: '',
  fullName: '',
  email: '',
  city: '',
  message: '',
  speciality: '',
  partner: '',
}

const MOBILE_REGEX = /^[6-9]\d{9}$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const RESEND_SECONDS = 30

export default function BookAppointment() {
  const { user, token, openAuthModal } = useSiteAuth()
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1)
  const [data, setData] = useState<AppointmentData>(INITIAL_DATA)
  const [otp, setOtp] = useState('')
  const [otpToken, setOtpToken] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  const [bookingConfirmed, setBookingConfirmed] = useState(false)
  const [referenceId, setReferenceId] = useState('')
  const [submitError, setSubmitError] = useState(false)
  const pageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  /* Prefill from the signed-in account once they reach the details step. */
  useEffect(() => {
    if (!user) return
    setData((prev) => ({
      ...prev,
      fullName: prev.fullName || user.name,
      email: prev.email || user.email,
    }))
  }, [user])

  useEffect(() => {
    if (resendTimer <= 0) return
    const id = setTimeout(() => setResendTimer((t) => t - 1), 1000)
    return () => clearTimeout(id)
  }, [resendTimer])

  const bubbleIndex = useMemo(() => {
    if (step <= 2) return 0
    if (step === 3) return 1
    if (step === 4) return 2
    return 3
  }, [step])

  const setField = (field: keyof AppointmentData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const clearError = (key: string) => setErrors((prev) => ({ ...prev, [key]: '' }))

  /* Every partner is offered, whatever speciality is chosen. */
  const { members } = useLeadership()
  const partnerOptions: PartnerOption[] = useMemo(
    () => members.map((m) => ({ name: m.name, role: m.role, location: m.location, category: m.category, sector: m.sector })),
    [members]
  )

  const handleSpecialityChange = (speciality: string) => {
    setData((prev) => ({ ...prev, speciality }))
    if (errors.speciality) clearError('speciality')
  }

  /* ── Step 1: Mobile ─────────────────────────────────────── */
  const handleSendOtp = async (e: FormEvent) => {
    e.preventDefault()
    if (!MOBILE_REGEX.test(data.mobile)) {
      setErrors({ mobile: 'Enter a valid 10-digit mobile number' })
      return
    }
    // The OTP is only sent to a signed-in user (stops anonymous SMS abuse).
    if (!token) { openAuthModal('verify your mobile number'); return }
    setLoading(true)
    try {
      await sendOtp(data.mobile, token)
      setOtp('')
      setOtpToken('')
      setErrors({})
      setResendTimer(RESEND_SECONDS)
      setStep(2)
    } catch (error) {
      if (error instanceof Error && error.message === 'session-expired') openAuthModal('verify your mobile number')
      else setErrors({ mobile: error instanceof Error ? error.message : 'Could not send the OTP. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  /* ── Step 2: OTP ────────────────────────────────────────── */
  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault()
    if (!/^\d{6}$/.test(otp)) {
      setErrors({ otp: 'Enter the 6-digit code' })
      return
    }
    if (!token) { openAuthModal('verify your mobile number'); return }
    setLoading(true)
    try {
      const verified = await verifyOtp(data.mobile, otp, token)
      setOtpToken(verified)
      clearError('otp')
      setStep(3)
    } catch (error) {
      if (error instanceof Error && error.message === 'session-expired') openAuthModal('verify your mobile number')
      else setErrors({ otp: error instanceof Error ? error.message : 'Invalid OTP. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (resendTimer > 0 || !token) return
    setLoading(true)
    try {
      await sendOtp(data.mobile, token)
      setOtp('')
      setErrors({})
      setResendTimer(RESEND_SECONDS)
    } catch (error) {
      setErrors({ otp: error instanceof Error ? error.message : 'Could not resend the OTP. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  /* ── Step 3: Personal details ──────────────────────────── */
  const handleDetailsSubmit = (e: FormEvent) => {
    e.preventDefault()
    const e2: Record<string, string> = {}
    if (!data.fullName.trim()) e2.fullName = 'Full name is required'
    if (!data.email.trim()) e2.email = 'Email address is required'
    else if (!EMAIL_REGEX.test(data.email)) e2.email = 'Enter a valid email'
    setErrors(e2)
    if (Object.keys(e2).length === 0) setStep(4)
  }

  /* ── Step 4: Appointment preferences ───────────────────── */
  const handlePreferencesSubmit = (e: FormEvent) => {
    e.preventDefault()
    const e2: Record<string, string> = {}
    if (!data.speciality) e2.speciality = 'Please select a speciality'
    setErrors(e2)
    if (Object.keys(e2).length === 0) setStep(5)
  }

  /* ── Step 5: Confirm ────────────────────────────────────── */
  const handleConfirm = async () => {
    if (!token) { openAuthModal('book an appointment'); return }
    setLoading(true)
    setSubmitError(false)
    try {
      await submitAppointment(data, token, otpToken)
      setReferenceId(`JHS-${Date.now().toString().slice(-8)}`)
      setBookingConfirmed(true)
    } catch (error) {
      if (error instanceof Error && error.message === 'session-expired') {
        openAuthModal('book an appointment')
      } else if (error instanceof Error && error.message === 'otp-required') {
        // verification missing / expired / already used — verify the mobile again
        setOtpToken('')
        setOtp('')
        setErrors({ mobile: 'Please verify your mobile number again to complete the booking.' })
        setStep(1)
      } else {
        console.error('Failed to submit appointment:', error)
        setSubmitError(true)
      }
    } finally {
      setLoading(false)
    }
  }

  const resetAll = () => {
    setData(INITIAL_DATA)
    setOtp('')
    setOtpToken('')
    setErrors({})
    setBookingConfirmed(false)
    setStep(1)
  }

  const goBack = () => {
    if (step === 2) setStep(1)
    else if (step === 3) setStep(2)
    else if (step === 4) setStep(3)
    else if (step === 5) setStep(4)
  }

  return (
    <div className="bap-page" ref={pageRef}>
      {/* ════ HERO ════ */}
      <section className="bap-hero" style={{ backgroundImage: `url(${imageUrl('Consulting.webp')})` }}>
        <div className="bap-hero__overlay" />
        <div className="bap-hero__inner">
          <p className="bap-hero__eyebrow">Home <span aria-hidden="true">/</span> Appointments</p>
          <h1 className="bap-hero__title">Book an appointment</h1>
          <p className="bap-hero__sub">
            Tell us what you need and we&rsquo;ll match you with the right partner. Our team will call you to confirm a time that suits you.
          </p>
        </div>
      </section>

      <div className="bap-container">
        <div className="bap-layout">
        <aside className="bap-aside">
          <h2 className="bap-aside__title">How it works</h2>
          <ol className="bap-aside__steps">
            <li>
              <span className="bap-aside__num">01</span>
              <div>
                <strong>Verify your mobile</strong>
                <p>A one-time code confirms it&rsquo;s really you.</p>
              </div>
            </li>
            <li>
              <span className="bap-aside__num">02</span>
              <div>
                <strong>Choose speciality &amp; partner</strong>
                <p>Pick the area you need help with and, if you like, a specific partner.</p>
              </div>
            </li>
            <li>
              <span className="bap-aside__num">03</span>
              <div>
                <strong>We confirm by phone</strong>
                <p>Our team calls you to fix the final schedule.</p>
              </div>
            </li>
          </ol>
          <div className="bap-aside__help">
            <span className="bap-aside__help-label">Prefer to talk to someone?</span>
            <a className="bap-aside__phone" href="tel:18001201022">1800 120 1022</a>
            <a className="bap-aside__mail" href="mailto:connect@jhsassociates.in">connect@jhsassociates.in</a>
          </div>
        </aside>

        <div className="bap-card">
          {!user ? (
            <div className="bap-authgate">
              <span className="bap-formhead__icon"><ShieldCheck size={22} /></span>
              <h2>Sign in to book an appointment</h2>
              <p>Sign in or create a free account so we know who to confirm this booking with.</p>
              <button type="button" className="bap-btn bap-btn--primary" onClick={() => openAuthModal('book an appointment')}>
                Sign In / Sign Up
              </button>
            </div>
          ) : (
          <>
          {!bookingConfirmed && (
            <div className="bap-stepper" aria-label="Booking progress">
              {STEP_LABELS.map((label, idx) => (
                <div key={label} className="bap-stepper__item">
                  <div
                    className={`bap-stepper__dot ${idx < bubbleIndex ? 'bap-stepper__dot--done' : ''} ${idx === bubbleIndex ? 'bap-stepper__dot--active' : ''}`}
                  >
                    {idx < bubbleIndex ? <CheckCircle2 size={16} /> : idx + 1}
                  </div>
                  <span className="bap-stepper__label">{label}</span>
                  {idx < STEP_LABELS.length - 1 && (
                    <div className={`bap-stepper__line ${idx < bubbleIndex ? 'bap-stepper__line--done' : ''}`} />
                  )}
                </div>
              ))}
            </div>
          )}

          {bookingConfirmed ? (
            <div className="bap-success">
              <span className="bap-success__icon">
                <CheckCircle2 size={40} />
              </span>
              <h2>Appointment Requested</h2>
              <p className="bap-success__sub">
                Thank you, {data.fullName.split(' ')[0]}. Your request has been received and our team will call you
                on +91 {data.mobile} shortly to confirm the final schedule.
              </p>

              <div className="bap-success__summary">
                <div>
                  <span className="bap-success__label">Reference ID</span>
                  <span className="bap-success__value">{referenceId}</span>
                </div>
                <div>
                  <span className="bap-success__label">Speciality</span>
                  <span className="bap-success__value">{data.speciality}</span>
                </div>
                <div>
                  <span className="bap-success__label">Partner</span>
                  <span className="bap-success__value">{data.partner || 'Any available partner'}</span>
                </div>
              </div>

              <button type="button" className="bap-btn bap-btn--outline" onClick={resetAll}>
                Book Another Appointment
              </button>
            </div>
          ) : (
            <>
              {/* ── Step 1: Mobile number ── */}
              {step === 1 && (
                <form className="bap-form" onSubmit={handleSendOtp} noValidate>
                  <header className="bap-formhead">
                    <span className="bap-formhead__icon"><Phone size={22} /></span>
                    <h2>Verify your mobile number</h2>
                    <p>We'll send a one-time password to confirm it's really you.</p>
                  </header>

                  <div className="bap-field">
                    <label className="bap-label" htmlFor="bap-mobile">
                      Mobile number <span className="bap-req">*</span>
                    </label>
                    <div className={`bap-phone-input ${errors.mobile ? 'bap-phone-input--error' : ''}`}>
                      <span className="bap-phone-prefix">+91</span>
                      <input
                        id="bap-mobile"
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        placeholder="Enter Your Number"
                        autoComplete="tel-national"
                        value={data.mobile}
                        onChange={(e) => setField('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))}
                      />
                    </div>
                    {errors.mobile && (
                      <span className="bap-error"><AlertCircle size={13} />{errors.mobile}</span>
                    )}
                  </div>

                  <button type="submit" className="bap-btn bap-btn--primary bap-btn--block" disabled={loading}>
                    {loading ? <Loader2 size={18} className="bap-spin" /> : <>Send OTP <ChevronRight size={16} /></>}
                  </button>
                </form>
              )}

              {/* ── Step 2: OTP ── */}
              {step === 2 && (
                <form className="bap-form" onSubmit={handleVerifyOtp} noValidate>
                  <header className="bap-formhead">
                    <span className="bap-formhead__icon"><ShieldCheck size={22} /></span>
                    <h2>Enter the OTP</h2>
                    <p>
                      A 6-digit code was sent to +91 {data.mobile}.{' '}
                      <button type="button" className="bap-link" onClick={() => setStep(1)}>Change number</button>
                    </p>
                  </header>

                  <div className="bap-field">
                    <label className="bap-label" htmlFor="bap-otp">One-time password <span className="bap-req">*</span></label>
                    <input
                      id="bap-otp"
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="••••••"
                      className={`bap-otp-input ${errors.otp ? 'bap-input--error' : ''}`}
                      value={otp}
                      onChange={(e) => {
                        setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))
                        if (errors.otp) clearError('otp')
                      }}
                    />
                    {errors.otp && <span className="bap-error"><AlertCircle size={13} />{errors.otp}</span>}
                    <p className="bap-hint">We sent a 6-digit code by SMS to +91 {data.mobile}. It is valid for 5 minutes.</p>
                  </div>

                  <div className="bap-resend">
                    {resendTimer > 0 ? (
                      <span>Resend OTP in 00:{resendTimer.toString().padStart(2, '0')}</span>
                    ) : (
                      <button type="button" className="bap-link" onClick={handleResendOtp} disabled={loading}>
                        Resend OTP
                      </button>
                    )}
                  </div>

                  <button type="submit" className="bap-btn bap-btn--primary bap-btn--block" disabled={loading}>
                    {loading ? <Loader2 size={18} className="bap-spin" /> : <>Verify &amp; Continue <ChevronRight size={16} /></>}
                  </button>
                </form>
              )}
 
              {/* ── Step 3: Personal details ── */}
              {step === 3 && (
                <form className="bap-form" onSubmit={handleDetailsSubmit} noValidate>
                  <header className="bap-formhead">
                    <span className="bap-formhead__icon"><User size={22} /></span>
                    <h2>Your details</h2>
                    <p>Tell us a little about yourself so we can prepare for the consultation.</p>
                  </header>

                  <div className="bap-field">
                    <label className="bap-label" htmlFor="bap-name">Full name <span className="bap-req">*</span></label>
                    <input
                      id="bap-name"
                      type="text"
                      className={`bap-input ${errors.fullName ? 'bap-input--error' : ''}`}
                      placeholder="Enter Your Name"
                      value={data.fullName}
                      onChange={(e) => setField('fullName', e.target.value)}
                    />
                    {errors.fullName && <span className="bap-error"><AlertCircle size={13} />{errors.fullName}</span>}
                  </div>

                  <div className="bap-row">
                    <div className="bap-field">
                      <label className="bap-label" htmlFor="bap-email">Email address <span className="bap-req">*</span></label>
                      <input
                        id="bap-email"
                        type="email"
                        className={`bap-input ${errors.email ? 'bap-input--error' : ''}`}
                        placeholder="Enter Your Mail"
                        value={data.email}
                        onChange={(e) => setField('email', e.target.value)}
                      />
                      {errors.email && <span className="bap-error"><AlertCircle size={13} />{errors.email}</span>}
                    </div>

                    <div className="bap-field">
                      <label className="bap-label" htmlFor="bap-city">City</label>
                      <input
                        id="bap-city"
                        type="text"
                        className="bap-input"
                        placeholder="Enter Your City"
                        value={data.city}
                        onChange={(e) => setField('city', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="bap-field">
                    <label className="bap-label" htmlFor="bap-message">What would you like to discuss?</label>
                    <textarea
                      id="bap-message"
                      rows={4}
                      className="bap-textarea"
                      placeholder="Briefly describe your requirement..."
                      value={data.message}
                      onChange={(e) => setField('message', e.target.value)}
                    />
                  </div>

                  <div className="bap-btn-row">
                    <button type="button" className="bap-btn bap-btn--ghost" onClick={goBack}>
                      <ChevronLeft size={16} /> Back
                    </button>
                    <button type="submit" className="bap-btn bap-btn--primary">
                      Continue <ChevronRight size={16} />
                    </button>
                  </div>
                </form>
              )}

              {/* ── Step 4: Appointment preferences ── */}
              {step === 4 && (
                <form className="bap-form" onSubmit={handlePreferencesSubmit} noValidate>
                  <header className="bap-formhead">
                    <span className="bap-formhead__icon"><CalendarClock size={22} /></span>
                    <h2>Appointment details</h2>
                    <p>Choose a speciality and, if you like, a preferred partner. Our team will call you to fix the schedule.</p>
                  </header>

                  <div className="bap-row">
                    <div className="bap-field">
                      <label className="bap-label" htmlFor="bap-speciality">Speciality <span className="bap-req">*</span></label>
                      <select
                        id="bap-speciality"
                        className={`bap-select ${errors.speciality ? 'bap-input--error' : ''}`}
                        value={data.speciality}
                        onChange={(e) => handleSpecialityChange(e.target.value)}
                      >
                        <option value="">Select a speciality…</option>
                        {SPECIALITIES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      {errors.speciality && <span className="bap-error"><AlertCircle size={13} />{errors.speciality}</span>}
                    </div>

                    <div className="bap-field">
                      <label className="bap-label" htmlFor="bap-partner">Preferred partner</label>
                      <select
                        id="bap-partner"
                        className="bap-select"
                        value={data.partner}
                        onChange={(e) => setField('partner', e.target.value)}
                      >
                        <option value="">Any available partner</option>
                        {Array.from(new Set(partnerOptions.map((p) => p.category))).map((category) => (
                          <optgroup key={category} label={category}>
                            {partnerOptions.filter((p) => p.category === category).map((p) => (
                              <option key={p.name} value={p.name}>
                                {p.name} — {p.location}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="bap-btn-row">
                    <button type="button" className="bap-btn bap-btn--ghost" onClick={goBack}>
                      <ChevronLeft size={16} /> Back
                    </button>
                    <button type="submit" className="bap-btn bap-btn--primary">
                      Review Booking <ChevronRight size={16} />
                    </button>
                  </div>
                </form>
              )}

              {/* ── Step 5: Review & confirm ── */}
              {step === 5 && (
                <div className="bap-form">
                  <header className="bap-formhead">
                    <span className="bap-formhead__icon"><CheckCircle2 size={22} /></span>
                    <h2>Review &amp; confirm</h2>
                    <p>Please check the details below before confirming your appointment.</p>
                  </header>

                  <div className="bap-review">
                    <div className="bap-review__section">
                      <div className="bap-review__head">
                        <h3>Contact</h3>
                        <button type="button" className="bap-edit" onClick={() => setStep(1)}><Pencil size={13} /> Edit</button>
                      </div>
                      <dl>
                        <div><dt>Mobile</dt><dd>+91 {data.mobile} <span className="bap-verified"><ShieldCheck size={13} /> Verified</span></dd></div>
                        <div><dt>Name</dt><dd>{data.fullName}</dd></div>
                        <div><dt>Email</dt><dd>{data.email}</dd></div>
                        {data.city && <div><dt>City</dt><dd>{data.city}</dd></div>}
                      </dl>
                    </div>

                    <div className="bap-review__section">
                      <div className="bap-review__head">
                        <h3>Appointment</h3>
                        <button type="button" className="bap-edit" onClick={() => setStep(4)}><Pencil size={13} /> Edit</button>
                      </div>
                      <dl>
                        <div><dt>Speciality</dt><dd>{data.speciality}</dd></div>
                        <div><dt>Partner</dt><dd>{data.partner || 'Any available partner'}</dd></div>
                        {data.message && <div><dt>Notes</dt><dd>{data.message}</dd></div>}
                      </dl>
                    </div>
                  </div>

                  {submitError && (
                    <p className="bap-error" style={{ marginBottom: 14 }}>
                      <AlertCircle size={13} /> Something went wrong submitting your appointment. Please try again.
                    </p>
                  )}

                  <div className="bap-btn-row">
                    <button type="button" className="bap-btn bap-btn--ghost" onClick={goBack} disabled={loading}>
                      <ChevronLeft size={16} /> Back
                    </button>
                    <button type="button" className="bap-btn bap-btn--primary" onClick={handleConfirm} disabled={loading}>
                      {loading ? <Loader2 size={18} className="bap-spin" /> : <>Confirm Appointment <ChevronRight size={16} /></>}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
          </>
          )}
        </div>
        </div>
      </div>
    </div>
  )
}
