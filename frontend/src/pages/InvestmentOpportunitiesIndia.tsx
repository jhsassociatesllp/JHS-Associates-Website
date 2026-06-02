import React from 'react';
import { imageUrl } from '../utils/imageUrl';
import LazyImage from '../components/common/LazyImage';

export default function InvestmentOpportunitiesIndia() {
    return (
        <section style={styles.section}>
            <div style={styles.container}>
                {/* Hero Header */}
                <div style={styles.hero}>
                    <span style={styles.category}>TECHNOLOGY</span>
                    <h1 style={styles.title}>Investment Opportunities</h1>
                    <p style={styles.subtitle}>
                        A Strategic Roadmap for India
                    </p>
                    <div style={styles.meta}>
                        <span>THOUGHT LEADERSHIP</span>
                        <span style={styles.dot}>•</span>
                        <span>January 22, 2025</span>
                    </div>
                </div>

                {/* Main Content */}
                <article style={styles.content}>
                    <div style={styles.imageWrapper}>
                        <LazyImage
                            src={imageUrl('Investment-Opportunities.png.webp')}
                            alt="Investment Opportunities in India"
                            className="investment-opportunities-image"
                            threshold={0.1}
                        />
                    </div>

                    <div style={styles.textContent}>
                        <h2 style={styles.sectionTitle}>India's Economic Landscape</h2>
                        <p style={styles.paragraph}>
                            India, with its dynamic economy, presents numerous investment opportunities across sectors. 
                            From emerging technologies like Artificial Intelligence and renewable energy to traditional 
                            industries such as manufacturing and infrastructure, the nation offers diverse avenues for growth.
                        </p>

                        <h3 style={styles.subheading}>Emerging Technology Sectors</h3>
                        <p style={styles.paragraph}>
                            India is rapidly becoming a global hub for technology innovation, with significant opportunities 
                            in several key areas:
                        </p>
                        <ul style={styles.list}>
                            <li style={styles.listItem}>
                                <strong>Artificial Intelligence & Machine Learning:</strong> Growing ecosystem of AI startups 
                                and enterprise adoption across industries
                            </li>
                            <li style={styles.listItem}>
                                <strong>Fintech:</strong> Digital payments, neobanking, and blockchain-based solutions 
                                transforming financial services
                            </li>
                            <li style={styles.listItem}>
                                <strong>Healthtech:</strong> Telemedicine, digital health records, and AI-powered diagnostics 
                                addressing healthcare accessibility
                            </li>
                            <li style={styles.listItem}>
                                <strong>Edtech:</strong> Online learning platforms and skill development solutions reaching 
                                millions of students
                            </li>
                        </ul>

                        <h3 style={styles.subheading}>Renewable Energy Revolution</h3>
                        <p style={styles.paragraph}>
                            India has set ambitious targets for renewable energy capacity, creating substantial investment 
                            opportunities in solar, wind, and green hydrogen. The government's commitment to achieving 
                            500 GW of renewable energy capacity by 2030 is driving unprecedented growth in this sector.
                        </p>

                        <div style={styles.callout}>
                            <h4 style={styles.calloutTitle}>Key Investment Drivers</h4>
                            <p style={styles.calloutText}>
                                India's large consumer base, favorable demographics, improving ease of doing business, 
                                and government initiatives like Make in India and Digital India are creating a conducive 
                                environment for both domestic and foreign investment.
                            </p>
                        </div>

                        <h3 style={styles.subheading}>Infrastructure Development</h3>
                        <p style={styles.paragraph}>
                            The National Infrastructure Pipeline (NIP) represents one of the world's largest infrastructure 
                            programs, with investments planned across:
                        </p>
                        <ul style={styles.list}>
                            <li style={styles.listItem}>Transportation: Roads, railways, airports, and ports</li>
                            <li style={styles.listItem}>Urban infrastructure: Smart cities and metro rail projects</li>
                            <li style={styles.listItem}>Energy: Power generation and distribution networks</li>
                            <li style={styles.listItem}>Digital infrastructure: 5G rollout and data centers</li>
                        </ul>

                        <h3 style={styles.subheading}>Manufacturing Renaissance</h3>
                        <p style={styles.paragraph}>
                            The Production Linked Incentive (PLI) scheme is catalyzing manufacturing growth across 
                            14 key sectors, including electronics, pharmaceuticals, automobiles, and textiles. This 
                            initiative aims to make India a global manufacturing hub and reduce import dependence.
                        </p>

                        <h3 style={styles.subheading}>Strategic Considerations</h3>
                        <p style={styles.paragraph}>
                            Successful investment in India requires understanding local market dynamics, regulatory 
                            frameworks, and partnership opportunities. Investors should consider:
                        </p>
                        <ul style={styles.list}>
                            <li style={styles.listItem}>Sector-specific regulations and compliance requirements</li>
                            <li style={styles.listItem}>State-level incentives and industrial policies</li>
                            <li style={styles.listItem}>Local partnership and joint venture opportunities</li>
                            <li style={styles.listItem}>Long-term growth potential versus short-term returns</li>
                        </ul>

                        <p style={styles.paragraph}>
                            As India continues its trajectory toward becoming a $5 trillion economy, the investment 
                            landscape will continue to evolve, offering both challenges and unprecedented opportunities 
                            for strategic investors.
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
    .investment-opportunities-image.lazy-image {
        width: 100%;
        height: auto;
        object-fit: cover;
        border-radius: 16px;
        min-height: 400px;
    }
    
    .investment-opportunities-image.lazy-image.loading {
        background-color: #f3f4f6;
        filter: blur(8px);
    }
    
    .investment-opportunities-image.lazy-image.loaded {
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

if (!document.head.querySelector('style[data-investment-opportunities-styles]')) {
    styleElement.setAttribute('data-investment-opportunities-styles', 'true');
    document.head.appendChild(styleElement);
}
