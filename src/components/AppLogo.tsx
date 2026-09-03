import { BadgeDollarSign } from "lucide-react";

export function AppLogo({ className = "h-11 w-11" }: { className?: string }) {
  return (
    <div
      className={`${className} grid shrink-0 place-items-center rounded-box bg-primary text-primary-content`}
    >
      <BadgeDollarSign className="h-6 w-6" aria-hidden />
    </div>
  );
}
