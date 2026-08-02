import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Phone } from 'lucide-react'
import './LegalPage.css'

export type LegalBlock =
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'dl'; items: { term: string; desc: string }[] }

interface LegalPageProps {
  eyebrow: string
  title: string
  lastUpdated: string
  intro?: string
  blocks: LegalBlock[]
}

function LegalBlockRenderer({ block }: { block: LegalBlock }) {
  switch (block.type) {
    case 'h2':
      return <h2 className="legal-h2">{block.text}</h2>
    case 'h3':
      return <h3 className="legal-h3">{block.text}</h3>
    case 'p':
      return <p className="legal-p">{block.text}</p>
    case 'ul':
      return (
        <ul className="legal-ul">
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )
    case 'dl':
      return (
        <dl className="legal-dl">
          {block.items.map((item, i) => (
            <div className="legal-dl__row" key={i}>
              <dt>{item.term}</dt>
              <dd>{item.desc}</dd>
            </div>
          ))}
        </dl>
      )
    default:
      return null
  }
}

export default function LegalPage({ eyebrow, title, lastUpdated, intro, blocks }: LegalPageProps) {
  useEffect(() => { window.scrollTo({ top: 0 }) }, [])

  return (
    <div className="legal-page">
      {/* ════ HERO ════ */}
      <section className="legal-hero">
        <div className="legal-hero__inner">
          <span className="legal-hero__eyebrow">{eyebrow}</span>
          <h1 className="legal-hero__title">{title}</h1>
          <p className="legal-hero__updated">Last updated: {lastUpdated}</p>
        </div>
      </section>

      {/* ════ CONTENT ════ */}
      <section className="legal-content">
        <div className="legal-container">
          {intro && <p className="legal-intro">{intro}</p>}

          {blocks.map((block, i) => (
            <LegalBlockRenderer key={i} block={block} />
          ))}

          <div className="legal-contact-card">
            <h3 className="legal-h3">Contact Us</h3>
            <p className="legal-p">If you have any questions, you can reach us at:</p>
            <div className="legal-contact-card__row">
              <a href="mailto:connect@jhsassociates.in" className="legal-contact-card__link">
                <Mail size={16} /> connect@jhsassociates.in
              </a>
              <a href="tel:18001201022" className="legal-contact-card__link">
                <Phone size={16} /> 1800 120 1022
              </a>
            </div>
          </div>

          <div className="legal-footer-links">
            <Link to="/privacy-policy">Privacy Policy</Link>
            <span className="legal-footer-links__dot">·</span>
            <Link to="/terms-and-conditions">Terms &amp; Conditions</Link>
            <span className="legal-footer-links__dot">·</span>
            <Link to="/terms-of-business">Terms of Business</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
