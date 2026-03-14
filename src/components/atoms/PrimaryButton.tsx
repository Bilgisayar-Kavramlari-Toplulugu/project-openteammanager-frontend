"use client";

import { LoadingOutlined } from "@ant-design/icons";

interface PrimaryButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  children: React.ReactNode;
}

export default function PrimaryButton({
  loading,
  disabled,
  children,
  className = "",
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      disabled={loading || disabled}
      className={[
        "relative flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition-all duration-200",
        "bg-primary hover:bg-primary-hover active:scale-[0.98]",
        "shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/30",
        "disabled:pointer-events-none disabled:opacity-60",
        className,
      ].join(" ")}
      {...props}
    >
      {loading && <LoadingOutlined className="animate-spin" />}
      {children}
    </button>
  );
}
