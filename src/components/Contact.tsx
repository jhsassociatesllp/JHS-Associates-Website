import React, { useState, useRef, useEffect } from 'react'
import './Contact.css'

/* ─── Types ─────────────────────────────────────────────── */
interface FormData {
  name: string
  email: string
  phone: string
  company: string
  service: string
  message: string
}
interface FormErrors {
  name?: string
  email?: string
  phone?: string
  message?: string
}

/* ─── Static Data ────────────────────────────────────────── */
const SERVICES = [
  'Audit & Assurance',
  'Taxation Services',
  'Consulting',
  'Outsourcing',
  'SOC Attestation',
  'Single Window Assistance',
  'Other',
]

const OFFICES = [
  {
    city: 'Mumbai',
    address: 'Navkar Chambers, B-Wing, 4th Floor, Marol Naka, Andheri East, Mumbai – 400059',
    phone: '+91 22 1234 5678',
    email: 'mumbai@jhsassociates.in',
  },
  {
    city: 'Delhi',
    address: '12th Floor, Connaught Place Tower, New Delhi – 110001',
    phone: '+91 11 4321 8765',
    email: 'delhi@jhsassociates.in',
  },
  {
    city: 'Bengaluru',
    address: 'Prestige Trade Tower, Level 8, Lavelle Road, Bengaluru – 560001',
    phone: '+91 80 6543 2109',
    email: 'bengaluru@jhsassociates.in',
  },
]

const SOCIALS = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/jhsllp',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: 'Twitter / X',
    href: 'https://twitter.com/jhsassociates',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/jhsassociates_llp/',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
]

