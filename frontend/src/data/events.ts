import { useEffect, useState } from 'react'

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '/api'

export interface SiteEvent {
  id: string
  title: string
  event_type: string
  summary: string
  description: string
  start_at: string
  end_at: string
  mode: string
  venue: string | null
  external_registration_url: string | null
  capacity: number
  registered: number
  spots_left: number | null
  registration_deadline: string | null
  host: string | null
  state: 'upcoming' | 'live' | 'past'
  registration_open: boolean
}

export interface RegistrationResult {
  message: string
  reference: string
  event: SiteEvent
  join_link: string | null
}

export const EVENT_TYPES_ACCENT: Record<string, string> = {
  Excellencia: '#D62049',
  'Knowledge Setu': '#1e6fd9',
  'Office Event': '#0f8a6d',
  Webinar: '#7a4bd6',
  Other: '#5b6b82',
}

/* ── formatting (always Indian Standard Time, whatever the visitor's timezone) ── */
const IST = 'Asia/Kolkata'

export const formatDay = (iso: string) =>
  new Intl.DateTimeFormat('en-IN', { timeZone: IST, day: '2-digit' }).format(new Date(iso))
export const formatMonth = (iso: string) =>
  new Intl.DateTimeFormat('en-IN', { timeZone: IST, month: 'short' }).format(new Date(iso)).toUpperCase()
export const formatWeekday = (iso: string) =>
  new Intl.DateTimeFormat('en-IN', { timeZone: IST, weekday: 'long' }).format(new Date(iso))
export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('en-IN', { timeZone: IST, day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso))
export const formatTime = (iso: string) =>
  new Intl.DateTimeFormat('en-IN', { timeZone: IST, hour: 'numeric', minute: '2-digit', hour12: true }).format(new Date(iso)).toUpperCase() + ' IST'
export const formatWhen = (iso: string) => `${formatWeekday(iso)}, ${formatDate(iso)} · ${formatTime(iso)}`

/** Calendar file (.ics) so people can add the event to Google / Outlook / Apple calendar. */
export function downloadCalendarFile(event: SiteEvent, joinLink?: string | null) {
  const stamp = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  const esc = (t: string) => t.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')
  const where = event.venue || (joinLink ? 'Online' : event.mode)
  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//JHS//Events//EN', 'BEGIN:VEVENT',
    `UID:${event.id}@jhsassociates.in`,
    `DTSTAMP:${stamp(new Date().toISOString())}`,
    `DTSTART:${stamp(event.start_at)}`,
    `DTEND:${stamp(event.end_at)}`,
    `SUMMARY:${esc(event.title)}`,
    `DESCRIPTION:${esc([event.summary, joinLink ? `Join: ${joinLink}` : ''].filter(Boolean).join('\n'))}`,
    `LOCATION:${esc(where)}`,
    'END:VEVENT', 'END:VCALENDAR',
  ]
  const url = URL.createObjectURL(new Blob([lines.join('\r\n')], { type: 'text/calendar' }))
  const a = document.createElement('a')
  a.href = url
  a.download = `${event.title.replace(/[^\w]+/g, '-').toLowerCase()}.ics`
  a.click()
  URL.revokeObjectURL(url)
}

/* ── data hooks ── */
export function useEvents(past = false, limit = 12) {
  const [events, setEvents] = useState<SiteEvent[] | null>(null)
  const [error, setError] = useState(false)
  useEffect(() => {
    let cancelled = false
    fetch(`${API_BASE}/events/?past=${past}&limit=${limit}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: SiteEvent[]) => { if (!cancelled) setEvents(d) })
      .catch(() => { if (!cancelled) setError(true) })
    return () => { cancelled = true }
  }, [past, limit])
  return { events, loading: events === null && !error, error }
}

export function useEvent(id: string | undefined) {
  const [event, setEvent] = useState<SiteEvent | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'missing' | 'error'>('loading')
  useEffect(() => {
    if (!id) return
    let cancelled = false
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStatus('loading')
    fetch(`${API_BASE}/events/${encodeURIComponent(id)}`)
      .then(async (r) => {
        if (r.status === 404) { if (!cancelled) setStatus('missing'); return }
        if (!r.ok) throw new Error()
        const d = (await r.json()) as SiteEvent
        if (!cancelled) { setEvent(d); setStatus('ready') }
      })
      .catch(() => { if (!cancelled) setStatus('error') })
    return () => { cancelled = true }
  }, [id])
  return { event, status, setEvent }
}

export interface RegistrationInput {
  name: string
  email: string
  phone: string
  organization: string
  designation: string
  city: string
  consent: boolean
  website: string
}

export async function registerForEvent(id: string, input: RegistrationInput): Promise<RegistrationResult> {
  const res = await fetch(`${API_BASE}/events/${encodeURIComponent(id)}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...input,
      organization: input.organization || null,
      designation: input.designation || null,
      city: input.city || null,
    }),
  })
  if (res.ok) return res.json()
  const body = await res.json().catch(() => null)
  const detail = typeof body?.detail === 'string' ? body.detail : null
  const messages: Record<number, string> = {
    409: 'This email address is already registered for this event.',
    410: 'Registration for this event is closed.',
    429: 'Too many attempts. Please try again in a little while.',
    422: 'Please check the details you entered and try again.',
  }
  throw new Error(detail && res.status !== 422 ? detail : messages[res.status] ?? 'Something went wrong. Please try again.')
}
