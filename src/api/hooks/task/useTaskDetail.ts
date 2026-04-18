"use client";

import { useQuery } from "@tanstack/react-query";
import { taskService } from "@/api/services/task.service";
import { taskKeys } from "@/api/queryKeys";
import { useOrganizationStore } from "@/store/organization.store";

export function useTaskDetail(
  projectId: string,
  taskId: string,
  enabled = true,
) {
  const activeOrg = useOrganizationStore((s) => s.activeOrg);

  return useQuery({
    queryKey: taskKeys.detail(projectId, taskId),
    queryFn: () =>
      taskService
        .getById(activeOrg!.id, projectId, taskId)
        .then((r) => r.data),
    enabled: !!activeOrg && enabled && !!taskId,
  });
}
