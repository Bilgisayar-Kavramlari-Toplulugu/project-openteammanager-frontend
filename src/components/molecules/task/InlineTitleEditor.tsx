"use client";

import { useState, useEffect, useRef } from "react";
import FormInput from "@/components/atoms/FormInput";

interface InlineTitleEditorProps {
  value: string;
  onSubmit: (title: string) => void;
  minLengthError?: string;
}

export default function InlineTitleEditor({
  value,
  onSubmit,
  minLengthError = "Başlık boş olamaz.",
}: InlineTitleEditorProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const commit = () => {
    const trimmed = draft.trim();
    if (!trimmed) {
      setError(minLengthError);
      return;
    }
    setError(null);
    setEditing(false);
    if (trimmed !== value) onSubmit(trimmed);
  };

  const cancel = () => {
    setDraft(value);
    setError(null);
    setEditing(false);
  };

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="flex-1 rounded-md px-1 py-0.5 text-left text-base font-semibold text-foreground transition-colors hover:bg-surface"
        title="Düzenlemek için tıklayın"
      >
        {value}
      </button>
    );
  }

  return (
    <div className="flex-1">
      <FormInput
        ref={inputRef}
        value={draft}
        hasError={!!error}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
          else if (e.key === "Escape") cancel();
        }}
      />
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}
