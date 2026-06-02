import React from 'react';
import { imageUrl } from '../utils/imageUrl';
import LazyImage from '../components/common/LazyImage';

export default function DigitalTwins() {
    return (
        <section style={styles.section}>
            <div style={styles.container}>
                {/* Hero Header */}
                <div style={styles.hero}>
                    <span style={styles.category}>DIGITAL</span>
                    <h1 style={styles.title}>Digital Twins</h1>
                    <p style={styles.subtitle}>
                        The Future of Industrial Operations
                    </p>
                    <div style={styles.meta}>
                        <span>AI & AUTOMATION</span>
                        <span style={styles.dot}>•</span>
                        <span>April 5, 2026</span>
                    </div>
                </div>

                {/* Main Content */}
                <article style={styles.content}>
                    <div style={styles.imageWrapper}>
                        <LazyImage
                            src={imageUrl('2-1.png.webp')}
                            alt="Digital Twins Technology"
                            className="digital-twins-image"
                            threshold={0.1}
                        />
                    </div>

                    <div style={styles.textContent}>
                        <h2 style={styles.sectionTitle}>Revolutionizing Industrial Operations</h2>
                        <p style={styles.paragraph}>
                            Digital twins are revolutionizing how companies design, operate, and maintain complex systems. 
                            By creating virtual replicas of physical assets, processes, and systems, organizations can 
                            simulate, predict, and optimize performance in ways never before possible.
                        </p>

                        <h3 style={styles.subheading}>What Are Digital Twins?</h3>
                        <p style={styles.paragraph}>
                            A digital twin is a virtual representation of a physical object, process, or system that 
                            spans its lifecycle and is updated from real-time data. It uses simulation, machine learning, 
                            and reasoning to help decision-making by providing insights into current state and predicting 
                            future behavior.
                        </p>

                        <div style={styles.callout}>
                            <h4 style={styles.calloutTitle}>Performance Impact</h4>
                            <p style={styles.calloutText}>
                                Early adopters of digital twin technology are seeing 30% efficiency gains across operations, 
                                with significant improvements in predictive maintenance, asset optimization, and process 
                                efficiency. The technology is proving particularly transformative in manufacturing, energy, 
                                and infrastructure sectors.
                            </p>
                        </div>

                        <h3 style={styles.subheading}>Key Applications</h3>
                        <p style={styles.paragraph}>
                            Digital twins are being deployed across diverse industries and use cases:
                        </p>
                        <ul style={styles.list}>
                            <li style={styles.listItem}>
                                <strong>Manufacturing:</strong> Optimizing production lines, reducing downtime, and improving 
                                quality control through real-time monitoring and simulation
                            </li>
                            <li style={styles.listItem}>
                                <strong>Energy & Utilities:</strong> Managing power grids, wind farms, and oil refineries 
                                with predictive maintenance and performance optimization
                            </li>
                            <li style={styles.listItem}>
                                <strong>Smart Cities:</strong> Modeling urban infrastructure, traffic patterns, and resource 
                                consumption to improve city planning and operations
                            </li>
                            <li style={styles.listItem}>
                                <strong>Healthcare:</strong> Creating patient-specific models for personalized treatment 
                                planning and medical device optimization
                            </li>
                            <li style={styles.listItem}>
                                <strong>Aerospace:</strong> Simulating aircraft performance, predicting maintenance needs, 
                                and optimizing flight operations
                            </li>
                        </ul>

                        <h3 style={styles.subheading}>Technology Stack</h3>
                        <p style={styles.paragraph}>
                            Implementing digital twins requires integration of several advanced technologies:
                        </p>
                        <ul style={styles.list}>
                            <li style={styles.listItem}>
                                <strong>IoT Sensors:</strong> Collecting real-time data from physical assets
                            </li>
                            <li style={styles.listItem}>
                                <strong>Cloud Computing:</strong> Processing and storing massive amounts of data
                            </li>
                            <li style={styles.listItem}>
                                <strong>AI/ML:</strong> Analyzing patterns, predicting failures, and optimizing operations
                            </li>
                            <li style={styles.listItem}>
                                <strong>3D Modeling:</strong> Creating accurate virtual representations
                            </li>
                            <li style={styles.listItem}>
                                <strong>Edge Computing:</strong> Enabling real-time processing and decision-making
                            </li>
                        </ul>

                        <h3 style={styles.subheading}>Business Benefits</h3>
                        <p style={styles.paragraph}>
                            Organizations implementing digital twin technology are realizing substantial benefits:
                        </p>
                        <ul style={styles.list}>
                            <li style={styles.listItem}>
                                <strong>Reduced Downtime:</strong> Predictive maintenance prevents unexpected failures
                            </li>
                            <li style={styles.listItem}>
                                <strong>Improved Efficiency:</strong> Real-time optimization of operations and resource utilization
                            </li>
                            <li style={styles.listItem}>
                                <strong>Faster Innovation:</strong> Virtual testing and simulation accelerate product development
                            </li>
                            <li style={styles.listItem}>
                                <strong>Better Decision-Making:</strong> Data-driven insights enable more informed choices
                            </li>
                            <li style={styles.listItem}>
                                <strong>Cost Savings:</strong> Reduced maintenance costs and extended asset lifecycles
                            </li>
                        </ul>

                        <h3 style={styles.subheading}>Implementation Roadmap</h3>
                        <p style={styles.paragraph}>
                            Successful digital twin deployment requires a structured approach:
                        </p>
                        <ol style={styles.list}>
                            <li style={styles.listItem}>
                                <strong>Define Use Cases:</strong> Identify high-value applications aligned with business objectives
                            </li>
                            <li style={styles.listItem}>
                                <strong>Assess Data Readiness:</strong> Evaluate existing data infrastructure and sensor capabilities
                            </li>
                            <li style={styles.listItem}>
                                <strong>Build Foundation:</strong> Establish IoT connectivity, data platforms, and analytics capabilities
                            </li>
                            <li style={styles.listItem}>
                                <strong>Develop Models:</strong> Create accurate digital representations and simulation models
                            </li>
                            <li style={styles.listItem}>
                                <strong>Integrate & Scale:</strong> Connect systems, validate results, and expand across operations
                            </li>
                        </ol>

                        <h3 style={styles.subheading}>The Future Landscape</h3>
                        <p style={styles.paragraph}>
                            As technologies mature and converge, digital twins will become increasingly sophisticated. 
                            Future developments include autonomous digital twins that can make decisions independently, 
                            ecosystem-level twins that model entire supply chains or cities, and human digital twins 
                            for personalized healthcare.
                        </p>

                        <p style={styles.paragraph}>
                            Organizations that embrace digital twin technology today are positioning themselves at the 
                            forefront of the fourth industrial revolution, gaining competitive advantages through enhanced 
                            operational intelligence, agility, and innovation capabilities.
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
    .digital-twins-image.lazy-image {
        width: 100%;
        height: auto;
        object-fit: cover;
        border-radius: 16px;
        min-height: 400px;
    }
    
    .digital-twins-image.lazy-image.loading {
        background-color: #f3f4f6;
        filter: blur(8px);
    }
    
    .digital-twins-image.lazy-image.loaded {
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

if (!document.head.querySelector('style[data-digital-twins-styles]')) {
    styleElement.setAttribute('data-digital-twins-styles', 'true');
    document.head.appendChild(styleElement);
}
