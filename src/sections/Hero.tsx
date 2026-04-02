import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight } from 'lucide-react'
import './Hero.css'

gsap.registerPlugin(ScrollTrigger)

const PANELS = [
  {
    id: 1,
    // tag: 'Financial Excellence',
    heading: ['Your Trusted', 'Partners in Finance'],
    body: 'Decades of experience helping businesses navigate complex financial landscapes with precision, integrity, and strategic vision.',
    cta: 'Explore Services',
    href: '#services',
    bg: 'src/image/Fainance.avif',
  },
  {
    id: 2,
    // tag: 'Audit & Assurance',
    heading: ['Clarity Through', 'Rigorous Audit'],
    body: 'Our audit methodology delivers transparency and confidence to stakeholders, ensuring compliance and uncovering strategic opportunities.',
    cta: 'Learn More',
    href: '#services',
    bg: 'src/image/Auditposter.jpg',
  },
  {
    id: 3,
    // tag: 'Tax Advisory',
    heading: ['Strategic Tax', 'Planning & Compliance'],
    body: 'Optimise your tax position with tailored strategies that are compliant, efficient, and aligned with your long-term business goals.',
    cta: 'Discover More',
    href: '#services',
    bg: 'src/image/Taxposter.jpg',
  },
  {
    id: 4,
    // tag: 'Corporate Advisory',
    heading: ['Driving Growth', 'Through Smart Counsel'],
    body: 'From mergers to restructuring, we provide actionable advisory that empowers decision-makers to achieve exceptional outcomes.',
    cta: 'Our Expertise',
    href: '#services',
    bg: 'src/image/growthposter.jpg',
  },
]

// ─── Tuning knobs — tweak these to taste ────────────────────────────────────
//  SCROLL_VH  : vh of scroll consumed per panel. 200 = 2 full screens per panel.
//               Raise to 250 for even slower feel.
//  SCRUB_LAG  : seconds of lag behind wheel. 2.5 = cinematic butter.
//  SEGMENT    : timeline units per panel. Must match tween offsets below.
const SCROLL_VH = 300
const SCRUB_LAG = 4.5
const SEGMENT   = 6

