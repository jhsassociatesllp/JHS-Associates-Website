import React from 'react';
import { imageUrl } from '../utils/imageUrl';
import LazyImage from '../components/common/LazyImage';

export default function BoardroomsInTransition() {
    return (
        <section style={styles.section}>
            <div style={styles.container}>
                {/* Hero Header */}
                <div style={styles.hero}>
                    <span style={styles.category}>ARTICLES</span>
                    <h1 style={styles.title}>Boardrooms in Transition</h1>
                    <p style={styles.subtitle}>
                        How India's GRC Framework is Redefining Corporate Governance
                    </p>
                    <div style={styles.meta}>
                        <span>SLIDESHOW</span>
                        <span style={styles.dot}>•</span>
                        <span>December 20, 2026</span>
                    </div>
                </div>

                {/* Main Content */}
                <article style={styles.content}>
                    <div style={styles.imageWrapper}>
                        <LazyImage
                            src={imageUrl('BOARDROOMS-IN-TRANSITION-.png.webp')}
                            alt="Boardrooms in Transition"
                            className="detail-page-image"
                            threshold={0.1}
                        />
                    </div>

                    <div style={styles.textContent}>
                        <h2 style={styles.sectionTitle}>The Evolution of Corporate Governance in India</h2>
                        <p style={styles.paragraph}>
                            India's corporate governance ecosystem has witnessed a decisive shift over the past decade. 
                            Landmark regulatory reforms led by SEBI, RBI, and IRDAI have elevated boardroom expectations 
                            and redefined the role of Governance, Risk, and Compliance (GRC).
                        </p>

                        <h3 style={styles.subheading}>From Defensive to Strategic</h3>
                        <p style={styles.paragraph}>
                            No longer limited to defensive oversight, GRC has become a strategic pillar enabling better 
                            board performance, organizational resilience, and sustainable long-term value creation. Modern 
                            boards are now expected to integrate risk intelligence into strategic decision-making processes.
                        </p>

                        <h3 style={styles.subheading}>Key Regulatory Milestones</h3>
                        <ul style={styles.list}>
                            <li style={styles.listItem}>
                                <strong>SEBI Reforms:</strong> Enhanced disclosure requirements and independent director mandates
                            </li>
                            <li style={styles.listItem}>
                                <strong>RBI Guidelines:</strong> Strengthened risk management frameworks for financial institutions
                            </li>
                            <li style={styles.listItem}>
                                <strong>IRDAI Directives:</strong> Improved governance standards in the insurance sector
                            </li>
                            <li style={styles.listItem}>
                                <strong>Companies Act 2013:</strong> Comprehensive corporate governance provisions
                            </li>
                        </ul>

                        <h3 style={styles.subheading}>The Modern Board's Mandate</h3>
                        <p style={styles.paragraph}>
                            Today's boards must balance multiple priorities: shareholder value creation, stakeholder 
                            engagement, ESG commitments, and regulatory compliance. This requires a sophisticated 
                            understanding of emerging risks, from cybersecurity threats to climate change impacts.
                        </p>

                        <div style={styles.callout}>
                            <h4 style={styles.calloutTitle}>Key Takeaway</h4>
                            <p style={styles.calloutText}>
                                Organizations that embed GRC into their strategic DNA are better positioned to navigate 
                                uncertainty, build stakeholder trust, and achieve sustainable growth in an increasingly 
                                complex business environment.
                            </p>
                        </div>

                        <h3 style={styles.subheading}>Looking Ahead</h3>
                        <p style={styles.paragraph}>
                            As India continues its economic ascent, the role of corporate governance will only grow in 
                            importance. Boards that embrace this transition—moving from compliance-focused to 
                            strategy-integrated governance—will lead the next generation of Indian enterprises.
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

// Add custom styles for LazyImage
const styleElement = document.createElement('style');
styleElement.textContent = `
    .detail-page-image.lazy-image {
        width: 100%;
        height: auto;
        object-fit: cover;
        border-radius: 16px;
        min-height: 400px;
    }
    
    .detail-page-image.lazy-image.loading {
        background-color: #f3f4f6;
        filter: blur(8px);
    }
    
    .detail-page-image.lazy-image.loaded {
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

if (!document.head.querySelector('style[data-detail-page-styles]')) {
    styleElement.setAttribute('data-detail-page-styles', 'true');
    document.head.appendChild(styleElement);
}

