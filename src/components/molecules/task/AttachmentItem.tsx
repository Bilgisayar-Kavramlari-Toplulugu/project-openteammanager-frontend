"use client";

import { DownloadOutlined, DeleteOutlined } from "@ant-design/icons";
import { Popconfirm } from "antd";
import dayjs from "dayjs";
import FileIcon from "@/components/atoms/FileIcon";
import UserAvatar from "@/components/atoms/UserAvatar";
import {
  formatFileSize,
  isImageMime,
  type Attachment,
} from "@/api/types/attachment.types";

interface AttachmentItemProps {
  attachment: Attachment;
  currentUserId?: string | null;
  isAdmin?: boolean;
  onDelete?: (id: string) => void;
}

export default function AttachmentItem({
  attachment,
  currentUserId,
  isAdmin,
  onDelete,
}: AttachmentItemProps) {
  const isOwner =
    !!currentUserId && currentUserId === attachment.uploaded_by;
  const canDelete = isOwner || !!isAdmin;
  const isImage = isImageMime(attachment.mime_type);

  return (
    <div className="flex items-center gap-3 rounded-lg border border-divider bg-background p-2">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md bg-background-secondary">
        {isImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={attachment.download_url}
            alt={attachment.filename}
            className="h-full w-full object-cover"
          />
        ) : (
          <FileIcon mimeType={attachment.mime_type} size={22} />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium text-foreground">
          {attachment.filename}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted">
          <span>{formatFileSize(attachment.file_size)}</span>
          <span>·</span>
          <span>
            {dayjs(attachment.created_at).format("DD.MM.YYYY HH:mm")}
          </span>
          <span>·</span>
          <UserAvatar userId={attachment.uploaded_by} size={16} showLabel />
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <a
          href={attachment.download_url}
          target="_blank"
          rel="noreferrer"
          download={attachment.filename}
          className="rounded-md p-1.5 text-foreground hover:bg-background-secondary"
          title="İndir"
        >
          <DownloadOutlined />
        </a>
        {canDelete && onDelete && (
          <Popconfirm
            title="Dosyayı sil?"
            okText="Sil"
            cancelText="Vazgeç"
            onConfirm={() => onDelete(attachment.id)}
          >
            <button
              type="button"
              className="rounded-md p-1.5 text-danger hover:bg-danger/10"
              title="Sil"
            >
              <DeleteOutlined />
            </button>
          </Popconfirm>
        )}
      </div>
    </div>
  );
}
