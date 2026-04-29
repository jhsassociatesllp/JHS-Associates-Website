import { useEffect } from 'react'
import './Kolkata.css'

import kolkataBg from '../../image/Kolkata.jpg'
import imgSharad from '../../image/Sharad-Mohata-removebg-preview.png'
import imgViranch from '../../image/Viranch-Modi-removebg-preview.png'
import imgJagdish from '../../image/Jagdish-Solanki-removebg-preview.png'
import imgSunil from '../../image/Sunil-Pathak-removebg-preview.png'

const PARTNERS = [
  {
    name: 'Sharad Mohata',
    image: imgSharad,
    qualifications: 'FCA',
    designation: 'Tax & Corporate Advisory',
    email: 'sharad.mohata.kol@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/sharad-mohata-kol',
  },
  {
    name: 'Viranch Modi',
    image: imgViranch,
    qualifications: 'FCA',
    designation: 'GST & Indirect Tax',
    email: 'viranch.modi.kol@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/viranch-modi-kol',
  },
  {
    name: 'Jagdish Solanki',
    image: imgJagdish,
    qualifications: 'FCA',
    designation: 'Statutory Audit & Assurance',
    email: 'jagdish.solanki.kol@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/jagdish-solanki-kol',
  },
  {
    name: 'Sunil Pathak',
    image: imgSunil,
    qualifications: 'FCA',
    designation: 'Risk Advisory & Compliance',
    email: 'sunil.pathak.kol@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/sunil-pathak-kol',
  },
]

const BRANCHES = [
  {
    name: 'Park Street',
    address: '6th Floor, Chatterjee International, 33A Jawaharlal Nehru Road, Park Street, Kolkata, West Bengal – 700071',
  },
  {
    name: 'Salt Lake',
    address: 'Block EP, Salt Lake Sector V, Bidhannagar, Kolkata, West Bengal – 700091',
  },
]

function PartnerAvatar({ image, name }: { image: string; name: string }) {
  return (
    <div className="kol-pc-avatar">
      <img src={image} alt={name} className="kol-pc-avatar__img" />
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

export default function Kolkata() {
  useEffect(() => { window.scrollTo({ top: 0 }) }, [])
  return (
    <div className="kol-page">
      <section className="kol-hero">
        <div className="kol-hero__photo" style={{ backgroundImage: `url(${kolkataBg})` }} />
        <div className="kol-hero__overlay" />
        <div className="kol-hero__content">
          <p className="kol-hero__eyebrow">JHS &amp; Associates LLP</p>
          <h1 className="kol-hero__title">Kolkata</h1>
          <p className="kol-hero__sub">City of Joy &amp; Eastern India Business Gateway</p>
        </div>
        <div className="kol-hero__card">
          <span className="kol-hero__card-brand">JHS</span>
          <div className="kol-hero__card-badge">Head Office</div>
          <div className="kol-hero__card-body">
            <div className="kol-hero__card-addr">
              <IconPin />
              <span>Unit No. 402, 4th floor, Vardhan Complex, 25A Camac Street, Kolkata, West Bengal – 700016</span>
            </div>
          </div>
          <div className="kol-hero__card-info">
            <div className="kol-hero__card-info-item">
              <div>
                <span className="kol-hero__card-info-label">Phone</span>
                <span className="kol-hero__card-info-val">+91 33 1234 5678</span>
              </div>
            </div>
            <div className="kol-hero__card-info-item">
              <div>
                <span className="kol-hero__card-info-label">Email</span>
                <span className="kol-hero__card-info-val">kolkata@jhsassociates.in</span>
              </div>
            </div>
            <div className="kol-hero__card-info-item">
              <div>
                <span className="kol-hero__card-info-label">Business Hours</span>
                <span className="kol-hero__card-info-val">Mon–Sat, 9:30 AM – 6:30 PM</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="kol-section kol-section--light">
        <div className="kol-container">
          <div className="kol-section-hdr">
            <span className="kol-section-hdr__tag">Our Team</span>
            <h2 className="kol-section-hdr__title">Kolkata Partners</h2>
            <p className="kol-section-hdr__sub">
              Meet the leaders driving excellence across audit, tax, advisory, and assurance in Kolkata.
            </p>
          </div>
          <div className="kol-partners-grid">
            {PARTNERS.map(p => (
              <div key={p.name} className="kol-pc-card">
                <PartnerAvatar image={p.image} name={p.name} />
                <div className="kol-pc-info">
                  <h3 className="kol-pc-name">{p.name}</h3>
                  <p className="kol-pc-quals">{p.qualifications}</p>
                  <p className="kol-pc-desig">{p.designation}</p>
                </div>
                <div className="kol-pc-social">
                  <a href={`mailto:${p.email}`} className="kol-pc-btn kol-pc-btn--mail"><IconMail /><span>Email</span></a>
                  <a href={p.linkedin} target="_blank" rel="noopener noreferrer" className="kol-pc-btn kol-pc-btn--li"><IconLinkedIn /><span>LinkedIn</span></a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="kol-map-section">
        <div className="kol-container">
          <div className="kol-section-hdr">
            <span className="kol-section-hdr__tag">Location</span>
            <h2 className="kol-section-hdr__title">Head Office – Park Street</h2>
          </div>
          <div className="kol-map-wrap">
            <iframe title="JHS Kolkata Head Office"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3684.4!2d88.3529!3d22.5448!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a0277c0a7a00001%3A0x5b9f2a8e3f3e8b1a!2sPark%20Street%2C%20Kolkata%2C%20West%20Bengal!5e0!3m2!1sen!2sin!4v1680000000006"
              allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        </div>
      </section>

      <section className="kol-branches-section">
        <div className="kol-container">
          <div className="kol-section-hdr">
            <span className="kol-section-hdr__tag kol-section-hdr__tag--light">Sub-Offices</span>
            <h2 className="kol-section-hdr__title kol-section-hdr__title--light">Kolkata Sub-Offices</h2>
            <p className="kol-section-hdr__sub kol-section-hdr__sub--light">
              Strategically located across Kolkata's key corridors for easier client access.
            </p>
          </div>
          <div className="kol-branches-grid">
            {BRANCHES.map((b, i) => (
              <div key={b.name} className="kol-branch-card">
                <div className="kol-branch-card__num">0{i + 1}</div>
                <div className="kol-branch-card__icon"><IconPin /></div>
                <h3 className="kol-branch-card__name">{b.name}</h3>
                <p className="kol-branch-card__addr">{b.address}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
