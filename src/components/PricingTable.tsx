import { ArrowDown, ArrowUp } from 'lucide-react';
import { type ModelPrice, models } from '@/data/models';
import { multiplierFor, type Plan } from '@/data/plans';
import { cn } from '@/lib/utils';

export type SortKey =
    | 'model'
    | 'inputPer1M'
    | 'cachedInputPer1M'
    | 'outputPer1M'
    | 'effectiveInput'
    | 'effectiveOutput'
    | 'blendedListed'
    | 'blendedEffective'
    | 'notes';

export type SortDir = 'asc' | 'desc';

export interface Row {
    model: ModelPrice;
    effectiveInput: number;
    effectiveOutput: number;
    blendedListed: number;
    blendedEffective: number;
}

export function buildRows(plan: Plan): Row[] {
    const m = multiplierFor(plan);
    return models.map((model) => {
        const effectiveInput = model.inputPer1M / m;
        const effectiveOutput = model.outputPer1M / m;
        return {
            model,
            effectiveInput,
            effectiveOutput,
            blendedListed: (model.inputPer1M * 3 + model.outputPer1M) / 4,
            blendedEffective: (effectiveInput * 3 + effectiveOutput) / 4,
        };
    });
}

export function sortRows(rows: Row[], key: SortKey, dir: SortDir): Row[] {
    const factor = dir === 'asc' ? 1 : -1;
    const get = (row: Row): number | string | null => {
        switch (key) {
            case 'model':
                return row.model.model;
            case 'inputPer1M':
                return row.model.inputPer1M;
            case 'cachedInputPer1M':
                return row.model.cachedInputPer1M;
            case 'outputPer1M':
                return row.model.outputPer1M;
            case 'effectiveInput':
                return row.effectiveInput;
            case 'effectiveOutput':
                return row.effectiveOutput;
            case 'blendedListed':
                return row.blendedListed;
            case 'blendedEffective':
                return row.blendedEffective;
            case 'notes':
                return row.model.notes ?? '';
        }
    };
    return [...rows].sort((a, b) => {
        const av = get(a);
        const bv = get(b);
        if (av === null) return 1;
        if (bv === null) return -1;
        if (typeof av === 'string' || typeof bv === 'string') {
            return String(av).localeCompare(String(bv)) * factor;
        }
        return (av - bv) * factor;
    });
}

const fmt = (n: number): string => {
    if (n !== 0 && n < 0.01) return `$${n.toFixed(4)}`;
    return `$${n.toFixed(n < 1 ? 3 : 2)}`;
};

interface PricingTableProps {
    rows: Row[];
    plan: Plan;
    sortKey: SortKey;
    sortDir: SortDir;
    onSort: (key: SortKey) => void;
}

interface ColumnDef {
    key: SortKey;
    header: string;
    sub?: string;
    align?: 'left' | 'right';
}

// "notes" stays sort-compatible (kept in SortKey) but has no rendered column.
const columns: ColumnDef[] = [
    { key: 'model', header: 'Model', align: 'left' },
    { key: 'inputPer1M', header: 'Input', sub: 'listed $/1M', align: 'right' },
    { key: 'cachedInputPer1M', header: 'Cached input', sub: 'listed $/1M', align: 'right' },
    { key: 'outputPer1M', header: 'Output', sub: 'listed $/1M', align: 'right' },
    { key: 'effectiveInput', header: 'Effective input', sub: '$/1M w/ plan', align: 'right' },
    { key: 'effectiveOutput', header: 'Effective output', sub: '$/1M w/ plan', align: 'right' },
    { key: 'blendedListed', header: 'Blended (listed)', sub: '3:1 in:out', align: 'right' },
    { key: 'blendedEffective', header: 'Blended (effective)', sub: '3:1 in:out, w/ plan', align: 'right' },
];

