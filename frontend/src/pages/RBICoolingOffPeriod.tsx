import React from 'react';
import { imageUrl } from '../utils/imageUrl';
import LazyImage from '../components/common/LazyImage';

export default function RBICoolingOffPeriod() {
    return (
        <section style={styles.section}>
            <div style={styles.container}>
                {/* Hero Header */}
                <div style={styles.hero}>
                    <span style={styles.category}>REGULATORY UPDATE</span>
                    <h1 style={styles.title}>RBI Introduces Mandatory Cooling-Off Period</h1>
                    <p style={styles.subtitle}>
                        For Co-operative Bank Directors
                    </p>
                    <div style={styles.meta}>
                        <span>PRESS RELEASE NO.: 2026-2027/326</span>
                        <span style={styles.dot}>•</span>
                        <span>25 May 2026</span>
                    </div>
                    <div style={styles.applicableBox}>
                        <p style={styles.applicableLabel}>Applicable To</p>
                        <p style={styles.applicableText}>
                            Urban Co-operative Banks (UCBs), Rural Co-operative Banks (RCBs), 
                            State Co-operative Banks (StCBs), and Central Co-operative Banks (CCBs)
                        </p>
                    </div>
                </div>

                {/* Main Content */}
                <article style={styles.content}>
                    <div style={styles.imageWrapper}>
                        <LazyImage
                            src={imageUrl('reserve-bank-of-india-rbi-.webp')}
                            alt="RBI Cooling-Off Period for Co-operative Bank Directors"
                            className="rbi-hero-image"
                            threshold={0.1}
                        />
                    </div>

                    <div style={styles.textContent}>
                        {/* Overview */}
                        <div style={styles.overviewBox}>
                            <h2 style={styles.overviewTitle}>Overview</h2>
                            <p style={styles.overviewText}>
                                The Reserve Bank of India (RBI) has issued final amendment directions introducing a 
                                mandatory cooling-off period for directors serving on the boards of co-operative banks. 
                                The reform aims to strengthen governance standards, improve board independence, and 
                                prevent the circumvention of tenure limits.
                            </p>
                        </div>

                        {/* Key Change */}
                        <div style={styles.keyChangeBox}>
                            <h2 style={styles.keyChangeTitle}>Key Change Introduced by RBI</h2>
                            <p style={styles.keyChangeLarge}>
                                Directors who have completed <strong>10 consecutive years</strong> on the board of the 
                                same co-operative bank must observe a mandatory <strong>3-year cooling-off period</strong> before 
                                becoming eligible to rejoin that bank's board.
                            </p>
                            <h3 style={styles.subheading}>During the Cooling-Off Period:</h3>
                            <ul style={styles.list}>
                                <li style={styles.listItem}>
                                    Directors cannot hold any board position in the same bank
                                </li>
                                <li style={styles.listItem}>
                                    They may continue as regular members or customers of the bank
                                </li>
                                <li style={styles.listItem}>
                                    They may serve on the board of another eligible bank if permitted under applicable regulations
                                </li>
                            </ul>
                        </div>

                        {/* Why Was This Necessary */}
                        <h2 style={styles.sectionTitle}>Why Was This Amendment Necessary?</h2>
                        <p style={styles.paragraph}>
                            RBI observed instances where directors resigned briefly and were subsequently re-elected or 
                            re-appointed, effectively bypassing statutory tenure restrictions.
                        </p>
                        <div style={styles.highlightBox}>
                            <h3 style={styles.highlightTitle}>The Amendment Ensures:</h3>
                            <ul style={styles.highlightList}>
                                <li style={styles.highlightItem}>
                                    Short-term resignations do not reset tenure calculations
                                </li>
                                <li style={styles.highlightItem}>
                                    Governance standards are strengthened
                                </li>
                                <li style={styles.highlightItem}>
                                    Long-term concentration of power is reduced
                                </li>
                                <li style={styles.highlightItem}>
                                    Board independence and accountability are enhanced
                                </li>
                            </ul>
                            <p style={styles.highlightNote}>
                                <strong>Important:</strong> Any interruption in service of less than three years will 
                                continue to be treated as part of the director's continuous tenure.
                            </p>
                        </div>

                        {/* How It Works */}
                        <h2 style={styles.sectionTitle}>How the New Rule Works</h2>
                        
                        <div style={styles.stepsContainer}>
                            <div style={styles.stepBox}>
                                <div style={styles.stepNumber}>1</div>
                                <div style={styles.stepContent}>
                                    <h3 style={styles.stepTitle}>Appointment</h3>
                                    <p style={styles.stepText}>
                                        A director joins the board of a co-operative bank.
                                    </p>
                                </div>
                            </div>

                            <div style={styles.stepBox}>
                                <div style={styles.stepNumber}>2</div>
                                <div style={styles.stepContent}>
                                    <h3 style={styles.stepTitle}>Continuous Service</h3>
                                    <p style={styles.stepText}>
                                        The director serves continuously on the same board for up to 10 years.
                                    </p>
                                </div>
                            </div>

                            <div style={styles.stepBox}>
                                <div style={styles.stepNumber}>3</div>
                                <div style={styles.stepContent}>
                                    <h3 style={styles.stepTitle}>Cooling-Off Period</h3>
                                    <p style={styles.stepText}>
                                        Upon completion of the 10-year tenure, the director must take a mandatory 
                                        3-year break from serving on that bank's board.
                                    </p>
                                </div>
                            </div>

                            <div style={styles.stepBox}>
                                <div style={styles.stepNumber}>4</div>
                                <div style={styles.stepContent}>
                                    <h3 style={styles.stepTitle}>Re-Eligibility</h3>
                                    <p style={styles.stepText}>
                                        After completing the cooling-off period, the individual may become eligible 
                                        for reappointment subject to applicable rules and eligibility requirements.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Legislative Timeline */}
                        <h2 style={styles.sectionTitle}>Legislative Timeline</h2>
                        
                        <div style={styles.timelineContainer}>
                            <div style={styles.timelineItem}>
                                <div style={styles.timelineDate}>August 1, 2025</div>
                                <div style={styles.timelineContent}>
                                    <h4 style={styles.timelineTitle}>Banking Laws Amendment</h4>
                                    <p style={styles.timelineText}>
                                        The Banking Laws (Amendment) Act, 2025 increased the maximum continuous tenure 
                                        for co-operative bank directors from 8 years to 10 years.
                                    </p>
                                </div>
                            </div>

                            <div style={styles.timelineItem}>
                                <div style={styles.timelineDate}>January 8, 2026</div>
                                <div style={styles.timelineContent}>
                                    <h4 style={styles.timelineTitle}>Draft Directions Issued</h4>
                                    <p style={styles.timelineText}>
                                        RBI issued draft directions proposing a mandatory cooling-off period and 
                                        invited stakeholder feedback.
                                    </p>
                                </div>
                            </div>

                            <div style={styles.timelineItem}>
                                <div style={styles.timelineDate}>Consultation Phase</div>
                                <div style={styles.timelineContent}>
                                    <h4 style={styles.timelineTitle}>Stakeholder Review</h4>
                                    <p style={styles.timelineText}>
                                        Feedback from industry participants and stakeholders was reviewed and 
                                        incorporated into the final framework.
                                    </p>
                                </div>
                            </div>

                            <div style={styles.timelineItem}>
                                <div style={styles.timelineDate}>May 25, 2026</div>
                                <div style={styles.timelineContent}>
                                    <h4 style={styles.timelineTitle}>Final Amendment Released</h4>
                                    <p style={styles.timelineText}>
                                        RBI released the final amendment directions, making the new governance 
                                        requirements effective immediately.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Benefits */}
                        <h2 style={styles.sectionTitle}>Benefits of the Amendment</h2>
                        
                        <div style={styles.benefitsGrid}>
                            <div style={styles.benefitCard}>
                                <h3 style={styles.benefitTitle}>Board Renewal</h3>
                                <p style={styles.benefitText}>
                                    Regular board rotation introduces fresh leadership, diverse expertise, and new 
                                    perspectives into co-operative bank governance.
                                </p>
                            </div>

                            <div style={styles.benefitCard}>
                                <h3 style={styles.benefitTitle}>Stronger Governance</h3>
                                <p style={styles.benefitText}>
                                    The framework reduces the risk of excessive influence, conflicts of interest, 
                                    and concentration of decision-making power.
                                </p>
                            </div>

                            <div style={styles.benefitCard}>
                                <h3 style={styles.benefitTitle}>Regulatory Compliance</h3>
                                <p style={styles.benefitText}>
                                    The amendment reinforces compliance with the Banking Regulation Act and supports 
                                    the intended spirit of board tenure limitations.
                                </p>
                            </div>

                            <div style={styles.benefitCard}>
                                <h3 style={styles.benefitTitle}>Better Succession Planning</h3>
                                <p style={styles.benefitText}>
                                    Banks are encouraged to proactively identify future leaders and strengthen 
                                    governance continuity.
                                </p>
                            </div>

                            <div style={styles.benefitCard}>
                                <h3 style={styles.benefitTitle}>Industry Alignment</h3>
                                <p style={styles.benefitText}>
                                    The reform brings co-operative banks closer to governance practices commonly 
                                    followed by commercial banks and financial institutions.
                                </p>
                            </div>

                            <div style={styles.benefitCard}>
                                <h3 style={styles.benefitTitle}>Enhanced Stakeholder Confidence</h3>
                                <p style={styles.benefitText}>
                                    Greater transparency and board accountability can help strengthen trust among 
                                    members, depositors, regulators, and investors.
                                </p>
                            </div>
                        </div>

                        {/* Impact on Banks */}
                        <div style={styles.impactBox}>
                            <h2 style={styles.impactTitle}>Impact on Co-operative Banks</h2>
                            <p style={styles.impactIntro}>Banks should immediately:</p>
                            <ul style={styles.impactList}>
                                <li style={styles.impactItem}>Review existing director tenures</li>
                                <li style={styles.impactItem}>Identify directors nearing tenure limits</li>
                                <li style={styles.impactItem}>Plan succession and board transition strategies</li>
                                <li style={styles.impactItem}>Update governance and nomination policies</li>
                                <li style={styles.impactItem}>Ensure compliance with RBI's amended framework</li>
                            </ul>
                        </div>

                        {/* Conclusion */}
                        <div style={styles.conclusionBox}>
                            <h2 style={styles.conclusionTitle}>Conclusion</h2>
                            <p style={styles.conclusionText}>
                                RBI's mandatory cooling-off framework marks a significant governance reform for India's 
                                co-operative banking sector. By enforcing board rotation after ten years of continuous 
                                service, the amendment promotes transparency, accountability, and sustainable leadership 
                                while preventing circumvention of tenure limits.
                            </p>
                        </div>
                    </div>
                </article>
            </div>
        </section>
    );
}

