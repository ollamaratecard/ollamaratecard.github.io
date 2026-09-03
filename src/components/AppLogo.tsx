import { BadgeDollarSign } from "lucide-react";

export function AppLogo({ className = "h-11 w-11" }: { className?: string }) {
  return (
    <div
      className={`${className} grid shrink-0 place-items-center rounded-2xl bg-primary shadow-[0_4px_14px_-2px] shadow-primary/50`}
    >
      <BadgeDollarSign className="h-6 w-6 text-primary-foreground" aria-hidden />
    </div>
  );
}