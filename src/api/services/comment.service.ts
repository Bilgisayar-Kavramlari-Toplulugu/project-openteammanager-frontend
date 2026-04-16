import apiClient from "@/api/lib/apiClient";
import { ENDPOINTS } from "@/api/constants/endpoints";
import type {
  TaskComment,
  PaginatedComments,
  CreateCommentRequest,
} from "@/api/types/task.types";

const taskUrl = (orgId: string, projectId: string, taskId: string) =>
  `${ENDPOINTS.organizations}/${orgId}/projects/${projectId}/tasks/${taskId}`;

const commentUrl = (orgId: string, projectId: string, commentId: string) =>
  `${ENDPOINTS.organizations}/${orgId}/projects/${projectId}/comments/${commentId}`;

export const commentService = {
  list(
    orgId: string,
    projectId: string,
    taskId: string,
    params?: { page?: number; limit?: number },
  ) {
    return apiClient.get<PaginatedComments>(
      `${taskUrl(orgId, projectId, taskId)}/comments`,
      { params },
    );
  },

  create(
    orgId: string,
    projectId: string,
    taskId: string,
    data: CreateCommentRequest,
  ) {
    return apiClient.post<TaskComment>(
      `${taskUrl(orgId, projectId, taskId)}/comments`,
      data,
    );
  },

  update(
    orgId: string,
    projectId: string,
    commentId: string,
    data: { content: string },
  ) {
    return apiClient.patch<TaskComment>(
      commentUrl(orgId, projectId, commentId),
      data,
    );
  },

  delete(orgId: string, projectId: string, commentId: string) {
    return apiClient.delete(commentUrl(orgId, projectId, commentId));
  },
};
