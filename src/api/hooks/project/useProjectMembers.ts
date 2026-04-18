"use client";

import { useQuery } from "@tanstack/react-query";
import { projectService } from "@/api/services/project.service";
import { projectKeys } from "@/api/queryKeys";
import { useOrganizationStore } from "@/store/organization.store";

export function useProjectMembers(projectId: string, enabled = true) {
  const activeOrg = useOrganizationStore((s) => s.activeOrg);

  return useQuery({
    queryKey: projectKeys.members(projectId),
    queryFn: () =>
      projectService
        .getMembers(activeOrg!.id, projectId)
        .then((r) => r.data),
    enabled: !!activeOrg && enabled,
  });
}
