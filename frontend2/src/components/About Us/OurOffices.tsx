import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './OurOffices.css'
import officeBg from '../../image/OfficesBG.avif'

/* ─── Office Data ─────────────────────────────────────────── */
const OFFICES = [
  {
    city: 'Mumbai',
    badge: 'Principal Headquarters',
    state: 'Maharashtra',
    route: '/city/mumbai',
    phone: '1800 120 1022',
    email: 'connect@jhsassociates.in',
    hours: 'Mon–Sat, 9:30 AM – 6:30 PM',
    isPrimary: true,
    branches: [
      { name: 'Andheri (East) — Head Office', address: 'Unit No. B-406 to 410, 4th Floor, Navkar Chambers, Marol Naka Metro Station, Andheri (East), Maharashtra – 400059' },
      { name: 'Borivali', address: '2201-2202, ESSPEE Tower, Opp. Oberoi Sky City, Near Prabhu Hotel, Borivali East, Maharashtra – 400066' },
      { name: 'Masjid Bunder', address: "Unit No. 402, 4th Floor, Nav Vyapar Bhavan, 49 P D'mello Road, Masjid Bunder, Maharashtra – 400009" },
      { name: 'Kalyan', address: 'Unit No. 11-12, Regency Avenue, Murbad Road, Kalyan (West), Maharashtra – 421301' },
    ],
  },
  {
    city: 'Ahmedabad',
    badge: 'Regional Hub',
    state: 'Gujarat',
    route: '/city/ahmedabad',
    phone: '+91 79 1234 5678',
    email: 'ahmedabad@jhsassociates.in',
    hours: 'Mon–Sat, 9:30 AM – 6:30 PM',
    isPrimary: false,
    branches: [
      { name: 'SG Highway — Head Office', address: 'B-1204, Westgate Business Bay, Near YMCA Club, SG Highway, Ahmedabad, Gujarat – 380054' },
      { name: 'Navrangpura', address: '302, Shilp Zaveri, Near Law Garden, Navrangpura, Ahmedabad, Gujarat – 380009' },
    ],
  },
  {
    city: 'Delhi',
    badge: 'National Capital Office',
    state: 'NCR',
    route: '/city/delhi',
    phone: '+91 11 1234 5678',
    email: 'delhi@jhsassociates.in',
    hours: 'Mon–Sat, 9:30 AM – 6:30 PM',
    isPrimary: false,
    branches: [
      { name: 'Connaught Place — Head Office', address: '301, 3rd Floor, Antriksh Bhawan, 22 Kasturba Gandhi Marg, Connaught Place, New Delhi – 110001' },
      { name: 'Noida', address: 'A-12, Sector 16, Noida, Uttar Pradesh – 201301' },
    ],
  },
  {
    city: 'Hyderabad',
    badge: 'South India Tech Hub',
    state: 'Telangana',
    route: '/city/hyderabad',
    phone: '+91 40 1234 5678',
    email: 'hyderabad@jhsassociates.in',
    hours: 'Mon–Sat, 9:30 AM – 6:30 PM',
    isPrimary: false,
    branches: [
      { name: 'HITEC City — Head Office', address: '8th Floor, Cyber Towers, HITEC City, Madhapur, Hyderabad, Telangana – 500081' },
      { name: 'Banjara Hills', address: '201, 2nd Floor, Lumbini Avenue, Road No. 2, Banjara Hills, Hyderabad, Telangana – 500034' },
    ],
  },
  {
    city: 'Bengaluru',
    badge: 'Silicon Valley Office',
    state: 'Karnataka',
    route: '/city/bengaluru',
    phone: '+91 80 1234 5678',
    email: 'bengaluru@jhsassociates.in',
    hours: 'Mon–Sat, 9:30 AM – 6:30 PM',
    isPrimary: false,
    branches: [
      { name: 'Koramangala — Head Office', address: '4th Floor, Prestige Meridian, 29 MG Road, Koramangala, Bengaluru, Karnataka – 560034' },
      { name: 'Whitefield', address: '502, 5th Floor, Salarpuria Softzone, Whitefield, Bengaluru, Karnataka – 560066' },
    ],
  },
  {
    city: 'Vadodara',
    badge: 'Cultural Capital Office',
    state: 'Gujarat',
    route: '/city/vadodara',
    phone: '+91 265 1234 5678',
    email: 'vadodara@jhsassociates.in',
    hours: 'Mon–Sat, 9:30 AM – 6:30 PM',
    isPrimary: false,
    branches: [
      { name: 'Alkapuri — Head Office', address: '301, 3rd Floor, Kumar Plaza, Alkapuri, Vadodara, Gujarat – 390007' },
      { name: 'Fatehgunj', address: '102, Dev Complex, Near BSNL Office, Fatehgunj, Vadodara, Gujarat – 390002' },
    ],
  },
  {
    city: 'Kolkata',
    badge: 'Eastern India Gateway',
    state: 'West Bengal',
    route: '/city/kolkata',
    phone: '+91 33 1234 5678',
    email: 'kolkata@jhsassociates.in',
    hours: 'Mon–Sat, 9:30 AM – 6:30 PM',
    isPrimary: false,
    branches: [
      { name: 'Park Street — Head Office', address: '6th Floor, Chatterjee International, 33A JL Nehru Road, Park Street, Kolkata, West Bengal – 700071' },
      { name: 'Salt Lake', address: 'Block EP, Salt Lake Sector V, Bidhannagar, Kolkata, West Bengal – 700091' },
    ],
  },
  {
    city: 'Chennai',
    badge: 'South India Financial Hub',
    state: 'Tamil Nadu',
    route: '/city/chennai',
    phone: '+91 44 1234 5678',
    email: 'chennai@jhsassociates.in',
    hours: 'Mon–Sat, 9:30 AM – 6:30 PM',
    isPrimary: false,
    branches: [
      { name: 'T. Nagar — Head Office', address: '7th Floor, Abacus Tower, 1-F Venkatnarayana Road, T. Nagar, Chennai, Tamil Nadu – 600017' },
      { name: 'Anna Nagar', address: '201, 2nd Floor, Tower C, Anna Nagar Eastern Extn, Chennai, Tamil Nadu – 600102' },
    ],
  },
]

