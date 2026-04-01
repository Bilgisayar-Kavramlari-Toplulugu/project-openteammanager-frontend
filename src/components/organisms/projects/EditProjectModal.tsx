"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal, DatePicker, Select } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import dayjs from "dayjs";

import { projectService } from "@/api/services/project.service";
import { useOrganizationStore } from "@/store/organization.store";
import FormInput from "@/components/atoms/FormInput";
import FormField from "@/components/molecules/FormField";
import MarkdownEditor from "@/components/molecules/MarkdownEditor";
import AlertMessage from "@/components/atoms/AlertMessage";
import type { Project } from "@/api/types/project.types";

const schema = z.object({
  name: z.string().min(1, "Proje ismi zorunludur."),
  description: z.string().optional(),
  status: z.enum(["active", "planning", "on_hold", "completed", "archived"]),
  color: z.string(),
  category: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const statusOptions = [
  { label: "Aktif", value: "active" },
  { label: "Planlama", value: "planning" },
  { label: "Beklemede", value: "on_hold" },
  { label: "Tamamlandı", value: "completed" },
  { label: "Arşivlendi", value: "archived" },
];

const colorOptions = [
  "#4F46E5",
  "#0891B2",
  "#059669",
  "#D97706",
  "#DC2626",
  "#7C3AED",
  "#DB2777",
  "#2563EB",
];

interface EditProjectModalProps {
  project: Project;
  open: boolean;
  onClose: () => void;
}

export default function EditProjectModal({
  project,
  open,
  onClose,
}: EditProjectModalProps) {
  const activeOrg = useOrganizationStore((s) => s.activeOrg);
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [stack, setStack] = useState<string[]>(project.stack || []);
  const [dateRange, setDateRange] = useState<
    [dayjs.Dayjs | null, dayjs.Dayjs | null]
  >([
    project.start_date ? dayjs(project.start_date) : null,
    project.end_date ? dayjs(project.end_date) : null,
  ]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: project.name,
      description: project.description || "",
      status: project.status,
      color: project.color,
      category: project.category || "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: project.name,
        description: project.description || "",
        status: project.status,
        color: project.color,
        category: project.category || "",
      });
      setStack(project.stack || []);
      setDateRange([
        project.start_date ? dayjs(project.start_date) : null,
        project.end_date ? dayjs(project.end_date) : null,
      ]);
    }
  }, [open, project, reset]);

  const selectedColor = watch("color");

  const mutation = useMutation({
    mutationFn: (data: FormValues) => {
      if (!activeOrg) throw new Error("Aktif organizasyon yok");
      return projectService.update(activeOrg.id, project.id, {
        name: data.name,
        description: data.description || undefined,
        status: data.status,
        stack,
        color: data.color,
        category: data.category || undefined,
        start_date: dateRange[0]?.format("YYYY-MM-DD"),
        end_date: dateRange[1]?.format("YYYY-MM-DD"),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({
        queryKey: ["project", project.id],
      });
      onClose();
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        const detail = err.response?.data?.detail;
        setError(
          typeof detail === "string"
            ? detail
            : "Proje güncellenirken bir hata oluştu.",
        );
      } else {
        setError("Beklenmeyen bir hata oluştu.");
      }
    },
  });

  return (
    <Modal
      title="Projeyi Düzenle"
      open={open}
      onCancel={onClose}
      onOk={handleSubmit((v) => mutation.mutate(v))}
      okText="Kaydet"
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
          label="Proje İsmi"
          htmlFor="edit-name"
          error={errors.name?.message}
        >
          <FormInput
            id="edit-name"
            hasError={!!errors.name}
            {...register("name")}
          />
        </FormField>

        <FormField label="Açıklama" htmlFor="edit-desc">
          <MarkdownEditor
            id="edit-desc"
            value={watch("description") || ""}
            onChange={(v) => setValue("description", v)}
            placeholder="Proje açıklaması (Markdown destekler)"
            rows={3}
          />
        </FormField>

        <FormField label="Durum" htmlFor="edit-status">
          <Select
            id="edit-status"
            className="w-full"
            options={statusOptions}
            value={watch("status")}
            onChange={(v) => setValue("status", v)}
          />
        </FormField>

        <FormField label="Teknoloji Stack" htmlFor="edit-stack">
          <Select
            id="edit-stack"
            mode="tags"
            className="w-full"
            placeholder="React, Node.js..."
            value={stack}
            onChange={setStack}
            tokenSeparators={[","]}
          />
        </FormField>

        <FormField label="Kategori" htmlFor="edit-category">
          <FormInput
            id="edit-category"
            placeholder="Kategori (opsiyonel)"
            {...register("category")}
          />
        </FormField>

        <FormField label="Renk / Tema" htmlFor="edit-color">
          <div className="flex items-center gap-2">
            {colorOptions.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setValue("color", c)}
                className={[
                  "h-7 w-7 rounded-full border-2 transition-all",
                  selectedColor === c
                    ? "border-foreground scale-110"
                    : "border-transparent hover:scale-105",
                ].join(" ")}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </FormField>

        <FormField label="Tarih Aralığı" htmlFor="edit-dates">
          <DatePicker.RangePicker
            id="edit-dates"
            className="w-full"
            placeholder={["Başlangıç", "Bitiş"]}
            value={dateRange}
            onChange={(dates) =>
              setDateRange(dates ? [dates[0], dates[1]] : [null, null])
            }
            format="DD.MM.YYYY"
          />
        </FormField>
      </form>
    </Modal>
  );
}
