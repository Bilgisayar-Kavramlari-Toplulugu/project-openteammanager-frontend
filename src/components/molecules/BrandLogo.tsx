"use client";

import BrandMark from "@/components/atoms/BrandMark";

interface BrandLogoProps {
  variant?: "light" | "themed";
  size?: "sm" | "md";
}

export default function BrandLogo({
  variant = "light",
  size = "md",
}: BrandLogoProps) {
  const textColor = variant === "light" ? "text-white" : "text-foreground";
  const textSize = size === "sm" ? "text-sm" : "text-lg";

  return (
    <div className="flex items-center gap-2.5">
      <BrandMark size={size} variant={variant} />
      <span className={`font-bold tracking-tight ${textSize} ${textColor}`}>
        OpenTeamManager
      </span>
    </div>
  );
}
