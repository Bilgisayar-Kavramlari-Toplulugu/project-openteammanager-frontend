"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

import { useAuthStore } from "@/store/auth.store";
import FormInput from "@/components/atoms/FormInput";
import FormPasswordInput from "@/components/atoms/FormPasswordInput";
import PrimaryButton from "@/components/atoms/PrimaryButton";
import AlertMessage from "@/components/atoms/AlertMessage";
import FormField from "@/components/molecules/FormField";

/* ── Schema ── */
const registerSchema = z
  .object({
    full_name: z.string().min(2, "Ad soyad en az 2 karakter olmalıdır."),
    username: z
      .string()
      .min(3, "Kullanıcı adı en az 3 karakter olmalıdır.")
      .max(50, "Kullanıcı adı en fazla 50 karakter olabilir.")
      .regex(
        /^[a-zA-Z0-9_-]+$/,
        "Yalnızca harf, rakam, tire ve alt çizgi kullanılabilir.",
      ),
    email: z
      .string()
      .min(1, "E-posta zorunludur.")
      .email("Geçerli bir e-posta adresi girin."),
    password: z.string().min(6, "Şifre en az 6 karakter olmalıdır."),
    confirmPassword: z.string().min(1, "Şifre tekrarı zorunludur."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Şifreler birbiriyle eşleşmiyor.",
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

/* ── Helpers ── */
function extractError(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const detail = err.response?.data?.detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) return detail.map((d) => d.msg).join(", ");
    return "Kayıt sırasında bir hata oluştu. Bilgilerinizi kontrol edin.";
  }
  return "Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.";
}

/* ── Component ── */
export default function RegisterForm() {
  const router = useRouter();
  const registerUser = useAuthStore((s) => s.register);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      full_name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      await registerUser({
        full_name: values.full_name,
        username: values.username,
        email: values.email,
        password: values.password,
      });
      setSuccess(true);
      setTimeout(() => router.push("/login"), 1200);
    } catch (err) {
      setError(extractError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {error && (
        <AlertMessage variant="error" title="Kayıt başarısız" description={error} />
      )}

      {success && (
        <AlertMessage
          variant="success"
          title="Kayıt başarılı!"
          description="Giriş sayfasına yönlendiriliyorsunuz..."
        />
      )}

      <FormField
        label="Ad Soyad"
        htmlFor="reg-full-name"
        error={errors.full_name?.message}
      >
        <FormInput
          id="reg-full-name"
          autoComplete="name"
          placeholder="Adınız ve soyadınız"
          hasError={!!errors.full_name}
          {...register("full_name")}
        />
      </FormField>

      <FormField
        label="Kullanıcı Adı"
        htmlFor="reg-username"
        error={errors.username?.message}
      >
        <FormInput
          id="reg-username"
          autoComplete="username"
          placeholder="ornek_kullanici"
          hasError={!!errors.username}
          {...register("username")}
        />
      </FormField>

      <FormField label="E-posta" htmlFor="reg-email" error={errors.email?.message}>
        <FormInput
          id="reg-email"
          type="email"
          autoComplete="email"
          placeholder="ornek@ekip.com"
          hasError={!!errors.email}
          {...register("email")}
        />
      </FormField>

      <FormField label="Şifre" htmlFor="reg-password" error={errors.password?.message}>
        <FormPasswordInput
          id="reg-password"
          autoComplete="new-password"
          placeholder="En az 6 karakter"
          hasError={!!errors.password}
          {...register("password")}
        />
      </FormField>

      <FormField
        label="Şifre Tekrarı"
        htmlFor="reg-confirm"
        error={errors.confirmPassword?.message}
      >
        <FormPasswordInput
          id="reg-confirm"
          autoComplete="new-password"
          placeholder="Şifrenizi tekrar girin"
          hasError={!!errors.confirmPassword}
          {...register("confirmPassword")}
        />
      </FormField>

      <PrimaryButton type="submit" loading={submitting}>
        Hesap Oluştur
      </PrimaryButton>

      <p className="text-center text-sm text-muted">
        Zaten hesabın var mı?{" "}
        <Link
          href="/login"
          className="font-medium text-primary transition-colors hover:text-primary-hover"
        >
          Giriş yap
        </Link>
      </p>
    </form>
  );
}
