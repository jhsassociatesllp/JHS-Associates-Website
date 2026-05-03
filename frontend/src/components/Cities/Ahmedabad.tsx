import { useEffect, useState } from 'react'
import './Ahmedabad.css'

/* ─── Hero background ───────────────────────────────── */
import ahmedabadBg from '../../image/Ahmedabad.jpg'

/* ─── Partner Image Imports ─────────────────────────── */
import imgAlpesh from '../../image/Alpesh-Vaniya-removebg-preview.png'
import imgDhaval from '../../image/Dhaval-Thakkar-removebg-preview.png'
import imgHitesh from '../../image/Hitesh-Khandelwal-removebg-preview.png'
import imgJagdish from '../../image/Jagdish-Solanki-removebg-preview.png'
import imgKalpesh from '../../image/Kalpesh-Parmar-removebg-preview.png'
import imgMehul from '../../image/Mehul-Shah-removebg-preview.png'
import imgMilin from '../../image/Milin-Parekh-removebg-preview.png'
import imgRaj from '../../image/Raj-Shah-removebg-preview.png'
import imgSaurabh from '../../image/Saurabh-Shah-removebg-preview.png'
import imgViranch from '../../image/Viranch-Modi-removebg-preview.png'

/* ─── Sector SVG Icons ───────────────────────────────── */
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
  Manufacturing: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="6" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="20" cy="20" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M20 8 L20 11" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M20 29 L20 32" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M8 20 L11 20" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M29 20 L32 20" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M11.5 11.5 L13.6 13.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M26.4 26.4 L28.5 28.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M28.5 11.5 L26.4 13.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M13.6 26.4 L11.5 28.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  NPO: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 32 L9.5 21.5 C6.7 18.7 6.7 14.3 9.5 11.5 C12.3 8.7 16.7 8.7 19.5 11.5 L20 12 L20.5 11.5 C23.3 8.7 27.7 8.7 30.5 11.5 C33.3 14.3 33.3 18.7 30.5 21.5 L20 32 Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  ),
  "NGO's": (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="13" r="4.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M10 32 C10 26.5 14.5 22 20 22 C25.5 22 30 26.5 30 32" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M25 16 L27 18 L31 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Retail: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="16" width="24" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M14 16 L14 12 C14 8.7 16.7 6 20 6 C23.3 6 26 8.7 26 12 L26 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M14 22 L26 22" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  'Corporates & Trusts': (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="11" y="9" width="18" height="25" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M7 34 L33 34" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <rect x="17" y="15" width="6" height="6" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M15 26 L25 26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M15 29 L22 29" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  'Individual Investors': (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="13" r="5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M10 32 C10 26.5 14.5 22 20 22 C25.5 22 30 26.5 30 32" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M27 9 L29 11 L33 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
}

/* ─── Partner Data ─────────────────────────────────── */
const PARTNERS = [
  { name: 'Alpesh Vaniya', image: imgAlpesh, qualifications: 'FCA', designation: 'Statutory Audit & Assurance', email: 'alpesh.vaniya@jhsassociates.in', linkedin: 'https://www.linkedin.com/in/alpesh-vaniya' },
  { name: 'Dhaval Thakkar', image: imgDhaval, qualifications: 'FCA', designation: 'Tax & Regulatory Advisory', email: 'dhaval.thakkar@jhsassociates.in', linkedin: 'https://www.linkedin.com/in/dhaval-thakkar' },
  { name: 'Hitesh Khandelwal', image: imgHitesh, qualifications: 'FCA', designation: 'Risk Advisory & Internal Audit', email: 'hitesh.khandelwal@jhsassociates.in', linkedin: 'https://www.linkedin.com/in/hitesh-khandelwal' },
  { name: 'Jagdish Solanki', image: imgJagdish, qualifications: 'FCA', designation: 'Statutory Audit', email: 'jagdish.solanki@jhsassociates.in', linkedin: 'https://www.linkedin.com/in/jagdish-solanki' },
  { name: 'Kalpesh Parmar', image: imgKalpesh, qualifications: 'FCA', designation: 'Accounts Outsourcing & Compliance', email: 'kalpesh.parmar@jhsassociates.in', linkedin: 'https://www.linkedin.com/in/kalpesh-parmar' },
  { name: 'Mehul Shah', image: imgMehul, qualifications: 'FCA', designation: 'Income Tax & GST', email: 'mehul.shah@jhsassociates.in', linkedin: 'https://www.linkedin.com/in/mehul-shah' },
  { name: 'Milin Parekh', image: imgMilin, qualifications: 'M.Com, FCA', designation: 'IA & Tax Consulting', email: 'milin.parekh@jhsassociates.in', linkedin: 'https://www.linkedin.com/in/milin-parekh' },
  { name: 'Raj Shah', image: imgRaj, qualifications: 'B.Com, ACA', designation: 'Tax & Litigation & Risk Advisory', email: 'raj.shah@jhsassociates.in', linkedin: 'https://www.linkedin.com/in/raj-shah' },
  { name: 'Saurabh Shah', image: imgSaurabh, qualifications: 'FCA, DISA', designation: 'Direct & Indirect Tax', email: 'saurabh.shah@jhsassociates.in', linkedin: 'https://www.linkedin.com/in/saurabh-shah' },
  { name: 'Viranch Modi', image: imgViranch, qualifications: 'B.Com, FCA', designation: 'Income Tax & GST', email: 'viranch.modi@jhsassociates.in', linkedin: 'https://www.linkedin.com/in/viranch-modi' },
]

