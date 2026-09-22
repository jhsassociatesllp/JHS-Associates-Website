import { useCallback } from 'react'
import { useSiteAuth } from '../context/SiteAuthContext'

type OpenMode = 'view' | 'download'

/**
 * Shared "sign in to download" gate for every PDF surface (White Papers,
 * Newsletters, Regulatory, Resources/Knowledge, Articles). Mirrors the
 * authenticated blob-fetch pattern already used in the admin panel for
 * resume downloads (fetch with Bearer header -> blob -> objectURL -> open),
 * since a plain <a href> can't carry an Authorization header and the
 * backend now requires sign-in on these endpoints.
 */
export function useGatedDownload() {
  const { user, token, openAuthModal } = useSiteAuth()

  const openFile = useCallback(async (url: string, filename: string, mode: OpenMode = 'view') => {
    if (!user || !token) {
      openAuthModal('download this document')
      return
    }

    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })

    if (res.status === 401 || res.status === 403) {
      openAuthModal('download this document')
      throw new Error('Please sign in to download this document.')
    }
    if (!res.ok) {
      throw new Error('Could not open this document right now. Please try again.')
    }

    const blob = await res.blob()
    const blobUrl = URL.createObjectURL(blob)

    if (mode === 'download') {
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      link.remove()
    } else {
      window.open(blobUrl, '_blank', 'noopener,noreferrer')
    }

    window.setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000)
  }, [user, token, openAuthModal])

  return { openFile, isSignedIn: !!user }
}
