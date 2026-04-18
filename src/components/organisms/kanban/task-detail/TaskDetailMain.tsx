"use client";

import { Skeleton, Tabs } from "antd";
import AlertMessage from "@/components/atoms/AlertMessage";
import DescriptionEditor from "@/components/molecules/task/DescriptionEditor";
import SubtaskItem from "@/components/molecules/task/SubtaskItem";
import SubtaskComposer from "@/components/molecules/task/SubtaskComposer";
import TaskCommentsTab from "./TaskCommentsTab";
import TaskActivityTab from "./TaskActivityTab";
import TaskAttachmentsPanel from "./TaskAttachmentsPanel";
import type { Task } from "@/api/types/task.types";
import type { ProjectMember } from "@/api/types/project.types";

interface TaskDetailMainProps {
  task: Task;
  projectKey: string;
  error: string | null;
  subtasks: Task[] | undefined;
  subtasksLoading: boolean;
  members: ProjectMember[];
  currentUserId?: string | null;
  isAdmin?: boolean;
  onDescriptionSave: (desc: string) => void;
  onCreateSubtask: (title: string) => void;
  createSubtaskPending: boolean;
}

export default function TaskDetailMain({
  task,
  projectKey,
  error,
  subtasks,
  subtasksLoading,
  members,
  currentUserId,
  isAdmin,
  onDescriptionSave,
  onCreateSubtask,
  createSubtaskPending,
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

      <TaskAttachmentsPanel
        projectId={task.project_id}
        taskId={task.id}
        currentUserId={currentUserId}
        isAdmin={isAdmin}
      />

      <Tabs
        defaultActiveKey="comments"
        items={[
          {
            key: "comments",
            label: "Yorumlar",
            children: (
              <TaskCommentsTab
                projectId={task.project_id}
                taskId={task.id}
                members={members}
                currentUserId={currentUserId}
                isAdmin={isAdmin}
              />
            ),
          },
          {
            key: "activity",
            label: "Aktivite",
            children: <TaskActivityTab />,
          },
        ]}
      />
    </div>
  );
}
