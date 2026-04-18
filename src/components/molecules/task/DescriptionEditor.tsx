"use client";

import { useState, useEffect } from "react";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import MarkdownEditor from "@/components/molecules/MarkdownEditor";

interface DescriptionEditorProps {
  value: string | null;
  onSave: (value: string) => void;
}

export default function DescriptionEditor({
  value,
  onSave,
}: DescriptionEditorProps) {
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [draft, setDraft] = useState(value || "");

  useEffect(() => {
    setDraft(value || "");
  }, [value]);

  const save = () => {
    onSave(draft);
    setMode("view");
  };

  const cancel = () => {
    setDraft(value || "");
    setMode("view");
  };

  return (
    <section>
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-xs font-medium uppercase tracking-wider text-muted">
          Açıklama
        </h4>
        <button
          type="button"
          onClick={() => setMode((m) => (m === "view" ? "edit" : "view"))}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-muted transition-colors hover:bg-surface hover:text-foreground"
        >
          {mode === "view" ? (
            <>
              <EditOutlined /> Düzenle
            </>
          ) : (
            <>
              <EyeOutlined /> Önizle
            </>
          )}
        </button>
      </div>

      {mode === "edit" ? (
        <div className="space-y-2">
          <MarkdownEditor
            value={draft}
            onChange={setDraft}
            placeholder="Görev açıklaması (Markdown destekler)"
            rows={8}
          />
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={cancel}
              className="rounded-lg border border-divider px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-surface"
            >
              Vazgeç
            </button>
            <button
              type="button"
              onClick={save}
              className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-primary-hover"
            >
              Kaydet
            </button>
          </div>
        </div>
      ) : value ? (
        <div className="rounded-xl border border-divider bg-background p-4 text-sm text-foreground">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
        </div>
      ) : (
        <p className="text-sm italic text-muted">Açıklama eklenmemiş</p>
      )}
    </section>
  );
}
