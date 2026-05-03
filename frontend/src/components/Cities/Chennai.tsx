import { useEffect, useState } from 'react'
import './Chennai.css'

import chennaiBg from '../../image/Chennai.jpg'
import imgNarayana from '../../image/Narayana-Rao-Malla-removebg-preview.png'
import imgVirendra from '../../image/Virendra-Nayyar-removebg-preview.png'
import imgDhaval from '../../image/Dhaval-Thakkar-removebg-preview.png'
import imgSunil from '../../image/Sunil-Pathak-removebg-preview.png'

const PARTNERS = [
  { name: 'Narayana Rao Malla', image: imgNarayana, qualifications: 'FCA', designation: 'Statutory Audit & Assurance', email: 'narayana.malla.chn@jhsassociates.in', linkedin: 'https://www.linkedin.com/in/narayana-rao-malla-chn' },
  { name: 'Virendra Nayyar', image: imgVirendra, qualifications: 'FCA', designation: 'Regulatory & Compliance', email: 'virendra.nayyar.chn@jhsassociates.in', linkedin: 'https://www.linkedin.com/in/virendra-nayyar-chn' },
  { name: 'Dhaval Thakkar', image: imgDhaval, qualifications: 'FCA', designation: 'Tax & Corporate Advisory', email: 'dhaval.thakkar.chn@jhsassociates.in', linkedin: 'https://www.linkedin.com/in/dhaval-thakkar-chn' },
  { name: 'Sunil Pathak', image: imgSunil, qualifications: 'FCA', designation: 'Risk Advisory & Internal Audit', email: 'sunil.pathak.chn@jhsassociates.in', linkedin: 'https://www.linkedin.com/in/sunil-pathak-chn' },
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
    id: 'chennai', name: 'Chennai (Head Office)', tag: 'Head Office',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.9!2d80.2337!3d13.0416!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5266c07a1e3b3d%3A0x4c9b5e9a8b9a8b9a!2sT.%20Nagar%2C%20Chennai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1680000000007',
    address: 'No: 43/65, South West Boag Road, T-Nagar, Chennai – 600017'
  },
  {
    id: 'tnagar', name: 'T. Nagar', tag: 'Branch',
    mapUrl: 'https://maps.google.com/maps?q=Abacus%20Tower,%20Venkatnarayana%20Road,%20T.%20Nagar,%20Chennai&t=&z=15&ie=UTF8&iwloc=&output=embed',
    address: '7th Floor, Abacus Tower, 1-F Venkatnarayana Road, T. Nagar, Chennai, Tamil Nadu – 600017'
  },
  {
    id: 'annanagar', name: 'Anna Nagar', tag: 'Branch',
    mapUrl: 'https://maps.google.com/maps?q=Anna%20Nagar%20Eastern%20Extn,%20Chennai,%20Tamil%20Nadu&t=&z=15&ie=UTF8&iwloc=&output=embed',
    address: '201, 2nd Floor, Tower C, Anna Nagar Eastern Extn, Chennai, Tamil Nadu – 600102'
  },
]

const IconMail = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>)
const IconLinkedIn = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>)
const IconPin = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>)
const IconCheck = () => (<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>)

