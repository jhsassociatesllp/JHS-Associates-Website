import React, { useEffect, useState, useRef } from 'react';
import {
    Typography, Grid, Box, CircularProgress, Card, CardContent,
    TextField, Button, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, IconButton, Snackbar, Alert, Tooltip,
    LinearProgress, Avatar,
} from '@mui/material';
import {
    RssFeed as BlogIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
    ArrowUpward as ArrowUpwardIcon,
    MoreVert as MoreVertIcon,
    Image as ImageIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
// import { storage } from '../firebaseConfig';
// import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

// ─── Design tokens (matches Dashboard.tsx) ───────────────────────────────────
const BLUE = '#42a5f5';
const DARK_NAVY = '#1e2a3b';
const CARD_BG = '#ffffff';
const PAGE_BG = '#f4f6f9';
const TEXT_MAIN = '#344767';
const TEXT_MUTED = '#8392ab';
const SHADOW = '0 2px 12px rgba(0,0,0,0.08)';
const RADIUS = 3;
const ORANGE = '#f97316';

interface Blog {
    id: string;
    title: string;
    description: string;
    content: string;
    image_url?: string;
    created_at: string;
}

const emptyForm = { title: '', description: '', content: '' };

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

    // ── Fetch blogs ───────────────────────────────────────────────────────────
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

    // ── Upload image to Firebase (optional), then save blog ──────────────────
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
                showSnack('Image upload failed. Please try again.', 'error');
                setUploading(false);
                return;
            } finally {
                setUploading(false);
                setUploadProgress(0);
            }
        }

        setSubmitting(true);
        try {
            await axios.post(
                'http://localhost:8000/blogs/',
                { ...form, image_url: imageUrl },
                { headers },
            );
            showSnack('Blog published successfully!', 'success');
            setForm(emptyForm);
            setImageFile(null);
            setImagePreview(null);
            if (imageRef.current) imageRef.current.value = '';
            fetchBlogs();
        } catch (err: any) {
            showSnack(err?.response?.data?.detail || 'Failed to publish blog.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    // ── Delete blog ───────────────────────────────────────────────────────────
    const handleDelete = async (id: string) => {
        if (!window.confirm('Delete this blog?')) return;
        try {
            await axios.delete(`http://localhost:8000/blogs/${id}`, { headers });
            showSnack('Blog deleted.', 'success');
            setBlogs((prev) => prev.filter((b) => b.id !== id));
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
                        bgcolor: BLUE, display: 'flex', alignItems: 'center',
                        justifyContent: 'center', color: '#fff',
                        boxShadow: `0 4px 14px ${BLUE}55`,
                    }}
                >
                    <BlogIcon />
                </Box>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: TEXT_MAIN, lineHeight: 1, fontFamily: "'Nunito', sans-serif" }}>
                        Blogs
                    </Typography>
                    <Typography variant="caption" sx={{ color: TEXT_MUTED }}>
                        Create and manage blog posts
                    </Typography>
                </Box>
            </Box>

            <Grid container spacing={2.5}>

                {/* ── Add Blog Form ────────────────────────────────────────────────── */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ bgcolor: CARD_BG, borderRadius: RADIUS, boxShadow: SHADOW }}>
                        <Box sx={{ p: 2.5, borderBottom: '1px solid #e9ecef' }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: TEXT_MAIN, fontFamily: "'Nunito', sans-serif" }}>
                                Add New Blog
                            </Typography>
                            <Typography variant="caption" sx={{ color: TEXT_MUTED }}>
                                Fill in the details and optionally upload an image
                            </Typography>
                        </Box>
                        <CardContent sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>

                            <TextField
                                label="Blog Title"
                                fullWidth
                                size="small"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                disabled={isFormBusy}
                                sx={fieldSx}
                            />

                            <TextField
                                label="Short Description"
                                fullWidth
                                multiline
                                rows={2}
                                size="small"
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                disabled={isFormBusy}
                                sx={fieldSx}
                            />

                            <TextField
                                label="Content"
                                fullWidth
                                multiline
                                rows={5}
                                size="small"
                                value={form.content}
                                onChange={(e) => setForm({ ...form, content: e.target.value })}
                                disabled={isFormBusy}
                                placeholder="Write the full blog content here…"
                                sx={fieldSx}
                            />

                            {/* Image Upload (optional) */}
                            <Box>
                                <input
                                    ref={imageRef}
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={handleImageSelect}
                                />
                                {imagePreview ? (
                                    <Box sx={{ position: 'relative' }}>
                                        <Box
                                            component="img"
                                            src={imagePreview}
                                            alt="preview"
                                            sx={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 1.5, border: `2px solid ${BLUE}` }}
                                        />
                                        <Button
                                            size="small"
                                            onClick={() => { setImageFile(null); setImagePreview(null); if (imageRef.current) imageRef.current.value = ''; }}
                                            sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'rgba(0,0,0,0.55)', color: '#fff', minWidth: 0, p: '2px 8px', fontSize: '0.72rem', '&:hover': { bgcolor: '#ea0606' } }}
                                        >
                                            Remove
                                        </Button>
                                    </Box>
                                ) : (
                                    <Button
                                        variant="outlined"
                                        fullWidth
                                        startIcon={<ImageIcon />}
                                        onClick={() => imageRef.current?.click()}
                                        disabled={isFormBusy}
                                        sx={{
                                            borderColor: '#d2d6da', color: TEXT_MUTED, textTransform: 'none', fontWeight: 600,
                                            '&:hover': { borderColor: BLUE, color: BLUE },
                                        }}
                                    >
                                        Upload Cover Image (optional)
                                    </Button>
                                )}
                            </Box>

                            {/* Upload progress */}
                            {uploading && (
                                <Box>
                                    <Typography variant="caption" sx={{ color: TEXT_MUTED }}>
                                        Uploading image… {uploadProgress}%
                                    </Typography>
                                    <LinearProgress
                                        variant="determinate"
                                        value={uploadProgress}
                                        sx={{
                                            mt: 0.5, height: 6, borderRadius: 5, bgcolor: '#e9ecef',
                                            '& .MuiLinearProgress-bar': { bgcolor: BLUE, borderRadius: 5 },
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
                                {isFormBusy ? 'Publishing…' : 'Publish Blog'}
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                {/* ── Blogs Table ──────────────────────────────────────────────────── */}
                <Grid item xs={12} md={8}>
                    <Card sx={{ bgcolor: CARD_BG, borderRadius: RADIUS, boxShadow: SHADOW }}>
                        <Box sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e9ecef' }}>
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: TEXT_MAIN, fontFamily: "'Nunito', sans-serif" }}>
                                    Published Blogs
                                </Typography>
                                <Typography variant="body2" sx={{ color: TEXT_MUTED, display: 'flex', alignItems: 'center', mt: 0.3 }}>
                                    <Box component="span" sx={{ color: '#4caf50', display: 'flex', mr: 0.5 }}>
                                        <ArrowUpwardIcon fontSize="small" />
                                    </Box>
                                    <Box component="span" sx={{ fontWeight: 700, color: TEXT_MAIN }}>{blogs.length} total</Box>
                                    &nbsp;posts
                                </Typography>
                            </Box>
                            <IconButton size="small"><MoreVertIcon /></IconButton>
                        </Box>

                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ bgcolor: '#fafbfc' }}>
                                        {['Cover', 'Title', 'Description', 'Date', 'Actions'].map((h) => (
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
                                    ) : blogs.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center" sx={{ py: 4, border: 0, color: TEXT_MUTED }}>
                                                No blogs yet. Add your first one!
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        blogs.map((b) => (
                                            <TableRow key={b.id} hover sx={{ '&:last-child td': { border: 0 } }}>
                                                <TableCell sx={{ py: 1.5, borderBottom: '1px solid #e9ecef' }}>
                                                    <Avatar
                                                        src={b.image_url}
                                                        variant="rounded"
                                                        sx={{ width: 40, height: 40, bgcolor: `${BLUE}22` }}
                                                    >
                                                        <BlogIcon sx={{ color: BLUE, fontSize: 18 }} />
                                                    </Avatar>
                                                </TableCell>
                                                <TableCell sx={{ py: 1.8, borderBottom: '1px solid #e9ecef', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: TEXT_MAIN }}>
                                                        {b.title}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell sx={{ py: 1.8, borderBottom: '1px solid #e9ecef', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: TEXT_MUTED, fontSize: '0.84rem' }}>
                                                    {b.description}
                                                </TableCell>
                                                <TableCell sx={{ py: 1.8, borderBottom: '1px solid #e9ecef', color: TEXT_MUTED, fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                                                    {new Date(b.created_at).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell sx={{ py: 1.8, borderBottom: '1px solid #e9ecef' }}>
                                                    <Tooltip title="Delete blog">
                                                        <IconButton size="small" onClick={() => handleDelete(b.id)} sx={{ color: '#ea0606' }}>
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

const fieldSx = {
    '& .MuiOutlinedInput-root': {
        '&:hover fieldset': { borderColor: '#42a5f5' },
        '&.Mui-focused fieldset': { borderColor: '#42a5f5' },
    },
    '& .MuiInputLabel-root.Mui-focused': { color: '#42a5f5' },
};