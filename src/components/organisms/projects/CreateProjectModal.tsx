"use client";

import { useState } from "react";
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

const schema = z.object({
  name: z.string().min(1, "Proje ismi zorunludur."),
  description: z.string().optional(),
  key: z
    .string()
    .min(1, "Proje kodu zorunludur.")
    .max(10, "En fazla 10 karakter.")
    .regex(/^[A-Z]+$/, "Yalnızca büyük harf kullanılabilir."),
  category: z.string().optional(),
  visibility: z.enum(["private", "internal", "public"]).default("private"),
  color: z.string().default("#4F46E5"),
});

type FormValues = z.infer<typeof schema>;

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

const visibilityOptions = [
  { label: "Gizli", value: "private" },
  { label: "Dahili", value: "internal" },
  { label: "Herkese Açık", value: "public" },
];

interface CreateProjectModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateProjectModal({
  open,
  onClose,
}: CreateProjectModalProps) {
  const activeOrg = useOrganizationStore((s) => s.activeOrg);
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [stack, setStack] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<
    [dayjs.Dayjs | null, dayjs.Dayjs | null]
  >([null, null]);

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
      name: "",
      description: "",
      key: "",
      category: "",
      visibility: "private",
      color: "#4F46E5",
    },
  });

  const selectedColor = watch("color");

  const mutation = useMutation({
    mutationFn: (data: FormValues) => {
      if (!activeOrg) throw new Error("Aktif organizasyon yok");
      return projectService.create(activeOrg.id, {
        name: data.name,
        description: data.description || undefined,
        key: data.key,
        category: data.category || undefined,
        stack: stack.length > 0 ? stack : undefined,
        visibility: data.visibility,
        color: data.color,
        start_date: dateRange[0]?.format("YYYY-MM-DD"),
        end_date: dateRange[1]?.format("YYYY-MM-DD"),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      handleClose();
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        const detail = err.response?.data?.detail;
        setError(
          typeof detail === "string"
            ? detail
            : "Proje oluşturulurken bir hata oluştu.",
        );
      } else {
        setError("Beklenmeyen bir hata oluştu.");
      }
    },
  });

  const description = watch("description");

  const handleClose = () => {
    reset();
    setStack([]);
    setDateRange([null, null]);
    setError(null);
    onClose();
  };

  const onSubmit = (values: FormValues) => {
    setError(null);
    mutation.mutate(values);
  };

  return (
    <Modal
      title="Yeni Proje Oluştur"
      open={open}
      onCancel={handleClose}
      onOk={handleSubmit(onSubmit)}
      okText="Oluştur"
      cancelText="İptal"
      confirmLoading={mutation.isPending}
      destroyOnHidden
      width={680}
    >
      <form className="space-y-4 pt-2">
        {error && (
          <AlertMessage
            variant="error"
            title="Hata"
            description={error}
          />
        )}

        <FormField
          label="Proje İsmi"
          htmlFor="proj-name"
          error={errors.name?.message}
        >
          <FormInput
            id="proj-name"
            placeholder="Proje ismi"
            hasError={!!errors.name}
            {...register("name")}
          />
        </FormField>

        <FormField
          label="Proje Kodu"
          htmlFor="proj-key"
          error={errors.key?.message}
        >
          <FormInput
            id="proj-key"
            placeholder="OTM"
            hasError={!!errors.key}
            maxLength={10}
            {...register("key", {
              onChange: (e) => {
                e.target.value = e.target.value.toUpperCase();
              },
            })}
          />
        </FormField>

        <FormField label="Açıklama" htmlFor="proj-desc">
          <MarkdownEditor
            id="proj-desc"
            value={description || ""}
            onChange={(v) => setValue("description", v)}
            placeholder="Proje açıklaması (Markdown destekler)"
            rows={3}
          />
        </FormField>

        <FormField label="Kategori" htmlFor="proj-category">
          <FormInput
            id="proj-category"
            placeholder="Kategori (opsiyonel)"
            {...register("category")}
          />
        </FormField>

        <FormField label="Teknoloji Stack" htmlFor="proj-stack">
          <Select
            id="proj-stack"
            mode="tags"
            className="w-full"
            placeholder="React, Node.js, PostgreSQL..."
            value={stack}
            onChange={setStack}
            tokenSeparators={[","]}
          />
        </FormField>

        <FormField label="Görünürlük" htmlFor="proj-visibility">
          <Select
            id="proj-visibility"
            className="w-full"
            options={visibilityOptions}
            value={watch("visibility")}
            onChange={(v) => setValue("visibility", v)}
          />
        </FormField>

        <FormField label="Renk / Tema" htmlFor="proj-color">
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

        <FormField label="Tarih Aralığı" htmlFor="proj-dates">
          <DatePicker.RangePicker
            id="proj-dates"
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
