"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "antd";
import axios from "axios";

import { organizationService } from "@/api/services/organization.service";
import { useOrganizationStore } from "@/store/organization.store";
import FormInput from "@/components/atoms/FormInput";
import FormField from "@/components/molecules/FormField";
import AlertMessage from "@/components/atoms/AlertMessage";

const schema = z.object({
  name: z.string().min(1, "Organizasyon ismi zorunludur."),
  slug: z
    .string()
    .min(1, "Slug zorunludur.")
    .regex(
      /^[a-z0-9-]+$/,
      "Yalnızca küçük harf, rakam ve tire kullanılabilir.",
    ),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface CreateOrganizationModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateOrganizationModal({
  open,
  onClose,
}: CreateOrganizationModalProps) {
  const fetchOrganizations = useOrganizationStore(
    (s) => s.fetchOrganizations,
  );
  const setActiveOrg = useOrganizationStore((s) => s.setActiveOrg);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", slug: "", description: "" },
  });

  const handleClose = () => {
    reset();
    setError(null);
    onClose();
  };

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await organizationService.create({
        name: values.name,
        slug: values.slug,
        description: values.description || undefined,
      });
      await fetchOrganizations();
      setActiveOrg(res.data);
      handleClose();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const detail = err.response?.data?.detail;
        setError(
          typeof detail === "string"
            ? detail
            : "Organizasyon oluşturulurken bir hata oluştu.",
        );
      } else {
        setError("Beklenmeyen bir hata oluştu.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ı/g, "i")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  return (
    <Modal
      title="Yeni Organizasyon Oluştur"
      open={open}
      onCancel={handleClose}
      onOk={handleSubmit(onSubmit)}
      okText="Oluştur"
      cancelText="İptal"
      confirmLoading={submitting}
      destroyOnHidden
      width={600}
    >
      <form className="space-y-4 pt-2">
        {error && (
          <AlertMessage variant="error" title="Hata" description={error} />
        )}

        <FormField
          label="Organizasyon İsmi"
          htmlFor="org-name"
          error={errors.name?.message}
        >
          <FormInput
            id="org-name"
            placeholder="Topluluk adı"
            hasError={!!errors.name}
            {...register("name", {
              onChange: (e) => {
                setValue("slug", generateSlug(e.target.value));
              },
            })}
          />
        </FormField>

        <FormField
          label="Slug (URL)"
          htmlFor="org-slug"
          error={errors.slug?.message}
        >
          <FormInput
            id="org-slug"
            placeholder="topluluk-adi"
            hasError={!!errors.slug}
            {...register("slug")}
          />
        </FormField>

        <FormField label="Açıklama" htmlFor="org-desc">
          <textarea
            id="org-desc"
            rows={3}
            className="w-full rounded-xl border border-divider bg-input px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="Kısa bir açıklama (opsiyonel)"
            {...register("description")}
          />
        </FormField>
      </form>
    </Modal>
  );
}
