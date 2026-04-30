// src/firebaseConfig.ts
// ─────────────────────────────────────────────────────────────────────────────
// Replace every placeholder below with your actual Firebase project values.
// Go to: Firebase Console → Project Settings → Your apps → SDK setup and config
// ─────────────────────────────────────────────────────────────────────────────

import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",      // e.g. "jhs-website.appspot.com"
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
};

// const firebaseConfig = {
//     apiKey: "AIzaSyBeiczghIsVJDUEiymPjHOzG9bZVk2VVvs",
//     authDomain: "my-website-2c42c.firebaseapp.com",
//     projectId: "my-website-2c42c",
//     storageBucket: "my-website-2c42c.firebasestorage.app",
//     messagingSenderId: "553333705642",
//     appId: "1:553333705642:web:2ec7002d118b93ad1539d3"
// };
const app = initializeApp(firebaseConfig);

// Export storage for use in AdminArticles.tsx and AdminBlogs.tsx
export const storage = getStorage(app);
export default app;