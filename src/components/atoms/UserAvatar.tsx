import { Avatar, Tooltip } from "antd";
import { UserOutlined } from "@ant-design/icons";

interface UserAvatarProps {
  userId: string | null;
  size?: "small" | "default" | number;
  showLabel?: boolean;
}

export default function UserAvatar({
  userId,
  size = "small",
  showLabel = false,
}: UserAvatarProps) {
  if (!userId) return null;

  const short = `${userId.slice(0, 8)}...`;

  const avatar = <Avatar size={size} icon={<UserOutlined />} />;

  if (!showLabel) {
    return (
      <Tooltip title={userId}>
        <span className="inline-flex">{avatar}</span>
      </Tooltip>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {avatar}
      <Tooltip title={userId}>
        <span className="text-xs text-foreground">{short}</span>
      </Tooltip>
    </div>
  );
}
