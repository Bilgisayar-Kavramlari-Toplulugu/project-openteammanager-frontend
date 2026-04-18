"use client";

import { useState } from "react";
import { Skeleton, message } from "antd";
import {
  useTaskComments,
  useCreateComment,
  useUpdateComment,
  useDeleteComment,
} from "@/api/hooks/task/useTaskComments";
import MentionTextarea from "@/components/molecules/task/MentionTextarea";
import CommentThread from "@/components/molecules/task/CommentThread";
import UserAvatar from "@/components/atoms/UserAvatar";
import type { ProjectMember } from "@/api/types/project.types";

interface TaskCommentsTabProps {
  projectId: string;
  taskId: string;
  members: ProjectMember[];
  currentUserId?: string | null;
  isAdmin?: boolean;
}

export default function TaskCommentsTab({
  projectId,
  taskId,
  members,
  currentUserId,
  isAdmin,
}: TaskCommentsTabProps) {
  const commentsQuery = useTaskComments(projectId, taskId);
  const createMutation = useCreateComment(projectId, taskId);
  const updateMutation = useUpdateComment(projectId, taskId);
  const deleteMutation = useDeleteComment(projectId, taskId);

  const [draft, setDraft] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);

  const items = commentsQuery.data?.pages.flatMap((p) => p.items) ?? [];
  const total = commentsQuery.data?.pages[0]?.total ?? 0;

  const replyTarget = replyTo
    ? items.find((i) => i.id === replyTo) ?? null
    : null;

  const submit = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    createMutation.mutate(
      { content: trimmed, parent_id: replyTo ?? undefined },
      {
        onSuccess: () => {
          setDraft("");
          setReplyTo(null);
        },
        onError: () => message.error("Yorum gönderilemedi."),
      },
    );
  };

  const handleEdit = async (commentId: string, content: string) => {
    await updateMutation.mutateAsync({ commentId, content });
  };

  const handleDelete = (commentId: string) => {
    deleteMutation.mutate(commentId, {
      onError: () => message.error("Yorum silinemedi."),
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-medium uppercase tracking-wider text-muted">
          Yorumlar ({total})
        </h4>
      </div>

      {commentsQuery.isLoading ? (
        <Skeleton active paragraph={{ rows: 3 }} />
      ) : (
        <CommentThread
          comments={items}
          currentUserId={currentUserId}
          isAdmin={isAdmin}
          members={members}
          onReply={(pid) => setReplyTo(pid)}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {commentsQuery.hasNextPage && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => commentsQuery.fetchNextPage()}
            disabled={commentsQuery.isFetchingNextPage}
            className="rounded-lg border border-divider px-3 py-1.5 text-xs font-medium text-foreground hover:bg-background-secondary disabled:opacity-50"
          >
            {commentsQuery.isFetchingNextPage
              ? "Yükleniyor..."
              : "Daha fazla yükle"}
          </button>
        </div>
      )}

      <div className="space-y-2 rounded-xl border border-divider bg-background p-3">
        {replyTarget && (
          <div className="flex items-center justify-between gap-2 rounded-md bg-primary/5 px-2 py-1 text-xs text-foreground">
            <span className="flex items-center gap-1">
              <UserAvatar userId={replyTarget.user_id} size={16} />
              <span className="font-medium">
                {replyTarget.user_id.slice(0, 8)}
              </span>
              <span className="text-muted">kullanıcısına yanıt</span>
            </span>
            <button
              type="button"
              onClick={() => setReplyTo(null)}
              className="text-muted hover:text-foreground"
            >
              İptal
            </button>
          </div>
        )}
        <MentionTextarea
          value={draft}
          onChange={setDraft}
          members={members}
          onSubmit={submit}
        />
        <div className="flex justify-end">
          <button
            type="button"
            disabled={!draft.trim() || createMutation.isPending}
            onClick={submit}
            className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
          >
            {createMutation.isPending ? "Gönderiliyor..." : "Yorum Gönder"}
          </button>
        </div>
      </div>
    </div>
  );
}
