"use client";

import {
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { PlusOutlined } from "@ant-design/icons";
import type { Task, TaskStatus } from "@/api/types/task.types";
import KanbanCard from "./KanbanCard";

const columnConfig: Record<TaskStatus, { label: string; accent: string }> = {
  todo: { label: "Yapılacak", accent: "bg-gray-400" },
  in_progress: { label: "Devam Ediyor", accent: "bg-blue-500" },
  in_review: { label: "İncelemede", accent: "bg-amber-500" },
  done: { label: "Tamamlandı", accent: "bg-emerald-500" },
};

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  projectKey: string;
  onAddTask: (status: TaskStatus) => void;
  onTaskClick: (task: Task) => void;
}

export default function KanbanColumn({
  status,
  tasks,
  projectKey,
  onAddTask,
  onTaskClick,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const config = columnConfig[status];

  return (
    <div
      className={[
        "flex w-72 shrink-0 flex-col rounded-2xl border border-divider bg-background transition-colors lg:w-auto lg:shrink",
        isOver ? "border-primary/40 bg-primary/[0.02]" : "",
      ].join(" ")}
    >
      {/* Column header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className={`h-2.5 w-2.5 rounded-full ${config.accent}`} />
          <h3 className="text-sm font-semibold text-foreground">
            {config.label}
          </h3>
          <span className="rounded-full bg-surface px-2 py-0.5 text-xs font-medium text-muted">
            {tasks.length}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onAddTask(status)}
          className="inline-flex h-6 w-6 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-foreground"
          title="Görev ekle"
        >
          <PlusOutlined className="text-xs" />
        </button>
      </div>

      {/* Cards */}
      <div ref={setNodeRef} className="flex-1 space-y-2.5 px-3 pb-3 min-h-[120px]">
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <KanbanCard
              key={task.id}
              task={task}
              projectKey={projectKey}
              onClick={onTaskClick}
            />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="flex h-20 items-center justify-center rounded-xl border border-dashed border-divider text-xs text-muted">
            Görev yok
          </div>
        )}
      </div>
    </div>
  );
}
