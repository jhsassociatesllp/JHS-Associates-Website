import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./VisionMission.css";

export default function VisionMission() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Left side image slides in from left
      gsap.fromTo(
        leftRef.current,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        }
      );

      // Right side content slides in from right sequentially
      gsap.fromTo(
        rightRef.current?.children ? Array.from(rightRef.current.children) : [],
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="vision-mission" ref={sectionRef}>
      <div className="vision-mission__container">

        {/* LEFT SIDE - Graphic / Image */}
        <div className="vision-mission__left" ref={leftRef}>
          <div className="vision-mission__graphic">
            <div className="vision-mission__ring"></div>
            <div className="vision-mission__image-wrapper">
              {/* Replace with actual team image from src/image when available */}
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1470&auto=format&fit=crop"
                alt="Our Team"
                className="vision-mission__image"
              />
            </div>
            {/* Small decorative white circle */}
            <div className="vision-mission__deco-circle"></div>
          </div>
        </div>

        {/* RIGHT SIDE - Content */}
        <div className="vision-mission__right" ref={rightRef}>
          <h2 className="vision-mission__title">
            <span className="vision-mission__title-red">OUR VISION</span>
            <br />
            <span className="vision-mission__title-red">&amp; MISSION</span>
          </h2>

          <div className="vision-mission__row">
            {/* Vision Column */}
            <div className="vision-mission__col">
              <h3 className="vision-mission__subtitle">Our Vision</h3>
              <p className="vision-mission__text">
                To be a globally respected premier assurance &amp; accounting firm that is most preferred in locations we serve.
              </p>
            </div>

            {/* Mission Column */}
            <div className="vision-mission__col">
              <h3 className="vision-mission__subtitle">Our Mission</h3>
              <p className="vision-mission__text">
                To nurture people and enable them to offer value to our clients through innovation, technology &amp; responsiveness.
              </p>
            </div>
          </div>

          {/* Values graphic below */}
          <div className="vision-mission__values">
            {/* The orbit connecting lines */}
            <svg className="vision-mission__orbit" viewBox="0 0 400 200" preserveAspectRatio="none">
              <ellipse cx="200" cy="100" rx="140" ry="70" fill="none" stroke="#e0e6ed" strokeWidth="2" strokeDasharray="4 4" />
            </svg>

            {/* Central Node */}
            <div className="vision-mission__values-center">
              <span>Our<br />Values</span>
            </div>

            {/* Orbital Nodes */}
            <div className="value-node node-1">
              <span className="dot"></span>
              Integrity
            </div>
            <div className="value-node node-2">
              <span className="dot"></span>
              Confidentiality
            </div>
            <div className="value-node node-3">
              <span className="dot"></span>
              Accountability
            </div>
            <div className="value-node node-4">
              <span className="dot"></span>
              Collaborative
            </div>
            <div className="value-node node-5">
              <span className="dot"></span>
              Proactive
            </div>
            <div className="value-node node-6">
              <span className="dot"></span>
              Innovation
            </div>
          </div>
        </div>

      </div>
    </section >
  );
}