/* ─── Sectors ─────────────────────────────────────── */
const SECTORS = ["NPO", "NGO's", "Manufacturing", "Retail", "Corporates & Trusts", "Individual Investors"]

/* ─── Specialisations ─────────────────────────────── */
const SPECIALIZATIONS = [
  { label: 'Individual Tax', g: 'a' },
  { label: 'Corporate Tax', g: 'b' },
  { label: 'Transfer Pricing', g: 'c' },
  { label: 'Outsourced Accounting', g: 'a' },
  { label: 'Global Taxation', g: 'b' },
  { label: 'Global Outsourcing', g: 'c' },
  { label: 'Global Accounts Outsourcing (US, UK, AU)', g: 'a' },
]

/* ─── Map Locations ───────────────────────────────── */
const MAP_LOCATIONS = [
  {
    id: 'ahmedabad', name: 'Ahmedabad (Head Office)', tag: 'Head Office',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.9!2d72.5078!3d23.0225!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e848aba5bd449%3A0x4fcedd11614f6516!2sSG%20Highway%2C%20Ahmedabad%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1680000000001!5m2!1sen!2sin',
    address: '1016-1021, Swati Crimson and Clover, Near Shilaj Bridge, Ahmedabad, Gujarat – 380059'
  },
  {
    id: 'vapi', name: 'Vapi', tag: 'Branch',
    mapUrl: 'https://maps.google.com/maps?q=Saga%20Casa,%20Daulat%20Nagar,%20Chala,%20Vapi,%20Gujarat&t=&z=15&ie=UTF8&iwloc=&output=embed',
    address: 'Office No.101, Saga Casa, Daulat Nagar, Chala, Vapi, Gujarat – 396215'
  },
  {
    id: 'rajkot', name: 'Rajkot', tag: 'Branch',
    mapUrl: 'https://maps.google.com/maps?q=Kings%20Heights,%20Vidya%20Kunj%20Society%20Main%20Road,%20Rajkot,%20Gujarat&t=&z=15&ie=UTF8&iwloc=&output=embed',
    address: 'B-303 Kings Heights, Vidya Kunj Society Main Road, Rajkot, Gujarat – 360001'
  },
  {
    id: 'surat', name: 'Surat', tag: 'Branch',
    mapUrl: 'https://maps.google.com/maps?q=Shubh%20Square,%20Lal%20Darwaja,%20Surat,%20Gujarat&t=&z=15&ie=UTF8&iwloc=&output=embed',
    address: '5th Floor, 504, Shubh Square, Above ICICI Bank, Lal Darwaja, Surat, Gujarat – 395003'
  },
]

/* ─── Icons ──────────────────────────────────────── */
const IconMail = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
  </svg>
)
const IconLinkedIn = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)
const IconPin = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
)
const IconCheck = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

