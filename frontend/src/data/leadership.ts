import { useEffect, useMemo, useState } from 'react'
import { imageUrl } from '../utils/imageUrl'

// Leadership data now lives in MongoDB (managed from the admin panel) and is
// served by GET /api/leadership/. Everyone — Partners, Governance Council,
// Advisory Board Members, Associates — is one record with a `roles` tag list.

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '/api'

export interface LeadershipPerson {
  id: string
  name: string
  education: string
  description: string
  location: string
  email: string | null
  linkedin: string | null
  services: string[]
  sectors: string[]
  cities: string[]
  service_points: string[]
  specializations: string[]
  roles: string[]
  section: string | null
  status: string
  display_order: number
  photo_id: string | null
  photo_file: string | null
}

export interface Member {
  id: string
  name: string
  image: string
  creds: string
  desc: string
  location: string
  sector: string[]
  linkedin: string
  email?: string
  category: string
  /** Roles the person holds (used for filtering). */
  roles: string[]
  /** Single badge label shown on the card. */
  role: string
}

export interface LeadershipSection {
  category: string
  members: Member[]
}

// Canonical role order — also the order of the "Filter by role" dropdown.
export const ROLE_ORDER = ['Governance Council', 'Partner', 'Advisory Board Member', 'Associate']

const GOVERNANCE = 'Governance Council'
const DEFAULT_SECTION = 'Partners'

// Card badge: one label per person. A Governance Council member who is also a
// Partner shows as "Governance Council" (their highest standing), as before.
const primaryRole = (roles: string[]): string =>
  ROLE_ORDER.find((r) => roles.includes(r)) ?? roles[0] ?? 'Partner'

const photoUrl = (p: LeadershipPerson): string => {
  if (p.photo_id) return `${API_BASE}/leadership/photo/${p.photo_id}`
  if (p.photo_file) return imageUrl(p.photo_file)
  return ''
}

const toMember = (p: LeadershipPerson): Member => ({
  id: p.id,
  name: p.name,
  image: photoUrl(p),
  creds: p.education,
  desc: p.description,
  location: p.location,
  sector: p.specializations,
  linkedin: p.linkedin ?? '',
  email: p.email ?? undefined,
  category: p.roles.includes(GOVERNANCE) ? GOVERNANCE : p.section || DEFAULT_SECTION,
  roles: p.roles,
  role: primaryRole(p.roles),
})

/** Flat, display-ordered member list. */
export const buildMembers = (people: LeadershipPerson[]): Member[] => people.map(toMember)

/**
 * Groups members into the Leadership page's sections: Governance Council first,
 * then each named section in the order its first member appears (display_order).
 * A person appears once, in their first matching section.
 */
export const buildSections = (members: Member[]): LeadershipSection[] => {
  const sections: LeadershipSection[] = []
  const byName = new Map<string, LeadershipSection>()
  const add = (category: string, member: Member) => {
    let section = byName.get(category)
    if (!section) {
      section = { category, members: [] }
      byName.set(category, section)
      sections.push(section)
    }
    section.members.push(member)
  }
  members.filter((m) => m.roles.includes(GOVERNANCE)).forEach((m) => add(GOVERNANCE, m))
  members.filter((m) => !m.roles.includes(GOVERNANCE)).forEach((m) => add(m.category, m))
  return sections
}

let cache: Promise<LeadershipPerson[]> | null = null

const fetchLeadership = (): Promise<LeadershipPerson[]> => {
  if (!cache) {
    cache = fetch(`${API_BASE}/leadership/`)
      .then((res) => {
        if (!res.ok) throw new Error(`Leadership request failed (${res.status})`)
        return res.json() as Promise<LeadershipPerson[]>
      })
      .catch((err) => {
        cache = null // let the next mount retry
        throw err
      })
  }
  return cache
}

