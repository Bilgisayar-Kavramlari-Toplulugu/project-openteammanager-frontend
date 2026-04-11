"use client";

import AuthLayout from "@/components/templates/AuthLayout";
import RegisterForm from "@/components/organisms/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Ücretsiz hesap oluştur"
      description="Hemen kaydol, ekibini davet et ve projelerini organize etmeye başla."
    >
      <RegisterForm />
    </AuthLayout>
  );
}
