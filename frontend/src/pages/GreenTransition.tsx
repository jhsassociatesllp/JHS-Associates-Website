import React, { useState } from 'react';
import { imageUrl } from '../utils/imageUrl';

export default function GreenTransition() {
    const [imageLoaded, setImageLoaded] = useState(false);
    return (
        <section style={styles.section}>
            <div style={styles.container}>
                {/* Hero Header */}
                <div style={styles.hero}>
                    <span style={styles.category}>SUSTAINABILITY</span>
                    <h1 style={styles.title}>The Green Transition</h1>
                    <p style={styles.subtitle}>
                        Turning Climate Risk into Competitive Advantage
                    </p>
                    <div style={styles.meta}>
                        <span>INSIGHT</span>
                        <span style={styles.dot}>•</span>
                        <span>March 30, 2026</span>
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
                            src={imageUrl('Card4.jpeg')}
                            alt="Green Transition and Sustainability"
                            loading="lazy"
                            style={{
                                ...styles.image,
                                display: imageLoaded ? 'block' : 'none'
                            }}
                            onLoad={() => setImageLoaded(true)}
                        />
                    </div>

                    <div style={styles.textContent}>
                        <h2 style={styles.sectionTitle}>Sustainability as Strategy</h2>
                        <p style={styles.paragraph}>
                            Companies that embed sustainability into their core strategy are outperforming peers. 
                            The green transition is no longer just about compliance or corporate social responsibility—it's 
                            about creating lasting stakeholder value and building resilient business models for the future.
                        </p>

                        <h3 style={styles.subheading}>The Business Case for Sustainability</h3>
                        <p style={styles.paragraph}>
                            Research consistently shows that companies with strong ESG performance demonstrate:
                        </p>
                        <ul style={styles.list}>
                            <li style={styles.listItem}>
                                <strong>Better Financial Performance:</strong> Higher returns on equity and lower cost of capital
                            </li>
                            <li style={styles.listItem}>
                                <strong>Enhanced Risk Management:</strong> Greater resilience to climate-related disruptions
                            </li>
                            <li style={styles.listItem}>
                                <strong>Improved Stakeholder Relations:</strong> Stronger brand reputation and customer loyalty
                            </li>
                            <li style={styles.listItem}>
                                <strong>Talent Attraction:</strong> Ability to recruit and retain top talent who value purpose
                            </li>
                        </ul>

                        <div style={styles.callout}>
                            <h4 style={styles.calloutTitle}>Key Insight</h4>
                            <p style={styles.calloutText}>
                                The energy transition represents a $130 trillion investment opportunity through 2050. 
                                Companies that position themselves early in this transition will capture disproportionate 
                                value while those that delay face increasing risks of stranded assets and market disruption.
                            </p>
                        </div>

                        <h3 style={styles.subheading}>Navigating the Energy Transition</h3>
                        <p style={styles.paragraph}>
                            The shift to clean energy is accelerating across all sectors. Organizations must develop 
                            comprehensive transition strategies that address:
                        </p>
                        <ul style={styles.list}>
                            <li style={styles.listItem}>
                                <strong>Decarbonization Pathways:</strong> Setting science-based targets and roadmaps to net-zero
                            </li>
                            <li style={styles.listItem}>
                                <strong>Renewable Energy Adoption:</strong> Transitioning to clean power sources and improving energy efficiency
                            </li>
                            <li style={styles.listItem}>
                                <strong>Circular Economy:</strong> Redesigning products and processes to eliminate waste
                            </li>
                            <li style={styles.listItem}>
                                <strong>Supply Chain Transformation:</strong> Engaging suppliers in sustainability initiatives
                            </li>
                        </ul>

                        <h3 style={styles.subheading}>Climate Risk as Strategic Priority</h3>
                        <p style={styles.paragraph}>
                            Forward-thinking boards are elevating climate risk to the same level as financial and 
                            operational risks. This includes:
                        </p>
                        <ul style={styles.list}>
                            <li style={styles.listItem}>Conducting climate scenario analysis aligned with TCFD recommendations</li>
                            <li style={styles.listItem}>Integrating climate metrics into executive compensation</li>
                            <li style={styles.listItem}>Establishing board-level oversight of sustainability initiatives</li>
                            <li style={styles.listItem}>Investing in climate adaptation and resilience measures</li>
                        </ul>

                        <h3 style={styles.subheading}>Innovation and Opportunity</h3>
                        <p style={styles.paragraph}>
                            The green transition is driving innovation across industries. Companies are developing 
                            breakthrough technologies in renewable energy, energy storage, carbon capture, sustainable 
                            materials, and green hydrogen. These innovations are creating new markets and business models.
                        </p>

                        <h3 style={styles.subheading}>Stakeholder Expectations</h3>
                        <p style={styles.paragraph}>
                            Investors, customers, employees, and regulators are demanding greater transparency and 
                            action on climate issues. Companies must:
                        </p>
                        <ul style={styles.list}>
                            <li style={styles.listItem}>Provide clear, consistent ESG disclosures</li>
                            <li style={styles.listItem}>Set ambitious but achievable sustainability targets</li>
                            <li style={styles.listItem}>Report progress transparently and regularly</li>
                            <li style={styles.listItem}>Engage authentically with stakeholders on climate issues</li>
                        </ul>

                        <p style={styles.paragraph}>
                            The green transition is not a distant future scenario—it's happening now. Companies that 
                            embrace this transformation will not only mitigate climate risks but also unlock new sources 
                            of competitive advantage, innovation, and long-term value creation.
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
        color: '#10b981',
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
        borderTop: '4px solid #10b981',
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
        backgroundColor: '#ecfdf5',
        border: '2px solid #10b981',
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