/** Raw people list from the API (null until loaded). Shared, cached fetch. */
export function usePeople() {
  const [people, setPeople] = useState<LeadershipPerson[] | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetchLeadership()
      .then((data) => { if (!cancelled) setPeople(data) })
      .catch(() => { if (!cancelled) setError(true) })
    return () => { cancelled = true }
  }, [])

  return { people, error }
}

export function useLeadership() {
  const { people, error } = usePeople()
  const members = useMemo(() => buildMembers(people ?? []), [people])
  const sections = useMemo(() => buildSections(members), [members])

  return { members, sections, loading: people === null && !error, error }
}


/* ── Other pages fed by the same records ─────────────────────────────── */

export interface CityPartner {
  name: string
  image: string
  qualifications: string
  designation: string
  email: string
  linkedin: string
}

/**
 * Partners shown on a city page: everyone tagged with that city in the admin
 * panel, in display order. Until the API answers (or if it is unreachable)
 * the page's built-in list is used so it never renders empty.
 */
export function useCityPartners<T extends CityPartner>(city: string, fallback: T[]): CityPartner[] {
  const { people, error } = usePeople()
  return useMemo(() => {
    if (!people || error) return fallback
    return people
      .filter((p) => p.cities?.includes(city))
      .map((p) => ({
        name: p.name,
        image: photoUrl(p),
        qualifications: p.education,
        designation: p.specializations.join(', '),
        email: p.email ?? '',
        linkedin: p.linkedin ?? '',
      }))
  }, [people, error, city, fallback])
}

// Sector page key (file name) -> the sector label used in the admin panel.
export const SECTOR_KEY_LABELS: Record<string, string> = {
  ITSystemAudit: 'IT System Audit', ITTeS: 'IT / ITeS', Media: 'Media', FMCG: 'FMCG', Retail: 'Retail',
  Housing: 'Housing', GemsAndJewellery: 'Gems & Jewellery', Commodity: 'Commodity', OilAndGasIndustry: 'Oil & Gas',
  RealEstate: 'Real Estate', Banking: 'Banking', Broking: 'Broking', Insurance: 'Insurance',
  FamilyOrientedBusinesses: 'Family Oriented Businesses', DigitalCurrency: 'Digital Currency', NBFC: 'NBFC',
  VentureCapital: 'Venture Capital', PortfolioManagement: 'Portfolio Management', MutualFunds: 'Mutual Funds',
  HealthCare: 'Healthcare', Construction: 'Constructions', Manufacturing: 'Manufacturing', Logistics: 'Logistics', NGO: 'NGO',
}

export interface SectorExpert {
  name: string
  image?: string
  creds?: string
  location: string
  email?: string
  linkedin?: string
}

/** Specialists for a sector page: everyone ticked for that sector in the admin panel. */
export function useSectorExperts<T extends SectorExpert>(sectorKey: string, fallback: T[]): SectorExpert[] {
  const { people, error } = usePeople()
  return useMemo(() => {
    const label = SECTOR_KEY_LABELS[sectorKey]
    if (!people || error || !label) return fallback
    return people
      .filter((p) => p.sectors?.includes(label))
      .map((p) => ({
        name: p.name,
        image: photoUrl(p),
        creds: p.education,
        location: p.location,
        email: p.email ?? undefined,
        linkedin: p.linkedin ?? undefined,
      }))
  }, [people, error, sectorKey, fallback])
}

const norm = (n: string) => n.toLowerCase().replace(/[^a-z]/g, '')

export interface ServicePartner {
  name: string
  creds: string
  designation: string
  location: string
  image?: string
  email?: string
  linkedin?: string
}

/**
 * Keeps the curated "which partners handle which service point" lists, but
 * refreshes each partner's details (photo, qualifications, specialities,
 * contact) from the admin-managed records and drops anyone marked Inactive.
 * Partners with no record yet keep their built-in details.
 */
