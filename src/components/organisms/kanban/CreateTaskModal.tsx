"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal, Select, DatePicker } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import { taskService } from "@/api/services/task.service";
import { taskKeys } from "@/api/queryKeys";
import { priorityOptions, typeOptions } from "@/api/constants/task";
import { useOrganizationStore } from "@/store/organization.store";
import FormInput from "@/components/atoms/FormInput";
import FormField from "@/components/molecules/FormField";
import MarkdownEditor from "@/components/molecules/MarkdownEditor";
import AlertMessage from "@/components/atoms/AlertMessage";
import type { TaskStatus } from "@/api/types/task.types";

const schema = z.object({
  title: z.string().min(1, "Görev başlığı zorunludur."),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface CreateTaskModalProps {
  projectId: string;
  defaultStatus: TaskStatus;
  open: boolean;
  onClose: () => void;
}

export default function CreateTaskModal({
  projectId,
  defaultStatus,
  open,
  onClose,
}: CreateTaskModalProps) {
  const activeOrg = useOrganizationStore((s) => s.activeOrg);
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [priority, setPriority] = useState<string>("medium");
  const [taskType, setTaskType] = useState<string>("task");
  const [labels, setLabels] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState<string | undefined>();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: "", description: "" },
  });

  const mutation = useMutation({
    mutationFn: (data: FormValues) => {
      if (!activeOrg) throw new Error("Aktif organizasyon yok");
      return taskService.create(activeOrg.id, projectId, {
        title: data.title,
        description: data.description || undefined,
        status: defaultStatus,
        priority: priority as "low" | "medium" | "high" | "critical",
        task_type: taskType as "task" | "bug" | "feature" | "epic",
        labels: labels.length > 0 ? labels : undefined,
        due_date: dueDate,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.list(projectId) });
      handleClose();
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        const detail = err.response?.data?.detail;
        setError(
          typeof detail === "string"
            ? detail
            : "Görev oluşturulurken bir hata oluştu.",
        );
      } else {
        setError("Beklenmeyen bir hata oluştu.");
      }
    },
  });

  const handleClose = () => {
    reset();
    setPriority("medium");
    setTaskType("task");
    setLabels([]);
    setDueDate(undefined);
    setError(null);
    onClose();
  };

  return (
    <Modal
      title="Yeni Görev Oluştur"
      open={open}
      onCancel={handleClose}
      onOk={handleSubmit((v) => mutation.mutate(v))}
      okText="Oluştur"
      cancelText="İptal"
      confirmLoading={mutation.isPending}
      destroyOnHidden
      width={680}
    >
      <form className="space-y-4 pt-2">
        {error && (
          <AlertMessage variant="error" title="Hata" description={error} />
        )}

        <FormField
          label="Başlık"
          htmlFor="task-title"
          error={errors.title?.message}
        >
          <FormInput
            id="task-title"
            placeholder="Görev başlığı"
            hasError={!!errors.title}
            {...register("title")}
          />
        </FormField>

        <FormField label="Açıklama" htmlFor="task-desc">
          <MarkdownEditor
            id="task-desc"
            value={watch("description") || ""}
            onChange={(v) => setValue("description", v)}
            placeholder="Görev açıklaması (Markdown destekler)"
            rows={3}
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Öncelik" htmlFor="task-priority">
            <Select
              id="task-priority"
              className="w-full"
              options={priorityOptions}
              value={priority}
              onChange={setPriority}
            />
          </FormField>

          <FormField label="Tür" htmlFor="task-type">
            <Select
              id="task-type"
              className="w-full"
              options={typeOptions}
              value={taskType}
              onChange={setTaskType}
            />
          </FormField>
        </div>

        <FormField label="Etiketler" htmlFor="task-labels">
          <Select
            id="task-labels"
            mode="tags"
            className="w-full"
            placeholder="Etiket ekle..."
            value={labels}
            onChange={setLabels}
            tokenSeparators={[","]}
          />
        </FormField>

        <FormField label="Bitiş Tarihi" htmlFor="task-due">
          <DatePicker
            id="task-due"
            className="w-full"
            placeholder="Bitiş tarihi seçin"
            format="DD.MM.YYYY"
            onChange={(date) =>
              setDueDate(date ? date.toISOString() : undefined)
            }
          />
        </FormField>
      </form>
    </Modal>
  );
}
