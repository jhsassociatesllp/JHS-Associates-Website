import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  EVENT_TYPES_ACCENT,
  formatDay,
  formatMonth,
  formatTime,
  formatWeekday,
  formatWhen,
  useEvents,
  type SiteEvent,
} from '../data/events'
import './UpcomingEvent.css'

function useCountdown(startIso: string) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000)   // ticks every second
    return () => window.clearInterval(t)
  }, [])
  const diff = new Date(startIso).getTime() - now
  if (diff <= 0) return null
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1000),
  }
}

function Countdown({ start }: { start: string }) {
  const c = useCountdown(start)
  if (!c) return <span className="ue-live"><i /> Happening now</span>
  return (
    <div className="ue-count" aria-label="Time until the event starts">
      {[['Days', c.days], ['Hours', c.hours], ['Mins', c.minutes], ['Secs', c.seconds]].map(([label, value]) => (
        <div key={label as string}>
          <strong>{String(value).padStart(2, '0')}</strong>
          <span>{label}</span>
        </div>
      ))}
    </div>
  )
}

function ctaFor(event: SiteEvent) {
  if (event.external_registration_url) return { label: 'Register now', href: event.external_registration_url, external: true }
  if (event.registration_open) return { label: 'Register now', href: `/events/${event.id}`, external: false }
  if (event.capacity && event.registered >= event.capacity) return { label: 'Event full — details', href: `/events/${event.id}`, external: false }
  return { label: 'View details', href: `/events/${event.id}`, external: false }
}

/**
 * "Next event" spotlight on the home page. Shows the soonest upcoming (or live) event
 * managed in the admin panel; renders nothing when there is none.
 */
