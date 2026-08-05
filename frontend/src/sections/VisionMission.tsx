import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./VisionMission.css";
import { imageUrl } from "../utils/imageUrl";

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
                src={imageUrl('visionmission1.webp')}
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

      {/* JHS GOLD STANDARD SECTION */}
      <div className="gold-standard">
        <div className="gold-standard__container">

          {/* Header */}
          <div className="gold-standard__header">
            <h2 className="gold-standard__title">
              <span className="gold-standard__title-jhs">JHS</span>{" "}
              <span className="gold-standard__title-gold">GOLD</span>{" "}
              <span className="gold-standard__title-standard">STANDARDS</span>
            </h2>
          </div>

          {/* Circular Badges */}
          <div className="gold-standard__badges">

            {/* Quality */}
            <div className="gold-standard__badge">
              <div className="gold-standard__circle">
                Quality
              </div>
              <div className="gold-standard__details">
                <ul className="gold-standard__list">
                  <li>Delighting stakeholders by exceeding expectations</li>
                  <li>Aiming for excellence by maintaining high standards of professional practice and service execution</li>
                  <li>Displaying high levels of commitment and passion</li>
                </ul>
              </div>
            </div>

            {/* Objectivity */}
            <div className="gold-standard__badge">
              <div className="gold-standard__circle">
                Objectivity
              </div>
              <div className="gold-standard__details">
                <ul className="gold-standard__list">
                  <li>Committing to integrity, independence & accountability aside value to clients as an objective source of assurance</li>
                </ul>
              </div>
            </div>

            {/* Mutual Trust & Respect */}
            <div className="gold-standard__badge">
              <div className="gold-standard__circle">
                Mutual<br />Trust &<br />Respect
              </div>
              <div className="gold-standard__details">
                <ul className="gold-standard__list">
                  <li>Working relationships are based on fulfilling commitments to develop trust</li>
                  <li>Honesty and integrity as the best business ethics</li>
                  <li>Transparent dealings</li>
                </ul>
              </div>
            </div>

            {/* Fairness in Dealings */}
            <div className="gold-standard__badge">
              <div className="gold-standard__circle">
                Fairness<br />in<br />Dealings
              </div>
              <div className="gold-standard__details">
                <ul className="gold-standard__list">
                  <li>Fairness in dealings with customers, employees and vendors</li>
                  <li>Open and co-operative dealings with regulators</li>
                </ul>
              </div>
            </div>

            {/* Result Oriented Approach */}
            <div className="gold-standard__badge">
              <div className="gold-standard__circle">
                Result<br />Oriented<br />Approach
              </div>
              <div className="gold-standard__details">
                <ul className="gold-standard__list">
                  <li>Analytical thinking coupled with business understanding and problem-solving</li>
                  <li>Working as a catalyst for improvement through effective assessment of risks</li>
                  <li>Personalized attention to clients and result orientation</li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </div>

    </section >
  );
}

