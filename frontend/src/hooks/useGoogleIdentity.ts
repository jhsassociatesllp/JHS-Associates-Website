import { useEffect, useState } from 'react'

export type GoogleIdentityApi = {
  accounts: {
    id: {
      initialize: (config: {
        client_id: string
        callback: (response: { credential: string }) => void
      }) => void
      renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void
    }
  }
}

const isGoogleReady = () =>
  !!(window as unknown as { google?: GoogleIdentityApi }).google?.accounts?.id

/**
 * Loads the Google Identity Services script once (shared across every
 * consumer — Careers, BookConsultationModal, AuthModal all used to load
 * this same script independently) and polls for it to be ready. Polling
 * rather than trusting a single onload callback avoids a race where a
 * second mount (React StrictMode, or a repeat visit) finds the script tag
 * already present and marks "ready" immediately, before the script has
 * actually finished executing.
 */
export function useGoogleIdentity(): boolean {
  const [ready, setReady] = useState(isGoogleReady)

  useEffect(() => {
    if (isGoogleReady()) {
      setReady(true)
      return
    }

    if (!document.getElementById('google-identity-script')) {
      const script = document.createElement('script')
      script.id = 'google-identity-script'
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      document.head.appendChild(script)
    }

    let cancelled = false
    const interval = window.setInterval(() => {
      if (isGoogleReady()) {
        if (!cancelled) setReady(true)
        window.clearInterval(interval)
      }
    }, 100)

    return () => {
      cancelled = true
      window.clearInterval(interval)
    }
  }, [])

  return ready
}

export function getGoogleIdentity(): GoogleIdentityApi | undefined {
  return (window as unknown as { google?: GoogleIdentityApi }).google
}
