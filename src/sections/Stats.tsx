import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Users, Briefcase, Building2, Heart } from 'lucide-react'
import './Stats.css'

gsap.registerPlugin(ScrollTrigger)

const STATS = [
  {
    icon: Users, 
    label: 'Team Members',
    value: 700,
    suffix: '+',
    desc: 'Dedicated professionals across all disciplines',
  },
  {
    icon: Briefcase,
    label: 'Partners',
    value: 30,
    suffix: '',
    desc: 'Senior partners with decades of expertise',
  },
  {
    icon: Building2,
    label: 'Offices',
    value: 13,
    suffix: '',
    desc: 'Strategic locations across India & globally',
  },
  { 
    icon: Heart, 
    label: 'Happy Clients',
    value: 1000,
    suffix: '+',
    desc: 'Businesses that trust us year after year',
  },
]

function useCounter(target: number, duration = 2000, started: boolean) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    if (!started) { 
      setCount(0)
      setIsVisible(false)
      return 
    }
    setIsVisible(true)
    let startTime: number | null = null
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 4) // Cubic ease out for smoother animation
      setCount(Math.floor(ease * target))
      if (progress < 1) requestAnimationFrame(animate)
      else setCount(target)
    }
    const id = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(id)
  }, [target, duration, started])
  return { count, isVisible }
}

function StatCard({
  icon: Icon, label, value, suffix, desc, started, index
}: {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>
  label: string; value: number; suffix: string
  desc: string; started: boolean; index: number
}) {
  const { count, isVisible } = useCounter(value, 2000, started)
  return (
    <div className="stat-card" data-index={index}>
      <div className="stat-card__left">
        <div className="stat-card__icon">
          <Icon size={24} strokeWidth={1.5} />
        </div>
      </div>
      <div className="stat-card__body">
        <div className="stat-card__value-row">
          <span className={`stat-card__value ${isVisible ? 'visible' : ''}`}>
            {count.toLocaleString()}
          </span>
          <span className={`stat-card__suffix ${isVisible ? 'visible' : ''}`}>{suffix}</span>
        </div>
        <span className="stat-card__label">{label}</span>
        <p className="stat-card__desc">{desc}</p>
      </div>
      <div className="stat-card__bar" />
      <div className="stat-card__glow" />
    </div>
  )
}

export default function Stats() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const leftRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const cardEls = useRef<(HTMLDivElement | null)[]>([])
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardEls.current.filter(Boolean) as HTMLDivElement[]

      // Set initial state
      gsap.set(cards, { x: 120, opacity: 0, y: 30, scale: 0.95 })
      gsap.set(leftRef.current, { x: -60, opacity: 0 })

      // Pin section + animate cards on scroll
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=150%',
        pin: true,
        pinSpacing: true,
        onEnter: () => setStarted(true),
        onEnterBack: () => { setStarted(false); setTimeout(() => setStarted(true), 100) },
        onLeave: () => setStarted(false),
      })

      // Staggered card entrance with more dynamic animation
      gsap.to(cards, {
        x: 0,
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      })

      // Left side fade in with slide
      gsap.to(leftRef.current, {
        x: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      })

      // Enhanced parallax on cards — each at different speed with rotation
      cards.forEach((card, i) => {
        gsap.to(card, {
          y: -30 * (i + 1),
          rotation: i % 2 === 0 ? 1 : -1,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '+=150%',
            scrub: 1.2,
          },
        })
      })

      // Background deco animation
      gsap.to('.stats__bg-deco', {
        y: -50,
        rotation: 5,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 2,
        },
      })

    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="about" ref={sectionRef} className="stats">
      <div className="stats__inner container">

        {/* LEFT — sticky content */}
        <div className="stats__left" ref={leftRef}>
          {/* <span className="stats__overline">By The Numbers</span> */}
          <h2 className="stats__heading">
            Proven Trust,<br />
            <span className="stats__heading-accent">Measurable</span><br />
            Impact
          </h2>
          <p className="stats__subtext">
            Over two decades of delivering excellence across audit, tax, and advisory services for businesses in India and beyond.
          </p>
          <div className="stats__left-deco">
            {/* <div className="stats__deco-line" /> */}
            {/* <span className="stats__deco-text">EST. 2001</span> */}
          </div>
        </div>

        {/* RIGHT — animated cards */}
        <div className="stats__right" ref={cardsRef}>
          {STATS.map((s, i) => (
            <div
              key={s.label}
              ref={(el) => { cardEls.current[i] = el }}
            >
              <StatCard {...s} started={started} index={i} />
            </div>
          ))}
        </div>
      </div>

      {/* Background deco */}
      <div className="stats__bg-deco" aria-hidden />
    </section>
  )
}