import type { Plan } from '@/data/plans';

interface PlanToggleProps {
    plans: Plan[];
    selectedId: string;
    onSelect: (id: string) => void;
}

export function PlanToggle({ plans, selectedId, onSelect }: PlanToggleProps) {
    return (
        <fieldset
            aria-label="Subscription plan"
            className="inline-flex flex-wrap gap-1 rounded-box border border-base-300 bg-base-200 p-1.5"
        >
            {plans.map((plan) => {
                const active = plan.id === selectedId;
                return (
                    <button
                        key={plan.id}
                        type="button"
                        aria-pressed={active}
                        onClick={() => onSelect(plan.id)}
                        className={`btn btn-sm rounded-field px-4 ${active ? 'btn-primary' : 'btn-ghost'}`}
                    >
                        {plan.label}
                    </button>
                );
            })}
        </fieldset>
    );
}