/* ─── Icons ───────────────────────────────────────────────── */
const IconPin = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
)
const IconPhone = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.44 2 2 0 0 1 3.59 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.18 6.18l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)
const IconMail = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
  </svg>
)
const IconClock = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
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

  useEffect(() => { window.scrollTo({ top: 0 }) }, [])

  const activeOffice = OFFICES.find(o => o.city === activeCity) ?? OFFICES[0]

  return (
    <div className="oo-page">

      {/* ════ HERO ════ */}
      <section className="oo-hero">
        <div className="oo-hero__bg" style={{ backgroundImage: `url(${officeBg})` }} />
        <div className="oo-hero__overlay" />
        <div className="oo-hero__content">
          <p className="oo-hero__eyebrow">JHS &amp; Associates LLP</p>
          <h1 className="oo-hero__title">Our Offices</h1>
          <p className="oo-hero__sub">
            8 cities &nbsp;·&nbsp; 16+ locations &nbsp;·&nbsp; Pan-India presence
          </p>
        </div>
        {/* Stats bar */}
        <div className="oo-hero__stats">
          <div className="oo-hero__stat"><span className="oo-hero__stat-num">8</span><span className="oo-hero__stat-label">Cities</span></div>
          <div className="oo-hero__stat-div" />
          <div className="oo-hero__stat"><span className="oo-hero__stat-num">16+</span><span className="oo-hero__stat-label">Locations</span></div>
          <div className="oo-hero__stat-div" />
          <div className="oo-hero__stat"><span className="oo-hero__stat-num">200+</span><span className="oo-hero__stat-label">Professionals</span></div>
          <div className="oo-hero__stat-div" />
          <div className="oo-hero__stat"><span className="oo-hero__stat-num">30+</span><span className="oo-hero__stat-label">Years of Trust</span></div>
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
                onClick={() => setActiveCity(o.city)}
              >
                {o.city}
                {o.isPrimary && <span className="oo-tab__hq">HQ</span>}
              </button>
            ))}
          </div>

          {/* Active office detail card */}
          <div className="oo-detail" key={activeOffice.city}>
            <div className="oo-detail__left">
              <div className="oo-detail__badge-row">
                <span className="oo-detail__badge">{activeOffice.badge}</span>
                <span className="oo-detail__state">{activeOffice.state}</span>
              </div>
              <h2 className="oo-detail__city">{activeOffice.city}</h2>

              {/* Contact grid */}
              <div className="oo-detail__contact">
                <div className="oo-detail__contact-item">
                  <span className="oo-detail__contact-icon"><IconPhone /></span>
                  <div>
                    <span className="oo-detail__contact-label">Phone</span>
                    <a href={`tel:${activeOffice.phone}`} className="oo-detail__contact-val">{activeOffice.phone}</a>
                  </div>
                </div>
                <div className="oo-detail__contact-item">
                  <span className="oo-detail__contact-icon"><IconMail /></span>
                  <div>
                    <span className="oo-detail__contact-label">Email</span>
                    <a href={`mailto:${activeOffice.email}`} className="oo-detail__contact-val">{activeOffice.email}</a>
                  </div>
                </div>
                <div className="oo-detail__contact-item">
                  <span className="oo-detail__contact-icon"><IconClock /></span>
                  <div>
                    <span className="oo-detail__contact-label">Business Hours</span>
                    <span className="oo-detail__contact-val">{activeOffice.hours}</span>
                  </div>
                </div>
              </div>

              <Link to={activeOffice.route} className="oo-detail__cta">
                View {activeOffice.city} Office
                <IconArrow />
              </Link>
            </div>

            <div className="oo-detail__right">
              <h3 className="oo-detail__branches-title">
                <IconPin /> Locations in {activeOffice.city}
              </h3>
              <div className="oo-detail__branches">
                {activeOffice.branches.map((b, i) => (
                  <div key={b.name} className="oo-detail__branch">
                    <div className="oo-detail__branch-num">0{i + 1}</div>
                    <div className="oo-detail__branch-info">
                      <span className="oo-detail__branch-name">{b.name}</span>
                      <span className="oo-detail__branch-addr">{b.address}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════ ALL OFFICES GRID ════ */}
      <section className="oo-grid-section">
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
                <div className="oo-card__info-row">
                  <IconPhone />
                  <span>{o.phone}</span>
                </div>
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
      </section>

    </div>
  )
}
