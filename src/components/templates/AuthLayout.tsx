"use client";

import AuthBrandPanel from "@/components/organisms/auth/AuthBrandPanel";
import BrandLogo from "@/components/molecules/BrandLogo";
import ThemeToggle from "@/components/atoms/ThemeToggle";

interface AuthLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export default function AuthLayout({
  title,
  description,
  children,
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* ── Left: sticky branding panel (organism) ── */}
      <AuthBrandPanel />

      {/* ── Right: scrollable form panel ── */}
      <div
        className="relative flex w-full min-h-screen flex-col lg:w-1/2"
        style={{ background: "var(--auth-form-bg)" }}
      >
        {/* Top bar: mobile logo + theme toggle */}
        <div className="flex items-center justify-between p-5 lg:justify-end">
          <div className="lg:hidden">
            <BrandLogo variant="themed" size="sm" />
          </div>
          <ThemeToggle />
        </div>

        {/* Form — vertically centered */}
        <div className="flex flex-1 items-center justify-center px-6 pb-12 sm:px-10 lg:px-16 xl:px-24">
          <div className="w-full max-w-[420px]">
            <div className="mb-8">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                {title}
              </h2>
              <p className="mt-2 text-[0.9rem] leading-relaxed text-muted">
                {description}
              </p>
            </div>

            {children}
          </div>
        </div>

        {/* Mobile footer */}
        <div className="px-6 pb-5 text-center text-[0.7rem] text-muted/40 lg:hidden">
          OpenTeamManager &bull; Açık kaynaklı proje yönetim platformu
        </div>
      </div>
    </div>
  );
}
