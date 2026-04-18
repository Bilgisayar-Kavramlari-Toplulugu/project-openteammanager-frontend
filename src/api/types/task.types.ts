export type TaskStatus = "todo" | "in_progress" | "in_review" | "done";
export type TaskPriority = "low" | "medium" | "high" | "critical";
export type TaskType = "task" | "bug" | "feature" | "epic" | "story";

export interface Task {
  id: string;
  project_id: string;
  parent_id: string | null;
  title: string;
  description: string | null;
  task_number: number;
  status: TaskStatus;
  priority: TaskPriority;
  task_type: TaskType;
  assignee_id: string | null;
  reporter_id: string;
  due_date: string | null;
  start_date: string | null;
  estimated_hours: number | null;
  logged_hours: number;
  story_points: number | null;
  position: number;
  completed_at: string | null;
  labels: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  task_type?: TaskType;
  assignee_id?: string | null;
  due_date?: string | null;
  start_date?: string | null;
  estimated_hours?: number;
  story_points?: number;
  labels?: string[];
  parent_id?: string;
}

export interface MoveTaskRequest {
  status: TaskStatus;
  position: number;
}

export interface TaskComment {
  id: string;
  task_id: string;
  user_id: string;
  parent_id: string | null;
  content: string | null;
  is_edited: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaginatedComments {
  items: TaskComment[];
  total: number;
  page: number;
  limit: number;
  has_next: boolean;
}

export interface CreateCommentRequest {
  content: string;
  parent_id?: string;
}
