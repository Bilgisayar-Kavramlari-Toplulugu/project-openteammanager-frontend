"use client";

import { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import FormInput from "@/components/atoms/FormInput";

interface SubtaskComposerProps {
  onSubmit: (title: string) => void;
  pending?: boolean;
}

export default function SubtaskComposer({
  onSubmit,
  pending,
}: SubtaskComposerProps) {
  const [title, setTitle] = useState("");

  const submit = () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setTitle("");
  };

  return (
    <div className="flex items-center gap-2">
      <FormInput
        placeholder="Alt görev ekle..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
        }}
      />
      <button
        type="button"
        disabled={!title.trim() || pending}
        onClick={submit}
        className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
      >
        <PlusOutlined /> Ekle
      </button>
    </div>
  );
}
