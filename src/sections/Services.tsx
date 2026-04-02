import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { Shield, FileSearch, Calculator, TrendingUp, Globe, Briefcase } from 'lucide-react'
import './Services.css'

gsap.registerPlugin(ScrollTrigger, ScrollSmoother)

// ── India Services ────────────────────────────────────────
const INDIA_SERVICES = [
  {
    icon: Briefcase,
    title: 'Outsourcing',
    desc: 'End-to-end finance & accounting outsourcing — bookkeeping, payroll, MIS reporting, and CFO support — so you can focus on growth.',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop',
    bgImage: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1920&h=1080&fit=crop',
  },
  {
    icon: TrendingUp,
    title: 'Consulting',
    desc: 'Strategic business consulting covering corporate governance, process optimisation, financial modelling, and management advisory.',
    image: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&h=600&fit=crop',
    bgImage: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1920&h=1080&fit=crop',
  },
  {
    icon: Calculator,
    title: 'Taxation',
    desc: 'Comprehensive direct & indirect tax services — income tax, GST, transfer pricing, and international tax planning for individuals and corporates.',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=600&fit=crop',
    bgImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1920&h=1080&fit=crop',
  },
  {
    icon: FileSearch,
    title: 'Assurance',
    desc: 'Independent audit and assurance services that build stakeholder confidence, ensure regulatory compliance, and strengthen internal controls.',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=600&fit=crop',
    bgImage: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1920&h=1080&fit=crop',
  },
]

// ── Global Services ───────────────────────────────────────
const GLOBAL_SERVICES = [
  {
    icon: FileSearch,
    title: 'Assurance',
    desc: 'Cross-border audit and assurance engagements aligned with international standards, delivering transparency for global stakeholders.',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=600&fit=crop',
    bgImage: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1920&h=1080&fit=crop',
  },
  {
    icon: Calculator,
    title: 'Taxation',
    desc: 'International tax structuring, transfer pricing, treaty advisory, and multi-jurisdiction compliance for global businesses and HNIs.',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=600&fit=crop',
    bgImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1920&h=1080&fit=crop',
  },
  {
    icon: Globe,
    title: 'Single Window Assistance',
    desc: 'One unified point of contact for all cross-border regulatory, compliance, and advisory needs — seamless coordination across jurisdictions.',
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop',
    bgImage: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1920&h=1080&fit=crop',
  },
  {
    icon: TrendingUp,
    title: 'Consulting',
    desc: 'Global strategy, market-entry advisory, and financial consulting for organisations expanding into or operating across international markets.',
    image: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&h=600&fit=crop',
    bgImage: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1920&h=1080&fit=crop',
  },
  {
    icon: Shield,
    title: 'SOC Attestation',
    desc: 'SOC 1, SOC 2, and SOC 3 attestation services for service organisations — demonstrating security, availability, and confidentiality controls.',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=600&fit=crop',
    bgImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1920&h=1080&fit=crop',
  },
  {
    icon: Briefcase,
    title: 'Outsourcing',
    desc: 'Global finance & accounting outsourcing — virtual CFO, offshore accounting, payroll processing, and compliance management at scale.',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop',
    bgImage: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1920&h=1080&fit=crop',
  },
]

const SERVICES = [...INDIA_SERVICES, ...GLOBAL_SERVICES]

// Scroll budget:
//   Phase A (zoom) = 1 unit
//   Phase B (services) = 1 unit per service
//   India: 4 services + Global: 6 services = 10 total
//   Total = 11 units → end: "+=1100vh"
const ZOOM_UNITS    = 1
const TOTAL_UNITS   = ZOOM_UNITS + SERVICES.length   // 11

