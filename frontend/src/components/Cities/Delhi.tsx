import { useEffect, useState } from 'react'
import './Delhi.css'

/* ─── Hero background ───────────────────────────────── */
import delhiBg from '../../image/Dehli.avif'

/* ─── Partner Image Imports ─────────────────────────── */
import imgNikhel from '../../image/Nikhel-Kochhar-removebg-preview.png'
import imgSharad from '../../image/Sharad-Mohata-removebg-preview.png'
import imgSunil from '../../image/Sunil-Pathak-removebg-preview.png'
import imgVirendra from '../../image/Virendra-Nayyar-removebg-preview.png'

/* ─── Partner Data ─────────────────────────────────── */
const PARTNERS = [
  { name: 'Nikhel Kochhar', image: imgNikhel, qualifications: 'FCA', designation: 'Statutory Audit & Assurance', email: 'nikhel.kochhar@jhsassociates.in', linkedin: 'https://www.linkedin.com/in/nikhel-kochhar' },
  { name: 'Sharad Mohata', image: imgSharad, qualifications: 'FCA', designation: 'Tax & Corporate Advisory', email: 'sharad.mohata@jhsassociates.in', linkedin: 'https://www.linkedin.com/in/sharad-mohata' },
  { name: 'Sunil Pathak', image: imgSunil, qualifications: 'FCA', designation: 'Risk Advisory & Internal Audit', email: 'sunil.pathak@jhsassociates.in', linkedin: 'https://www.linkedin.com/in/sunil-pathak' },
  { name: 'Virendra Nayyar', image: imgVirendra, qualifications: 'FCA', designation: 'Regulatory & Compliance', email: 'virendra.nayyar@jhsassociates.in', linkedin: 'https://www.linkedin.com/in/virendra-nayyar' },
]

/* ─── Sector SVG Icons ───────────────────────────────── */
const SectorIcons: Record<string, JSX.Element> = {
  'Real Estate': (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 20 L20 7 L35 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="9" y="20" width="22" height="14" rx="1" stroke="currentColor" strokeWidth="1.8" />
      <rect x="16" y="24" width="8" height="10" rx="0.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  ),
  Infrastructure: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 34 L10 14 L30 14 L30 34" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 24 L30 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M10 14 L20 6 L30 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 14 L15 34 M25 14 L25 34" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  FMCG: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 8 L10 8 L14 26 L30 26 L34 14 L12 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="16" cy="32" r="2.5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="28" cy="32" r="2.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  ),
  Retail: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="16" width="24" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M14 16 L14 12 C14 8.7 16.7 6 20 6 C23.3 6 26 8.7 26 12 L26 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M14 22 L26 22" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  'Family-Owned Business': (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="14" cy="13" r="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="26" cy="17" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path d="M6 32 C6 27.6 9.6 24 14 24 C16.5 24 18.7 25.1 20.1 26.9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M19.9 32 C19.9 28.5 22.3 25.5 25.6 24.9 C25.7 24.8 25.9 24.8 26 24.8 C29.9 24.8 33 28 33 32" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
}

/* ─── Sectors ─────────────────────────────────────── */
const SECTORS = ['Real Estate', 'Infrastructure', 'FMCG', 'Retail', 'Family-Owned Business']

/* ─── Specialisations ─────────────────────────────── */
const SPECIALIZATIONS = [
  { label: 'Risk-Based Internal Audit', g: 'a' },
  { label: "SOP's", g: 'b' },
  { label: 'Dispute Resolution', g: 'c' },
]

/* ─── Map Locations ───────────────────────────────── */
const MAP_LOCATIONS = [
  {
    id: 'delhi', name: 'Delhi (Head Office)', tag: 'Head Office',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.9!2d77.2195!3d28.6315!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b347eb62d%3A0x52c2b7494e204dce!2sConnaught%20Place%2C%20New%20Delhi%2C%20Delhi%20110001!5e0!3m2!1sen!2sin!4v1680000000002!5m2!1sen!2sin',
    address: '306 DIF Center, Savitri Cinema Complex, Greater Kailash-II, Delhi – 110048'
  },
  {
    id: 'connaughtplace', name: 'Connaught Place', tag: 'Branch',
    mapUrl: 'https://maps.google.com/maps?q=Antriksh%20Bhawan,%20Kasturba%20Gandhi%20Marg,%20Connaught%20Place,%20New%20Delhi&t=&z=15&ie=UTF8&iwloc=&output=embed',
    address: '301, 3rd Floor, Antriksh Bhawan, 22 Kasturba Gandhi Marg, Connaught Place, New Delhi – 110001'
  },
  {
    id: 'noida', name: 'Noida', tag: 'Branch',
    mapUrl: 'https://maps.google.com/maps?q=Sector%2016,%20Noida,%20Uttar%20Pradesh&t=&z=15&ie=UTF8&iwloc=&output=embed',
    address: 'A-12, Sector 16, Noida, Uttar Pradesh – 201301'
  },
]

