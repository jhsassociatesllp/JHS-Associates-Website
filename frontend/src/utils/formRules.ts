/**
 * One set of form rules shared by every public form. The limits below mirror the server
 * (backend/app/utils/validation.py) exactly - change both together.
 */
export const LIMITS = {
  name: 100,
  shortText: 100, // company, city, designation ...
  subject: 300,
  contactMessage: 1000,
  longMessage: 2000,
  email: 254,
  phone: 30,
} as const

export const MIN_MESSAGE = 10

const MARKUP = /[<>]/

export const hasMarkup = (v: string) => MARKUP.test(v)

export function validateName(v: string, label = 'Name'): string | undefined {
  const t = v.trim()
  if (!t) return `${label} is required`
  if (t.length < 2) return `${label} must be at least 2 characters`
  if (hasMarkup(t)) return `${label} must not contain < or >`
  return undefined
}

export function validateText(v: string, label: string, opts: { required?: boolean; min?: number } = {}): string | undefined {
  const t = v.trim()
  if (!t) return opts.required ? `${label} is required` : undefined
  if (opts.min && t.length < opts.min) return `${label} must be at least ${opts.min} characters`
  if (hasMarkup(t)) return `${label} must not contain < or >`
  return undefined
}

export function validateEmail(v: string): string | undefined {
  const t = v.trim()
  if (!t) return 'Email is required'
  if (t.length > LIMITS.email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(t)) return 'Enter a valid email'
  return undefined
}

/** 7 to 15 digits after removing spaces, dashes, dots and brackets; optional leading +. */
export function validatePhone(v: string, required = false): string | undefined {
  const t = v.trim()
  if (!t) return required ? 'Phone number is required' : undefined
  if (!/^\+?[0-9]{7,15}$/.test(t.replace(/[\s\-().]/g, ''))) return 'Enter a valid phone number (7 to 15 digits)'
  return undefined
}

/** Pulls a readable sentence out of an API error body ({detail: string | [{loc, msg}]}). */
export function apiErrorMessage(body: unknown, fallback = 'Something went wrong. Please try again.'): string {
  const detail = (body as { detail?: unknown } | null)?.detail
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail) && detail.length) {
    const first = detail[0] as { loc?: unknown[]; msg?: string }
    const field = Array.isArray(first.loc) ? String(first.loc[first.loc.length - 1] ?? '').replace(/_/g, ' ') : ''
    if (first.msg) return field ? `${field.charAt(0).toUpperCase()}${field.slice(1)}: ${first.msg}` : first.msg
  }
  return fallback
}
