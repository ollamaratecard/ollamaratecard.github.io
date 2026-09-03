import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

// Base path: relative "./" works everywhere — GitHub Pages (root for this
// user-pages repo) and local preview — because all asset URLs are emitted
// relative to index.html's location. Override with BASE_PATH env var if you
// need absolute paths.
const BASE_PATH = process.env.BASE_PATH ?? './';

export default defineConfig(() => ({
    base: BASE_PATH,
    server: {
        host: '::',
        port: 8080,
    },
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
}));
