"use client";

import { usePathname } from "next/navigation";
import {
  DashboardOutlined,
  ProjectOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import BrandMark from "@/components/atoms/BrandMark";
import BrandLogo from "@/components/molecules/BrandLogo";
import SidebarToggle from "@/components/atoms/SidebarToggle";
import SidebarNavItem from "@/components/molecules/SidebarNavItem";
import SidebarUserMenu from "@/components/molecules/SidebarUserMenu";
import ThemeToggle from "@/components/atoms/ThemeToggle";
import { useSidebarStore } from "@/store/sidebar.store";

const navItems = [
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
  const toggle = useSidebarStore((s) => s.toggle);
  const setMobileOpen = useSidebarStore((s) => s.setMobileOpen);

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Header: Logo + Toggle */}
      <div
        className={[
          "flex h-16 shrink-0 items-center border-b border-divider px-4",
          collapsed ? "justify-center" : "justify-between",
        ].join(" ")}
      >
        {collapsed ? (
          <BrandMark size="sm" variant="themed" />
        ) : (
          <BrandLogo variant="themed" size="sm" />
        )}
        <SidebarToggle
          collapsed={collapsed}
          onClick={toggle}
          className={collapsed ? "hidden lg:inline-flex" : "hidden lg:inline-flex"}
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => (
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
      </nav>

      {/* Footer: Theme + User */}
      <div className="shrink-0 border-t border-divider px-3 py-4 space-y-1">
        <div
          className={[
            "flex items-center rounded-lg px-3 py-2.5",
            collapsed ? "justify-center" : "",
          ].join(" ")}
        >
          <ThemeToggle />
        </div>
        <SidebarUserMenu collapsed={collapsed} />
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={[
          "hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 border-r border-divider bg-surface transition-all duration-300",
          collapsed ? "lg:w-[72px]" : "lg:w-64",
        ].join(" ")}
      >
        {sidebarContent}
      </aside>

      {/* Mobile overlay backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-divider bg-surface transition-transform duration-300 lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
