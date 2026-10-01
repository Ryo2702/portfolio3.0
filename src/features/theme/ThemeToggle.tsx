import { Moon, Sun } from "lucide-react";
import type { MouseEvent } from "react";
import type { Theme } from "./useTheme";

export function ThemeToggle({
  theme,
  pressed,
  onToggle,
}: {
  theme: Theme;
  pressed: boolean;
  onToggle: (event: MouseEvent<HTMLButtonElement>) => void;
}) {
  const Icon = theme === "dark" ? Sun : Moon;

  return (
    <button
      className={`theme-toggle theme-toggle-${theme} ${pressed ? "is-pressed" : ""}`}
      type="button"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      aria-pressed={theme === "dark"}
      aria-busy={pressed}
      onClick={onToggle}
    >
      <span className="theme-toggle-icon" aria-hidden="true">
        <Icon size={16} />
      </span>
      <span className="theme-toggle-label">{theme === "dark" ? "Light mode" : "Dark mode"}</span>
    </button>
  );
}
