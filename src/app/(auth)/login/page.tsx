"use client";

import AuthLayout from "@/components/templates/AuthLayout";
import LoginForm from "@/components/organisms/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthLayout
      title="Hesabına giriş yap"
      description="E-posta ve şifrenle giriş yaparak projelerine kaldığın yerden devam et."
    >
      <LoginForm />
    </AuthLayout>
  );
}
