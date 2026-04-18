export interface Attachment {
  id: string;
  project_id: string;
  task_id: string | null;
  uploaded_by: string;
  filename: string;
  file_size: number;
  mime_type: string;
  download_url: string;
  created_at: string;
}

export const MAX_ATTACHMENT_SIZE = 50 * 1024 * 1024; // 50 MB

export const ALLOWED_MIME_TYPES: string[] = [
  // Images
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  // Docs
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  // Archives
  "application/zip",
  "application/x-tar",
  "application/gzip",
  // Text/Code
  "text/plain",
  "text/csv",
  "text/markdown",
  "application/json",
];

export function validateAttachment(file: File): string | null {
  if (file.size > MAX_ATTACHMENT_SIZE) {
    const mb = (MAX_ATTACHMENT_SIZE / (1024 * 1024)).toFixed(0);
    return `Dosya boyutu ${mb} MB'ı aşamaz.`;
  }
  if (
    ALLOWED_MIME_TYPES.length > 0 &&
    file.type &&
    !ALLOWED_MIME_TYPES.includes(file.type)
  ) {
    return `İzin verilmeyen dosya tipi: ${file.type}`;
  }
  return null;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

export function isImageMime(mime: string): boolean {
  return mime.startsWith("image/");
}
