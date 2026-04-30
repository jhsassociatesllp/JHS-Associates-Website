import { useEffect } from 'react'
import './Mumbai.css'

/* ─── Hero background ───────────────────────────────── */
import mumbaiBg from '../../image/Mumbai 2.jpg'

/* ─── Partner Image Imports (Vite resolves these correctly) ─ */
import imgHuzeifa from '../../image/Huzefa-Unwala-removebg-preview.png'
import imgTasnim from '../../image/Tasnim-Tankiwala-removebg-preview.png'
import imgJamal from '../../image/Jamal-Chatriwala-removebg-preview.png'
import imgTaher from '../../image/Taher-Pepermintwala-removebg-preview.png'
import imgSahil from '../../image/Sahil-Shah-removebg-preview.png'
import imgTausif from '../../image/Tausif-Shaikh-removebg-preview.png'
import imgSamad from '../../image/Samad-Dhanani-removebg-preview.png'
import imgDisha from '../../image/Disha Shah-removebg-preview.png'
import imgDhanlaxmi from '../../image/Dhanlaxmi_-removebg-preview.png'

/* ─── Partner Data ─────────────────────────────────────── */
const PARTNERS = [
  {
    name: 'Huzeifa Unwala',
    image: imgHuzeifa,
    qualifications: 'FCA, CISA, ISO 27001, NISM(DP), NISM(Social Auditor)',
    designation: 'Statutory Audit',
    email: 'huzeifa.unwala@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/ca-huzeifa-unwala/',
  },
  {
    name: 'Tasnim Tankiwala',
    image: imgTasnim,
    qualifications: 'FCA | ND AS & IFRS',
    designation: 'Statutory Audit',
    email: 'tasnim.tankiwala@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/tasnim-tankiwala',
  },
  {
    name: 'Jamal Chatriwala',
    image: imgJamal,
    qualifications: 'B.Com, ACA',
    designation: 'IA & Risk Advisory, Insurance',
    email: 'jamal.chatriwala@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/chatriwala',
  },
  {
    name: 'Taher Pepermintwala',
    image: imgTaher,
    qualifications: 'B.Com, FCA, CISA, ACCA',
    designation: 'Assurance & Tech | SOC | Audit Expert',
    email: 'taher.pepermintwala@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/Taher Pepermintwala',
  },
  {
    name: 'Sahil Shah',
    image: imgSahil,
    qualifications: 'FCA',
    designation: 'Risk Advisory, IA, IPO & IPO Certification',
    email: 'sahil.shah@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/sahil-shah-664a5312a',
  },
  {
    name: 'Tausif Shaikh',
    image: imgTausif,
    qualifications: 'B.COM, ACA',
    designation: 'Assurance & Tax',
    email: 'tausif.shaikh@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/ca-tausif-shaikh',
  },
  {
    name: 'Samad Dhanani',
    image: imgSamad,
    qualifications: 'M.COM, CS, ACA',
    designation: 'Statutory & Accounts Outsourcing',
    email: 'samad.dhanani@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/samad-dhanani-9b342562',
  },
  {
    name: 'Disha Shah',
    image: imgDisha,
    qualifications: 'FCA',
    designation: 'Risk Advisory, IA & IPC',
    email: 'disha.shah@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/disha-shah-4826b097',
  },
  {
    name: 'Dhanlaxmi',
    image: imgDhanlaxmi,
    qualifications: 'FCA',
    designation: 'Risk Advisory, IA & IPC',
    email: 'dhanlaxmi.nair@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/dhanlaxmi-nair-311053206',
  }
]

/* ─── Branch Data ────────────────────────────────────────── */
const BRANCHES = [
  // {
  //   name: 'Borivali',
  //   address:
  //     '2201-2202, ESSPEE Tower, Opp. Oberoi Sky City, Near Prabhu Hotel, Borivali East, Maharashtra – 400066',
  // },
  {
    name: 'Masjid',
    address:
      "Unit No. 402, 4th floor, Nav Vyapar Bhavan, 49 P.D’mello Road, MB, Maharashtra – 400009",
  },
  {
    name: 'Kalyan',
    address:
      'Shop No 11-12, Regency Avenue, Below Gastrocare Hospital, Syndicate Bus Stop, Kalyan West, Maharashtra – 421301',
  },
]

