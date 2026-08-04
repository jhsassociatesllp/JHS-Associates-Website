// navigator.clipboard only exists in secure contexts (HTTPS or localhost).
// On plain HTTP production hosts it's undefined, so this falls back to the
// legacy execCommand technique instead of throwing.
export function copyToClipboard(text: string): void {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).catch(() => fallbackCopy(text))
  } else {
    fallbackCopy(text)
  }
}

function fallbackCopy(text: string): void {
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.style.position = 'fixed'
  textarea.style.left = '-9999px'
  textarea.style.top = '-9999px'
  document.body.appendChild(textarea)
  textarea.focus()
  textarea.select()
  try {
    document.execCommand('copy')
  } catch {
    // Copying silently fails if the browser supports neither API.
  }
  document.body.removeChild(textarea)
}
