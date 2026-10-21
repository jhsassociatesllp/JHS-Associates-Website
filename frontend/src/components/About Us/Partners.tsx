import { useEffect, useMemo, useState } from 'react'
import './SharedAbout.css'
import './Partners.css'
import { imageUrl } from '../../utils/imageUrl'
import LazyImage from '../common/LazyImage'
import { useLeadership, ROLE_ORDER, type Member } from '../../data/leadership'

// Sector filter options are derived from the free-text `sector` values on
// each partner (e.g. "Risk Advisory, Internal Audit & IFC" splits into
// "Risk Advisory", "Internal Audit", "IFC") rather than a fixed category
// list, since partner bios use varied phrasing. Matching is substring-based
// (see filteredMembers below), so picking "Risk" — or a tag containing it,
// like "Risk Advisory" — surfaces every partner whose sector text mentions
// risk, regardless of how that partner's phrase is worded.
const splitSectorTags = (raw: string): string[] =>
  raw
    .split(/[,&]/)
    .map((part) => part.trim().replace(/\.$/, ''))
    .filter((part) => part.length > 2)

const IconLinkedIn = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
)

const IconLocation = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
)

const IconSearch = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
  </svg>
)

// Results-count label: when a specific role is selected, the count should
// name that role (singular/plural), not a hardcoded "partner(s)" - a filter
// showing only Associates should say "Associates found", not "Partners
// found". Falls back to the role-neutral "member(s)" when the results are
// unfiltered by role (mixed roles, so no single role name applies).
const ROLE_PLURALS: Record<string, string> = {
  'Partner': 'Partners',
  'Associate': 'Associates',
  'Advisory Board Member': 'Advisory Board Members',
  'Governance Council': 'Governance Council Members',
}
const ROLE_SINGULARS: Record<string, string> = {
  'Governance Council': 'Governance Council Member',
}
const pluralRoleLabel = (role: string): string => ROLE_PLURALS[role] ?? `${role}s`
const resultsLabel = (role: string, count: number): string => {
  if (role === 'All') return count === 1 ? 'member' : 'members'
  if (count === 1) return ROLE_SINGULARS[role] ?? role
  return pluralRoleLabel(role)
}

const IconClose = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
  </svg>
)

function PartnerCard({ member, showCategory }: { member: Member; showCategory?: boolean }) {
  return (
    <div className="partner-card">
      <div className="partner-card__img-wrapper">
        {member.image ? (
          <LazyImage src={member.image} alt={member.name} className="partner-card__img" />
        ) : (
          <div className="partner-card__placeholder">
            <span>{member.name.charAt(0)}</span>
          </div>
        )}
      </div>

      <div className="partner-card__info">
        {showCategory && <span className="partner-card__category">{member.category}</span>}
        <h4 className="partner-card__name">{member.name}</h4>
        <p className="partner-card__creds">{member.creds}</p>

        <div className="partner-card__badges">
          <div className="partner-card__location">
            <IconLocation />
            <span>{member.location}</span>
          </div>
          <span className="partner-card__role">{member.role}</span>
        </div>

        <p className="partner-card__desc">{member.desc}</p>

        {member.sector.length > 0 && (
          <div className="partner-card__sectors">
            {member.sector.map((s) => (
              <span key={s} className="partner-card__sector-tag">{s}</span>
            ))}
          </div>
        )}

        <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="partner-card__social">
          <IconLinkedIn />
          <span>Connect</span>
        </a>
      </div>
    </div>
  )
}

