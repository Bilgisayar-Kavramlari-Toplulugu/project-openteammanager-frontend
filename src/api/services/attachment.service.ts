import apiClient from "@/api/lib/apiClient";
import { ENDPOINTS } from "@/api/constants/endpoints";
import type { Attachment } from "@/api/types/attachment.types";

const baseUrl = (orgId: string, projectId: string) =>
  `${ENDPOINTS.organizations}/${orgId}/projects/${projectId}`;

export const attachmentService = {
  list(orgId: string, projectId: string, taskId?: string | null) {
    return apiClient.get<Attachment[]>(`${baseUrl(orgId, projectId)}/attachments`, {
      params: taskId ? { task_id: taskId } : undefined,
    });
  },

  listByTask(orgId: string, projectId: string, taskId: string) {
    return apiClient.get<Attachment[]>(
      `${baseUrl(orgId, projectId)}/tasks/${taskId}/attachments`,
    );
  },

  upload(
    orgId: string,
    projectId: string,
    file: File,
    options?: {
      taskId?: string | null;
      onProgress?: (percent: number) => void;
    },
  ) {
    const form = new FormData();
    form.append("file", file);

    return apiClient.post<Attachment>(
      `${baseUrl(orgId, projectId)}/attachments`,
      form,
      {
        headers: { "Content-Type": "multipart/form-data" },
        params: options?.taskId ? { task_id: options.taskId } : undefined,
        onUploadProgress: (e) => {
          if (e.total && options?.onProgress) {
            options.onProgress(Math.round((e.loaded * 100) / e.total));
          }
        },
      },
    );
  },

  delete(orgId: string, projectId: string, attachmentId: string) {
    return apiClient.delete(
      `${baseUrl(orgId, projectId)}/attachments/${attachmentId}`,
    );
  },
};
