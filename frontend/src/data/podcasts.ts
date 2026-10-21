import { useEffect, useState } from 'react'

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '/api'

export interface PodcastEpisode {
  id: string
  title: string
  description: string
  guest: string | null
  duration: string | null
  platform: string
  listen_url: string
  published_on: string // YYYY-MM-DD
  image_id: string | null
  created_at: string
}

export const podcastImageUrl = (id: string) => `${API_BASE}/podcasts/image/${id}`

export const formatEpisodeDate = (value?: string) => {
  if (!value) return ''
  const d = new Date(`${value.slice(0, 10)}T00:00:00`)
  return Number.isNaN(d.getTime())
    ? ''
    : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function usePodcasts(limit = 60) {
  const [episodes, setEpisodes] = useState<PodcastEpisode[] | null>(null)
  const [error, setError] = useState(false)
  useEffect(() => {
    let cancelled = false
    fetch(`${API_BASE}/podcasts/?limit=${limit}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: PodcastEpisode[]) => { if (!cancelled) setEpisodes(Array.isArray(d) ? d : []) })
      .catch(() => { if (!cancelled) setError(true) })
    return () => { cancelled = true }
  }, [limit])
  return { episodes, loading: episodes === null && !error, error }
}
