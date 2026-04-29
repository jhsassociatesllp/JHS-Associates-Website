import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Blog {
    id: string;
    title: string;
    description: string;
    content: string;
    image_url?: string;
    created_at: string;
}

export default function BlogsPage() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [selected, setSelected] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        axios
            .get('http://localhost:8000/blogs')
            .then((res) => setBlogs(res.data))
            .catch(() => setError('Failed to load blogs. Please try again later.'))
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

    // ── Full blog post view ───────────────────────────────────────────────────
    if (selected) {
        return (
            <section style={styles.section}>
                <div style={{ ...styles.container, maxWidth: 760 }}>
                    <button style={styles.backBtn} onClick={() => setSelected(null)}>
                        ← Back to Blogs
                    </button>

                    {selected.image_url && (
                        <img
                            src={selected.image_url}
                            alt={selected.title}
                            style={styles.heroImage}
                        />
                    )}

                    <p style={styles.postDate}>
                        {new Date(selected.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>

                    <h1 style={styles.postTitle}>{selected.title}</h1>
                    <p style={styles.postDesc}>{selected.description}</p>

                    <hr style={styles.divider} />

                    {/* Render content with newlines preserved */}
                    <div style={styles.postContent}>
                        {selected.content.split('\n').map((para, i) =>
                            para.trim() ? <p key={i} style={styles.para}>{para}</p> : <br key={i} />,
                        )}
                    </div>
                </div>
            </section>
        );
    }

    // ── Blog listing ──────────────────────────────────────────────────────────
    return (
        <section style={styles.section}>
            <div style={styles.container}>
                <h1 style={styles.title}>Our Blog</h1>
                <p style={styles.subtitle}>Insights, updates, and stories from our team</p>

                {blogs.length === 0 ? (
                    <p style={styles.empty}>No blog posts yet. Stay tuned!</p>
                ) : (
                    <div style={styles.grid}>
                        {blogs.map((blog) => (
                            <article key={blog.id} style={styles.card}>
                                {blog.image_url ? (
                                    <img src={blog.image_url} alt={blog.title} style={styles.cardImage} />
                                ) : (
                                    <div style={styles.cardImagePlaceholder}>
                                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#42a5f5" strokeWidth="1.5">
                                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                            <circle cx="8.5" cy="8.5" r="1.5" />
                                            <polyline points="21 15 16 10 5 21" />
                                        </svg>
                                    </div>
                                )}

                                <div style={styles.cardBody}>
                                    <span style={styles.date}>
                                        {new Date(blog.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </span>
                                    <h2 style={styles.cardTitle}>{blog.title}</h2>
                                    <p style={styles.cardDesc}>{blog.description}</p>

                                    <button
                                        style={styles.readBtn}
                                        onClick={() => setSelected(blog)}
                                        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#1e2a3b'; (e.currentTarget as HTMLButtonElement).style.color = '#fff'; }}
                                        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = '#1e2a3b'; }}
                                    >
                                        Read More →
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
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
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: 28,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
    },
    cardImage: {
        width: '100%',
        height: 200,
        objectFit: 'cover',
    },
    cardImagePlaceholder: {
        width: '100%',
        height: 160,
        backgroundColor: '#e8f4fd',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardBody: {
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        flex: 1,
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
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
    },
    readBtn: {
        marginTop: 12,
        padding: '9px 18px',
        border: '2px solid #1e2a3b',
        borderRadius: 8,
        backgroundColor: 'transparent',
        color: '#1e2a3b',
        fontWeight: 700,
        fontSize: '0.875rem',
        cursor: 'pointer',
        fontFamily: "'Nunito', sans-serif",
        transition: 'background-color 0.2s, color 0.2s',
        alignSelf: 'flex-start',
    },
    backBtn: {
        background: 'none',
        border: 'none',
        color: '#42a5f5',
        fontWeight: 700,
        fontSize: '0.9rem',
        cursor: 'pointer',
        padding: '0 0 24px 0',
        fontFamily: "'Nunito', sans-serif",
    },
    heroImage: {
        width: '100%',
        maxHeight: 360,
        objectFit: 'cover',
        borderRadius: 12,
        marginBottom: 24,
    },
    postDate: {
        color: '#8392ab',
        fontSize: '0.85rem',
        fontWeight: 600,
        margin: '0 0 8px',
    },
    postTitle: {
        fontSize: '2rem',
        fontWeight: 800,
        color: '#1e2a3b',
        margin: '0 0 12px',
        lineHeight: 1.3,
    },
    postDesc: {
        fontSize: '1.05rem',
        color: '#6b7280',
        fontStyle: 'italic',
        margin: 0,
        lineHeight: 1.7,
    },
    divider: {
        margin: '28px 0',
        border: 'none',
        borderTop: '1px solid #e9ecef',
    },
    postContent: {
        fontSize: '1rem',
        lineHeight: 1.8,
        color: '#344767',
    },
    para: {
        margin: '0 0 16px',
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
        borderTop: '4px solid #42a5f5',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
    },
};