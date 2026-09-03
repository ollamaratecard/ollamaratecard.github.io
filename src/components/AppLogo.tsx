export function AppLogo({ className = "h-11 w-11" }: { className?: string }) {
  return (
    <img
      src="./logo.png"
      alt="OllamaRateCard logo"
      className={`${className} shrink-0 object-contain`}
    />
  );
}
