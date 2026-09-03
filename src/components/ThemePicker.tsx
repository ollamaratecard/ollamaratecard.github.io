import { useEffect, useRef, useState } from "react";
import { Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import { daisyThemes, DEFAULT_THEME, type DaisyTheme } from "@/data/themes";

const STORAGE_KEY = "ollamaratecard-theme";

function ThemeSwatch({ swatch }: { swatch: [string, string, string] }) {
  return (
    <span className="theme-swatch">
      {swatch.map((c, i) => (
        <span key={i} style={{ backgroundColor: c }} />
      ))}
    </span>
  );
}

export function ThemePicker() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    const stored = typeof localStorage !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    return stored && daisyThemes.some((t) => t.id === stored) ? stored : DEFAULT_THEME;
  });
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    if (!open) return;
    const onOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const current = daisyThemes.find((t) => t.id === theme) ?? daisyThemes[0];

  const pick = (t: DaisyTheme) => {
    setTheme(t.id);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        title="Change theme"
        className="inline-flex h-11 items-center gap-2 rounded-2xl border border-border bg-card px-4 text-sm font-extrabold shadow-sm transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Palette className="h-4 w-4 text-primary" aria-hidden />
        <ThemeSwatch swatch={current.swatch} />
        <span className="hidden sm:inline">{current.label}</span>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Theme"
          className="absolute right-0 z-50 mt-2 max-h-96 w-56 overflow-y-auto rounded-2xl border border-border bg-card p-2 shadow-xl"
        >
          {daisyThemes.map((t) => (
            <li key={t.id}>
              <button
                role="option"
                aria-selected={t.id === theme}
                onClick={() => pick(t)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-bold transition-colors",
                  t.id === theme
                    ? "bg-secondary text-secondary-foreground"
                    : "hover:bg-muted"
                )}
              >
                <ThemeSwatch swatch={t.swatch} />
                <span className="flex-1">{t.label}</span>
                {t.id === theme && <span className="text-primary">✓</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
