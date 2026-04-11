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
        "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
        collapsed ? "justify-center" : "",
        active
          ? "bg-primary/10 text-primary shadow-sm shadow-primary/5"
          : "text-muted hover:bg-primary/5 hover:text-foreground",
      ].join(" ")}
    >
      {/* Active indicator */}
      {active && (
        <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-primary" />
      )}
      <span className={[
        "text-lg transition-transform duration-200",
        active ? "" : "group-hover:scale-110",
      ].join(" ")}>
        {icon}
      </span>
      {!collapsed && <span>{label}</span>}
    </Link>
  );
}
