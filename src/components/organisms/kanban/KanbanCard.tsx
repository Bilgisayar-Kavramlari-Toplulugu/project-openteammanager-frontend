"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { UserOutlined, CalendarOutlined } from "@ant-design/icons";
import TaskIdBadge from "@/components/atoms/TaskIdBadge";
import PriorityBadge from "@/components/atoms/PriorityBadge";
import type { Task } from "@/api/types/task.types";

interface KanbanCardProps {
  task: Task;
  projectKey: string;
  onClick?: (task: Task) => void;
}

export default function KanbanCard({
  task,
  projectKey,
  onClick,
}: KanbanCardProps) {
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

  const handleClick = (e: React.MouseEvent) => {
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
      <TaskIdBadge
        projectKey={projectKey}
        taskNumber={task.task_number}
        className="mb-1.5 bg-transparent p-0 text-muted"
      />

      <h4 className="mb-2 text-sm font-medium text-foreground leading-snug">
        {task.title}
      </h4>

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

      <div className="flex items-center justify-between gap-2">
        <PriorityBadge priority={task.priority} size="sm" />

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
