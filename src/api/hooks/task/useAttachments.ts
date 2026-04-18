"use client";

import { useQuery } from "@tanstack/react-query";
import { attachmentService } from "@/api/services/attachment.service";
import { attachmentKeys } from "@/api/queryKeys";
import { useOrganizationStore } from "@/store/organization.store";
import type { Attachment } from "@/api/types/attachment.types";

/**
 * List attachments for a project, optionally filtered by task.
 * When taskId is provided, only task attachments are returned.
 * When taskId is null/undefined, project-level attachments are returned.
 */
export function useAttachments(
  projectId: string,
  taskId?: string | null,
  enabled = true,
) {
  const activeOrg = useOrganizationStore((s) => s.activeOrg);

  return useQuery<Attachment[]>({
    queryKey: taskId
      ? attachmentKeys.byTask(projectId, taskId)
      : attachmentKeys.byProject(projectId),
    queryFn: () =>
      attachmentService
        .list(activeOrg!.id, projectId, taskId ?? null)
        .then((r) => r.data),
    enabled: !!activeOrg && enabled && !!projectId,
  });
}