/* ─── Icons ──────────────────────────────────────── */
const IconMail = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>)
const IconLinkedIn = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>)
const IconPin = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>)
const IconCheck = () => (<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>)

/* ─── Page ───────────────────────────────────────── */
export default function Delhi() {
  const [activeLocation, setActiveLocation] = useState(MAP_LOCATIONS[0])
  useEffect(() => { window.scrollTo({ top: 0 }) }, [])

  return (
    <div className="del-page">

      {/* ══ HERO ══ */}
      <section className="del-hero">
        <div className="del-hero__photo" style={{ backgroundImage: `url(${delhiBg})` }} />
        <div className="del-hero__overlay" />
        <div className="del-hero__content">
          <span className="del-hero__eyebrow">JHS &amp; Associates LLP</span>
          <h1 className="del-hero__title">Delhi</h1>
          <p className="del-hero__sub">National Capital &amp; Strategic North India Office</p>
        </div>
        <div className="del-hero__card">
          <div className="del-hero__card-left">
            <span className="del-hero__card-badge">Head Office — Greater Kailash-II</span>
            <div className="del-hero__card-addr"><IconPin /><span>306 DIF Center, Savitri Cinema Complex, Greater Kailash-II, Delhi – 110048</span></div>
          </div>
          <div className="del-hero__card-divider" />
          <div className="del-hero__card-right">
            <div className="del-hero__card-stat"><span className="del-hero__card-stat-label">Phone</span><span className="del-hero__card-stat-val">+91 11 1234 5678</span></div>
            <div className="del-hero__card-stat"><span className="del-hero__card-stat-label">Email</span><span className="del-hero__card-stat-val">delhi@jhsassociates.in</span></div>
            <div className="del-hero__card-stat"><span className="del-hero__card-stat-label">Hours</span><span className="del-hero__card-stat-val">Mon–Sat, 9:30 AM – 6:30 PM</span></div>
          </div>
        </div>
      </section>

      {/* ══ STATS RIBBON ══ */}
      <div className="del-ribbon">
        <div className="del-ribbon__inner">
          {([['4+', 'Expert Partners'], ['5', 'Sectors Served'], ['3', 'Specialisations'], ['3', 'Delhi-NCR Offices']] as [string, string][]).map(([num, lbl]) => (
            <div key={lbl} className="del-ribbon__item"><span className="del-ribbon__num">{num}</span><span className="del-ribbon__lbl">{lbl}</span></div>
          ))}
        </div>
      </div>

      {/* ══ SECTORS SERVED ══ */}
      <section className="del-section del-sectors-section">
        <div className="del-container">
          <div className="del-section-hdr">
            <span className="del-section-hdr__tag">Industries</span>
            <h2 className="del-section-hdr__title">Sectors Served</h2>
            <p className="del-section-hdr__sub">Deep domain expertise across Delhi-NCR's most dynamic industries — built through years of hands-on client engagement.</p>
          </div>
          <div className="del-sectors-grid">
            {SECTORS.map((s, i) => (
              <div key={s} className="del-sector-card" style={{ animationDelay: `${i * 0.06}s` }}>
                <div className="del-sector-card__icon-wrap">{SectorIcons[s]}</div>
                <span className="del-sector-card__label">{s}</span>
                <div className="del-sector-card__line" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ WE SPECIALISE IN ══ */}
      <section className="del-section del-specials-section">
        <div className="del-container">
          <div className="del-specials-inner">
            <div className="del-specials-left">
              <span className="del-section-hdr__tag del-section-hdr__tag--white">Expertise</span>
              <h2 className="del-specials-title">We Specialise In</h2>
              <p className="del-specials-body">From risk-based audit frameworks to dispute resolution, our Delhi team delivers targeted advisory across North India's real estate and infrastructure sectors.</p>
              <div className="del-specials-accent-line" />
              <p className="del-specials-note">Each specialisation is backed by certified professionals with real-world project experience.</p>
            </div>
            <div className="del-specials-right">
              <div className="del-specials-grid">
                {SPECIALIZATIONS.map((s, i) => (
                  <div key={s.label} className={`del-special-pill del-special-pill--${s.g}`} style={{ animationDelay: `${i * 0.04}s` }}>
                    <span className="del-special-pill__check"><IconCheck /></span><span>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ PARTNERS ══ */}
      <section className="del-section del-partners-section">
        <div className="del-container">
          <div className="del-section-hdr">
            <span className="del-section-hdr__tag">Our Team</span>
            <h2 className="del-section-hdr__title">Delhi Partners</h2>
            <p className="del-section-hdr__sub">Meet the leaders driving excellence across audit, tax, advisory, and assurance in Delhi.</p>
          </div>
          <div className="del-partners-grid">
            {PARTNERS.map(p => (
              <div key={p.name} className="del-pc-card">
                <div className="del-pc-avatar"><img src={p.image} alt={p.name} className="del-pc-avatar__img" /></div>
                <div className="del-pc-info"><h3 className="del-pc-name">{p.name}</h3><p className="del-pc-quals">{p.qualifications}</p><p className="del-pc-desig">{p.designation}</p></div>
                <div className="del-pc-social">
                  <a href={`mailto:${p.email}`} className="del-pc-btn del-pc-btn--mail"><IconMail /><span>Email</span></a>
                  <a href={p.linkedin} target="_blank" rel="noopener noreferrer" className="del-pc-btn del-pc-btn--li"><IconLinkedIn /><span>LinkedIn</span></a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ MAP ══ */}
      <section className="del-map-section">
        <div className="del-container">
          <div className="del-section-hdr">
            <span className="del-section-hdr__tag">Locations</span>
            <h2 className="del-section-hdr__title">Our Offices in Delhi-NCR</h2>
            <p className="del-section-hdr__sub">Select a location to view it on the map.</p>
          </div>
          <div className="del-map-tabs">
            {MAP_LOCATIONS.map(loc => (
              <button key={loc.id} className={`del-map-tab ${activeLocation.id === loc.id ? 'active' : ''}`} onClick={() => setActiveLocation(loc)}>
                <IconPin /><span>{loc.name}</span>
                {loc.tag === 'Head Office' && <span className="del-map-tab__badge">HQ</span>}
              </button>
            ))}
          </div>
          <div className="del-map-layout">
            <div className="del-map-info-card">
              <div className="del-map-info-tag">{activeLocation.tag}</div>
              <h3 className="del-map-info-title">{activeLocation.name}</h3>
              <div className="del-map-info-addr-row"><IconPin /><p className="del-map-info-addr">{activeLocation.address}</p></div>
              <a href={`https://maps.google.com/?q=${encodeURIComponent(activeLocation.address)}`} target="_blank" rel="noopener noreferrer" className="del-map-directions-btn">Get Directions →</a>
            </div>
            <div className="del-map-wrap">
              <iframe title={`JHS ${activeLocation.name}`} src={activeLocation.mapUrl} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
          </div>
        </div>
      </section>

      {/* ══ BRANCHES ══ */}
      <section className="del-branches-section">
        <div className="del-container">
          <div className="del-section-hdr">
            <span className="del-section-hdr__tag">Sub-Offices</span>
            <h2 className="del-section-hdr__title">Delhi-NCR Sub-Offices</h2>
            <p className="del-section-hdr__sub">Strategically located across Delhi-NCR's key business corridors for easier client access.</p>
          </div>
          <div className="del-branches-grid">
            {[
              { name: 'Connaught Place', num: '01', address: '301, 3rd Floor, Antriksh Bhawan, 22 Kasturba Gandhi Marg, Connaught Place, New Delhi – 110001' },
              { name: 'Noida', num: '02', address: 'A-12, Sector 16, Noida, Uttar Pradesh – 201301' },
            ].map(b => (
              <div key={b.name} className="del-branch-card">
                <div className="del-branch-card__num">{b.num}</div>
                <div className="del-branch-card__content">
                  <div className="del-branch-card__icon-wrap"><IconPin /></div>
                  <h3 className="del-branch-card__name">{b.name}</h3>
                  <p className="del-branch-card__addr">{b.address}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}