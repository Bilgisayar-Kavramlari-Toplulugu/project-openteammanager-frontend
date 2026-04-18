"use client";

import {
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import type { ProjectMember } from "@/api/types/project.types";

interface MentionTextareaProps {
  value: string;
  onChange: (next: string) => void;
  members: ProjectMember[];
  placeholder?: string;
  rows?: number;
  autoFocus?: boolean;
  onSubmit?: () => void;
}

interface MentionState {
  open: boolean;
  query: string;
  start: number; // index of '@'
}

export default function MentionTextarea({
  value,
  onChange,
  members,
  placeholder = "Yorum yazın... (@ ile kullanıcı etiketleyin)",
  rows = 3,
  autoFocus,
  onSubmit,
}: MentionTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [mention, setMention] = useState<MentionState>({
    open: false,
    query: "",
    start: -1,
  });
  const [activeIndex, setActiveIndex] = useState(0);

  const suggestions = useMemo(() => {
    if (!mention.open) return [];
    const q = mention.query.toLowerCase();
    return members
      .filter((m) => m.user_id.toLowerCase().includes(q))
      .slice(0, 6);
  }, [mention, members]);

  // Reset active index when suggestion context changes (render-time state sync)
  const mentionKey = mention.open ? mention.query : null;
  const [prevKey, setPrevKey] = useState<string | null>(mentionKey);
  if (prevKey !== mentionKey) {
    setPrevKey(mentionKey);
    setActiveIndex(0);
  }

  const detectMention = (text: string, caret: number) => {
    // Walk back from caret to find '@'
    let i = caret - 1;
    while (i >= 0) {
      const ch = text[i];
      if (ch === "@") {
        const before = i === 0 ? " " : text[i - 1];
        if (/\s|^/.test(before) || i === 0) {
          const query = text.slice(i + 1, caret);
          if (/\s/.test(query)) {
            setMention({ open: false, query: "", start: -1 });
            return;
          }
          setMention({ open: true, query, start: i });
          return;
        }
        break;
      }
      if (/\s/.test(ch)) break;
      i -= 1;
    }
    setMention({ open: false, query: "", start: -1 });
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const next = e.target.value;
    onChange(next);
    detectMention(next, e.target.selectionStart ?? next.length);
  };

  const insertMention = (userId: string) => {
    if (mention.start < 0) return;
    const before = value.slice(0, mention.start);
    const after = value.slice(
      mention.start + 1 + mention.query.length,
    );
    const token = `@${userId.slice(0, 8)} `;
    const next = `${before}${token}${after}`;
    onChange(next);
    setMention({ open: false, query: "", start: -1 });
    requestAnimationFrame(() => {
      const ta = textareaRef.current;
      if (ta) {
        const pos = before.length + token.length;
        ta.focus();
        ta.setSelectionRange(pos, pos);
      }
    });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (mention.open && suggestions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % suggestions.length);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex(
          (i) => (i - 1 + suggestions.length) % suggestions.length,
        );
        return;
      }
      if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        insertMention(suggestions[activeIndex].user_id);
        return;
      }
      if (e.key === "Escape") {
        setMention({ open: false, query: "", start: -1 });
        return;
      }
    }
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && onSubmit) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        rows={rows}
        autoFocus={autoFocus}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full resize-y rounded-xl border border-divider bg-input px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary placeholder:text-muted/60"
      />
      {mention.open && suggestions.length > 0 && (
        <div className="absolute left-0 top-full z-20 mt-1 w-64 overflow-hidden rounded-lg border border-divider bg-background shadow-lg">
          {suggestions.map((m, idx) => (
            <button
              key={m.user_id}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                insertMention(m.user_id);
              }}
              className={`flex w-full items-center gap-2 px-3 py-2 text-left text-xs transition-colors ${
                idx === activeIndex
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-background-secondary text-foreground"
              }`}
            >
              <span className="font-mono">@{m.user_id.slice(0, 8)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
