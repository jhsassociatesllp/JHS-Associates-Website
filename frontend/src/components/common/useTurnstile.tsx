import { useCallback, useEffect, useRef, useState } from 'react'
import './FormExtras.css'

const TURNSTILE_SITE_KEY = (import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined) || ''

/* Cloudflare Turnstile (only active when VITE_TURNSTILE_SITE_KEY is set at build time) */
declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string
      reset: (id?: string) => void
      remove: (id?: string) => void
    }
  }
}

let turnstileScript: Promise<void> | null = null
function loadTurnstile(): Promise<void> {
  if (window.turnstile) return Promise.resolve()
  if (!turnstileScript) {
    turnstileScript = new Promise((resolve, reject) => {
      const s = document.createElement('script')
      s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
      s.async = true
      s.onload = () => resolve()
      s.onerror = () => {
        turnstileScript = null
        reject(new Error('turnstile'))
      }
      document.head.appendChild(s)
    })
  }
  return turnstileScript
}

/** Returns the visitor's Turnstile token, the widget to render, and a reset() to call after each submit. */
export function useTurnstile() {
  const [token, setToken] = useState('')
  const boxRef = useRef<HTMLDivElement>(null)
  const idRef = useRef<string | undefined>(undefined)

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY || !boxRef.current) return
    let cancelled = false
    loadTurnstile()
      .then(() => {
        if (cancelled || !boxRef.current || !window.turnstile || idRef.current) return
        idRef.current = window.turnstile.render(boxRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          callback: (t: string) => setToken(t),
          'expired-callback': () => setToken(''),
          'error-callback': () => setToken(''),
        })
      })
      .catch(() => {
        /* blocked by an ad-blocker: the server decides whether to accept the form */
      })
    return () => {
      cancelled = true
      if (idRef.current && window.turnstile) window.turnstile.remove(idRef.current)
      idRef.current = undefined
    }
  }, [])

  const reset = useCallback(() => {
    setToken('')
    if (idRef.current && window.turnstile) window.turnstile.reset(idRef.current)
  }, [])

  const widget = TURNSTILE_SITE_KEY ? <div ref={boxRef} className="fx-turnstile" /> : null
  return { token, widget, reset, enabled: Boolean(TURNSTILE_SITE_KEY) }
}

