import { useEffect, useMemo, useState } from 'react'
import './SharedAbout.css'
import './Partners.css'
import { imageUrl } from '../../utils/imageUrl'
import LazyImage from '../common/LazyImage'

// Images

// Sector filter options are derived from the free-text `sector` values on
// each partner (e.g. "Risk Advisory, Internal Audit & IFC" splits into
// "Risk Advisory", "Internal Audit", "IFC") rather than a fixed category
// list, since partner bios use varied phrasing. Matching is substring-based
// (see filteredMembers below), so picking "Risk" — or a tag containing it,
// like "Risk Advisory" — surfaces every partner whose sector text mentions
// risk, regardless of how that partner's phrase is worded.
const splitSectorTags = (raw: string): string[] =>
  raw
    .split(/[,&]/)
    .map((part) => part.trim().replace(/\.$/, ''))
    .filter((part) => part.length > 2)

const PARTNER_DATA = [
  {
    category: "Governance Council",
    role: "Governance Council",
    members: [
      {
        name: "Huzeifa Unwala",
        image: imageUrl('Huzefa-Unwala-removebg-preview.webp'),
        creds: "FCA, CISA, ISO 27001, NISM(DP), NISM(Social Auditor)",
        desc: "Expert in IFC, Governance, Risk & Cyber Security Frameworks across BFSI sectors.",
        location: "Mumbai",
        sector: ["Risk & Governance"],
        // teamSize: 12,
        // clientsServed: 45,
        linkedin: "https://www.linkedin.com/in/ca-huzeifa-unwala/",

      },
      {
        name: "Kalpesh Parmar",
        image: imageUrl('Kalpesh-Parmar-removebg-preview.webp'),
        creds: "B.Com (Hons), FCA",
        desc: "Expert in Statutory Audit, Ind AS implementation and complex consolidation for listed entities.",
        location: "Vadodara",
        sector: ["Statutory Audit & Assurance"],
        // teamSize: 15,
        // clientsServed: 55,
        linkedin: "https://www.linkedin.com/in/kalpesh-parmar-016a502b",

      },
      {
        name: "Sharad Mohata",
        image: imageUrl('Sharad-Mohata-removebg-preview.webp'),
        creds: "B.Com (Hons), FCA, ICWAI",
        desc: "Expert in Regulatory, Direct Taxation, Corporate Restructuring and International Tax Advisory.",
        location: "Kolkata",
        sector: ["Tax & Corporate Advisory"],
        // teamSize: 8,
        // clientsServed: 30,
        linkedin: "https://www.linkedin.com/in/sharad-mohata-18318082",

      },
      {
        name: "Nikhel Kochhar",
        image: imageUrl('Nikhel-Kochhar-removebg-preview.webp'),
        creds: "FCA, CIA",
        desc: "Expert in Accounting, Auditing, Assurance & Strategic Management Consulting.",
        location: "Delhi",
        sector: ["Governance, Risk & Internal Audit"],
        // teamSize: 11,
        // clientsServed: 42,
        linkedin: "https://www.linkedin.com/in/nikhelkochhar",

      },
      {
        name: "Vinod Joshi",
        image: imageUrl('vinod joshi.webp'),
        creds: "FCA, MBA (Finance)",
        desc: "Expert in Financial Modeling, M&A Restructuring & Cross-border Strategic Alliances.",
        location: "UAE",
        // sector: ["M&A & Corporate Restructuring", "Financial Advisory & CFO Services"],
        sector: ["Financial Advisory & CFO Services"],
        // teamSize: 10,
        // clientsServed: 40,
        linkedin: "https://linkedin.com/in/vinod-joshi-fca",

      }
    ]
  },
  {
    category: "Mumbai Partners & Advisory Board Members",
    role: "Partner",
    members: [
      {
        name: "Tasnim Tankiwala",
        image: imageUrl('Tasnim-Tankiwala-removebg-preview.webp'),
        creds: "FCA, IP (IBBI), DIRM, DISA",
        desc: "Expert in Auditing, Tax, Accounting & IFC.",
        location: "Mumbai",
        // sector: ["Statutory Audit & Assurance", "Risk & Governance"],
        sector: ["Statutory Audit"],
        // teamSize: 10,
        // clientsServed: 38,
        linkedin: "https://www.linkedin.com/in/tasnim-tankiwala",

      },
      {
        name: "Disha Shah",
        image: imageUrl('Disha Shah-removebg-preview.webp'),
        creds: "FCA",
        desc: "Expert in Accounting, Tax, Governance, Internal Control & Women Entrepreneur Initiatives.",
        location: "Mumbai",
        sector: ["Risk Advisory, Internal Audit & IFC"],
        // teamSize: 7,
        // clientsServed: 25,
        linkedin: "https://www.linkedin.com/in/disha-shah-4826b097/",

      },
      {
        name: "Dhanlaxmi Nair",
        image: imageUrl('Dhanlaxmi.webp'),
        creds: "M.Com, FCA, CMA, SET",
        desc: "Expert in BFSI, Regulatory Compliance, Internal & Concurrent Audit,",
        location: "Mumbai",
        // sector: ["Risk & Governance"],
        sector: ["Risk Advisory & Consulting"],
        // teamSize: 5,
        // clientsServed: 22,
        linkedin: "https://www.linkedin.com/in/dhanlaxmi-nair-311053206",

      },
      {
        name: "Jamal Ashraf Chatriwala",
        image: imageUrl('Jamal-Chatriwala-removebg-preview.webp'),
        creds: "ACA, IPO Certified",
        desc: "Expert in BFSI, NBFC, Asset Management, Insurance Advisory & Concurrent Audit.",
        location: "Mumbai",
        // sector: ["Banking, NBFC & Insurance"],
        sector: ["Internal Audit & Risk Advisory"],
        // teamSize: 8,
        // clientsServed: 32,
        linkedin: "https://www.linkedin.com/in/chatriwala",

      },
      {
        name: "Taher Pepermintwala",
        image: imageUrl('Taher-Pepermintwala-removebg-preview.webp'),
        creds: "FCA, CISA, ACCA, Dip IFRS",
        desc: "Expert in Cyber Security, IT Audit, AIF & Mutual Fund, Forensic Audit, Statutory & Internal Audit.",
        location: "Mumbai",
        // sector: ["IT & Technology"],
        sector: ["Assurance, Tech & SOC Audit"],
        // teamSize: 14,
        // clientsServed: 50,
        linkedin: "https://www.linkedin.com/in/taherpepermintwala/",

      },
      {
        name: "Sahil Shah",
        image: imageUrl('Sahil-Shah-removebg-preview.webp'),
        creds: "ACA, IPO Certified ",
        desc: "Expert in Accounting, Internal Control & VC Funding Advisory.",
        location: "Mumbai",
        // sector: ["Venture Capital & Private Equity", "Risk & Governance"],
        sector: ["Risk Advisory, Internal Audit & IFC"],
        // teamSize: 6,
        // clientsServed: 28,
        linkedin: "https://www.linkedin.com/in/sahil-shah-664a5312a",

      },
      {
        name: "Tausif Shaikh",
        image: imageUrl('Tausif-Shaikh-removebg-preview.webp'),
        creds: "ACA, AICA-L1",
        desc: "Expert in Assurance, Tax Advisory and AI-driven Audit Methodologies.",
        location: "Mumbai",
        // sector: ["Statutory Audit & Assurance", "Tax & Regulatory"],
        sector: ["Assurance & Tax"],
        // teamSize: 9,
        // clientsServed: 35,
        linkedin: "https://www.linkedin.com/in/ca-tausif-shaikh",

      },
      {
        name: "Samad Dhanani",
        image: imageUrl('Samad-Dhanani-removebg-preview.webp'),
        creds: "M.Com, ACA, CS",
        desc: "Expert in Internal Audit, Tax Audit, Assurance & Accounting.",
        location: "Mumbai",
        sector: ["Statutory Audit & Accounts Outsourcing"],
        // teamSize: 8,
        // clientsServed: 30,
        linkedin: "https://www.linkedin.com/in/samad-dhanani-9b342562/",

      },

      {
        name: 'Amit More',
        image: imageUrl('Amit-more.webp'),
        creds: 'MBA–IIM, ISO 27001 Lead Auditor, ISO 42001 Certified',
        desc: 'Expert in Cyber Security, GRC, Strategy and Digital Trust.',
        location: "Mumbai",
        sector: ['Cyber Security & GRC'],
        role: "Advisory Board Member",
        linkedin: 'https://www.linkedin.com/in/amitkumarmore/',

      },
      {
        name: 'Dipika Bisawa',
        image: imageUrl('Dipika-Bisawa.webp'),
        creds: 'ACS',
        desc: 'Expert in Corporate Governance, Compliance & Risk Management.',
        location: "Mumbai",
        sector: ['Compliance & Risk Management'],
        role: "Advisory Board Member",
        linkedin: 'https://www.linkedin.com/in/dipika-bisawa-0a9a211a/',

      },
      {
        name: 'Raj Dabburi',
        image: imageUrl('Raj-daburi.webp'),
        creds: 'CA, MBA',
        desc: 'Expert in Corporate Finance, Fund Raising, PPP Advisory & Financial Strategy',
        location: "Mumbai",
        sector: ['Board & Institutional Advisory'],
        role: "Advisory Board Member",
        linkedin: 'https://www.linkedin.com/in/rajdabburi/',

      },
      {
        name: 'Huzefa Mala',
        image: imageUrl('Huzefa-mala.webp'),
        creds: 'FCA, UGC-NET Qualified',
        desc: 'Expert in Tax Compliance, Tax Litigation, Appeals, Domestic & Overseas Outsourcing.',
        location: "Mumbai",
        sector: ['Income Tax Advisory & Audits'],
        role: "Advisory Board Member",
        linkedin: 'https://www.linkedin.com/in/huzefamala/',

      },
      {
        name: 'Huzefa Kaka',
        image: imageUrl('Huzefa-kaka.webp'),
        creds: 'NISM certified',
        desc: 'Expert in Risk Management, Compliance, Internal Audit & Concurrent Audit.',
        location: "Mumbai",
        sector: ['Risk & Governance'],
        role: "Advisory Board Member",
        linkedin: 'https://www.linkedin.com/in/huzefakaka/',

      },
    ]
  },
  {
    category: "Bengaluru, Chennai & Kolkata Partners",
    role: "Partner",
    members: [
      // {
      //   name: "Geethika Ghanta",
      //   image: imageUrl('Geethika Ghanta.webp'),
      //   creds: "FCA",
      //   desc: "Partner based in Hyderabad specializing in risk advisory & compliance.",
      //   location: "Hyderabad",
      //   sector: ["Risk & Governance"],
      //   teamSize: 7,
      //   clientsServed: 25,
      //   linkedin: "https://www.linkedin.com/in/ca-geethika-ghanta-99a159160/"
      // },
      {
        name: "Jagdish Solanki",
        image: imageUrl('Jagdish-Solanki-removebg-preview.webp'),
        creds: "B.Com (Hons), FCA",
        desc: "Expert in Audit and Internal Control.",
        location: "Bengaluru",
        sector: ["Direct & Indirect Tax"],
        // teamSize: 8,
        // clientsServed: 30,
        linkedin: "https://www.linkedin.com/in/jagdish-solanki-92324b1b",

      },
      {
        name: "Narayana Rao Malla",
        image: imageUrl('Narayana-Rao-Malla-removebg-preview.webp'),
        creds: "FCA",
        desc: "Expert in Audit, Accounting & Internal Control.",
        location: "Bengaluru",
        sector: ["Internal Audit & Risk Advisory"],
        // teamSize: 8,
        // clientsServed: 30,
        linkedin: "https://www.linkedin.com/in/narayana-rao-malla",

      },
      {
        name: "G Chandrasekaran",
        image: imageUrl('Chandra-Shekaran.webp'),
        creds: "DSM, FCA, DISA",
        desc: "Expert in Accounting, Internal Audit & Tax.",
        location: "Chennai",
        sector: ["Statutory & Corporate Tax Audits"],
        // teamSize: 9,
        // clientsServed: 35,
        linkedin: "https://www.linkedin.com/in/ca-g-chandrasekaran-4a967b29",

      },
      {
        name: "Pranal P",
        image: imageUrl('Pranal p.webp'),
        creds: "FCA",
        desc: "Expert in Statutory Audit, Internal Audit, Management Consultancy & Systems Study.",
        location: "Chennai",
        sector: ["Specialising in GST"],
        // teamSize: 6,
        // clientsServed: 22,
        linkedin: "https://linkedin.com/",

      },
      // {
      //   name: "NM Pradeep",
      //   image: imageUrl('NM Pradeep.webp'),
      //   creds: "FCA",
      //   desc: "Hyderabad partner leading statutory audit & tax advisory services.",
      //   location: "Hyderabad",
      //   sector: ["Statutory Audit & Assurance", "Tax & Regulatory"],
      //   teamSize: 10,
      //   clientsServed: 38,
      //   linkedin: "https://linkedin.com/"
      // },
      {
        name: "Tripti Mohta",
        image: imageUrl('Tripti mohta.webp'),
        creds: "FCA",
        desc: "Expert in Accounting, Assurance, Governance & Internal Audit.",
        location: "Kolkata",
        sector: ["Taxation & Audit Specialist "],
        // teamSize: 6,
        // clientsServed: 22,
        linkedin: "https://www.linkedin.com/in/ca-tripti-mohta-598a2544/",

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
    role: "Partner",
    members: [
      {
        name: "Shreena Panara",
        image: imageUrl('Shreena Parana.webp'),
        creds: "ACA",
        desc: "Expert in Accounting, Audit, Tax & Finance.",
        location: "Rajkot",
        sector: ["Indirect Tax"],
        // teamSize: 6,
        // clientsServed: 25,
        linkedin: "https://www.linkedin.com/in/ca-shreena-panara-61b27820a",

      },
      {
        name: "Jhankhna Patel",
        image: imageUrl('Jhankana Patel.webp'),
        creds: "ACA, CBAP, DISA, CPA Australia",
        desc: "Expert in Accounting, Tax, GST, Statutory & Internal Audit.",
        location: "Ahmedabad",
        sector: ["ESG Specialist"],
        // teamSize: 5,
        // clientsServed: 20,
        linkedin: "https://www.linkedin.com/in/jhankhnapatel09",

      },
      {
        name: "Dhaval Thakkar",
        image: imageUrl('Dhaval-Thakkar-removebg-preview.webp'),
        creds: "ACA",
        desc: "Expert in Startup Advisory, Corporate Governance & ERP Strategy. ",
        location: "Ahmedabad",
        sector: ["Internal Audit, Risk Advisory & Insurance."],
        // teamSize: 7,
        // clientsServed: 30,
        linkedin: "https://www.linkedin.com/in/dhaval-thakkar-dt-25406144/",

      },
      {
        name: "Nidhi Kotecha",
        image: imageUrl('Nidhi-kotecha.webp'),
        creds: "ACA",
        desc: "Expert in Outsourced Finance Services, CFO Advisory & SEC Compliance.",
        location: "Ahmedabad",
        sector: ["US Taxation & Compliance"],
        // teamSize: 4,
        // clientsServed: 18,
        linkedin: "https://www.linkedin.com/in/nidhi-kotecha-9758a6193/",

      },
      {
        name: "Alpesh Vaniya",
        image: imageUrl('Alpesh-Vaniya-removebg-preview.webp'),
        creds: "FCA",
        desc: "Expert in Internal Audit, Tax, Accounting & IT Audit.",
        location: "Ahmedabad",
        sector: ["Internal Audit & Tax Consulting"],
        // teamSize: 7,
        // clientsServed: 28,
        linkedin: "https://www.linkedin.com/in/alpesh-vaniya-62544b190",

      },
      {
        name: 'Parth Shah',
        image: imageUrl('Parth_shah.webp'),
        creds: 'FCA',
        desc: "Expert in Internal Audit, Tax Advisory & Accounting.",
        location: "Ahmedabad",
        sector: ["Financial Strategy Specialist"],
        linkedin: 'https://www.linkedin.com/in/parth-shah-0926211a0?originalSubdomain=in',

      },
      {
        name: "Virendra Nayyar",
        image: imageUrl('Virendra-Nayyar-removebg-preview.webp'),
        creds: "B.Com (Hons), FCA ",
        desc: "Expert in Internal Audit & Assurance Engagements.",
        location: "Vadodara",
        sector: ["Internal Audit & Assurance"],
        // teamSize: 10,
        // clientsServed: 40,
        linkedin: "https://www.linkedin.com/in/virendra-nayyar-3114a9227",

      },

      {
        name: "Viranch Modi",
        image: imageUrl('Viranch-Modi-removebg-preview.webp'),
        creds: "FCA",
        desc: "Expert in Direct Tax, Indirect Tax & Auditing.",
        location: "Vadodara",
        sector: ["Income Tax & GST"],
        // teamSize: 9,
        // clientsServed: 38,
        linkedin: "https://www.linkedin.com/in/viranch-modi-aa4106227/",

      },
      {
        name: "Milin Parekh",
        image: imageUrl('Milin-Parekh-removebg-preview.webp'),
        creds: "M.Com, FCA",
        desc: "Expert in Accouting, Internal Audit & Consulting.",
        location: "Vadodara",
        sector: ["Internal Audit & Consulting"],
        // teamSize: 8,
        // clientsServed: 32,
        linkedin: "https://www.linkedin.com/in/milin-parekh-63692061",

      },
      {
        name: "Saurabh Shah",
        image: imageUrl('Saurabh-Shah-removebg-preview.webp'),
        creds: "FCA, DISA",
        desc: "Expert in Direct & Indirect Tax Advisory.",
        location: "Vadodara",
        sector: ["Direct & Indirect Tax "],
        // teamSize: 8,
        // clientsServed: 35,
        linkedin: "https://www.linkedin.com/in/saurabh-shah-b822791a7",

      },
      {
        name: "Mehul Shah",
        image: imageUrl('Mehul-Shah-removebg-preview.webp'),
        creds: "FCA",
        desc: "Expert in Tax, Audit, Assurance & Statutory Compliance.",
        location: "Surat",
        sector: ["Income Tax & GST"],
        // teamSize: 5,
        // clientsServed: 22,
        linkedin: "https://www.linkedin.com/in/mehul-shah-9aaaa130b",

      },

      {
        name: "Raj Shah",
        image: imageUrl('Raj-Shah-removebg-preview.webp'),
        creds: "ACA ",
        desc: "Expert in Audit, Accounting, Tax Litigation & Advisory.",
        location: "Surat",
        sector: ["Tax Litigation & Advisory"],
        // teamSize: 6,
        // clientsServed: 26,
        linkedin: "https://www.linkedin.com/in/ca-raj-a-shah",

      },

    ]
  }
];

const IconLinkedIn = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
)

const IconLocation = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
)