/* ─── Component ──────────────────────────────────────────── */
export default function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: '', email: '', phone: '', company: '', service: '', message: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [focused, setFocused] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const pageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo({ top: 0 })
    const els = pageRef.current?.querySelectorAll<HTMLElement>('.ct-reveal')
    els?.forEach((el, i) => {
      el.style.opacity = '0'
      el.style.transform = 'translateY(28px)'
      setTimeout(() => {
        el.style.transition = 'opacity 0.7s cubic-bezier(0.4,0,0.2,1), transform 0.7s cubic-bezier(0.4,0,0.2,1)'
        el.style.opacity = '1'
        el.style.transform = 'translateY(0)'
      }, 80 + i * 100)
    })
  }, [])

  const validate = (): boolean => {
    const e: FormErrors = {}
    if (!formData.name.trim()) e.name = 'Name is required'
    if (!formData.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Enter a valid email'
    if (formData.phone && !/^[+\d\s\-()\\.]{7,16}$/.test(formData.phone)) e.phone = 'Enter a valid phone'
    if (!formData.message.trim()) e.message = 'Message is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormErrors]) setErrors(prev => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setLoading(false)
    setSubmitted(true)
    setFormData({ name: '', email: '', phone: '', company: '', service: '', message: '' })
    setTimeout(() => setSubmitted(false), 7000)
  }

  const fc = (name: string) => {
    let c = 'ct-input'
    if (errors[name as keyof FormErrors]) c += ' ct-input--error'
    else if (focused === name) c += ' ct-input--focused'
    return c
  }

  return (
    <div className="ct-page" ref={pageRef}>

      {/* ══════════════════════════════════════════════════
          HERO  — JHS Poster style (matches credentials PDF)
      ══════════════════════════════════════════════════ */}
      <section className="ct-hero">
        {/* Background photo */}
        <div className="ct-hero__photo" aria-hidden="true" />

        {/* Decorative coloured squares — top-right */}
        <div className="ct-hero__deco" aria-hidden="true">
          <span className="ct-sq ct-sq--gold ct-sq--lg" />
          <span className="ct-sq ct-sq--navy ct-sq--md" />
          <span className="ct-sq ct-sq--gold ct-sq--sm" />
          <span className="ct-sq ct-sq--navy ct-sq--xs" />
        </div>

        {/* White poster card — bottom center */}
        <div className="ct-hero__card">
          <span className="ct-hero__jhs">JHS</span>
          <div className="ct-hero__card-badge">Contact Us</div>
          <div className="ct-hero__card-body">
            <h1 className="ct-hero__heading">
              Let's Walk Your Journey<br />Together
            </h1>
            <p className="ct-hero__copy">
              Reach out to our specialists to identify how JHS can add the
              most value to your current stage.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          QUICK INFO STRIP
      ══════════════════════════════════════════════════ */}
      <div className="ct-strip ct-reveal">
        <div className="ct-strip__item">
          <span className="ct-strip__icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 11.5 19.79 19.79 0 0 1 1.6 2.82 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.55a16 16 0 0 0 5.55 5.55l.92-.83a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
          </span>
          <div>
            <span className="ct-strip__label">Phone</span>
            <span className="ct-strip__val">+91 22 1234 5678</span>
          </div>
        </div>
        <div className="ct-strip__divider" />
        <div className="ct-strip__item">
          <span className="ct-strip__icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
          </span>
          <div>
            <span className="ct-strip__label">Email</span>
            <span className="ct-strip__val">connect@jhsassociates.in</span>
          </div>
        </div>
        <div className="ct-strip__divider" />
        <div className="ct-strip__item">
          <span className="ct-strip__icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
          </span>
          <div>
            <span className="ct-strip__label">Business Hours</span>
            <span className="ct-strip__val">Mon–Fri 9:30 AM – 6:30 PM</span>
          </div>
        </div>
        <div className="ct-strip__divider" />
        <div className="ct-strip__item">
          <span className="ct-strip__icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
          </span>
          <div>
            <span className="ct-strip__label">Headquarters</span>
            <span className="ct-strip__val">Mumbai, India</span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          MAIN GRID
      ══════════════════════════════════════════════════ */}
      <div className="ct-container">
        <div className="ct-main">

          {/* ─── LEFT: FORM ────────────────────────────── */}
          <div className="ct-form-card ct-reveal">
            <div className="ct-form-card__hdr">
              <h2 className="ct-form-card__title">Send Us a Message</h2>
              <p className="ct-form-card__sub">We'll respond within one business day. Fields marked * are required.</p>
            </div>

            {submitted && (
              <div className="ct-success">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                <div>
                  <p className="ct-success__title">Message received!</p>
                  <p className="ct-success__sub">Our team will be in touch shortly — usually within one business day.</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="ct-form">
              {/* Row 1 */}
              <div className="ct-row">
                <div className="ct-field">
                  <label className="ct-label">Full Name *</label>
                  <input type="text" name="name" value={formData.name} placeholder="Your full name"
                    onChange={handleChange} onFocus={() => setFocused('name')} onBlur={() => setFocused(null)}
                    className={fc('name')} />
                  {errors.name && <span className="ct-err">{errors.name}</span>}
                </div>
                <div className="ct-field">
                  <label className="ct-label">Email Address *</label>
                  <input type="email" name="email" value={formData.email} placeholder="you@company.com"
                    onChange={handleChange} onFocus={() => setFocused('email')} onBlur={() => setFocused(null)}
                    className={fc('email')} />
                  {errors.email && <span className="ct-err">{errors.email}</span>}
                </div>
              </div>

              {/* Row 2 */}
              <div className="ct-row">
                <div className="ct-field">
                  <label className="ct-label">Phone Number</label>
                  <input type="tel" name="phone" value={formData.phone} placeholder="+91 98765 43210"
                    onChange={handleChange} onFocus={() => setFocused('phone')} onBlur={() => setFocused(null)}
                    className={fc('phone')} />
                  {errors.phone && <span className="ct-err">{errors.phone}</span>}
                </div>
                <div className="ct-field">
                  <label className="ct-label">Company Name</label>
                  <input type="text" name="company" value={formData.company} placeholder="Your company"
                    onChange={handleChange} onFocus={() => setFocused('company')} onBlur={() => setFocused(null)}
                    className={fc('company')} />
                </div>
              </div>

              {/* Service */}
              <div className="ct-field">
                <label className="ct-label">Service Interested In</label>
                <select name="service" value={formData.service} onChange={handleChange}
                  onFocus={() => setFocused('service')} onBlur={() => setFocused(null)} className={fc('service')}>
                  <option value="">Select a service…</option>
                  {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Message */}
              <div className="ct-field">
                <label className="ct-label">Your Message *</label>
                <textarea name="message" value={formData.message} rows={5}
                  placeholder="Describe your requirement or query…"
                  onChange={handleChange} onFocus={() => setFocused('message')} onBlur={() => setFocused(null)}
                  className={fc('message')} />
                {errors.message && <span className="ct-err">{errors.message}</span>}
              </div>

              {/* Submit */}
              <div className="ct-submit-row">
                <button type="submit" className={`ct-submit${loading ? ' ct-submit--loading' : ''}`} disabled={loading}>
                  {loading
                    ? <span className="ct-spinner" />
                    : <>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                      Send Message
                    </>
                  }
                </button>
                <p className="ct-privacy">By submitting, you agree to our Privacy Policy.</p>
              </div>
            </form>
          </div>

          {/* ─── RIGHT COLUMN ──────────────────────────── */}
          <div className="ct-right">

            {/* Map */}
            <div className="ct-map-card ct-reveal">
              <div className="ct-map-card__label">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                Our Mumbai Office
              </div>
              <div className="ct-map-wrap">
                <iframe
                  title="JHS Associates Mumbai"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.528!2d72.87870!3d19.11540!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c83b69d4c3b5%3A0x4a8d5f2f9b4e8e2a!2sNavkar%20Chambers%2C%20Marol%20Naka%2C%20Andheri%20East%2C%20Mumbai%2C%20Maharashtra%20400059!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin"
                  allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className="ct-map-footer">
                <p className="ct-map-addr">Navkar Chambers, B-Wing, 4th Floor,<br />Marol Naka, Andheri East, Mumbai – 400059</p>
                <a href="https://maps.google.com/?q=Navkar+Chambers,Marol+Naka,Andheri+East,Mumbai" target="_blank" rel="noopener noreferrer" className="ct-map-dir">
                  Get Directions
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" /></svg>
                </a>
              </div>
            </div>

            {/* Office Cards */}
            <div className="ct-offices ct-reveal">
              <h3 className="ct-offices__title">Our Offices</h3>
              {OFFICES.map(o => (
                <div key={o.city} className="ct-office-card">
                  <div className="ct-office-card__city">{o.city}</div>
                  <p className="ct-office-card__addr">{o.address}</p>
                  <div className="ct-office-card__contacts">
                    <a href={`tel:${o.phone}`} className="ct-office-card__link">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 11.5 19.79 19.79 0 0 1 1.6 2.82 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.55a16 16 0 0 0 5.55 5.55l.92-.83a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                      {o.phone}
                    </a>
                    <a href={`mailto:${o.email}`} className="ct-office-card__link">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                      {o.email}
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Social links */}
            <div className="ct-social-card ct-reveal">
              <p className="ct-social-card__label">Follow Us</p>
              <div className="ct-social-card__row">
                {SOCIALS.map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="ct-social-btn" title={s.label}>
                    {s.icon}
                    <span>{s.label}</span>
                  </a>
                ))}
              </div>
            </div>

          </div>{/* end ct-right */}
        </div>{/* end ct-main */}
      </div>{/* end ct-container */}

    </div>
  )
}
