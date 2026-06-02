import React from 'react';
import { imageUrl } from '../utils/imageUrl';
import LazyImage from '../components/common/LazyImage';

export default function SEBIDraftCircular() {
    
    return (
        <section style={styles.section}>
            <div style={styles.container}>
                {/* Hero Header */}
                <div style={styles.hero}>
                    <span style={styles.category}>REGULATORY UPDATE</span>
                    <h1 style={styles.title}>SEBI Draft Proposal</h1>
                    <p style={styles.subtitle}>
                        Enabling Third-Party Payments in Mutual Funds
                    </p>
                    <div style={styles.meta}>
                        <span>DRAFT CIRCULAR</span>
                        <span style={styles.dot}>•</span>
                        <span>20 May 2026</span>
                    </div>
                    <div style={styles.deadlineBox}>
                        <p style={styles.deadlineLabel}>Public Comment Deadline</p>
                        <p style={styles.deadlineDate}>10 June 2026</p>
                    </div>
                </div>

                {/* Main Content */}
                <article style={styles.content}>
                    <div style={styles.imageWrapper}>
                        <LazyImage
                            src={imageUrl('reserve-bank-of-india-rbi-.jpg')}
                            alt="SEBI Draft Circular - Mutual Funds Third-Party Payments"
                            className="sebi-hero-image"
                            threshold={0.1}
                        />
                    </div>

                    <div style={styles.textContent}>
                        {/* Overview */}
                        <div style={styles.overviewBox}>
                            <h2 style={styles.overviewTitle}>Overview</h2>
                            <p style={styles.overviewText}>
                                The Securities and Exchange Board of India (SEBI) has released a draft circular proposing 
                                the introduction of third-party payments in mutual funds under specific and controlled 
                                circumstances. The proposal aims to improve operational flexibility while maintaining strong 
                                investor protection and anti-money laundering safeguards.
                            </p>
                        </div>

                        {/* Timeline */}
                        <div style={styles.timelineBox}>
                            <h3 style={styles.timelineTitle}>Key Dates</h3>
                            <div style={styles.timelineGrid}>
                                <div style={styles.timelineItem}>
                                    <span style={styles.timelineLabel}>Draft Circular Issued</span>
                                    <span style={styles.timelineValue}>20 May 2026</span>
                                </div>
                                <div style={styles.timelineItem}>
                                    <span style={styles.timelineLabel}>Public Comment Deadline</span>
                                    <span style={styles.timelineValue}>10 June 2026</span>
                                </div>
                                <div style={styles.timelineItem}>
                                    <span style={styles.timelineLabel}>Implementation Timeline</span>
                                    <span style={styles.timelineValue}>Within 30 days of final circular</span>
                                </div>
                            </div>
                        </div>

                        {/* What is Proposed */}
                        <h2 style={styles.sectionTitle}>What is Proposed?</h2>
                        <p style={styles.paragraph}>
                            Currently, mutual fund investments generally require payments to originate directly from the 
                            investor's own bank account. SEBI's draft proposal introduces three exceptions where third-party 
                            payments may be permitted.
                        </p>

                        {/* Exception 1 */}
                        <div style={styles.exceptionBox}>
                            <div style={styles.exceptionNumber}>1</div>
                            <div style={styles.exceptionContent}>
                                <h3 style={styles.exceptionTitle}>Employer Payroll Deduction Investments</h3>
                                <p style={styles.paragraph}>
                                    Employers may invest in mutual fund units on behalf of employees through salary 
                                    deduction programs.
                                </p>
                                <h4 style={styles.subheading}>Key Features:</h4>
                                <ul style={styles.list}>
                                    <li style={styles.listItem}>
                                        Applicable to listed companies and EPFO-registered organizations
                                    </li>
                                    <li style={styles.listItem}>
                                        Employee participation remains voluntary
                                    </li>
                                    <li style={styles.listItem}>
                                        Employees can choose their preferred mutual fund scheme
                                    </li>
                                    <li style={styles.listItem}>
                                        Consolidated employer payments may be accepted by Asset Management Companies (AMCs)
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Exception 2 */}
                        <div style={styles.exceptionBox}>
                            <div style={styles.exceptionNumber}>2</div>
                            <div style={styles.exceptionContent}>
                                <h3 style={styles.exceptionTitle}>Mutual Fund Distributor Commission in Units</h3>
                                <p style={styles.paragraph}>
                                    Asset Management Companies may provide trail commissions to AMFI-registered Mutual Fund 
                                    Distributors (MFDs) in the form of mutual fund units instead of cash payments.
                                </p>
                                <h4 style={styles.subheading}>Benefits:</h4>
                                <ul style={styles.list}>
                                    <li style={styles.listItem}>
                                        Aligns distributor interests with investor outcomes
                                    </li>
                                    <li style={styles.listItem}>
                                        Encourages long-term participation in mutual funds
                                    </li>
                                    <li style={styles.listItem}>
                                        Supports wealth creation through unit-based compensation
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Exception 3 */}
                        <div style={styles.exceptionBox}>
                            <div style={styles.exceptionNumber}>3</div>
                            <div style={styles.exceptionContent}>
                                <h3 style={styles.exceptionTitle}>Social Cause Donations</h3>
                                <p style={styles.paragraph}>
                                    Investors may choose to donate a portion of their dividends or redemption proceeds to 
                                    eligible non-profit organizations.
                                </p>
                                <h4 style={styles.subheading}>Eligibility:</h4>
                                <ul style={styles.list}>
                                    <li style={styles.listItem}>
                                        Donations routed through approved mechanisms
                                    </li>
                                    <li style={styles.listItem}>
                                        Applicable to SSE-registered non-profit organizations
                                    </li>
                                    <li style={styles.listItem}>
                                        Enhanced transparency and reporting requirements
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Investor Protection */}
                        <h2 style={styles.sectionTitle}>Investor Protection & Compliance Framework</h2>
                        <p style={styles.paragraph}>
                            To ensure transparency and prevent misuse, SEBI has proposed strict compliance requirements.
                        </p>

                        <div style={styles.complianceBox}>
                            <h3 style={styles.complianceTitle}>Mandatory Safeguards</h3>
                            
                            <div style={styles.safeguardItem}>
                                <h4 style={styles.safeguardTitle}>Robust KYC Verification</h4>
                                <p style={styles.safeguardText}>
                                    Full Know Your Customer (KYC) verification for both the payer and beneficiary.
                                </p>
                            </div>

                            <div style={styles.safeguardItem}>
                                <h4 style={styles.safeguardTitle}>Written Consent</h4>
                                <p style={styles.safeguardText}>
                                    Explicit investor authorization is required before any third-party transaction can be processed.
                                </p>
                            </div>

                            <div style={styles.safeguardItem}>
                                <h4 style={styles.safeguardTitle}>Relationship Validation</h4>
                                <p style={styles.safeguardText}>
                                    AMCs must verify the relationship between the payer and beneficiary.
                                </p>
                            </div>

                            <div style={styles.safeguardItem}>
                                <h4 style={styles.safeguardTitle}>Complete Audit Trail</h4>
                                <p style={styles.safeguardText}>
                                    All transactions must be electronically tracked through segregated accounts with regular reconciliation.
                                </p>
                            </div>

                            <div style={styles.safeguardItem}>
                                <h4 style={styles.safeguardTitle}>Periodic Reporting</h4>
                                <p style={styles.safeguardText}>
                                    Additional reporting and disclosure obligations apply, particularly for social impact donations.
                                </p>
                            </div>

                            <div style={styles.safeguardItem}>
                                <h4 style={styles.safeguardTitle}>PMLA Compliance</h4>
                                <p style={styles.safeguardText}>
                                    All transactions must comply with the Prevention of Money Laundering Act (PMLA), 2002.
                                </p>
                            </div>
                        </div>

                        {/* Eligibility Summary */}
                        <h2 style={styles.sectionTitle}>Eligibility Summary</h2>
                        
                        <div style={styles.eligibilityGrid}>
                            <div style={styles.eligibilityCard}>
                                <h3 style={styles.eligibilityCardTitle}>Employer Payroll Investments</h3>
                                <ul style={styles.eligibilityList}>
                                    <li style={styles.eligibilityItem}>Listed companies</li>
                                    <li style={styles.eligibilityItem}>EPFO-registered companies</li>
                                    <li style={styles.eligibilityItem}>AMC employee investment programs</li>
                                    <li style={styles.eligibilityItem}>Voluntary employee participation</li>
                                </ul>
                            </div>

                            <div style={styles.eligibilityCard}>
                                <h3 style={styles.eligibilityCardTitle}>Commission in Mutual Fund Units</h3>
                                <ul style={styles.eligibilityList}>
                                    <li style={styles.eligibilityItem}>AMFI-registered distributors</li>
                                    <li style={styles.eligibilityItem}>Active distribution of AMC schemes</li>
                                    <li style={styles.eligibilityItem}>Direct allotment of units to distributors</li>
                                </ul>
                            </div>
                        </div>

                        {/* Conclusion */}
                        <div style={styles.conclusionBox}>
                            <h2 style={styles.conclusionTitle}>Conclusion</h2>
                            <p style={styles.conclusionText}>
                                SEBI's proposal represents a significant shift in the mutual fund ecosystem by allowing 
                                carefully regulated third-party payment mechanisms. The framework seeks to balance operational 
                                convenience with investor protection through strict KYC, audit, and compliance requirements.
                            </p>
                        </div>

                        {/* Call to Action */}
                        <div style={styles.ctaBox}>
                            <h3 style={styles.ctaTitle}>Stay Informed</h3>
                            <p style={styles.ctaText}>
                                This is a draft proposal open for public consultation. Final regulations may differ based 
                                on stakeholder feedback and SEBI's review process.
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
        fontSize: '0.875rem',
        color: '#9ca3af',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: '24px',
    },
    dot: {
        color: '#d1d5db',
    },
    deadlineBox: {
        display: 'inline-block',
        backgroundColor: '#fef3c7',
        border: '2px solid #f59e0b',
        borderRadius: '8px',
        padding: '16px 24px',
        marginTop: '16px',
    },
    deadlineLabel: {
        fontSize: '0.75rem',
        fontWeight: 700,
        color: '#92400e',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        margin: '0 0 4px 0',
    },
    deadlineDate: {
        fontSize: '1.125rem',
        fontWeight: 700,
        color: '#78350f',
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
    image: {
        width: '100%',
        height: 'auto',
        objectFit: 'cover',
        borderRadius: 16,
    },
    textContent: {
        lineHeight: 1.8,
    },
    overviewBox: {
        backgroundColor: '#eff6ff',
        border: '2px solid #3765b0',
        borderRadius: '12px',
        padding: '32px',
        marginBottom: '40px',
    },
    overviewTitle: {
        fontSize: '1.5rem',
        fontWeight: 600,
        color: '#1e3a5f',
        marginBottom: '16px',
    },
    overviewText: {
        fontSize: '1.0625rem',
        color: '#4b5563',
        lineHeight: 1.8,
        margin: 0,
    },
    timelineBox: {
        backgroundColor: '#f9fafb',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '32px',
        marginBottom: '48px',
    },
    timelineTitle: {
        fontSize: '1.25rem',
        fontWeight: 600,
        color: '#1e3a5f',
        marginBottom: '24px',
    },
    timelineGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '24px',
    },
    timelineItem: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    timelineLabel: {
        fontSize: '0.875rem',
        fontWeight: 600,
        color: '#6b7280',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
    },
    timelineValue: {
        fontSize: '1rem',
        fontWeight: 600,
        color: '#1e3a5f',
    },
    sectionTitle: {
        fontSize: '1.875rem',
        fontWeight: 600,
        color: '#1e3a5f',
        marginBottom: '24px',
        marginTop: '48px',
        lineHeight: 1.3,
    },
    paragraph: {
        fontSize: '1.0625rem',
        color: '#4b5563',
        marginBottom: '24px',
        lineHeight: 1.8,
    },
    exceptionBox: {
        display: 'flex',
        gap: '24px',
        backgroundColor: '#f9fafb',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '32px',
        marginBottom: '24px',
    },
    exceptionNumber: {
        flexShrink: 0,
        width: '48px',
        height: '48px',
        backgroundColor: '#3765b0',
        color: '#ffffff',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',
        fontWeight: 700,
    },
    exceptionContent: {
        flex: 1,
    },
    exceptionTitle: {
        fontSize: '1.375rem',
        fontWeight: 600,
        color: '#1e3a5f',
        marginBottom: '16px',
    },
    subheading: {
        fontSize: '1.125rem',
        fontWeight: 600,
        color: '#1e3a5f',
        marginTop: '24px',
        marginBottom: '12px',
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
    complianceBox: {
        backgroundColor: '#f0fdf4',
        border: '2px solid #10b981',
        borderRadius: '12px',
        padding: '32px',
        marginTop: '32px',
        marginBottom: '48px',
    },
    complianceTitle: {
        fontSize: '1.375rem',
        fontWeight: 600,
        color: '#065f46',
        marginBottom: '24px',
    },
    safeguardItem: {
        marginBottom: '20px',
        paddingBottom: '20px',
        borderBottom: '1px solid #d1fae5',
    },
    safeguardTitle: {
        fontSize: '1.0625rem',
        fontWeight: 600,
        color: '#047857',
        marginBottom: '8px',
    },
    safeguardText: {
        fontSize: '1rem',
        color: '#065f46',
        lineHeight: 1.7,
        margin: 0,
    },
    eligibilityGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px',
        marginTop: '24px',
        marginBottom: '48px',
    },
    eligibilityCard: {
        backgroundColor: '#ffffff',
        border: '2px solid #3765b0',
        borderRadius: '12px',
        padding: '24px',
    },
    eligibilityCardTitle: {
        fontSize: '1.125rem',
        fontWeight: 600,
        color: '#1e3a5f',
        marginBottom: '16px',
    },
    eligibilityList: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
    },
    eligibilityItem: {
        fontSize: '0.9375rem',
        color: '#4b5563',
        marginBottom: '8px',
        paddingLeft: '20px',
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
    ctaBox: {
        backgroundColor: '#fef3c7',
        border: '2px solid #f59e0b',
        borderRadius: '12px',
        padding: '32px',
        marginTop: '32px',
        textAlign: 'center',
    },
    ctaTitle: {
        fontSize: '1.25rem',
        fontWeight: 700,
        color: '#92400e',
        marginBottom: '12px',
    },
    ctaText: {
        fontSize: '1rem',
        color: '#78350f',
        lineHeight: 1.7,
        margin: 0,
    },
};

// Add custom styles for LazyImage in this context
const styleElement = document.createElement('style');
styleElement.textContent = `
    .sebi-hero-image.lazy-image {
        width: 100%;
        height: auto;
        object-fit: cover;
        border-radius: 16px;
        min-height: 400px;
    }
    
    .sebi-hero-image.lazy-image.loading {
        background-color: #f3f4f6;
        filter: blur(8px);
    }
    
    .sebi-hero-image.lazy-image.loaded {
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
`;

if (!document.head.querySelector('style[data-sebi-styles]')) {
    styleElement.setAttribute('data-sebi-styles', 'true');
    document.head.appendChild(styleElement);
}
