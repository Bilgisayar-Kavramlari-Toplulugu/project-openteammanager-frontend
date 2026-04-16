"use client";

import { useState } from "react";

interface CommentComposerProps {
  onSubmit: (content: string) => void;
  pending?: boolean;
}

export default function CommentComposer({
  onSubmit,
  pending,
}: CommentComposerProps) {
  const [content, setContent] = useState("");

  const submit = () => {
    const trimmed = content.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setContent("");
  };

  return (
    <div className="space-y-2">
      <textarea
        rows={3}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Yorum yazın..."
        className="w-full resize-y rounded-xl border border-divider bg-input px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary placeholder:text-muted/60"
      />
      <div className="flex justify-end">
        <button
          type="button"
          disabled={!content.trim() || pending}
          onClick={submit}
          className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
        >
          {pending ? "Gönderiliyor..." : "Yorum Gönder"}
        </button>
      </div>
    </div>
  );
}
