import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from "react";

export type Theme = "light" | "dark";

const themeColors: Record<Theme, string> = {
  light: "#F7F6BB",
  dark: "#114232",
};

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";

  try {
    const saved = window.localStorage.getItem("portfolio-theme");
    if (saved === "dark" || saved === "light") return saved;
  } catch {
    // Use the system preference when storage is unavailable.
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [themePressed, setThemePressed] = useState(false);
  const themeTimeoutRef = useRef<number | null>(null);
  const revealTimeoutRef = useRef<number | null>(null);
  const pendingThemeRef = useRef<Theme | null>(null);

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", themeColors[theme]);
    try {
      window.localStorage.setItem("portfolio-theme", theme);
    } catch {
      // Theme still applies for the current session without storage.
    }
  }, [theme]);

  useEffect(() => () => {
    if (themeTimeoutRef.current !== null) window.clearTimeout(themeTimeoutRef.current);
    if (revealTimeoutRef.current !== null) window.clearTimeout(revealTimeoutRef.current);
    document.documentElement.classList.remove("theme-reveal");
    document.documentElement.removeAttribute("data-theme-reveal");
  }, []);

  function finishThemeChange(nextTheme: Theme) {
    pendingThemeRef.current = null;
    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.classList.remove("theme-reveal");
    document.documentElement.removeAttribute("data-theme-reveal");
    setTheme(nextTheme);
    setThemePressed(false);
  }

  function handleThemeToggle(event: MouseEvent<HTMLButtonElement>) {
    if (pendingThemeRef.current) return;

    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    const bounds = event.currentTarget.getBoundingClientRect();
    document.documentElement.style.setProperty("--theme-origin-x", `${bounds.left + bounds.width / 2}px`);
    document.documentElement.style.setProperty("--theme-origin-y", `${bounds.top + bounds.height / 2}px`);
    pendingThemeRef.current = nextTheme;
    setThemePressed(true);

    themeTimeoutRef.current = window.setTimeout(() => {
      themeTimeoutRef.current = null;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        finishThemeChange(nextTheme);
        return;
      }

      document.documentElement.dataset.themeReveal = nextTheme;
      document.documentElement.classList.add("theme-reveal");
      revealTimeoutRef.current = window.setTimeout(() => {
        revealTimeoutRef.current = null;
        finishThemeChange(nextTheme);
      }, 480);
    }, 200);
  }

  return { theme, themePressed, handleThemeToggle };
}
