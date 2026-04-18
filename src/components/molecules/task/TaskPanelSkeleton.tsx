import { Skeleton } from "antd";

export default function TaskPanelSkeleton() {
  return (
    <div className="flex h-full flex-col gap-6 p-6 lg:flex-row">
      <div className="flex-1 space-y-4">
        <Skeleton active paragraph={{ rows: 4 }} />
        <Skeleton active paragraph={{ rows: 3 }} />
      </div>
      <div className="w-full space-y-4 lg:w-80">
        <Skeleton active paragraph={{ rows: 2 }} />
        <Skeleton active paragraph={{ rows: 2 }} />
        <Skeleton active paragraph={{ rows: 2 }} />
      </div>
    </div>
  );
}
