import { useEffect, useState } from 'react'
import './Hyderabad.css'

/* ─── Hero background ───────────────────────────────── */
import hyderabadBg from '../../image/Hydrabad.jpg'

/* ─── Partner Image Imports ─────────────────────────── */
import imgNarayana from '../../image/Narayana-Rao-Malla-removebg-preview.png'
import imgPic3 from '../../image/Picture3-removebg-preview.png'
import imgPic4 from '../../image/Picture4-removebg-preview.png'
import imgPic6 from '../../image/Picture9-removebg-preview.png'
import imgPic9 from '../../image/Gemini_Generated_Image_c056azc056azc056__1_-removebg-preview.png'

/* ─── Partner Data ─────────────────────────────────────── */
const PARTNERS = [
  {
    name: 'Narayana Rao Malla',
    image: imgNarayana,
    qualifications: 'FCA',
    designation: 'Statutory Audit & Assurance',
    email: 'narayana.malla@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/narayana-rao-malla',
  },
  {
    name: 'Ramesh Reddy',
    image: imgPic3,
    qualifications: 'FCA',
    designation: 'Tax Advisory & Compliance',
    email: 'ramesh.reddy@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/ramesh-reddy',
  },
  {
    name: 'Prasad Varma',
    image: imgPic4,
    qualifications: 'FCA',
    designation: 'Risk Advisory & Internal Audit',
    email: 'prasad.varma@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/prasad-varma',
  },
  {
    name: 'Suresh Kumar',
    image: imgPic6,
    qualifications: 'FCA',
    designation: 'Corporate Governance & Regulatory',
    email: 'suresh.kumar@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/suresh-kumar',
  },
  {
    name: 'Venkat Rao',
    image: imgPic9,
    qualifications: 'FCA',
    designation: 'Accounts Outsourcing & Ind AS',
    email: 'venkat.rao@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/venkat-rao',
  },
]

/* ─── Map Locations ───────────────────────────────────────── */
const MAP_LOCATIONS = [
  {
    id: 'hyderabad',
    name: 'Hyderabad (Head Office)',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.3!2d78.3722!3d17.4474!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb93dc8c5d69df%3A0x19688bef76177fe5!2sHiTech%20City%2C%20Hyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1680000000003!5m2!1sen!2sin',
    address: '6-3-788/36 & 37/A, "Badhe House", First Floor, Durganagar, Ameerpet, Hyderabad, Telangana – 500016'
  },
  {
    id: 'hiteccity',
    name: 'HITEC City',
    mapUrl: 'https://maps.google.com/maps?q=Cyber%20Towers,%20HITEC%20City,%20Madhapur,%20Hyderabad&t=&z=15&ie=UTF8&iwloc=&output=embed',
    address: '8th Floor, Cyber Towers, HITEC City, Madhapur, Hyderabad, Telangana – 500081'
  },
  {
    id: 'banjarahills',
    name: 'Banjara Hills',
    mapUrl: 'https://maps.google.com/maps?q=Lumbini%20Avenue,%20Road%20No.%202,%20Banjara%20Hills,%20Hyderabad&t=&z=15&ie=UTF8&iwloc=&output=embed',
    address: '201, 2nd Floor, Lumbini Avenue, Road No. 2, Banjara Hills, Hyderabad, Telangana – 500034'
  }
]

/* ─── Branch Data ────────────────────────────────────────── */
const BRANCHES = [
  {
    name: 'HITEC City',
    address:
      '8th Floor, Cyber Towers, HITEC City, Madhapur, Hyderabad, Telangana – 500081',
  },
  {
    name: 'Banjara Hills',
    address:
      '201, 2nd Floor, Lumbini Avenue, Road No. 2, Banjara Hills, Hyderabad, Telangana – 500034',
  },
]

/* ─── Partner Avatar ─────────────────────────────────────── */
function PartnerAvatar({ image, name }: { image: string; name: string }) {
  return (
    <div className="hyd-pc-avatar">
      <img src={image} alt={name} className="hyd-pc-avatar__img" />
    </div>
  )
}

/* ─── Icons ──────────────────────────────────────────────── */
const IconMail = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
)

const IconLinkedIn = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

const IconPin = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

