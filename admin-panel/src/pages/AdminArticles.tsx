import React, { useEffect, useState, useRef } from 'react';
import {
    Typography, Box, CircularProgress, Card, CardContent,
    TextField, Button, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, IconButton, Snackbar, Alert, Chip, Tooltip,
    LinearProgress, Divider,
} from '@mui/material';
import {
    Article as ArticleIcon,
    PictureAsPdf as PdfIcon,
    Add as AddIcon,
    Delete as DeleteIcon,
    OpenInNew as OpenInNewIcon,
    CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

/* ─── Firebase (uncomment when ready) ───────────────────────── */
import { storage } from '../firbaseconfig';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

/* ─── Design tokens ─────────────────────────────────────────── */
const ACCENT   = '#696cff';
const CARD_BG  = '#ffffff';
const PAGE_BG  = '#f4f5fa';
const BORDER   = 'rgba(0,0,0,0.07)';
const TEXT     = '#2d3748';
const MUTED    = '#8a8d93';
const SHADOW   = '0 2px 8px rgba(0,0,0,0.07)';

interface Article {
    id: string;
    heading: string;
    short_description: string;
    button_text: string;
    pdf_url: string;
    created_at: string;
}

const emptyForm = { heading: '', short_description: '', button_text: 'Read More' };

/* ─── Shared field style ─────────────────────────────────────── */
const fieldSx = {
    '& label': { fontSize: '0.82rem', color: MUTED },
    '& label.Mui-focused': { color: ACCENT },
    '& .MuiOutlinedInput-root': {
        fontSize: '0.875rem',
        '& fieldset': { borderColor: BORDER },
        '&:hover fieldset': { borderColor: ACCENT },
        '&.Mui-focused fieldset': { borderColor: ACCENT },
    },
};

export default function AdminArticles() {
    const { token } = useAuth();
    const fileRef = useRef<HTMLInputElement>(null);

    const [articles,        setArticles]        = useState<Article[]>([]);
    const [loading,         setLoading]         = useState(true);
    const [form,            setForm]            = useState(emptyForm);
    const [pdfFile,         setPdfFile]         = useState<File | null>(null);
    const [uploading,       setUploading]       = useState(false);
    const [uploadProgress,  setUploadProgress]  = useState(0);
    const [submitting,      setSubmitting]      = useState(false);
    const [snack, setSnack] = useState<{ open: boolean; msg: string; severity: 'success' | 'error' }>({
        open: false, msg: '', severity: 'success',
    });

    const headers = { Authorization: `Bearer ${token}` };

    const fetchArticles = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:8000/articles', { headers });
            setArticles(res.data);
        } catch {
            showSnack('Failed to load articles', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchArticles(); }, []);

    const showSnack = (msg: string, severity: 'success' | 'error') =>
        setSnack({ open: true, msg, severity });

    const handleSubmit = async () => {
        if (!form.heading || !form.short_description || !form.button_text || !pdfFile) {
            showSnack('Please fill all fields and select a PDF file.', 'error');
            return;
        }
        setUploading(true);
        setUploadProgress(0);
        try {
            const storageRef = ref(storage, `articles/${Date.now()}_${pdfFile.name}`);
            const uploadTask = uploadBytesResumable(storageRef, pdfFile);
            const pdfUrl: string = await new Promise((resolve, reject) => {
                uploadTask.on(
                    'state_changed',
                    (snap) => setUploadProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
                    reject,
                    async () => resolve(await getDownloadURL(uploadTask.snapshot.ref)),
                );
            });
            setUploading(false);
            setSubmitting(true);
            await axios.post('http://localhost:8000/articles/', { ...form, pdf_url: pdfUrl }, { headers });
            showSnack('Article published successfully!', 'success');
            setForm(emptyForm);
            setPdfFile(null);
            if (fileRef.current) fileRef.current.value = '';
            fetchArticles();
        } catch (err: any) {
            showSnack(err?.response?.data?.detail || 'Upload failed.', 'error');
        } finally {
            setUploading(false);
            setSubmitting(false);
            setUploadProgress(0);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Delete this article?')) return;
        try {
            await axios.delete(`http://localhost:8000/articles/${id}`, { headers });
            showSnack('Article deleted.', 'success');
            setArticles((prev) => prev.filter((a) => a.id !== id));
        } catch {
            showSnack('Delete failed.', 'error');
        }
    };

    const busy = uploading || submitting;

    return (
        <Box sx={{ bgcolor: PAGE_BG, minHeight: '100%', p: { xs: 2, md: 3 } }}>

            {/* ── Page Header ──────────────────────────────────────────── */}
            <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
                    <ArticleIcon sx={{ fontSize: 22, color: ACCENT }} />
                    <Typography sx={{ fontSize: '1.4rem', fontWeight: 700, color: TEXT, fontFamily: 'Inter,sans-serif' }}>
                        Articles
                    </Typography>
                </Box>
                <Typography sx={{ fontSize: '0.85rem', color: MUTED, ml: '30px' }}>
                    Manage and publish articles with PDF attachments
                </Typography>
            </Box>

            {/* ── Layout ───────────────────────────────────────────────── */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '360px 1fr' }, gap: 2.5, alignItems: 'start' }}>

                {/* ── Add Article Form ─────────────────────────────────── */}
                <Card elevation={0} sx={{ bgcolor: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 2, boxShadow: SHADOW }}>
                    {/* Card header */}
                    <Box sx={{ px: 2.5, pt: 2.5, pb: 2, borderBottom: `1px solid ${BORDER}` }}>
                        <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: TEXT, fontFamily: 'Inter,sans-serif' }}>
                            Add New Article
                        </Typography>
                        <Typography sx={{ fontSize: '0.78rem', color: MUTED, mt: 0.25 }}>
                            Fill in the details and upload a PDF
                        </Typography>
                    </Box>

                    <CardContent sx={{ p: '20px !important', display: 'flex', flexDirection: 'column', gap: 2 }}>

                        {/* Heading */}
                        <Box>
                            <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: TEXT, mb: 0.6, fontFamily: 'Inter,sans-serif' }}>
                                Article Heading <Box component="span" sx={{ color: '#ef4444' }}>*</Box>
                            </Typography>
                            <TextField
                                fullWidth size="small"
                                placeholder="e.g. GST Compliance 2025"
                                value={form.heading}
                                onChange={(e) => setForm({ ...form, heading: e.target.value })}
                                disabled={busy}
                                sx={fieldSx}
                            />
                        </Box>

                        {/* Description */}
                        <Box>
                            <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: TEXT, mb: 0.6, fontFamily: 'Inter,sans-serif' }}>
                                Short Description <Box component="span" sx={{ color: '#ef4444' }}>*</Box>
                            </Typography>
                            <TextField
                                fullWidth size="small" multiline rows={3}
                                placeholder="Brief summary of the article…"
                                value={form.short_description}
                                onChange={(e) => setForm({ ...form, short_description: e.target.value })}
                                disabled={busy}
                                sx={fieldSx}
                            />
                        </Box>

                        {/* Button Text */}
                        <Box>
                            <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: TEXT, mb: 0.6, fontFamily: 'Inter,sans-serif' }}>
                                Button Label
                            </Typography>
                            <TextField
                                fullWidth size="small"
                                placeholder="Read More"
                                value={form.button_text}
                                onChange={(e) => setForm({ ...form, button_text: e.target.value })}
                                disabled={busy}
                                sx={fieldSx}
                            />
                        </Box>

                        {/* PDF Upload */}
                        <Box>
                            <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: TEXT, mb: 0.6, fontFamily: 'Inter,sans-serif' }}>
                                PDF File <Box component="span" sx={{ color: '#ef4444' }}>*</Box>
                            </Typography>
                            <input ref={fileRef} type="file" accept=".pdf" style={{ display: 'none' }}
                                onChange={(e) => setPdfFile(e.target.files?.[0] || null)} />
                            <Box
                                onClick={() => !busy && fileRef.current?.click()}
                                sx={{
                                    border: `1.5px dashed ${pdfFile ? ACCENT : BORDER}`,
                                    borderRadius: 1.5,
                                    bgcolor: pdfFile ? `${ACCENT}08` : '#fafafa',
                                    p: 2, textAlign: 'center',
                                    cursor: busy ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.2s',
                                    '&:hover': { borderColor: ACCENT, bgcolor: `${ACCENT}08` },
                                }}
                            >
                                {pdfFile ? (
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                        <CheckCircleIcon sx={{ fontSize: 18, color: '#10b981' }} />
                                        <Typography sx={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600, wordBreak: 'break-all' }}>
                                            {pdfFile.name}
                                        </Typography>
                                    </Box>
                                ) : (
                                    <>
                                        <PdfIcon sx={{ fontSize: 28, color: MUTED, mb: 0.5 }} />
                                        <Typography sx={{ fontSize: '0.8rem', color: MUTED }}>
                                            Click to choose a PDF file
                                        </Typography>
                                    </>
                                )}
                            </Box>
                        </Box>

                        {/* Upload progress */}
                        {uploading && (
                            <Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                    <Typography sx={{ fontSize: '0.75rem', color: MUTED }}>Uploading to Firebase…</Typography>
                                    <Typography sx={{ fontSize: '0.75rem', color: ACCENT, fontWeight: 600 }}>{uploadProgress}%</Typography>
                                </Box>
                                <LinearProgress variant="determinate" value={uploadProgress}
                                    sx={{ height: 5, borderRadius: 3, bgcolor: '#f0f0f5', '& .MuiLinearProgress-bar': { bgcolor: ACCENT, borderRadius: 3 } }} />
                            </Box>
                        )}

                        <Divider sx={{ borderColor: BORDER }} />

                        {/* Submit */}
                        <Button
                            variant="contained" fullWidth
                            startIcon={busy ? <CircularProgress size={15} color="inherit" /> : <AddIcon />}
                            onClick={handleSubmit}
                            disabled={busy}
                            sx={{
                                py: 1.2,
                                background: `linear-gradient(135deg, ${ACCENT} 0%, #4a4cf7 100%)`,
                                fontWeight: 600, fontSize: '0.875rem',
                                textTransform: 'none', fontFamily: 'Inter,sans-serif',
                                boxShadow: `0 4px 14px ${ACCENT}40`,
                                '&:hover': { background: `linear-gradient(135deg, #5a5de0 0%, #3a3cd8 100%)` },
                                '&.Mui-disabled': { background: '#e0e0e0', color: '#9e9e9e', boxShadow: 'none' },
                            }}
                        >
                            {busy ? 'Publishing…' : '+ Publish Article'}
                        </Button>
                    </CardContent>
                </Card>

                {/* ── Published Articles Table ─────────────────────────── */}
                <Card elevation={0} sx={{ bgcolor: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 2, boxShadow: SHADOW }}>
                    {/* Card header */}
                    <Box sx={{ px: 2.5, pt: 2.5, pb: 2, borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box>
                            <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: TEXT, fontFamily: 'Inter,sans-serif' }}>
                                Published Articles
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
                                <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#10b981' }} />
                                <Typography sx={{ fontSize: '0.78rem', color: MUTED }}>
                                    <Box component="span" sx={{ fontWeight: 700, color: TEXT }}>{articles.length}</Box> total articles
                                </Typography>
                            </Box>
                        </Box>
                        <Chip
                            label={`${articles.length} published`}
                            size="small"
                            sx={{ bgcolor: `${ACCENT}14`, color: ACCENT, fontWeight: 600, fontSize: '0.72rem' }}
                        />
                    </Box>

                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ bgcolor: '#fafafa' }}>
                                    {['#', 'Heading', 'Description', 'Button', 'PDF', 'Actions'].map((h) => (
                                        <TableCell key={h} sx={{
                                            color: MUTED, fontWeight: 700, fontSize: '0.7rem',
                                            textTransform: 'uppercase', letterSpacing: 0.8,
                                            borderBottom: `1px solid ${BORDER}`, py: 1.2, fontFamily: 'Inter,sans-serif',
                                        }}>
                                            {h}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" sx={{ py: 5, border: 0 }}>
                                            <CircularProgress sx={{ color: ACCENT }} size={28} />
                                        </TableCell>
                                    </TableRow>
                                ) : articles.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" sx={{ py: 6, border: 0 }}>
                                            <PdfIcon sx={{ fontSize: 40, color: '#e0e0e0', mb: 1, display: 'block', mx: 'auto' }} />
                                            <Typography sx={{ fontSize: '0.875rem', color: MUTED }}>No articles yet. Add your first one!</Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    articles.map((a, idx) => (
                                        <TableRow key={a.id} hover sx={{ '&:last-child td': { border: 0 }, '&:hover': { bgcolor: '#fafafa' } }}>
                                            <TableCell sx={{ py: 1.6, borderBottom: `1px solid ${BORDER}`, color: MUTED, fontSize: '0.8rem', width: 40 }}>
                                                {idx + 1}
                                            </TableCell>
                                            <TableCell sx={{ py: 1.6, borderBottom: `1px solid ${BORDER}`, maxWidth: 160 }}>
                                                <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: TEXT, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {a.heading}
                                                </Typography>
                                                <Typography sx={{ fontSize: '0.72rem', color: MUTED }}>
                                                    {new Date(a.created_at).toLocaleDateString()}
                                                </Typography>
                                            </TableCell>
                                            <TableCell sx={{ py: 1.6, borderBottom: `1px solid ${BORDER}`, maxWidth: 200, color: MUTED, fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {a.short_description}
                                            </TableCell>
                                            <TableCell sx={{ py: 1.6, borderBottom: `1px solid ${BORDER}` }}>
                                                <Chip label={a.button_text} size="small"
                                                    sx={{ bgcolor: `${ACCENT}12`, color: ACCENT, fontWeight: 600, fontSize: '0.7rem' }} />
                                            </TableCell>
                                            <TableCell sx={{ py: 1.6, borderBottom: `1px solid ${BORDER}` }}>
                                                <Tooltip title="Open PDF">
                                                    <IconButton size="small" href={a.pdf_url} target="_blank" rel="noopener"
                                                        sx={{ color: ACCENT, bgcolor: `${ACCENT}10`, borderRadius: 1, '&:hover': { bgcolor: `${ACCENT}20` } }}>
                                                        <OpenInNewIcon sx={{ fontSize: 16 }} />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell sx={{ py: 1.6, borderBottom: `1px solid ${BORDER}` }}>
                                                <Tooltip title="Delete article">
                                                    <IconButton size="small" onClick={() => handleDelete(a.id)}
                                                        sx={{ color: '#ef4444', bgcolor: '#ef444410', borderRadius: 1, '&:hover': { bgcolor: '#ef444420' } }}>
                                                        <DeleteIcon sx={{ fontSize: 16 }} />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Card>
            </Box>

            {/* ── Snackbar ─────────────────────────────────────────────── */}
            <Snackbar open={snack.open} autoHideDuration={4000}
                onClose={() => setSnack({ ...snack, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert severity={snack.severity} onClose={() => setSnack({ ...snack, open: false })} variant="filled" sx={{ borderRadius: 2 }}>
                    {snack.msg}
                </Alert>
            </Snackbar>
        </Box>
    );
}