export default function Partners() {
  useEffect(() => { window.scrollTo({ top: 0 }) }, [])

  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('All')
  const [role, setRole] = useState('All')
  const [sector, setSector] = useState('All')

  const { members: allMembers, sections, loading, error } = useLeadership()

  const locations = useMemo(
    () => Array.from(new Set(allMembers.map((m) => m.location))).sort(),
    [allMembers]
  )
  const roles = useMemo(() => {
    const held = new Set(allMembers.flatMap((m) => m.roles))
    return ROLE_ORDER.filter((r) => held.has(r))
  }, [allMembers])

  // Dedupe sector tags case-insensitively while keeping the first-seen casing
  // for display (e.g. "Risk Advisory" wins over a later "risk advisory").
  const sectors = useMemo(() => {
    const seen = new Map<string, string>()
    allMembers.forEach((m) => {
      m.sector.forEach((raw) => {
        splitSectorTags(raw).forEach((tag) => {
          const key = tag.toLowerCase()
          if (!seen.has(key)) seen.set(key, tag)
        })
      })
    })
    return Array.from(seen.values()).sort((a, b) => a.localeCompare(b))
  }, [allMembers])

  const isFiltering = search.trim() !== '' || location !== 'All' || role !== 'All' || sector !== 'All'

  const filteredMembers = useMemo(() => {
    const q = search.trim().toLowerCase()
    const sectorQuery = sector.toLowerCase()
    return allMembers.filter((m) => {
      if (q && !m.name.toLowerCase().includes(q)) return false
      if (location !== 'All' && m.location !== location) return false
      if (role !== 'All' && !m.roles.includes(role)) return false
      if (sector !== 'All' && !m.sector.some((s) => s.toLowerCase().includes(sectorQuery))) return false
      return true
    })
  }, [allMembers, search, location, role, sector])

  const clearFilters = () => {
    setSearch('')
    setLocation('All')
    setRole('All')
    setSector('All')
  }

  return (
    <div className="ap-page">
      {/* ════ HERO ════ */}
      <section className="ap-hero">
        <div className="ap-hero__bg" style={{ backgroundImage: `url(${imageUrl('Leadership.webp')})` }} />
        <div className="ap-hero__overlay" />
        <div className="ap-hero__content">
          <p className="ap-hero__eyebrow">Our Experts</p>
          <h1 className="ap-hero__title">Leadership Team</h1>
          <p className="ap-hero__sub">
            Meet the Governance Council, Senior Partners & Advisory Board Members steering JHS to new heights.
          </p>
        </div>
      </section>

      {/* ════ CONTENT ════ */}
      <section className="partners-section">
        <div className="ap-container">

          <div className="partners-intro">
            <h2>Driven by Experience</h2>
            <p>Our leadership comprises some of the most respected minds in the Accounting and Advisory profession, offering deep industry specializations and unparalleled insight.</p>
          </div>

          {/* ── FILTER BAR ── */}
          <div className="partners-filterbar">
            <div className="pf-search">
              <IconSearch />
              <input
                type="text"
                placeholder="Search by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search partners by name"
              />
              {search && (
                <button className="pf-search__clear" onClick={() => setSearch('')} aria-label="Clear search">
                  <IconClose />
                </button>
              )}
            </div>

            <div className="pf-selects">
              <select value={location} onChange={(e) => setLocation(e.target.value)} aria-label="Filter by location">
                <option value="All">All Locations</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>

              <select value={role} onChange={(e) => setRole(e.target.value)} aria-label="Filter by role">
                <option value="All">All Roles</option>
                {roles.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>

              <select value={sector} onChange={(e) => setSector(e.target.value)} aria-label="Filter by sector">
                <option value="All">All Sectors</option>
                {sectors.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              {isFiltering && (
                <button className="pf-clear" onClick={clearFilters}>
                  <IconClose /> Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* ── RESULTS ── */}
          {isFiltering ? (
            <div className="partners-results">
              <p className="partners-results__count">
                {filteredMembers.length} {resultsLabel(role, filteredMembers.length)} found
              </p>

              {filteredMembers.length > 0 ? (
                <div className="partner-grid">
                  {filteredMembers.map((member) => (
                    <PartnerCard key={member.id} member={member} showCategory />
                  ))}
                </div>
              ) : (
                <div className="partners-empty">
                  <p>No {role === 'All' ? 'members' : pluralRoleLabel(role)} match your filters.</p>
                  <button className="pf-clear pf-clear--solid" onClick={clearFilters}>
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="partners-list">
              {error && (
                <div className="partners-empty">
                  <p>We couldn't load our leadership team right now. Please try again shortly.</p>
                </div>
              )}
              {!loading && sections.map((section) => (
                <div key={section.category} className="partner-category">
                  <h3 className="partner-category__title">{section.category}</h3>

                  <div className={`partner-grid ${section.category === 'Governance Council' ? 'partner-grid--senior' : ''}`}>
                    {section.members.map((member) => (
                      <PartnerCard key={member.id} member={member} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

    </div>
  )
}
