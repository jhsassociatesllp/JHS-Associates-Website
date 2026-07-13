import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import LazyImage from '../../common/LazyImage'
import { SECTOR_EXPERTS } from '../../../data/SectorExperts'
import { SECTOR_CASE_STUDY_MAP } from '../../../data/SectorCaseStudyMap'
import { CASE_STUDIES } from '../../../data/CaseStudies'
import './SectorEngagement.css'

interface SectorEngagementProps {
  /** Key into SECTOR_EXPERTS / SECTOR_CASE_STUDY_MAP, matching the sector's file name (e.g. "Retail", "Banking"). */
  sectorKey: string
  /** Human-readable sector name used in section copy (e.g. "Retail", "Banking & Financial Services"). */
  sectorLabel: string
  /** YouTube video ID to embed. Defaults to a placeholder until a real video is supplied. */
  youtubeId?: string
}

interface CaseStudy {
  id: string
  title: string
  sector: string
  category: string
  image: string
}

const DEFAULT_YOUTUBE_ID = 'dQw4w9WgXcQ'

const IconLinkedIn = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
)

export default function SectorEngagement({ sectorKey, sectorLabel, youtubeId = DEFAULT_YOUTUBE_ID }: SectorEngagementProps) {
  const expert = SECTOR_EXPERTS[sectorKey as keyof typeof SECTOR_EXPERTS]
  const matchedSectors = SECTOR_CASE_STUDY_MAP[sectorKey as keyof typeof SECTOR_CASE_STUDY_MAP] ?? []
  const caseStudies = (CASE_STUDIES as CaseStudy[]).filter((cs) => matchedSectors.includes(cs.sector)).slice(0, 2)

  return (
    <>
      {/* ── SECTOR EXPERT ── */}
      {expert && (
        <section className="se-expert container">
          <div className="se-expert__inner">
            <div className="se-expert__img-wrap">
              <LazyImage src={expert.image} alt={expert.name} className="se-expert__img" />
            </div>
            <div className="se-expert__content">
              <span className="se-tag">Sector Expert</span>
              <h2 className="se-expert__name">{expert.name}</h2>
              <p className="se-expert__creds">{expert.creds} &nbsp;·&nbsp; {expert.location}</p>
              <p className="se-expert__desc">{expert.desc}</p>
              <div className="se-expert__actions">
                <a href={expert.linkedin} target="_blank" rel="noopener noreferrer" className="se-btn se-btn--ghost">
                  <IconLinkedIn /> Connect
                </a>
                <Link to="/know-us/leadership" className="se-btn se-btn--link">
                  Meet the Full Team <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── CASE STUDIES ── */}
      <section className="se-cases container">
        <div className="se-section-hd">
          <span className="se-tag">Proven Impact</span>
          <h2 className="se-section-hd__title">Case Studies in {sectorLabel}</h2>
        </div>

        {caseStudies.length > 0 ? (
          <div className="se-cases__grid">
            {caseStudies.map((cs) => (
              <Link to={`/case-studies/${cs.id}`} key={cs.id} className="se-case-card">
                <div className="se-case-card__img" style={{ backgroundImage: `url('${cs.image}')` }} />
                <div className="se-case-card__body">
                  <span className="se-case-card__meta">{cs.category}</span>
                  <h3 className="se-case-card__title">{cs.title}</h3>
                  <span className="se-case-card__link">Read More <ArrowUpRight size={13} /></span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="se-cases__empty">
            <p>Explore how we've helped clients across industries achieve measurable results.</p>
            <Link to="/case-studies" className="se-btn se-btn--solid">
              View All Case Studies <ArrowUpRight size={14} />
            </Link>
          </div>
        )}
      </section>

      {/* ── VIDEO ── */}
      <section className="se-video container">
        <div className="se-section-hd">
          <span className="se-tag">Watch &amp; Learn</span>
          <h2 className="se-section-hd__title">{sectorLabel} Insights on Video</h2>
        </div>
        <div className="se-video__frame">
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}`}
            title={`${sectorLabel} Insights — JHS & Associates`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        </div>
      </section>
    </>
  )
}
