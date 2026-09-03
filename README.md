# OllamaRateCard

A playful, colorful Ollama pricing comparison app. Compare listed token rates against the effective rates you get inside subscription plans (Pro Monthly, Pro Yearly, Max, Team), with sortable columns, inline price bars, and live search.

Built with **Vite + React + TypeScript + Tailwind CSS v4 + daisyUI**. No backend — all pricing data is a static TS file bundled at build time.

## Features

- **Plan toggle** — switch between Pro (Monthly), Pro (Yearly), Max, and Team; effective prices recalculate instantly. Effective multiplier = `monthlyCredits / monthlyCost`.
- **Sortable table** — click any column header to sort ascending, click again for descending. Default sort is Blended (effective) ascending.
- **Blended price** — `(input × 3 + output) / 4`, a 3:1 input:output token ratio, for both listed and effective rates.
- **Search** — case-insensitive substring filter on model names.
- **Responsive** — the table scrolls horizontally on narrow screens.
- **Theme picker** — choose any built-in daisyUI theme (32 options) from the dropdown in the header. Your selection is saved to the browser and persists across sessions.
- **Price bars** — each price cell includes a bar showing where the model sits relative to the dataset (green = cheap → red = expensive).

## Data

All model pricing lives in [`src/data/models.ts`](src/data/models.ts) (per million tokens, USD). Plans live in [`src/data/plans.ts`](src/data/plans.ts). Edit these files and rebuild to update the site — no API calls at runtime.

## Getting started

```bash
npm install
npm run dev       # start dev server
npm run build     # production build → dist/
npm run preview   # preview the production build locally
```

## Deploying to GitHub Pages

### 1. Set your base path

GitHub Pages serves your app from `https://<user>.github.io/<repo-name>/`, so the build must know the sub-path. Open [`vite.config.ts`](vite.config.ts) and update:

```ts
const BASE_PATH = "/ollama-rate-card"; // ← change to your repo name
```

> Tip: you can also override it per-build without editing the file: `BASE_PATH=/your-repo npm run build`.

### 2. Deploy

This repo ships with a GitHub Actions workflow at `.github/workflows/deploy.yml` that builds and publishes to GitHub Pages automatically on every push to `main` — it derives the base path from your repository name automatically.

One-time repo setup on GitHub:

1. Go to **Settings → Pages**.
2. Under **Build and deployment → Source**, select **GitHub Actions**.

Then just push to `main` — the site will be live at `https://<user>.github.io/<repo-name>/`.

### Manual deploy (alternative)

If you prefer a manual deploy instead of Actions:

```bash
npm run build
npx gh-pages -d dist
```

## Notes

- Prices are manually curated and valued at listed rates; effective pricing assumes usage stays within the plan's monthly included credits.
- Not affiliated with any model provider.