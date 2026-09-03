import { useMemo } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { models, type ModelPrice } from "@/data/models";
import { multiplierFor, type Plan } from "@/data/plans";
import { cn } from "@/lib/utils";

export type SortKey =
  | "model"
  | "inputPer1M"
  | "cachedInputPer1M"
  | "outputPer1M"
  | "effectiveInput"
  | "effectiveOutput"
  | "blendedListed"
  | "blendedEffective"
  | "notes";

export type SortDir = "asc" | "desc";

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
  const factor = dir === "asc" ? 1 : -1;
  const get = (row: Row): number | string | null => {
    switch (key) {
      case "model":
        return row.model.model;
      case "inputPer1M":
        return row.model.inputPer1M;
      case "cachedInputPer1M":
        return row.model.cachedInputPer1M;
      case "outputPer1M":
        return row.model.outputPer1M;
      case "effectiveInput":
        return row.effectiveInput;
      case "effectiveOutput":
        return row.effectiveOutput;
      case "blendedListed":
        return row.blendedListed;
      case "blendedEffective":
        return row.blendedEffective;
      case "notes":
        return row.model.notes ?? "";
    }
  };
  return [...rows].sort((a, b) => {
    const av = get(a);
    const bv = get(b);
    if (av === null) return 1;
    if (bv === null) return -1;
    if (typeof av === "string" || typeof bv === "string") {
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
  align?: "left" | "right";
}

// "notes" stays sort-compatible (kept in SortKey) but has no rendered column.
const columns: ColumnDef[] = [
  { key: "model", header: "Model", align: "left" },
  { key: "inputPer1M", header: "Input", sub: "listed $/1M", align: "right" },
  { key: "cachedInputPer1M", header: "Cached input", sub: "listed $/1M", align: "right" },
  { key: "outputPer1M", header: "Output", sub: "listed $/1M", align: "right" },
  { key: "effectiveInput", header: "Effective input", sub: "$/1M w/ plan", align: "right" },
  { key: "effectiveOutput", header: "Effective output", sub: "$/1M w/ plan", align: "right" },
  { key: "blendedListed", header: "Blended (listed)", sub: "3:1 in:out", align: "right" },
  { key: "blendedEffective", header: "Blended (effective)", sub: "3:1 in:out, w/ plan", align: "right" },
];

const TIER_BARS = ["bg-success", "bg-teal-500", "bg-warning", "bg-destructive"];

function tierFor(value: number, max: number, min: number): number {
  if (max <= min) return 0;
  const t = (value - min) / (max - min);
  return Math.min(TIER_BARS.length - 1, Math.floor(t * TIER_BARS.length));
}

export function PricingTable({ rows, plan, sortKey, sortDir, onSort }: PricingTableProps) {
  const bounds = useMemo(() => {
    const all = rows.flatMap((r) => [
      r.model.inputPer1M,
      r.model.cachedInputPer1M ?? null,
      r.model.outputPer1M,
      r.effectiveInput,
      r.effectiveOutput,
      r.blendedListed,
      r.blendedEffective,
    ]);
    const colBound = (i: number, mode: "min" | "max", fallback: number) => {
      const vals = all.filter((_, idx) => idx % 7 === i && all[idx] !== null) as number[];
      if (!vals.length) return fallback;
      return mode === "min" ? Math.min(...vals) : Math.max(...vals);
    };
    return {
      input: [colBound(0, "min", 0), colBound(0, "max", 1)],
      cached: [colBound(1, "min", 0), colBound(1, "max", 1)],
      output: [colBound(2, "min", 0), colBound(2, "max", 1)],
      effInput: [colBound(3, "min", 0), colBound(3, "max", 1)],
      effOutput: [colBound(4, "min", 0), colBound(4, "max", 1)],
      blendedListed: [colBound(5, "min", 0), colBound(5, "max", 1)],
      blendedEffective: [colBound(6, "min", 0), colBound(6, "max", 1)],
    } as Record<string, [number, number]>;
  }, [rows]);

  const barFor = (key: SortKey, value: number): { pct: number; tier: number } | null => {
    const bound = bounds[key];
    if (!bound) return null;
    const [min, max] = bound;
    return {
      pct: Math.max(4, Math.min(100, (value / max) * 100)),
      tier: tierFor(value, max, min),
    };
  };

  const sortIndex = columns.findIndex((c) => c.key === sortKey);

  const priceCells = (row: Row) =>
    (
      [
        { key: "inputPer1M" as const, value: row.model.inputPer1M },
        { key: "cachedInputPer1M" as const, value: row.model.cachedInputPer1M },
        { key: "outputPer1M" as const, value: row.model.outputPer1M },
        { key: "effectiveInput" as const, value: row.effectiveInput },
        { key: "effectiveOutput" as const, value: row.effectiveOutput },
        { key: "blendedListed" as const, value: row.blendedListed },
        { key: "blendedEffective" as const, value: row.blendedEffective },
      ] as const
    ).map(({ key, value }) => {
      const bar = value == null ? null : barFor(key, value);
      return (
        <td key={key} className="whitespace-nowrap px-4 py-3 text-right font-mono tabular-nums">
          {value == null ? (
            <span className="text-muted-foreground">—</span>
          ) : (
            <div className="flex flex-col items-end gap-1.5">
              <span className={cn("font-bold", sortKey === key && "text-primary")}>{fmt(value)}</span>
              {bar && (
                <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn("h-full rounded-full transition-all duration-500", TIER_BARS[bar.tier])}
                    style={{ width: `${bar.pct}%` }}
                  />
                </div>
              )}
            </div>
          )}
        </td>
      );
    });

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-xl shadow-primary/10">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] border-collapse text-sm">
          <thead>
            <tr className="bg-muted/80">
              {columns.map((col) => {
                const active = sortKey === col.key;
                return (
                  <th
                    key={col.key}
                    scope="col"
                    aria-sort={active ? (sortDir === "asc" ? "ascending" : "descending") : undefined}
                    className={cn(
                      "whitespace-nowrap px-4 py-3.5 text-xs font-extrabold uppercase tracking-wide",
                      col.align === "right" ? "text-right" : "text-left",
                      active ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    <button
                      onClick={() => onSort(col.key)}
                      className="inline-flex items-center gap-1 rounded-md transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      title={`Sort by ${col.header}`}
                    >
                      {col.header}
                      {active &&
                        (sortDir === "asc" ? (
                          <ArrowUp className="h-3.5 w-3.5" aria-hidden />
                        ) : (
                          <ArrowDown className="h-3.5 w-3.5" aria-hidden />
                        ))}
                    </button>
                    {col.sub && (
                      <span className="block text-[10px] font-semibold normal-case tracking-normal text-muted-foreground/70">
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
                <td colSpan={columns.length} className="px-4 py-16 text-center text-muted-foreground">
                  <span className="text-4xl" role="img" aria-label="shrug">
                    🤷
                  </span>
                  <p className="mt-3 font-bold">No models match your search.</p>
                  <p className="text-sm">Try a different name — e.g. “glm” or “kimi”.</p>
                </td>
              </tr>
            )}
            {rows.map((row, i) => (
              <tr key={row.model.model} className="border-t border-border/70 transition-colors hover:bg-secondary/60">
                <td className="whitespace-nowrap px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={cn(
                        "grid h-7 w-7 shrink-0 place-items-center rounded-lg text-xs font-black text-white",
                        ["bg-primary", "bg-fuchsia-500", "bg-orange-500", "bg-teal-500"][i % 4]
                      )}
                    >
                      {row.model.model.charAt(0).toUpperCase()}
                    </span>
                    <span className="font-mono text-[13px] font-bold">{row.model.model}</span>
                  </div>
                </td>
                {priceCells(row)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border-t border-border bg-muted/50 px-4 py-2.5 text-xs font-semibold text-muted-foreground">
        Showing <span className="font-extrabold text-foreground">{rows.length}</span> of{" "}
        <span className="font-extrabold text-foreground">{models.length}</span> models · sorted by{" "}
        <span className="font-extrabold text-primary">
          {sortIndex >= 0 ? columns[sortIndex].header.toLowerCase() : "—"}
        </span>{" "}
        ({sortDir === "asc" ? "low → high" : "high → low"}) · plan multiplier{" "}
        <span className="font-extrabold text-primary">{multiplierFor(plan).toFixed(2)}×</span>
      </div>
    </div>
  );
}