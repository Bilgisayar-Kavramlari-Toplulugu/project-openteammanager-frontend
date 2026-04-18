import { CheckOutlined } from "@ant-design/icons";
import TaskIdBadge from "@/components/atoms/TaskIdBadge";
import type { Task } from "@/api/types/task.types";

interface SubtaskItemProps {
  task: Task;
  projectKey: string;
}

export default function SubtaskItem({ task, projectKey }: SubtaskItemProps) {
  const done = task.status === "done";

  return (
    <div className="flex items-center gap-2 rounded-lg border border-divider bg-background px-3 py-2 text-sm">
      <CheckOutlined className={done ? "text-emerald-500" : "text-muted/40"} />
      <TaskIdBadge projectKey={projectKey} taskNumber={task.task_number} />
      <span
        className={done ? "line-through text-muted" : "text-foreground"}
      >
        {task.title}
      </span>
    </div>
  );
}
