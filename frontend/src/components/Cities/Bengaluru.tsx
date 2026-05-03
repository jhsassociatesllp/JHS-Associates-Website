import { useEffect, useState } from 'react'
import './Bengaluru.css'

import bengaluruBg from '../../image/Bengluru.avif'
import imgSaurabh from '../../image/Saurabh-Shah-removebg-preview.png'
import imgHitesh from '../../image/Hitesh-Khandelwal-removebg-preview.png'
import imgAlpesh from '../../image/Alpesh-Vaniya-removebg-preview.png'

const PARTNERS = [
  { name: 'Saurabh Shah', image: imgSaurabh, qualifications: 'FCA', designation: 'Statutory Audit & Ind AS', email: 'saurabh.shah.blr@jhsassociates.in', linkedin: 'https://www.linkedin.com/in/saurabh-shah-blr' },
  { name: 'Hitesh Khandelwal', image: imgHitesh, qualifications: 'FCA', designation: 'Risk Advisory & Internal Audit', email: 'hitesh.khandelwal.blr@jhsassociates.in', linkedin: 'https://www.linkedin.com/in/hitesh-khandelwal-blr' },
  { name: 'Alpesh Vaniya', image: imgAlpesh, qualifications: 'FCA', designation: 'Statutory Audit & Assurance', email: 'alpesh.vaniya.blr@jhsassociates.in', linkedin: 'https://www.linkedin.com/in/alpesh-vaniya-blr' },
]

const SectorIcons: Record<string, JSX.Element> = {
  BFSI: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 16 L20 7 L35 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="5" y="16" width="30" height="2.5" rx="1" stroke="currentColor" strokeWidth="1.6" />
      <rect x="8" y="20" width="5" height="10" rx="0.5" stroke="currentColor" strokeWidth="1.6" />
      <rect x="17.5" y="20" width="5" height="10" rx="0.5" stroke="currentColor" strokeWidth="1.6" />
      <rect x="27" y="20" width="5" height="10" rx="0.5" stroke="currentColor" strokeWidth="1.6" />
      <rect x="5" y="30" width="30" height="2.5" rx="1" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="20" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  FMCG: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 8 L10 8 L14 26 L30 26 L34 14 L12 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="16" cy="32" r="2.5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="28" cy="32" r="2.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  ),
  'Real Estate': (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 20 L20 7 L35 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="9" y="20" width="22" height="14" rx="1" stroke="currentColor" strokeWidth="1.8" />
      <rect x="16" y="24" width="8" height="10" rx="0.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  ),
}

const SECTORS = ['BFSI', 'FMCG', 'Real Estate']

const SPECIALIZATIONS = [
  { label: 'Accounts Payable Management', g: 'a' },
  { label: 'GST', g: 'b' },
  { label: 'Bank Audits', g: 'c' },
  { label: 'Income Tax', g: 'a' },
  { label: 'Transfer Pricing', g: 'b' },
  { label: 'Concurrent Audit', g: 'c' },
  { label: 'Outsourcing', g: 'a' },
]

const MAP_LOCATIONS = [
  {
    id: 'bengaluru', name: 'Bengaluru (Head Office)', tag: 'Head Office',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.6!2d77.6263!3d12.9352!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sKoramangala%2C%20Bengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1680000000005',
    address: '3rd Floor, Building No 589, 60 Ft Main Road, AECS Layout, Kundalahalli, Bengaluru, Karnataka – 560037'
  },
  {
    id: 'koramangala', name: 'Koramangala', tag: 'Branch',
    mapUrl: 'https://maps.google.com/maps?q=Prestige%20Meridian,%2029%20MG%20Road,%20Bengaluru,%20Karnataka&t=&z=15&ie=UTF8&iwloc=&output=embed',
    address: '4th Floor, Prestige Meridian, 29 MG Road, Koramangala, Bengaluru, Karnataka – 560034'
  },
  {
    id: 'whitefield', name: 'Whitefield', tag: 'Branch',
    mapUrl: 'https://maps.google.com/maps?q=Salarpuria%20Softzone,%20Whitefield,%20Bengaluru,%20Karnataka&t=&z=15&ie=UTF8&iwloc=&output=embed',
    address: '502, 5th Floor, Salarpuria Softzone, Whitefield, Bengaluru, Karnataka – 560066'
  },
]

