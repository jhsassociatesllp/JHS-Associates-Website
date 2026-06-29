import { useEffect } from 'react'
import './SharedAbout.css'
import './Partners.css'
import { imageUrl } from '../../utils/imageUrl'
import LazyImage from '../common/LazyImage'

// Images  

const PARTNER_DATA = [
  {
    category: "Senior Board of Partners",
    members: [
      {
        name: "Huzeifa Unwala",
        image: imageUrl('Huzefa-Unwala-removebg-preview.png'),
        creds: "FCA, CISA, ISO 27001 Lead Auditor",
        desc: "Specializes in IFC, governance, risk and cyber security frameworks across BFSI sectors.",
        linkedin: "https://www.linkedin.com/in/ca-huzeifa-unwala/"
      },
      {
        name: "Nikhel Kochhar",
        image: imageUrl('Nikhel-Kochhar-removebg-preview.png'),
        creds: "FCA, CIA",
        desc: "Over 25 years of expertise in governance, risk, internal audits and strategic management consulting.",
        linkedin: "https://www.linkedin.com/in/nikhelkochhar"
      },
      {
        name: "Kalpesh Parmar",
        image: imageUrl('Kalpesh-Parmar-removebg-preview.png'),
        creds: "B.Com (Hons), FCA",
        desc: "Leads the statutory audit practice. Expert in Ind AS implementation and complex consolidation for listed entities.",
        linkedin: "https://www.linkedin.com/in/kalpesh-parmar-016a502b"
      },
      {
        name: "Sharad Mohata",
        image: imageUrl('Sharad-Mohata-removebg-preview.png'),
        creds: "B.Com (Hons), FCA, ICWAI",
        desc: "Specializes in tax & corporate advisory, direct taxation, corporate restructuring and international tax advisory.",
        linkedin: "https://www.linkedin.com/in/sharad-mohata-18318082"
      },
      {
        name: "Vinod Joshi",
        image: imageUrl('vinod joshi.png'),
        creds: "FCA, MBA (Finance)",
        desc: "Renowned for financial modeling, M&A restructuring, and cross-border strategic alliances.",
        linkedin: "https://linkedin.com/in/vinod-joshi-fca"
      }
    ]
  },
  {
    category: "Mumbai Partners",
    members: [
      {
        name: "Tasnim Tankiwala",
        image: imageUrl('Tasnim-Tankiwala-removebg-preview.png'),
        creds: "FCA, IP (IBBI), DIRM, DISA, IFRS",
        desc: "Expert in statutory audit, risk management audits and SOX compliance.",
        linkedin: "https://www.linkedin.com/in/tasnim-tankiwala"
      },
      {
        name: "Jamal Ashraf Chatriwala",
        image: imageUrl('Jamal-Chatriwala-removebg-preview.png'),
        creds: "ACA, IPO Certified",
        desc: "Specializes in banking, NBFC & insurance advisory and indirect tax litigation.",
        linkedin: "https://www.linkedin.com/in/chatriwala"
      },
      {
        name: "Taher Pepermintwala",
        image: imageUrl('Taher-Pepermintwala-removebg-preview.png'),
        creds: "FCA, CISA, ACCA, Dip IFRS",
        desc: "Leads cybersecurity & IT audit, SOC attestation and ERP implementation audits.",
        linkedin: "https://www.linkedin.com/in/taherpepermintwala/"
      },
      {
        name: "Sahil Shah",
        image: imageUrl('Sahil-Shah-removebg-preview.png'),
        creds: "ACA | Ex-Mazars",
        desc: "Focuses on risk advisory, capital restructuring and VC funding advisory.",
        linkedin: "https://www.linkedin.com/in/sahil-shah-664a5312a"
      },
      {
        name: "Tausif Shaikh",
        image: imageUrl('Tausif-Shaikh-removebg-preview.png'),
        creds: "CA, AICA-L1",
        desc: "Expert in assurance, tax advisory and AI-driven audit methodologies.",
        linkedin: "https://www.linkedin.com/in/ca-tausif-shaikh"
      },
      {
        name: "Samad Dhanani",
        image: imageUrl('Samad-Dhanani-removebg-preview.png'),
        creds: "CS, ACA, AIII",
        desc: "Drives growth through audit, assurance & outsourcing and comprehensive financial planning.",
        linkedin: "https://www.linkedin.com/in/samad-dhanani-9b342562/"
      },
      {
        name: "Disha Shah",
        image: imageUrl('Disha Shah-removebg-preview.png'),
        creds: "FCA | Ex-EY",
        desc: "Leads governance, risk & internal control advisory and women-entrepreneur initiatives.",
        linkedin: "https://www.linkedin.com/in/disha-shah-4826b097/"
      },
      {
        name: "Dhanlaxmi Nair",
        image: imageUrl('Dhanlaxmi.png'),
        creds: "FCA, CMA, SET",
        desc: "Specializes in risk advisory & consulting across diverse industry verticals.",
        linkedin: "https://www.linkedin.com/in/dhanlaxmi-nair-311053206"
      }
    ]
  },
  {
    category: "Delhi, Bengaluru, Chennai, Kolkata & Hyderabad Partners",
    members: [
      {
        name: "Geethika Ghanta",
        image: imageUrl('Geethika Ghanta.png'),
        creds: "FCA",
        desc: "Partner based in Hyderabad specializing in risk advisory & compliance.",
        linkedin: "https://www.linkedin.com/in/ca-geethika-ghanta-99a159160/"
      },
      {
        name: "G Chandra Sekaran",
        image: imageUrl('Chandra Shekaran.png'),
        creds: "FCA",
        desc: "Chennai partner specializing in statutory audit & assurance.",
        linkedin: "https://www.linkedin.com/in/ca-g-chandrasekaran-4a967b29"
      },
      {
        name: "Pranal P",
        image: imageUrl('Pranal p.png'),
        creds: "ACA",
        desc: "Chennai partner focusing on tax & regulatory advisory.",
        linkedin: "https://linkedin.com/"
      },
      {
        name: "NM Pradeep",
        image: imageUrl('NM Pradeep.png'),
        creds: "FCA",
        desc: "Hyderabad partner leading statutory audit & tax advisory services.",
        linkedin: "https://linkedin.com/"
      },
      {
        name: "Jagdish Solanki",
        image: imageUrl('Jagdish-Solanki-removebg-preview.png'),
        creds: "FCA",
        desc: "Delhi partner, expert in statutory audit, risk advisory and cross-border transactions.",
        linkedin: "https://www.linkedin.com/in/jagdish-solanki-92324b1b"
      },
      {
        name: "Narayana Rao Malla",
        image: imageUrl('Narayana-Rao-Malla-removebg-preview.png'),
        creds: "FCA",
        desc: "Bengaluru partner spearheading statutory audit & assurance practice.",
        linkedin: "https://www.linkedin.com/in/narayana-rao-malla"
      },
      {
        name: "Tripti Mohata",
        image: imageUrl('Tripti Mohata.png'),
        creds: "FCA",
        desc: "Kolkata partner specializing in tax & corporate advisory.",
        linkedin: "https://www.linkedin.com/in/ca-tripti-mohta-598a2544/"
      }
    ]
  },
  // {
  //   category: "Kolkata Partners",
  //   members: [

  //   ]
  // },
  {
    category: "Gujarat Partners",
    members: [
      {
        name: "Virendra Nayyar",
        image: imageUrl('Virendra-Nayyar-removebg-preview.png'),
        creds: "FCA",
        desc: "Senior guide for Gujarat statutory audit & assurance engagements.",
        linkedin: "https://www.linkedin.com/in/virendra-nayyar-3114a9227"
      },
      {
        name: "Dhaval Thakkar",
        image: imageUrl('Dhaval-Thakkar-removebg-preview.png'),
        creds: "FCA",
        desc: "Ahmedabad operations lead, focusing on fractional CFO & FP&A advisory.",
        linkedin: "https://www.linkedin.com/in/dhaval-thakkar-dt-25406144/"
      },
      {
        name: "Viranch Modi",
        image: imageUrl('Viranch-Modi-removebg-preview.png'),
        creds: "FCA",
        desc: "Expert in direct tax, GST & audit and RERA compliance.",
        linkedin: "https://www.linkedin.com/in/viranch-modi-aa4106227/"
      },
      {
        name: "Milin Parekh",
        image: imageUrl('Milin-Parekh-removebg-preview.png'),
        creds: "M.Com, FCA",
        desc: "Specializes in internal audit & tax consulting and statutory bank audits.",
        linkedin: "https://www.linkedin.com/in/milin-parekh-63692061"
      },
      {
        name: "Mehul Shah",
        image: imageUrl('Mehul-Shah-removebg-preview.png'),
        creds: "FCA",
        desc: "Focuses on income tax & GST advisory and process audits.",
        linkedin: "https://www.linkedin.com/in/mehul-shah-9aaaa130b"
      },
      {
        name: "Alpesh Vaniya",
        image: imageUrl('Alpesh-Vaniya-removebg-preview.png'),
        creds: "FCA",
        desc: "Statutory audit & assurance specialist for HNIs and family offices.",
        linkedin: "https://www.linkedin.com/in/alpesh-vaniya-62544b190"
      },
      {
        name: "Raj Shah",
        image: imageUrl('Raj-Shah-removebg-preview.png'),
        creds: "ACA | LL.B.",
        desc: "Drives tax, litigation & risk advisory practices in Vadodara.",
        linkedin: "https://www.linkedin.com/in/ca-raj-a-shah"
      },
      {
        name: "Saurabh Shah",
        image: imageUrl('Saurabh-Shah-removebg-preview.png'),
        creds: "FCA, DISA",
        desc: "Core team member for direct & indirect tax advisory.",
        linkedin: "https://www.linkedin.com/in/saurabh-shah-b822791a7"
      },
      {
        name: "Shreena Panara",
        image: imageUrl('Shreena Parana.png'),
        creds: "FCA",
        desc: "Audit & compliance specialist.",
        linkedin: "https://www.linkedin.com/in/ca-shreena-panara-61b27820a"
      },
      {
        name: "Jhankhna Patel",
        image: imageUrl('Jhankana Patel.jpeg'),
        creds: "ACA | CPA Australia",
        desc: "Strategy, compliance & advisory specialist.",
        linkedin: "https://www.linkedin.com/in/jhankhnapatel09"
      },
      {
        name: "Nidhi Kotecha",
        image: imageUrl('Nidhi-kotecha.png'),
        creds: "CA",
        desc: "Specializes in US taxation, CFO advisory & SEC compliance.",
        linkedin: "https://www.linkedin.com/in/nidhi-kotecha-9758a6193/"
      }
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
        <div className="ap-hero__bg" style={{ backgroundImage: `url(${imageUrl('Leadership.png')})` }} />
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
                          <LazyImage src={member.image} alt={member.name} className="partner-card__img" />
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
