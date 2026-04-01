"use client";

import { Select } from "antd";
import type { User } from "@/api/types/user.types";

interface KanbanFiltersProps {
  assignees: { id: string; full_name: string }[];
  labels: string[];
  selectedAssignee: string | undefined;
  selectedLabel: string | undefined;
  onAssigneeChange: (value: string | undefined) => void;
  onLabelChange: (value: string | undefined) => void;
}

export default function KanbanFilters({
  assignees,
  labels,
  selectedAssignee,
  selectedLabel,
  onAssigneeChange,
  onLabelChange,
}: KanbanFiltersProps) {
  return (
    <div className="flex items-center gap-3">
      <Select
        allowClear
        placeholder="Atanan kişi"
        className="w-44"
        value={selectedAssignee}
        onChange={onAssigneeChange}
        options={assignees.map((a) => ({
          label: a.full_name,
          value: a.id,
        }))}
      />
      <Select
        allowClear
        placeholder="Etiket"
        className="w-36"
        value={selectedLabel}
        onChange={onLabelChange}
        options={labels.map((l) => ({ label: l, value: l }))}
      />
    </div>
  );
}
