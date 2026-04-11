"use client";

import { Modal } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { projectService } from "@/api/services/project.service";
import { useOrganizationStore } from "@/store/organization.store";

interface DeleteProjectModalProps {
  projectId: string;
  projectName: string;
  open: boolean;
  onClose: () => void;
}

export default function DeleteProjectModal({
  projectId,
  projectName,
  open,
  onClose,
}: DeleteProjectModalProps) {
  const router = useRouter();
  const activeOrg = useOrganizationStore((s) => s.activeOrg);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => {
      if (!activeOrg) throw new Error("Aktif organizasyon yok");
      return projectService.delete(activeOrg.id, projectId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      onClose();
      router.push("/projects");
    },
  });

  return (
    <Modal
      title="Projeyi Sil"
      open={open}
      onCancel={onClose}
      onOk={() => mutation.mutate()}
      okText="Sil"
      cancelText="İptal"
      okButtonProps={{ danger: true }}
      confirmLoading={mutation.isPending}
    >
      <p className="text-sm text-muted">
        <strong className="text-foreground">{projectName}</strong> projesini
        silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
      </p>
    </Modal>
  );
}