const IconSearch = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
  </svg>
)

const IconClose = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
  </svg>
)

interface Member {
  name: string
  image: string
  creds: string
  desc: string
  location: string
  sector: string[]
  teamSize?: number
  clientsServed?: number
  linkedin: string
  email?: string
  category: string
  role: string
}

const IconMail = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
  </svg>
)

function PartnerCard({ member, showCategory }: { member: Member; showCategory?: boolean }) {
  return (
    <div className="partner-card">
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
        {showCategory && <span className="partner-card__category">{member.category}</span>}
        <h4 className="partner-card__name">{member.name}</h4>
        <p className="partner-card__creds">{member.creds}</p>

        <div className="partner-card__badges">
          <div className="partner-card__location">
            <IconLocation />
            <span>{member.location}</span>
          </div>
          <span className="partner-card__role">{member.role}</span>
        </div>

        <p className="partner-card__desc">{member.desc}</p>

        {member.sector.length > 0 && (
          <div className="partner-card__sectors">
            {member.sector.map((s) => (
              <span key={s} className="partner-card__sector-tag">{s}</span>
            ))}
          </div>
        )}

        {/* <div className="partner-card__stats">
          <div className="partner-card__stat">
            <IconTeam />
            <span className="partner-card__stat-val">{member.teamSize}</span>
            <span className="partner-card__stat-lbl">Team Size</span>
          </div>
          <div className="partner-card__stat">
            <IconClients />
            <span className="partner-card__stat-val">{member.clientsServed}+</span>
            <span className="partner-card__stat-lbl">Clients Served</span>
          </div>
        </div> */}

        {member.email && (
          <a href={`mailto:${member.email}`} className="partner-card__email">
            <IconMail />
            <span>{member.email}</span>
          </a>
        )}

        <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="partner-card__social">
          <IconLinkedIn />
          <span>Connect</span>
        </a>
      </div>
    </div>
  )
}

