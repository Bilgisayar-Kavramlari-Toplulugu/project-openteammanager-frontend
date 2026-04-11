"use client";

import type { Project } from "@/api/types/project.types";

const filters: { label: string; value: Project["status"] | "all" }[] = [
  { label: "Tümü", value: "all" },
  { label: "Aktif", value: "active" },
  { label: "Planlama", value: "planning" },
];

interface ProjectFiltersProps {
  active: string;
  onChange: (value: string) => void;
}

export default function ProjectFilters({
  active,
  onChange,
}: ProjectFiltersProps) {
  return (
    <div className="flex items-center gap-1.5 rounded-xl bg-background p-1">
      {filters.map((f) => (
        <button
          key={f.value}
          type="button"
          onClick={() => onChange(f.value)}
          className={[
            "rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all duration-200",
            active === f.value
              ? "bg-surface text-foreground shadow-sm"
              : "text-muted hover:text-foreground",
          ].join(" ")}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
