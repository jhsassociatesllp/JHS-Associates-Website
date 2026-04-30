import { useEffect } from 'react'
import './SharedAbout.css'
import heroBg from '../../image/Blogs.avif'

export default function Culture() {
  useEffect(() => { window.scrollTo({ top: 0 }) }, [])

  return (
    <div className="ap-page">
      {/* ════ HERO ════ */}
      <section className="ap-hero">
        <div className="ap-hero__bg" style={{ backgroundImage: `url(${heroBg})` }} />
        <div className="ap-hero__overlay" />
        <div className="ap-hero__content">
          <p className="ap-hero__eyebrow">Inner Workings</p>
          <h1 className="ap-hero__title">Our Culture</h1>
          <p className="ap-hero__sub">
            A dynamic environment where talent thrives, collaboration is celebrated, and excellence is the standard.
          </p>
        </div>
      </section>

      {/* ════ CONTENT ════ */}
      <section className="ap-content">
        <div className="ap-container">
          
          <div className="ap-grid">
            <div className="ap-grid-left">
              <h2>Values &amp; Ways of Working</h2>
              <p>Because how we do things matters as much as what we do.</p>
            </div>
            <div className="ap-grid-right">
              <p>
                At JHS, culture isn't just a poster on the wall – it's the lived experience of our 200+ professionals every single day. We intentionally cultivate a workspace that balances intense, high-stakes client delivery with profound respect for individual growth and wellbeing.
              </p>
              <p>
                We operate as a flat matrix. We believe that a great idea can come from a first-year articled assistant just as easily as it can from a senior partner. This open-door policy ensures rapid learning cycles and an agile firm that can instantly pivot to meet our clients' most complex needs.
              </p>
            </div>
          </div>

          <div className="ap-card" style={{ marginTop: '3rem' }}>
            <h3>Cultural Pillars</h3>
            <p style={{ marginBottom: '2rem' }}>The cornerstones of the JHS working environment.</p>
            <div className="ap-features">
              <div className="ap-feature">
                <h4>Meritocracy</h4>
                <p>Growth is dictated by performance, initiative, and impact, completely untethered from rigid tenure.</p>
              </div>
              <div className="ap-feature">
                <h4>Radical Candor</h4>
                <p>We encourage open, honest, and direct feedback to accelerate professional development.</p>
              </div>
              <div className="ap-feature">
                <h4>Diversity &amp; Inclusion</h4>
                <p>We embrace diverse perspectives, knowing they are the bedrock of innovative problem solving.</p>
              </div>
              <div className="ap-feature">
                <h4>Work-Life Integration</h4>
                <p>We support our team in achieving meaningful success both inside and outside the office.</p>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  )
}
