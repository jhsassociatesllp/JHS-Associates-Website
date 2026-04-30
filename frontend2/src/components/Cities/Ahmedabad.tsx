import { useEffect } from 'react'
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

/* ─── Partner Data ─────────────────────────────────────── */
const PARTNERS = [
  {
    name: 'Alpesh Vaniya',
    image: imgAlpesh,
    qualifications: 'FCA',
    designation: 'Statutory Audit & Assurance',
    email: 'alpesh.vaniya@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/alpesh-vaniya',
  },
  {
    name: 'Dhaval Thakkar',
    image: imgDhaval,
    qualifications: 'FCA',
    designation: 'Tax & Regulatory Advisory',
    email: 'dhaval.thakkar@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/dhaval-thakkar',
  },
  {
    name: 'Hitesh Khandelwal',
    image: imgHitesh,
    qualifications: 'FCA',
    designation: 'Risk Advisory & Internal Audit',
    email: 'hitesh.khandelwal@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/hitesh-khandelwal',
  },
  {
    name: 'Jagdish Solanki',
    image: imgJagdish,
    qualifications: 'FCA',
    designation: 'Statutory Audit',
    email: 'jagdish.solanki@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/jagdish-solanki',
  },
  {
    name: 'Kalpesh Parmar',
    image: imgKalpesh,
    qualifications: 'FCA',
    designation: 'Accounts Outsourcing & Compliance',
    email: 'kalpesh.parmar@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/kalpesh-parmar',
  },
  {
    name: 'Mehul Shah',
    image: imgMehul,
    qualifications: 'FCA',
    designation: 'Assurance & Financial Reporting',
    email: 'mehul.shah@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/mehul-shah',
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
    designation: 'IA & Risk Management',
    email: 'raj.shah@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/raj-shah',
  },
  {
    name: 'Saurabh Shah',
    image: imgSaurabh,
    qualifications: 'FCA',
    designation: 'Statutory Audit & Ind AS',
    email: 'saurabh.shah@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/saurabh-shah',
  },
  {
    name: 'Viranch Modi',
    image: imgViranch,
    qualifications: 'FCA',
    designation: 'GST, Indirect Tax & Compliance',
    email: 'viranch.modi@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/viranch-modi',
  },
]

/* ─── Branch Data ────────────────────────────────────────── */
const BRANCHES = [
  {
    name: 'Vapi',
    address:
      'Office No.101, Saga Casa, Daulat Nagar, Chala, Vapi, Gujarat – 396215',
  },
  {
    name: 'Rajkot',
    address:
      'B-303 Kings Heights, Vidya Kunj Society Main Road, Rajkot, Gujarat – 360001',
  },
  {
    name: 'Surat',
    address:
      '5th Floor, 504, Shubh Square, Above ICICI Bank, Lal Darwaja, Surat, Gujarat – 395003',
  },
]

/* ─── Partner Avatar ─────────────────────────────────────── */
function PartnerAvatar({ image, name }: { image: string; name: string }) {
  return (
    <div className="ahm-pc-avatar">
      <img src={image} alt={name} className="ahm-pc-avatar__img" />
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
export default function Ahmedabad() {
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])

  return (
    <div className="ahm-page">

      {/* ════════════ HERO ════════════ */}
      <section className="ahm-hero">
        <div className="ahm-hero__photo" style={{ backgroundImage: `url(${ahmedabadBg})` }} />
        <div className="ahm-hero__overlay" />
        <div className="ahm-hero__content">
          <p className="ahm-hero__eyebrow">JHS &amp; Associates LLP</p>
          <h1 className="ahm-hero__title">Ahmedabad</h1>
          <p className="ahm-hero__sub">Regional Hub &amp; Key Western India Office</p>
        </div>

        <div className="ahm-hero__card">
          <span className="ahm-hero__card-brand">JHS</span>
          <div className="ahm-hero__card-badge">Head Office</div>
          <div className="ahm-hero__card-body">
            <div className="ahm-hero__card-addr">
              <IconPin />
              <span>1016-1021, Swati Crimson and Clover, Near Shilaj Bridge, Ahmedabad, Gujarat – 380059</span>
            </div>
          </div>
          <div className="ahm-hero__card-info">
            <div className="ahm-hero__card-info-item">
              <div>
                <span className="ahm-hero__card-info-label">Phone</span>
                <span className="ahm-hero__card-info-val">+91 79 1234 5678</span>
              </div>
            </div>
            <div className="ahm-hero__card-info-item">
              <div>
                <span className="ahm-hero__card-info-label">Email</span>
                <span className="ahm-hero__card-info-val">ahmedabad@jhsassociates.in</span>
              </div>
            </div>
            <div className="ahm-hero__card-info-item">
              <div>
                <span className="ahm-hero__card-info-label">Business Hours</span>
                <span className="ahm-hero__card-info-val">Mon–Sat, 9:30 AM – 6:30 PM</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════ PARTNERS ════════════ */}
      <section className="ahm-section ahm-section--light">
        <div className="ahm-container">
          <div className="ahm-section-hdr">
            <span className="ahm-section-hdr__tag">Our Team</span>
            <h2 className="ahm-section-hdr__title">Ahmedabad Partners</h2>
            <p className="ahm-section-hdr__sub">
              Meet the leaders driving excellence across audit, tax, advisory, and assurance in Ahmedabad.
            </p>
          </div>

          <div className="ahm-partners-grid">
            {PARTNERS.map(p => (
              <div key={p.name} className="ahm-pc-card">
                <PartnerAvatar image={p.image} name={p.name} />
                <div className="ahm-pc-info">
                  <h3 className="ahm-pc-name">{p.name}</h3>
                  <p className="ahm-pc-quals">{p.qualifications}</p>
                  <p className="ahm-pc-desig">{p.designation}</p>
                </div>
                <div className="ahm-pc-social">
                  <a href={`mailto:${p.email}`} className="ahm-pc-btn ahm-pc-btn--mail" title={`Email ${p.name}`}>
                    <IconMail />
                    <span>Email</span>
                  </a>
                  <a
                    href={p.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ahm-pc-btn ahm-pc-btn--li"
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
      <section className="ahm-map-section">
        <div className="ahm-container">
          <div className="ahm-section-hdr">
            <span className="ahm-section-hdr__tag">Location</span>
            <h2 className="ahm-section-hdr__title">Head Office</h2>
          </div>
          <div className="ahm-map-wrap">
            <iframe
              title="JHS Ahmedabad Head Office"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.9!2d72.5078!3d23.0225!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e848aba5bd449%3A0x4fcedd11614f6516!2sSG%20Highway%2C%20Ahmedabad%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1680000000001!5m2!1sen!2sin"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* ════════════ BRANCHES ════════════ */}
      <section className="ahm-branches-section">
        <div className="ahm-container">
          <div className="ahm-section-hdr">
            <span className="ahm-section-hdr__tag ahm-section-hdr__tag--light">Sub-Offices</span>
            <h2 className="ahm-section-hdr__title ahm-section-hdr__title--light">Ahmedabad Sub-Offices</h2>
            <p className="ahm-section-hdr__sub ahm-section-hdr__sub--light">
              Strategically located across Ahmedabad's key business corridors for easier client access.
            </p>
          </div>
          <div className="ahm-branches-grid">
            {BRANCHES.map((b, i) => (
              <div key={b.name} className="ahm-branch-card">
                <div className="ahm-branch-card__num">0{i + 1}</div>
                <div className="ahm-branch-card__icon"><IconPin /></div>
                <h3 className="ahm-branch-card__name">{b.name}</h3>
                <p className="ahm-branch-card__addr">{b.address}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
