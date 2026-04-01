"use client";

import { useState } from "react";
import {
  PlusOutlined,
  SwapOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { useOrganizationStore } from "@/store/organization.store";
import CreateOrganizationModal from "@/components/organisms/organizations/CreateOrganizationModal";

interface OrgSwitcherProps {
  collapsed?: boolean;
}

export default function OrgSwitcher({ collapsed = false }: OrgSwitcherProps) {
  const organizations = useOrganizationStore((s) => s.organizations);
  const activeOrg = useOrganizationStore((s) => s.activeOrg);
  const setActiveOrg = useOrganizationStore((s) => s.setActiveOrg);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  if (!activeOrg && organizations.length === 0) {
    return (
      <>
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="flex w-full items-center gap-2.5 rounded-lg border border-dashed border-divider px-3 py-2.5 text-sm text-muted transition-colors hover:border-primary hover:text-primary"
        >
          <PlusOutlined className="text-base" />
          {!collapsed && <span>Organizasyon Oluştur</span>}
        </button>
        <CreateOrganizationModal
          open={createOpen}
          onClose={() => setCreateOpen(false)}
        />
      </>
    );
  }

  return (
    <>
      <div className="relative">
        <button
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          title={collapsed ? activeOrg?.name : undefined}
          className={[
            "flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 transition-colors hover:bg-primary/5",
            collapsed ? "justify-center" : "",
          ].join(" ")}
        >
          {/* Org avatar */}
          <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
            {activeOrg?.name?.charAt(0).toUpperCase() || "O"}
          </span>
          {!collapsed && (
            <>
              <span className="min-w-0 flex-1 truncate text-left text-sm font-medium text-foreground">
                {activeOrg?.name}
              </span>
              <SwapOutlined className="shrink-0 text-xs text-muted" />
            </>
          )}
        </button>

        {/* Dropdown */}
        {dropdownOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setDropdownOpen(false)}
            />
            <div className="absolute left-0 top-full z-50 mt-1 w-64 rounded-xl border border-divider bg-surface p-1.5 shadow-xl">
              <div className="mb-1 px-2 py-1.5 text-[11px] font-medium uppercase tracking-wider text-muted">
                Organizasyonlar
              </div>
              {organizations.map((org) => (
                <button
                  key={org.id}
                  type="button"
                  onClick={() => {
                    setActiveOrg(org);
                    setDropdownOpen(false);
                  }}
                  className={[
                    "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors",
                    org.id === activeOrg?.id
                      ? "bg-primary/5 text-primary"
                      : "text-foreground hover:bg-background",
                  ].join(" ")}
                >
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-[10px] font-bold text-primary">
                    {org.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-left">
                    {org.name}
                  </span>
                  {org.id === activeOrg?.id && (
                    <CheckOutlined className="shrink-0 text-xs text-primary" />
                  )}
                </button>
              ))}

              <div className="mt-1 border-t border-divider pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setDropdownOpen(false);
                    setCreateOpen(true);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-muted transition-colors hover:bg-background hover:text-foreground"
                >
                  <PlusOutlined className="text-xs" />
                  Yeni Organizasyon
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <CreateOrganizationModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </>
  );
}
