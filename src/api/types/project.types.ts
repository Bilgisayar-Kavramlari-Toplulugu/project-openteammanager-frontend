export interface Project {
  id: string;
  organization_id: string;
  name: string;
  description: string | null;
  key: string;
  status: "planning" | "active" | "on_hold" | "completed" | "archived";
  visibility: "private" | "internal" | "public";
  category: string | null;
  color: string;
  icon: string | null;
  stack: string[];
  is_member: boolean;
  start_date: string | null;
  end_date: string | null;
  created_by: string;
  created_at: string;
  member_count?: number;
  open_task_count?: number;
  total_task_count?: number;
  completed_task_count?: number;
}

export interface CreateProjectRequest {
  name: string;
  key: string;
  description?: string;
  category?: string;
  stack?: string[];
  visibility?: "private" | "internal" | "public";
  color?: string;
  start_date?: string;
  end_date?: string;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  status?: Project["status"];
  stack?: string[];
  start_date?: string;
  end_date?: string;
  color?: string;
  category?: string;
}

export interface ProjectMember {
  id: string;
  user_id: string;
  role: "manager" | "contributor" | "reviewer" | "viewer";
  created_at: string;
}
