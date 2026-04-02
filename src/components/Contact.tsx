import React, { useState, useEffect, useRef } from 'react'
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, AlertCircle, ArrowUpRight, MessageSquare } from 'lucide-react'
import './Contact.css'

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

const CONTACT_INFO = [
  {
    icon: <MapPin size={16} strokeWidth={1.5} />,
    label: 'Our Office',
    lines: ['Navkar Chambers, B-Wing, 4th Floor', 'Marol Naka Metro Station,', 'Andheri East, Mumbai – 400059'],
  },
  {
    icon: <Phone size={16} strokeWidth={1.5} />,
    label: 'Phone',
    lines: ['+91 22 1234 5678', '+91 22 8765 4321'],
  },
  {
    icon: <Mail size={16} strokeWidth={1.5} />,
    label: 'Email',
    lines: ['connect@jhsassociates.in'],
  },
  {
    icon: <Clock size={16} strokeWidth={1.5} />,
    label: 'Business Hours',
    lines: ['Mon – Fri: 9:30 AM – 6:30 PM', 'Saturday: 9:30 AM – 2:00 PM', 'Sunday: Closed'],
  },
]

const SOCIALS = [
  {
    href: 'https://www.linkedin.com/in/jhsllp',
    label: 'LinkedIn',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    href: 'https://www.facebook.com/JHSAssociatesLLP',
    label: 'Facebook',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    href: 'https://www.instagram.com/jhsassociates_llp/',
    label: 'Instagram',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
      </svg>
    ),
  },
]

