"use client";

import { Select } from "antd";
import UserAvatar from "@/components/atoms/UserAvatar";
import type { ProjectMember } from "@/api/types/project.types";

interface AssigneeSelectorProps {
  members: ProjectMember[];
  value: string | null;
  currentUserId?: string | null;
  onChange: (userId: string | null) => void;
  onInvalid?: (msg: string) => void;
}

export default function AssigneeSelector({
  members,
  value,
  currentUserId,
  onChange,
  onInvalid,
}: AssigneeSelectorProps) {
  const options = members.map((m) => ({
    label: m.user_id.slice(0, 8),
    value: m.user_id,
  }));

  const canAssignSelf = !!currentUserId && value !== currentUserId;

  const handleChange = (v: string | undefined) => {
    const next = v ?? null;
    if (next && !members.some((m) => m.user_id === next)) {
      onInvalid?.("Sadece proje üyeleri atanabilir.");
      return;
    }
    onChange(next);
  };

  return (
    <div className="space-y-2">
      <Select<string>
        className="w-full"
        placeholder="Kullanıcı seç"
        options={options}
        value={value || undefined}
        allowClear
        onChange={handleChange}
      />
      {value && <UserAvatar userId={value} showLabel />}
      {canAssignSelf && (
        <button
          type="button"
          onClick={() => onChange(currentUserId!)}
          className="w-full rounded-lg border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/10"
        >
          Bu Görevi Al
        </button>
      )}
    </div>
  );
}
