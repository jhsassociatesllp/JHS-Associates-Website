import { useEffect } from 'react'
import './Delhi.css'

/* ─── Hero background ───────────────────────────────── */
import delhiBg from '../../image/Dehli.avif'

/* ─── Partner Image Imports ─────────────────────────── */
import imgNikhel from '../../image/Nikhel-Kochhar-removebg-preview.png'
import imgSharad from '../../image/Sharad-Mohata-removebg-preview.png'
import imgSunil from '../../image/Sunil-Pathak-removebg-preview.png'
import imgVirendra from '../../image/Virendra-Nayyar-removebg-preview.png'

/* ─── Partner Data ─────────────────────────────────────── */
const PARTNERS = [
  {
    name: 'Nikhel Kochhar',
    image: imgNikhel,
    qualifications: 'FCA',
    designation: 'Statutory Audit & Assurance',
    email: 'nikhel.kochhar@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/nikhel-kochhar',
  },
  {
    name: 'Sharad Mohata',
    image: imgSharad,
    qualifications: 'FCA',
    designation: 'Tax & Corporate Advisory',
    email: 'sharad.mohata@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/sharad-mohata',
  },
  {
    name: 'Sunil Pathak',
    image: imgSunil,
    qualifications: 'FCA',
    designation: 'Risk Advisory & Internal Audit',
    email: 'sunil.pathak@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/sunil-pathak',
  },
  {
    name: 'Virendra Nayyar',
    image: imgVirendra,
    qualifications: 'FCA',
    designation: 'Regulatory & Compliance',
    email: 'virendra.nayyar@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/virendra-nayyar',
  },
]

/* ─── Branch Data ────────────────────────────────────────── */
const BRANCHES = [
  {
    name: 'Connaught Place',
    address:
      '301, 3rd Floor, Antriksh Bhawan, 22 Kasturba Gandhi Marg, Connaught Place, New Delhi – 110001',
  },
  {
    name: 'Noida',
    address:
      'A-12, Sector 16, Noida, Uttar Pradesh – 201301',
  },
]

/* ─── Partner Avatar ─────────────────────────────────────── */
function PartnerAvatar({ image, name }: { image: string; name: string }) {
  return (
    <div className="del-pc-avatar">
      <img src={image} alt={name} className="del-pc-avatar__img" />
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
export default function Delhi() {
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])

  return (
    <div className="del-page">

      {/* ════════════ HERO ════════════ */}
      <section className="del-hero">
        <div className="del-hero__photo" style={{ backgroundImage: `url(${delhiBg})` }} />
        <div className="del-hero__overlay" />
        <div className="del-hero__content">
          <p className="del-hero__eyebrow">JHS &amp; Associates LLP</p>
          <h1 className="del-hero__title">Delhi</h1>
          <p className="del-hero__sub">National Capital &amp; Strategic North India Office</p>
        </div>

        <div className="del-hero__card">
          <span className="del-hero__card-brand">JHS</span>
          <div className="del-hero__card-badge">Head Office — Connaught Place</div>
          <div className="del-hero__card-body">
            <div className="del-hero__card-addr">
              <IconPin />
              <span>306 DIF Center, Savitri Cinema Complex, Greater Kailash-II, Delhi – 110048</span>
            </div>
          </div>
          <div className="del-hero__card-info">
            <div className="del-hero__card-info-item">
              <div>
                <span className="del-hero__card-info-label">Phone</span>
                <span className="del-hero__card-info-val">+91 11 1234 5678</span>
              </div>
            </div>
            <div className="del-hero__card-info-item">
              <div>
                <span className="del-hero__card-info-label">Email</span>
                <span className="del-hero__card-info-val">delhi@jhsassociates.in</span>
              </div>
            </div>
            <div className="del-hero__card-info-item">
              <div>
                <span className="del-hero__card-info-label">Business Hours</span>
                <span className="del-hero__card-info-val">Mon–Sat, 9:30 AM – 6:30 PM</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════ PARTNERS ════════════ */}
      <section className="del-section del-section--light">
        <div className="del-container">
          <div className="del-section-hdr">
            <span className="del-section-hdr__tag">Our Team</span>
            <h2 className="del-section-hdr__title">Delhi Partners</h2>
            <p className="del-section-hdr__sub">
              Meet the leaders driving excellence across audit, tax, advisory, and assurance in Delhi.
            </p>
          </div>

          <div className="del-partners-grid">
            {PARTNERS.map(p => (
              <div key={p.name} className="del-pc-card">
                <PartnerAvatar image={p.image} name={p.name} />
                <div className="del-pc-info">
                  <h3 className="del-pc-name">{p.name}</h3>
                  <p className="del-pc-quals">{p.qualifications}</p>
                  <p className="del-pc-desig">{p.designation}</p>
                </div>
                <div className="del-pc-social">
                  <a href={`mailto:${p.email}`} className="del-pc-btn del-pc-btn--mail" title={`Email ${p.name}`}>
                    <IconMail />
                    <span>Email</span>
                  </a>
                  <a
                    href={p.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="del-pc-btn del-pc-btn--li"
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
      <section className="del-map-section">
        <div className="del-container">
          <div className="del-section-hdr">
            <span className="del-section-hdr__tag">Location</span>
            <h2 className="del-section-hdr__title">Head Office</h2>
          </div>
          <div className="del-map-wrap">
            <iframe
              title="JHS Delhi Head Office"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.9!2d77.2195!3d28.6315!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b347eb62d%3A0x52c2b7494e204dce!2sConnaught%20Place%2C%20New%20Delhi%2C%20Delhi%20110001!5e0!3m2!1sen!2sin!4v1680000000002!5m2!1sen!2sin"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* ════════════ BRANCHES ════════════ */}
      <section className="del-branches-section">
        <div className="del-container">
          <div className="del-section-hdr">
            <span className="del-section-hdr__tag del-section-hdr__tag--light">Sub-Offices</span>
            <h2 className="del-section-hdr__title del-section-hdr__title--light">Delhi Sub-Offices</h2>
            <p className="del-section-hdr__sub del-section-hdr__sub--light">
              Strategically located across Delhi-NCR's key business corridors for easier client access.
            </p>
          </div>
          <div className="del-branches-grid">
            {BRANCHES.map((b, i) => (
              <div key={b.name} className="del-branch-card">
                <div className="del-branch-card__num">0{i + 1}</div>
                <div className="del-branch-card__icon"><IconPin /></div>
                <h3 className="del-branch-card__name">{b.name}</h3>
                <p className="del-branch-card__addr">{b.address}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
