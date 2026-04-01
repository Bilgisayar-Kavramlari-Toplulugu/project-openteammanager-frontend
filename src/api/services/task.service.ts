import apiClient from "@/api/lib/apiClient";
import { ENDPOINTS } from "@/api/constants/endpoints";
import type {
  Task,
  CreateTaskRequest,
  MoveTaskRequest,
} from "@/api/types/task.types";

const tasksUrl = (orgId: string, projectId: string) =>
  `${ENDPOINTS.organizations}/${orgId}/projects/${projectId}/tasks`;

export const taskService = {
  list(
    orgId: string,
    projectId: string,
    params?: { status?: string; assignee_id?: string; label?: string },
  ) {
    return apiClient.get<Task[]>(tasksUrl(orgId, projectId), { params });
  },

  getById(orgId: string, projectId: string, taskId: string) {
    return apiClient.get<Task>(
      `${tasksUrl(orgId, projectId)}/${taskId}`,
    );
  },

  create(orgId: string, projectId: string, data: CreateTaskRequest) {
    return apiClient.post<Task>(tasksUrl(orgId, projectId), data);
  },

  update(
    orgId: string,
    projectId: string,
    taskId: string,
    data: Partial<CreateTaskRequest>,
  ) {
    return apiClient.patch<Task>(
      `${tasksUrl(orgId, projectId)}/${taskId}`,
      data,
    );
  },

  move(
    orgId: string,
    projectId: string,
    taskId: string,
    data: MoveTaskRequest,
  ) {
    return apiClient.patch<Task>(
      `${tasksUrl(orgId, projectId)}/${taskId}/move`,
      data,
    );
  },

  delete(orgId: string, projectId: string, taskId: string) {
    return apiClient.delete(
      `${tasksUrl(orgId, projectId)}/${taskId}`,
    );
  },
};
