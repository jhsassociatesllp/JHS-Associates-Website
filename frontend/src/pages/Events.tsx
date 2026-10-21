import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  EVENT_TYPES_ACCENT,
  formatDay,
  formatMonth,
  formatTime,
  formatWeekday,
  useEvents,
  type SiteEvent,
} from '../data/events'
import './Events.css'

function EventCard({ event }: { event: SiteEvent }) {
  const accent = EVENT_TYPES_ACCENT[event.event_type] ?? EVENT_TYPES_ACCENT.Other
  const full = event.capacity > 0 && event.registered >= event.capacity
  return (
    <Link to={`/events/${event.id}`} className="ev-card" style={{ ['--accent' as string]: accent }}>
      <div className="ev-card__date">
        <span>{formatWeekday(event.start_at).slice(0, 3).toUpperCase()}</span>
        <strong>{formatDay(event.start_at)}</strong>
        <em>{formatMonth(event.start_at)}</em>
      </div>
      <div className="ev-card__body">
        <div className="ev-card__tags">
          <span className="ev-chip ev-chip--type">{event.event_type}</span>
          <span className="ev-chip">{event.mode}</span>
          {event.state === 'live' && <span className="ev-chip ev-chip--live">Live now</span>}
          {event.state === 'upcoming' && full && <span className="ev-chip ev-chip--full">Full</span>}
        </div>
        <h3>{event.title}</h3>
        {event.summary && <p>{event.summary}</p>}
        <div className="ev-card__foot">
          <span>{formatTime(event.start_at)}{event.host ? ` · ${event.host}` : ''}</span>
          <span className="ev-card__cta">
            {event.state === 'past' ? 'View details' : event.registration_open ? 'Register' : 'Details'} <i aria-hidden="true">→</i>
          </span>
        </div>
      </div>
    </Link>
  )
}

export default function Events() {
  useEffect(() => { window.scrollTo({ top: 0 }) }, [])
  const upcoming = useEvents(false, 24)
  const past = useEvents(true, 6)

  return (
    <div className="ev-page">
      <section className="ev-hero">
        <div className="ev-hero__inner">
          <p className="ev-hero__crumb">Home <span aria-hidden="true">/</span> Events</p>
          <h1>Events &amp; Webinars</h1>
          <p className="ev-hero__sub">
            Join our monthly Excellencia and Knowledge Setu sessions and other JHS events. Register in a minute — we'll send you the details.
          </p>
        </div>
      </section>

      <section className="ev-section">
        <div className="ev-container">
          <h2 className="ev-h2">Upcoming events</h2>
          {upcoming.loading && <p className="ev-muted">Loading events…</p>}
          {upcoming.error && <p className="ev-muted">We couldn't load events right now. Please try again shortly.</p>}
          {upcoming.events && upcoming.events.length === 0 && (
            <div className="ev-empty">
              <strong>No upcoming events right now</strong>
              <span>New sessions are announced here — please check back soon.</span>
            </div>
          )}
          <div className="ev-grid">
            {upcoming.events?.map((e) => <EventCard key={e.id} event={e} />)}
          </div>

          {past.events && past.events.length > 0 && (
            <>
              <h2 className="ev-h2 ev-h2--past">Past events</h2>
              <div className="ev-grid ev-grid--past">
                {past.events.map((e) => <EventCard key={e.id} event={e} />)}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}
