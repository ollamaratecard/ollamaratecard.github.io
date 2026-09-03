import { defineConfig } from "vite";
import dyadComponentTagger from "@dyad-sh/react-vite-component-tagger";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// Base path: relative "./" works everywhere — Vercel (domain root), GitHub
// Pages (repo sub-path), and local preview — because all asset URLs are
// emitted relative to index.html's location. Override with BASE_PATH env var
// if you need absolute paths.
const BASE_PATH = process.env.BASE_PATH ?? "./";

export default defineConfig(() => ({
  base: BASE_PATH,
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [dyadComponentTagger(), react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));