import { useEffect } from 'react'
import './SharedAbout.css'
import './Partners.css'
import heroBg from '../../image/WebPoster3.jpeg'

// Images
import huzeifa from '../../image/Huzefa-Unwala-removebg-preview.png'
import nikhel from '../../image/Nikhel-Kochhar-removebg-preview.png'
import kalpesh from '../../image/Kalpesh-Parmar-removebg-preview.png'
import sharad from '../../image/Sharad-Mohata-removebg-preview.png'
import tasnim from '../../image/Tasnim-Tankiwala-removebg-preview.png'
import jamal from '../../image/Jamal-Chatriwala-removebg-preview.png'
import taher from '../../image/Taher-Pepermintwala-removebg-preview.png'
import sahil from '../../image/Sahil-Shah-removebg-preview.png'
import tausif from '../../image/Tausif-Shaikh-removebg-preview.png'
import samad from '../../image/Samad-Dhanani-removebg-preview.png'
import hitesh from '../../image/Hitesh-Khandelwal-removebg-preview.png'
import sunil from '../../image/Sunil-Pathak-removebg-preview.png'
import jagdish from '../../image/Jagdish-Solanki-removebg-preview.png'
import narayana from '../../image/Narayana-Rao-Malla-removebg-preview.png'
import virendra from '../../image/Virendra-Nayyar-removebg-preview.png'
import dhaval from '../../image/Dhaval-Thakkar-removebg-preview.png'
import viranch from '../../image/Viranch-Modi-removebg-preview.png'
import milin from '../../image/Milin-Parekh-removebg-preview.png'
import mehul from '../../image/Mehul-Shah-removebg-preview.png'
import alpesh from '../../image/Alpesh-Vaniya-removebg-preview.png'
import raj from '../../image/Raj-Shah-removebg-preview.png'
import saurabh from '../../image/Saurabh-Shah-removebg-preview.png'
import disha from '../../image/Disha Shah-removebg-preview.png'

const PARTNER_DATA = [
  {
    category: "Senior Board of Partners",
    members: [
      {
        name: "Huzeifa Unwala",
        image: huzeifa,
        creds: "FCA, CISA, ISO 27001, NISM, Social Auditor",
        desc: "Specializes in IT risk governance, cyber security frameworks, and complex systems audits across BFSI sectors.",
        linkedin: "https://linkedin.com/"
      },
      {
        name: "Nikhel Kochhar",
        image: nikhel,
        creds: "FCA, CIA",
        desc: "Over 25 years of expertise in internal audits, corporate governance, and strategic management consulting.",
        linkedin: "https://linkedin.com/"
      },
      {
        name: "Kalpesh Parmar",
        image: kalpesh,
        creds: "B.Com (Hons), FCA",
        desc: "Leads the statutory audit practice. Expert in Ind AS implementation and complex consolidation for listed entities.",
        linkedin: "https://linkedin.com/"
      },
      {
        name: "Sharad Mohata",
        image: sharad,
        creds: "B.Com (Hons), FCA, ICWAI",
        desc: "Specializes in direct taxation, corporate restructuring, and international tax advisory.",
        linkedin: "https://linkedin.com/"
      },
      {
        name: "Vinod Joshi",
        image: null,
        creds: "FCA, MBA (Finance)",
        desc: "Renowned for financial modeling, M&A restructuring, and cross-border strategic alliances.",
        linkedin: "https://linkedin.com/"
      }
    ]
  },
  {
    category: "Mumbai Partners",
    members: [
      {
        name: "Tasnim Tankiwala",
        image: tasnim,
        creds: "FCA",
        desc: "Expert in risk management audits and SOX compliance.",
        linkedin: "https://www.linkedin.com/in/tasnim-tankiwala"
      },
      {
        name: "Jamal Chatriwala",
        image: jamal,
        creds: "FCA",
        desc: "Specializes in indirect tax litigation and GST advisory.",
        linkedin: "https://www.linkedin.com/in/chatriwala"
      },
      {
        name: "Taher Pepermintwala",
        image: taher,
        creds: "FCA, DISA",
        desc: "Leads technology assurance and ERP implementation audits.",
        linkedin: "https://www.linkedin.com/in/Taher Pepermintwala"
      },
      {
        name: "Sahil Shah",
        image: sahil,
        creds: "FCA",
        desc: "Focuses on capital restructuring and VC funding advisory.",
        linkedin: "https://www.linkedin.com/in/sahil-shah-664a5312a"
      },
      {
        name: "Tausif Shaikh",
        image: tausif,
        creds: "FCA",
        desc: "Expert in forensic accounting and fraud investigation.",
        linkedin: "https://www.linkedin.com/in/ca-tausif-shaikh"
      },
      {
        name: "Samad Dhanani",
        image: samad,
        creds: "FCA",
        desc: "Drive growth through comprehensive financial planning and analysis.",
        linkedin: "https://www.linkedin.com/in/samad-dhanani-9b342562"
      },
      {
        name: 'Disha Shah',
        image: disha,
        qualifications: 'FCA',
        designation: 'Risk Advisory, IA & IPC',
        linkedin: 'https://www.linkedin.com/in/disha-shah-4826b097',
      },
    ]
  },
  {
    category: "Delhi, Bengaluru & Chennai Partners",
    members: [
      {
        name: "Hitesh Khandelwal",
        image: hitesh,
        creds: "FCA",
        desc: "Leads North India operations with expertise in corporate tax.",
        linkedin: "https://www.linkedin.com/in/hitesh-khandelwal-blr"
      },
      {
        name: "Sunil Pathak",
        image: sunil,
        creds: "FCA",
        desc: "Drives South India expansion, specializing in start-up advisory.",
        linkedin: "https://www.linkedin.com/in/sunil-pathak"
      },
      {
        name: "Jagdish Solanki",
        image: jagdish,
        creds: "FCA",
        desc: "Expert in transfer pricing and cross-border transactions.",
        linkedin: "https://linkedin.com/"
      },
      {
        name: "Narayana Rao Malla",
        image: narayana,
        creds: "FCA",
        desc: "Spearheads the IT/ITES industry group for internal audits.",
        linkedin: "https://linkedin.com/"
      }
    ]
  },
  {
    category: "Gujarat Partners",
    members: [
      {
        name: "Virendra Nayyar",
        image: virendra,
        creds: "FCA",
        desc: "Senior guide for Gujarat manufacturing sector audits.",
        linkedin: "https://linkedin.com/"
      },
      {
        name: "Dhaval Thakkar",
        image: dhaval,
        creds: "FCA",
        desc: "Ahmedabad operations lead, focusing on SME growth advisory.",
        linkedin: "https://www.linkedin.com/in/dhaval-thakkar"
      },
      {
        name: "Viranch Modi",
        image: viranch,
        creds: "FCA",
        desc: "Expert in real estate structuring and RERA compliance.",
        linkedin: "https://www.linkedin.com/in/viranch-modi"
      },
      {
        name: "Milin Parekh",
        image: milin,
        creds: "FCA",
        desc: "Specializes in concurrent and statutory bank audits.",
        linkedin: "https://www.linkedin.com/in/milin-parekh"
      },
      {
        name: "Mehul Shah",
        image: mehul,
        creds: "FCA",
        desc: "Focuses on supply chain and process audits.",
        linkedin: "https://www.linkedin.com/in/mehul-shah"
      },
      {
        name: "Alpesh Vaniya",
        image: alpesh,
        creds: "FCA",
        desc: "Tax optimization specialist for HNIs and family offices.",
        linkedin: "https://www.linkedin.com/in/alpesh-vaniya"
      },
      {
        name: "Raj Shah",
        image: raj,
        creds: "FCA",
        desc: "Drives valuation and due diligence practices in Vadodara.",
        linkedin: "https://www.linkedin.com/in/raj-shah"
      },
      {
        name: "Saurabh Shah",
        image: saurabh,
        creds: "FCA",
        desc: "Core team member for industrial and chemical sector audits.",
        linkedin: "https://www.linkedin.com/in/saurabh-shah"
      },
      // {
      //   name: "Disha Shah",
      //   image: disha,
      //   creds: "FCA",
      //   desc: "Leads women-entrepreneur advisory and compliance initiatives.",
      //   linkedin: "https://linkedin.com/"
      // }
    ]
  }
];

