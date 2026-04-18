"use client";

import { useState } from "react";
import dayjs from "dayjs";
import { Popconfirm } from "antd";
import UserAvatar from "@/components/atoms/UserAvatar";
import MentionTextarea from "@/components/molecules/task/MentionTextarea";
import type { TaskComment } from "@/api/types/task.types";
import type { ProjectMember } from "@/api/types/project.types";

interface CommentItemProps {
  comment: TaskComment;
  currentUserId?: string | null;
  isAdmin?: boolean;
  members: ProjectMember[];
  onReply?: (parentId: string) => void;
  onEdit?: (commentId: string, content: string) => Promise<void> | void;
  onDelete?: (commentId: string) => Promise<void> | void;
  children?: React.ReactNode;
}

export default function CommentItem({
  comment,
  currentUserId,
  isAdmin,
  members,
  onReply,
  onEdit,
  onDelete,
  children,
}: CommentItemProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(comment.content ?? "");
  const [saving, setSaving] = useState(false);

  const isOwner = !!currentUserId && currentUserId === comment.user_id;
  const canEdit = isOwner && !comment.is_deleted;
  const canDelete = (isOwner || !!isAdmin) && !comment.is_deleted;

  const handleSave = async () => {
    const trimmed = draft.trim();
    if (!trimmed || !onEdit) return;
    try {
      setSaving(true);
      await onEdit(comment.id, trimmed);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-lg border border-divider bg-background p-3">
      <div className="mb-1 flex items-center justify-between gap-2 text-xs text-muted">
        <div className="flex items-center gap-2">
          <UserAvatar userId={comment.user_id} size={20} />
          <span className="font-medium">{comment.user_id.slice(0, 8)}</span>
          <span>
            {dayjs(comment.created_at).format("DD.MM.YYYY HH:mm")}
          </span>
          {comment.is_edited && <span>(düzenlendi)</span>}
        </div>
        {!comment.is_deleted && !editing && (
          <div className="flex items-center gap-2">
            {onReply && (
              <button
                type="button"
                onClick={() => onReply(comment.id)}
                className="text-primary hover:underline"
              >
                Yanıtla
              </button>
            )}
            {canEdit && (
              <button
                type="button"
                onClick={() => {
                  setDraft(comment.content ?? "");
                  setEditing(true);
                }}
                className="hover:underline"
              >
                Düzenle
              </button>
            )}
            {canDelete && onDelete && (
              <Popconfirm
                title="Yorumu sil?"
                okText="Sil"
                cancelText="Vazgeç"
                onConfirm={() => onDelete(comment.id)}
              >
                <button
                  type="button"
                  className="text-danger hover:underline"
                >
                  Sil
                </button>
              </Popconfirm>
            )}
          </div>
        )}
      </div>

      {editing ? (
        <div className="space-y-2">
          <MentionTextarea
            value={draft}
            onChange={setDraft}
            members={members}
            autoFocus
            rows={3}
            onSubmit={handleSave}
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="rounded-lg border border-divider px-3 py-1 text-xs text-foreground hover:bg-background-secondary"
            >
              Vazgeç
            </button>
            <button
              type="button"
              disabled={!draft.trim() || saving}
              onClick={handleSave}
              className="rounded-lg bg-primary px-3 py-1 text-xs font-semibold text-white hover:bg-primary-hover disabled:opacity-50"
            >
              {saving ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </div>
      ) : (
        <div className="whitespace-pre-wrap text-sm text-foreground">
          {comment.is_deleted ? (
            <em className="text-muted">Bu yorum silindi</em>
          ) : (
            comment.content
          )}
        </div>
      )}

      {children && <div className="mt-3 space-y-2 pl-4">{children}</div>}
    </div>
  );
}
