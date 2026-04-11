"use client";

import { useState } from "react";
import { ConfigProvider, theme as antdTheme } from "antd";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthInitializer from "@/components/atoms/AuthInitializer";
import { useThemeStore, initializeTheme } from "@/store/theme.store";

export default function Providers({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((s) => s.theme);
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  useEffect(() => {
    initializeTheme();
  }, []);

  const isDark = theme === "dark";

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={{
          algorithm: isDark
            ? antdTheme.darkAlgorithm
            : antdTheme.defaultAlgorithm,
          token: {
            colorPrimary: isDark ? "#818CF8" : "#4F46E5",
            colorSuccess: "#10B981",
            colorWarning: "#F59E0B",
            colorError: "#EF4444",
            colorInfo: "#06B6D4",
            borderRadius: 12,
            fontFamily: "var(--font-geist-sans), Arial, Helvetica, sans-serif",
            // Dark mode base colors
            ...(isDark && {
              colorBgContainer: "#151C2C",
              colorBgElevated: "#1A2236",
              colorBgLayout: "#0B0F1A",
              colorBgSpotlight: "#1E293B",
              colorBorder: "#1E293B",
              colorBorderSecondary: "#1E293B",
              colorText: "#F1F5F9",
              colorTextSecondary: "#94A3B8",
              colorTextTertiary: "#64748B",
              colorTextQuaternary: "#475569",
              colorFill: "#1E293B",
              colorFillSecondary: "#1A2236",
              colorFillTertiary: "#151C2C",
              colorFillQuaternary: "#0F172A",
              colorBgTextHover: "rgba(129,140,248,0.08)",
              colorBgTextActive: "rgba(129,140,248,0.15)",
            }),
          },
          components: {
            Layout: {
              headerBg: isDark ? "#151C2C" : "#FFFFFF",
              bodyBg: isDark ? "#0B0F1A" : "#F8FAFC",
              footerBg: isDark ? "#0B0F1A" : "#F8FAFC",
            },
            Menu: { itemBg: "transparent" },
            Modal: {
              ...(isDark && {
                headerBg: "#1A2236",
                contentBg: "#1A2236",
                footerBg: "#1A2236",
                titleColor: "#F1F5F9",
              }),
            },
            Select: {
              ...(isDark && {
                optionActiveBg: "rgba(129,140,248,0.12)",
                optionSelectedBg: "rgba(129,140,248,0.18)",
                selectorBg: "#151C2C",
                multipleItemBg: "#1E293B",
              }),
            },
            DatePicker: {
              ...(isDark && {
                cellActiveWithRangeBg: "rgba(129,140,248,0.12)",
              }),
            },
            Input: {
              ...(isDark && {
                activeBg: "#151C2C",
                hoverBg: "#151C2C",
              }),
            },
            Popconfirm: {
              ...(isDark && {
                colorWarning: "#F59E0B",
              }),
            },
            Button: {
              ...(isDark && {
                defaultBg: "#1A2236",
                defaultBorderColor: "#1E293B",
                defaultColor: "#F1F5F9",
                defaultHoverBg: "#1E293B",
                defaultHoverBorderColor: "#818CF8",
                defaultHoverColor: "#818CF8",
              }),
            },
          },
        }}
      >
        <AuthInitializer />
        {children}
      </ConfigProvider>
    </QueryClientProvider>
  );
}
