"use client";

import { App, Skeleton, Tabs } from "antd";
import { useAttachments } from "@/api/hooks/task/useAttachments";
import {
  useUploadAttachment,
  useDeleteAttachment,
} from "@/api/hooks/task/useAttachmentMutations";
import FileUploader from "@/components/molecules/task/FileUploader";
import AttachmentList from "@/components/molecules/task/AttachmentList";

interface TaskAttachmentsPanelProps {
  projectId: string;
  taskId: string;
  currentUserId?: string | null;
  isAdmin?: boolean;
}

export default function TaskAttachmentsPanel({
  projectId,
  taskId,
  currentUserId,
  isAdmin,
}: TaskAttachmentsPanelProps) {
  const { message } = App.useApp();
  const taskAttachmentsQuery = useAttachments(projectId, taskId);
  const projectAttachmentsQuery = useAttachments(projectId, null);

  const uploadTask = useUploadAttachment(projectId, taskId);
  const deleteTaskAttachment = useDeleteAttachment(projectId, taskId);
  const deleteProjectAttachment = useDeleteAttachment(projectId, null);

  const handleUpload = async (
    file: File,
    onProgress: (percent: number) => void,
  ) => {
    await uploadTask.mutateAsync({ file, onProgress });
  };

  const handleDeleteTask = (id: string) => {
    deleteTaskAttachment.mutate(id, {
      onError: () => message.error("Dosya silinemedi."),
    });
  };

  const handleDeleteProject = (id: string) => {
    deleteProjectAttachment.mutate(id, {
      onError: () => message.error("Dosya silinemedi."),
    });
  };

  const taskAttachments = taskAttachmentsQuery.data ?? [];
  const projectAttachments = projectAttachmentsQuery.data ?? [];

  return (
    <div className="space-y-3">
      <h4 className="text-xs font-medium uppercase tracking-wider text-muted">
        Ekler
      </h4>

      <FileUploader onUpload={handleUpload} />

      <Tabs
        size="small"
        defaultActiveKey="task"
        items={[
          {
            key: "task",
            label: `Görev Dosyaları (${taskAttachments.length})`,
            children: taskAttachmentsQuery.isLoading ? (
              <Skeleton active paragraph={{ rows: 2 }} title={false} />
            ) : (
              <AttachmentList
                attachments={taskAttachments}
                currentUserId={currentUserId}
                isAdmin={isAdmin}
                onDelete={handleDeleteTask}
                emptyText="Bu göreve yüklenmiş dosya yok."
              />
            ),
          },
          {
            key: "project",
            label: `Proje Dosyaları (${projectAttachments.length})`,
            children: projectAttachmentsQuery.isLoading ? (
              <Skeleton active paragraph={{ rows: 2 }} title={false} />
            ) : (
              <AttachmentList
                attachments={projectAttachments}
                currentUserId={currentUserId}
                isAdmin={isAdmin}
                onDelete={handleDeleteProject}
                emptyText="Projeye yüklenmiş dosya yok."
              />
            ),
          },
        ]}
      />
    </div>
  );
}
