import { defineConfig } from "vite";
import dyadComponentTagger from "@dyad-sh/react-vite-component-tagger";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// Base path per deploy target:
// - Vercel serves at the domain root → "/"
// - GitHub Pages serves from a repo sub-path (e.g. /ollama-rate-card/) —
//   update BASE_PATH to your repository name before deploying there.
// - BASE_PATH env var overrides everything.
const isVercel = process.env.VERCEL === "1";
const BASE_PATH = "/ollama-rate-card";

export default defineConfig(({ command }) => ({
  base: command === "serve" ? "/" : (process.env.BASE_PATH ?? (isVercel ? "/" : BASE_PATH)),
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