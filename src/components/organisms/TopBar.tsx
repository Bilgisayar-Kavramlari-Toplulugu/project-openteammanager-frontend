"use client";

import { BellOutlined } from "@ant-design/icons";
import SearchBar from "@/components/molecules/SearchBar";
import SidebarToggle from "@/components/atoms/SidebarToggle";
import ThemeToggle from "@/components/atoms/ThemeToggle";
import { useSidebarStore } from "@/store/sidebar.store";
import { useOrganizationStore } from "@/store/organization.store";
import BrandMark from "@/components/atoms/BrandMark";

export default function TopBar() {
  const collapsed = useSidebarStore((s) => s.collapsed);
  const toggle = useSidebarStore((s) => s.toggle);
  const mobileOpen = useSidebarStore((s) => s.mobileOpen);
  const setMobileOpen = useSidebarStore((s) => s.setMobileOpen);
  const activeOrg = useOrganizationStore((s) => s.activeOrg);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-divider/50 bg-surface/70 px-4 backdrop-blur-xl sm:px-6">
      {/* Desktop toggle */}
      <SidebarToggle
        collapsed={collapsed}
        onClick={toggle}
        className="hidden lg:inline-flex"
      />

      {/* Mobile: brand + hamburger */}
      <div className="flex items-center gap-2 lg:hidden">
        <SidebarToggle
          collapsed={!mobileOpen}
          onClick={() => setMobileOpen(!mobileOpen)}
        />
        <BrandMark size="sm" variant="themed" />
      </div>

      {/* Breadcrumb - org name */}
      {activeOrg && (
        <div className="hidden items-center gap-2 text-sm lg:flex">
          <span className="text-muted">/</span>
          <span className="font-medium text-foreground">{activeOrg.name}</span>
        </div>
      )}

      <div className="ml-auto flex items-center gap-2">
        <SearchBar placeholder="Ara..." />

        {/* Notifications placeholder */}
        <button
          type="button"
          className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl text-muted transition-colors hover:bg-primary/5 hover:text-foreground"
          title="Bildirimler"
        >
          <BellOutlined className="text-base" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
        </button>

        <ThemeToggle />
      </div>
    </header>
  );
}