const IconMail = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>)
const IconLinkedIn = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>)
const IconPin = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>)
const IconCheck = () => (<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>)

export default function Bengaluru() {
  const [activeLocation, setActiveLocation] = useState(MAP_LOCATIONS[0])
  useEffect(() => { window.scrollTo({ top: 0 }) }, [])

  return (
    <div className="blr-page">
      <section className="blr-hero">
        <div className="blr-hero__photo" style={{ backgroundImage: `url(${bengaluruBg})` }} />
        <div className="blr-hero__overlay" />
        <div className="blr-hero__content">
          <span className="blr-hero__eyebrow">JHS &amp; Associates LLP</span>
          <h1 className="blr-hero__title">Bengaluru</h1>
          <p className="blr-hero__sub">Silicon Valley of India &amp; South India Tech Office</p>
        </div>
        <div className="blr-hero__card">
          <div className="blr-hero__card-left">
            <span className="blr-hero__card-badge">Head Office — Bengaluru</span>
            <div className="blr-hero__card-addr"><IconPin /><span>3rd Floor, Building No 589, 60 Ft Main Road, AECS Layout, Kundalahalli, Bengaluru, Karnataka – 560037</span></div>
          </div>
          <div className="blr-hero__card-divider" />
          <div className="blr-hero__card-right">
            <div className="blr-hero__card-stat"><span className="blr-hero__card-stat-label">Phone</span><span className="blr-hero__card-stat-val">+91 80 1234 5678</span></div>
            <div className="blr-hero__card-stat"><span className="blr-hero__card-stat-label">Email</span><span className="blr-hero__card-stat-val">bengaluru@jhsassociates.in</span></div>
            <div className="blr-hero__card-stat"><span className="blr-hero__card-stat-label">Hours</span><span className="blr-hero__card-stat-val">Mon–Sat, 9:30 AM – 6:30 PM</span></div>
          </div>
        </div>
      </section>

      <div className="blr-ribbon">
        <div className="blr-ribbon__inner">
          {([['3+', 'Expert Partners'], ['3', 'Sectors Served'], ['7+', 'Specialisations'], ['3', 'Bengaluru Offices']] as [string, string][]).map(([num, lbl]) => (
            <div key={lbl} className="blr-ribbon__item"><span className="blr-ribbon__num">{num}</span><span className="blr-ribbon__lbl">{lbl}</span></div>
          ))}
        </div>
      </div>

      <section className="blr-section blr-sectors-section">
        <div className="blr-container">
          <div className="blr-section-hdr">
            <span className="blr-section-hdr__tag">Industries</span>
            <h2 className="blr-section-hdr__title">Sectors Served</h2>
            <p className="blr-section-hdr__sub">Deep domain expertise across Karnataka's most dynamic industries — built through years of hands-on client engagement.</p>
          </div>
          <div className="blr-sectors-grid">
            {SECTORS.map((s, i) => (
              <div key={s} className="blr-sector-card" style={{ animationDelay: `${i * 0.06}s` }}>
                <div className="blr-sector-card__icon-wrap">{SectorIcons[s]}</div>
                <span className="blr-sector-card__label">{s}</span>
                <div className="blr-sector-card__line" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="blr-section blr-specials-section">
        <div className="blr-container">
          <div className="blr-specials-inner">
            <div className="blr-specials-left">
              <span className="blr-section-hdr__tag blr-section-hdr__tag--white">Expertise</span>
              <h2 className="blr-specials-title">We Specialise In</h2>
              <p className="blr-specials-body">From bank audits to indirect tax advisory, our Bengaluru team brings specialised depth in financial services and emerging tech sectors.</p>
              <div className="blr-specials-accent-line" />
              <p className="blr-specials-note">Each specialisation is backed by certified professionals with real-world project experience.</p>
            </div>
            <div className="blr-specials-right">
              <div className="blr-specials-grid">
                {SPECIALIZATIONS.map((s, i) => (
                  <div key={s.label} className={`blr-special-pill blr-special-pill--${s.g}`} style={{ animationDelay: `${i * 0.04}s` }}>
                    <span className="blr-special-pill__check"><IconCheck /></span><span>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="blr-section blr-partners-section">
        <div className="blr-container">
          <div className="blr-section-hdr">
            <span className="blr-section-hdr__tag">Our Team</span>
            <h2 className="blr-section-hdr__title">Bengaluru Partners</h2>
            <p className="blr-section-hdr__sub">Meet the leaders driving excellence across audit, tax, advisory, and assurance in Bengaluru.</p>
          </div>
          <div className="blr-partners-grid">
            {PARTNERS.map(p => (
              <div key={p.name} className="blr-pc-card">
                <div className="blr-pc-avatar"><img src={p.image} alt={p.name} className="blr-pc-avatar__img" /></div>
                <div className="blr-pc-info"><h3 className="blr-pc-name">{p.name}</h3><p className="blr-pc-quals">{p.qualifications}</p><p className="blr-pc-desig">{p.designation}</p></div>
                <div className="blr-pc-social">
                  <a href={`mailto:${p.email}`} className="blr-pc-btn blr-pc-btn--mail"><IconMail /><span>Email</span></a>
                  <a href={p.linkedin} target="_blank" rel="noopener noreferrer" className="blr-pc-btn blr-pc-btn--li"><IconLinkedIn /><span>LinkedIn</span></a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="blr-map-section">
        <div className="blr-container">
          <div className="blr-section-hdr">
            <span className="blr-section-hdr__tag">Locations</span>
            <h2 className="blr-section-hdr__title">Our Offices in Bengaluru</h2>
            <p className="blr-section-hdr__sub">Select a location to view it on the map.</p>
          </div>
          <div className="blr-map-tabs">
            {MAP_LOCATIONS.map(loc => (
              <button key={loc.id} className={`blr-map-tab ${activeLocation.id === loc.id ? 'active' : ''}`} onClick={() => setActiveLocation(loc)}>
                <IconPin /><span>{loc.name}</span>
                {loc.tag === 'Head Office' && <span className="blr-map-tab__badge">HQ</span>}
              </button>
            ))}
          </div>
          <div className="blr-map-layout">
            <div className="blr-map-info-card">
              <div className="blr-map-info-tag">{activeLocation.tag}</div>
              <h3 className="blr-map-info-title">{activeLocation.name}</h3>
              <div className="blr-map-info-addr-row"><IconPin /><p className="blr-map-info-addr">{activeLocation.address}</p></div>
              <a href={`https://maps.google.com/?q=${encodeURIComponent(activeLocation.address)}`} target="_blank" rel="noopener noreferrer" className="blr-map-directions-btn">Get Directions →</a>
            </div>
            <div className="blr-map-wrap">
              <iframe title={`JHS ${activeLocation.name}`} src={activeLocation.mapUrl} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
          </div>
        </div>
      </section>

      <section className="blr-branches-section">
        <div className="blr-container">
          <div className="blr-section-hdr">
            <span className="blr-section-hdr__tag">Sub-Offices</span>
            <h2 className="blr-section-hdr__title">Bengaluru Sub-Offices</h2>
            <p className="blr-section-hdr__sub">Strategically located across Bengaluru's key tech and business corridors for easier client access.</p>
          </div>
          <div className="blr-branches-grid">
            {[
              { name: 'Koramangala', num: '01', address: '4th Floor, Prestige Meridian, 29 MG Road, Koramangala, Bengaluru, Karnataka – 560034' },
              { name: 'Whitefield', num: '02', address: '502, 5th Floor, Salarpuria Softzone, Whitefield, Bengaluru, Karnataka – 560066' },
            ].map(b => (
              <div key={b.name} className="blr-branch-card">
                <div className="blr-branch-card__num">{b.num}</div>
                <div className="blr-branch-card__content">
                  <div className="blr-branch-card__icon-wrap"><IconPin /></div>
                  <h3 className="blr-branch-card__name">{b.name}</h3>
                  <p className="blr-branch-card__addr">{b.address}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}