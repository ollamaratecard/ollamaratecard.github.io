import { Info, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import { AppLogo } from '@/components/AppLogo';
import { PlanToggle } from '@/components/PlanToggle';
import { buildRows, PricingTable, type SortDir, type SortKey, sortRows } from '@/components/PricingTable';
import { SearchInput } from '@/components/SearchInput';
import { multiplierFor, plans } from '@/data/plans';

const DEFAULT_SORT: { key: SortKey; dir: SortDir } = {
    key: 'blendedEffective',
    dir: 'asc',
};

export default function Index() {
    const [planId, setPlanId] = useState(plans[0].id);
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState(DEFAULT_SORT);

    const plan = plans.find((p) => p.id === planId) ?? plans[0];

    const rows = useMemo(() => {
        const all = buildRows(plan);
        const q = search.trim().toLowerCase();
        const filtered = q ? all.filter((r) => r.model.model.toLowerCase().includes(q)) : all;
        return sortRows(filtered, sort.key, sort.dir);
    }, [plan, search, sort]);

    const handleSort = (key: SortKey) => {
        setSort((prev) => (prev.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }));
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
                            <h1 className="text-3xl font-bold tracking-tight">
                                Ollama<span className="text-primary">RateCard</span>
                            </h1>
                            <p className="text-sm font-medium text-base-content/60">
                                Ollama pricing, decoded — see what your plan actually costs per token
                            </p>
                        </div>
                    </div>
                    <div className="badge badge-lg badge-outline gap-2 p-4 font-bold">
                        <Sparkles className="h-4 w-4 text-primary" aria-hidden />
                        {plans.length} plans · {multiplier.toFixed(1)}× effective
                    </div>
                </header>

                {/* Controls */}
                <section className="card mt-4 border border-base-300 bg-base-100 p-5 sm:p-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                            <h2 className="text-sm font-bold uppercase tracking-wide text-base-content/60">
                                Subscription plan
                            </h2>
                            <div className="mt-3">
                                <PlanToggle plans={plans} selectedId={planId} onSelect={setPlanId} />
                            </div>
                            <p className="mt-3 flex max-w-xl items-start gap-2 text-sm font-medium text-base-content/60">
                                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
                                Your plan's monthly credits are what make these rates cheaper than listed. Once you use
                                them up, pricing reverts to standard.
                            </p>
                        </div>
                        <div className="shrink-0">
                            <h2 className="text-sm font-bold uppercase tracking-wide text-base-content/60">
                                Find a model
                            </h2>
                            <div className="mt-3">
                                <SearchInput value={search} onChange={setSearch} />
                            </div>
                        </div>
                    </div>
                    {/* Plan math */}
                    <div className="mt-5 flex flex-wrap gap-3 text-sm font-bold">
                        <span className="badge badge-lg badge-secondary px-4 py-4 font-bold">
                            ${plan.monthlyCost}/mo cost
                        </span>
                        <span className="badge badge-lg badge-secondary px-4 py-4 font-bold">
                            ${plan.monthlyCredits.toLocaleString()} included credits
                        </span>
                        <span className="badge badge-lg badge-accent px-4 py-4 font-bold">
                            {multiplier.toFixed(2)}× effective multiplier
                        </span>
                    </div>
                </section>

                {/* Table */}
                <section className="mt-8">
                    <PricingTable rows={rows} plan={plan} sortKey={sort.key} sortDir={sort.dir} onSort={handleSort} />
                </section>

                <footer className="mt-8 pb-4 text-center text-sm font-medium text-base-content/60">
                    Prices are manually curated in <code className="font-mono">src/data/models.ts</code> and valued at
                    listed rates. Not affiliated with any model provider.
                </footer>
            </div>
        </div>
    );
}
