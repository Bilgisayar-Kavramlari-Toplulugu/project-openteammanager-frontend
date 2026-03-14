"use client";

import ProtectedAppLayout from "@/components/templates/ProtectedAppLayout";

export default function CommunityPage() {
  return (
    <ProtectedAppLayout>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Topluluk</h2>
        <p className="text-sm leading-relaxed text-muted">
          Topluluk üyeleri, tartışmalar ve etkinlikler burada
          görüntülenecek.
        </p>
      </div>
    </ProtectedAppLayout>
  );
}
