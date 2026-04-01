"use client";

import {
  CalendarOutlined,
  EditOutlined,
  DeleteOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  TagOutlined,
} from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Project } from "@/api/types/project.types";

const statusConfig: Record<Project["status"], { label: string; color: string; bg: string }> = {
  active: { label: "Aktif", color: "text-emerald-700 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
  planning: { label: "Planlama", color: "text-blue-700 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10" },
  on_hold: { label: "Beklemede", color: "text-amber-700 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10" },
  completed: { label: "Tamamlandı", color: "text-violet-700 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-500/10" },
  archived: { label: "Arşivlendi", color: "text-gray-500 dark:text-gray-400", bg: "bg-gray-50 dark:bg-gray-500/15" },
};

interface ProjectOverviewProps {
  project: Project;
  isManager: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ProjectOverview({
  project,
  isManager,
  onEdit,
  onDelete,
}: ProjectOverviewProps) {
  const totalTasks = project.total_task_count ?? 0;
  const completedTasks = project.completed_task_count ?? 0;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const st = statusConfig[project.status];

  return (
    <div className="space-y-6">
      {/* Header banner */}
      <div className="relative overflow-hidden rounded-2xl border border-divider/50 bg-surface p-6">
        {/* Color accent bar */}
        <div
          className="absolute inset-x-0 top-0 h-1"
          style={{ backgroundColor: project.color }}
        />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            {/* Status + Visibility */}
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${st.color} ${st.bg}`}>
                {st.label}
              </span>
              {project.category && (
                <span className="inline-flex items-center gap-1 rounded-full border border-divider/50 px-2.5 py-1 text-[11px] font-medium text-muted">
                  <TagOutlined className="text-[9px]" />
                  {project.category}
                </span>
              )}
            </div>

            {/* Description */}
            {project.description && (
              <div className="max-w-2xl text-sm text-muted leading-relaxed">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({ children }) => <p className="mb-1.5 last:mb-0">{children}</p>,
                    strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
                    em: ({ children }) => <em className="italic">{children}</em>,
                    a: ({ children, href }) => (
                      <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary-hover">{children}</a>
                    ),
                    code: ({ children }) => <code className="rounded bg-background px-1 py-0.5 font-mono text-xs text-primary">{children}</code>,
                    ul: ({ children }) => <ul className="ml-4 list-disc space-y-0.5">{children}</ul>,
                    ol: ({ children }) => <ol className="ml-4 list-decimal space-y-0.5">{children}</ol>,
                  }}
                >
                  {project.description}
                </ReactMarkdown>
              </div>
            )}
          </div>

          {isManager && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={onEdit}
                className="inline-flex items-center gap-2 rounded-xl border border-divider/50 bg-background/50 px-4 py-2 text-sm font-medium text-foreground transition-all hover:border-primary/30 hover:shadow-sm"
              >
                <EditOutlined className="text-xs" />
                Düzenle
              </button>
              <button
                type="button"
                onClick={onDelete}
                className="inline-flex items-center gap-2 rounded-xl border border-danger/20 bg-danger/5 px-4 py-2 text-sm font-medium text-danger transition-all hover:bg-danger/10"
              >
                <DeleteOutlined className="text-xs" />
                Sil
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Progress */}
        <div className="rounded-2xl border border-divider/50 bg-surface/50 p-5 backdrop-blur-sm">
          <div className="mb-3 flex items-center gap-2">
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <CheckCircleOutlined className="text-sm text-primary" />
            </div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted">
              İlerleme
            </h4>
          </div>
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-foreground">
                %{progress}
              </span>
              <span className="text-xs text-muted">
                {completedTasks}/{totalTasks}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-background">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${progress}%`,
                  backgroundColor: project.color,
                }}
              />
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="rounded-2xl border border-divider/50 bg-surface/50 p-5 backdrop-blur-sm">
          <div className="mb-3 flex items-center gap-2">
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
              <CalendarOutlined className="text-sm text-accent" />
            </div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted">
              Tarih Aralığı
            </h4>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">Başlangıç</span>
              <span className="font-medium text-foreground">
                {project.start_date
                  ? new Date(project.start_date).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" })
                  : "—"}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">Bitiş</span>
              <span className="font-medium text-foreground">
                {project.end_date
                  ? new Date(project.end_date).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" })
                  : "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Stack */}
        <div className="rounded-2xl border border-divider/50 bg-surface/50 p-5 backdrop-blur-sm">
          <div className="mb-3 flex items-center gap-2">
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-warning/10">
              <ClockCircleOutlined className="text-sm text-warning" />
            </div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted">
              Teknoloji Stack
            </h4>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {project.stack && project.stack.length > 0 ? (
              project.stack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-lg border border-primary/10 bg-primary/5 px-2 py-0.5 text-xs font-medium text-primary dark:bg-primary/10"
                >
                  {tech}
                </span>
              ))
            ) : (
              <span className="text-xs text-muted italic">Belirtilmemiş</span>
            )}
          </div>
        </div>

        {/* Members */}
        <div className="rounded-2xl border border-divider/50 bg-surface/50 p-5 backdrop-blur-sm">
          <div className="mb-3 flex items-center gap-2">
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-success/10">
              <TeamOutlined className="text-sm text-success" />
            </div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted">
              Ekip
            </h4>
          </div>
          <div className="space-y-1">
            <span className="text-2xl font-bold text-foreground">
              {project.member_count ?? 0}
            </span>
            <p className="text-xs text-muted">üye</p>
          </div>
        </div>
      </div>
    </div>
  );
}