const IconLinkedIn = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
)

export default function Partners() {
  useEffect(() => { window.scrollTo({ top: 0 }) }, [])

  return (
    <div className="ap-page">
      {/* ════ HERO ════ */}
      <section className="ap-hero">
        <div className="ap-hero__bg" style={{ backgroundImage: `url(${heroBg})` }} />
        <div className="ap-hero__overlay" />
        <div className="ap-hero__content">
          <p className="ap-hero__eyebrow">Our Experts</p>
          <h1 className="ap-hero__title">Leadership Team</h1>
          <p className="ap-hero__sub">
            Meet the visionary board and senior partners steering JHS to new heights.
          </p>
        </div>
      </section>

      {/* ════ CONTENT ════ */}
      <section className="partners-section">
        <div className="ap-container">

          <div className="partners-intro">
            <h2>Driven by Experience</h2>
            <p>Our leadership comprises some of the most respected minds in the accounting and advisory profession, offering deep industry specializations and unparalleled insight.</p>
          </div>

          <div className="partners-list">
            {PARTNER_DATA.map((section, idx) => (
              <div key={idx} className="partner-category">
                <h3 className="partner-category__title">{section.category}</h3>

                <div className={`partner-grid ${idx === 0 ? 'partner-grid--senior' : ''}`}>
                  {section.members.map((member, mIdx) => (
                    <div key={mIdx} className="partner-card">
                      <div className="partner-card__img-wrapper">
                        {member.image ? (
                          <img src={member.image} alt={member.name} className="partner-card__img" />
                        ) : (
                          <div className="partner-card__placeholder">
                            <span>{member.name.charAt(0)}</span>
                          </div>
                        )}
                      </div>

                      <div className="partner-card__info">
                        <h4 className="partner-card__name">{member.name}</h4>
                        <p className="partner-card__creds">{member.creds}</p>
                        <p className="partner-card__desc">{member.desc}</p>

                        <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="partner-card__social">
                          <IconLinkedIn />
                          <span>Connect</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  )
}
