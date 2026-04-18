"use client";

import AlertMessage from "@/components/atoms/AlertMessage";
import DescriptionEditor from "@/components/molecules/task/DescriptionEditor";
import SubtaskItem from "@/components/molecules/task/SubtaskItem";
import SubtaskComposer from "@/components/molecules/task/SubtaskComposer";
import CommentItem from "@/components/molecules/task/CommentItem";
import CommentComposer from "@/components/molecules/task/CommentComposer";
import { Skeleton } from "antd";
import type { Task, TaskComment } from "@/api/types/task.types";

interface TaskDetailMainProps {
  task: Task;
  projectKey: string;
  error: string | null;
  subtasks: Task[] | undefined;
  subtasksLoading: boolean;
  comments: TaskComment[] | undefined;
  commentsTotal: number;
  commentsLoading: boolean;
  onDescriptionSave: (desc: string) => void;
  onCreateSubtask: (title: string) => void;
  createSubtaskPending: boolean;
  onCreateComment: (content: string) => void;
  createCommentPending: boolean;
}

export default function TaskDetailMain({
  task,
  projectKey,
  error,
  subtasks,
  subtasksLoading,
  comments,
  commentsTotal,
  commentsLoading,
  onDescriptionSave,
  onCreateSubtask,
  createSubtaskPending,
  onCreateComment,
  createCommentPending,
}: TaskDetailMainProps) {
  return (
    <div className="flex-1 space-y-6 overflow-y-auto p-5 lg:border-r lg:border-divider">
      {error && (
        <AlertMessage variant="error" title="Hata" description={error} />
      )}

      <DescriptionEditor
        value={task.description}
        onSave={onDescriptionSave}
      />

      <section>
        <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">
          Alt Görevler {subtasks && `(${subtasks.length})`}
        </h4>
        <div className="space-y-1.5">
          {subtasksLoading ? (
            <Skeleton active paragraph={{ rows: 2 }} title={false} />
          ) : (
            subtasks?.map((st) => (
              <SubtaskItem key={st.id} task={st} projectKey={projectKey} />
            ))
          )}
          <SubtaskComposer
            onSubmit={onCreateSubtask}
            pending={createSubtaskPending}
          />
        </div>
      </section>

      <section>
        <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">
          Yorumlar {comments && `(${commentsTotal})`}
        </h4>
        <div className="space-y-3">
          {commentsLoading ? (
            <Skeleton active paragraph={{ rows: 2 }} />
          ) : (
            comments?.map((c) => <CommentItem key={c.id} comment={c} />)
          )}
          <CommentComposer
            onSubmit={onCreateComment}
            pending={createCommentPending}
          />
        </div>
      </section>

      <section>
        <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">
          Ekler
        </h4>
        <div className="rounded-xl border border-dashed border-divider bg-background p-6 text-center text-sm text-muted">
          Dosya ekleme özelliği FE-06 kapsamında eklenecektir.
        </div>
      </section>
    </div>
  );
}
