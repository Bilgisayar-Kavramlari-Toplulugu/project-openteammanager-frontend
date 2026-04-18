import { FlagOutlined } from "@ant-design/icons";
import type { TaskPriority } from "@/api/types/task.types";
import { priorityLabels } from "@/api/constants/task";
import { priorityBadgeClass } from "@/components/atoms/task/styles";

interface PriorityBadgeProps {
  priority: TaskPriority;
  size?: "sm" | "md";
  withIcon?: boolean;
}

export default function PriorityBadge({
  priority,
  size = "md",
  withIcon = true,
}: PriorityBadgeProps) {
  const sizing =
    size === "sm"
      ? "px-1.5 py-0.5 text-[10px]"
      : "px-2.5 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${sizing} ${priorityBadgeClass[priority]}`}
    >
      {withIcon && <FlagOutlined className="text-[9px]" />}
      {priorityLabels[priority]}
    </span>
  );
}
