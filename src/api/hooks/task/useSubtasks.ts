"use client";

import { useQuery } from "@tanstack/react-query";
import { taskService } from "@/api/services/task.service";
import { taskKeys } from "@/api/queryKeys";
import { useOrganizationStore } from "@/store/organization.store";

export function useSubtasks(
  projectId: string,
  taskId: string,
  enabled = true,
) {
  const activeOrg = useOrganizationStore((s) => s.activeOrg);

  return useQuery({
    queryKey: taskKeys.subtasks(projectId, taskId),
    queryFn: () =>
      taskService
        .list(activeOrg!.id, projectId)
        .then((r) => r.data.filter((t) => t.parent_id === taskId)),
    enabled: !!activeOrg && enabled && !!taskId,
  });
}
