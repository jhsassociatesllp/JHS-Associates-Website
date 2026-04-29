import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from '@studio-freight/lenis'
import { ArrowRight, Calendar, Clock } from 'lucide-react'
import './Posts.css'

gsap.registerPlugin(ScrollTrigger)

const POSTS = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80',
    category: 'Tax',
    date: 'Mar 10, 2026',
    readTime: '5 min read',
    title: 'Key Changes in Tax Regime for FY 2026-27',
    desc: 'A comprehensive overview of the latest amendments and how they impact individual and corporate taxpayers.',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800&q=80',
    category: 'Audit',
    date: 'Feb 28, 2026',
    readTime: '7 min read',
    title: 'Strengthening Internal Controls in a Digital Era',
    desc: 'How modern businesses can adopt robust audit frameworks to stay compliant and mitigate risk.',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&q=80',
    category: 'Advisory',
    date: 'Feb 14, 2026',
    readTime: '6 min read',
    title: 'M&A Due Diligence: A Practical Guide',
    desc: 'Essential steps and best practices for conducting thorough financial due diligence in mergers and acquisitions.',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=800&q=80',
    category: 'Finance',
    date: 'Jan 30, 2026',
    readTime: '4 min read',
    title: 'GST Reconciliation: Common Pitfalls to Avoid',
    desc: 'Understanding frequent errors in GST reconciliation and strategies to ensure accurate and timely compliance.',
  },
]

export default function Posts() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const trackWrapRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // ── Lenis smooth scroll ────────────────────────────────────────────────
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => lenis.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)

    const ctx = gsap.context(() => {
      const track = trackRef.current
      if (!track) return

      // ── Heading: fade + scale up ───────────────────────────────────────
      gsap.fromTo(
        headingRef.current,
        { y: 50, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      // ── Calculate how far cards should travel ──────────────────────────
      // track full scrollWidth minus viewport width, plus 80px padding
      const getScrollAmt = () =>
        -(track.scrollWidth - window.innerWidth + 80)

      // ── PIN section + scrub horizontal card movement ───────────────────
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: () => `+=${Math.abs(getScrollAmt())}`,
        pin: true,
        anticipatePin: 1,
        scrub: 1.4,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const amt = getScrollAmt() * self.progress
          gsap.set(track, { x: amt })
          // Progress bar
          const bar = document.querySelector<HTMLElement>('.posts__progress-bar')
          if (bar) bar.style.transform = `scaleX(${self.progress})`
        },
      })

      // ── Cards stagger fade-in on enter ────────────────────────────────
      const cards = track.querySelectorAll('.post-card')
      gsap.fromTo(
        cards,
        { opacity: 0, y: 60, scale: 0.92 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.1,
          duration: 0.75,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    }, sectionRef)

    return () => {
      ctx.revert()
      lenis.destroy()
    }
  }, [])

  return (
    <section id="posts" ref={sectionRef} className="posts">

      {/* ── CENTER HEADING ─────────────────────────────────────────────── */}
      <div ref={headingRef} className="posts__header">
        <span className="posts__overline">Latest Insights</span>
        <h2 className="posts__title">
          News &amp;&nbsp;<em>Publications.</em>
        </h2>
        <p className="posts__sub">
          Stay ahead with expert analysis, regulatory updates, and strategic perspectives from our team.
        </p>
      </div>

      {/* ── HORIZONTAL TRACK ──────────────────────────────────────────── */}
      <div ref={trackWrapRef} className="posts__track-wrap">
        <div ref={trackRef} className="posts__track">

          {/* Cards */}
          {POSTS.map((post) => (
            <article key={post.id} className="post-card">
              <div className="post-card__img-wrap">
                <img src={post.image} alt={post.title} loading="lazy" />
                <span className="post-card__category">{post.category}</span>
              </div>
              <div className="post-card__body">
                <div className="post-card__meta">
                  <span><Calendar size={12} />{post.date}</span>
                  <span><Clock size={12} />{post.readTime}</span>
                </div>
                <h3 className="post-card__title">{post.title}</h3>
                <p className="post-card__desc">{post.desc}</p>
                <a href="#" className="post-card__link">
                  Learn More <ArrowRight size={14} />
                </a>
              </div>
            </article>
          ))}

          {/* View All — last item in track */}
          <div className="posts__view-all">
            <a href="#" className="posts__view-all-btn">
              <span>View All</span>
              <div className="posts__view-all-icon">
                <ArrowRight size={22} />
              </div>
            </a>
          </div>

        </div>
      </div>

      {/* ── PROGRESS BAR ─────────────────────────────────────────────── */}
      <div className="posts__progress">
        <div className="posts__progress-bar" />
      </div>

    </section>
  )
}