"use client";

import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { commentService } from "@/api/services/comment.service";
import { taskKeys } from "@/api/queryKeys";
import { useOrganizationStore } from "@/store/organization.store";
import type {
  PaginatedComments,
  TaskComment,
  CreateCommentRequest,
} from "@/api/types/task.types";

const PAGE_SIZE = 20;

export function useTaskComments(
  projectId: string,
  taskId: string,
  enabled = true,
) {
  const activeOrg = useOrganizationStore((s) => s.activeOrg);

  return useInfiniteQuery<PaginatedComments>({
    queryKey: taskKeys.comments(projectId, taskId),
    queryFn: ({ pageParam = 1 }) =>
      commentService
        .list(activeOrg!.id, projectId, taskId, {
          page: pageParam as number,
          limit: PAGE_SIZE,
        })
        .then((r) => r.data),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.has_next ? lastPage.page + 1 : undefined,
    enabled: !!activeOrg && enabled && !!taskId,
  });
}

export function useCreateComment(projectId: string, taskId: string) {
  const activeOrg = useOrganizationStore((s) => s.activeOrg);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCommentRequest) =>
      commentService
        .create(activeOrg!.id, projectId, taskId, data)
        .then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: taskKeys.comments(projectId, taskId),
      });
    },
  });
}

export function useUpdateComment(projectId: string, taskId: string) {
  const activeOrg = useOrganizationStore((s) => s.activeOrg);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      commentId,
      content,
    }: {
      commentId: string;
      content: string;
    }) =>
      commentService
        .update(activeOrg!.id, projectId, commentId, { content })
        .then((r) => r.data as TaskComment),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: taskKeys.comments(projectId, taskId),
      });
    },
  });
}

export function useDeleteComment(projectId: string, taskId: string) {
  const activeOrg = useOrganizationStore((s) => s.activeOrg);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) =>
      commentService.delete(activeOrg!.id, projectId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: taskKeys.comments(projectId, taskId),
      });
    },
  });
}
