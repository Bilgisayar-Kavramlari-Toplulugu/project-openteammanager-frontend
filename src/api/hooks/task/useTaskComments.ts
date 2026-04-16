"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { commentService } from "@/api/services/comment.service";
import { taskKeys } from "@/api/queryKeys";
import { useOrganizationStore } from "@/store/organization.store";

export function useTaskComments(
  projectId: string,
  taskId: string,
  enabled = true,
) {
  const activeOrg = useOrganizationStore((s) => s.activeOrg);

  return useQuery({
    queryKey: taskKeys.comments(projectId, taskId),
    queryFn: () =>
      commentService
        .list(activeOrg!.id, projectId, taskId, { page: 1, limit: 50 })
        .then((r) => r.data),
    enabled: !!activeOrg && enabled && !!taskId,
  });
}

export function useCreateComment(projectId: string, taskId: string) {
  const activeOrg = useOrganizationStore((s) => s.activeOrg);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) =>
      commentService
        .create(activeOrg!.id, projectId, taskId, { content })
        .then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: taskKeys.comments(projectId, taskId),
      });
    },
  });
}