export default function Chennai() {
  const [activeLocation, setActiveLocation] = useState(MAP_LOCATIONS[0])
  useEffect(() => { window.scrollTo({ top: 0 }) }, [])

  return (
    <div className="chn-page">
      <section className="chn-hero">
        <div className="chn-hero__photo" style={{ backgroundImage: `url(${chennaiBg})` }} />
        <div className="chn-hero__overlay" />
        <div className="chn-hero__content">
          <span className="chn-hero__eyebrow">JHS &amp; Associates LLP</span>
          <h1 className="chn-hero__title">Chennai</h1>
          <p className="chn-hero__sub">Gateway to South India &amp; Regional Financial Centre</p>
        </div>
        <div className="chn-hero__card">
          <div className="chn-hero__card-left">
            <span className="chn-hero__card-badge">Head Office — T. Nagar</span>
            <div className="chn-hero__card-addr"><IconPin /><span>No: 43/65, South West Boag Road, T-Nagar, Chennai – 600017</span></div>
          </div>
          <div className="chn-hero__card-divider" />
          <div className="chn-hero__card-right">
            <div className="chn-hero__card-stat"><span className="chn-hero__card-stat-label">Phone</span><span className="chn-hero__card-stat-val">+91 44 1234 5678</span></div>
            <div className="chn-hero__card-stat"><span className="chn-hero__card-stat-label">Email</span><span className="chn-hero__card-stat-val">chennai@jhsassociates.in</span></div>
            <div className="chn-hero__card-stat"><span className="chn-hero__card-stat-label">Hours</span><span className="chn-hero__card-stat-val">Mon–Sat, 9:30 AM – 6:30 PM</span></div>
          </div>
        </div>
      </section>

      <div className="chn-ribbon">
        <div className="chn-ribbon__inner">
          {([['4+', 'Expert Partners'], ['3', 'Sectors Served'], ['7+', 'Specialisations'], ['3', 'Chennai Offices']] as [string, string][]).map(([num, lbl]) => (
            <div key={lbl} className="chn-ribbon__item"><span className="chn-ribbon__num">{num}</span><span className="chn-ribbon__lbl">{lbl}</span></div>
          ))}
        </div>
      </div>

      <section className="chn-section chn-sectors-section">
        <div className="chn-container">
          <div className="chn-section-hdr">
            <span className="chn-section-hdr__tag">Industries</span>
            <h2 className="chn-section-hdr__title">Sectors Served</h2>
            <p className="chn-section-hdr__sub">Deep domain expertise across Tamil Nadu's most dynamic industries — built through years of hands-on client engagement.</p>
          </div>
          <div className="chn-sectors-grid">
            {SECTORS.map((s, i) => (
              <div key={s} className="chn-sector-card" style={{ animationDelay: `${i * 0.06}s` }}>
                <div className="chn-sector-card__icon-wrap">{SectorIcons[s]}</div>
                <span className="chn-sector-card__label">{s}</span>
                <div className="chn-sector-card__line" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="chn-section chn-specials-section">
        <div className="chn-container">
          <div className="chn-specials-inner">
            <div className="chn-specials-left">
              <span className="chn-section-hdr__tag chn-section-hdr__tag--white">Expertise</span>
              <h2 className="chn-specials-title">We Specialise In</h2>
              <p className="chn-specials-body">From GST compliance to concurrent bank audits, our Chennai team brings specialised depth across financial services and real estate sectors.</p>
              <div className="chn-specials-accent-line" />
              <p className="chn-specials-note">Each specialisation is backed by certified professionals with real-world project experience.</p>
            </div>
            <div className="chn-specials-right">
              <div className="chn-specials-grid">
                {SPECIALIZATIONS.map((s, i) => (
                  <div key={s.label} className={`chn-special-pill chn-special-pill--${s.g}`} style={{ animationDelay: `${i * 0.04}s` }}>
                    <span className="chn-special-pill__check"><IconCheck /></span><span>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="chn-section chn-partners-section">
        <div className="chn-container">
          <div className="chn-section-hdr">
            <span className="chn-section-hdr__tag">Our Team</span>
            <h2 className="chn-section-hdr__title">Chennai Partners</h2>
            <p className="chn-section-hdr__sub">Meet the leaders driving excellence across audit, tax, advisory, and assurance in Chennai.</p>
          </div>
          <div className="chn-partners-grid">
            {PARTNERS.map(p => (
              <div key={p.name} className="chn-pc-card">
                <div className="chn-pc-avatar"><img src={p.image} alt={p.name} className="chn-pc-avatar__img" /></div>
                <div className="chn-pc-info"><h3 className="chn-pc-name">{p.name}</h3><p className="chn-pc-quals">{p.qualifications}</p><p className="chn-pc-desig">{p.designation}</p></div>
                <div className="chn-pc-social">
                  <a href={`mailto:${p.email}`} className="chn-pc-btn chn-pc-btn--mail"><IconMail /><span>Email</span></a>
                  <a href={p.linkedin} target="_blank" rel="noopener noreferrer" className="chn-pc-btn chn-pc-btn--li"><IconLinkedIn /><span>LinkedIn</span></a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="chn-map-section">
        <div className="chn-container">
          <div className="chn-section-hdr">
            <span className="chn-section-hdr__tag">Locations</span>
            <h2 className="chn-section-hdr__title">Our Offices in Chennai</h2>
            <p className="chn-section-hdr__sub">Select a location to view it on the map.</p>
          </div>
          <div className="chn-map-tabs">
            {MAP_LOCATIONS.map(loc => (
              <button key={loc.id} className={`chn-map-tab ${activeLocation.id === loc.id ? 'active' : ''}`} onClick={() => setActiveLocation(loc)}>
                <IconPin /><span>{loc.name}</span>
                {loc.tag === 'Head Office' && <span className="chn-map-tab__badge">HQ</span>}
              </button>
            ))}
          </div>
          <div className="chn-map-layout">
            <div className="chn-map-info-card">
              <div className="chn-map-info-tag">{activeLocation.tag}</div>
              <h3 className="chn-map-info-title">{activeLocation.name}</h3>
              <div className="chn-map-info-addr-row"><IconPin /><p className="chn-map-info-addr">{activeLocation.address}</p></div>
              <a href={`https://maps.google.com/?q=${encodeURIComponent(activeLocation.address)}`} target="_blank" rel="noopener noreferrer" className="chn-map-directions-btn">Get Directions →</a>
            </div>
            <div className="chn-map-wrap">
              <iframe title={`JHS ${activeLocation.name}`} src={activeLocation.mapUrl} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
          </div>
        </div>
      </section>

      <section className="chn-branches-section">
        <div className="chn-container">
          <div className="chn-section-hdr">
            <span className="chn-section-hdr__tag">Sub-Offices</span>
            <h2 className="chn-section-hdr__title">Chennai Sub-Offices</h2>
            <p className="chn-section-hdr__sub">Strategically located across Chennai's key business corridors for easier client access.</p>
          </div>
          <div className="chn-branches-grid">
            {[
              { name: 'T. Nagar', num: '01', address: '7th Floor, Abacus Tower, 1-F Venkatnarayana Road, T. Nagar, Chennai, Tamil Nadu – 600017' },
              { name: 'Anna Nagar', num: '02', address: '201, 2nd Floor, Tower C, Anna Nagar Eastern Extn, Chennai, Tamil Nadu – 600102' },
            ].map(b => (
              <div key={b.name} className="chn-branch-card">
                <div className="chn-branch-card__num">{b.num}</div>
                <div className="chn-branch-card__content">
                  <div className="chn-branch-card__icon-wrap"><IconPin /></div>
                  <h3 className="chn-branch-card__name">{b.name}</h3>
                  <p className="chn-branch-card__addr">{b.address}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}