"use client";

import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { useAuthStore } from "@/store/auth.store";

interface SidebarUserMenuProps {
  collapsed?: boolean;
}

export default function SidebarUserMenu({
  collapsed = false,
}: SidebarUserMenuProps) {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  if (!user) return null;

  const initials = user.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="space-y-0.5">
      <div
        className={[
          "flex items-center gap-3 rounded-xl px-3 py-2.5",
          collapsed ? "justify-center" : "",
        ].join(" ")}
        title={collapsed ? user.full_name : undefined}
      >
        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-hover text-[11px] font-bold text-white">
          {initials || <UserOutlined />}
        </span>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground leading-tight">
              {user.full_name}
            </p>
            <p className="truncate text-[11px] text-muted leading-tight">
              @{user.username}
            </p>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={logout}
        title={collapsed ? "Çıkış Yap" : undefined}
        className={[
          "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted transition-all duration-200 hover:bg-danger/10 hover:text-danger",
          collapsed ? "justify-center" : "",
        ].join(" ")}
      >
        <LogoutOutlined className="text-lg" />
        {!collapsed && <span>Çıkış Yap</span>}
      </button>
    </div>
  );
}
