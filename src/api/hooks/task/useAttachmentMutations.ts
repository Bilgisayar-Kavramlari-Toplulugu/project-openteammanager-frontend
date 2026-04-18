"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { attachmentService } from "@/api/services/attachment.service";
import { attachmentKeys } from "@/api/queryKeys";
import { useOrganizationStore } from "@/store/organization.store";
import type { Attachment } from "@/api/types/attachment.types";

export function useUploadAttachment(projectId: string, taskId?: string | null) {
  const activeOrg = useOrganizationStore((s) => s.activeOrg);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      file,
      onProgress,
    }: {
      file: File;
      onProgress?: (percent: number) => void;
    }) =>
      attachmentService
        .upload(activeOrg!.id, projectId, file, {
          taskId: taskId ?? null,
          onProgress,
        })
        .then((r) => r.data as Attachment),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: attachmentKeys.byProject(projectId),
      });
      if (taskId) {
        queryClient.invalidateQueries({
          queryKey: attachmentKeys.byTask(projectId, taskId),
        });
      }
    },
  });
}

export function useDeleteAttachment(projectId: string, taskId?: string | null) {
  const activeOrg = useOrganizationStore((s) => s.activeOrg);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (attachmentId: string) =>
      attachmentService.delete(activeOrg!.id, projectId, attachmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: attachmentKeys.byProject(projectId),
      });
      if (taskId) {
        queryClient.invalidateQueries({
          queryKey: attachmentKeys.byTask(projectId, taskId),
        });
      }
    },
  });
}
