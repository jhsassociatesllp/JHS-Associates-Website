import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Target, Lightbulb, CheckCircle2, TrendingUp } from 'lucide-react';
import { getCaseStudyById } from '../../data/CaseStudies';
import './CaseStudyDetail.css';

export default function CaseStudyDetail() {
  const { id } = useParams();
  const [caseStudy, setCaseStudy] = useState<any>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (id) {
      const data = getCaseStudyById(id);
      setCaseStudy(data);
    }
  }, [id]);

  if (!caseStudy) {
    return (
      <div className="csd-loading">
        <h2>Loading Case Study...</h2>
      </div>
    );
  }

  return (
    <div className="csd-page">
      {/* Hero Section */}
      <section className="csd-hero">
        <div className="csd-hero__bg" style={{ backgroundImage: `url('${caseStudy.image}')` }} />
        <div className="csd-hero__overlay" />
        <div className="csd-container csd-hero__inner">
          {/* <Link to="/case-studies" className="csd-back-link">
            <ArrowLeft size={18} /> Back to Case Studies
          </Link> */}
          <span className="csd-badge">CASE STUDY &bull; {caseStudy.sector}</span>
          <h1 className="csd-title">{caseStudy.title}</h1>
        </div>
      </section>

      {/* Main Content */}
      <main className="csd-main">
        <div className="csd-container csd-content-grid">

          <div className="csd-main-col">
            <div className="csd-section">
              <div className="csd-section-header">
                <Target className="csd-icon" />
                <h2>Project Scope</h2>
              </div>
              <p>{caseStudy.scope}</p>
            </div>

            <div className="csd-section">
              <div className="csd-section-header">
                <Lightbulb className="csd-icon" />
                <h2>Our Approach</h2>
              </div>
              <p>{caseStudy.approach}</p>
            </div>
          </div>

          <div className="csd-sidebar">
            <div className="csd-card">
              <div className="csd-card-header">
                <CheckCircle2 className="csd-icon csd-icon--red" />
                <h3>Delivery</h3>
              </div>
              <ul className="csd-list">
                {caseStudy.delivery?.map((item: string, idx: number) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="csd-card csd-card--highlight">
              <div className="csd-card-header">
                <TrendingUp className="csd-icon csd-icon--white" />
                <h3>Value Added</h3>
              </div>
              <ul className="csd-list csd-list--white">
                {caseStudy.valueAdded?.map((item: string, idx: number) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </main>

      {/* CTA Section */}
      <section className="csd-cta">
        <div className="csd-cta__content">
          <h2>Ready to transform your business?</h2>
          <p>Let JHS help you navigate your most complex challenges.</p>
          <Link to="/contact" className="csd-cta__button">Schedule a Consultation</Link>
        </div>
      </section>
    </div>
  );
}
