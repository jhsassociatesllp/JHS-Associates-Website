import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Article {
    id: string;
    heading: string;
    short_description: string;
    button_text: string;
    pdf_url: string;
    created_at: string;
}

export default function ArticlesPage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        axios
            .get('http://localhost:8000/articles')
            .then((res) => setArticles(res.data))
            .catch(() => setError('Failed to load articles. Please try again later.'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div style={styles.center}>
                <div style={styles.spinner} />
            </div>
        );
    }

    if (error) {
        return <div style={{ ...styles.center, color: '#ea0606' }}>{error}</div>;
    }

    return (
        <section style={styles.section}>
            <div style={styles.container}>
                <h1 style={styles.title}>Articles</h1>
                <p style={styles.subtitle}>Explore our latest publications and resources</p>

                {articles.length === 0 ? (
                    <p style={styles.empty}>No articles available yet. Check back soon!</p>
                ) : (
                    <div style={styles.grid}>
                        {articles.map((article) => (
                            <article key={article.id} style={styles.card}>
                                {/* PDF Icon Header */}
                                <div style={styles.cardHeader}>
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                        <polyline points="14 2 14 8 20 8" />
                                        <line x1="16" y1="13" x2="8" y2="13" />
                                        <line x1="16" y1="17" x2="8" y2="17" />
                                        <polyline points="10 9 9 9 8 9" />
                                    </svg>
                                    <span style={styles.date}>
                                        {new Date(article.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </span>
                                </div>

                                <h2 style={styles.cardTitle}>{article.heading}</h2>
                                <p style={styles.cardDesc}>{article.short_description}</p>

                                <a
                                    href={article.pdf_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={styles.btn}
                                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#ea6c00'; }}
                                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#f97316'; }}
                                >
                                    {article.button_text} →
                                </a>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

// ─── Inline styles (framework-agnostic, replace with your CSS/Tailwind) ───────
const styles: Record<string, React.CSSProperties> = {
    section: {
        padding: '80px 0',
        backgroundColor: '#f4f6f9',
        minHeight: '100vh',
        fontFamily: "'Nunito', sans-serif",
    },
    container: {
        maxWidth: 1100,
        margin: '0 auto',
        padding: '0 24px',
    },
    title: {
        fontSize: '2.2rem',
        fontWeight: 800,
        color: '#1e2a3b',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: '1rem',
        color: '#8392ab',
        textAlign: 'center',
        marginBottom: 48,
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 28,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 28,
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        transition: 'transform 0.2s, box-shadow 0.2s',
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    date: {
        fontSize: '0.78rem',
        color: '#8392ab',
        fontWeight: 600,
    },
    cardTitle: {
        fontSize: '1.1rem',
        fontWeight: 800,
        color: '#1e2a3b',
        margin: 0,
        lineHeight: 1.4,
    },
    cardDesc: {
        fontSize: '0.9rem',
        color: '#6b7280',
        lineHeight: 1.65,
        margin: 0,
        flex: 1,
    },
    btn: {
        display: 'inline-block',
        marginTop: 8,
        padding: '10px 20px',
        backgroundColor: '#f97316',
        color: '#fff',
        borderRadius: 8,
        fontWeight: 700,
        fontSize: '0.875rem',
        textDecoration: 'none',
        textAlign: 'center',
        transition: 'background-color 0.2s',
    },
    empty: {
        textAlign: 'center',
        color: '#8392ab',
        fontSize: '1rem',
        marginTop: 60,
    },
    center: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        fontSize: '1rem',
        color: '#8392ab',
    },
    spinner: {
        width: 36,
        height: 36,
        border: '4px solid #e9ecef',
        borderTop: '4px solid #f97316',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
    },
};