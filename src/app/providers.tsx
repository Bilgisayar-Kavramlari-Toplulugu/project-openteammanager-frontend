"use client";

import { ConfigProvider, theme as antdTheme } from "antd";
import { useEffect } from "react";
import AuthInitializer from "@/components/atoms/AuthInitializer";
import { useThemeStore, initializeTheme } from "@/store/theme.store";

export default function Providers({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    initializeTheme();
  }, []);

  return (
    <ConfigProvider
      theme={{
        algorithm:
          theme === "dark"
            ? antdTheme.darkAlgorithm
            : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: "#4F46E5",
          colorSuccess: "#10B981",
          colorWarning: "#F59E0B",
          colorError: "#EF4444",
          colorInfo: "#06B6D4",
          borderRadius: 10,
          fontFamily: "var(--font-geist-sans), Arial, Helvetica, sans-serif",
        },
        components: {
          Layout: {
            headerBg: theme === "dark" ? "#151C2C" : "#FFFFFF",
            bodyBg: theme === "dark" ? "#0B0F1A" : "#F8FAFC",
            footerBg: theme === "dark" ? "#0B0F1A" : "#F8FAFC",
          },
          Menu: { itemBg: "transparent" },
        },
      }}
    >
      <AuthInitializer />
      {children}
    </ConfigProvider>
  );
}
