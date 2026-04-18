"use client";

import { useState, useMemo, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useQueryClient } from "@tanstack/react-query";

import { useTasks } from "@/api/hooks/task/useTasks";
import { useMoveTask } from "@/api/hooks/task/useTaskMutations";
import { taskKeys } from "@/api/queryKeys";
import type { Task, TaskStatus } from "@/api/types/task.types";
import KanbanColumn from "./KanbanColumn";
import KanbanCard from "./KanbanCard";
import KanbanFilters from "./KanbanFilters";
import CreateTaskModal from "./CreateTaskModal";
import TaskDetailPanel from "./TaskDetailPanel";

const COLUMNS: TaskStatus[] = ["todo", "in_progress", "in_review", "done"];

interface KanbanBoardProps {
  projectId: string;
  projectKey: string;
}

export default function KanbanBoard({
  projectId,
  projectKey,
}: KanbanBoardProps) {
  const queryClient = useQueryClient();

  const [filterAssignee, setFilterAssignee] = useState<string | undefined>();
  const [filterLabel, setFilterLabel] = useState<string | undefined>();
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // Modal states
  const [createStatus, setCreateStatus] = useState<TaskStatus | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const queryParams = useMemo(() => {
    const p: Record<string, string> = {};
    if (filterAssignee) p.assignee_id = filterAssignee;
    if (filterLabel) p.label = filterLabel;
    return p;
  }, [filterAssignee, filterLabel]);

  const { data: tasks = [] } = useTasks(projectId, queryParams);

  const allLabels = useMemo(() => {
    const set = new Set<string>();
    tasks.forEach((t) => t.labels?.forEach((l) => set.add(l)));
    return Array.from(set);
  }, [tasks]);

  const allAssignees = useMemo(() => {
    const map = new Map<string, string>();
    tasks.forEach((t) => {
      if (t.assignee_id) map.set(t.assignee_id, t.assignee_id);
    });
    return Array.from(map.entries()).map(([id]) => ({
      id,
      full_name: id.slice(0, 8),
    }));
  }, [tasks]);

  const tasksByStatus = useMemo(() => {
    const grouped: Record<TaskStatus, Task[]> = {
      todo: [],
      in_progress: [],
      in_review: [],
      done: [],
    };
    tasks
      .sort((a, b) => a.position - b.position)
      .forEach((t) => {
        if (grouped[t.status]) grouped[t.status].push(t);
      });
    return grouped;
  }, [tasks]);

  const moveMutation = useMoveTask(projectId);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const task = tasks.find((t) => t.id === event.active.id);
      if (task) setActiveTask(task);
    },
    [tasks],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveTask(null);
      const { active, over } = event;
      if (!over) return;

      const taskId = active.id as string;
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      let targetStatus: TaskStatus;
      let targetTasks: Task[];

      if (COLUMNS.includes(over.id as TaskStatus)) {
        targetStatus = over.id as TaskStatus;
        targetTasks = [...tasksByStatus[targetStatus]];
      } else {
        const overTask = tasks.find((t) => t.id === over.id);
        if (!overTask) return;
        targetStatus = overTask.status;
        targetTasks = [...tasksByStatus[targetStatus]];
      }

      if (task.status === targetStatus) {
        const oldIdx = targetTasks.findIndex((t) => t.id === taskId);
        const overIdx = targetTasks.findIndex((t) => t.id === over.id);
        if (oldIdx === -1 || overIdx === -1 || oldIdx === overIdx) return;
        const reordered = arrayMove(targetTasks, oldIdx, overIdx);
        const position = calculatePosition(reordered, overIdx);

        queryClient.setQueryData(
          taskKeys.list(projectId, queryParams),
          (old: Task[] | undefined) =>
            old?.map((t) =>
              t.id === taskId ? { ...t, position, status: targetStatus } : t,
            ),
        );
        moveMutation.mutate({
          taskId,
          data: { status: targetStatus, position },
        });
      } else {
        const insertIdx = COLUMNS.includes(over.id as TaskStatus)
          ? targetTasks.length
          : targetTasks.findIndex((t) => t.id === over.id);
        const position = calculatePosition(
          targetTasks,
          insertIdx === -1 ? targetTasks.length : insertIdx,
        );

        queryClient.setQueryData(
          taskKeys.list(projectId, queryParams),
          (old: Task[] | undefined) =>
            old?.map((t) =>
              t.id === taskId
                ? { ...t, status: targetStatus, position }
                : t,
            ),
        );
        moveMutation.mutate({
          taskId,
          data: { status: targetStatus, position },
        });
      }
    },
    [tasks, tasksByStatus, queryClient, projectId, queryParams, moveMutation],
  );

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;
      if (!over) return;

      const taskId = active.id as string;
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      let overStatus: TaskStatus;
      if (COLUMNS.includes(over.id as TaskStatus)) {
        overStatus = over.id as TaskStatus;
      } else {
        const overTask = tasks.find((t) => t.id === over.id);
        if (!overTask) return;
        overStatus = overTask.status;
      }

      if (task.status !== overStatus) {
        queryClient.setQueryData(
          taskKeys.list(projectId, queryParams),
          (old: Task[] | undefined) =>
            old?.map((t) =>
              t.id === taskId ? { ...t, status: overStatus } : t,
            ),
        );
      }
    },
    [tasks, queryClient, projectId, queryParams],
  );

  const handleAddTask = useCallback((status: TaskStatus) => {
    setCreateStatus(status);
  }, []);

  const handleTaskClick = useCallback((task: Task) => {
    setSelectedTask(task);
  }, []);

  return (
    <div className="space-y-4">
      <KanbanFilters
        assignees={allAssignees}
        labels={allLabels}
        selectedAssignee={filterAssignee}
        selectedLabel={filterLabel}
        onAssigneeChange={setFilterAssignee}
        onLabelChange={setFilterLabel}
      />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        <div className="flex gap-4 overflow-x-auto pb-4 lg:grid lg:grid-cols-4 lg:overflow-visible">
          {COLUMNS.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              tasks={tasksByStatus[status]}
              projectKey={projectKey}
              onAddTask={handleAddTask}
              onTaskClick={handleTaskClick}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask && (
            <KanbanCard task={activeTask} projectKey={projectKey} />
          )}
        </DragOverlay>
      </DndContext>

      {/* Create Task Modal */}
      {createStatus && (
        <CreateTaskModal
          projectId={projectId}
          defaultStatus={createStatus}
          open={!!createStatus}
          onClose={() => setCreateStatus(null)}
        />
      )}

      {/* Task Detail Panel (Sheet/Drawer) */}
      {selectedTask && (
        <TaskDetailPanel
          taskId={selectedTask.id}
          projectId={projectId}
          projectKey={projectKey}
          open={!!selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
}

function calculatePosition(tasks: Task[], index: number): number {
  if (tasks.length === 0) return 1000;
  if (index === 0) return (tasks[0]?.position ?? 1000) / 2;
  if (index >= tasks.length)
    return (tasks[tasks.length - 1]?.position ?? 0) + 1000;

  const before = tasks[index - 1]?.position ?? 0;
  const after = tasks[index]?.position ?? before + 2000;
  return (before + after) / 2;
}
