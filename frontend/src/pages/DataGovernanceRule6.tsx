import React from 'react';
import { imageUrl } from '../utils/imageUrl';
import LazyImage from '../components/common/LazyImage';

export default function DataGovernanceRule6() {
    return (
        <section style={styles.section}>
            <div style={styles.container}>
                {/* Hero Header */}
                <div style={styles.hero}>
                    <span style={styles.category}>STRATEGIC LEADERSHIP BRIEFING</span>
                    <h1 style={styles.title}>The Rule 6 Maze</h1>
                    <p style={styles.subtitle}>
                        A Boardroom Perspective on Data Governance in India
                    </p>
                    <div style={styles.meta}>
                        <span>DATA GOVERNANCE</span>
                        <span style={styles.dot}>•</span>
                        <span>2026</span>
                    </div>
                    <div style={styles.authorBox}>
                        <p style={styles.authorLabel}>AUTHOR</p>
                        <p style={styles.authorName}>Huzeifa Unwala</p>
                        <p style={styles.authorTitle}>Founder & Senior Partner | JHS</p>
                    </div>
                </div>

                {/* Main Content */}
                <article style={styles.content}>
                    <div style={styles.imageWrapper}>
                        <LazyImage
                            src={imageUrl('BOARDROOMS-IN-TRANSITION-.png.webp')}
                            alt="Data Governance Rule 6"
                            className="data-governance-image"
                            threshold={0.1}
                        />
                    </div>

                    <div style={styles.textContent}>
                        {/* Introduction Banner */}
                        <div style={styles.introBanner}>
                            <h2 style={styles.introBannerText}>DATA PRIVACY IS NOW A BOARDROOM IMPERATIVE</h2>
                        </div>

                        {/* Table of Contents */}
                        <div style={styles.tocBox}>
                            <h3 style={styles.tocTitle}>TABLE OF CONTENTS</h3>
                            <ul style={styles.tocList}>
                                <li style={styles.tocItem}><strong>01</strong> · Foreword: The shift from operational footnote to boardroom mandate</li>
                                <li style={styles.tocItem}><strong>02</strong> · From Compliance to Credibility: 72-hour breach windows</li>
                                <li style={styles.tocItem}><strong>03</strong> · A Fiduciary Obligation — Not a Technical One</li>
                                <li style={styles.tocItem}><strong>04</strong> · Trust Is Built at the Point of Consent</li>
                                <li style={styles.tocItem}><strong>05</strong> · Governance Is Tested in Moments of Truth</li>
                                <li style={styles.tocItem}><strong>06</strong> · For Significant Data Fiduciaries — A Strategic Conversation</li>
                                <li style={styles.tocItem}><strong>07</strong> · Act Now — The Window Is Closing</li>
                                <li style={styles.tocItem}><strong>08</strong> · The Leadership Imperative</li>
                            </ul>
                        </div>

                        {/* Section 01 */}
                        <div style={styles.section01}>
                            <h2 style={styles.sectionNumber}>01 · FOREWORD</h2>
                            <h3 style={styles.sectionTitle}>The Rule 6 Maze</h3>
                            <p style={styles.paragraph}>
                                For too long, data privacy was treated as an operational footnote—a line item in SOPs and 
                                compliance checklists, buried within legal and IT departments and reviewed by Boards only 
                                as a quarterly formality.
                            </p>
                            <p style={styles.paragraphBold}>That era is over.</p>
                            <p style={styles.paragraph}>
                                With the notification of the DPDP Act (2023) and the subsequent DPDP Rules (2025), compliance 
                                is no longer optional. Rule 6 now stands as the 'elephant in the boardroom,' explicitly requiring 
                                Data Fiduciaries to implement 'reasonable security safeguards.' This mandate extends beyond 
                                internal operations to include any processing conducted by third-party Data Processors, making 
                                the Fiduciary legally accountable for preventing breaches across the entire data lifecycle.
                            </p>
                            <div style={styles.highlightBox}>
                                <p style={styles.highlightText}>
                                    Rule 6 fundamentally reframes the privacy landscape in India. Privacy is no longer a mere 
                                    compliance exercise; it is a definitive test of leadership character, governance discipline, 
                                    and institutional trust.
                                </p>
                            </div>
                        </div>

                        {/* Section 02 */}
                        <div style={styles.sectionBlock}>
                            <h2 style={styles.sectionNumber}>02 · THE SHIFT</h2>
                            <h3 style={styles.sectionTitle}>From Compliance to Credibility</h3>
                            <p style={styles.paragraph}>
                                With breach reporting windows now measured in 72 hours, the margin for error has vanished. 
                                Boards don't have the luxury of setting up fact-finding committees or seeking extended legal 
                                opinions—they must act fast and decisively.
                            </p>
                            <p style={styles.paragraph}>
                                While a Board's good intent can be declared in annual reports and policies, demonstrable 
                                assurance must be earned through certification and proven by audit evidence. Privacy can no 
                                longer remain siloed; it must be embedded into the very fabric of enterprise governance and 
                                championed from the top.
                            </p>
                        </div>

                        {/* Section 03 */}
                        <div style={styles.sectionBlock}>
                            <h2 style={styles.sectionNumber}>03 · FIDUCIARY OBLIGATION</h2>
                            <h3 style={styles.sectionTitle}>A Fiduciary Obligation — Not a Technical One</h3>
                            <p style={styles.paragraph}>
                                The DPDP framework designates organizations as Data Fiduciaries — entities legally accountable 
                                for the why and how of data processing. Crucially, this accountability cannot be delegated. 
                                You can outsource the processing of data, but you cannot outsource the responsibility.
                            </p>
                            <p style={styles.paragraph}>
                                Forward-thinking Boards must begin asking sharper, more uncomfortable questions:
                            </p>
                            <ul style={styles.list}>
                                <li style={styles.listItem}>
                                    <strong>Ownership:</strong> Who truly owns data decisions, and are they empowered to act?
                                </li>
                                <li style={styles.listItem}>
                                    <strong>Accountability:</strong> Are privacy risks part of our core Enterprise Risk Management 
                                    (ERM), or relegated to a separate, ignored register?
                                </li>
                                <li style={styles.listItem}>
                                    <strong>Inventory:</strong> Do we know exactly what personal data we hold, why we have it, 
                                    and—critically—when it must be deleted?
                                </li>
                                <li style={styles.listItem}>
                                    <strong>Resilience:</strong> Are our controls designed for failure, or do they only work 
                                    when things are going right?
                                </li>
                            </ul>
                            <div style={styles.warningBox}>
                                <p style={styles.warningText}>
                                    Under the new Rules, privacy failure is recognized for what it is: a failure of governance 
                                    and a breach of trust. In case of repeated failures and penalties, the Data Protection Board 
                                    of India can write to the Central Government to block the Data Fiduciary's right to access 
                                    computer resources in the public interest.
                                </p>
                            </div>
                        </div>

                        {/* Section 04 */}
                        <div style={styles.sectionBlock}>
                            <h2 style={styles.sectionNumber}>04 · CONSENT & TRUST</h2>
                            <h3 style={styles.sectionTitle}>Trust Is Built at the Point of Consent</h3>
                            <p style={styles.paragraph}>
                                The centrepiece of the DPDP regulations is the right of an individual to uphold privacy and 
                                exercise consent. The Rules insist that personal data can be processed only upon obtaining 
                                free, informed, and specific consent, and that consent notices are intelligible, specific, 
                                and actionable—not buried in legalese.
                            </p>
                            <div style={styles.callout}>
                                <p style={styles.calloutText}>
                                    Every consent interaction is a trust transaction. Customers, vendors, and employees share 
                                    their data based on an expectation of fairness. Once that expectation is shattered, no 
                                    regulatory penalty can fully restore the lost reputation.
                                </p>
                            </div>
                            <p style={styles.paragraph}>
                                The introduction of registered Consent Managers professionalizes this process, making 
                                traceability a core assurance standard. Trust has officially become an auditable outcome.
                            </p>
                        </div>

                        {/* Section 05 */}
                        <div style={styles.sectionBlock}>
                            <h2 style={styles.sectionNumber}>05 · GOVERNANCE IN ACTION</h2>
                            <h3 style={styles.sectionTitle}>Governance Is Tested in Moments of Truth</h3>
                            <p style={styles.paragraph}>
                                Policies are necessary, but real governance is revealed when individuals exercise their 
                                rights — seeking access, correction, erasure, or redressal. These interactions happen far 
                                from the boardroom, yet they are precisely where an organization's privacy culture becomes visible.
                            </p>
                            <p style={styles.paragraph}>
                                People tasked with governance responsibilities should develop key policy safeguards for:
                            </p>
                            <ul style={styles.list}>
                                <li style={styles.listItem}>Timelines for intimations of personal data breaches</li>
                                <li style={styles.listItem}>Violation of data principal rights</li>
                                <li style={styles.listItem}>SOPs and resilience routines around the Rule 6 Criteria</li>
                            </ul>
                        </div>

                        {/* Section 06 */}
                        <div style={styles.sectionBlock}>
                            <h2 style={styles.sectionNumber}>06 · SIGNIFICANT DATA FIDUCIARIES</h2>
                            <h3 style={styles.sectionTitle}>For Significant Data Fiduciaries: A Strategic Conversation</h3>
                            <p style={styles.paragraph}>
                                Organizations designated as Significant Data Fiduciaries (SDFs) face a higher standard. 
                                Given their scale and societal impact, privacy assurance must sit alongside internal audit 
                                and ethics oversight at the Board level.
                            </p>
                            <p style={styles.paragraph}>
                                Designation as an SDF is not merely an administrative burden; it is a recognition of an 
                                organization's systemic influence within the digital economy. To uphold this trust, an SDF 
                                must move beyond basic compliance and institutionalize a robust governance framework. This involves:
                            </p>
                            <ul style={styles.list}>
                                <li style={styles.listItem}>
                                    <strong>Data Protection Impact Assessments (DPIA):</strong> Mandatory, periodic, and fully 
                                    documented assessments.
                                </li>
                                <li style={styles.listItem}>
                                    <strong>Independent Data Auditor:</strong> Appointed for periodic assurance and direct 
                                    Board-level reporting.
                                </li>
                                <li style={styles.listItem}>
                                    <strong>Charter of Rights for Data Principals:</strong> Clear, actionable, and accessible 
                                    to all relevant stakeholders.
                                </li>
                            </ul>
                            <p style={styles.paragraph}>
                                These measures transition the Organisation from passive data handling to active digital guardianship.
                            </p>
                        </div>

                        {/* Section 07 */}
                        <div style={styles.sectionBlock}>
                            <h2 style={styles.sectionNumber}>07 · CALL TO ACTION</h2>
                            <h3 style={styles.sectionTitle}>Act Now: The Window Is Closing</h3>
                            <p style={styles.paragraph}>
                                Phased timelines offer a runway, not a reprieve. Establishing true privacy assurance takes 
                                sustained effort: mapping complex data flows, redesigning legacy processes, upgrading systems, 
                                and retraining the workforce.
                            </p>
                        </div>

                        {/* Section 08 */}
                        <div style={styles.sectionBlock}>
                            <h2 style={styles.sectionNumber}>08 · LEADERSHIP IMPERATIVE</h2>
                            <h3 style={styles.sectionTitle}>The Leadership Imperative</h3>
                            <p style={styles.paragraph}>
                                In a data-driven economy, organizations will be judged less by how much data they accumulate 
                                and more by how responsibly they govern it.
                            </p>
                            <div style={styles.conclusionBox}>
                                <p style={styles.conclusionText}>
                                    Data privacy is no longer about staying on the right side of the law. It is about earning — 
                                    and continuously deserving — the trust of those whose data you hold. For Boards and CEOs, 
                                    this is not a technicality. It is a leadership responsibility, and it belongs at the very 
                                    top of the agenda.
                                </p>
                            </div>
                        </div>

                        {/* Author Bio */}
                        <div style={styles.authorBio}>
                            <p style={styles.bioText}>
                                <strong>Huzeifa Unwala</strong> is a senior professional leader deeply engaged with India's 
                                evolving data governance landscape.
                            </p>
                            <p style={styles.bioTitle}>Founder & Senior Partner | JHS</p>
                        </div>

                        {/* Disclaimer */}
                        <div style={styles.disclaimer}>
                            <h4 style={styles.disclaimerTitle}>09 · DISCLAIMER</h4>
                            <p style={styles.disclaimerText}>
                                This briefing is intended for senior leadership distribution only and is strictly private 
                                and confidential. The content represents professional insights and strategic perspectives 
                                on India's data protection landscape and should not be construed as legal advice. 
                                Organizations should consult with qualified legal and compliance professionals for 
                                specific guidance on DPDP Act implementation.
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
        marginBottom: 60,
        paddingBottom: 40,
        borderBottom: '1px solid #e5e7eb',
    },
    category: {
        display: 'inline-block',
        fontSize: '0.7rem',
        fontWeight: 700,
        letterSpacing: '0.2em',
        color: '#D62049',
        textTransform: 'uppercase',
        marginBottom: 16,
    },
    title: {
        fontSize: 'clamp(2rem, 5vw, 3rem)',
        fontWeight: 600,
        color: '#1e3a5f',
        lineHeight: 1.2,
        marginBottom: 16,
    },
    subtitle: {
        fontSize: '1.25rem',
        color: '#6b7280',
        lineHeight: 1.6,
        marginBottom: 24,
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
        marginBottom: 24,
    },
    dot: {
        color: '#d1d5db',
    },
    authorBox: {
        marginTop: 24,
        padding: '20px',
        backgroundColor: '#f9fafb',
        borderRadius: 8,
        borderLeft: '4px solid #3765b0',
    },
    authorLabel: {
        fontSize: '0.75rem',
        fontWeight: 700,
        letterSpacing: '0.1em',
        color: '#6b7280',
        textTransform: 'uppercase',
        margin: '0 0 8px 0',
    },
    authorName: {
        fontSize: '1.125rem',
        fontWeight: 600,
        color: '#1e3a5f',
        margin: '0 0 4px 0',
    },
    authorTitle: {
        fontSize: '0.875rem',
        color: '#6b7280',
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
    introBanner: {
        backgroundColor: '#1e3a5f',
        color: '#ffffff',
        padding: '24px 32px',
        borderRadius: 8,
        marginBottom: 40,
        textAlign: 'center',
    },
    introBannerText: {
        fontSize: '1.25rem',
        fontWeight: 700,
        letterSpacing: '0.05em',
        margin: 0,
    },
    tocBox: {
        backgroundColor: '#f9fafb',
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        padding: '32px',
        marginBottom: 48,
    },
    tocTitle: {
        fontSize: '1.125rem',
        fontWeight: 700,
        color: '#1e3a5f',
        marginBottom: '20px',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
    },
    tocList: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
    },
    tocItem: {
        fontSize: '0.9375rem',
        color: '#4b5563',
        marginBottom: '12px',
        paddingLeft: 0,
        lineHeight: 1.6,
    },
    section01: {
        marginBottom: '48px',
    },
    sectionBlock: {
        marginBottom: '48px',
        paddingTop: '24px',
        borderTop: '1px solid #e5e7eb',
    },
    sectionNumber: {
        fontSize: '0.875rem',
        fontWeight: 700,
        color: '#D62049',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        marginBottom: '12px',
    },
    sectionTitle: {
        fontSize: '1.875rem',
        fontWeight: 600,
        color: '#1e3a5f',
        marginBottom: '24px',
        lineHeight: 1.3,
    },
    subheading: {
        fontSize: '1.5rem',
        fontWeight: 600,
        color: '#1e3a5f',
        marginTop: '40px',
        marginBottom: '16px',
        lineHeight: 1.3,
    },
    paragraph: {
        fontSize: '1.0625rem',
        color: '#4b5563',
        marginBottom: '24px',
        lineHeight: 1.8,
    },
    paragraphBold: {
        fontSize: '1.0625rem',
        color: '#1e3a5f',
        marginBottom: '24px',
        lineHeight: 1.8,
        fontWeight: 700,
    },
    list: {
        marginLeft: '24px',
        marginBottom: '24px',
    },
    listItem: {
        fontSize: '1.0625rem',
        color: '#4b5563',
        marginBottom: '12px',
        lineHeight: 1.8,
    },
    highlightBox: {
        backgroundColor: '#eff6ff',
        border: '2px solid #3765b0',
        borderRadius: 12,
        padding: '32px',
        marginTop: '32px',
        marginBottom: '32px',
    },
    highlightText: {
        fontSize: '1.125rem',
        color: '#1e3a5f',
        lineHeight: 1.7,
        margin: 0,
        fontWeight: 500,
    },
    callout: {
        backgroundColor: '#f0fdf4',
        borderLeft: '4px solid #10b981',
        borderRadius: 8,
        padding: '24px',
        marginTop: '24px',
        marginBottom: '24px',
    },
    calloutText: {
        fontSize: '1.0625rem',
        color: '#065f46',
        lineHeight: 1.8,
        margin: 0,
        fontStyle: 'italic',
    },
    warningBox: {
        backgroundColor: '#fef2f2',
        border: '2px solid #ef4444',
        borderRadius: 12,
        padding: '28px',
        marginTop: '32px',
        marginBottom: '32px',
    },
    warningText: {
        fontSize: '1.0625rem',
        color: '#991b1b',
        lineHeight: 1.8,
        margin: 0,
        fontWeight: 500,
    },
    conclusionBox: {
        backgroundColor: '#1e3a5f',
        color: '#ffffff',
        borderRadius: 12,
        padding: '32px',
        marginTop: '32px',
        marginBottom: '32px',
    },
    conclusionText: {
        fontSize: '1.125rem',
        lineHeight: 1.8,
        margin: 0,
        fontWeight: 500,
    },
    authorBio: {
        backgroundColor: '#f9fafb',
        borderRadius: 12,
        padding: '32px',
        marginTop: '48px',
        marginBottom: '32px',
        borderLeft: '4px solid #3765b0',
    },
    bioText: {
        fontSize: '1.0625rem',
        color: '#4b5563',
        lineHeight: 1.8,
        margin: '0 0 12px 0',
    },
    bioTitle: {
        fontSize: '0.9375rem',
        color: '#6b7280',
        fontWeight: 600,
        margin: 0,
    },
    disclaimer: {
        backgroundColor: '#fef3c7',
        border: '1px solid #f59e0b',
        borderRadius: 8,
        padding: '24px',
        marginTop: '48px',
    },
    disclaimerTitle: {
        fontSize: '0.875rem',
        fontWeight: 700,
        color: '#92400e',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        marginBottom: '12px',
    },
    disclaimerText: {
        fontSize: '0.875rem',
        color: '#78350f',
        lineHeight: 1.7,
        margin: 0,
    },
};

// Add custom styles for LazyImage
const styleElement = document.createElement('style');
styleElement.textContent = `
    .data-governance-image.lazy-image {
        width: 100%;
        height: auto;
        object-fit: cover;
        border-radius: 16px;
        min-height: 400px;
    }
    
    .data-governance-image.lazy-image.loading {
        background-color: #f3f4f6;
        filter: blur(8px);
    }
    
    .data-governance-image.lazy-image.loaded {
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

if (!document.head.querySelector('style[data-data-governance-styles]')) {
    styleElement.setAttribute('data-data-governance-styles', 'true');
    document.head.appendChild(styleElement);
}
