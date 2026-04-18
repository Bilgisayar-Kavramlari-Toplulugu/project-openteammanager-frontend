"use client";

import { useState } from "react";
import { Drawer, Skeleton } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import axios from "axios";

import { useAuthStore } from "@/store/auth.store";
import { useTaskDetail } from "@/api/hooks/task/useTaskDetail";
import { useSubtasks } from "@/api/hooks/task/useSubtasks";
import {
  useUpdateTask,
  useDeleteTask,
  useCreateSubtask,
} from "@/api/hooks/task/useTaskMutations";
import { useProjectMembers } from "@/api/hooks/project/useProjectMembers";
import AlertMessage from "@/components/atoms/AlertMessage";
import TaskPanelSkeleton from "@/components/molecules/task/TaskPanelSkeleton";
import TaskDetailHeader from "./task-detail/TaskDetailHeader";
import TaskDetailMain from "./task-detail/TaskDetailMain";
import TaskDetailMetaSidebar from "./task-detail/TaskDetailMetaSidebar";
import type { Task } from "@/api/types/task.types";

interface TaskDetailPanelProps {
  taskId: string;
  projectId: string;
  projectKey: string;
  open: boolean;
  onClose: () => void;
}

export default function TaskDetailPanel({
  taskId,
  projectId,
  projectKey,
  open,
  onClose,
}: TaskDetailPanelProps) {
  const currentUser = useAuthStore((s) => s.user);
  const [error, setError] = useState<string | null>(null);

  const taskQuery = useTaskDetail(projectId, taskId, open);
  const membersQuery = useProjectMembers(projectId, open);
  const subtasksQuery = useSubtasks(projectId, taskId, open);

  const task = taskQuery.data;

  const updateMutation = useUpdateTask(projectId, taskId);
  const deleteMutation = useDeleteTask(projectId, taskId);
  const createSubtaskMutation = useCreateSubtask(projectId, taskId);

  // Admin = proje manager'ı veya görev reporter'ı (yaratıcı)
  const currentMember = membersQuery.data?.find(
    (m) => m.user_id === currentUser?.id,
  );
  const isAdmin =
    currentMember?.role === "manager" ||
    (!!task && task.reporter_id === currentUser?.id);

  const handleApiError = (err: unknown, fallback: string) => {
    if (axios.isAxiosError(err)) {
      const detail = err.response?.data?.detail;
      setError(typeof detail === "string" ? detail : fallback);
    } else {
      setError("Beklenmeyen bir hata oluştu.");
    }
  };

  const patchTask = (patch: Partial<Task>) => {
    updateMutation.mutate(patch, {
      onSuccess: () => setError(null),
      onError: (err) =>
        handleApiError(err, "Görev güncellenirken hata oluştu."),
    });
  };

  const drawerWidth =
    typeof window !== "undefined" ? Math.min(960, window.innerWidth) : 960;

  const header = task ? (
    <TaskDetailHeader
      projectKey={projectKey}
      taskNumber={task.task_number}
      title={task.title}
      onTitleChange={(title) => patchTask({ title })}
    />
  ) : (
    <Skeleton.Input active size="small" style={{ width: 240 }} />
  );

  return (
    <Drawer
      open={open}
      onClose={onClose}
      placement="right"
      width={drawerWidth}
      closeIcon={<CloseOutlined />}
      title={header}
      destroyOnHidden
      styles={{ body: { padding: 0 } }}
    >
      {taskQuery.isLoading && <TaskPanelSkeleton />}

      {taskQuery.isError && (
        <div className="p-6">
          <AlertMessage
            variant="error"
            title="Görev yüklenemedi"
            description="Lütfen tekrar deneyin."
          />
        </div>
      )}

      {task && (
        <div className="flex h-full flex-col lg:flex-row">
          <TaskDetailMain
            task={task}
            projectKey={projectKey}
            error={error}
            subtasks={subtasksQuery.data}
            subtasksLoading={subtasksQuery.isLoading}
            members={membersQuery.data || []}
            currentUserId={currentUser?.id}
            isAdmin={isAdmin}
            onDescriptionSave={(description) => patchTask({ description })}
            onCreateSubtask={(title) =>
              createSubtaskMutation.mutate(title, {
                onError: (err) =>
                  handleApiError(err, "Alt görev oluşturulamadı."),
              })
            }
            createSubtaskPending={createSubtaskMutation.isPending}
          />

          <TaskDetailMetaSidebar
            task={task}
            members={membersQuery.data || []}
            currentUserId={currentUser?.id}
            onPatch={patchTask}
            onDelete={() =>
              deleteMutation.mutate(undefined, {
                onSuccess: onClose,
                onError: (err) =>
                  handleApiError(err, "Görev silinemedi."),
              })
            }
            onInvalid={setError}
          />
        </div>
      )}
    </Drawer>
  );
}
