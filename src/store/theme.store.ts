"use client";

import { create } from "zustand";

type Theme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggle: () => void;
}

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const saved = localStorage.getItem("otm-theme") as Theme | null;
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(t: Theme) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", t === "dark");
  localStorage.setItem("otm-theme", t);
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: "light",

  setTheme: (t) => {
    applyTheme(t);
    set({ theme: t });
  },

  toggle: () =>
    set((s) => {
      const next = s.theme === "dark" ? "light" : "dark";
      applyTheme(next);
      return { theme: next };
    }),
}));

/** Call once on app mount to hydrate from localStorage / system preference */
export function initializeTheme() {
  const t = getInitialTheme();
  applyTheme(t);
  useThemeStore.setState({ theme: t });
}
