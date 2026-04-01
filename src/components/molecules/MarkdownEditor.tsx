"use client";

import {
  useState,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  BoldOutlined,
  ItalicOutlined,
  StrikethroughOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
  CodeOutlined,
  LinkOutlined,
  EyeOutlined,
  EditOutlined,
} from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  rows?: number;
  id?: string;
}

interface ToolbarAction {
  icon: React.ReactNode;
  title: string;
  prefix: string;
  suffix: string;
  block?: boolean;
}

const toolbarActions: ToolbarAction[] = [
  {
    icon: <BoldOutlined />,
    title: "Kalın",
    prefix: "**",
    suffix: "**",
  },
  {
    icon: <ItalicOutlined />,
    title: "İtalik",
    prefix: "_",
    suffix: "_",
  },
  {
    icon: <StrikethroughOutlined />,
    title: "Üstü çizili",
    prefix: "~~",
    suffix: "~~",
  },
  {
    icon: <CodeOutlined />,
    title: "Kod",
    prefix: "`",
    suffix: "`",
  },
  {
    icon: <LinkOutlined />,
    title: "Bağlantı",
    prefix: "[",
    suffix: "](url)",
  },
  {
    icon: <UnorderedListOutlined />,
    title: "Madde listesi",
    prefix: "- ",
    suffix: "",
    block: true,
  },
  {
    icon: <OrderedListOutlined />,
    title: "Numaralı liste",
    prefix: "1. ",
    suffix: "",
    block: true,
  },
];

const MarkdownEditor = forwardRef<HTMLTextAreaElement, MarkdownEditorProps>(
  function MarkdownEditor(
    { value = "", onChange, placeholder, rows = 4, id },
    ref,
  ) {
    const [preview, setPreview] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useImperativeHandle(ref, () => textareaRef.current!);

    const applyAction = useCallback(
      (action: ToolbarAction) => {
        const ta = textareaRef.current;
        if (!ta) return;

        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const selected = value.slice(start, end);
        const before = value.slice(0, start);
        const after = value.slice(end);

        let newText: string;
        let cursorPos: number;

        if (action.block) {
          // For block-level actions, add prefix at line start
          const lineStart = before.lastIndexOf("\n") + 1;
          const beforeLine = value.slice(0, lineStart);
          const lineContent = selected || "metin";
          newText =
            beforeLine +
            action.prefix +
            lineContent +
            action.suffix +
            after;
          cursorPos = lineStart + action.prefix.length + lineContent.length;
        } else {
          const placeholder = selected || "metin";
          newText =
            before +
            action.prefix +
            placeholder +
            action.suffix +
            after;
          cursorPos = start + action.prefix.length + placeholder.length;
        }

        onChange?.(newText);

        // Restore cursor position after React re-render
        requestAnimationFrame(() => {
          ta.focus();
          if (selected) {
            ta.setSelectionRange(
              start + action.prefix.length,
              start + action.prefix.length + selected.length,
            );
          } else {
            ta.setSelectionRange(
              start + action.prefix.length,
              cursorPos,
            );
          }
        });
      },
      [value, onChange],
    );

    return (
      <div className="overflow-hidden rounded-xl border border-divider transition-colors focus-within:border-primary">
        {/* Toolbar */}
        <div className="flex items-center justify-between border-b border-divider bg-input px-2 py-1">
          <div className="flex items-center gap-0.5">
            {toolbarActions.map((action) => (
              <button
                key={action.title}
                type="button"
                title={action.title}
                onClick={() => applyAction(action)}
                className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface hover:text-foreground"
              >
                {action.icon}
              </button>
            ))}
          </div>

          {/* Preview toggle */}
          <button
            type="button"
            onClick={() => setPreview(!preview)}
            title={preview ? "Düzenle" : "Önizle"}
            className={[
              "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-colors",
              preview
                ? "bg-primary/10 text-primary"
                : "text-muted hover:bg-surface hover:text-foreground",
            ].join(" ")}
          >
            {preview ? (
              <>
                <EditOutlined className="text-[11px]" />
                Düzenle
              </>
            ) : (
              <>
                <EyeOutlined className="text-[11px]" />
                Önizle
              </>
            )}
          </button>
        </div>

        {/* Editor / Preview */}
        {preview ? (
          <div className="prose-sm min-h-[100px] bg-input px-4 py-3 text-sm text-foreground">
            {value ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => (
                    <h1 className="mb-2 mt-4 text-lg font-bold text-foreground first:mt-0">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="mb-2 mt-3 text-base font-semibold text-foreground first:mt-0">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="mb-1 mt-2 text-sm font-semibold text-foreground first:mt-0">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="mb-2 leading-relaxed text-foreground last:mb-0">
                      {children}
                    </p>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-foreground">
                      {children}
                    </strong>
                  ),
                  em: ({ children }) => (
                    <em className="italic">{children}</em>
                  ),
                  del: ({ children }) => (
                    <del className="text-muted line-through">{children}</del>
                  ),
                  code: ({ children, className }) => {
                    const isBlock = className?.includes("language-");
                    if (isBlock) {
                      return (
                        <pre className="my-2 overflow-x-auto rounded-lg bg-surface p-3">
                          <code className="font-mono text-xs text-foreground">
                            {children}
                          </code>
                        </pre>
                      );
                    }
                    return (
                      <code className="rounded bg-surface px-1 py-0.5 font-mono text-xs text-primary">
                        {children}
                      </code>
                    );
                  },
                  ul: ({ children }) => (
                    <ul className="mb-2 ml-4 list-disc space-y-0.5 text-foreground">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="mb-2 ml-4 list-decimal space-y-0.5 text-foreground">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-foreground">{children}</li>
                  ),
                  a: ({ children, href }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline hover:text-primary-hover"
                    >
                      {children}
                    </a>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="my-2 border-l-2 border-primary/30 pl-3 text-muted italic">
                      {children}
                    </blockquote>
                  ),
                  hr: () => <hr className="my-3 border-divider" />,
                  table: ({ children }) => (
                    <div className="my-2 overflow-x-auto">
                      <table className="w-full border-collapse text-sm">
                        {children}
                      </table>
                    </div>
                  ),
                  th: ({ children }) => (
                    <th className="border border-divider bg-surface px-3 py-1.5 text-left text-xs font-semibold text-foreground">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="border border-divider px-3 py-1.5 text-foreground">
                      {children}
                    </td>
                  ),
                }}
              >
                {value}
              </ReactMarkdown>
            ) : (
              <span className="text-muted">Henüz içerik yok</span>
            )}
          </div>
        ) : (
          <textarea
            ref={textareaRef}
            id={id}
            rows={rows}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            className="w-full resize-y bg-input px-4 py-2.5 text-sm text-foreground outline-none placeholder:text-muted/60"
          />
        )}
      </div>
    );
  },
);

export default MarkdownEditor;