/* ─── Component ──────────────────────────────────────────── */
export default function Hyderabad() {
  const [activeLocation, setActiveLocation] = useState(MAP_LOCATIONS[0])

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])

  return (
    <div className="hyd-page">

      {/* ════════════ HERO ════════════ */}
      <section className="hyd-hero">
        <div className="hyd-hero__photo" style={{ backgroundImage: `url(${hyderabadBg})` }} />
        <div className="hyd-hero__overlay" />
        <div className="hyd-hero__content">
          <p className="hyd-hero__eyebrow">JHS &amp; Associates LLP</p>
          <h1 className="hyd-hero__title">Hyderabad</h1>
          <p className="hyd-hero__sub">South India Tech Hub &amp; Strategic Regional Office</p>
        </div>

        <div className="hyd-hero__card">
          <span className="hyd-hero__card-brand">JHS</span>
          <div className="hyd-hero__card-badge">Head Office — HITEC City</div>
          <div className="hyd-hero__card-body">
            <div className="hyd-hero__card-addr">
              <IconPin />
              <span>6-3-788/36 & 37/A, "Badhe House", First Floor, Durganagar, Ameerpet, Hyderabad, Telangana – 500016</span>
            </div>
          </div>
          <div className="hyd-hero__card-info">
            <div className="hyd-hero__card-info-item">
              <div>
                <span className="hyd-hero__card-info-label">Phone</span>
                <span className="hyd-hero__card-info-val">+91 40 1234 5678</span>
              </div>
            </div>
            <div className="hyd-hero__card-info-item">
              <div>
                <span className="hyd-hero__card-info-label">Email</span>
                <span className="hyd-hero__card-info-val">hyderabad@jhsassociates.in</span>
              </div>
            </div>
            <div className="hyd-hero__card-info-item">
              <div>
                <span className="hyd-hero__card-info-label">Business Hours</span>
                <span className="hyd-hero__card-info-val">Mon–Sat, 9:30 AM – 6:30 PM</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════ PARTNERS ════════════ */}
      <section className="hyd-section hyd-section--light">
        <div className="hyd-container">
          <div className="hyd-section-hdr">
            <span className="hyd-section-hdr__tag">Our Team</span>
            <h2 className="hyd-section-hdr__title">Hyderabad Partners</h2>
            <p className="hyd-section-hdr__sub">
              Meet the leaders driving excellence across audit, tax, advisory, and assurance in Hyderabad.
            </p>
          </div>

          <div className="hyd-partners-grid">
            {PARTNERS.map(p => (
              <div key={p.name} className="hyd-pc-card">
                <PartnerAvatar image={p.image} name={p.name} />
                <div className="hyd-pc-info">
                  <h3 className="hyd-pc-name">{p.name}</h3>
                  <p className="hyd-pc-quals">{p.qualifications}</p>
                  <p className="hyd-pc-desig">{p.designation}</p>
                </div>
                <div className="hyd-pc-social">
                  <a href={`mailto:${p.email}`} className="hyd-pc-btn hyd-pc-btn--mail" title={`Email ${p.name}`}>
                    <IconMail />
                    <span>Email</span>
                  </a>
                  <a
                    href={p.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hyd-pc-btn hyd-pc-btn--li"
                    title="LinkedIn Profile"
                  >
                    <IconLinkedIn />
                    <span>LinkedIn</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ MAP ════════════ */}
      <section className="hyd-map-section">
        <div className="hyd-container">
          <div className="hyd-section-hdr">
            <span className="hyd-section-hdr__tag">Locations</span>
            <h2 className="hyd-section-hdr__title">Our Offices in Hyderabad</h2>
            <p className="hyd-section-hdr__sub">
              Select a location below to view it on the map.
            </p>
          </div>

          <div className="hyd-map-tabs">
            {MAP_LOCATIONS.map(loc => (
              <button
                key={loc.id}
                className={`hyd-map-tab ${activeLocation.id === loc.id ? 'active' : ''}`}
                onClick={() => setActiveLocation(loc)}
              >
                <IconPin />
                <span>{loc.name}</span>
              </button>
            ))}
          </div>

          <div className="hyd-map-content">
            <div className="hyd-map-info-card">
              <h3 className="hyd-map-info-title">{activeLocation.name}</h3>
              <p className="hyd-map-info-addr">{activeLocation.address}</p>
            </div>
            <div className="hyd-map-wrap">
              <iframe
                title={`JHS ${activeLocation.name} Office`}
                src={activeLocation.mapUrl}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ════════════ BRANCHES ════════════ */}
      <section className="hyd-branches-section">
        <div className="hyd-container">
          <div className="hyd-section-hdr">
            <span className="hyd-section-hdr__tag hyd-section-hdr__tag--light">Sub-Offices</span>
            <h2 className="hyd-section-hdr__title hyd-section-hdr__title--light">Hyderabad Sub-Offices</h2>
            <p className="hyd-section-hdr__sub hyd-section-hdr__sub--light">
              Strategically located across Hyderabad's key business corridors for easier client access.
            </p>
          </div>
          <div className="hyd-branches-grid">
            {BRANCHES.map((b, i) => (
              <div key={b.name} className="hyd-branch-card">
                <div className="hyd-branch-card__num">0{i + 1}</div>
                <div className="hyd-branch-card__icon"><IconPin /></div>
                <h3 className="hyd-branch-card__name">{b.name}</h3>
                <p className="hyd-branch-card__addr">{b.address}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
