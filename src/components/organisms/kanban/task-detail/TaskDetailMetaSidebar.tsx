"use client";

import { Select, DatePicker, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

import MetaRow from "@/components/molecules/task/MetaRow";
import MetaReadOnly from "@/components/molecules/task/MetaReadOnly";
import AssigneeSelector from "@/components/molecules/task/AssigneeSelector";
import PriorityBadge from "@/components/atoms/PriorityBadge";
import {
  statusOptions,
  priorityOptions,
  typeOptions,
} from "@/api/constants/task";
import type {
  Task,
  TaskStatus,
  TaskPriority,
  TaskType,
} from "@/api/types/task.types";
import type { ProjectMember } from "@/api/types/project.types";

interface TaskDetailMetaSidebarProps {
  task: Task;
  members: ProjectMember[];
  currentUserId?: string | null;
  onPatch: (patch: Partial<Task>) => void;
  onDelete: () => void;
  onInvalid: (msg: string) => void;
}

export default function TaskDetailMetaSidebar({
  task,
  members,
  currentUserId,
  onPatch,
  onDelete,
  onInvalid,
}: TaskDetailMetaSidebarProps) {
  const validateDueDate = (d: dayjs.Dayjs | null): boolean => {
    if (!d) return true;
    return !d.isBefore(dayjs().startOf("day"));
  };

  return (
    <aside className="w-full shrink-0 space-y-5 overflow-y-auto bg-background p-5 lg:w-80">
      <MetaRow label="Durum">
        <Select<TaskStatus>
          className="w-full"
          options={statusOptions}
          value={task.status}
          onChange={(v) => onPatch({ status: v })}
        />
      </MetaRow>

      <MetaRow label="Atanan">
        <AssigneeSelector
          members={members}
          value={task.assignee_id}
          currentUserId={currentUserId}
          onChange={(id) => onPatch({ assignee_id: id })}
          onInvalid={onInvalid}
        />
      </MetaRow>

      <MetaRow label="Öncelik">
        <div className="space-y-2">
          <Select<TaskPriority>
            className="w-full"
            options={priorityOptions}
            value={task.priority}
            onChange={(v) => onPatch({ priority: v })}
          />
          <PriorityBadge priority={task.priority} size="sm" />
        </div>
      </MetaRow>

      <MetaRow label="Tür">
        <Select<TaskType>
          className="w-full"
          options={typeOptions}
          value={task.task_type}
          onChange={(v) => onPatch({ task_type: v })}
        />
      </MetaRow>

      <MetaRow label="Etiketler">
        <Select<string[]>
          mode="tags"
          className="w-full"
          placeholder="Etiket ekle..."
          value={task.labels || []}
          onChange={(v) => onPatch({ labels: v })}
          tokenSeparators={[","]}
        />
      </MetaRow>

      <MetaRow label="Başlangıç Tarihi">
        <DatePicker
          className="w-full"
          format="DD.MM.YYYY"
          value={task.start_date ? dayjs(task.start_date) : null}
          onChange={(d) =>
            onPatch({ start_date: d ? d.format("YYYY-MM-DD") : null })
          }
        />
      </MetaRow>

      <MetaRow label="Bitiş Tarihi">
        <DatePicker
          className="w-full"
          format="DD.MM.YYYY"
          value={task.due_date ? dayjs(task.due_date) : null}
          onChange={(d) => {
            if (!validateDueDate(d)) {
              onInvalid("Bitiş tarihi geçmiş bir tarih olamaz.");
              return;
            }
            onPatch({ due_date: d ? d.toISOString() : null });
          }}
        />
      </MetaRow>

      <div className="border-t border-divider pt-4">
        <MetaReadOnly
          label="Oluşturan"
          value={`${task.reporter_id.slice(0, 8)}...`}
        />
        <MetaReadOnly
          label="Oluşturulma"
          value={dayjs(task.created_at).format("DD.MM.YYYY HH:mm")}
        />
        <MetaReadOnly
          label="Güncellenme"
          value={dayjs(task.updated_at).format("DD.MM.YYYY HH:mm")}
        />
      </div>

      <div className="border-t border-divider pt-4">
        <Popconfirm
          title="Görevi silmek istediğinizden emin misiniz?"
          description="Bu işlem geri alınamaz."
          onConfirm={onDelete}
          okText="Sil"
          cancelText="İptal"
          okButtonProps={{ danger: true }}
        >
          <button
            type="button"
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-danger/30 px-3 py-2 text-sm font-medium text-danger transition-colors hover:bg-danger/10"
          >
            <DeleteOutlined />
            Görevi Sil
          </button>
        </Popconfirm>
      </div>
    </aside>
  );
}
