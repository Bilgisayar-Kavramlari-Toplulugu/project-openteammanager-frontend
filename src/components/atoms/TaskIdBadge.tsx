interface TaskIdBadgeProps {
  projectKey: string;
  taskNumber: number;
  className?: string;
}

export default function TaskIdBadge({
  projectKey,
  taskNumber,
  className = "",
}: TaskIdBadgeProps) {
  return (
    <span
      className={`shrink-0 rounded-md bg-primary/10 px-2 py-0.5 font-mono text-xs font-medium text-primary ${className}`}
    >
      {projectKey}-{taskNumber}
    </span>
  );
}