export default function Partners() {
  useEffect(() => { window.scrollTo({ top: 0 }) }, [])

  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('All')
  const [role, setRole] = useState('All')
  const [sector, setSector] = useState('All')

  const allMembers: Member[] = useMemo(
    () =>
      PARTNER_DATA.flatMap((section) =>
        section.members.map((m) => ({ ...m, category: section.category, role: (m as { role?: string }).role ?? section.role }))
      ),
    []
  )

  const locations = useMemo(
    () => Array.from(new Set(allMembers.map((m) => m.location))).sort(),
    [allMembers]
  )
  const roles = useMemo(() => Array.from(new Set(allMembers.map((m) => m.role))), [allMembers])

  // Dedupe sector tags case-insensitively while keeping the first-seen casing
  // for display (e.g. "Risk Advisory" wins over a later "risk advisory").
  const sectors = useMemo(() => {
    const seen = new Map<string, string>()
    allMembers.forEach((m) => {
      m.sector.forEach((raw) => {
        splitSectorTags(raw).forEach((tag) => {
          const key = tag.toLowerCase()
          if (!seen.has(key)) seen.set(key, tag)
        })
      })
    })
    return Array.from(seen.values()).sort((a, b) => a.localeCompare(b))
  }, [allMembers])

  const isFiltering = search.trim() !== '' || location !== 'All' || role !== 'All' || sector !== 'All'

  const filteredMembers = useMemo(() => {
    const q = search.trim().toLowerCase()
    const sectorQuery = sector.toLowerCase()
    return allMembers.filter((m) => {
      if (q && !m.name.toLowerCase().includes(q)) return false
      if (location !== 'All' && m.location !== location) return false
      if (role !== 'All' && m.role !== role) return false
      if (sector !== 'All' && !m.sector.some((s) => s.toLowerCase().includes(sectorQuery))) return false
      return true
    })
  }, [allMembers, search, location, role, sector])

  const clearFilters = () => {
    setSearch('')
    setLocation('All')
    setRole('All')
    setSector('All')
  }

  return (
    <div className="ap-page">
      {/* ════ HERO ════ */}
      <section className="ap-hero">
        <div className="ap-hero__bg" style={{ backgroundImage: `url(${imageUrl('Leadership.webp')})` }} />
        <div className="ap-hero__overlay" />
        <div className="ap-hero__content">
          <p className="ap-hero__eyebrow">Our Experts</p>
          <h1 className="ap-hero__title">Leadership Team</h1>
          <p className="ap-hero__sub">
            Meet the Governance Council, Senior Partners & Advisory Board Members steering JHS to new heights.
          </p>
        </div>
      </section>

      {/* ════ CONTENT ════ */}
      <section className="partners-section">
        <div className="ap-container">

          <div className="partners-intro">
            <h2>Driven by Experience</h2>
            <p>Our leadership comprises some of the most respected minds in the Accounting and Advisory profession, offering deep industry specializations and unparalleled insight.</p>
          </div>

          {/* ── FILTER BAR ── */}
          <div className="partners-filterbar">
            <div className="pf-search">
              <IconSearch />
              <input
                type="text"
                placeholder="Search by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search partners by name"
              />
              {search && (
                <button className="pf-search__clear" onClick={() => setSearch('')} aria-label="Clear search">
                  <IconClose />
                </button>
              )}
            </div>

            <div className="pf-selects">
              <select value={location} onChange={(e) => setLocation(e.target.value)} aria-label="Filter by location">
                <option value="All">All Locations</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>

              <select value={role} onChange={(e) => setRole(e.target.value)} aria-label="Filter by role">
                <option value="All">All Roles</option>
                {roles.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>

              <select value={sector} onChange={(e) => setSector(e.target.value)} aria-label="Filter by sector">
                <option value="All">All Sectors</option>
                {sectors.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              {isFiltering && (
                <button className="pf-clear" onClick={clearFilters}>
                  <IconClose /> Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* ── RESULTS ── */}
          {isFiltering ? (
            <div className="partners-results">
              <p className="partners-results__count">
                {filteredMembers.length} {filteredMembers.length === 1 ? 'partner' : 'partners'} found
              </p>

              {filteredMembers.length > 0 ? (
                <div className="partner-grid">
                  {filteredMembers.map((member) => (
                    <PartnerCard key={member.name} member={member} showCategory />
                  ))}
                </div>
              ) : (
                <div className="partners-empty">
                  <p>No partners match your filters.</p>
                  <button className="pf-clear pf-clear--solid" onClick={clearFilters}>
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="partners-list">
              {PARTNER_DATA.map((section, idx) => (
                <div key={idx} className="partner-category">
                  <h3 className="partner-category__title">{section.category}</h3>

                  <div className={`partner-grid ${idx === 0 ? 'partner-grid--senior' : ''}`}>
                    {section.members.map((member, mIdx) => (
                      <PartnerCard
                        key={mIdx}
                        member={{ ...member, category: section.category, role: (member as { role?: string }).role ?? section.role }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>
    </div>
  )
}
