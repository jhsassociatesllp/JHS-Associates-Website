import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, Lightbulb, CalendarDays, Users, AlertTriangle, CheckCircle2 } from 'lucide-react'
import './ThoughtLeadership.css'

gsap.registerPlugin(ScrollTrigger)

const PIECES = [
  {
    type: 'Opinion',
    title: "The CFO as a Strategic Partner: India's Finance Function Is Evolving",
    author: 'Managing Partner, JHS & Associates',
    preview:
      "The traditional CFO role — focused on compliance and reporting — is giving way to something more expansive. As Indian businesses scale and compete globally, the finance function must become a genuine seat at the strategy table.",
    highlight: '"Compliance is the floor, not the ceiling."',
  },
  {
    type: 'Policy Brief',
    title: "What India's New Digital Tax Framework Means for Global Tech Firms",
    author: 'Head of International Tax, JHS',
    preview:
      "India's approach to taxing the digital economy is maturing rapidly. This brief analyses the equalisation levy, significant economic presence rules, and where policy is headed through 2027.",
    highlight: '"India is setting a precedent that other emerging economies will follow."',
  },
  {
    type: 'Perspective',
    title: 'ESG Assurance: The Next Frontier for Indian Chartered Accountants',
    author: 'Partner – Assurance, JHS',
    preview:
      "SEBI's BRSR Core mandate and global sustainability reporting standards are converging. CAs who build ESG assurance capabilities now will lead the next decade of professional services.",
    highlight: '"Sustainability data is becoming as auditable as financial data."',
  },
]

const EVENTS = [
  {
    date: 'Apr 10, 2026',
    month: 'APR',
    day: '10',
    title: 'Budget Impact Webinar: Key Tax Changes for FY 2026–27',
    type: 'Webinar',
    seats: 'Open',
  },
  {
    date: 'Apr 24, 2026',
    month: 'APR',
    day: '24',
    title: 'Family Business Governance Roundtable – Mumbai',
    type: 'Roundtable',
    seats: 'Limited',
  },
  {
    date: 'May 8, 2026',
    month: 'MAY',
    day: '08',
    title: 'Transfer Pricing Masterclass for CFOs',
    type: 'Workshop',
    seats: 'Open',
  },
]

const TYPE_COLORS: Record<string, string> = {
  Opinion:      'tl-chip--opinion',
  'Policy Brief': 'tl-chip--policy',
  Perspective:  'tl-chip--perspective',
}

export default function ThoughtLeadership() {
  const heroRef  = useRef<HTMLDivElement>(null)
  const bodyRef  = useRef<HTMLDivElement>(null)
  const evtRef   = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)

    const ctx = gsap.context(() => {
      /* Hero */
      gsap.fromTo(
        ['.tl-hero__eyebrow', '.tl-hero__title', '.tl-hero__sub', '.tl-hero__stats'],
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.13, ease: 'power3.out', delay: 0.15 }
      )

      /* Perspective cards */
      gsap.fromTo(
        '.tl-card',
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: bodyRef.current, start: 'top 82%' },
        }
      )

      /* Event rows */
      gsap.fromTo(
        '.tl-event',
        { opacity: 0, x: -30 },
        {
          opacity: 1, x: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: evtRef.current, start: 'top 84%' },
        }
      )
    })

    return () => ctx.revert()
  }, [])

  return (
    <div className="tl-page">

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section className="tl-hero" ref={heroRef}>
        <div className="tl-hero__inner">
          {/* <p className="tl-hero__eyebrow">
            <Lightbulb size={12} strokeWidth={1.5} />
            Insights &nbsp;·&nbsp; Thought Leadership
          </p> */}

          <h1 className="tl-hero__title">
            Our&nbsp;<em>Perspectives</em>
          </h1>

          <p className="tl-hero__sub">
            JHS partners and senior advisors share their views on the forces reshaping finance,
            taxation, and professional services in India and beyond.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FEATURED PERSPECTIVES
      ══════════════════════════════════════ */}
      <section className="tl-section container" ref={bodyRef}>
        <div className="tl-section__header">
          <span className="tl-section__label">Featured Perspectives</span>
          <div className="tl-section__line" />
        </div>

        <div className="tl-cards-grid">
          {PIECES.map((p, i) => (
            <article key={i} className="tl-card">
              {/* Accent bar */}
              <div className="tl-card__accent" />

              {/* Top row */}
              <div className="tl-card__top">
                <span className={`tl-chip ${TYPE_COLORS[p.type] ?? 'tl-chip--opinion'}`}>
                  {p.type}
                </span>
                <span className="tl-card__num">{String(i + 1).padStart(2, '0')}</span>
              </div>

              {/* Title */}
              <h3 className="tl-card__title">{p.title}</h3>

              {/* Author */}
              <div className="tl-card__author-row">
                <div className="tl-avatar">
                  {p.author.charAt(0).toUpperCase()}
                </div>
                <span className="tl-card__author">{p.author}</span>
              </div>

              {/* Preview */}
              <p className="tl-card__preview">{p.preview}</p>

              {/* Pull quote */}
              <blockquote className="tl-card__quote">
                <span className="tl-card__quote-mark">"</span>
                {/* Strip surrounding quotes from data since we add our own */}
                {p.highlight.replace(/^"|"$/g, '')}
              </blockquote>

              {/* CTA */}
              <div className="tl-card__footer">
                <button className="tl-card__cta" type="button">
                  Read More <ArrowUpRight size={14} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          UPCOMING EVENTS
      ══════════════════════════════════════ */}
      <section className="tl-section container" ref={evtRef}>
        <div className="tl-section__header">
          <span className="tl-section__label">Upcoming Events</span>
          <div className="tl-section__line" />
        </div>

        <div className="tl-events">
          {EVENTS.map((e, i) => (
            <div key={i} className="tl-event">

              {/* Calendar block */}
              <div className="tl-event__cal">
                <span className="tl-event__cal-month">{e.month}</span>
                <span className="tl-event__cal-day">{e.day}</span>
              </div>

              {/* Info */}
              <div className="tl-event__info">
                <h4 className="tl-event__title">{e.title}</h4>
                <div className="tl-event__meta">
                  <span className="tl-chip tl-chip--type">{e.type}</span>
                  <span className={`tl-event__seats${e.seats === 'Limited' ? ' tl-event__seats--limited' : ''}`}>
                    {e.seats === 'Limited'
                      ? <><AlertTriangle size={11} /> Limited Seats</>
                      : <><CheckCircle2 size={11} /> Open Registration</>
                    }
                  </span>
                </div>
              </div>

              {/* Register */}
              <button className="tl-event__cta" type="button">
                Register <ArrowUpRight size={13} />
              </button>

            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════ */}
      {/* <section className="tl-cta container">
        <div className="tl-cta__inner">
          <div className="tl-cta__content">
            <p className="tl-cta__eyebrow">Speak at Your Event</p>
            <h2 className="tl-cta__title">Invite a JHS expert to speak</h2>
            <p className="tl-cta__sub">
              Our partners regularly speak at industry forums, conferences, and corporate events.
            </p>
          </div>
          <a href="#contact" className="tl-btn tl-btn--cta">
            Get in Touch <ArrowUpRight size={16} />
          </a>
        </div>
      </section> */}

    </div>
  )
}