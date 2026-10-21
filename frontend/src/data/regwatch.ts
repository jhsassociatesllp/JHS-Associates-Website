import { useEffect, useState } from 'react'

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '/api'

export interface RegWatchItem {
  id: string
  title: string
  summary: string
  regulator: string
  reference: string | null
  published_on: string // YYYY-MM-DD, date of the circular / notification
  pdf_id: string
  image_id: string | null
  created_at: string
}

export const REGULATORS = ['SEBI', 'RBI', 'MCA', 'GST', 'Income Tax', 'FEMA', 'IRDAI', 'Other']

export const REGULATOR_ACCENT: Record<string, string> = {
  SEBI: '#1e6fd9',
  RBI: '#0f8a6d',
  MCA: '#7a4bd6',
  GST: '#D62049',
  'Income Tax': '#c27a00',
  FEMA: '#0e7c90',
  IRDAI: '#b4348a',
  Other: '#5b6b82',
}

export const regWatchPdfUrl = (id: string) => `${API_BASE}/reg-watch/pdf/${id}`
export const regWatchImageUrl = (id: string) => `${API_BASE}/reg-watch/image/${id}`

export const formatRegDate = (value?: string) => {
  if (!value) return ''
  const d = new Date(`${value.slice(0, 10)}T00:00:00`)
  return Number.isNaN(d.getTime())
    ? ''
    : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function useRegWatch(limit = 60) {
  const [items, setItems] = useState<RegWatchItem[] | null>(null)
  const [error, setError] = useState(false)
  useEffect(() => {
    let cancelled = false
    fetch(`${API_BASE}/reg-watch/?limit=${limit}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: RegWatchItem[]) => { if (!cancelled) setItems(Array.isArray(d) ? d : []) })
      .catch(() => { if (!cancelled) setError(true) })
    return () => { cancelled = true }
  }, [limit])
  return { items, loading: items === null && !error, error }
}
