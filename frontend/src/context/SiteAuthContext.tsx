import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

export interface SiteUser {
  id: string
  first_name?: string
  last_name?: string
  name: string
  email: string
  picture?: string
  auth_provider: string
}

interface SignupInput {
  first_name: string
  last_name: string
  email: string
  password: string
  agree_terms: boolean
}

interface SiteAuthContextValue {
  user: SiteUser | null
  token: string | null
  ready: boolean
  isAuthModalOpen: boolean
  authModalIntent: string
  openAuthModal: (intent?: string) => void
  closeAuthModal: () => void
  login: (email: string, password: string) => Promise<void>
  signup: (data: SignupInput) => Promise<void>
  loginWithGoogle: (credential: string) => Promise<void>
  logout: () => void
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string

const TOKEN_KEY = 'site_token'
const USER_KEY = 'site_user'

const SiteAuthContext = createContext<SiteAuthContextValue | undefined>(undefined)

function readStoredUser(): SiteUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? (JSON.parse(raw) as SiteUser) : null
  } catch {
    return null
  }
}

function readStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

async function parseAuthResponse(res: Response): Promise<{ token: string; user: SiteUser }> {
  if (!res.ok) {
    let detail = 'Something went wrong. Please try again.'
    try {
      const body = await res.json()
      if (body?.detail) detail = body.detail
    } catch {
      /* non-JSON error body — keep the generic message */
    }
    throw new Error(detail)
  }
  return res.json()
}

export function SiteAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SiteUser | null>(() => readStoredUser())
  const [token, setToken] = useState<string | null>(() => readStoredToken())
  const [ready, setReady] = useState(false)
  const [isAuthModalOpen, setAuthModalOpen] = useState(false)
  const [authModalIntent, setAuthModalIntent] = useState('')

  const persist = useCallback((nextToken: string, nextUser: SiteUser) => {
    localStorage.setItem(TOKEN_KEY, nextToken)
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser))
    setToken(nextToken)
    setUser(nextUser)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setToken(null)
    setUser(null)
  }, [])

  /* Proactively verify a stored session is still valid (token not expired,
     account not disabled) as soon as the app loads, rather than only
     discovering it's stale when a gated action fails. */
  useEffect(() => {
    const existingToken = readStoredToken()
    if (!existingToken) {
      setReady(true)
      return
    }
    let cancelled = false
    fetch(`${API_BASE_URL}/auth/me`, { headers: { Authorization: `Bearer ${existingToken}` } })
      .then(async (res) => {
        if (cancelled) return
        if (!res.ok) {
          logout()
          return
        }
        const freshUser: SiteUser = await res.json()
        localStorage.setItem(USER_KEY, JSON.stringify(freshUser))
        setUser(freshUser)
      })
      .catch(() => { /* offline/network hiccup — don't sign the user out for this */ })
      .finally(() => { if (!cancelled) setReady(true) })
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await parseAuthResponse(res)
    persist(data.token, data.user)
  }, [persist])

  const signup = useCallback(async (data: SignupInput) => {
    const res = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const parsed = await parseAuthResponse(res)
    persist(parsed.token, parsed.user)
  }, [persist])

  const loginWithGoogle = useCallback(async (credential: string) => {
    const res = await fetch(`${API_BASE_URL}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential }),
    })
    const data = await parseAuthResponse(res)
    persist(data.token, data.user)
  }, [persist])

  const openAuthModal = useCallback((intent = '') => {
    setAuthModalIntent(intent)
    setAuthModalOpen(true)
  }, [])

  const closeAuthModal = useCallback(() => setAuthModalOpen(false), [])

  const value = useMemo<SiteAuthContextValue>(() => ({
    user,
    token,
    ready,
    isAuthModalOpen,
    authModalIntent,
    openAuthModal,
    closeAuthModal,
    login,
    signup,
    loginWithGoogle,
    logout,
  }), [user, token, ready, isAuthModalOpen, authModalIntent, openAuthModal, closeAuthModal, login, signup, loginWithGoogle, logout])

  return <SiteAuthContext.Provider value={value}>{children}</SiteAuthContext.Provider>
}

export function useSiteAuth(): SiteAuthContextValue {
  const ctx = useContext(SiteAuthContext)
  if (!ctx) throw new Error('useSiteAuth must be used within a SiteAuthProvider')
  return ctx
}
