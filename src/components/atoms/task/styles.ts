import type { TaskStatus, TaskPriority } from "@/api/types/task.types";

export const priorityBadgeClass: Record<TaskPriority, string> = {
  low: "bg-gray-50 text-gray-600 dark:bg-gray-500/15 dark:text-gray-400",
  medium: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  high: "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400",
  critical: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
};

export const statusBadgeClass: Record<TaskStatus, string> = {
  todo: "bg-gray-50 text-gray-700 dark:bg-gray-500/15 dark:text-gray-400",
  in_progress: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  in_review: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  done: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
};