/* ─── Page ───────────────────────────────────────── */
export default function Ahmedabad() {
  const [activeLocation, setActiveLocation] = useState(MAP_LOCATIONS[0])
  useEffect(() => { window.scrollTo({ top: 0 }) }, [])

  return (
    <div className="ahm-page">

      {/* ══ HERO ══ */}
      <section className="ahm-hero">
        <div className="ahm-hero__photo" style={{ backgroundImage: `url(${ahmedabadBg})` }} />
        <div className="ahm-hero__overlay" />
        <div className="ahm-hero__content">
          <span className="ahm-hero__eyebrow">JHS &amp; Associates LLP</span>
          <h1 className="ahm-hero__title">Ahmedabad</h1>
          <p className="ahm-hero__sub">Regional Hub &amp; Key Western India Office</p>
        </div>
        <div className="ahm-hero__card">
          <div className="ahm-hero__card-left">
            <span className="ahm-hero__card-badge">Head Office — Ahmedabad</span>
            <div className="ahm-hero__card-addr">
              <IconPin />
              <span>1016-1021, Swati Crimson and Clover, Near Shilaj Bridge, Ahmedabad, Gujarat – 380059</span>
            </div>
          </div>
          <div className="ahm-hero__card-divider" />
          <div className="ahm-hero__card-right">
            <div className="ahm-hero__card-stat"><span className="ahm-hero__card-stat-label">Phone</span><span className="ahm-hero__card-stat-val">+91 79 1234 5678</span></div>
            <div className="ahm-hero__card-stat"><span className="ahm-hero__card-stat-label">Email</span><span className="ahm-hero__card-stat-val">ahmedabad@jhsassociates.in</span></div>
            <div className="ahm-hero__card-stat"><span className="ahm-hero__card-stat-label">Hours</span><span className="ahm-hero__card-stat-val">Mon–Sat, 9:30 AM – 6:30 PM</span></div>
          </div>
        </div>
      </section>

      {/* ══ STATS RIBBON ══ */}
      <div className="ahm-ribbon">
        <div className="ahm-ribbon__inner">
          {([['10+', 'Expert Partners'], ['6', 'Sectors Served'], ['7+', 'Specialisations'], ['4', 'Gujarat Offices']] as [string, string][]).map(([num, lbl]) => (
            <div key={lbl} className="ahm-ribbon__item">
              <span className="ahm-ribbon__num">{num}</span>
              <span className="ahm-ribbon__lbl">{lbl}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ══ SECTORS SERVED ══ */}
      <section className="ahm-section ahm-sectors-section">
        <div className="ahm-container">
          <div className="ahm-section-hdr">
            <span className="ahm-section-hdr__tag">Industries</span>
            <h2 className="ahm-section-hdr__title">Sectors Served</h2>
            <p className="ahm-section-hdr__sub">Deep domain expertise across Gujarat's most dynamic industries — built through years of hands-on client engagement.</p>
          </div>
          <div className="ahm-sectors-grid">
            {SECTORS.map((s, i) => (
              <div key={s} className="ahm-sector-card" style={{ animationDelay: `${i * 0.06}s` }}>
                <div className="ahm-sector-card__icon-wrap">{SectorIcons[s]}</div>
                <span className="ahm-sector-card__label">{s}</span>
                <div className="ahm-sector-card__line" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ WE SPECIALISE IN ══ */}
      <section className="ahm-section ahm-specials-section">
        <div className="ahm-container">
          <div className="ahm-specials-inner">
            <div className="ahm-specials-left">
              <span className="ahm-section-hdr__tag ahm-section-hdr__tag--white">Expertise</span>
              <h2 className="ahm-specials-title">We Specialise In</h2>
              <p className="ahm-specials-body">From individual tax planning to global accounts outsourcing, our Ahmedabad team brings specialised capabilities across tax, compliance, and advisory services.</p>
              <div className="ahm-specials-accent-line" />
              <p className="ahm-specials-note">Each specialisation is backed by certified professionals with real-world project experience.</p>
            </div>
            <div className="ahm-specials-right">
              <div className="ahm-specials-grid">
                {SPECIALIZATIONS.map((s, i) => (
                  <div key={s.label} className={`ahm-special-pill ahm-special-pill--${s.g}`} style={{ animationDelay: `${i * 0.04}s` }}>
                    <span className="ahm-special-pill__check"><IconCheck /></span>
                    <span>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ PARTNERS ══ */}
      <section className="ahm-section ahm-partners-section">
        <div className="ahm-container">
          <div className="ahm-section-hdr">
            <span className="ahm-section-hdr__tag">Our Team</span>
            <h2 className="ahm-section-hdr__title">Gujarat Partners</h2>
            <p className="ahm-section-hdr__sub">Meet the leaders driving excellence across audit, tax, advisory, and assurance in Gujarat.</p>
          </div>
          <div className="ahm-partners-grid">
            {PARTNERS.map(p => (
              <div key={p.name} className="ahm-pc-card">
                <div className="ahm-pc-avatar"><img src={p.image} alt={p.name} className="ahm-pc-avatar__img" /></div>
                <div className="ahm-pc-info">
                  <h3 className="ahm-pc-name">{p.name}</h3>
                  <p className="ahm-pc-quals">{p.qualifications}</p>
                  <p className="ahm-pc-desig">{p.designation}</p>
                </div>
                <div className="ahm-pc-social">
                  <a href={`mailto:${p.email}`} className="ahm-pc-btn ahm-pc-btn--mail"><IconMail /><span>Email</span></a>
                  <a href={p.linkedin} target="_blank" rel="noopener noreferrer" className="ahm-pc-btn ahm-pc-btn--li"><IconLinkedIn /><span>LinkedIn</span></a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ MAP ══ */}
      <section className="ahm-map-section">
        <div className="ahm-container">
          <div className="ahm-section-hdr">
            <span className="ahm-section-hdr__tag">Locations</span>
            <h2 className="ahm-section-hdr__title">Our Offices in Gujarat</h2>
            <p className="ahm-section-hdr__sub">Select a location to view it on the map.</p>
          </div>
          <div className="ahm-map-tabs">
            {MAP_LOCATIONS.map(loc => (
              <button key={loc.id} className={`ahm-map-tab ${activeLocation.id === loc.id ? 'active' : ''}`} onClick={() => setActiveLocation(loc)}>
                <IconPin /><span>{loc.name}</span>
                {loc.tag === 'Head Office' && <span className="ahm-map-tab__badge">HQ</span>}
              </button>
            ))}
          </div>
          <div className="ahm-map-layout">
            <div className="ahm-map-info-card">
              <div className="ahm-map-info-tag">{activeLocation.tag}</div>
              <h3 className="ahm-map-info-title">{activeLocation.name}</h3>
              <div className="ahm-map-info-addr-row"><IconPin /><p className="ahm-map-info-addr">{activeLocation.address}</p></div>
              <a href={`https://maps.google.com/?q=${encodeURIComponent(activeLocation.address)}`} target="_blank" rel="noopener noreferrer" className="ahm-map-directions-btn">Get Directions →</a>
            </div>
            <div className="ahm-map-wrap">
              <iframe title={`JHS ${activeLocation.name} Office`} src={activeLocation.mapUrl} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
          </div>
        </div>
      </section>

      {/* ══ BRANCHES ══ */}
      <section className="ahm-branches-section">
        <div className="ahm-container">
          <div className="ahm-section-hdr">
            <span className="ahm-section-hdr__tag">Sub-Offices</span>
            <h2 className="ahm-section-hdr__title">Gujarat Sub-Offices</h2>
            <p className="ahm-section-hdr__sub">Strategically located across Gujarat's key business corridors for easier client access.</p>
          </div>
          <div className="ahm-branches-grid">
            {[
              { name: 'Vapi', num: '01', address: 'Office No.101, Saga Casa, Daulat Nagar, Chala, Vapi, Gujarat – 396215' },
              { name: 'Rajkot', num: '02', address: 'B-303 Kings Heights, Vidya Kunj Society Main Road, Rajkot, Gujarat – 360001' },
              { name: 'Surat', num: '03', address: '5th Floor, 504, Shubh Square, Above ICICI Bank, Lal Darwaja, Surat, Gujarat – 395003' },
            ].map(b => (
              <div key={b.name} className="ahm-branch-card">
                <div className="ahm-branch-card__num">{b.num}</div>
                <div className="ahm-branch-card__content">
                  <div className="ahm-branch-card__icon-wrap"><IconPin /></div>
                  <h3 className="ahm-branch-card__name">{b.name}</h3>
                  <p className="ahm-branch-card__addr">{b.address}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}