"use client";

import Link from "next/link";

interface SidebarNavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
}

export default function SidebarNavItem({
  href,
  icon,
  label,
  active = false,
  collapsed = false,
  onClick,
}: SidebarNavItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={[
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
        collapsed ? "justify-center" : "",
        active
          ? "bg-primary/10 font-medium text-primary"
          : "text-muted hover:bg-primary/10 hover:text-primary",
      ].join(" ")}
    >
      <span className="text-lg">{icon}</span>
      {!collapsed && <span>{label}</span>}
    </Link>
  );
}
