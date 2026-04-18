import {
  FileImageOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  FileExcelOutlined,
  FilePptOutlined,
  FileZipOutlined,
  FileTextOutlined,
  FileOutlined,
} from "@ant-design/icons";

interface FileIconProps {
  mimeType: string;
  size?: number;
  className?: string;
}

export default function FileIcon({
  mimeType,
  size = 18,
  className,
}: FileIconProps) {
  const style = { fontSize: size };
  if (mimeType.startsWith("image/"))
    return <FileImageOutlined className={className} style={style} />;
  if (mimeType === "application/pdf")
    return <FilePdfOutlined className={className} style={style} />;
  if (
    mimeType === "application/msword" ||
    mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  )
    return <FileWordOutlined className={className} style={style} />;
  if (
    mimeType === "application/vnd.ms-excel" ||
    mimeType ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    mimeType === "text/csv"
  )
    return <FileExcelOutlined className={className} style={style} />;
  if (
    mimeType === "application/vnd.ms-powerpoint" ||
    mimeType ===
      "application/vnd.openxmlformats-officedocument.presentationml.presentation"
  )
    return <FilePptOutlined className={className} style={style} />;
  if (
    mimeType === "application/zip" ||
    mimeType === "application/x-tar" ||
    mimeType === "application/gzip"
  )
    return <FileZipOutlined className={className} style={style} />;
  if (
    mimeType.startsWith("text/") ||
    mimeType === "application/json" ||
    mimeType === "text/markdown"
  )
    return <FileTextOutlined className={className} style={style} />;
  return <FileOutlined className={className} style={style} />;
}
