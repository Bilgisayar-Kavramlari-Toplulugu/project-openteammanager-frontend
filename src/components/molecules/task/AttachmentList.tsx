"use client";

import AttachmentItem from "@/components/molecules/task/AttachmentItem";
import type { Attachment } from "@/api/types/attachment.types";

interface AttachmentListProps {
  attachments: Attachment[];
  currentUserId?: string | null;
  isAdmin?: boolean;
  onDelete?: (id: string) => void;
  emptyText?: string;
}

export default function AttachmentList({
  attachments,
  currentUserId,
  isAdmin,
  onDelete,
  emptyText = "Dosya yok.",
}: AttachmentListProps) {
  if (attachments.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-divider p-3 text-center text-xs text-muted">
        {emptyText}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {attachments.map((a) => (
        <AttachmentItem
          key={a.id}
          attachment={a}
          currentUserId={currentUserId}
          isAdmin={isAdmin}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