export default function Services() {

  // wrapperRef  → tall outer div that lives in normal document flow
  //               GSAP pinSpacing auto-inflates its height so the next
  //               section is pushed down correctly
  const wrapperRef = useRef<HTMLDivElement>(null)

  // panelRef    → 100 vh viewport; this is what GSAP pins to the screen
  const panelRef   = useRef<HTMLDivElement>(null)

  const bgLayersRef     = useRef<(HTMLDivElement | null)[]>([])
  const heroImageRef    = useRef<HTMLDivElement>(null)
  const serviceNamesRef = useRef<(HTMLDivElement | null)[]>([])
  const descTextsRef    = useRef<(HTMLDivElement | null)[]>([])

  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const wrapper = wrapperRef.current
    const panel   = panelRef.current
    if (!wrapper || !panel) return

    const ctx = gsap.context(() => {
      // ── Skip ScrollSmoother for now - use native smooth scrolling
      // ScrollSmoother was causing layout issues with the existing structure
      // We'll use CSS smooth-scrolling instead for better compatibility

      // ── 1. INITIAL STATES ─────────────────────────────────

      // All names stacked vertically, fully hidden initially
      serviceNamesRef.current.forEach((el, i) => {
        if (!el) return
        gsap.set(el, { y: i * 90, opacity: 0, scale: 0.87 })
      })

      // Hero: zoomed-in + clipped (lives between the letter gaps)
      gsap.set(heroImageRef.current, {
        scale: 3.5,
        opacity: 0,
        clipPath: 'inset(38% 28% 38% 28% round 2px)',
      })

      // All bg layers off
      bgLayersRef.current.forEach(el => el && gsap.set(el, { opacity: 0 }))

      // All thumbs + descs off
      descTextsRef.current.forEach(el => el && gsap.set(el, { opacity: 0, y: 14 }))

      // ── 2. ONE MASTER TIMELINE, ONE ScrollTrigger ─────────
      //
      //   trigger  = wrapperRef  (tall outer div)
      //   pin      = panelRef    (100vh inner panel)
      //   pinSpacing: true       → GSAP auto-adds the extra scroll space
      //                            to wrapperRef so nothing jumps
      //
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          start: 'top top',
          end: `+=${TOTAL_UNITS * 320}vh`,   // 220vh per unit = much slower scroll
          pin: panel,                         // panel stays glued to viewport
          pinSpacing: true,                   // wrapper grows → next section pushed down
          scrub: 1.5,
          anticipatePin: 1,
          onUpdate (self) {
            const zoomFrac = ZOOM_UNITS / TOTAL_UNITS
            if (self.progress > zoomFrac) {
              const p   = (self.progress - zoomFrac) / (1 - zoomFrac)
              const idx = Math.min(Math.floor(p * SERVICES.length), SERVICES.length - 1)
              setActiveIndex(idx)
            } 
          },
          // Remove scroller property - ScrollSmoother automatically handles ScrollTrigger
        },
      })

      // ── PHASE A  (tl position 0 → zP): image zoom reveal ──

      const zP         = ZOOM_UNITS / TOTAL_UNITS          // 1/7 ≈ 0.143
      const perService = (1 - zP) / SERVICES.length        // 6/7 ÷ 6 = 1/7 each

      // Names hidden as image opens (already 0, keep at 0)
      masterTl.to(
        serviceNamesRef.current.filter(Boolean),
        { opacity: 0, scale: 0.80, duration: zP, ease: 'none' },
        0
      )

      // Hero: zoom out (3.5→1) + clip fully opens → fills screen
      masterTl.to(
        heroImageRef.current,
        {
          scale: 1,
          opacity: 1,
          clipPath: 'inset(0% 0% 0% 0% round 0px)',
          duration: zP,
          ease: 'power2.inOut',
        },
        0
      )

      // First bg fades in during zoom
      masterTl.to(
        bgLayersRef.current[0],
        { opacity: 1, duration: zP * 0.55, ease: 'none' },
        zP * 0.25
      )

      // ── PHASE B  (tl position zP → 1): service cycling ────

      SERVICES.forEach((service, i) => {
        const s   = zP + i * perService          // start of this service slice
        const mid = s  + perService * 0.30       // midpoint (image swap happens here)

        // Service names reposition
        serviceNamesRef.current.forEach((el, j) => {
          if (!el) return
          const offset = j - i
          masterTl.to(
            el,
            {
              y: offset * 90,
              opacity : j === i ? 1 : 0,
              scale   : j === i ? 1 : Math.max(0.78, 1 - Math.abs(offset) * 0.08),
              duration: perService * 0.45,
              ease    : 'power3.out',
            },
            s
          )
        })

        // Background layer switch
        bgLayersRef.current.forEach((el, j) => {
          if (!el) return
          masterTl.to(el, { opacity: j === i ? 1 : 0, duration: perService * 0.45, ease: 'none' }, s)
        })

        // Hero image crossfade
        masterTl.to(heroImageRef.current, { opacity: 0.5, duration: perService * 0.15, ease: 'power1.in' }, s)
        masterTl.call(() => {
          if (heroImageRef.current)
            heroImageRef.current.style.backgroundImage = `url(${service.bgImage})`
        }, [], mid)
        masterTl.to(heroImageRef.current, { opacity: 1, duration: perService * 0.20, ease: 'power1.out' }, mid)

        // Description in / previous out
        if (descTextsRef.current[i]) {
          masterTl.to(
            descTextsRef.current[i],
            { opacity: 1, y: 0, duration: perService * 0.28, ease: 'power2.out' },
            s + perService * 0.12
          )
        }
        if (i > 0 && descTextsRef.current[i - 1]) {
          masterTl.to(
            descTextsRef.current[i - 1],
            { opacity: 0, y: -10, duration: perService * 0.20, ease: 'power1.in' },
            s
          )
        }
      })

    }, wrapperRef)

    return () => {
      ctx.revert()
      // ScrollSmoother is disabled - no cleanup needed
    }
  }, [])

  return (
    /* ─── Outer wrapper ─────────────────────────────────────
       Lives in normal document flow.
       GSAP's pinSpacing:true will auto-add a padding-bottom
       equal to the pin duration so the next section flows
       in exactly when all animations finish.
    ─────────────────────────────────────────────────────── */
    <div ref={wrapperRef} className="services-wrapper">

      {/* ─── Pinned 100vh panel ──────────────────────────── */}
      <div ref={panelRef} className="services-panel">

          {/* Background layers */}
          <div className="services-bg-container">
            {SERVICES.map((service, i) => (
              <div
                key={i}
                ref={el => { bgLayersRef.current[i] = el }}
                className="services-bg-layer"
                data-speed="0.5"
                style={{ backgroundImage: `url(${service.bgImage})` }}
              />
            ))}
          </div>

          {/* Hero fullscreen image */}
          <div
            ref={heroImageRef}
            className="services-hero-image"
            data-speed="0.8"
            style={{ backgroundImage: `url(${SERVICES[0].bgImage})` }}
          />

        {/* Diagonal accent */}
        <div className="services-diagonal" />

        {/* Vertical label */}
        <span className="services-label">Our Services</span>

        {/* Service names — center stack */}
        <div className="services-names-track">
          {SERVICES.map((service, i) => {
            const isIndia  = i < INDIA_SERVICES.length
            const region   = isIndia ? 'India' : 'Global'
            return (
              <div
                key={i}
                ref={el => { serviceNamesRef.current[i] = el }}
                className={`services-name${i === activeIndex ? ' services-name--active' : ''}`}
              >
                {i === activeIndex && (
                  <span className="services-name-region">{region}</span>
                )}
                {service.title}
              </div>
            )
          })}
        </div>

        {/* Description blocks — bottom-left, stacked, one visible at a time */}
        <div className="services-descs">
          {SERVICES.map((service, i) => (
            <div
              key={i}
              ref={el => { descTextsRef.current[i] = el }}
              className="services-desc-block"
            >
              <div className="services-desc-icon">
                <service.icon size={20} strokeWidth={1.5} />
              </div>
              <p className="services-desc-text">{service.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}