"use client";

import { useQuery } from "@tanstack/react-query";
import { taskService } from "@/api/services/task.service";
import { taskKeys } from "@/api/queryKeys";
import { useOrganizationStore } from "@/store/organization.store";

interface UseTasksParams extends Record<string, unknown> {
  status?: string;
  assignee_id?: string;
  label?: string;
}

export function useTasks(projectId: string, params?: UseTasksParams) {
  const activeOrg = useOrganizationStore((s) => s.activeOrg);

  return useQuery({
    queryKey: taskKeys.list(projectId, params),
    queryFn: () =>
      taskService.list(activeOrg!.id, projectId, params).then((r) => r.data),
    enabled: !!activeOrg,
  });
}
