"use client";

import {
  useCallback,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";
import { InboxOutlined, LoadingOutlined } from "@ant-design/icons";
import { message, Progress } from "antd";
import {
  formatFileSize,
  validateAttachment,
} from "@/api/types/attachment.types";

interface UploadItem {
  id: string;
  file: File;
  percent: number;
  error?: string;
  done?: boolean;
}

interface FileUploaderProps {
  onUpload: (
    file: File,
    onProgress: (percent: number) => void,
  ) => Promise<unknown>;
  multiple?: boolean;
  disabled?: boolean;
}

export default function FileUploader({
  onUpload,
  multiple = true,
  disabled,
}: FileUploaderProps) {
  const [items, setItems] = useState<UploadItem[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const updateItem = (id: string, patch: Partial<UploadItem>) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, ...patch } : it)),
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const startUpload = useCallback(
    async (file: File) => {
      const error = validateAttachment(file);
      if (error) {
        message.error(error);
        return;
      }
      const id = `${file.name}-${Date.now()}-${Math.random()}`;
      setItems((prev) => [...prev, { id, file, percent: 0 }]);
      try {
        await onUpload(file, (percent) => updateItem(id, { percent }));
        updateItem(id, { percent: 100, done: true });
        setTimeout(() => removeItem(id), 1200);
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Yükleme başarısız oldu.";
        updateItem(id, { error: msg });
        message.error(msg);
      }
    },
    [onUpload],
  );

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const files = Array.from(fileList);
    files.forEach((f) => startUpload(f));
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (disabled) return;
    handleFiles(e.dataTransfer.files);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed px-4 py-6 text-center text-xs transition-colors ${
          dragOver
            ? "border-primary bg-primary/5"
            : "border-divider hover:border-primary/50"
        } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
      >
        <InboxOutlined style={{ fontSize: 28 }} className="text-primary" />
        <div className="font-medium text-foreground">
          Dosya yüklemek için tıklayın veya sürükleyin
        </div>
        <div className="text-muted">Maks. 50 MB · Birden fazla dosya seçebilirsiniz</div>
        <input
          ref={inputRef}
          type="file"
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
          disabled={disabled}
        />
      </div>

      {items.length > 0 && (
        <div className="space-y-1">
          {items.map((it) => (
            <div
              key={it.id}
              className="rounded-lg border border-divider bg-background px-3 py-2 text-xs"
            >
              <div className="mb-1 flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 truncate text-foreground">
                  {!it.done && !it.error && (
                    <LoadingOutlined spin style={{ fontSize: 12 }} />
                  )}
                  <span className="truncate">{it.file.name}</span>
                </span>
                <span className="shrink-0 text-muted">
                  {formatFileSize(it.file.size)}
                </span>
              </div>
              {it.error ? (
                <div className="text-danger">{it.error}</div>
              ) : (
                <Progress
                  percent={it.percent}
                  size="small"
                  status={it.done ? "success" : "active"}
                  showInfo
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
