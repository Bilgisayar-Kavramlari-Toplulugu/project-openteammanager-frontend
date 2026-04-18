"use client";

import TaskIdBadge from "@/components/atoms/TaskIdBadge";
import InlineTitleEditor from "@/components/molecules/task/InlineTitleEditor";

interface TaskDetailHeaderProps {
  projectKey: string;
  taskNumber: number;
  title: string;
  onTitleChange: (title: string) => void;
}

export default function TaskDetailHeader({
  projectKey,
  taskNumber,
  title,
  onTitleChange,
}: TaskDetailHeaderProps) {
  return (
    <div className="flex items-start gap-3">
      <TaskIdBadge projectKey={projectKey} taskNumber={taskNumber} />
      <InlineTitleEditor value={title} onSubmit={onTitleChange} />
    </div>
  );
}
