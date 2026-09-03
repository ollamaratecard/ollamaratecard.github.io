export function AppLogo({ className = 'h-25 w-25' }: { className?: string }) {
    return (
        <img
            src="./ollama-rate-card-logo-v2-512x.png"
            alt="OllamaRateCard logo"
            className={`${className} shrink-0 object-contain`}
        />
    );
}
