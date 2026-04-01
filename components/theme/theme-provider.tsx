"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type Theme = "light" | "dark";
type StoredTheme = Theme | "system";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: StoredTheme) => void;
};

const STORAGE_KEY = "theme";
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;

  root.classList.remove("light", "dark");
  root.classList.add(theme);
  root.style.colorScheme = theme;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const syncTheme = () => {
      const storedTheme = window.localStorage.getItem(STORAGE_KEY) as StoredTheme | null;
      const nextTheme = storedTheme === "light" || storedTheme === "dark" ? storedTheme : getSystemTheme();

      setThemeState(nextTheme);
      applyTheme(nextTheme);
    };

    syncTheme();

    const onMediaChange = () => {
      const storedTheme = window.localStorage.getItem(STORAGE_KEY);

      if (!storedTheme || storedTheme === "system") {
        syncTheme();
      }
    };

    mediaQuery.addEventListener("change", onMediaChange);

    return () => {
      mediaQuery.removeEventListener("change", onMediaChange);
    };
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme(nextTheme) {
        const resolvedTheme = nextTheme === "system" ? getSystemTheme() : nextTheme;

        window.localStorage.setItem(STORAGE_KEY, nextTheme);
        setThemeState(resolvedTheme);
        applyTheme(resolvedTheme);
      },
    }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}
