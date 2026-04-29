import { useEffect } from 'react'
import './Bengaluru.css'

import bengaluruBg from '../../image/Bengluru.avif'
// import imgSahil from '../../image/Sahil-Shah-removebg-preview.png'
import imgSaurabh from '../../image/Saurabh-Shah-removebg-preview.png'
import imgHitesh from '../../image/Hitesh-Khandelwal-removebg-preview.png'
import imgAlpesh from '../../image/Alpesh-Vaniya-removebg-preview.png'

const PARTNERS = [
  // {
  //   name: 'Sahil Shah',
  //   image: imgSahil,
  //   qualifications: 'FCA',
  //   designation: 'Risk Advisory, IA & IPO Certification',
  //   email: 'sahil.shah.blr@jhsassociates.in',
  //   linkedin: 'https://www.linkedin.com/in/sahil-shah-blr',
  // },
  {
    name: 'Saurabh Shah',
    image: imgSaurabh,
    qualifications: 'FCA',
    designation: 'Statutory Audit & Ind AS',
    email: 'saurabh.shah.blr@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/saurabh-shah-blr',
  },
  {
    name: 'Hitesh Khandelwal',
    image: imgHitesh,
    qualifications: 'FCA',
    designation: 'Risk Advisory & Internal Audit',
    email: 'hitesh.khandelwal.blr@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/hitesh-khandelwal-blr',
  },
  {
    name: 'Alpesh Vaniya',
    image: imgAlpesh,
    qualifications: 'FCA',
    designation: 'Statutory Audit & Assurance',
    email: 'alpesh.vaniya.blr@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/alpesh-vaniya-blr',
  },
]

const BRANCHES = [
  {
    name: 'Koramangala',
    address: '4th Floor, Prestige Meridian, 29 MG Road, Koramangala, Bengaluru, Karnataka – 560034',
  },
  {
    name: 'Whitefield',
    address: '502, 5th Floor, Salarpuria Softzone, Whitefield, Bengaluru, Karnataka – 560066',
  },
]

function PartnerAvatar({ image, name }: { image: string; name: string }) {
  return (
    <div className="blr-pc-avatar">
      <img src={image} alt={name} className="blr-pc-avatar__img" />
    </div>
  )
}

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

export default function Bengaluru() {
  useEffect(() => { window.scrollTo({ top: 0 }) }, [])
  return (
    <div className="blr-page">
      <section className="blr-hero">
        <div className="blr-hero__photo" style={{ backgroundImage: `url(${bengaluruBg})` }} />
        <div className="blr-hero__overlay" />
        <div className="blr-hero__content">
          <p className="blr-hero__eyebrow">JHS &amp; Associates LLP</p>
          <h1 className="blr-hero__title">Bengaluru</h1>
          <p className="blr-hero__sub">Silicon Valley of India &amp; South India Tech Office</p>
        </div>
        <div className="blr-hero__card">
          <span className="blr-hero__card-brand">JHS</span>
          <div className="blr-hero__card-badge">Head Office — Koramangala</div>
          <div className="blr-hero__card-body">
            <div className="blr-hero__card-addr">
              <IconPin />
              <span>3rd Floor, Building No 589, 60 Ft Main Road, AECS Layout, Kundalahalli, Bengaluru, Karnataka – 560037</span>
            </div>
          </div>
          <div className="blr-hero__card-info">
            <div className="blr-hero__card-info-item">
              <div>
                <span className="blr-hero__card-info-label">Phone</span>
                <span className="blr-hero__card-info-val">+91 80 1234 5678</span>
              </div>
            </div>
            <div className="blr-hero__card-info-item">
              <div>
                <span className="blr-hero__card-info-label">Email</span>
                <span className="blr-hero__card-info-val">bengaluru@jhsassociates.in</span>
              </div>
            </div>
            <div className="blr-hero__card-info-item">
              <div>
                <span className="blr-hero__card-info-label">Business Hours</span>
                <span className="blr-hero__card-info-val">Mon–Sat, 9:30 AM – 6:30 PM</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="blr-section blr-section--light">
        <div className="blr-container">
          <div className="blr-section-hdr">
            <span className="blr-section-hdr__tag">Our Team</span>
            <h2 className="blr-section-hdr__title">Bengaluru Partners</h2>
            <p className="blr-section-hdr__sub">
              Meet the leaders driving excellence across audit, tax, advisory, and assurance in Bengaluru.
            </p>
          </div>
          <div className="blr-partners-grid">
            {PARTNERS.map(p => (
              <div key={p.name} className="blr-pc-card">
                <PartnerAvatar image={p.image} name={p.name} />
                <div className="blr-pc-info">
                  <h3 className="blr-pc-name">{p.name}</h3>
                  <p className="blr-pc-quals">{p.qualifications}</p>
                  <p className="blr-pc-desig">{p.designation}</p>
                </div>
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
            <span className="blr-section-hdr__tag">Location</span>
            <h2 className="blr-section-hdr__title">Head Office</h2>
          </div>
          <div className="blr-map-wrap">
            <iframe title="JHS Bengaluru Head Office"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.6!2d77.6263!3d12.9352!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sKoramangala%2C%20Bengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1680000000005"
              allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        </div>
      </section>

      <section className="blr-branches-section">
        <div className="blr-container">
          <div className="blr-section-hdr">
            <span className="blr-section-hdr__tag blr-section-hdr__tag--light">Sub-Offices</span>
            <h2 className="blr-section-hdr__title blr-section-hdr__title--light">Bengaluru Sub-Offices</h2>
            <p className="blr-section-hdr__sub blr-section-hdr__sub--light">
              Strategically located across Bengaluru's key tech and business corridors for easier client access.
            </p>
          </div>
          <div className="blr-branches-grid">
            {BRANCHES.map((b, i) => (
              <div key={b.name} className="blr-branch-card">
                <div className="blr-branch-card__num">0{i + 1}</div>
                <div className="blr-branch-card__icon"><IconPin /></div>
                <h3 className="blr-branch-card__name">{b.name}</h3>
                <p className="blr-branch-card__addr">{b.address}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
