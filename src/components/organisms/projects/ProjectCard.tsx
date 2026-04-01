"use client";

import { useRouter } from "next/navigation";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import type { Project } from "@/api/types/project.types";

const statusConfig: Record<
  Project["status"],
  { label: string; color: string; bg: string }
> = {
  active: {
    label: "Aktif",
    color: "text-emerald-700 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
  },
  planning: {
    label: "Planlama",
    color: "text-blue-700 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-500/10",
  },
  on_hold: {
    label: "Beklemede",
    color: "text-amber-700 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-500/10",
  },
  completed: {
    label: "Tamamlandı",
    color: "text-violet-700 dark:text-violet-400",
    bg: "bg-violet-50 dark:bg-violet-500/10",
  },
  archived: {
    label: "Arşivlendi",
    color: "text-gray-500 dark:text-gray-400",
    bg: "bg-gray-50 dark:bg-gray-500/15",
  },
};

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter();
  const status = statusConfig[project.status];

  const totalTasks = project.total_task_count ?? 0;
  const completedTasks = project.completed_task_count ?? 0;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <button
      type="button"
      onClick={() => router.push(`/projects/${project.id}`)}
      className="group relative flex w-full flex-col rounded-2xl border border-divider bg-surface p-5 text-left transition-all duration-200 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
    >
      {/* Color accent */}
      <div
        className="absolute left-0 top-0 h-1 w-full rounded-t-2xl"
        style={{ backgroundColor: project.color }}
      />

      {/* Header */}
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold text-foreground group-hover:text-primary transition-colors">
            {project.name}
          </h3>
          <span className="text-xs font-mono text-muted">{project.key}</span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {project.is_member && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
              <CheckCircleOutlined className="text-[10px]" />
              Katıldım
            </span>
          )}
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${status.color} ${status.bg}`}
          >
            {status.label}
          </span>
        </div>
      </div>

      {/* Description */}
      {project.description && (
        <p className="mb-3 line-clamp-2 text-sm text-muted">
          {project.description}
        </p>
      )}

      {/* Category */}
      {project.category && (
        <span className="mb-3 inline-flex self-start rounded-md bg-background px-2 py-0.5 text-[11px] font-medium text-muted border border-divider">
          {project.category}
        </span>
      )}

      {/* Stack tags */}
      {project.stack && project.stack.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {project.stack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="rounded-md bg-primary/5 px-2 py-0.5 text-[11px] font-medium text-primary dark:bg-primary/10"
            >
              {tech}
            </span>
          ))}
          {project.stack.length > 4 && (
            <span className="rounded-md bg-background px-2 py-0.5 text-[11px] text-muted">
              +{project.stack.length - 4}
            </span>
          )}
        </div>
      )}

      {/* Progress */}
      {totalTasks > 0 && (
        <div className="mb-3">
          <div className="mb-1 flex items-center justify-between text-[11px] text-muted">
            <span>İlerleme</span>
            <span>
              {completedTasks}/{totalTasks}
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-background">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                backgroundColor: project.color,
              }}
            />
          </div>
        </div>
      )}

      {/* Footer stats */}
      <div className="mt-auto flex items-center gap-4 pt-2 text-xs text-muted">
        <span className="inline-flex items-center gap-1">
          <TeamOutlined className="text-[11px]" />
          {project.member_count ?? 0}
        </span>
        <span className="inline-flex items-center gap-1">
          <UnorderedListOutlined className="text-[11px]" />
          {project.open_task_count ?? 0} açık
        </span>
        {project.end_date && (
          <span className="inline-flex items-center gap-1">
            <ClockCircleOutlined className="text-[11px]" />
            {new Date(project.end_date).toLocaleDateString("tr-TR", {
              day: "numeric",
              month: "short",
            })}
          </span>
        )}
      </div>
    </button>
  );
}
