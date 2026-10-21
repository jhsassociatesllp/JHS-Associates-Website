import { useEffect, useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useSiteAuth } from '../context/SiteAuthContext'
import {
  EVENT_TYPES_ACCENT,
  downloadCalendarFile,
  formatDate,
  formatTime,
  formatWeekday,
  registerForEvent,
  useEvent,
  type RegistrationInput,
  type RegistrationResult,
} from '../data/events'
import './Events.css'

const EMPTY: RegistrationInput = { name: '', email: '', phone: '', organization: '', designation: '', city: '', consent: false, website: '' }

type Errors = Partial<Record<keyof RegistrationInput, string>>

function validate(f: RegistrationInput): Errors {
  const e: Errors = {}
  if (f.name.trim().length < 2) e.name = 'Please enter your full name'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = 'Please enter a valid email address'
  if (!/^\+?[0-9][0-9\s\-()]{6,19}$/.test(f.phone.trim())) e.phone = 'Please enter a valid phone number'
  if (!f.consent) e.consent = 'Please confirm to continue'
  return e
}

export default function EventDetail() {
  const { id } = useParams()
  const { event, status, setEvent } = useEvent(id)
  const { user } = useSiteAuth()
  const [form, setForm] = useState<RegistrationInput>(EMPTY)
  const [errors, setErrors] = useState<Errors>({})
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [done, setDone] = useState<RegistrationResult | null>(null)

  useEffect(() => { window.scrollTo({ top: 0 }) }, [id])

  // signed-in visitors get their name and email filled in
  useEffect(() => {
    if (user) setForm((f) => ({ ...f, name: f.name || user.name || '', email: f.email || user.email || '' }))
  }, [user])

  const set = (key: keyof RegistrationInput, value: string | boolean) => {
    setForm((f) => ({ ...f, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!event) return
    const found = validate(form)
    setErrors(found)
    if (Object.keys(found).length) return
    setSubmitting(true)
    setFormError('')
    try {
      const result = await registerForEvent(event.id, form)
      setDone(result)
      setEvent(result.event)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (status === 'loading') return <div className="ev-page"><div className="ev-center">Loading event…</div></div>
  if (status !== 'ready' || !event) {
    return (
      <div className="ev-page">
        <div className="ev-center">
          <h1>{status === 'missing' ? 'Event not found' : 'We couldn’t load this event'}</h1>
          <p>{status === 'missing' ? 'This event may have ended or been removed.' : 'Please try again shortly.'}</p>
          <Link to="/events" className="ev-btn ev-btn--primary">See all events</Link>
        </div>
      </div>
    )
  }

  const accent = EVENT_TYPES_ACCENT[event.event_type] ?? EVENT_TYPES_ACCENT.Other
  const isFull = event.capacity > 0 && event.registered >= event.capacity

  return (
    <div className="ev-page" style={{ ['--accent' as string]: accent }}>
      <section className="ev-hero ev-hero--detail">
        <div className="ev-hero__inner">
          <p className="ev-hero__crumb"><Link to="/">Home</Link> <span aria-hidden="true">/</span> <Link to="/events">Events</Link></p>
          <div className="ev-hero__tags">
            <span className="ev-chip ev-chip--type">{event.event_type}</span>
            <span className="ev-chip">{event.mode}</span>
            {event.state === 'live' && <span className="ev-chip ev-chip--live">Live now</span>}
            {event.state === 'past' && <span className="ev-chip">Completed</span>}
          </div>
          <h1>{event.title}</h1>
          {event.summary && <p className="ev-hero__sub">{event.summary}</p>}
        </div>
      </section>

      <section className="ev-section ev-section--detail">
        <div className="ev-container ev-detail">
          <aside className="ev-info">
            <h2>Event details</h2>
            <ul>
              <li>
                <span className="ev-info__label">Date</span>
                <strong>{formatWeekday(event.start_at)}, {formatDate(event.start_at)}</strong>
              </li>
              <li>
                <span className="ev-info__label">Time</span>
                <strong>{formatTime(event.start_at)} – {formatTime(event.end_at)}</strong>
              </li>
              <li>
                <span className="ev-info__label">Format</span>
                <strong>{event.mode}{event.venue ? ` · ${event.venue}` : ''}</strong>
              </li>
              {event.host && (
                <li>
                  <span className="ev-info__label">Hosted by</span>
                  <strong>{event.host}</strong>
                </li>
              )}
              {event.spots_left !== null && (
                <li>
                  <span className="ev-info__label">Seats</span>
                  <strong>{isFull ? 'Fully booked' : `${event.spots_left} of ${event.capacity} left`}</strong>
                </li>
              )}
            </ul>
            <button type="button" className="ev-info__cal" onClick={() => downloadCalendarFile(event)}>
              Add to calendar
            </button>
            {event.description && (
              <div className="ev-about">
                <h3>About this event</h3>
                <p>{event.description}</p>
              </div>
            )}
          </aside>

          <div className="ev-form-card">
            {done ? (
              <div className="ev-success" role="status">
                <span className="ev-success__icon" aria-hidden="true">✓</span>
                <h2>You're registered!</h2>
                <p>
                  Thank you, {form.name.split(' ')[0]}. A confirmation with the event details has been sent to <strong>{form.email}</strong>.
                </p>
                <div className="ev-success__ref">Reference <strong>{done.reference}</strong></div>
                {done.join_link && (
                  <a href={done.join_link} target="_blank" rel="noopener noreferrer" className="ev-btn ev-btn--primary">Join link — keep this for the day</a>
                )}
                <button type="button" className="ev-btn ev-btn--outline" onClick={() => downloadCalendarFile(event, done.join_link)}>Add to my calendar</button>
                <Link to="/events" className="ev-link">See other events</Link>
              </div>
            ) : event.external_registration_url && event.state !== 'past' ? (
              <div className="ev-closed">
                <h2>Register for this event</h2>
                <p>Registration for this event is handled on its own registration page.</p>
                <a href={event.external_registration_url} target="_blank" rel="noopener noreferrer" className="ev-btn ev-btn--primary">Open registration page →</a>
              </div>
            ) : event.state === 'past' ? (
              <div className="ev-closed">
                <h2>This event has taken place</h2>
                <p>Thank you to everyone who joined. Watch this space for our next session.</p>
                <Link to="/events" className="ev-btn ev-btn--primary">See upcoming events</Link>
              </div>
            ) : !event.registration_open ? (
              <div className="ev-closed">
                <h2>{isFull ? 'This event is fully booked' : 'Registration is closed'}</h2>
                <p>{isFull ? 'All seats have been taken.' : 'Registration for this event has closed.'} Please check our other upcoming events.</p>
                <Link to="/events" className="ev-btn ev-btn--primary">See upcoming events</Link>
              </div>
            ) : (
              <form onSubmit={submit} noValidate>
                <h2>Reserve your seat</h2>
                <p className="ev-form-sub">It takes a minute. We'll email your confirmation and joining details.</p>

                {/* honeypot: hidden from people, irresistible to bots */}
                <div className="ev-hp" aria-hidden="true">
                  <label>Website<input type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => set('website', e.target.value)} /></label>
                </div>

                <div className="ev-field">
                  <label htmlFor="ev-name">Full name <b>*</b></label>
                  <input id="ev-name" value={form.name} onChange={(e) => set('name', e.target.value)} autoComplete="name" maxLength={120} aria-invalid={!!errors.name} />
                  {errors.name && <span className="ev-err">{errors.name}</span>}
                </div>
                <div className="ev-row">
                  <div className="ev-field">
                    <label htmlFor="ev-email">Email <b>*</b></label>
                    <input id="ev-email" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} autoComplete="email" aria-invalid={!!errors.email} />
                    {errors.email && <span className="ev-err">{errors.email}</span>}
                  </div>
                  <div className="ev-field">
                    <label htmlFor="ev-phone">Phone <b>*</b></label>
                    <input id="ev-phone" type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} autoComplete="tel" maxLength={20} aria-invalid={!!errors.phone} />
                    {errors.phone && <span className="ev-err">{errors.phone}</span>}
                  </div>
                </div>
                <div className="ev-row">
                  <div className="ev-field">
                    <label htmlFor="ev-org">Organisation</label>
                    <input id="ev-org" value={form.organization} onChange={(e) => set('organization', e.target.value)} autoComplete="organization" maxLength={120} />
                  </div>
                  <div className="ev-field">
                    <label htmlFor="ev-role">Designation</label>
                    <input id="ev-role" value={form.designation} onChange={(e) => set('designation', e.target.value)} autoComplete="organization-title" maxLength={120} />
                  </div>
                </div>
                <div className="ev-field">
                  <label htmlFor="ev-city">City</label>
                  <input id="ev-city" value={form.city} onChange={(e) => set('city', e.target.value)} autoComplete="address-level2" maxLength={80} />
                </div>

                <label className="ev-consent">
                  <input type="checkbox" checked={form.consent} onChange={(e) => set('consent', e.target.checked)} />
                  <span>I agree that JHS may contact me about this event and use these details to manage my registration, as described in the <Link to="/privacy-policy" target="_blank">Privacy Policy</Link>.</span>
                </label>
                {errors.consent && <span className="ev-err">{errors.consent}</span>}

                {formError && <p className="ev-form-error" role="alert">{formError}</p>}
                <button type="submit" className="ev-btn ev-btn--primary ev-btn--block" disabled={submitting}>
                  {submitting ? 'Registering…' : 'Register for this event'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
