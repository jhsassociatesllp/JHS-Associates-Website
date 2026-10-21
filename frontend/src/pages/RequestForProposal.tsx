import React, { useState, useEffect, useRef } from 'react'
import './RequestForProposal.css'
import { imageUrl } from '../utils/imageUrl'
import { useSiteAuth } from '../context/SiteAuthContext'
import { ConsentCheck, CharCount, Honeypot } from '../components/common/FormExtras'
import { useTurnstile } from '../components/common/useTurnstile'
import { LIMITS, MIN_MESSAGE, apiErrorMessage, validateEmail, validateName, validatePhone, validateText } from '../utils/formRules'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string

/* ─── Types ─────────────────────────────────────────────── */
interface FormData {
  first_name: string
  last_name: string
  email: string
  phone: string
  inquiry_reason: string
  subject: string
  message: string
}

interface FormErrors {
  first_name?: string
  last_name?: string
  email?: string
  phone?: string
  inquiry_reason?: string
  subject?: string
  message?: string
  consent?: string
}

/* ─── Static Data ────────────────────────────────────────── */
const INQUIRY_REASONS = [
  'I have an interesting news',
  'Request for services',
  'Partnership opportunity',
  'General inquiry',
  'Other',
]

/* Trust points shown as a strip between hero and form */
const ASSURANCES = [
  {
    title: 'Response within one business day',
    body: 'Every request reaches a partner-led team, not a queue.',
  },
  {
    title: 'A proposal built around your goals',
    body: 'Scoped to your requirements, timeline, and sector — not a template.',
  },
  {
    title: 'Your details stay confidential',
    body: 'Used only to prepare your proposal. Nothing more.',
  },
]

