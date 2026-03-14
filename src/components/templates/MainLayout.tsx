"use client";

import { useEffect } from "react";
import AppSidebar from "@/components/organisms/AppSidebar";
import TopBar from "@/components/organisms/TopBar";
import { useSidebarStore } from "@/store/sidebar.store";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const collapsed = useSidebarStore((s) => s.collapsed);
  const mobileOpen = useSidebarStore((s) => s.mobileOpen);

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppSidebar />

      {/* Main content area — offset by sidebar width on desktop */}
      <div
        className={[
          "flex min-h-screen flex-col transition-all duration-300",
          collapsed ? "lg:ml-[72px]" : "lg:ml-64",
        ].join(" ")}
      >
        <TopBar />

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>

        <footer className="border-t border-divider px-6 py-4 text-center text-xs text-muted">
          OpenTeamManager &copy; {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
}
