"use client";

import { MenuOutlined, MenuFoldOutlined } from "@ant-design/icons";

interface SidebarToggleProps {
  collapsed?: boolean;
  onClick: () => void;
  className?: string;
}

export default function SidebarToggle({
  collapsed,
  onClick,
  className = "",
}: SidebarToggleProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={collapsed ? "Menüyü aç" : "Menüyü kapat"}
      className={[
        "inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-primary/10 hover:text-primary",
        className,
      ].join(" ")}
    >
      {collapsed ? (
        <MenuOutlined className="text-base" />
      ) : (
        <MenuFoldOutlined className="text-base" />
      )}
    </button>
  );
}
