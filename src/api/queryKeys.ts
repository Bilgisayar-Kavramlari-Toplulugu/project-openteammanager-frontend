export const taskKeys = {
  all: ["tasks"] as const,
  list: (projectId: string, params?: Record<string, unknown>) =>
    params
      ? ([...taskKeys.all, projectId, params] as const)
      : ([...taskKeys.all, projectId] as const),
  detail: (projectId: string, taskId: string) =>
    [...taskKeys.all, projectId, "detail", taskId] as const,
  subtasks: (projectId: string, taskId: string) =>
    [...taskKeys.detail(projectId, taskId), "subtasks"] as const,
  comments: (projectId: string, taskId: string) =>
    [...taskKeys.detail(projectId, taskId), "comments"] as const,
};

export const projectKeys = {
  all: ["projects"] as const,
  detail: (projectId: string) => [...projectKeys.all, projectId] as const,
  members: (projectId: string) =>
    [...projectKeys.detail(projectId), "members"] as const,
};
