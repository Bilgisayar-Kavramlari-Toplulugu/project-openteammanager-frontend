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
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "E-posta zorunludur.")
    .email("Geçerli bir e-posta adresi girin."),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

/* ── Helpers ── */
function extractError(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const detail = err.response?.data?.detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) return detail.map((d) => d.msg).join(", ");
    return "Giriş sırasında bir hata oluştu. Bilgilerinizi kontrol edin.";
  }
  return "Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.";
}

/* ── Component ── */
export default function LoginForm() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginFormValues) => {
    if (submitting) return;
    setSubmitting(true);
    setError(null);

    try {
      await login({ email: values.email, password: values.password });
      router.push("/");
    } catch (err) {
      setError(extractError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {error && <AlertMessage variant="error" title="Giriş başarısız" description={error} />}

      <FormField label="E-posta" htmlFor="login-email" error={errors.email?.message}>
        <FormInput
          id="login-email"
          type="email"
          autoComplete="email"
          placeholder="ornek@ekip.com"
          hasError={!!errors.email}
          {...register("email")}
        />
      </FormField>

      <FormField label="Şifre" htmlFor="login-password" error={errors.password?.message}>
        <FormPasswordInput
          id="login-password"
          autoComplete="current-password"
          placeholder="••••••••"
          hasError={!!errors.password}
          {...register("password")}
        />
      </FormField>

      <PrimaryButton type="submit" loading={submitting}>
        Giriş Yap
      </PrimaryButton>

      <p className="text-center text-sm text-muted">
        Henüz hesabın yok mu?{" "}
        <Link
          href="/register"
          className="font-medium text-primary transition-colors hover:text-primary-hover"
        >
          Hesap oluştur
        </Link>
      </p>
    </form>
  );
}
