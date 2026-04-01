export type TaskStatus = "todo" | "in_progress" | "in_review" | "done";
export type TaskPriority = "low" | "medium" | "high" | "urgent";
export type TaskType = "task" | "bug" | "feature" | "epic";

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
  assignee_id?: string;
  due_date?: string;
  labels?: string[];
}

export interface MoveTaskRequest {
  status: TaskStatus;
  position: number;
}
