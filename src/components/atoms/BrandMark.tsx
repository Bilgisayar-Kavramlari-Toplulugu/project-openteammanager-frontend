"use client";

interface BrandMarkProps {
  size?: "sm" | "md";
  variant?: "light" | "themed";
}

const sizes = {
  sm: "h-7 w-7 text-xs",
  md: "h-9 w-9 text-sm",
};

export default function BrandMark({
  size = "md",
  variant = "light",
}: BrandMarkProps) {
  const base = sizes[size];
  const color =
    variant === "light"
      ? "bg-white/10 text-white backdrop-blur-sm"
      : "bg-primary/10 text-primary";

  return (
    <div
      className={`inline-flex items-center justify-center rounded-xl font-black ${base} ${color}`}
    >
      O
    </div>
  );
}
