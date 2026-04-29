import { useEffect } from 'react'
import './Vadodara.css'

import vadodaraBg from '../../image/Vadodara.jpg'
import imgMehul from '../../image/Mehul-Shah-removebg-preview.png'
import imgMilin from '../../image/Milin-Parekh-removebg-preview.png'
import imgRaj from '../../image/Raj-Shah-removebg-preview.png'
import imgKalpesh from '../../image/Kalpesh-Parmar-removebg-preview.png'

const PARTNERS = [
  {
    name: 'Mehul Shah',
    image: imgMehul,
    qualifications: 'FCA',
    designation: 'Statutory Audit & Assurance',
    email: 'mehul.shah.vad@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/mehul-shah-vadodara',
  },
  {
    name: 'Milin Parekh',
    image: imgMilin,
    qualifications: 'FCA',
    designation: 'Direct Tax & Advisory',
    email: 'milin.parekh@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/milin-parekh',
  },
  {
    name: 'Raj Shah',
    image: imgRaj,
    qualifications: 'FCA',
    designation: 'Risk Advisory & Internal Audit',
    email: 'raj.shah.vad@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/raj-shah-vadodara',
  },
  {
    name: 'Kalpesh Parmar',
    image: imgKalpesh,
    qualifications: 'FCA',
    designation: 'Accounts Outsourcing & Compliance',
    email: 'kalpesh.parmar@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/kalpesh-parmar',
  },
]

const BRANCHES = [
  {
    name: 'Alkapuri',
    address: '301, 3rd Floor, Kumar Plaza, Alkapuri, Vadodara, Gujarat – 390007',
  },
  {
    name: 'Fatehgunj',
    address: '102, Dev Complex, Near BSNL Office, Fatehgunj, Vadodara, Gujarat – 390002',
  },
]

function PartnerAvatar({ image, name }: { image: string; name: string }) {
  return (
    <div className="vad-pc-avatar">
      <img src={image} alt={name} className="vad-pc-avatar__img" />
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

export default function Vadodara() {
  useEffect(() => { window.scrollTo({ top: 0 }) }, [])
  return (
    <div className="vad-page">
      <section className="vad-hero">
        <div className="vad-hero__photo" style={{ backgroundImage: `url(${vadodaraBg})` }} />
        <div className="vad-hero__overlay" />
        <div className="vad-hero__content">
          <p className="vad-hero__eyebrow">JHS &amp; Associates LLP</p>
          <h1 className="vad-hero__title">Vadodara</h1>
          <p className="vad-hero__sub">Cultural Capital &amp; Growing Business Hub of Gujarat</p>
        </div>
        <div className="vad-hero__card">
          <span className="vad-hero__card-brand">JHS</span>
          <div className="vad-hero__card-badge">Head Office</div>
          <div className="vad-hero__card-body">
            <div className="vad-hero__card-addr">
              <IconPin />
              <span>4th floor, Lila Chambers, Notus Pride, Vadodara, Gujarat – 390023</span>
            </div>
          </div>
          <div className="vad-hero__card-info">
            <div className="vad-hero__card-info-item">
              <div>
                <span className="vad-hero__card-info-label">Phone</span>
                <span className="vad-hero__card-info-val">+91 265 1234 5678</span>
              </div>
            </div>
            <div className="vad-hero__card-info-item">
              <div>
                <span className="vad-hero__card-info-label">Email</span>
                <span className="vad-hero__card-info-val">vadodara@jhsassociates.in</span>
              </div>
            </div>
            <div className="vad-hero__card-info-item">
              <div>
                <span className="vad-hero__card-info-label">Business Hours</span>
                <span className="vad-hero__card-info-val">Mon–Sat, 9:30 AM – 6:30 PM</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="vad-section vad-section--light">
        <div className="vad-container">
          <div className="vad-section-hdr">
            <span className="vad-section-hdr__tag">Our Team</span>
            <h2 className="vad-section-hdr__title">Vadodara Partners</h2>
            <p className="vad-section-hdr__sub">
              Meet the leaders driving excellence across audit, tax, advisory, and assurance in Vadodara.
            </p>
          </div>
          <div className="vad-partners-grid">
            {PARTNERS.map(p => (
              <div key={p.name} className="vad-pc-card">
                <PartnerAvatar image={p.image} name={p.name} />
                <div className="vad-pc-info">
                  <h3 className="vad-pc-name">{p.name}</h3>
                  <p className="vad-pc-quals">{p.qualifications}</p>
                  <p className="vad-pc-desig">{p.designation}</p>
                </div>
                <div className="vad-pc-social">
                  <a href={`mailto:${p.email}`} className="vad-pc-btn vad-pc-btn--mail"><IconMail /><span>Email</span></a>
                  <a href={p.linkedin} target="_blank" rel="noopener noreferrer" className="vad-pc-btn vad-pc-btn--li"><IconLinkedIn /><span>LinkedIn</span></a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="vad-map-section">
        <div className="vad-container">
          <div className="vad-section-hdr">
            <span className="vad-section-hdr__tag">Location</span>
            <h2 className="vad-section-hdr__title">Head Office – Alkapuri</h2>
          </div>
          <div className="vad-map-wrap">
            <iframe title="JHS Vadodara Head Office"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3691.4!2d73.1812!3d22.3119!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395fc5873e48f5a9%3A0x1be90e4cce8bf0c6!2sAlkapuri%2C%20Vadodara%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1680000000004"
              allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        </div>
      </section>

      <section className="vad-branches-section">
        <div className="vad-container">
          <div className="vad-section-hdr">
            <span className="vad-section-hdr__tag vad-section-hdr__tag--light">Sub-Offices</span>
            <h2 className="vad-section-hdr__title vad-section-hdr__title--light">Vadodara Sub-Offices</h2>
            <p className="vad-section-hdr__sub vad-section-hdr__sub--light">
              Strategically located across Vadodara's key business corridors for easier client access.
            </p>
          </div>
          <div className="vad-branches-grid">
            {BRANCHES.map((b, i) => (
              <div key={b.name} className="vad-branch-card">
                <div className="vad-branch-card__num">0{i + 1}</div>
                <div className="vad-branch-card__icon"><IconPin /></div>
                <h3 className="vad-branch-card__name">{b.name}</h3>
                <p className="vad-branch-card__addr">{b.address}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
