"use client";

import { create } from "zustand";
import type { Organization, OrganizationMember } from "@/api/types/organization.types";
import { organizationService } from "@/api/services/organization.service";

interface OrganizationState {
  organizations: Organization[];
  activeOrg: Organization | null;
  userRole: OrganizationMember["role"] | null;
  loading: boolean;

  fetchOrganizations: () => Promise<void>;
  setActiveOrg: (org: Organization) => void;
  fetchUserRole: (orgId: string) => Promise<void>;
}

export const useOrganizationStore = create<OrganizationState>((set, get) => ({
  organizations: [],
  activeOrg: null,
  userRole: null,
  loading: false,

  fetchOrganizations: async () => {
    set({ loading: true });
    try {
      const res = await organizationService.list();
      const orgs = res.data;
      set({ organizations: orgs });

      if (!get().activeOrg && orgs.length > 0) {
        const savedOrgId =
          typeof window !== "undefined"
            ? localStorage.getItem("otm-active-org")
            : null;
        const saved = orgs.find((o) => o.id === savedOrgId);
        const org = saved || orgs[0];
        set({ activeOrg: org });
        await get().fetchUserRole(org.id);
      }
    } catch {
      set({ organizations: [] });
    } finally {
      set({ loading: false });
    }
  },

  setActiveOrg: (org) => {
    set({ activeOrg: org, userRole: null });
    if (typeof window !== "undefined") {
      localStorage.setItem("otm-active-org", org.id);
    }
    get().fetchUserRole(org.id);
  },

  fetchUserRole: async (orgId) => {
    try {
      const res = await organizationService.getMembers(orgId);
      const { useAuthStore } = await import("@/store/auth.store");
      const userId = useAuthStore.getState().user?.id;
      const member = res.data.find((m) => m.user_id === userId);
      set({ userRole: member?.role ?? null });
    } catch {
      set({ userRole: null });
    }
  },
}));