/* ─── Partner Avatar — image only, no initials ───────────── */
function PartnerAvatar({ image, name }: { image: string; name: string }) {
  return (
    <div className="pc-avatar">
      <img src={image} alt={name} className="pc-avatar__img" />
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
export default function Mumbai() {
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])

  return (
    <div className="mum-page">

      {/* ════════════ HERO ════════════ */}
      <section className="mum-hero">
        <div className="mum-hero__photo" style={{ backgroundImage: `url(${mumbaiBg})` }} />
        <div className="mum-hero__overlay" />
        <div className="mum-hero__content">
          <p className="mum-hero__eyebrow">JHS &amp; Associates LLP</p>
          <h1 className="mum-hero__title">Mumbai</h1>
          <p className="mum-hero__sub">Principal Headquarters &amp; Largest Office</p>
        </div>

        <div className="mum-hero__card">
          <span className="mum-hero__card-brand">JHS</span>
          <div className="mum-hero__card-badge">Head Office — Andheri (East)</div>
          <div className="mum-hero__card-body">
            <div className="mum-hero__card-addr">
              <IconPin />
              <span>Unit No. B-406 to 410, 4th Floor, Navkar Chambers, Marol Naka Metro Station, Andheri (East), Maharashtra – 400059</span>
            </div>
          </div>
          {/* Info grid inside card — replaces the strip */}
          <div className="mum-hero__card-info">
            <div className="mum-hero__card-info-item">
              <div>
                <span className="mum-hero__card-info-label">Phone</span>
                <span className="mum-hero__card-info-val">1800 120 1022</span>
              </div>
            </div>
            <div className="mum-hero__card-info-item">
              <div>
                <span className="mum-hero__card-info-label">Email</span>
                <span className="mum-hero__card-info-val">connect@jhsassociates.in</span>
              </div>
            </div>
            <div className="mum-hero__card-info-item">
              <div>
                <span className="mum-hero__card-info-label">Business Hours</span>
                <span className="mum-hero__card-info-val">Mon–Sat, 9:30 AM – 6:30 PM</span>
              </div>
            </div>
            {/* <div className="mum-hero__card-info-item">
              <div>
                <span className="mum-hero__card-info-label">City</span>
                <span className="mum-hero__card-info-val">Mumbai, Maharashtra</span>
              </div>
            </div> */}
          </div>
        </div>
      </section>

      {/* Strip removed — info is now inside the hero card */}

      {/* ════════════ PARTNERS ════════════ */}
      <section className="mum-section mum-section--light">
        <div className="mum-container">
          <div className="mum-section-hdr">
            <span className="mum-section-hdr__tag">Our Team</span>
            <h2 className="mum-section-hdr__title">Mumbai Partners</h2>
            <p className="mum-section-hdr__sub">
              Meet the leaders driving excellence across audit, tax, advisory, and assurance in Mumbai.
            </p>
          </div>

          <div className="mum-partners-grid">
            {PARTNERS.map(p => (
              <div key={p.name} className="pc-card">
                {/* Photo */}
                <PartnerAvatar image={p.image} name={p.name} />

                {/* Info */}
                <div className="pc-info">
                  <h3 className="pc-name">{p.name}</h3>
                  <p className="pc-quals">{p.qualifications}</p>
                  <p className="pc-desig">{p.designation}</p>
                </div>

                {/* Social */}
                <div className="pc-social">
                  <a href={`mailto:${p.email}`} className="pc-btn pc-btn--mail" title={`Email ${p.name}`}>
                    <IconMail />
                    <span>Email</span>
                  </a>
                  <a
                    href={p.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pc-btn pc-btn--li"
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
      <section className="mum-map-section">
        <div className="mum-container">
          <div className="mum-section-hdr">
            <span className="mum-section-hdr__tag">Location</span>
            <h2 className="mum-section-hdr__title">Head Office – Andheri</h2>
          </div>
          <div className="mum-map-wrap">
            <iframe
              title="JHS Mumbai Head Office"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.528!2d72.87870!3d19.11540!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c83b69d4c3b5%3A0x4a8d5f2f9b4e8e2a!2sNavkar%20Chambers%2C%20Marol%20Naka%2C%20Andheri%20East%2C%20Mumbai%2C%20Maharashtra%20400059!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* ════════════ BRANCHES ════════════ */}
      <section className="mum-branches-section">
        <div className="mum-container">
          <div className="mum-section-hdr">
            <span className="mum-section-hdr__tag mum-section-hdr__tag--light">Sub-Offices</span>
            <h2 className="mum-section-hdr__title mum-section-hdr__title--light">Mumbai Sub-Offices</h2>
            <p className="mum-section-hdr__sub mum-section-hdr__sub--light">
              Strategically located across Mumbai's key corridors for easier client access.
            </p>
          </div>
          <div className="mum-branches-grid">
            {BRANCHES.map((b, i) => (
              <div key={b.name} className="mum-branch-card">
                <div className="mum-branch-card__num">0{i + 1}</div>
                <div className="mum-branch-card__icon"><IconPin /></div>
                <h3 className="mum-branch-card__name">{b.name}</h3>
                <p className="mum-branch-card__addr">{b.address}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
