"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { taskService } from "@/api/services/task.service";
import { taskKeys } from "@/api/queryKeys";
import { useOrganizationStore } from "@/store/organization.store";
import type { Task, MoveTaskRequest } from "@/api/types/task.types";

function buildUpdatePayload(patch: Partial<Task>): Record<string, unknown> {
  const payload: Record<string, unknown> = {};
  if (patch.title !== undefined) payload.title = patch.title;
  if (patch.description !== undefined)
    payload.description = patch.description || null;
  if (patch.status !== undefined) payload.status = patch.status;
  if (patch.priority !== undefined) payload.priority = patch.priority;
  if (patch.task_type !== undefined) payload.task_type = patch.task_type;
  if ("assignee_id" in patch) payload.assignee_id = patch.assignee_id;
  if ("due_date" in patch) payload.due_date = patch.due_date;
  if ("start_date" in patch) payload.start_date = patch.start_date;
  if (patch.labels !== undefined) payload.labels = patch.labels;
  return payload;
}

export function useUpdateTask(projectId: string, taskId: string) {
  const activeOrg = useOrganizationStore((s) => s.activeOrg);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (patch: Partial<Task>) =>
      taskService
        .update(activeOrg!.id, projectId, taskId, buildUpdatePayload(patch))
        .then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: taskKeys.detail(projectId, taskId),
      });
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
}

export function useDeleteTask(projectId: string, taskId: string) {
  const activeOrg = useOrganizationStore((s) => s.activeOrg);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      taskService.delete(activeOrg!.id, projectId, taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
}

export function useMoveTask(projectId: string) {
  const activeOrg = useOrganizationStore((s) => s.activeOrg);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      data,
    }: {
      taskId: string;
      data: MoveTaskRequest;
    }) => taskService.move(activeOrg!.id, projectId, taskId, data),
    onError: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
}

export function useCreateSubtask(projectId: string, parentId: string) {
  const activeOrg = useOrganizationStore((s) => s.activeOrg);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (title: string) =>
      taskService
        .create(activeOrg!.id, projectId, { title, parent_id: parentId })
        .then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: taskKeys.subtasks(projectId, parentId),
      });
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
}