/* ─── Component ──────────────────────────────────────────── */
export default function RequestForProposal() {
  const { user, token, openAuthModal } = useSiteAuth()

  const [formData, setFormData] = useState<FormData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    inquiry_reason: '',
    subject: '',
    message: '',
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitErrorText, setSubmitErrorText] = useState('')
  const [consent, setConsent] = useState(false)
  const [honeypot, setHoneypot] = useState('')
  const turnstile = useTurnstile()
  const pageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  /* Prefill from the signed-in account, same as the Careers apply form does
     from its applicant session. */
  useEffect(() => {
    if (!user) return
    setFormData((prev) => ({
      ...prev,
      first_name: prev.first_name || user.first_name || user.name.split(' ')[0] || '',
      last_name: prev.last_name || user.last_name || user.name.split(' ').slice(1).join(' ') || '',
      email: user.email,
    }))
  }, [user])

  /* ── Validation ──────────────────────────────────────── */
  const validate = (): boolean => {
    const e: FormErrors = {
      first_name: validateName(formData.first_name, 'First name'),
      last_name: validateText(formData.last_name, 'Last name', { required: true }),
      email: validateEmail(formData.email),
      phone: validatePhone(formData.phone),
      inquiry_reason: formData.inquiry_reason ? undefined : 'Please select an inquiry reason',
      subject: validateText(formData.subject, 'Subject', { required: true, min: 2 }),
      message: validateText(formData.message, 'Details', { required: true, min: MIN_MESSAGE }),
      consent: consent ? undefined : 'Please accept the Privacy Policy to continue',
    }
    Object.keys(e).forEach((k) => { if (!e[k as keyof FormErrors]) delete e[k as keyof FormErrors] })

    setErrors(e)
    return Object.keys(e).length === 0
  }

  /* ── Handlers ────────────────────────────────────────── */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormErrors]) setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) { openAuthModal('request a proposal'); return }
    if (!validate()) return
    if (loading) return // ignore a second click while the first is still being sent
    setLoading(true)
    setSubmitError(false)
    setSubmitErrorText('')

    try {
      const response = await fetch(`${API_BASE_URL}/proposal/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...formData, consent, website: honeypot, cf_turnstile_token: turnstile.token || null }),
      })

      if (response.status === 401 || response.status === 403) {
        openAuthModal('request a proposal')
        throw new Error('Your session has expired. Please sign in again.')
      }
      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new Error(apiErrorMessage(body))
      }

      setSubmitted(true)
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        inquiry_reason: '',
        subject: '',
        message: '',
      })
      setConsent(false)
      turnstile.reset()
      setTimeout(() => setSubmitted(false), 8000)
    } catch (error) {
      setSubmitErrorText(error instanceof Error ? error.message : '')
      turnstile.reset()
      setSubmitError(true)
      setTimeout(() => setSubmitError(false), 8000)
    } finally {
      setLoading(false)
    }
  }

  const inputClass = (name: string, base: string) =>
    `${base}${errors[name as keyof FormErrors] ? ` ${base}--error` : ''}`

  /* ── Render ──────────────────────────────────────────── */
  return (
    <div className="rfp-page" ref={pageRef}>

      {/* ══════════════ HERO ══════════════ */}
      <section
        className="rfp-hero"
        style={{ backgroundImage: `url(${imageUrl('proposalBG.webp')})` }}
      >
        <div className="rfp-hero__overlay" />
        <div className="rfp-hero__content">
          <span className="rfp-hero__eyebrow">JHS</span>
          <h1 className="rfp-hero__title">
            Request a <span>Proposal</span>
          </h1>
          <p className="rfp-hero__sub">
            Tell us what you're working toward. Our team reviews every request and
            returns a proposal shaped around your requirements.
          </p>
        </div>
        <div className="rfp-hero__fade" />
      </section>

      {/* ══════════════ ASSURANCE STRIP ══════════════ */}
      <section className="rfp-assure-strip">
        {ASSURANCES.map((item, i) => (
          <div className="rfp-assure" key={i}>
            <span className="rfp-assure__mark" aria-hidden="true">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            <div>
              <p className="rfp-assure__title">{item.title}</p>
              <p className="rfp-assure__body">{item.body}</p>
            </div>
          </div>
        ))}
      </section>

      {/* ══════════════ FORM CARD ══════════════ */}
      <div className="rfp-container">
        <div className="rfp-card">
          <div className="rfp-card__accent" />

          <header className="rfp-formhead">
            {/* <span className="rfp-formhead__tag">Our approach</span> */}
            <h2 className="rfp-formhead__title">Tell us about your requirements</h2>
            <p className="rfp-formhead__sub">
              Fill in the details below and we'll get back to you within one business day.
              Fields marked <span className="rfp-req">*</span> are required.
            </p>
          </header>

          {/* Success Message */}
          {submitted && (
            <div className="rfp-success" role="status">
              <span className="rfp-success__icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </span>
              <div>
                <p className="rfp-success__title">Request submitted</p>
                <p className="rfp-success__sub">
                  Thanks for reaching out. We'll review your requirements and reply
                  within one business day.
                </p>
              </div>
            </div>
          )}

          {submitError && (
            <div className="rfp-success rfp-success--error" role="alert">
              <span className="rfp-success__icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </span>
              <div>
                <p className="rfp-success__title">Request not submitted</p>
                <p className="rfp-success__sub">
                  {submitErrorText || 'Something went wrong. Please try again, or reach us directly.'}
                </p>
              </div>
            </div>
          )}

          {/* Sign-in gate — same idea as the Careers apply form: submitting a
              request requires the unified site account, so it's captured
              before the form fields render rather than only at submit. */}
          {!user && (
            <div className="rfp-authgate">
              <p className="rfp-authgate__text">
                Sign in to request a proposal. We'll use your account to follow up and let you track this request.
              </p>
              <button type="button" className="rfp-authgate__btn" onClick={() => openAuthModal('request a proposal')}>
                Sign In / Sign Up
              </button>
            </div>
          )}

          {/* Form */}
          {user && (
          <form onSubmit={handleSubmit} noValidate className="rfp-form">
            {/* Row 1: First Name + Last Name */}
            <div className="rfp-row">
              <div className="rfp-field">
                <label className="rfp-label" htmlFor="rfp-first-name">
                  First name <span className="rfp-req">*</span>
                </label>
                <input
                  id="rfp-first-name"
                  maxLength={LIMITS.name}
                  aria-invalid={errors.first_name ? true : undefined}
                  aria-describedby={errors.first_name ? 'rfp-first-name-err' : undefined}
                  required
                  aria-required="true"
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  placeholder="Enter Your First Name"
                  autoComplete="given-name"
                  onChange={handleChange}
                  className={inputClass('first_name', 'rfp-input')}
                />
                {errors.first_name && (
                  <span id="rfp-first-name-err" className="rfp-error" role="alert">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
                    {errors.first_name}
                  </span>
                )}
              </div>

              <div className="rfp-field">
                <label className="rfp-label" htmlFor="rfp-last-name">
                  Last name <span className="rfp-req">*</span>
                </label>
                <input
                  id="rfp-last-name"
                  maxLength={LIMITS.shortText}
                  aria-invalid={errors.last_name ? true : undefined}
                  aria-describedby={errors.last_name ? 'rfp-last-name-err' : undefined}
                  required
                  aria-required="true"
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  placeholder="Enter Your Last Name"
                  autoComplete="family-name"
                  onChange={handleChange}
                  className={inputClass('last_name', 'rfp-input')}
                />
                {errors.last_name && (
                  <span id="rfp-last-name-err" className="rfp-error" role="alert">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
                    {errors.last_name}
                  </span>
                )}
              </div>
            </div>

            {/* Row 2: Email + Phone */}
            <div className="rfp-row">
              <div className="rfp-field">
                <label className="rfp-label" htmlFor="rfp-email">
                  Email address <span className="rfp-req">*</span>
                </label>
                <input
                  id="rfp-email"
                  maxLength={LIMITS.email}
                  aria-invalid={errors.email ? true : undefined}
                  aria-describedby={errors.email ? 'rfp-email-err' : undefined}
                  required
                  aria-required="true"
                  type="email"
                  name="email"
                  value={formData.email}
                  placeholder="Enter Your Email"
                  autoComplete="email"
                  onChange={handleChange}
                  className={inputClass('email', 'rfp-input')}
                />
                {errors.email && (
                  <span id="rfp-email-err" className="rfp-error" role="alert">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
                    {errors.email}
                  </span>
                )}
              </div>

              <div className="rfp-field">
                <label className="rfp-label" htmlFor="rfp-phone">Phone number</label>
                <input
                  id="rfp-phone"
                  maxLength={LIMITS.phone}
                  aria-invalid={errors.phone ? true : undefined}
                  aria-describedby={errors.phone ? 'rfp-phone-err' : undefined}
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  placeholder="Enter Phone Number"
                  autoComplete="tel"
                  onChange={handleChange}
                  className={inputClass('phone', 'rfp-input')}
                />
                {errors.phone && (
                  <span id="rfp-phone-err" className="rfp-error" role="alert">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
                    {errors.phone}
                  </span>
                )}
              </div>
            </div>

            {/* Row 3: Inquiry Reason + Subject */}
            <div className="rfp-row">
              <div className="rfp-field">
                <label className="rfp-label" htmlFor="rfp-inquiry-reason">
                  Inquiry reason <span className="rfp-req">*</span>
                </label>
                <select
                  id="rfp-inquiry-reason"
                  name="inquiry_reason"
                  value={formData.inquiry_reason}
                  onChange={handleChange}
                  className={inputClass('inquiry_reason', 'rfp-select')}
                >
                  <option value="">Select a reason…</option>
                  {INQUIRY_REASONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                {errors.inquiry_reason && (
                  <span id="rfp-inquiry-reason-err" className="rfp-error" role="alert">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
                    {errors.inquiry_reason}
                  </span>
                )}
              </div>

              <div className="rfp-field">
                <label className="rfp-label" htmlFor="rfp-subject">
                  Subject <span className="rfp-req">*</span>
                </label>
                <input
                  id="rfp-subject"
                  maxLength={LIMITS.subject}
                  aria-invalid={errors.subject ? true : undefined}
                  aria-describedby={errors.subject ? 'rfp-subject-err' : undefined}
                  required
                  aria-required="true"
                  type="text"
                  name="subject"
                  value={formData.subject}
                  placeholder="What's this about?"
                  onChange={handleChange}
                  className={inputClass('subject', 'rfp-input')}
                />
                {errors.subject && (
                  <span id="rfp-subject-err" className="rfp-error" role="alert">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
                    {errors.subject}
                  </span>
                )}
              </div>
            </div>

            {/* Message / Additional Details */}
            <div className="rfp-field rfp-field--single">
              <label className="rfp-label" htmlFor="rfp-message">Additional details <span className="rfp-req">*</span></label>
              <textarea
                id="rfp-message"
                maxLength={LIMITS.longMessage}
                aria-invalid={errors.message ? true : undefined}
                aria-describedby={errors.message ? 'rfp-message-err' : undefined}
                required
                aria-required="true"
                name="message"
                value={formData.message}
                rows={5}
                placeholder="Describe your requirements, timeline, or anything specific you'd like us to know…"
                onChange={handleChange}
                className="rfp-textarea"
              />
              <CharCount value={formData.message} max={LIMITS.longMessage} />
              {errors.message && (
                <span id="rfp-message-err" className="rfp-error" role="alert">{errors.message}</span>
              )}
            </div>

            <Honeypot value={honeypot} onChange={setHoneypot} />
            {turnstile.widget}
            <ConsentCheck id="rfp-consent" checked={consent} error={errors.consent}
              onChange={(v) => { setConsent(v); if (v && errors.consent) setErrors((prev) => ({ ...prev, consent: undefined })) }} />

            {/* Submit */}
            <div className="rfp-submit-row">
              <button
                type="submit"
                className="rfp-submit"
                disabled={loading}
              >
                {loading ? (
                  <span className="rfp-spinner" />
                ) : (
                  <>
                    <span>Submit request</span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </>
                )}
              </button>
              <p className="rfp-privacy">
                We'll respond within one business day.
              </p>
            </div>
          </form>
          )}
        </div>
      </div>
    </div>
  )
}