const SERVICES = [
  'Taxation',
  'Audit & Assurance',
  'Consulting',
  'Outsourcing',
  'International Tax',
  'SOC Attestation',
  'Other',
]

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: '', email: '', phone: '', company: '', service: '', message: '',
  })
  const [errors, setErrors]       = useState<FormErrors>({})
  const [focused, setFocused]     = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading]     = useState(false)
  const pageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    // Staggered fade-in without GSAP dep (keeps it self-contained)
    const els = pageRef.current?.querySelectorAll<HTMLElement>('.ct-fade')
    els?.forEach((el, i) => {
      el.style.opacity = '0'
      el.style.transform = 'translateY(32px)'
      setTimeout(() => {
        el.style.transition = 'opacity 0.7s cubic-bezier(0.4,0,0.2,1), transform 0.7s cubic-bezier(0.4,0,0.2,1)'
        el.style.opacity = '1'
        el.style.transform = 'translateY(0)'
      }, 100 + i * 110)
    })
  }, [])

  const validate = (): boolean => {
    const e: FormErrors = {}
    if (!formData.name.trim())    e.name    = 'Name is required'
    if (!formData.email.trim())   e.email   = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Enter a valid email'
    if (formData.phone && !/^[+\d\s\-()\\.]{7,16}$/.test(formData.phone)) e.phone = 'Enter a valid phone number'
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
    await new Promise(r => setTimeout(r, 900)) // simulate API
    setLoading(false)
    setSubmitted(true)
    setFormData({ name: '', email: '', phone: '', company: '', service: '', message: '' })
    setTimeout(() => setSubmitted(false), 6000)
  }

  const fieldClass = (name: string) => {
    let c = 'ct-input'
    if (errors[name as keyof FormErrors]) c += ' ct-input--error'
    else if (focused === name)            c += ' ct-input--focus'
    return c
  }

  return (
    <div className="ct-page" ref={pageRef}>

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section className="ct-hero ct-fade">
        <div className="ct-hero__inner">
          <p className="ct-hero__eyebrow">
            <MessageSquare size={12} strokeWidth={1.5} />
            Get In Touch
          </p>
          <h1 className="ct-hero__title">
            Let's Start a<br /><em>Conversation</em>
          </h1>
          <p className="ct-hero__sub">
            Reach out to JHS &amp; Associates for expert guidance on taxation, assurance,
            consulting, and more. Our team responds within one business day.
          </p>
          {/* Quick info pills */}
          <div className="ct-hero__pills">
            <span className="ct-hero__pill"><Phone size={11} strokeWidth={1.5} /> +91 22 1234 5678</span>
            <span className="ct-hero__pill"><Mail size={11} strokeWidth={1.5} /> connect@jhsassociates.in</span>
            <span className="ct-hero__pill"><Clock size={11} strokeWidth={1.5} /> Mon–Fri, 9:30–6:30</span>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          MAIN GRID
      ══════════════════════════════════════ */}
      <div className="ct-main container">

        {/* ── LEFT: CONTACT FORM ── */}
        <div className="ct-fade">
          <div className="ct-card">
            <div className="ct-card__accent" />
            <div className="ct-card__body">

              <div className="ct-form-hd">
                <h2 className="ct-form-hd__title">Send Us a Message</h2>
                <p className="ct-form-hd__sub">Fields marked * are required. We reply within 24 hrs.</p>
              </div>

              {/* Success toast */}
              {submitted && (
                <div className="ct-success">
                  <CheckCircle size={18} strokeWidth={1.5} />
                  <div>
                    <p className="ct-success__title">Message sent successfully!</p>
                    <p className="ct-success__sub">Our team will get back to you within one business day.</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="ct-form">

                {/* Row 1 */}
                <div className="ct-row">
                  <div className="ct-field">
                    <label className="ct-label">Full Name *</label>
                    <input
                      type="text" name="name" value={formData.name}
                      placeholder="Your full name"
                      onChange={handleChange}
                      onFocus={() => setFocused('name')}
                      onBlur={() => setFocused(null)}
                      className={fieldClass('name')}
                    />
                    {errors.name && <span className="ct-err"><AlertCircle size={11} />{errors.name}</span>}
                  </div>
                  <div className="ct-field">
                    <label className="ct-label">Email Address *</label>
                    <input
                      type="email" name="email" value={formData.email}
                      placeholder="you@company.com"
                      onChange={handleChange}
                      onFocus={() => setFocused('email')}
                      onBlur={() => setFocused(null)}
                      className={fieldClass('email')}
                    />
                    {errors.email && <span className="ct-err"><AlertCircle size={11} />{errors.email}</span>}
                  </div>
                </div>

                {/* Row 2 */}
                <div className="ct-row">
                  <div className="ct-field">
                    <label className="ct-label">Phone Number</label>
                    <input
                      type="tel" name="phone" value={formData.phone}
                      placeholder="+91 98765 43210"
                      onChange={handleChange}
                      onFocus={() => setFocused('phone')}
                      onBlur={() => setFocused(null)}
                      className={fieldClass('phone')}
                    />
                    {errors.phone && <span className="ct-err"><AlertCircle size={11} />{errors.phone}</span>}
                  </div>
                  <div className="ct-field">
                    <label className="ct-label">Company Name</label>
                    <input
                      type="text" name="company" value={formData.company}
                      placeholder="Your company"
                      onChange={handleChange}
                      onFocus={() => setFocused('company')}
                      onBlur={() => setFocused(null)}
                      className={fieldClass('company')}
                    />
                  </div>
                </div>

                {/* Service */}
                <div className="ct-field ct-field--full">
                  <label className="ct-label">Service Interested In</label>
                  <select
                    name="service" value={formData.service}
                    onChange={handleChange}
                    onFocus={() => setFocused('service')}
                    onBlur={() => setFocused(null)}
                    className={fieldClass('service')}
                  >
                    <option value="">Select a service...</option>
                    {SERVICES.map(s => (
                      <option key={s} value={s.toLowerCase().replace(/\s+/g, '-')}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div className="ct-field ct-field--full">
                  <label className="ct-label">Your Message *</label>
                  <textarea
                    name="message" value={formData.message} rows={5}
                    placeholder="Describe your requirement or query briefly..."
                    onChange={handleChange}
                    onFocus={() => setFocused('message')}
                    onBlur={() => setFocused(null)}
                    className={fieldClass('message')}
                  />
                  {errors.message && <span className="ct-err"><AlertCircle size={11} />{errors.message}</span>}
                </div>

                {/* Submit row */}
                <div className="ct-submit-row">
                  <button type="submit" className={`ct-submit${loading ? ' ct-submit--loading' : ''}`} disabled={loading}>
                    {loading
                      ? <span className="ct-spinner" />
                      : <><Send size={14} strokeWidth={2} /> Send Message</>
                    }
                  </button>
                  <p className="ct-privacy">By submitting, you agree to our Privacy Policy.</p>
                </div>

              </form>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="ct-right">

          {/* Map */}
          <div className="ct-card ct-fade">
            <div className="ct-card__accent" />
            <div className="ct-map-label">
              <MapPin size={12} strokeWidth={1.5} />
              Find Us Here
            </div>
            <div className="ct-map-wrap">
              <iframe
                title="JHS & Associates LLP – Navkar Chambers, Marol Naka"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.528!2d72.87870!3d19.11540!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c83b69d4c3b5%3A0x4a8d5f2f9b4e8e2a!2sNavkar%20Chambers%2C%20Marol%20Naka%2C%20Andheri%20East%2C%20Mumbai%2C%20Maharashtra%20400059!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="ct-map-footer">
              <p className="ct-map-addr">
                Navkar Chambers, B-Wing, 4th Floor<br />
                Marol Naka, Andheri East, Mumbai – 400059
              </p>
              <a
                href="https://maps.google.com/?q=Navkar+Chambers,Marol+Naka,Andheri+East,Mumbai+400059"
                target="_blank"
                rel="noopener noreferrer"
                className="ct-map-dir"
              >
                Get Directions <ArrowUpRight size={13} />
              </a>
            </div>
          </div>

          {/* Info card */}
          <div className="ct-card ct-fade">
            <div className="ct-card__accent" />
            <div className="ct-card__body">
              <p className="ct-info-hd">Contact Information</p>
              <div className="ct-info-list">
                {CONTACT_INFO.map((item) => (
                  <div key={item.label} className="ct-info-row">
                    <div className="ct-info-icon">{item.icon}</div>
                    <div>
                      <p className="ct-info-label">{item.label}</p>
                      {item.lines.map((line, i) => (
                        <p key={i} className="ct-info-value">{line}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Socials */}
              <div className="ct-socials-wrap">
                <p className="ct-socials-label">Connect With Us</p>
                <div className="ct-socials">
                  {SOCIALS.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="ct-social-btn"
                      title={s.label}
                    >
                      {s.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  )
}