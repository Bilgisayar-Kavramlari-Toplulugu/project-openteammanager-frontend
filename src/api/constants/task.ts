import type {
  TaskStatus,
  TaskPriority,
  TaskType,
} from "@/api/types/task.types";

export const TASK_STATUSES: TaskStatus[] = [
  "todo",
  "in_progress",
  "in_review",
  "done",
];

export const TASK_PRIORITIES: TaskPriority[] = [
  "low",
  "medium",
  "high",
  "critical",
];

export const TASK_TYPES: TaskType[] = [
  "task",
  "bug",
  "feature",
  "epic",
  "story",
];

export const statusLabels: Record<TaskStatus, string> = {
  todo: "Yapılacak",
  in_progress: "Devam Ediyor",
  in_review: "İncelemede",
  done: "Tamamlandı",
};

export const priorityLabels: Record<TaskPriority, string> = {
  low: "Düşük",
  medium: "Orta",
  high: "Yüksek",
  critical: "Kritik",
};

export const typeLabels: Record<TaskType, string> = {
  task: "Görev",
  bug: "Bug",
  feature: "Özellik",
  epic: "Epic",
  story: "Hikaye",
};

export const statusOptions = TASK_STATUSES.map((value) => ({
  value,
  label: statusLabels[value],
}));

export const priorityOptions = TASK_PRIORITIES.map((value) => ({
  value,
  label: priorityLabels[value],
}));

export const typeOptions = TASK_TYPES.map((value) => ({
  value,
  label: typeLabels[value],
}));
