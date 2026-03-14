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

  return (
    <div className="space-y-1">
      <div
        className={[
          "flex items-center gap-3 rounded-lg px-3 py-2.5",
          collapsed ? "justify-center" : "",
        ].join(" ")}
        title={collapsed ? user.full_name : undefined}
      >
        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
          <UserOutlined />
        </span>
        {!collapsed && (
          <span className="truncate text-sm text-foreground">
            {user.full_name}
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={logout}
        title={collapsed ? "Çıkış Yap" : undefined}
        className={[
          "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted transition-colors hover:bg-danger/10 hover:text-danger",
          collapsed ? "justify-center" : "",
        ].join(" ")}
      >
        <LogoutOutlined className="text-lg" />
        {!collapsed && <span>Çıkış Yap</span>}
      </button>
    </div>
  );
}
