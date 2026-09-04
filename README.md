# OllamaRateCard

A playful, colorful LLM pricing comparison app. Compare listed token rates against the effective rates you get inside subscription plans (Pro Monthly, Pro Yearly, Max, Team), with sortable columns and live search.

Built with **Vite + React + TypeScript + Tailwind CSS v4 + daisyUI** (custom theme). No backend — all pricing data is a static TS file bundled at build time.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Features

- **Plan toggle** — switch between Pro (Monthly), Pro (Yearly), Max, and Team; effective prices recalculate instantly. Effective multiplier = `monthlyCredits / monthlyCost`.
- **Sortable table** — click any column header to sort ascending, click again for descending. Default sort is Blended (effective) ascending.
- **Blended price** — `(input × 3 + output) / 4`, a 3:1 input:output token ratio, for both listed and effective rates.
- **Search** — case-insensitive substring filter on model names, with a clear button.
- **Responsive** — the table scrolls horizontally on narrow screens.

## Onboarding

New to the project? Here's the 5-minute tour:

### Prerequisites

- **Bun** (check with `bun --version`)

### 1. Install and run

```bash
bun install       # install dependencies
bun run dev       # start dev server → http://localhost:8080
```

The app opens with a pricing table of 19 models on the Pro (Monthly) plan. Try:

- Clicking a column header (e.g. **Output**) to sort by it
- Switching the plan to **Team** and watching effective prices recalculate
- Typing `kimi` in the search box

### 2. Project structure

```
src/
├── components/          # UI components
│   ├── PricingTable.tsx     # sortable table (core of the app)
│   ├── PlanToggle.tsx       # plan segmented control
│   ├── SearchInput.tsx      # search box with clear button
│   └── AppLogo.tsx          # logo mark
├── data/                # ← EDIT HERE to update content
│   ├── models.ts            # model pricing (per 1M tokens, USD)
│   └── plans.ts             # subscription plan definitions
├── pages/
│   └── Index.tsx            # the single page: header, controls, table
└── globals.css          # Tailwind v4 + daisyUI config and token bridge
e2e-tests/               # Playwright specs (bun run test:e2e)
```

### 3. Common tasks

**Add or update a model's price** — edit [`src/data/models.ts`](src/data/models.ts):

```ts
{ model: "my-new-model", inputPer1M: 0.5, cachedInputPer1M: 0.1, outputPer1M: 2.0, notes?: "promo" }
```

The table, sorting, and blended calculations pick it up automatically. Prices are per **million tokens, USD**.

**Pricing source & date** — prices come from [ollama.com/pricing](https://ollama.com/pricing) and were last verified **September 3rd, 2026**. The source URL and as-of date live as constants at the top of [`src/data/models.ts`](src/data/models.ts) (`PRICING_SOURCE_URL`, `PRICES_AS_OF`) and render in the site footer. A future sync script can pull fresh rates from the source URL and bump `PRICES_AS_OF`.

**Add or change a plan** — edit [`src/data/plans.ts`](src/data/plans.ts). The effective multiplier is computed from `monthlyCredits / monthlyCost`; everything else derives from it.

**Run the tests**

```bash
npx playwright install   # one-time browser install
bun run test:e2e         # run all specs in e2e-tests/
```

### 4. How effective pricing works

Effective prices assume your usage stays within the plan's monthly included credits — beyond that, cost reverts to listed rates. For each plan:

- **multiplier** = `monthlyCredits / monthlyCost` (e.g. Pro Monthly: 60 / 20 = 3×)
- **effective price** = `listedPrice / multiplier`
- **blended** = `(input × 3 + output) / 4` — a 3:1 input:output token ratio

## Deploying

This repo deploys to **GitHub Pages** via the GitHub Actions workflow at `.github/workflows/deploy.yml` — it builds with bun and publishes on every push to `main`.

One-time repo setup on GitHub:

1. Go to **Settings → Pages**.
2. Under **Build and deployment → Source**, select **GitHub Actions**.

Then just push to `main` — the site is live at `https://ollamaratecard.github.io/`.

## Contributing

PRs welcome! Please:

1. Keep changes minimal and focused
2. Add or update an e2e spec in `e2e-tests/` for user-facing behavior
3. Run `bun run check:types` and the test suite before submitting

## License

[MIT](LICENSE) — free to use, modify, and distribute.

## Notes

- Prices are manually curated and valued at listed rates; effective pricing assumes usage stays within the plan's monthly included credits.
- Not affiliated with any model provider.
