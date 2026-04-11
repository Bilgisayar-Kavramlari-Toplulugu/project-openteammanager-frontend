"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  UserOutlined,
  CalendarOutlined,
  FlagOutlined,
} from "@ant-design/icons";
import type { Task } from "@/api/types/task.types";

const priorityConfig: Record<
  Task["priority"],
  { label: string; color: string; bg: string }
> = {
  urgent: {
    label: "Acil",
    color: "text-red-700 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-500/10",
  },
  high: {
    label: "Yüksek",
    color: "text-orange-700 dark:text-orange-400",
    bg: "bg-orange-50 dark:bg-orange-500/10",
  },
  medium: {
    label: "Orta",
    color: "text-blue-700 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-500/10",
  },
  low: {
    label: "Düşük",
    color: "text-gray-600 dark:text-gray-400",
    bg: "bg-gray-50 dark:bg-gray-500/15",
  },
};

interface KanbanCardProps {
  task: Task;
  projectKey: string;
  onClick?: (task: Task) => void;
}

export default function KanbanCard({ task, projectKey, onClick }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priority = priorityConfig[task.priority];

  const handleClick = (e: React.MouseEvent) => {
    // Only open detail if it wasn't a drag
    if (!isDragging && onClick) {
      e.stopPropagation();
      onClick(task);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleClick}
      className={[
        "cursor-grab rounded-xl border border-divider bg-surface p-3.5 transition-shadow active:cursor-grabbing",
        isDragging
          ? "z-50 shadow-xl shadow-primary/10 opacity-90 ring-2 ring-primary/30"
          : "hover:shadow-md",
      ].join(" ")}
    >
      {/* Task code */}
      <span className="mb-1.5 inline-block font-mono text-[11px] text-muted">
        {projectKey}-{task.task_number}
      </span>

      {/* Title */}
      <h4 className="mb-2 text-sm font-medium text-foreground leading-snug">
        {task.title}
      </h4>

      {/* Labels */}
      {task.labels && task.labels.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1">
          {task.labels.map((label) => (
            <span
              key={label}
              className="rounded bg-primary/5 px-1.5 py-0.5 text-[10px] font-medium text-primary dark:bg-primary/10"
            >
              {label}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between gap-2">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium ${priority.color} ${priority.bg}`}
        >
          <FlagOutlined className="text-[9px]" />
          {priority.label}
        </span>

        <div className="flex items-center gap-2">
          {task.due_date && (
            <span className="inline-flex items-center gap-1 text-[11px] text-muted">
              <CalendarOutlined className="text-[10px]" />
              {new Date(task.due_date).toLocaleDateString("tr-TR", {
                day: "numeric",
                month: "short",
              })}
            </span>
          )}
          {task.assignee_id && (
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] text-primary">
              <UserOutlined />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
