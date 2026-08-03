import React, { useState, useEffect, useRef } from 'react'
import './RequestForProposal.css'
import { imageUrl } from '../utils/imageUrl'

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
  const pageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  /* ── Validation ──────────────────────────────────────── */
  const validate = (): boolean => {
    const e: FormErrors = {}

    if (!formData.first_name.trim()) e.first_name = 'First name is required'
    else if (formData.first_name.trim().length < 2) e.first_name = 'Must be at least 2 characters'

    if (!formData.last_name.trim()) e.last_name = 'Last name is required'

    if (!formData.email.trim()) e.email = 'Email address is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Enter a valid email'

    if (formData.phone && !/^[+\d\s\-()]{7,16}$/.test(formData.phone))
      e.phone = 'Enter a valid phone number'

    if (!formData.inquiry_reason) e.inquiry_reason = 'Please select an inquiry reason'

    if (!formData.subject.trim()) e.subject = 'Subject is required'
    else if (formData.subject.trim().length < 2) e.subject = 'Must be at least 2 characters'

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
    if (!validate()) return
    setLoading(true)
    setSubmitError(false)

    try {
      const response = await fetch(`${API_BASE_URL}/proposal/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Network response was not ok')

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
      setTimeout(() => setSubmitted(false), 8000)
    } catch (error) {
      console.error('Failed to submit proposal:', error)
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
        style={{ backgroundImage: `url(${imageUrl('proposalBG.jpg')})` }}
      >
        <div className="rfp-hero__overlay" />
        <div className="rfp-hero__content">
          <span className="rfp-hero__eyebrow">JHS &amp; Associates LLP</span>
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
                  Something went wrong. Please try again, or reach us directly.
                </p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="rfp-form">
            {/* Row 1: First Name + Last Name */}
            <div className="rfp-row">
              <div className="rfp-field">
                <label className="rfp-label" htmlFor="rfp-first-name">
                  First name <span className="rfp-req">*</span>
                </label>
                <input
                  id="rfp-first-name"
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  placeholder="Jane"
                  autoComplete="given-name"
                  onChange={handleChange}
                  className={inputClass('first_name', 'rfp-input')}
                />
                {errors.first_name && (
                  <span className="rfp-error">
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
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  placeholder="Doe"
                  autoComplete="family-name"
                  onChange={handleChange}
                  className={inputClass('last_name', 'rfp-input')}
                />
                {errors.last_name && (
                  <span className="rfp-error">
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
                  type="email"
                  name="email"
                  value={formData.email}
                  placeholder="jane@company.com"
                  autoComplete="email"
                  onChange={handleChange}
                  className={inputClass('email', 'rfp-input')}
                />
                {errors.email && (
                  <span className="rfp-error">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
                    {errors.email}
                  </span>
                )}
              </div>

              <div className="rfp-field">
                <label className="rfp-label" htmlFor="rfp-phone">Phone number</label>
                <input
                  id="rfp-phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  placeholder="+91 00000 00000"
                  autoComplete="tel"
                  onChange={handleChange}
                  className={inputClass('phone', 'rfp-input')}
                />
                {errors.phone && (
                  <span className="rfp-error">
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
                  <span className="rfp-error">
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
                  type="text"
                  name="subject"
                  value={formData.subject}
                  placeholder="What's this about?"
                  onChange={handleChange}
                  className={inputClass('subject', 'rfp-input')}
                />
                {errors.subject && (
                  <span className="rfp-error">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
                    {errors.subject}
                  </span>
                )}
              </div>
            </div>

            {/* Message / Additional Details */}
            <div className="rfp-field rfp-field--single">
              <label className="rfp-label" htmlFor="rfp-message">Additional details</label>
              <textarea
                id="rfp-message"
                name="message"
                value={formData.message}
                rows={5}
                placeholder="Describe your requirements, timeline, or anything specific you'd like us to know…"
                onChange={handleChange}
                className="rfp-textarea"
              />
            </div>

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
                By submitting, you agree to our privacy policy. We'll respond within one business day.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}