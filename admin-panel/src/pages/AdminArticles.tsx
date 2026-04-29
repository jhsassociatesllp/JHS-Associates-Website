import React, { useEffect, useState, useRef } from 'react';
import {
    Typography, Grid, Box, CircularProgress, Card, CardContent,
    TextField, Button, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, IconButton, Snackbar, Alert, Chip, Tooltip,
    LinearProgress,
} from '@mui/material';
import {
    Article as ArticleIcon,
    Upload as UploadIcon,
    Delete as DeleteIcon,
    PictureAsPdf as PdfIcon,
    Add as AddIcon,
    ArrowUpward as ArrowUpwardIcon,
    OpenInNew as OpenInNewIcon,
    MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// ─── Firebase imports ────────────────────────────────────────────────────────
// Make sure your firebase config is in src/firebaseConfig.ts
// import { storage } from "../firebaseConfig";
// import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

// ─── Design tokens (matches Dashboard.tsx) ───────────────────────────────────
const ORANGE = '#f97316';
const DARK_NAVY = '#1e2a3b';
const CARD_BG = '#ffffff';
const PAGE_BG = '#f4f6f9';
const TEXT_MAIN = '#344767';
const TEXT_MUTED = '#8392ab';
const SHADOW = '0 2px 12px rgba(0,0,0,0.08)';
const RADIUS = 3;

interface Article {
    id: string;
    heading: string;
    short_description: string;
    button_text: string;
    pdf_url: string;
    created_at: string;
}

const emptyForm = { heading: '', short_description: '', button_text: 'Read More' };

export default function AdminArticles() {
    const { token } = useAuth();
    const fileRef = useRef<HTMLInputElement>(null);

    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState(emptyForm);
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [snack, setSnack] = useState<{ open: boolean; msg: string; severity: 'success' | 'error' }>({
        open: false, msg: '', severity: 'success',
    });

    const headers = { Authorization: `Bearer ${token}` };

    // ── Fetch articles ────────────────────────────────────────────────────────
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

    // ── Upload PDF to Firebase, get URL, save to backend ─────────────────────
    const handleSubmit = async () => {
        if (!form.heading || !form.short_description || !form.button_text || !pdfFile) {
            showSnack('Please fill all fields and select a PDF file.', 'error');
            return;
        }

        setUploading(true);
        setUploadProgress(0);

        try {
            // 1) Upload to Firebase Storage
            const storageRef = ref(storage, `articles/${Date.now()}_${pdfFile.name}`);
            const uploadTask = uploadBytesResumable(storageRef, pdfFile);

            const pdfUrl: string = await new Promise((resolve, reject) => {
                uploadTask.on(
                    'state_changed',
                    (snap) => setUploadProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
                    reject,
                    async () => {
                        const url = await getDownloadURL(uploadTask.snapshot.ref);
                        resolve(url);
                    },
                );
            });

            setUploading(false);

            // 2) Save metadata + Firebase URL to MongoDB
            setSubmitting(true);
            await axios.post(
                'http://localhost:8000/articles/',
                { ...form, pdf_url: pdfUrl },
                { headers },
            );

            showSnack('Article published successfully!', 'success');
            setForm(emptyForm);
            setPdfFile(null);
            if (fileRef.current) fileRef.current.value = '';
            fetchArticles();
        } catch (err: any) {
            showSnack(err?.response?.data?.detail || 'Upload failed. Please try again.', 'error');
        } finally {
            setUploading(false);
            setSubmitting(false);
            setUploadProgress(0);
        }
    };

    // ── Delete article ────────────────────────────────────────────────────────
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

    const isFormBusy = uploading || submitting;

    return (
        <Box sx={{ bgcolor: PAGE_BG, minHeight: '100vh', p: 3 }}>

            {/* ── Page header ────────────────────────────────────────────────────── */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <Box
                    sx={{
                        width: 44, height: 44, borderRadius: '50%',
                        bgcolor: ORANGE, display: 'flex', alignItems: 'center',
                        justifyContent: 'center', color: '#fff',
                        boxShadow: `0 4px 14px ${ORANGE}55`,
                    }}
                >
                    <ArticleIcon />
                </Box>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: TEXT_MAIN, lineHeight: 1, fontFamily: "'Nunito', sans-serif" }}>
                        Articles
                    </Typography>
                    <Typography variant="caption" sx={{ color: TEXT_MUTED }}>
                        Manage and publish articles with PDF attachments
                    </Typography>
                </Box>
            </Box>

            <Grid container spacing={2.5}>

                {/* ── Add Article Form ─────────────────────────────────────────────── */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ bgcolor: CARD_BG, borderRadius: RADIUS, boxShadow: SHADOW }}>
                        <Box sx={{ p: 2.5, borderBottom: '1px solid #e9ecef' }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: TEXT_MAIN, fontFamily: "'Nunito', sans-serif" }}>
                                Add New Article
                            </Typography>
                            <Typography variant="caption" sx={{ color: TEXT_MUTED }}>
                                Fill in the details and upload a PDF
                            </Typography>
                        </Box>
                        <CardContent sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>

                            <TextField
                                label="Article Heading"
                                fullWidth
                                size="small"
                                value={form.heading}
                                onChange={(e) => setForm({ ...form, heading: e.target.value })}
                                disabled={isFormBusy}
                                sx={fieldSx}
                            />

                            <TextField
                                label="Short Description"
                                fullWidth
                                multiline
                                rows={3}
                                size="small"
                                value={form.short_description}
                                onChange={(e) => setForm({ ...form, short_description: e.target.value })}
                                disabled={isFormBusy}
                                sx={fieldSx}
                            />

                            <TextField
                                label="Button Text"
                                fullWidth
                                size="small"
                                value={form.button_text}
                                onChange={(e) => setForm({ ...form, button_text: e.target.value })}
                                disabled={isFormBusy}
                                placeholder='e.g. "Read More"'
                                sx={fieldSx}
                            />

                            {/* PDF Upload */}
                            <Box>
                                <input
                                    ref={fileRef}
                                    type="file"
                                    accept=".pdf"
                                    style={{ display: 'none' }}
                                    onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                                />
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    startIcon={<PdfIcon />}
                                    onClick={() => fileRef.current?.click()}
                                    disabled={isFormBusy}
                                    sx={{
                                        borderColor: pdfFile ? ORANGE : '#d2d6da',
                                        color: pdfFile ? ORANGE : TEXT_MUTED,
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        '&:hover': { borderColor: ORANGE, color: ORANGE },
                                    }}
                                >
                                    {pdfFile ? pdfFile.name : 'Choose PDF File'}
                                </Button>
                            </Box>

                            {/* Upload progress */}
                            {uploading && (
                                <Box>
                                    <Typography variant="caption" sx={{ color: TEXT_MUTED }}>
                                        Uploading to Firebase… {uploadProgress}%
                                    </Typography>
                                    <LinearProgress
                                        variant="determinate"
                                        value={uploadProgress}
                                        sx={{
                                            mt: 0.5, height: 6, borderRadius: 5, bgcolor: '#e9ecef',
                                            '& .MuiLinearProgress-bar': { bgcolor: ORANGE, borderRadius: 5 },
                                        }}
                                    />
                                </Box>
                            )}

                            <Button
                                variant="contained"
                                fullWidth
                                startIcon={isFormBusy ? <CircularProgress size={16} color="inherit" /> : <AddIcon />}
                                onClick={handleSubmit}
                                disabled={isFormBusy}
                                sx={{
                                    bgcolor: DARK_NAVY,
                                    fontWeight: 700,
                                    textTransform: 'none',
                                    py: 1.2,
                                    fontFamily: "'Nunito', sans-serif",
                                    '&:hover': { bgcolor: '#16202e' },
                                }}
                            >
                                {isFormBusy ? 'Publishing…' : 'Publish Article'}
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                {/* ── Articles Table ───────────────────────────────────────────────── */}
                <Grid item xs={12} md={8}>
                    <Card sx={{ bgcolor: CARD_BG, borderRadius: RADIUS, boxShadow: SHADOW }}>
                        <Box sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e9ecef' }}>
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: TEXT_MAIN, fontFamily: "'Nunito', sans-serif" }}>
                                    Published Articles
                                </Typography>
                                <Typography variant="body2" sx={{ color: TEXT_MUTED, display: 'flex', alignItems: 'center', mt: 0.3 }}>
                                    <Box component="span" sx={{ color: '#4caf50', display: 'flex', mr: 0.5 }}>
                                        <ArrowUpwardIcon fontSize="small" />
                                    </Box>
                                    <Box component="span" sx={{ fontWeight: 700, color: TEXT_MAIN }}>{articles.length} total</Box>
                                    &nbsp;articles
                                </Typography>
                            </Box>
                            <IconButton size="small"><MoreVertIcon /></IconButton>
                        </Box>

                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ bgcolor: '#fafbfc' }}>
                                        {['Heading', 'Description', 'Button', 'PDF', 'Actions'].map((h) => (
                                            <TableCell
                                                key={h}
                                                sx={{
                                                    color: TEXT_MUTED, fontWeight: 700, fontSize: '0.72rem',
                                                    textTransform: 'uppercase', letterSpacing: '0.05em',
                                                    borderBottom: '1px solid #e9ecef', py: 1.2,
                                                }}
                                            >
                                                {h}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center" sx={{ py: 4, border: 0 }}>
                                                <CircularProgress />
                                            </TableCell>
                                        </TableRow>
                                    ) : articles.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center" sx={{ py: 4, border: 0, color: TEXT_MUTED }}>
                                                No articles yet. Add your first one!
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        articles.map((a) => (
                                            <TableRow key={a.id} hover sx={{ '&:last-child td': { border: 0 } }}>
                                                <TableCell sx={{ py: 1.8, borderBottom: '1px solid #e9ecef', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: TEXT_MAIN }}>
                                                        {a.heading}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell sx={{ py: 1.8, borderBottom: '1px solid #e9ecef', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: TEXT_MUTED, fontSize: '0.84rem' }}>
                                                    {a.short_description}
                                                </TableCell>
                                                <TableCell sx={{ py: 1.8, borderBottom: '1px solid #e9ecef' }}>
                                                    <Chip label={a.button_text} size="small" sx={{ bgcolor: `${ORANGE}18`, color: ORANGE, fontWeight: 600, fontSize: '0.72rem' }} />
                                                </TableCell>
                                                <TableCell sx={{ py: 1.8, borderBottom: '1px solid #e9ecef' }}>
                                                    <Tooltip title="Open PDF">
                                                        <IconButton size="small" href={a.pdf_url} target="_blank" rel="noopener" sx={{ color: ORANGE }}>
                                                            <OpenInNewIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                                <TableCell sx={{ py: 1.8, borderBottom: '1px solid #e9ecef' }}>
                                                    <Tooltip title="Delete article">
                                                        <IconButton size="small" onClick={() => handleDelete(a.id)} sx={{ color: '#ea0606' }}>
                                                            <DeleteIcon fontSize="small" />
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
                </Grid>
            </Grid>

            <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack({ ...snack, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert severity={snack.severity} onClose={() => setSnack({ ...snack, open: false })} variant="filled">
                    {snack.msg}
                </Alert>
            </Snackbar>
        </Box>
    );
}

// ── Shared field style ────────────────────────────────────────────────────────
const fieldSx = {
    '& .MuiOutlinedInput-root': {
        '&:hover fieldset': { borderColor: ORANGE },
        '&.Mui-focused fieldset': { borderColor: ORANGE },
    },
    '& .MuiInputLabel-root.Mui-focused': { color: ORANGE },
};

// ─────────────────────────────────────────────────────────────────────────────
const ORANGE_LOCAL = '#f97316';
const TEXT_MUTED_LOCAL = '#8392ab';