"use client";

import BrandLogo from "@/components/molecules/BrandLogo";
import FeatureCard from "@/components/molecules/FeatureCard";

/* ── Icons as small SVGs to avoid Ant Design dep in brand panel ── */
const KanbanIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
    <path d="M2 4.5A2.5 2.5 0 014.5 2h11A2.5 2.5 0 0118 4.5v11a2.5 2.5 0 01-2.5 2.5h-11A2.5 2.5 0 012 15.5v-11zM4.5 4a.5.5 0 00-.5.5v11a.5.5 0 00.5.5H7V4H4.5zM9 4v12h2.5V4H9zm4.5 0V16h2a.5.5 0 00.5-.5v-11a.5.5 0 00-.5-.5h-2z" />
  </svg>
);

const TeamIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
    <path d="M7 8a3 3 0 100-6 3 3 0 000 6zM14.5 9a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM1.615 16.428a1.224 1.224 0 01-.569-1.175 6.002 6.002 0 0111.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 017 18a9.953 9.953 0 01-5.385-1.572zM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 00-1.588-3.755 4.502 4.502 0 015.874 2.636.818.818 0 01-.36.98A7.465 7.465 0 0114.5 16z" />
  </svg>
);

const ChartIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
    <path d="M15.5 2A1.5 1.5 0 0014 3.5v13a1.5 1.5 0 001.5 1.5h1a1.5 1.5 0 001.5-1.5v-13A1.5 1.5 0 0016.5 2h-1zM9.5 6A1.5 1.5 0 008 7.5v9A1.5 1.5 0 009.5 18h1a1.5 1.5 0 001.5-1.5v-9A1.5 1.5 0 0010.5 6h-1zM3.5 10A1.5 1.5 0 002 11.5v5A1.5 1.5 0 003.5 18h1A1.5 1.5 0 006 16.5v-5A1.5 1.5 0 004.5 10h-1z" />
  </svg>
);

const features = [
  {
    icon: <KanbanIcon />,
    iconClass: "ring-indigo-400/30 bg-indigo-400/10 text-indigo-300",
    title: "Proje & Görev Yönetimi",
    description: "Kanban, sprint ve backlog ile iş akışınızı uçtan uca kontrol edin.",
  },
  {
    icon: <TeamIcon />,
    iconClass: "ring-emerald-400/30 bg-emerald-400/10 text-emerald-300",
    title: "Ekip Koordinasyonu",
    description: "Roller, yorumlar ve bildirimlerle ekip içi iletişimi güçlendirin.",
  },
  {
    icon: <ChartIcon />,
    iconClass: "ring-cyan-400/30 bg-cyan-400/10 text-cyan-300",
    title: "Gerçek Zamanlı İçgörüler",
    description: "Aktivite geçmişi ve raporlarla ilerlemeyi anlık takip edin.",
  },
];

const trustBadges = ["Açık kaynak", "Self-hosted", "Tamamen ücretsiz"];

export default function AuthBrandPanel() {
  return (
    <div
      className="relative hidden w-1/2 lg:block"
      style={{ background: "var(--auth-brand-bg)" }}
    >
      <div className="sticky top-0 flex h-screen flex-col justify-between overflow-hidden p-10 text-white xl:p-14">
        {/* Decorative elements */}
        <div className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-indigo-500/15 blur-[120px]" />
        <div className="pointer-events-none absolute right-0 bottom-0 h-80 w-80 rounded-full bg-cyan-500/10 blur-[100px]" />
        <div className="pointer-events-none absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/5 blur-[80px]" />

        {/* Grid pattern overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* ── Top: Logo ── */}
        <div className="relative z-10">
          <BrandLogo variant="light" />
        </div>

        {/* ── Center: Headline + Features ── */}
        <div className="relative z-10 -mt-4 space-y-8">
          <div>
            <p className="mb-3 text-xs font-semibold tracking-widest text-indigo-300/70 uppercase">
              Proje Yönetim Platformu
            </p>
            <h1 className="text-4xl leading-[1.15] font-extrabold tracking-tight xl:text-[2.75rem]">
              İşbirliğini
              <br />
              <span className="bg-gradient-to-r from-indigo-200 via-white to-cyan-200 bg-clip-text text-transparent">
                yeniden tanımlayın.
              </span>
            </h1>
            <p className="mt-5 max-w-sm text-[0.925rem] leading-relaxed text-indigo-200/60">
              Organizasyon, proje ve görev yönetimini tek platformda
              birleştirerek ekibinizin potansiyelini ortaya çıkarın.
            </p>
          </div>

          <div className="space-y-3">
            {features.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>

        {/* ── Bottom: Trust badges ── */}
        <div className="relative z-10 flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-[0.7rem] text-indigo-300/50">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            {trustBadges[0]}
          </span>
          {trustBadges.slice(1).map((b) => (
            <span
              key={b}
              className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-[0.7rem] text-indigo-300/50"
            >
              {b}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
