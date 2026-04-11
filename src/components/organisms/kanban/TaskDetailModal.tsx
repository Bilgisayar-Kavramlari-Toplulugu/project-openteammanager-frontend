"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal, Select, DatePicker, Popconfirm } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  FlagOutlined,
  CalendarOutlined,
  TagOutlined,
  UserOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import dayjs from "dayjs";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { taskService } from "@/api/services/task.service";
import { useOrganizationStore } from "@/store/organization.store";
import FormInput from "@/components/atoms/FormInput";
import FormField from "@/components/molecules/FormField";
import MarkdownEditor from "@/components/molecules/MarkdownEditor";
import AlertMessage from "@/components/atoms/AlertMessage";
import type {
  Task,
  TaskStatus,
  TaskPriority,
  TaskType,
} from "@/api/types/task.types";

const schema = z.object({
  title: z.string().min(1, "Görev başlığı zorunludur."),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const statusConfig: Record<TaskStatus, { label: string; color: string; bg: string }> = {
  todo: { label: "Yapılacak", color: "text-gray-700 dark:text-gray-400", bg: "bg-gray-50 dark:bg-gray-500/15" },
  in_progress: { label: "Devam Ediyor", color: "text-blue-700 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10" },
  in_review: { label: "İncelemede", color: "text-amber-700 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10" },
  done: { label: "Tamamlandı", color: "text-emerald-700 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
};

const priorityConfig: Record<TaskPriority, { label: string; color: string; bg: string }> = {
  urgent: { label: "Acil", color: "text-red-700 dark:text-red-400", bg: "bg-red-50 dark:bg-red-500/10" },
  high: { label: "Yüksek", color: "text-orange-700 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-500/10" },
  medium: { label: "Orta", color: "text-blue-700 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10" },
  low: { label: "Düşük", color: "text-gray-600 dark:text-gray-400", bg: "bg-gray-50 dark:bg-gray-500/15" },
};

const typeConfig: Record<TaskType, string> = {
  task: "Görev",
  bug: "Bug",
  feature: "Özellik",
  epic: "Epic",
};

const statusOptions = [
  { label: "Yapılacak", value: "todo" },
  { label: "Devam Ediyor", value: "in_progress" },
  { label: "İncelemede", value: "in_review" },
  { label: "Tamamlandı", value: "done" },
];

const priorityOptions = [
  { label: "Düşük", value: "low" },
  { label: "Orta", value: "medium" },
  { label: "Yüksek", value: "high" },
  { label: "Acil", value: "urgent" },
];

const typeOptions = [
  { label: "Görev", value: "task" },
  { label: "Bug", value: "bug" },
  { label: "Özellik", value: "feature" },
  { label: "Epic", value: "epic" },
];

interface TaskDetailModalProps {
  task: Task;
  projectId: string;
  projectKey: string;
  open: boolean;
  onClose: () => void;
}

export default function TaskDetailModal({
  task,
  projectId,
  projectKey,
  open,
  onClose,
}: TaskDetailModalProps) {
  const activeOrg = useOrganizationStore((s) => s.activeOrg);
  const queryClient = useQueryClient();
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [priority, setPriority] = useState<TaskPriority>(task.priority);
  const [taskType, setTaskType] = useState<TaskType>(task.task_type);
  const [labels, setLabels] = useState<string[]>(task.labels || []);
  const [dueDate, setDueDate] = useState<dayjs.Dayjs | null>(
    task.due_date ? dayjs(task.due_date) : null,
  );

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: task.title,
      description: task.description || "",
    },
  });

  useEffect(() => {
    if (open) {
      setMode("view");
      reset({
        title: task.title,
        description: task.description || "",
      });
      setStatus(task.status);
      setPriority(task.priority);
      setTaskType(task.task_type);
      setLabels(task.labels || []);
      setDueDate(task.due_date ? dayjs(task.due_date) : null);
      setError(null);
    }
  }, [open, task, reset]);

  const updateMutation = useMutation({
    mutationFn: (data: FormValues) => {
      if (!activeOrg) throw new Error("Aktif organizasyon yok");
      return taskService.update(activeOrg.id, projectId, task.id, {
        title: data.title,
        description: data.description || undefined,
        status,
        priority,
        task_type: taskType,
        labels: labels.length > 0 ? labels : undefined,
        due_date: dueDate ? dueDate.toISOString() : undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
      onClose();
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        const detail = err.response?.data?.detail;
        setError(
          typeof detail === "string"
            ? detail
            : "Görev güncellenirken bir hata oluştu.",
        );
      } else {
        setError("Beklenmeyen bir hata oluştu.");
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => {
      if (!activeOrg) throw new Error("Aktif organizasyon yok");
      return taskService.delete(activeOrg.id, projectId, task.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
      onClose();
    },
  });

  const st = statusConfig[task.status];
  const pr = priorityConfig[task.priority];

  /* ─── VIEW MODE ─── */
  if (mode === "view") {
    return (
      <Modal
        title={
          <div className="flex items-center gap-3">
            <span className="rounded-md bg-primary/10 px-2 py-0.5 font-mono text-xs font-medium text-primary">
              {projectKey}-{task.task_number}
            </span>
            <span className="text-base font-semibold">Görev Detayı</span>
          </div>
        }
        open={open}
        onCancel={onClose}
        destroyOnHidden
        width={720}
        footer={
          <div className="flex items-center justify-between">
            <Popconfirm
              title="Görevi silmek istediğinizden emin misiniz?"
              description="Bu işlem geri alınamaz."
              onConfirm={() => deleteMutation.mutate()}
              okText="Sil"
              cancelText="İptal"
              okButtonProps={{ danger: true }}
            >
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-danger transition-colors hover:bg-danger/10"
              >
                <DeleteOutlined />
                Sil
              </button>
            </Popconfirm>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-divider px-4 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-background"
              >
                Kapat
              </button>
              <button
                type="button"
                onClick={() => setMode("edit")}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
              >
                <EditOutlined />
                Düzenle
              </button>
            </div>
          </div>
        }
      >
        <div className="space-y-5 pt-1">
          {/* Title */}
          <h3 className="text-lg font-semibold text-foreground leading-snug">
            {task.title}
          </h3>

          {/* Meta badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${st.color} ${st.bg}`}>
              {st.label}
            </span>
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${pr.color} ${pr.bg}`}>
              <FlagOutlined className="text-[10px]" />
              {pr.label}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/5 px-2.5 py-1 text-xs font-medium text-primary dark:bg-primary/10">
              <AppstoreOutlined className="text-[10px]" />
              {typeConfig[task.task_type]}
            </span>
          </div>

          {/* Description */}
          <div>
            <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">
              Açıklama
            </h4>
            {task.description ? (
              <div className="rounded-xl border border-divider bg-background p-4 text-sm text-foreground">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children }) => <h1 className="mb-2 mt-4 text-lg font-bold text-foreground first:mt-0">{children}</h1>,
                    h2: ({ children }) => <h2 className="mb-2 mt-3 text-base font-semibold text-foreground first:mt-0">{children}</h2>,
                    h3: ({ children }) => <h3 className="mb-1 mt-2 text-sm font-semibold text-foreground first:mt-0">{children}</h3>,
                    p: ({ children }) => <p className="mb-2 leading-relaxed last:mb-0">{children}</p>,
                    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                    em: ({ children }) => <em className="italic">{children}</em>,
                    del: ({ children }) => <del className="text-muted line-through">{children}</del>,
                    code: ({ children, className }) => {
                      if (className?.includes("language-")) {
                        return (
                          <pre className="my-2 overflow-x-auto rounded-lg bg-surface p-3">
                            <code className="font-mono text-xs">{children}</code>
                          </pre>
                        );
                      }
                      return <code className="rounded bg-surface px-1 py-0.5 font-mono text-xs text-primary">{children}</code>;
                    },
                    ul: ({ children }) => <ul className="mb-2 ml-4 list-disc space-y-0.5">{children}</ul>,
                    ol: ({ children }) => <ol className="mb-2 ml-4 list-decimal space-y-0.5">{children}</ol>,
                    a: ({ children, href }) => (
                      <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary-hover">{children}</a>
                    ),
                    blockquote: ({ children }) => <blockquote className="my-2 border-l-2 border-primary/30 pl-3 text-muted italic">{children}</blockquote>,
                  }}
                >
                  {task.description}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="text-sm text-muted italic">Açıklama eklenmemiş</p>
            )}
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-3">
            {task.due_date && (
              <div className="flex items-center gap-2 rounded-lg border border-divider bg-background px-3 py-2">
                <CalendarOutlined className="text-sm text-muted" />
                <div>
                  <span className="block text-[10px] font-medium uppercase tracking-wider text-muted">Bitiş Tarihi</span>
                  <span className="text-sm text-foreground">
                    {new Date(task.due_date).toLocaleDateString("tr-TR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            )}
            {task.assignee_id && (
              <div className="flex items-center gap-2 rounded-lg border border-divider bg-background px-3 py-2">
                <UserOutlined className="text-sm text-muted" />
                <div>
                  <span className="block text-[10px] font-medium uppercase tracking-wider text-muted">Atanan</span>
                  <span className="text-sm text-foreground">{task.assignee_id.slice(0, 8)}...</span>
                </div>
              </div>
            )}
          </div>

          {/* Labels */}
          {task.labels && task.labels.length > 0 && (
            <div>
              <div className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted">
                <TagOutlined className="text-[10px]" />
                Etiketler
              </div>
              <div className="flex flex-wrap gap-1.5">
                {task.labels.map((label) => (
                  <span
                    key={label}
                    className="rounded-md bg-primary/5 px-2.5 py-1 text-xs font-medium text-primary dark:bg-primary/10"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </Modal>
    );
  }

  /* ─── EDIT MODE ─── */
  return (
    <Modal
      title={
        <div className="flex items-center gap-3">
          <span className="rounded-md bg-primary/10 px-2 py-0.5 font-mono text-xs font-medium text-primary">
            {projectKey}-{task.task_number}
          </span>
          <span className="text-base font-semibold">Görevi Düzenle</span>
        </div>
      }
      open={open}
      onCancel={onClose}
      destroyOnHidden
      width={720}
      footer={
        <div className="flex items-center justify-between">
          <Popconfirm
            title="Görevi silmek istediğinizden emin misiniz?"
            description="Bu işlem geri alınamaz."
            onConfirm={() => deleteMutation.mutate()}
            okText="Sil"
            cancelText="İptal"
            okButtonProps={{ danger: true }}
          >
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-danger transition-colors hover:bg-danger/10"
            >
              <DeleteOutlined />
              Sil
            </button>
          </Popconfirm>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMode("view")}
              className="inline-flex items-center gap-1.5 rounded-lg border border-divider px-4 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-background"
            >
              <EyeOutlined />
              Görüntüle
            </button>
            <button
              type="button"
              onClick={handleSubmit((v) => updateMutation.mutate(v))}
              disabled={updateMutation.isPending}
              className="rounded-lg bg-primary px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:opacity-60"
            >
              {updateMutation.isPending ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </div>
      }
    >
      <form className="space-y-4 pt-2">
        {error && (
          <AlertMessage variant="error" title="Hata" description={error} />
        )}

        <FormField
          label="Başlık"
          htmlFor="edit-task-title"
          error={errors.title?.message}
        >
          <FormInput
            id="edit-task-title"
            hasError={!!errors.title}
            {...register("title")}
          />
        </FormField>

        <FormField label="Açıklama" htmlFor="edit-task-desc">
          <MarkdownEditor
            id="edit-task-desc"
            value={watch("description") || ""}
            onChange={(v) => setValue("description", v)}
            placeholder="Görev açıklaması (Markdown destekler)"
            rows={4}
          />
        </FormField>

        <div className="grid grid-cols-3 gap-3">
          <FormField label="Durum" htmlFor="edit-task-status">
            <Select
              id="edit-task-status"
              className="w-full"
              options={statusOptions}
              value={status}
              onChange={setStatus}
            />
          </FormField>

          <FormField label="Öncelik" htmlFor="edit-task-priority">
            <Select
              id="edit-task-priority"
              className="w-full"
              options={priorityOptions}
              value={priority}
              onChange={setPriority}
            />
          </FormField>

          <FormField label="Tür" htmlFor="edit-task-type">
            <Select
              id="edit-task-type"
              className="w-full"
              options={typeOptions}
              value={taskType}
              onChange={setTaskType}
            />
          </FormField>
        </div>

        <FormField label="Etiketler" htmlFor="edit-task-labels">
          <Select
            id="edit-task-labels"
            mode="tags"
            className="w-full"
            placeholder="Etiket ekle..."
            value={labels}
            onChange={setLabels}
            tokenSeparators={[","]}
          />
        </FormField>

        <FormField label="Bitiş Tarihi" htmlFor="edit-task-due">
          <DatePicker
            id="edit-task-due"
            className="w-full"
            placeholder="Bitiş tarihi"
            format="DD.MM.YYYY"
            value={dueDate}
            onChange={setDueDate}
          />
        </FormField>
      </form>
    </Modal>
  );
}
