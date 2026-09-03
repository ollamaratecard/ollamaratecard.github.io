export interface Plan {
  id: string;
  label: string;
  monthlyCost: number; // effective $/mo (yearly plans divided down to a monthly figure)
  monthlyCredits: number; // $ of usage credits included per month, valued at listed rates
}

export const plans: Plan[] = [
  { id: "pro-monthly", label: "Pro (Monthly)", monthlyCost: 20, monthlyCredits: 60 },
  { id: "pro-yearly", label: "Pro (Yearly)", monthlyCost: 16.67, monthlyCredits: 60 },
  { id: "max", label: "Max", monthlyCost: 100, monthlyCredits: 300 },
  { id: "team", label: "Team", monthlyCost: 500, monthlyCredits: 1000 },
];

export const multiplierFor = (plan: Plan): number => plan.monthlyCredits / plan.monthlyCost;