export default function UpcomingEvent() {
  const { events } = useEvents(false, 4)
  if (!events || events.length === 0) return null

  const [next, ...others] = events
  const accent = EVENT_TYPES_ACCENT[next.event_type] ?? EVENT_TYPES_ACCENT.Other
  const cta = ctaFor(next)

  return (
    <section className="ue" aria-label="Upcoming event">
      <div className="ue-inner">
        <div className="ue-head">
          <span className="ue-eyebrow">Upcoming Event</span>
          <Link to="/events" className="ue-all">View all events →</Link>
        </div>

        <article className="ue-card" style={{ ['--accent' as string]: accent }}>
          <div className="ue-date" aria-hidden="true">
            <span>{formatWeekday(next.start_at).slice(0, 3).toUpperCase()}</span>
            <strong>{formatDay(next.start_at)}</strong>
            <em>{formatMonth(next.start_at)}</em>
          </div>

          <div className="ue-main">
            <div className="ue-tags">
              <span className="ue-tag ue-tag--type">{next.event_type}</span>
              <span className="ue-tag">{next.mode}</span>
              {next.spots_left !== null && next.registration_open && (
                <span className="ue-tag ue-tag--spots">{next.spots_left} seats left</span>
              )}
            </div>
            <h2 className="ue-title">{next.title}</h2>
            {next.summary && <p className="ue-summary">{next.summary}</p>}
            <p className="ue-when">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              {formatWhen(next.start_at)}
            </p>
            {next.host && (
              <p className="ue-hostline">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                <span className="ue-hostline__label">Host / Speaker</span>
                <strong>{next.host}</strong>
              </p>
            )}
          </div>

          <div className="ue-cta">
            <Countdown start={next.start_at} />
            {cta.external ? (
              <a href={cta.href} target="_blank" rel="noopener noreferrer" className="ue-btn">{cta.label} <span aria-hidden="true">→</span></a>
            ) : (
              <Link to={cta.href} className="ue-btn">{cta.label} <span aria-hidden="true">→</span></Link>
            )}
          </div>
        </article>

        {others.length > 0 && (
          <ul className="ue-more">
            {others.slice(0, 3).map((e) => (
              <li key={e.id}>
                <Link to={`/events/${e.id}`}>
                  <span className="ue-more__dot" style={{ background: EVENT_TYPES_ACCENT[e.event_type] ?? EVENT_TYPES_ACCENT.Other }} />
                  <span className="ue-more__title">{e.title}</span>
                  <span className="ue-more__when">{formatDay(e.start_at)} {formatMonth(e.start_at)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

/** Small pill shown at the top of the home hero so the next event is the first thing visitors see. */
export function HeroEventPill() {
  const { events } = useEvents(false, 1)
  if (!events || events.length === 0) return null
  const e = events[0]
  const accent = EVENT_TYPES_ACCENT[e.event_type] ?? EVENT_TYPES_ACCENT.Other
  const href = e.external_registration_url ?? `/events/${e.id}`
  const inner = (
    <>
      <i className="hep-dot" aria-hidden="true" />
      <span className="hep-type">{e.event_type}</span>
      <span className="hep-title">{e.title}</span>
      <span className="hep-when">{formatDay(e.start_at)} {formatMonth(e.start_at)} · {formatTime(e.start_at)}</span>
      <span className="hep-cta">{e.registration_open ? 'Register' : 'Details'} →</span>
    </>
  )
  return e.external_registration_url ? (
    <a className="hep" href={href} target="_blank" rel="noopener noreferrer" style={{ ['--accent' as string]: accent }}>{inner}</a>
  ) : (
    <Link className="hep" to={href} style={{ ['--accent' as string]: accent }}>{inner}</Link>
  )
}

/**
 * Slim scrolling announcement bar at the very top of the home page showing the current
 * upcoming events (admin-managed). It scrolls away with the page; the navbar below it uses
 * the --topbar-h variable to sit just under it and slide up as the bar leaves the screen.
 */
const MARQUEE_HEIGHT = 34

export function EventMarquee() {
  const { events } = useEvents(false, 4)
  const list = events ?? []
  const visible = list.length > 0

  useEffect(() => {
    const root = document.documentElement
    if (!visible) {
      root.style.setProperty('--topbar-h', '0px')
      root.removeAttribute('data-evm')
      return
    }
    root.setAttribute('data-evm', '1')
    const update = () => root.style.setProperty('--topbar-h', `${Math.max(0, MARQUEE_HEIGHT - window.scrollY)}px`)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => {
      window.removeEventListener('scroll', update)
      root.style.setProperty('--topbar-h', '0px')
      root.removeAttribute('data-evm')
    }
  }, [visible])

  if (!visible) return null

  const makeChunk = (tag: string) => list.map((e) => {
    const accent = EVENT_TYPES_ACCENT[e.event_type] ?? EVENT_TYPES_ACCENT.Other
    const href = e.external_registration_url ?? `/events/${e.id}`
    const external = Boolean(e.external_registration_url)
    const inner = (
      <>
        <i className="evm__dot" style={{ background: accent }} aria-hidden="true" />
        <b className="evm__type" style={{ color: accent }}>{e.event_type}</b>
        <span className="evm__title">{e.title}</span>
        <span className="evm__when">{formatDay(e.start_at)} {formatMonth(e.start_at)} · {formatTime(e.start_at)}</span>
        <span className="evm__cta">{e.registration_open ? 'Register now' : 'View details'} →</span>
      </>
    )
    return external ? (
      <a key={`${e.id}-${tag}`} className="evm__item" href={href} target="_blank" rel="noopener noreferrer">{inner}</a>
    ) : (
      <Link key={`${e.id}-${tag}`} className="evm__item" to={href}>{inner}</Link>
    )
  })

  // the strip is repeated so the loop has no gap, however few events there are; the second half
  // is an exact copy of the first, which is what lets the animation restart unnoticed
  const repeat = Math.max(2, Math.ceil(6 / list.length))
  const half = (tag: string) =>
    Array.from({ length: repeat }, (_, i) => (
      <div className="evm__seq" key={`${tag}-${i}`}>{makeChunk(`${tag}-${i}`)}</div>
    ))

  return (
    <div className="evm" role="region" aria-label="Upcoming events">
      <div className="evm__track">
        <div className="evm__half">{half('a')}</div>
        <div className="evm__half" aria-hidden="true">{half('b')}</div>
      </div>
    </div>
  )
}
