import { useMemo, useState } from "react";
import { Info, Sparkles } from "lucide-react";
import { AppLogo } from "@/components/AppLogo";
import { PlanToggle } from "@/components/PlanToggle";
import { SearchInput } from "@/components/SearchInput";
import { ThemePicker } from "@/components/ThemePicker";
import {
  PricingTable,
  buildRows,
  sortRows,
  type SortDir,
  type SortKey,
} from "@/components/PricingTable";
import { multiplierFor, plans } from "@/data/plans";

const DEFAULT_SORT: { key: SortKey; dir: SortDir } = {
  key: "blendedEffective",
  dir: "asc",
};

export default function Index() {
  const [planId, setPlanId] = useState(plans[0].id);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState(DEFAULT_SORT);

  const plan = plans.find((p) => p.id === planId) ?? plans[0];

  const rows = useMemo(() => {
    const all = buildRows(plan);
    const q = search.trim().toLowerCase();
    const filtered = q ? all.filter((r) => r.model.model.toLowerCase().includes(q)) : all;
    return sortRows(filtered, sort.key, sort.dir);
  }, [plan, search, sort]);

  const handleSort = (key: SortKey) => {
    setSort((prev) =>
      prev.key === key
        ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "asc" }
    );
  };

  const multiplier = multiplierFor(plan);

  return (
    <div className="theme-glow min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        {/* Header */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <AppLogo />
            <div>
              <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
                Ollama<span className="text-primary">RateCard</span>
              </h1>
              <p className="text-sm font-semibold text-muted-foreground">
                Ollama pricing, decoded — see what your plan actually costs per token
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-bold shadow-sm">
              <Sparkles className="h-4 w-4 text-primary" aria-hidden />
              {plans.length} plans · {multiplier.toFixed(1)}× effective
            </div>
            <ThemePicker />
          </div>
        </header>

        {/* Controls */}
        <section className="mt-8 rounded-3xl border border-border bg-card p-5 shadow-lg shadow-primary/10 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 className="text-sm font-extrabold uppercase tracking-wide text-muted-foreground">
                Subscription plan
              </h2>
              <div className="mt-3">
                <PlanToggle plans={plans} selectedId={planId} onSelect={setPlanId} />
              </div>
              <p className="mt-3 flex max-w-xl items-start gap-2 text-xs font-semibold text-muted-foreground">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
                Your plan's monthly credits are what make these rates cheaper than listed. Once you
                use them up, pricing reverts to standard.
              </p>
            </div>
            <div className="shrink-0">
              <h2 className="text-sm font-extrabold uppercase tracking-wide text-muted-foreground">
                Find a model
              </h2>
              <div className="mt-3">
                <SearchInput value={search} onChange={setSearch} />
              </div>
            </div>
          </div>
          {/* Plan math */}
          <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold">
            <span className="rounded-full bg-secondary px-3 py-1.5 text-secondary-foreground">
              ${plan.monthlyCost}/mo cost
            </span>
            <span className="rounded-full bg-secondary px-3 py-1.5 text-secondary-foreground">
              ${plan.monthlyCredits.toLocaleString()} included credits
            </span>
            <span className="rounded-full bg-accent px-3 py-1.5 text-accent-foreground">
              {multiplier.toFixed(2)}× effective multiplier
            </span>
          </div>
        </section>

        {/* Table */}
        <section className="mt-8">
          <PricingTable
            rows={rows}
            plan={plan}
            sortKey={sort.key}
            sortDir={sort.dir}
            onSort={handleSort}
          />
        </section>

        <footer className="mt-8 pb-4 text-center text-xs font-semibold text-muted-foreground">
          Prices are manually curated in <code className="font-mono">src/data/models.ts</code> and
          valued at listed rates. Not affiliated with any model provider.
        </footer>
      </div>
    </div>
  );
}
