"use client";

import { create } from "zustand";

const STORAGE_KEY = "otm-sidebar-collapsed";

interface SidebarState {
  collapsed: boolean;
  mobileOpen: boolean;
  toggle: () => void;
  setCollapsed: (v: boolean) => void;
  setMobileOpen: (v: boolean) => void;
}

function getInitialCollapsed(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEY) === "true";
}

export const useSidebarStore = create<SidebarState>((set) => ({
  collapsed: getInitialCollapsed(),
  mobileOpen: false,

  toggle: () =>
    set((s) => {
      const next = !s.collapsed;
      localStorage.setItem(STORAGE_KEY, String(next));
      return { collapsed: next };
    }),

  setCollapsed: (v) => {
    localStorage.setItem(STORAGE_KEY, String(v));
    set({ collapsed: v });
  },

  setMobileOpen: (v) => set({ mobileOpen: v }),
}));
