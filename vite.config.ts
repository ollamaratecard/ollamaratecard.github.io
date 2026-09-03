import { defineConfig } from "vite";
import dyadComponentTagger from "@dyad-sh/react-vite-component-tagger";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// GitHub Pages serves the app from a repo sub-path (e.g. /tokenledger/).
// Update BASE_PATH to your repository name before deploying.
const BASE_PATH = "/tokenledger";

export default defineConfig(({ command }) => ({
  // In dev (local preview) serve at "/", but for production builds use the
  // GitHub Pages sub-path (or a BASE_PATH env override).
  base: command === "serve" ? "/" : (process.env.BASE_PATH ?? BASE_PATH),
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