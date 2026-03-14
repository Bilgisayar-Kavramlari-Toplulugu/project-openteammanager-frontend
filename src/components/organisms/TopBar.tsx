"use client";

import { UserOutlined } from "@ant-design/icons";
import SearchBar from "@/components/molecules/SearchBar";
import SidebarToggle from "@/components/atoms/SidebarToggle";
import { useSidebarStore } from "@/store/sidebar.store";
import { useAuthStore } from "@/store/auth.store";
import BrandMark from "@/components/atoms/BrandMark";

export default function TopBar() {
  const collapsed = useSidebarStore((s) => s.collapsed);
  const toggle = useSidebarStore((s) => s.toggle);
  const mobileOpen = useSidebarStore((s) => s.mobileOpen);
  const setMobileOpen = useSidebarStore((s) => s.setMobileOpen);
  const user = useAuthStore((s) => s.user);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-divider bg-surface px-4 sm:px-6">
      {/* Desktop toggle (only when collapsed, since sidebar has its own toggle when expanded) */}
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

      <div className="ml-auto flex items-center gap-3">
        <SearchBar placeholder="Ara..." />

        {/* Mobile user avatar */}
        {user && (
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary lg:hidden">
            <UserOutlined />
          </span>
        )}
      </div>
    </header>
  );
}
