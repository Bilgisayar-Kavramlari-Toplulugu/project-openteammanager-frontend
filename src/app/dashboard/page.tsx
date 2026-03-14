"use client";

import ProtectedAppLayout from "@/components/templates/ProtectedAppLayout";

export default function DashboardPage() {
  return (
    <ProtectedAppLayout>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Dashboard</h2>
        <p className="text-sm leading-relaxed text-muted">
          Projelere genel bakış, ekip aktiviteleri ve istatistikler burada
          görüntülenecek.
        </p>
      </div>
    </ProtectedAppLayout>
  );
}