export default function Hero() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const panelRefs  = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    const panels = panelRefs.current.filter(Boolean) as HTMLDivElement[]
    const NUM    = panels.length

    const getEls = (panel: HTMLDivElement) => ({
      tag    : panel.querySelector<HTMLElement>('.h-tag')!,
      lines  : Array.from(panel.querySelectorAll<HTMLElement>('.h-line')),
      divider: panel.querySelector<HTMLElement>('.h-divider')!,
      body   : panel.querySelector<HTMLElement>('.h-body')!,
      actions: panel.querySelector<HTMLElement>('.h-actions')!,
    })

    // ── 1. Initial hidden state ───────────────────────────────────────────
    panels.forEach((panel, i) => {
      const { tag, lines, divider, body, actions } = getEls(panel)
      gsap.set(tag,     { y: 20,  autoAlpha: 0 })
      gsap.set(lines,   { yPercent: 110, autoAlpha: 0 })
      gsap.set(divider, { scaleX: 0, autoAlpha: 0, transformOrigin: 'left center' })
      gsap.set(body,    { y: 28,  autoAlpha: 0 })
      gsap.set(actions, { y: 22,  autoAlpha: 0 })
      if (i > 0) gsap.set(panel, { yPercent: 100 })
    })

    // ── 2. Panel 1 — animate in on load, no scroll ───────────────────────
    const p0     = getEls(panels[0])
    const loadTl = gsap.timeline({ delay: 0.4 })
    loadTl
      .to(p0.tag,     { y: 0, autoAlpha: 1, duration: 0.65, ease: 'power3.out'   }, 0)
      .to(p0.lines,   { yPercent: 0, autoAlpha: 1, duration: 0.8, ease: 'power4.out', stagger: 0.16 }, 0.12)
      .to(p0.divider, { scaleX: 1, autoAlpha: 1, duration: 0.5,  ease: 'power3.inOut' }, 0.55)
      .to(p0.body,    { y: 0, autoAlpha: 1, duration: 0.65, ease: 'power3.out'   }, 0.68)
      .to(p0.actions, { y: 0, autoAlpha: 1, duration: 0.6,  ease: 'power3.out'   }, 0.84)

    // ── 3. Master paused timeline — one segment per panel ────────────────
    //
    //  Per-panel layout (SEGMENT = 6 units):
    //  [0.0  → 1.5]  panel slides up           (slow power2.inOut)
    //  [1.6  → 2.4]  tag fades in
    //  [2.1  → 3.0]  heading line 1 rises
    //  [2.7  → 3.6]  heading line 2 rises
    //  [3.4  → 4.1]  divider scales in
    //  [4.0  → 4.9]  paragraph drifts up
    //  [4.9  → 5.7]  buttons appear
    //  [6.0       ]  next panel segment starts
    //
    const masterTl = gsap.timeline({ paused: true })

    panels.forEach((panel, i) => {
      if (i === 0) return
      const offset = (i - 1) * SEGMENT
      const { tag, lines, divider, body, actions } = getEls(panel)
      const line0 = lines[0]
      const line1 = lines[1] ?? lines[0]

      masterTl
        // Panel slide
        .to(panel, { yPercent: 0, ease: 'power2.inOut', duration: 3.5 }, offset)
        // Content reveal — sequential, not simultaneous
        .to(tag,     { y: 0, autoAlpha: 1, duration: 0.8, ease: 'power3.out'   }, offset + 1.6)
        .to(line0,   { yPercent: 0, autoAlpha: 1, duration: 1.9, ease: 'power4.out'   }, offset + 2.1)
        .to(line1,   { yPercent: 0, autoAlpha: 1, duration: 1.9, ease: 'power4.out'   }, offset + 2.7)
        .to(divider, { scaleX: 1, autoAlpha: 1, duration: 1.9, ease: 'power3.inOut'   }, offset + 3.4)
        .to(body,    { y: 0, autoAlpha: 1, duration: 1.9, ease: 'power3.out'   }, offset + 4.0)
        .to(actions, { y: 0, autoAlpha: 1, duration: 1.8, ease: 'power3.out'   }, offset + 4.9)
    })

    // ── 4. Single ScrollTrigger: pin + drive masterTl ────────────────────
    ScrollTrigger.create({
      trigger      : wrapper,
      start        : 'top top',
      end          : `+=${(NUM - 1) * SCROLL_VH}vh`,
      pin          : true,
      pinSpacing   : true,
      anticipatePin: 1,
      scrub        : SCRUB_LAG,
      animation    : masterTl,
    })

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill())
      masterTl.kill()
      loadTl.kill()
    }
  }, [])

  return (
    <section id="home" ref={wrapperRef} className="hero">
      {PANELS.map((panel, i) => (
        <div
          key={panel.id}
          ref={el => { panelRefs.current[i] = el }}
          className="hero__panel"
          style={{ backgroundImage: `url(${panel.bg})`, zIndex: i + 1 }}
        >
          <div className="hero__overlay" />
          <div className="hero__noise" />

          <div className="hero__content container">
            <span className="h-tag">{panel.tag}</span>

            <h1 className="hero__heading">
              {panel.heading.map((line, li) => (
                <span key={li} className="h-line-wrap">
                  <span className="h-line">{line}</span>
                </span>
              ))}
            </h1>

            <div className="h-divider" />
            <p className="h-body">{panel.body}</p>

            <div className="h-actions">
              <a href={panel.href} className="btn btn-primary">
                {panel.cta} <ArrowRight size={16} />
              </a>
              <a href="#about" className="btn btn-ghost">About Us</a>
            </div>
          </div>

          {i === 0 && (
            <div className="hero__scroll-hint" aria-hidden>
              <div className="hero__scroll-line">
                <div className="hero__scroll-dot" />
              </div>
            </div>
          )}
        </div>
      ))}
    </section>
  )
}