export function useResolveServicePartners() {
  const { people, error } = usePeople()
  const hidden = useHiddenNames()
  return useMemo(() => {
    const byName = new Map((people ?? []).map((p) => [norm(p.name), p]))
    return <T extends ServicePartner>(profiles: T[]): ServicePartner[] => {
      if (error) return profiles
      return profiles
        .filter((p) => !hidden.has(norm(p.name)))
        .map((p) => {
          const rec = byName.get(norm(p.name))
          if (!rec) return p
          return {
            ...p,
            creds: rec.education || p.creds,
            designation: rec.specializations.join(', ') || p.designation,
            location: rec.location || p.location,
            image: photoUrl(rec) || p.image,
            email: rec.email ?? p.email,
            linkedin: rec.linkedin ?? p.linkedin,
          }
        })
    }
  }, [people, error, hidden])
}

let hiddenCache: Promise<string[]> | null = null

/** Names of people switched to Inactive in the admin panel (to hide them from hand-picked lists). */
function useHiddenNames(): Set<string> {
  const [names, setNames] = useState<string[]>([])
  useEffect(() => {
    let cancelled = false
    if (!hiddenCache) {
      hiddenCache = fetch(`${API_BASE}/leadership/hidden`)
        .then((r) => (r.ok ? (r.json() as Promise<string[]>) : []))
        .catch(() => { hiddenCache = null; return [] as string[] })
    }
    hiddenCache.then((n) => { if (!cancelled) setNames(n) })
    return () => { cancelled = true }
  }, [])
  return useMemo(() => new Set(names.map(norm)), [names])
}


/* ── Services & sub-services (managed in the admin panel) ──────────────── */

export interface ServicePointItem {
  id: string
  title: string
  desc: string
}

interface CatalogService {
  key: string
  name: string
  points: ServicePointItem[]
}

let catalogCache: Promise<CatalogService[]> | null = null

function useCatalogServices(): CatalogService[] | null {
  const [services, setServices] = useState<CatalogService[] | null>(null)
  useEffect(() => {
    let cancelled = false
    if (!catalogCache) {
      catalogCache = fetch(`${API_BASE}/catalog/services`)
        .then((r) => {
          if (!r.ok) throw new Error('catalog request failed')
          return r.json() as Promise<CatalogService[]>
        })
        .catch((err) => { catalogCache = null; throw err })
    }
    catalogCache.then((d) => { if (!cancelled) setServices(d) }).catch(() => {})
    return () => { cancelled = true }
  }, [])
  return services
}

/**
 * Sub-services for a service page, split into the diagram's left and right
 * columns (first half / second half). Falls back to the page's built-in lists
 * until the catalog loads, or if it can't be reached.
 */
export function useServicePoints(
  serviceKey: string,
  fallbackLeft: ServicePointItem[],
  fallbackRight: ServicePointItem[],
) {
  const services = useCatalogServices()
  return useMemo(() => {
    const svc = services?.find((x) => x.key === serviceKey)
    if (!svc || svc.points.length === 0) return { leftItems: fallbackLeft, rightItems: fallbackRight }
    const half = Math.ceil(svc.points.length / 2)
    return { leftItems: svc.points.slice(0, half), rightItems: svc.points.slice(half) }
  }, [services, serviceKey, fallbackLeft, fallbackRight])
}

/**
 * Partners listed under one sub-service: everyone assigned to it on the
 * Leadership page in the admin panel. Uses the built-in list only until the
 * data loads (or if it can't be reached).
 */
export function useServicePointPartners(
  serviceKey: string,
  pointId: string,
  fallback: ServicePartner[],
): ServicePartner[] {
  const { people, error } = usePeople()
  const services = useCatalogServices()
  return useMemo(() => {
    if (!people || error || !services || !pointId) return fallback
    const ref = `${serviceKey}:${pointId}`
    return people
      .filter((p) => p.service_points?.includes(ref))
      .map((p) => ({
        name: p.name,
        creds: p.education,
        designation: p.specializations.join(', '),
        location: p.location,
        image: photoUrl(p) || undefined,
        email: p.email ?? undefined,
        linkedin: p.linkedin ?? undefined,
      }))
  }, [people, error, services, serviceKey, pointId, fallback])
}
