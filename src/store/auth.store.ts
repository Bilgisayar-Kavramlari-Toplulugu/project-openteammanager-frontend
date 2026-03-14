"use client";

import { create } from "zustand";
import type { User } from "@/api/types/user.types";
import {
  authService,
  type LoginRequest,
  type RegisterRequest,
} from "@/api/services/auth.service";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isHydrating: boolean;

  setSession: (payload: { user: User; accessToken: string }) => void;
  setAccessToken: (token: string) => void;
  clearSession: () => void;
  fetchMe: () => Promise<void>;
  refreshSession: () => Promise<void>;
  initializeAuth: () => Promise<void>;
  login: (payload: LoginRequest) => Promise<void>;
  register: (payload: RegisterRequest) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isHydrating: true,

  setSession: ({ user, accessToken }) =>
    set({ user, accessToken, isAuthenticated: true }),

  setAccessToken: (token) => set({ accessToken: token }),

  clearSession: () =>
    set({ user: null, accessToken: null, isAuthenticated: false }),

  fetchMe: async () => {
    const res = await authService.me();
    set({ user: res.data, isAuthenticated: true });
  },

  refreshSession: async () => {
    const res = await authService.refresh();
    set({ accessToken: res.data.access_token, isAuthenticated: true });
  },

  initializeAuth: async () => {
    if (!get().isHydrating) return;

    try {
      await get().refreshSession();
      await get().fetchMe();
    } catch {
      get().clearSession();
    } finally {
      set({ isHydrating: false });
    }
  },

  login: async (payload) => {
    const res = await authService.login(payload);
    set({ accessToken: res.data.access_token });

    await get().fetchMe();
  },

  register: async (payload) => {
    await authService.register(payload);
  },

  logout: () => {
    get().clearSession();
  },
}));
