"use client";

import ProtectedAppLayout from "@/components/templates/ProtectedAppLayout";

export default function ProjectsPage() {
  return (
    <ProtectedAppLayout>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Projeler</h2>
        <p className="text-sm leading-relaxed text-muted">
          Tüm projelerinizi burada yönetebilir, yeni projeler
          oluşturabilirsiniz.
        </p>
      </div>
    </ProtectedAppLayout>
  );
}
