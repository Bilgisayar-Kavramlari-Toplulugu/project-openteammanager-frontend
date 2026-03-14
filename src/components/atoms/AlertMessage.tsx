"use client";

import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

type AlertVariant = "error" | "success" | "info";

interface AlertMessageProps {
  variant: AlertVariant;
  title: string;
  description?: string;
}

const config: Record<
  AlertVariant,
  { icon: React.ReactNode; border: string; bg: string; text: string }
> = {
  error: {
    icon: <CloseCircleOutlined />,
    border: "border-danger/30",
    bg: "bg-danger/5",
    text: "text-danger",
  },
  success: {
    icon: <CheckCircleOutlined />,
    border: "border-success/30",
    bg: "bg-success/5",
    text: "text-success",
  },
  info: {
    icon: <InfoCircleOutlined />,
    border: "border-accent/30",
    bg: "bg-accent/5",
    text: "text-accent",
  },
};

export default function AlertMessage({
  variant,
  title,
  description,
}: AlertMessageProps) {
  const c = config[variant];

  return (
    <div
      className={`flex items-start gap-3 rounded-xl border ${c.border} ${c.bg} px-4 py-3`}
      role="alert"
    >
      <span className={`mt-0.5 text-base ${c.text}`}>{c.icon}</span>
      <div className="min-w-0 flex-1">
        <p className={`text-sm font-medium ${c.text}`}>{title}</p>
        {description && (
          <p className="mt-0.5 text-xs text-muted">{description}</p>
        )}
      </div>
    </div>
  );
}
