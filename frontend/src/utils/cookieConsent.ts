/**
 * Cookie consent: one first-party cookie remembers the visitor's choice for
 * 12 months, and a minimal record of the choice is sent to the backend so the
 * admin panel can show how many visitors accepted / declined.
 *
 * Categories
 *  - necessary   : always on (this consent cookie, the disclaimer
 *                  acknowledgement, the sign-in session). No consent needed.
 *  - preferences : optional (remembers the chosen site language across visits).
 */

export const CONSENT_COOKIE = 'jhs_cookie_consent'
export const DISCLAIMER_COOKIE = 'jhs_disclaimer_accepted'
// Bump together with POLICY_VERSION in the backend when the categories change.
export const POLICY_VERSION = '1.0'
export const COOKIE_DAYS = 365

export type ConsentStatus = 'accepted' | 'rejected' | 'custom'

export interface Consent {
  /** policy version the choice was made under */
  v: string
  /** anonymous visitor id (random UUID, not linked to any account) */
  id: string
  s: ConsentStatus
  /** preferences cookies allowed */
  p: boolean
  /** ISO timestamp of the choice */
  t: string
  /** true once the choice has been recorded on the server */
  u: boolean
}

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '/api'

/* ── cookie helpers ─────────────────────────────────────────────────── */

export function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'))
  return match ? decodeURIComponent(match[1]) : null
}

/** First-party cookie, 12 months by default, SameSite=Lax, Secure on https. */
export function setCookie(name: string, value: string, days = COOKIE_DAYS) {
  const maxAge = days * 24 * 60 * 60
  const secure = location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAge}; path=/; SameSite=Lax${secure}`
}

export function hasAcknowledgedDisclaimer(): boolean {
  return !!getCookie(DISCLAIMER_COOKIE)
}

/* ── consent state ──────────────────────────────────────────────────── */

const isStatus = (s: unknown): s is ConsentStatus => s === 'accepted' || s === 'rejected' || s === 'custom'

export function readConsent(): Consent | null {
  try {
    const raw = getCookie(CONSENT_COOKIE)
    if (!raw) return null
    const c = JSON.parse(raw) as Partial<Consent>
    if (typeof c.id !== 'string' || !isStatus(c.s) || typeof c.v !== 'string') return null
    return { v: c.v, id: c.id, s: c.s, p: !!c.p, t: String(c.t ?? ''), u: !!c.u }
  } catch {
    return null // tampered / corrupt cookie => ask again
  }
}

function writeConsent(c: Consent) {
  setCookie(CONSENT_COOKIE, JSON.stringify(c))
}

function newVisitorId(): string {
  const c = typeof crypto !== 'undefined' ? (crypto as Crypto) : undefined
  if (c && typeof c.randomUUID === 'function') return c.randomUUID()
  // older browsers: RFC4122 v4 from getRandomValues (or Math.random as a last resort)
  const bytes = new Uint8Array(16)
  if (c && typeof c.getRandomValues === 'function') c.getRandomValues(bytes)
  else for (let i = 0; i < 16; i++) bytes[i] = Math.floor(Math.random() * 256)
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  const h = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`
}

/** Whether optional "preferences" storage (saved language) may be used. */
export function canPersistPreferences(): boolean {
  const c = readConsent()
  return !!c && c.p
}

/** Moves the saved language between persistent and session storage to match the choice. */
function applyPreferencesChoice(allowed: boolean) {
  const KEY = 'jhs_lang'
  try {
    if (allowed) {
      const fromSession = sessionStorage.getItem(KEY)
      if (fromSession) localStorage.setItem(KEY, fromSession)
    } else {
      const saved = localStorage.getItem(KEY)
      if (saved) sessionStorage.setItem(KEY, saved)
      localStorage.removeItem(KEY)
    }
  } catch {
    /* storage unavailable (private mode) — nothing to move */
  }
}

async function postConsent(c: Consent): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/cookie-consent/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({
        visitor_id: c.id,
        status: c.s,
        preferences: c.p,
        page: location.pathname,
        policy_version: c.v,
      }),
    })
    return res.ok
  } catch {
    return false
  }
}

/** Stores the visitor's choice (cookie, 12 months) and records it on the server. */
export async function saveConsent(status: ConsentStatus, preferences: boolean): Promise<Consent> {
  const previous = readConsent()
  const consent: Consent = {
    v: POLICY_VERSION,
    id: previous?.id ?? newVisitorId(),
    s: status,
    p: status === 'accepted' ? true : status === 'rejected' ? false : preferences,
    t: new Date().toISOString(),
    u: false,
  }
  writeConsent(consent)
  applyPreferencesChoice(consent.p)
  if (await postConsent(consent)) {
    consent.u = true
    writeConsent(consent)
  }
  return consent
}

/** If an earlier choice could not be recorded (offline / server down), try again. */
export async function syncPendingConsent() {
  const c = readConsent()
  if (c && !c.u && (await postConsent(c))) writeConsent({ ...c, u: true })
}
