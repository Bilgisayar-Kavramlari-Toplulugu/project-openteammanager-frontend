"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spin } from "antd";
import MainLayout from "@/components/templates/MainLayout";
import { useAuthStore } from "@/store/auth.store";

interface Props {
  children: React.ReactNode;
}

export default function ProtectedAppLayout({ children }: Props) {
  const router = useRouter();
  const isHydrating = useAuthStore((s) => s.isHydrating);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (!isHydrating && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isHydrating, isAuthenticated, router]);

  if (isHydrating) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Spin size="large" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return <MainLayout>{children}</MainLayout>;
}