const styles: Record<string, React.CSSProperties> = {
    section: {
        padding: '120px 0 80px',
        backgroundColor: '#ffffff',
        minHeight: '100vh',
        fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
    },
    container: {
        maxWidth: 900,
        margin: '0 auto',
        padding: '0 24px',
    },
    hero: {
        textAlign: 'center',
        marginBottom: '60px',
        paddingBottom: '40px',
        borderBottom: '1px solid #e5e7eb',
    },
    category: {
        display: 'inline-block',
        fontSize: '0.7rem',
        fontWeight: 700,
        letterSpacing: '0.2em',
        color: '#D62049',
        textTransform: 'uppercase',
        marginBottom: '16px',
    },
    title: {
        fontSize: 'clamp(2rem, 5vw, 3rem)',
        fontWeight: 600,
        color: '#1e3a5f',
        lineHeight: 1.2,
        marginBottom: '16px',
    },
    subtitle: {
        fontSize: '1.25rem',
        color: '#6b7280',
        lineHeight: 1.6,
        marginBottom: '24px',
    },
    meta: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        fontSize: '0.75rem',
        color: '#9ca3af',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: '24px',
        flexWrap: 'wrap',
    },
    dot: {
        color: '#d1d5db',
    },
    applicableBox: {
        display: 'inline-block',
        backgroundColor: '#eff6ff',
        border: '2px solid #3765b0',
        borderRadius: '8px',
        padding: '16px 24px',
        marginTop: '16px',
        maxWidth: '600px',
    },
    applicableLabel: {
        fontSize: '0.75rem',
        fontWeight: 700,
        color: '#1e3a5f',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        margin: '0 0 8px 0',
    },
    applicableText: {
        fontSize: '0.9375rem',
        color: '#4b5563',
        lineHeight: 1.6,
        margin: 0,
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        gap: 40,
    },
    imageWrapper: {
        width: '100%',
        borderRadius: 16,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#f3f4f6',
        minHeight: '400px',
    },
    textContent: {
        lineHeight: 1.8,
    },
    overviewBox: {
        backgroundColor: '#f0fdf4',
        border: '2px solid #10b981',
        borderRadius: '12px',
        padding: '32px',
        marginBottom: '40px',
    },
    overviewTitle: {
        fontSize: '1.5rem',
        fontWeight: 600,
        color: '#065f46',
        marginBottom: '16px',
    },
    overviewText: {
        fontSize: '1.0625rem',
        color: '#047857',
        lineHeight: 1.8,
        margin: 0,
    },
    keyChangeBox: {
        backgroundColor: '#fef3c7',
        border: '3px solid #f59e0b',
        borderRadius: '12px',
        padding: '32px',
        marginBottom: '48px',
    },
    keyChangeTitle: {
        fontSize: '1.5rem',
        fontWeight: 600,
        color: '#92400e',
        marginBottom: '20px',
    },
    keyChangeLarge: {
        fontSize: '1.1875rem',
        color: '#78350f',
        lineHeight: 1.7,
        marginBottom: '24px',
        fontWeight: 500,
    },
    sectionTitle: {
        fontSize: '1.875rem',
        fontWeight: 600,
        color: '#1e3a5f',
        marginBottom: '24px',
        marginTop: '48px',
        lineHeight: 1.3,
    },
    subheading: {
        fontSize: '1.125rem',
        fontWeight: 600,
        color: '#92400e',
        marginTop: '24px',
        marginBottom: '12px',
    },
    paragraph: {
        fontSize: '1.0625rem',
        color: '#4b5563',
        marginBottom: '24px',
        lineHeight: 1.8,
    },
    list: {
        marginLeft: '24px',
        marginBottom: '16px',
    },
    listItem: {
        fontSize: '1.0625rem',
        color: '#4b5563',
        marginBottom: '8px',
        lineHeight: 1.7,
    },
    highlightBox: {
        backgroundColor: '#eff6ff',
        border: '2px solid #3765b0',
        borderRadius: '12px',
        padding: '28px',
        marginTop: '24px',
        marginBottom: '32px',
    },
    highlightTitle: {
        fontSize: '1.25rem',
        fontWeight: 600,
        color: '#1e3a5f',
        marginBottom: '16px',
    },
    highlightList: {
        listStyle: 'none',
        padding: 0,
        margin: '0 0 20px 0',
    },
    highlightItem: {
        fontSize: '1rem',
        color: '#4b5563',
        marginBottom: '10px',
        paddingLeft: '24px',
        position: 'relative',
    },
    highlightNote: {
        fontSize: '1rem',
        color: '#1e3a5f',
        lineHeight: 1.7,
        margin: 0,
        paddingTop: '16px',
        borderTop: '1px solid #bfdbfe',
    },
    stepsContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        marginTop: '24px',
        marginBottom: '48px',
    },
    stepBox: {
        display: 'flex',
        gap: '20px',
        backgroundColor: '#f9fafb',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '24px',
    },
    stepNumber: {
        flexShrink: 0,
        width: '40px',
        height: '40px',
        backgroundColor: '#3765b0',
        color: '#ffffff',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.25rem',
        fontWeight: 700,
    },
    stepContent: {
        flex: 1,
    },
    stepTitle: {
        fontSize: '1.125rem',
        fontWeight: 600,
        color: '#1e3a5f',
        marginBottom: '8px',
    },
    stepText: {
        fontSize: '1rem',
        color: '#4b5563',
        lineHeight: 1.7,
        margin: 0,
    },
    timelineContainer: {
        borderLeft: '3px solid #3765b0',
        paddingLeft: '32px',
        marginTop: '24px',
        marginBottom: '48px',
    },
    timelineItem: {
        position: 'relative',
        marginBottom: '32px',
    },
    timelineDate: {
        fontSize: '0.875rem',
        fontWeight: 700,
        color: '#3765b0',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: '8px',
    },
    timelineContent: {
        backgroundColor: '#ffffff',
    },
    timelineTitle: {
        fontSize: '1.125rem',
        fontWeight: 600,
        color: '#1e3a5f',
        marginBottom: '8px',
    },
    timelineText: {
        fontSize: '1rem',
        color: '#4b5563',
        lineHeight: 1.7,
        margin: 0,
    },
    benefitsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
        marginTop: '24px',
        marginBottom: '48px',
    },
    benefitCard: {
        backgroundColor: '#ffffff',
        border: '2px solid #e5e7eb',
        borderRadius: '12px',
        padding: '24px',
        transition: 'all 0.3s ease',
    },
    benefitTitle: {
        fontSize: '1.125rem',
        fontWeight: 600,
        color: '#1e3a5f',
        marginBottom: '12px',
    },
    benefitText: {
        fontSize: '0.9375rem',
        color: '#6b7280',
        lineHeight: 1.7,
        margin: 0,
    },
    impactBox: {
        backgroundColor: '#fef2f2',
        border: '2px solid #ef4444',
        borderRadius: '12px',
        padding: '32px',
        marginTop: '32px',
        marginBottom: '48px',
    },
    impactTitle: {
        fontSize: '1.5rem',
        fontWeight: 600,
        color: '#991b1b',
        marginBottom: '16px',
    },
    impactIntro: {
        fontSize: '1.0625rem',
        color: '#7f1d1d',
        fontWeight: 600,
        marginBottom: '16px',
    },
    impactList: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
    },
    impactItem: {
        fontSize: '1rem',
        color: '#991b1b',
        marginBottom: '10px',
        paddingLeft: '24px',
        position: 'relative',
    },
    conclusionBox: {
        backgroundColor: '#1e3a5f',
        color: '#ffffff',
        borderRadius: '12px',
        padding: '40px',
        marginTop: '48px',
    },
    conclusionTitle: {
        fontSize: '1.5rem',
        fontWeight: 600,
        marginBottom: '16px',
        color: '#ffffff',
    },
    conclusionText: {
        fontSize: '1.0625rem',
        lineHeight: 1.8,
        margin: 0,
    },
};

