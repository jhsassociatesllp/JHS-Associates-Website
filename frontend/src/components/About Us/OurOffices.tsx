import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './OurOffices.css'
import { imageUrl } from '../../utils/imageUrl'
import { mapEmbedUrlFor } from '../../utils/mapEmbedUrl'

/* ─── Office Data ─────────────────────────────────────────── */
interface OfficeBranch {
  name: string
  address: string
  lat?: number
  lng?: number
  // Optional branch email — shown with the selected location. Falls back to
  // the city's own email when a branch doesn't have one. (Phone numbers are
  // intentionally not shown anywhere on this page.)
  email?: string
}

interface OfficeCity {
  city: string
  badge: string
  state: string
  route: string
  email: string
  isPrimary: boolean
  branches: OfficeBranch[]
}

const OFFICES: OfficeCity[] = [
  {
    city: 'Mumbai',
    badge: 'Principal Headquarters',
    state: 'Maharashtra',
    route: '/city/mumbai',
    email: 'connect@jhsassociates.in',
    isPrimary: true,
    branches: [
      { name: 'Andheri (East) Head Office', address: 'Unit No. B-406 to 410, 4th floor, Navkar Chambers, Marol Naka Metro Station, Andheri (East). Maharashtra – 400059', lat: 19.1073677, lng: 72.8804167 },
      { name: 'Mazgaon', address: 'Shop No. 11A, 345, New Sai Niketan CHS Ltd. Dr Mascarenhas Road, Mazgaon, Mumbai – 400010', email: 'mazgaon@jhsassociates.in' },
      { name: 'Masjid Bunder', address: "Unit No.402, 4th floor, Nav Vyapar Bhavan, 49 P.D’mello Road, MB, Maharashtra - 400009", email: 'masjidbunder@jhsassociates.in' },
      { name: 'Kalyan', address: 'Unit No 11-12,Regency Avenue, Murbad Road Kalyan (West). Maharashtra - 421301', email: 'kalyan@jhsassociates.in' },
    ],
  },
  {
    city: 'Gujarat',
    badge: 'Regional Hub',
    state: 'Gujarat',
    route: '/city/gujarat',
    email: 'kalpesh.parmar@jhsassociates.in',
    isPrimary: false,
    branches: [
      { name: 'Ahmedabad ', address: 'Level 10, 1016–21, Swati Clover, Shilaj Circle, Sardar Patel Ring Road, Thaltej, Ahmedabad, Gujarat – 380054', email: 'ahmedabad@jhsassociates.in' },
      { name: 'Vadodara', address: '4th floor, Lila Chambers, Notus Pride,Vadodara. Gujarat-390023', email: 'vadodara@jhsassociates.in' },
      { name: 'Rajkot', address: 'B 303, Kings Heights, Vidya Kunj Society, Main Road, Near Amin Marg, Rajkot, Gujarat - 360001', email: 'rajkot@jhsassociates.in' },
      { name: 'Surat', address: '504, 5th Floor, Shubh square. Opp Venus Hospital, Lal Darwaja, Gotalawadi Road,Gujarat  – 395003', email: 'surat@jhsassociates.in' },
      { name: 'Vapi', address: 'Unit No.101, Saga Casa, Daulat Nagar, Vapi. Gujarat - 396215', email: 'vapi@jhsassociates.in' },
    ],
  },
  {
    city: 'Delhi',
    badge: 'National Capital Office',
    state: 'Delhi',
    route: '/city/delhi',
    email: 'nikhel.kochhar@jhsassociates.in',
    isPrimary: false,
    branches: [
      { name: 'Delhi', address: 'Unit No.306, DLF Centre, Savitri Cinema Complex, Delhi - 110048' },
    ],
  },
  {
    city: 'Hyderabad',
    badge: 'South India Tech Hub',
    state: 'Telangana',
    route: '/city/hyderabad',
    email: 'hyderabad@jhsassociates.in',
    isPrimary: false,
    branches: [
      {
        name: 'Hyderabad ', address: '6-3-788/36 & 37/A, "Badhe House", First Floor, Ameerpet, Durganagar, Hyderabad, Telangana - 500016'
      },
    ],
  },
  {
    city: 'Bengaluru',
    badge: 'Silicon Valley Office',
    state: 'Karnataka',
    route: '/city/bengaluru',
    email: 'narayana.malla@jhsassociates.in',
    isPrimary: false,
    branches: [
      { name: 'Bengaluru ', address: '3rd Floor, Aria, No. 541 AECS Layout Main Road, Above Costa Coffee, Bangalore – 560 037' },
    ],
  },
  {
    city: 'Kolkata',
    badge: 'Eastern India Gateway',
    state: 'West Bengal',
    route: '/city/kolkata',
    email: 'sharad.mohata@jhsassociates.in',
    isPrimary: false,
    branches: [
      {
        name: 'Kolkata ', address: 'Unit No.402, 4th floor, Vardhan Complex, 25A Camac Street, Kolkata. West Bengal - 700016'
      },
    ],
  },
  {
    city: 'Chennai',
    badge: 'South India Financial Hub',
    state: 'Tamil Nadu',
    route: '/city/chennai',
    email: 'chandrasekaran@jhsassociates.in',
    isPrimary: false,
    branches: [
      {
        name: 'T. Nagar ', address: 'No: 43/65, South West Boag Road,T-Nagar, Chennai – 600017'
      },
    ],
  },
  {
    city: 'Global',
    badge: 'International Offices',
    state: 'Worldwide',
    route: '/city/global',
    email: 'vinod.joshi@jhsuae.com',
    isPrimary: false,
    branches: [
      { name: 'Dubai, UAE', address: '1703, Sheikh Rashid Tower, Dubai World Trade Center, Sheikh Zayed Road, Dubai, U.A.E', email: 'dubai@jhsuae.com' },
      { name: 'Muscat, Oman', address: 'P.O. Box : 3840, P. Code : 112, Ruwi, Muscat, Sultanate of Oman', email: 'muscat@jhsuae.com' },
      { name: 'Amersham, UK', address: '1st Floor Merritt House, Hill Avenue, Amersham HP6 5BQ, United Kingdom', email: 'amersham@jhsuae.com' },
    ],
  }
]

