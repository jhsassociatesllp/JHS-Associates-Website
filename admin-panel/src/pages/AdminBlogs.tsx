import React, { useEffect, useState, useRef } from 'react';
import {
    Typography, Box, CircularProgress, Card, CardContent,
    TextField, Button, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, IconButton, Snackbar, Alert, Chip, Tooltip,
    LinearProgress, Avatar, Divider,
} from '@mui/material';
import {
    RssFeed as BlogIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
    Image as ImageIcon,
    CheckCircle as CheckCircleIcon,
    CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
/* ─── Firebase (uncomment when ready) ───────────────────────── */
import { storage } from '../firbaseconfig';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

/* ─── Design tokens ─────────────────────────────────────────── */
const ACCENT = '#696cff';
const CARD_BG = '#ffffff';
const PAGE_BG = '#f4f5fa';
const BORDER = 'rgba(0,0,0,0.07)';
const TEXT = '#2d3748';
const MUTED = '#8a8d93';
const SHADOW = '0 2px 8px rgba(0,0,0,0.07)';

interface Blog {
    id: string;
    title: string;
    description: string;
    content: string;
    image_url?: string;
    created_at: string;
}

const emptyForm = { title: '', description: '', content: '' };

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

export default function AdminBlogs() {
    const { token } = useAuth();
    const imageRef = useRef<HTMLInputElement>(null);

    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState(emptyForm);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [snack, setSnack] = useState<{ open: boolean; msg: string; severity: 'success' | 'error' }>({
        open: false, msg: '', severity: 'success',
    });

    const headers = { Authorization: `Bearer ${token}` };

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:8000/blogs', { headers });
            setBlogs(res.data);
        } catch {
            showSnack('Failed to load blogs', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBlogs(); }, []);

    const showSnack = (msg: string, severity: 'success' | 'error') =>
        setSnack({ open: true, msg, severity });

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const clearImage = () => {
        setImageFile(null);
        setImagePreview(null);
        if (imageRef.current) imageRef.current.value = '';
    };

    const handleSubmit = async () => {
        if (!form.title || !form.description || !form.content) {
            showSnack('Please fill in Title, Description, and Content.', 'error');
            return;
        }
        let imageUrl: string | undefined;
        if (imageFile) {
            setUploading(true);
            setUploadProgress(0);
            try {
                const storageRef = ref(storage, `blogs/${Date.now()}_${imageFile.name}`);
                const uploadTask = uploadBytesResumable(storageRef, imageFile);
                imageUrl = await new Promise<string>((resolve, reject) => {
                    uploadTask.on(
                        'state_changed',
                        (snap) => setUploadProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
                        reject,
                        async () => resolve(await getDownloadURL(uploadTask.snapshot.ref)),
                    );
                });
            } catch {
                showSnack('Image upload failed.', 'error');
                setUploading(false);
                return;
            } finally {
                setUploading(false);
                setUploadProgress(0);
            }
        }
        setSubmitting(true);
        try {
            await axios.post('http://localhost:8000/blogs/', { ...form, image_url: imageUrl }, { headers });
            showSnack('Blog published successfully!', 'success');
            setForm(emptyForm);
            clearImage();
            fetchBlogs();
        } catch (err: any) {
            showSnack(err?.response?.data?.detail || 'Failed to publish blog.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Delete this blog post?')) return;
        try {
            await axios.delete(`http://localhost:8000/blogs/${id}`, { headers });
            showSnack('Blog deleted.', 'success');
            setBlogs((prev) => prev.filter((b) => b.id !== id));
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
                    <BlogIcon sx={{ fontSize: 22, color: ACCENT }} />
                    <Typography sx={{ fontSize: '1.4rem', fontWeight: 700, color: TEXT, fontFamily: 'Inter,sans-serif' }}>
                        Blogs
                    </Typography>
                </Box>
                <Typography sx={{ fontSize: '0.85rem', color: MUTED, ml: '30px' }}>
                    Create and manage blog posts
                </Typography>
            </Box>

            {/* ── Layout ───────────────────────────────────────────────── */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '360px 1fr' }, gap: 2.5, alignItems: 'start' }}>

                {/* ── Add Blog Form ────────────────────────────────────── */}
                <Card elevation={0} sx={{ bgcolor: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 2, boxShadow: SHADOW }}>
                    <Box sx={{ px: 2.5, pt: 2.5, pb: 2, borderBottom: `1px solid ${BORDER}` }}>
                        <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: TEXT, fontFamily: 'Inter,sans-serif' }}>
                            Add New Blog
                        </Typography>
                        <Typography sx={{ fontSize: '0.78rem', color: MUTED, mt: 0.25 }}>
                            Fill in the details and optionally upload a cover image
                        </Typography>
                    </Box>

                    <CardContent sx={{ p: '20px !important', display: 'flex', flexDirection: 'column', gap: 2 }}>

                        {/* Title */}
                        <Box>
                            <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: TEXT, mb: 0.6, fontFamily: 'Inter,sans-serif' }}>
                                Blog Title <Box component="span" sx={{ color: '#ef4444' }}>*</Box>
                            </Typography>
                            <TextField fullWidth size="small"
                                placeholder="e.g. Tax Planning Strategies for 2025"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                disabled={busy} sx={fieldSx} />
                        </Box>

                        {/* Short Description */}
                        <Box>
                            <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: TEXT, mb: 0.6, fontFamily: 'Inter,sans-serif' }}>
                                Short Description <Box component="span" sx={{ color: '#ef4444' }}>*</Box>
                            </Typography>
                            <TextField fullWidth size="small" multiline rows={2}
                                placeholder="Brief summary visible on the blog card…"
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                disabled={busy} sx={fieldSx} />
                        </Box>

                        {/* Content */}
                        <Box>
                            <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: TEXT, mb: 0.6, fontFamily: 'Inter,sans-serif' }}>
                                Content <Box component="span" sx={{ color: '#ef4444' }}>*</Box>
                            </Typography>
                            <TextField fullWidth size="small" multiline rows={5}
                                placeholder="Write the full blog content here…"
                                value={form.content}
                                onChange={(e) => setForm({ ...form, content: e.target.value })}
                                disabled={busy} sx={fieldSx} />
                        </Box>

                        {/* Cover Image Upload */}
                        <Box>
                            <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: TEXT, mb: 0.6, fontFamily: 'Inter,sans-serif' }}>
                                Cover Image <Box component="span" sx={{ color: MUTED, fontWeight: 400 }}>(optional)</Box>
                            </Typography>
                            <input ref={imageRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageSelect} />

                            {imagePreview ? (
                                <Box sx={{ position: 'relative', borderRadius: 1.5, overflow: 'hidden', border: `1.5px solid ${ACCENT}` }}>
                                    <Box component="img" src={imagePreview} alt="preview"
                                        sx={{ width: '100%', height: 120, objectFit: 'cover', display: 'block' }} />
                                    <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end', p: 0.75 }}>
                                        <Button size="small" onClick={clearImage}
                                            sx={{ bgcolor: 'rgba(0,0,0,0.6)', color: '#fff', minWidth: 0, px: 1, py: 0.25, fontSize: '0.7rem', borderRadius: 1, textTransform: 'none', '&:hover': { bgcolor: '#ef4444' } }}>
                                            Remove
                                        </Button>
                                    </Box>
                                    <Box sx={{ position: 'absolute', bottom: 6, left: 8, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <CheckCircleIcon sx={{ fontSize: 14, color: '#10b981' }} />
                                        <Typography sx={{ fontSize: '0.7rem', color: '#fff', fontWeight: 600, textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>Image selected</Typography>
                                    </Box>
                                </Box>
                            ) : (
                                <Box
                                    onClick={() => !busy && imageRef.current?.click()}
                                    sx={{
                                        border: `1.5px dashed ${BORDER}`,
                                        borderRadius: 1.5, bgcolor: '#fafafa',
                                        p: 2.5, textAlign: 'center',
                                        cursor: busy ? 'not-allowed' : 'pointer',
                                        transition: 'all 0.2s',
                                        '&:hover': { borderColor: ACCENT, bgcolor: `${ACCENT}06` },
                                    }}
                                >
                                    <ImageIcon sx={{ fontSize: 28, color: '#d0d0d5', mb: 0.5 }} />
                                    <Typography sx={{ fontSize: '0.8rem', color: MUTED }}>
                                        Click to upload cover image
                                    </Typography>
                                    <Typography sx={{ fontSize: '0.72rem', color: '#c0c0c8', mt: 0.25 }}>
                                        PNG, JPG, WEBP up to 5MB
                                    </Typography>
                                </Box>
                            )}
                        </Box>

                        {/* Upload progress */}
                        {uploading && (
                            <Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                    <Typography sx={{ fontSize: '0.75rem', color: MUTED }}>Uploading image…</Typography>
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
                            {busy ? 'Publishing…' : '+ Publish Blog'}
                        </Button>
                    </CardContent>
                </Card>

                {/* ── Published Blogs Table ────────────────────────────── */}
                <Card elevation={0} sx={{ bgcolor: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 2, boxShadow: SHADOW }}>
                    <Box sx={{ px: 2.5, pt: 2.5, pb: 2, borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box>
                            <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: TEXT, fontFamily: 'Inter,sans-serif' }}>
                                Published Blogs
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
                                <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#10b981' }} />
                                <Typography sx={{ fontSize: '0.78rem', color: MUTED }}>
                                    <Box component="span" sx={{ fontWeight: 700, color: TEXT }}>{blogs.length}</Box> total posts
                                </Typography>
                            </Box>
                        </Box>
                        <Chip
                            label={`${blogs.length} posts`}
                            size="small"
                            sx={{ bgcolor: `${ACCENT}14`, color: ACCENT, fontWeight: 600, fontSize: '0.72rem' }}
                        />
                    </Box>

                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ bgcolor: '#fafafa' }}>
                                    {['#', 'Cover', 'Title', 'Description', 'Date', 'Actions'].map((h) => (
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
                                ) : blogs.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" sx={{ py: 6, border: 0 }}>
                                            <BlogIcon sx={{ fontSize: 40, color: '#e0e0e0', mb: 1, display: 'block', mx: 'auto' }} />
                                            <Typography sx={{ fontSize: '0.875rem', color: MUTED }}>No blogs yet. Add your first one!</Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    blogs.map((b, idx) => (
                                        <TableRow key={b.id} hover sx={{ '&:last-child td': { border: 0 }, '&:hover': { bgcolor: '#fafafa' } }}>
                                            {/* # */}
                                            <TableCell sx={{ py: 1.5, borderBottom: `1px solid ${BORDER}`, color: MUTED, fontSize: '0.8rem', width: 36 }}>
                                                {idx + 1}
                                            </TableCell>
                                            {/* Cover */}
                                            <TableCell sx={{ py: 1.5, borderBottom: `1px solid ${BORDER}`, width: 54 }}>
                                                <Avatar
                                                    src={b.image_url}
                                                    variant="rounded"
                                                    sx={{ width: 40, height: 40, bgcolor: `${ACCENT}18`, borderRadius: 1.5 }}
                                                >
                                                    <BlogIcon sx={{ color: ACCENT, fontSize: 18 }} />
                                                </Avatar>
                                            </TableCell>
                                            {/* Title */}
                                            <TableCell sx={{ py: 1.5, borderBottom: `1px solid ${BORDER}`, maxWidth: 160 }}>
                                                <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: TEXT, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {b.title}
                                                </Typography>
                                            </TableCell>
                                            {/* Description */}
                                            <TableCell sx={{ py: 1.5, borderBottom: `1px solid ${BORDER}`, maxWidth: 200, color: MUTED, fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {b.description}
                                            </TableCell>
                                            {/* Date */}
                                            <TableCell sx={{ py: 1.5, borderBottom: `1px solid ${BORDER}`, whiteSpace: 'nowrap' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <CalendarIcon sx={{ fontSize: 13, color: MUTED }} />
                                                    <Typography sx={{ fontSize: '0.78rem', color: MUTED }}>
                                                        {new Date(b.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            {/* Actions */}
                                            <TableCell sx={{ py: 1.5, borderBottom: `1px solid ${BORDER}` }}>
                                                <Tooltip title="Delete blog">
                                                    <IconButton size="small" onClick={() => handleDelete(b.id)}
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