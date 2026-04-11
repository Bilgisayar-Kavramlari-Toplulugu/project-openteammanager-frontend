import apiClient from "@/api/lib/apiClient";
import { ENDPOINTS } from "@/api/constants/endpoints";
import type {
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
  ProjectMember,
} from "@/api/types/project.types";

const orgProjectsUrl = (orgId: string) =>
  `${ENDPOINTS.organizations}/${orgId}/projects`;

export const projectService = {
  list(orgId: string) {
    return apiClient.get<Project[]>(orgProjectsUrl(orgId));
  },

  getById(orgId: string, projectId: string) {
    return apiClient.get<Project>(
      `${orgProjectsUrl(orgId)}/${projectId}`,
    );
  },

  create(orgId: string, data: CreateProjectRequest) {
    return apiClient.post<Project>(orgProjectsUrl(orgId), data);
  },

  update(orgId: string, projectId: string, data: UpdateProjectRequest) {
    return apiClient.patch<Project>(
      `${orgProjectsUrl(orgId)}/${projectId}`,
      data,
    );
  },

  delete(orgId: string, projectId: string) {
    return apiClient.delete(`${orgProjectsUrl(orgId)}/${projectId}`);
  },

  getMembers(orgId: string, projectId: string) {
    return apiClient.get<ProjectMember[]>(
      `${orgProjectsUrl(orgId)}/${projectId}/members`,
    );
  },
};
