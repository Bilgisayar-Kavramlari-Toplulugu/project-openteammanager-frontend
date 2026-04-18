import dayjs from "dayjs";
import UserAvatar from "@/components/atoms/UserAvatar";
import type { TaskComment } from "@/api/types/task.types";

interface CommentItemProps {
  comment: TaskComment;
}

export default function CommentItem({ comment }: CommentItemProps) {
  return (
    <div className="rounded-lg border border-divider bg-background p-3">
      <div className="mb-1 flex items-center gap-2 text-xs text-muted">
        <UserAvatar userId={comment.user_id} size={20} />
        <span className="font-medium">{comment.user_id.slice(0, 8)}</span>
        <span>{dayjs(comment.created_at).format("DD.MM.YYYY HH:mm")}</span>
        {comment.is_edited && <span>(düzenlendi)</span>}
      </div>
      <div className="text-sm text-foreground">
        {comment.is_deleted ? (
          <em className="text-muted">[silinmiş yorum]</em>
        ) : (
          comment.content
        )}
      </div>
    </div>
  );
}
