import type { TaskStatus } from "@/api/types/task.types";
import { statusLabels } from "@/api/constants/task";
import { statusBadgeClass } from "@/components/atoms/task/styles";

interface StatusBadgeProps {
  status: TaskStatus;
  size?: "sm" | "md";
}

export default function StatusBadge({
  status,
  size = "md",
}: StatusBadgeProps) {
  const sizing =
    size === "sm"
      ? "px-1.5 py-0.5 text-[10px]"
      : "px-2.5 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${sizing} ${statusBadgeClass[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}
