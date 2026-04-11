"use client";

import { usePathname } from "next/navigation";
import {
  DashboardOutlined,
  ProjectOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import BrandMark from "@/components/atoms/BrandMark";
import BrandLogo from "@/components/molecules/BrandLogo";
import SidebarNavItem from "@/components/molecules/SidebarNavItem";
import SidebarUserMenu from "@/components/molecules/SidebarUserMenu";
import OrgSwitcher from "@/components/molecules/OrgSwitcher";
import { useSidebarStore } from "@/store/sidebar.store";

const mainNavItems = [
  {
    key: "dashboard",
    href: "/dashboard",
    icon: <DashboardOutlined />,
    label: "Dashboard",
  },
  {
    key: "projects",
    href: "/projects",
    icon: <ProjectOutlined />,
    label: "Projeler",
  },
  {
    key: "community",
    href: "/community",
    icon: <TeamOutlined />,
    label: "Topluluk",
  },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const collapsed = useSidebarStore((s) => s.collapsed);
  const mobileOpen = useSidebarStore((s) => s.mobileOpen);
  const setMobileOpen = useSidebarStore((s) => s.setMobileOpen);

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Header: Logo */}
      <div
        className={[
          "flex h-16 shrink-0 items-center border-b border-divider/50 px-4",
          collapsed ? "justify-center" : "",
        ].join(" ")}
      >
        {collapsed ? (
          <BrandMark size="sm" variant="themed" />
        ) : (
          <BrandLogo variant="themed" size="sm" />
        )}
      </div>

      {/* Org Switcher */}
      <div className="shrink-0 border-b border-divider/50 px-3 py-3">
        <OrgSwitcher collapsed={collapsed} />
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {/* Section label */}
        {!collapsed && (
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted/60">
            Menü
          </p>
        )}
        <div className="space-y-0.5">
          {mainNavItems.map((item) => (
            <SidebarNavItem
              key={item.key}
              href={item.href}
              icon={item.icon}
              label={item.label}
              active={pathname.startsWith(item.href)}
              collapsed={collapsed}
              onClick={() => setMobileOpen(false)}
            />
          ))}
        </div>
      </nav>

      {/* Footer: User */}
      <div className="shrink-0 border-t border-divider/50 px-3 py-3">
        <SidebarUserMenu collapsed={collapsed} />
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={[
          "hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 border-r border-divider/50 bg-surface/80 backdrop-blur-xl transition-all duration-300",
          collapsed ? "lg:w-[72px]" : "lg:w-64",
        ].join(" ")}
      >
        {sidebarContent}
      </aside>

      {/* Mobile overlay backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-divider/50 bg-surface shadow-2xl transition-transform duration-300 lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