// Add custom styles for LazyImage
const styleElement = document.createElement('style');
styleElement.textContent = `
    .rbi-hero-image.lazy-image {
        width: 100%;
        height: auto;
        object-fit: cover;
        border-radius: 16px;
        min-height: 400px;
    }
    
    .rbi-hero-image.lazy-image.loading {
        background-color: #f3f4f6;
        filter: blur(8px);
    }
    
    .rbi-hero-image.lazy-image.loaded {
        filter: none;
        animation: fadeInImage 0.5s ease-out;
    }
    
    @keyframes fadeInImage {
        from {
            opacity: 0;
            filter: blur(8px);
        }
        to {
            opacity: 1;
            filter: none;
        }
    }
    
    .rbi-hero-image.lazy-image.loading::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent);
        background-size: 200px 100%;
        animation: shimmer 1.8s infinite;
    }
    
    @keyframes shimmer {
        0% {
            background-position: -200px 0;
        }
        100% {
            background-position: calc(200px + 100%) 0;
        }
    }
    
    .benefitCard:hover {
        border-color: #3765b0;
        box-shadow: 0 4px 12px rgba(55, 101, 176, 0.15);
        transform: translateY(-2px);
    }
    
    .highlightItem::before {
        content: '✓';
        position: absolute;
        left: 0;
        color: #3765b0;
        font-weight: 700;
    }
    
    .impactItem::before {
        content: '▸';
        position: absolute;
        left: 0;
        color: #ef4444;
        font-weight: 700;
    }
    
    .timelineItem::before {
        content: '';
        position: absolute;
        left: -38px;
        top: 0;
        width: 12px;
        height: 12px;
        background-color: #3765b0;
        border-radius: 50%;
        border: 3px solid #ffffff;
    }
`;

if (!document.head.querySelector('style[data-rbi-styles]')) {
    styleElement.setAttribute('data-rbi-styles', 'true');
    document.head.appendChild(styleElement);
}