export function PricingTable({ rows, plan, sortKey, sortDir, onSort }: PricingTableProps) {
    const priceCells = (row: Row) =>
        (
            [
                { key: 'inputPer1M' as const, value: row.model.inputPer1M },
                { key: 'cachedInputPer1M' as const, value: row.model.cachedInputPer1M },
                { key: 'outputPer1M' as const, value: row.model.outputPer1M },
                { key: 'effectiveInput' as const, value: row.effectiveInput },
                { key: 'effectiveOutput' as const, value: row.effectiveOutput },
                { key: 'blendedListed' as const, value: row.blendedListed },
                { key: 'blendedEffective' as const, value: row.blendedEffective },
            ] as const
        ).map(({ key, value }) => (
            <td key={key} className="whitespace-nowrap px-3 py-3 text-right font-mono tabular-nums">
                {value == null ? (
                    <span className="text-base-content/50">—</span>
                ) : (
                    <span className={cn('font-bold', sortKey === key && 'text-primary')}>{fmt(value)}</span>
                )}
            </td>
        ));

    const sortIndex = columns.findIndex((c) => c.key === sortKey);

    return (
        <div className="rounded-box border border-base-300 bg-base-100">
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr className="bg-base-200">
                            {columns.map((col) => {
                                const active = sortKey === col.key;
                                return (
                                    <th
                                        key={col.key}
                                        scope="col"
                                        aria-sort={
                                            active ? (sortDir === 'asc' ? 'ascending' : 'descending') : undefined
                                        }
                                        className={cn(
                                            'whitespace-nowrap px-3 py-3 text-xs font-bold uppercase tracking-wide',
                                            col.align === 'right' ? 'text-right' : 'text-left',
                                            active ? 'text-primary' : 'text-base-content/60'
                                        )}
                                    >
                                        <button
                                            type="button"
                                            onClick={() => onSort(col.key)}
                                            className="inline-flex cursor-pointer items-center gap-1 transition-colors hover:text-primary"
                                            title={`Sort by ${col.header}`}
                                        >
                                            {col.header}
                                            {active &&
                                                (sortDir === 'asc' ? (
                                                    <ArrowUp className="h-3.5 w-3.5" aria-hidden />
                                                ) : (
                                                    <ArrowDown className="h-3.5 w-3.5" aria-hidden />
                                                ))}
                                        </button>
                                        {col.sub && (
                                            <span className="block text-xs font-medium normal-case tracking-normal text-base-content/50">
                                                {col.sub}
                                            </span>
                                        )}
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.length === 0 && (
                            <tr>
                                <td colSpan={columns.length} className="px-4 py-16 text-center text-base-content/60">
                                    <span className="text-4xl" role="img" aria-label="shrug">
                                        🤷
                                    </span>
                                    <p className="mt-3 font-bold">No models match your search.</p>
                                    <p className="text-sm">Try a different name — e.g. glm or kimi.</p>
                                </td>
                            </tr>
                        )}
                        {rows.map((row, i) => (
                            <tr key={row.model.model} className="hover:bg-base-200">
                                <td className="whitespace-nowrap px-3 py-3">
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={cn(
                                                'badge px-2.5 font-bold',
                                                ['badge-primary', 'badge-secondary', 'badge-accent', 'badge-neutral'][
                                                    i % 4
                                                ]
                                            )}
                                        >
                                            {row.model.model.charAt(0).toUpperCase()}
                                        </span>
                                        <span className="font-mono text-sm font-bold">{row.model.model}</span>
                                    </div>
                                </td>
                                {priceCells(row)}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="border-t border-base-300 bg-base-200/50 px-4 py-2.5 text-sm font-medium text-base-content/70">
                Showing <span className="font-bold text-base-content">{rows.length}</span> of{' '}
                <span className="font-bold text-base-content">{models.length}</span> models · sorted by{' '}
                <span className="font-bold text-primary">
                    {sortIndex >= 0 ? columns[sortIndex].header.toLowerCase() : '—'}
                </span>{' '}
                ({sortDir === 'asc' ? 'low → high' : 'high → low'}) · plan multiplier{' '}
                <span className="font-bold text-primary">{multiplierFor(plan).toFixed(2)}×</span>
            </div>
        </div>
    );
}
