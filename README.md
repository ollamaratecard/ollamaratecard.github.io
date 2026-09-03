# OllamaRateCard

A playful, colorful LLM pricing comparison app. Compare listed token rates against the effective rates you get inside subscription plans (Pro Monthly, Pro Yearly, Max, Team), with sortable columns, inline price bars, and live search.

Built with **Vite + React + TypeScript + Tailwind CSS v4 + daisyUI** (custom theme). No backend — all pricing data is a static TS file bundled at build time.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Features

- **Plan toggle** — switch between Pro (Monthly), Pro (Yearly), Max, and Team; effective prices recalculate instantly. Effective multiplier = `monthlyCredits / monthlyCost`.
- **Sortable table** — click any column header to sort ascending, click again for descending. Default sort is Blended (effective) ascending.
- **Blended price** — `(input × 3 + output) / 4`, a 3:1 input:output token ratio, for both listed and effective rates.
- **Search** — case-insensitive substring filter on model names, with a clear button.
- **Responsive** — the table scrolls horizontally on narrow screens.
- **Price bars** — each price cell includes a bar showing where the model sits relative to the dataset, using the theme's own status colors (cheap → expensive).

## Onboarding

New to the project? Here's the 5-minute tour:

### Prerequisites

- **Node.js 20+** (check with `node --version`)
- **npm** (ships with Node)

### 1. Install and run

```bash
npm install       # install dependencies
npm run dev       # start dev server → http://localhost:8080
```

The app opens with a pricing table of 19 models on the Pro (Monthly) plan. Try:

- Clicking a column header (e.g. **Output**) to sort by it
- Switching the plan to **Team** and watching effective prices recalculate
- Typing `kimi` in the search box

### 2. Project structure

```
src/
├── components/          # UI components
│   ├── PricingTable.tsx     # sortable table + price bars (core of the app)
│   ├── PlanToggle.tsx       # plan segmented control
│   ├── SearchInput.tsx      # search box with clear button
│   ├── ThemePicker.tsx      # daisyUI theme dropdown (localStorage-persisted)
│   └── AppLogo.tsx          # logo mark
├── data/                # ← EDIT HERE to update content
│   ├── models.ts            # model pricing (per 1M tokens, USD)
│   ├── plans.ts             # subscription plan definitions
│   └── themes.ts            # theme registry for the picker
├── pages/
│   └── Index.tsx            # the single page: header, controls, table
└── globals.css          # Tailwind v4 + daisyUI config and token bridge
e2e-tests/               # Playwright specs (npm test)
```

### 3. Common tasks

**Add or update a model's price** — edit [`src/data/models.ts`](src/data/models.ts):

```ts
{ model: "my-new-model", inputPer1M: 0.5, cachedInputPer1M: 0.1, outputPer1M: 2.0, notes?: "promo" }
```

The table, sorting, bars, and blended calculations pick it up automatically. Prices are per **million tokens, USD**.

**Add or change a plan** — edit [`src/data/plans.ts`](src/data/plans.ts). The effective multiplier is computed from `monthlyCredits / monthlyCost`; everything else derives from it.

**Run the tests**

```bash
npx playwright install   # one-time browser install
npm run test:e2e         # run all specs in e2e-tests/
```

### 4. How effective pricing works

Effective prices assume your usage stays within the plan's monthly included credits — beyond that, cost reverts to listed rates. For each plan:

- **multiplier** = `monthlyCredits / monthlyCost` (e.g. Pro Monthly: 60 / 20 = 3×)
- **effective price** = `listedPrice / multiplier`
- **blended** = `(input × 3 + output) / 4` — a 3:1 input:output token ratio

## Deploying to Vercel

Vercel works out of the box — no config changes needed. The build emits **relative asset paths** (`./assets/...`), which work identically whether the site is served from a domain root (Vercel) or a sub-path (GitHub Pages). Just:

1. Import the repo in Vercel (framework preset: **Vite**).
2. Deploy. Done.

The included [`vercel.json`](vercel.json) routes all non-asset paths to `index.html` so client-side routing works.

## Deploying to GitHub Pages

### 1. Set your base path

GitHub Pages serves the app from `https://<user>.github.io/<repo-name>/`. The build uses relative asset paths by default, which already works — but if you prefer absolute paths, set the base in [`vite.config.ts`](vite.config.ts):

No base-path editing needed — the build defaults to relative paths that work on both GitHub Pages and Vercel. (Legacy behavior: set `BASE_PATH=/your-repo` to force absolute paths.)

> Tip: relative paths handle both hosts automatically. If you ever need absolute paths, override per-build: `BASE_PATH=/your-repo npm run build`.

### 2. Deploy

This repo ships with a GitHub Actions workflow at `.github/workflows/deploy.yml` that builds and publishes to GitHub Pages automatically on every push to `main` — it derives the base path from your repository name automatically.

One-time repo setup on GitHub:

1. Go to **Settings → Pages**.
2. Under **Build and deployment → Source**, select **GitHub Actions**.

Then just push to `main` — the site will be live at `https://<user>.github.io/<repo-name>/`.

### Manual deploy (alternative)

```bash
npm run build
npx gh-pages -d dist
```

## Contributing

PRs welcome! Please:

1. Keep changes minimal and focused
2. Add or update an e2e spec in `e2e-tests/` for user-facing behavior
3. Run `npx tsc --noEmit` and the test suite before submitting

## License

[MIT](LICENSE) — free to use, modify, and distribute.

## Notes

- Prices are manually curated and valued at listed rates; effective pricing assumes usage stays within the plan's monthly included credits.
- Not affiliated with any model provider.
