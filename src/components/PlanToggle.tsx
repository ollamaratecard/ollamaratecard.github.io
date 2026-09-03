import type { Plan } from "@/data/plans";

interface PlanToggleProps {
  plans: Plan[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function PlanToggle({ plans, selectedId, onSelect }: PlanToggleProps) {
  return (
    <div
      role="tablist"
      aria-label="Subscription plan"
      className="inline-flex flex-wrap gap-1 rounded-2xl border border-border bg-muted p-1.5"
    >
      {plans.map((plan) => {
        const active = plan.id === selectedId;
        return (
          <button
            key={plan.id}
            role="tab"
            aria-selected={active}
            onClick={() => onSelect(plan.id)}
            className={`rounded-xl px-4 py-2 text-sm font-extrabold transition-all duration-200 ${
              active
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/30 scale-[1.03]"
                : "text-muted-foreground hover:bg-card hover:text-foreground"
            }`}
          >
            {plan.label}
          </button>
        );
      })}
    </div>
  );
}