/* ─── Icons ───────────────────────────────────────────────── */
const IconPin = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
)
const IconMail = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
  </svg>
)
const IconArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
)

/* ─── Component ───────────────────────────────────────────── */
export default function OurOffices() {
  const [activeCity, setActiveCity] = useState('Mumbai')
  const [activeBranchIdx, setActiveBranchIdx] = useState(0)

  useEffect(() => { window.scrollTo({ top: 0 }) }, [])

  const activeOffice = OFFICES.find(o => o.city === activeCity) ?? OFFICES[0]
  const activeBranch = activeOffice.branches[activeBranchIdx] ?? activeOffice.branches[0]
  // The first location listed for a city is its main office; the rest are branches.
  const mainOffice = activeOffice.branches[0]
  const otherBranches = activeOffice.branches.slice(1)

  const handleCityChange = (city: string) => {
    setActiveCity(city)
    setActiveBranchIdx(0)
  }

  return (
    <div className="oo-page">

      {/* ════ HERO ════ */}
      <section className="oo-hero">
        <div className="oo-hero__bg" style={{ backgroundImage: `url(${imageUrl('OfficesBG.webp')})` }} />
        <div className="oo-hero__overlay" />
        <div className="oo-hero__content">
          {/* <p className="oo-hero__eyebrow">JHS</p> */}
          <h1 className="oo-hero__title">Our Offices</h1>
          <p className="oo-hero__sub">
            10 cities · 14+ locations · Pan-India &amp; Global
          </p>
        </div>
        {/* Stats bar */}
        <div className="oo-hero__stats">
          <div className="oo-hero__stat"><span className="oo-hero__stat-num">10</span><span className="oo-hero__stat-label">Cities</span></div>
          <div className="oo-hero__stat-div" />
          <div className="oo-hero__stat"><span className="oo-hero__stat-num">14</span><span className="oo-hero__stat-label">Locations</span></div>
          <div className="oo-hero__stat-div" />
          <div className="oo-hero__stat"><span className="oo-hero__stat-num">700+</span><span className="oo-hero__stat-label">Professionals</span></div>
          <div className="oo-hero__stat-div" />
          {/* <div className="oo-hero__stat"><span className="oo-hero__stat-num">30+</span><span className="oo-hero__stat-label">Years of Trust</span></div> */}
        </div>
      </section>

      {/* ════ OFFICE EXPLORER ════ */}
      <section className="oo-explorer">
        <div className="oo-container">

          {/* City tab bar */}
          <div className="oo-tabs">
            {OFFICES.map(o => (
              <button
                key={o.city}
                className={`oo-tab ${activeCity === o.city ? 'oo-tab--active' : ''}`}
                onClick={() => handleCityChange(o.city)}
              >
                {o.city}
                {o.isPrimary && <span className="oo-tab__hq">HQ</span>}
              </button>
            ))}
          </div>

          {/* Active city: header, main office + branches, map */}
          <div className="oo-office" key={activeOffice.city}>
            <header className="oo-office__head">
              <div className="oo-office__title">
                <div className="oo-office__badges">
                  <span className="oo-office__badge">{activeOffice.badge}</span>
                  <span className="oo-office__state">{activeOffice.state}</span>
                </div>
                <h2 className="oo-office__city">{activeOffice.city}</h2>
                <p className="oo-office__count">
                  {mainOffice ? '1 main office' : ''}
                  {otherBranches.length > 0 && ` · ${otherBranches.length} branch${otherBranches.length > 1 ? 'es' : ''}`}
                </p>
              </div>

              <div className="oo-office__actions">
                <div className="oo-office__contact">
                  <a href={`mailto:${activeOffice.email}`} className="oo-office__chip">
                    <IconMail /> {activeOffice.email}
                  </a>
                </div>
                <Link to={activeOffice.route} className="oo-detail__cta">
                  View {activeOffice.city} Office
                  <IconArrow />
                </Link>
              </div>
            </header>

            <div className="oo-office__body">
              <div className="oo-office__list">
                <p className="oo-office__label">Main Office</p>
                <button
                  type="button"
                  className={`oo-loc oo-loc--main ${activeBranchIdx === 0 ? 'oo-loc--active' : ''}`}
                  onClick={() => setActiveBranchIdx(0)}
                  aria-pressed={activeBranchIdx === 0}
                >
                  <span className="oo-loc__icon"><IconPin /></span>
                  <span className="oo-loc__text">
                    <span className="oo-loc__name">{mainOffice.name.trim()}</span>
                    <span className="oo-loc__addr">{mainOffice.address}</span>
                  </span>
                </button>

                {otherBranches.length > 0 && (
                  <>
                    <p className="oo-office__label oo-office__label--branches">
                      Branch Offices <span className="oo-office__label-count">{otherBranches.length}</span>
                    </p>
                    <div className="oo-office__branches">
                      {otherBranches.map((b, i) => (
                        <button
                          key={b.name}
                          type="button"
                          className={`oo-loc ${activeBranchIdx === i + 1 ? 'oo-loc--active' : ''}`}
                          onClick={() => setActiveBranchIdx(i + 1)}
                          aria-pressed={activeBranchIdx === i + 1}
                        >
                          <span className="oo-loc__icon"><IconPin /></span>
                          <span className="oo-loc__text">
                            <span className="oo-loc__name">{b.name.trim()}</span>
                            <span className="oo-loc__addr">{b.address}</span>
                          </span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <aside className="oo-office__map" key={`${activeOffice.city}-${activeBranchIdx}`}>
                <div className="oo-office__frame">
                  <iframe
                    title={`JHS ${activeOffice.city} — ${activeBranch.name.trim()}`}
                    src={mapEmbedUrlFor(activeBranch)}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </div>
                <div className="oo-office__mapinfo">
                  <div className="oo-office__mapinfo-text">
                    <span className="oo-office__mapinfo-name">
                      {activeBranch.name.trim()}
                      {activeBranchIdx === 0 && <span className="oo-office__mapinfo-tag">Main Office</span>}
                    </span>
                    <a href={`mailto:${activeBranch.email ?? activeOffice.email}`} className="oo-office__mapinfo-mail">
                      <IconMail /> {activeBranch.email ?? activeOffice.email}
                    </a>
                  </div>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(activeBranch.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="oo-map__directions"
                  >
                    Get Directions <IconArrow />
                  </a>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>

      {/* ════ ALL OFFICES GRID ════ */}
      {/* <section className="oo-grid-section">
        <div className="oo-container">
          <div className="oo-section-hdr">
            <span className="oo-section-hdr__tag">Pan-India Network</span>
            <h2 className="oo-section-hdr__title">All Office Locations</h2>
            <p className="oo-section-hdr__sub">Click any office to explore partners, addresses and services.</p>
          </div>

          <div className="oo-grid">
            {OFFICES.map(o => (
              <Link key={o.city} to={o.route} className={`oo-card ${o.isPrimary ? 'oo-card--primary' : ''}`}>
                <div className="oo-card__top">
                  <span className="oo-card__badge">{o.badge}</span>
                  {o.isPrimary && <span className="oo-card__hq-badge">HQ</span>}
                </div>
                <h3 className="oo-card__city">{o.city}</h3>
                <p className="oo-card__state">{o.state}</p>
                <div className="oo-card__divider" />
                {o.phone && (
                  <div className="oo-card__info-row">
                    <IconPhone />
                    <span>{o.phone}</span>
                  </div>
                )}
                <div className="oo-card__info-row">
                  <IconMail />
                  <span>{o.email}</span>
                </div>
                <div className="oo-card__info-row">
                  <IconClock />
                  <span>{o.hours}</span>
                </div>
                <div className="oo-card__footer">
                  <span>{o.branches.length} location{o.branches.length > 1 ? 's' : ''}</span>
                  <span className="oo-card__arrow"><IconArrow /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section> */}

    </div>
  )
}
