import React, { useState } from 'react';
import { imageUrl } from '../utils/imageUrl';

export default function DataGovernanceRule6() {
    const [imageLoaded, setImageLoaded] = useState(false);
    return (
        <section style={styles.section}>
            <div style={styles.container}>
                {/* Hero Header */}
                <div style={styles.hero}>
                    <span style={styles.category}>RESOURCES</span>
                    <h1 style={styles.title}>The Rule 6 Maze</h1>
                    <p style={styles.subtitle}>
                        A Boardroom Perspective on Data Governance in India
                    </p>
                    <div style={styles.meta}>
                        <span>RESOURCES</span>
                        <span style={styles.dot}>•</span>
                        <span>April 27, 2026</span>
                    </div>
                </div>

                {/* Main Content */}
                <article style={styles.content}>
                    <div style={styles.imageWrapper}>
                        {!imageLoaded && (
                            <div style={styles.imagePlaceholder}>
                                <div style={styles.spinner} />
                            </div>
                        )}
                        <img
                            src={imageUrl('Data-Governance.png')}
                            alt="Data Governance Rule 6"
                            loading="lazy"
                            style={{
                                ...styles.image,
                                display: imageLoaded ? 'block' : 'none'
                            }}
                            onLoad={() => setImageLoaded(true)}
                        />
                    </div>

                    <div style={styles.textContent}>
                        <h2 style={styles.sectionTitle}>Understanding the DPDP Framework</h2>
                        <p style={styles.paragraph}>
                            This strategic briefing examines the evolving role of data governance under the Digital 
                            Personal Data Protection (DPDP) framework, with a focused lens on Rule 6 and its implications 
                            for CEOs, Boards, and senior leadership.
                        </p>

                        <h3 style={styles.subheading}>The Paradigm Shift</h3>
                        <p style={styles.paragraph}>
                            The DPDP Act marks a fundamental shift from treating data privacy as a compliance function 
                            to positioning it as a critical element of governance, accountability, and institutional trust. 
                            Rule 6, in particular, establishes stringent requirements for data fiduciaries.
                        </p>

                        <h3 style={styles.subheading}>Key Provisions of Rule 6</h3>
                        <ul style={styles.list}>
                            <li style={styles.listItem}>
                                <strong>Data Principal Rights:</strong> Enhanced mechanisms for consent management and data access
                            </li>
                            <li style={styles.listItem}>
                                <strong>Accountability Framework:</strong> Clear designation of Data Protection Officers
                            </li>
                            <li style={styles.listItem}>
                                <strong>Technical Safeguards:</strong> Mandatory security measures and breach notification protocols
                            </li>
                            <li style={styles.listItem}>
                                <strong>Cross-border Transfers:</strong> Regulated data flow mechanisms with adequate safeguards
                            </li>
                        </ul>

                        <div style={styles.callout}>
                            <h4 style={styles.calloutTitle}>Board-Level Implications</h4>
                            <p style={styles.calloutText}>
                                Boards must now oversee data governance as a strategic priority, ensuring adequate 
                                resources, expertise, and oversight mechanisms are in place. This includes regular 
                                audits, risk assessments, and incident response planning.
                            </p>
                        </div>

                        <h3 style={styles.subheading}>Implementation Roadmap</h3>
                        <p style={styles.paragraph}>
                            Organizations should adopt a phased approach to Rule 6 compliance:
                        </p>
                        <ol style={styles.list}>
                            <li style={styles.listItem}>
                                <strong>Assessment Phase:</strong> Conduct comprehensive data mapping and gap analysis
                            </li>
                            <li style={styles.listItem}>
                                <strong>Design Phase:</strong> Develop policies, procedures, and technical controls
                            </li>
                            <li style={styles.listItem}>
                                <strong>Implementation Phase:</strong> Deploy solutions and train personnel
                            </li>
                            <li style={styles.listItem}>
                                <strong>Monitoring Phase:</strong> Establish ongoing compliance and improvement mechanisms
                            </li>
                        </ol>

                        <h3 style={styles.subheading}>Strategic Considerations</h3>
                        <p style={styles.paragraph}>
                            Beyond compliance, forward-thinking organizations are leveraging data governance as a 
                            competitive advantage. Strong data protection practices build customer trust, enhance 
                            brand reputation, and create operational efficiencies through better data management.
                        </p>

                        <p style={styles.paragraph}>
                            As India's digital economy continues to expand, the organizations that master the Rule 6 
                            maze will be best positioned to capitalize on data-driven opportunities while maintaining 
                            stakeholder confidence and regulatory compliance.
                        </p>
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
        fontSize: '0.75rem',
        fontWeight: 700,
        letterSpacing: '0.15em',
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
    },
    dot: {
        color: '#d1d5db',
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
    },
    imagePlaceholder: {
        width: '100%',
        height: 400,
        backgroundColor: '#f3f4f6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: '100%',
        height: 'auto',
        objectFit: 'cover',
        borderRadius: 16,
    },
    spinner: {
        width: 48,
        height: 48,
        border: '4px solid #e5e7eb',
        borderTop: '4px solid #3765b0',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
    },
    textContent: {
        lineHeight: 1.8,
    },
    sectionTitle: {
        fontSize: '1.875rem',
        fontWeight: 600,
        color: '#1e3a5f',
        marginBottom: 24,
        lineHeight: 1.3,
    },
    subheading: {
        fontSize: '1.5rem',
        fontWeight: 600,
        color: '#1e3a5f',
        marginTop: 40,
        marginBottom: 16,
        lineHeight: 1.3,
    },
    paragraph: {
        fontSize: '1.0625rem',
        color: '#4b5563',
        marginBottom: 24,
        lineHeight: 1.8,
    },
    list: {
        marginLeft: 24,
        marginBottom: 24,
    },
    listItem: {
        fontSize: '1.0625rem',
        color: '#4b5563',
        marginBottom: 12,
        lineHeight: 1.8,
    },
    callout: {
        backgroundColor: '#eff6ff',
        border: '2px solid #3765b0',
        borderRadius: 12,
        padding: 32,
        marginTop: 40,
        marginBottom: 40,
    },
    calloutTitle: {
        fontSize: '1.25rem',
        fontWeight: 700,
        color: '#1e3a5f',
        marginBottom: 12,
    },
    calloutText: {
        fontSize: '1.0625rem',
        color: '#4b5563',
        lineHeight: 1.8,
        margin: 0,
    },
};

// Add keyframe animation for spinner
const styleSheet = document.styleSheets[0];
const keyframes = `
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
`;
try {
    styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
} catch (e) {
    // Animation already exists
}

