// ─── Google Website Translator integration ─────────────────────────────────
// Translates the live site into the selected language on the client side.
// We don't hand-author translation strings (risky for a CA firm's
// financial/legal/compliance content in languages we can't verify) — instead
// we drive Google's own translation engine and just supply our own UI chrome.

export interface LanguageOption {
  code: string
  label: string
  nativeLabel: string
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिंदी' },
  { code: 'mr', label: 'Marathi', nativeLabel: 'मराठी' },
  { code: 'gu', label: 'Gujarati', nativeLabel: 'ગુજરાતી' },
  { code: 'ur', label: 'Urdu', nativeLabel: 'اردو' },
  { code: 'ar', label: 'Arabic', nativeLabel: 'العربية' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்' },
  { code: 'te', label: 'Telugu', nativeLabel: 'తెలుగు' },
]

const SOURCE_LANG = 'en'
const WIDGET_CONTAINER_ID = 'google_translate_element'
const STORAGE_KEY = 'jhs_lang'

declare global {
  interface Window {
    google?: {
      translate?: {
        TranslateElement?: new (options: Record<string, unknown>, containerId: string) => unknown
      }
    }
    googleTranslateElementInit?: () => void
  }
}

let loadPromise: Promise<void> | null = null

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'))
  return match ? decodeURIComponent(match[1]) : null
}

function setCookie(name: string, value: string) {
  const host = window.location.hostname
  const domainParts = host.split('.')
  const rootDomain = domainParts.length > 1 ? '.' + domainParts.slice(-2).join('.') : ''
  // Set on both the exact host and the root domain so it sticks regardless
  // of how the translate widget reads it back.
  document.cookie = `${name}=${value};path=/`
  if (rootDomain && host !== 'localhost') {
    document.cookie = `${name}=${value};path=/;domain=${rootDomain}`
  }
}

function clearCookie(name: string) {
  const host = window.location.hostname
  const domainParts = host.split('.')
  const rootDomain = domainParts.length > 1 ? '.' + domainParts.slice(-2).join('.') : ''
  document.cookie = `${name}=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT`
  if (rootDomain && host !== 'localhost') {
    document.cookie = `${name}=;path=/;domain=${rootDomain};expires=Thu, 01 Jan 1970 00:00:00 GMT`
  }
}

/** Loads the Google Website Translator script + hidden widget once, site-wide. */
export function loadGoogleTranslate(): Promise<void> {
  if (loadPromise) return loadPromise

  loadPromise = new Promise((resolve) => {
    let container = document.getElementById(WIDGET_CONTAINER_ID)
    if (!container) {
      container = document.createElement('div')
      container.id = WIDGET_CONTAINER_ID
      container.style.display = 'none'
      document.body.appendChild(container)
    }

    window.googleTranslateElementInit = () => {
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: SOURCE_LANG,
            includedLanguages: LANGUAGES.filter((l) => l.code !== SOURCE_LANG)
              .map((l) => l.code)
              .join(','),
            autoDisplay: false,
          },
          WIDGET_CONTAINER_ID
        )
      }
      resolve()
    }

    if (document.getElementById('google-translate-script')) {
      // Script already requested by an earlier call; init callback above will resolve us.
      return
    }

    const script = document.createElement('script')
    script.id = 'google-translate-script'
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
    script.async = true
    document.body.appendChild(script)
  })

  return loadPromise
}

function triggerGoogleCombo(code: string): boolean {
  const combo = document.querySelector<HTMLSelectElement>('.goog-te-combo')
  if (!combo) return false
  combo.value = code
  combo.dispatchEvent(new Event('change'))
  return true
}

/** Switches the live page to the given language code ('en' resets to original). */
export async function setLanguage(code: string) {
  localStorage.setItem(STORAGE_KEY, code)

  if (code === SOURCE_LANG) {
    clearCookie('googtrans')
    // Reload is the only reliable way to fully revert Google's DOM rewrites.
    window.location.reload()
    return
  }

  setCookie('googtrans', `/${SOURCE_LANG}/${code}`)

  await loadGoogleTranslate()

  // The <select class="goog-te-combo"> is injected asynchronously by Google's
  // script; poll briefly until it exists.
  let attempts = 0
  const tryTrigger = () => {
    attempts += 1
    if (triggerGoogleCombo(code)) return
    if (attempts < 40) {
      setTimeout(tryTrigger, 150)
    } else {
      // Widget never mounted the combo in time — fall back to a reload,
      // which lets Google's script pick up the cookie on init.
      window.location.reload()
    }
  }
  tryTrigger()
}

export function getStoredLanguage(): string {
  return localStorage.getItem(STORAGE_KEY) || SOURCE_LANG
}

/**
 * Google Translate rewrites text nodes directly, which can collide with
 * React's own DOM reconciliation and throw "removeChild"/"insertBefore"
 * NotFoundError crashes. This is the standard, widely-used guard against it.
 */
export function patchDomForGoogleTranslate() {
  if ((Node.prototype as unknown as { __jhsPatched?: boolean }).__jhsPatched) return
  ;(Node.prototype as unknown as { __jhsPatched?: boolean }).__jhsPatched = true

  const originalRemoveChild = Node.prototype.removeChild
  Node.prototype.removeChild = function <T extends Node>(child: T): T {
    if (child.parentNode !== this) {
      if (typeof console !== 'undefined') {
        console.warn('[jhs] Skipped removeChild call for a node that was not a child (Google Translate DOM conflict).')
      }
      return child
    }
    return originalRemoveChild.call(this, child) as T
  }

  const originalInsertBefore = Node.prototype.insertBefore
  Node.prototype.insertBefore = function <T extends Node>(newNode: T, referenceNode: Node | null): T {
    if (referenceNode && referenceNode.parentNode !== this) {
      if (typeof console !== 'undefined') {
        console.warn('[jhs] Skipped insertBefore call for a reference node that was not a child (Google Translate DOM conflict).')
      }
      return newNode
    }
    return originalInsertBefore.call(this, newNode, referenceNode) as T
  }
}

/** Call once on app start so a previously chosen language re-applies after a full reload. */
export function initPersistedLanguage() {
  const stored = getStoredLanguage()
  const cookie = getCookie('googtrans')
  if (stored !== SOURCE_LANG && !cookie) {
    setCookie('googtrans', `/${SOURCE_LANG}/${stored}`)
  }
  if (stored !== SOURCE_LANG || cookie) {
    loadGoogleTranslate()
  }
}
