"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Spin } from "antd";
import {
  AppstoreOutlined,
  UnorderedListOutlined,
  TeamOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";

import ProtectedAppLayout from "@/components/templates/ProtectedAppLayout";
import ProjectOverview from "@/components/organisms/projects/ProjectOverview";
import EditProjectModal from "@/components/organisms/projects/EditProjectModal";
import DeleteProjectModal from "@/components/organisms/projects/DeleteProjectModal";
import KanbanBoard from "@/components/organisms/kanban/KanbanBoard";
import { projectService } from "@/api/services/project.service";
import { useOrganizationStore } from "@/store/organization.store";

type Tab = "overview" | "tasks" | "team";

const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: "overview", label: "Genel Bakış", icon: <AppstoreOutlined /> },
  { key: "tasks", label: "Görevler", icon: <UnorderedListOutlined /> },
  { key: "team", label: "Ekip", icon: <TeamOutlined /> },
];

export default function ProjectDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const activeOrg = useOrganizationStore((s) => s.activeOrg);
  const userRole = useOrganizationStore((s) => s.userRole);

  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const isManager = userRole === "owner" || userRole === "admin";

  const { data: project, isLoading } = useQuery({
    queryKey: ["project", params.id],
    queryFn: () =>
      projectService
        .getById(activeOrg!.id, params.id)
        .then((r) => r.data),
    enabled: !!activeOrg && !!params.id,
  });

  return (
    <ProtectedAppLayout>
      {isLoading || !project ? (
        <div className="flex h-64 items-center justify-center">
          <Spin size="large" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Back + Project header */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => router.push("/projects")}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-divider/50 text-muted transition-colors hover:bg-surface hover:text-foreground"
            >
              <ArrowLeftOutlined className="text-sm" />
            </button>
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="h-3.5 w-3.5 shrink-0 rounded-full ring-2 ring-offset-2 ring-offset-background"
                style={{ backgroundColor: project.color, boxShadow: `0 0 8px ${project.color}40` }}
              />
              <h1 className="truncate text-xl font-bold text-foreground">
                {project.name}
              </h1>
              <span className="shrink-0 rounded-md bg-primary/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-primary">
                {project.key}
              </span>
            </div>
          </div>

          {/* Tab navigation */}
          <div className="flex items-center gap-1 rounded-xl bg-background/50 p-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={[
                  "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
                  activeTab === tab.key
                    ? "bg-surface text-foreground shadow-sm"
                    : "text-muted hover:text-foreground",
                ].join(" ")}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === "overview" && (
            <ProjectOverview
              project={project}
              isManager={isManager}
              onEdit={() => setEditOpen(true)}
              onDelete={() => setDeleteOpen(true)}
            />
          )}

          {activeTab === "tasks" && (
            <KanbanBoard
              projectId={project.id}
              projectKey={project.key}
            />
          )}

          {activeTab === "team" && (
            <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-divider bg-surface/30">
              <div className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/5">
                <TeamOutlined className="text-2xl text-primary/40" />
              </div>
              <p className="text-sm font-medium text-foreground">Ekip Yönetimi</p>
              <p className="mt-1 text-xs text-muted">
                Bu özellik yakında eklenecek
              </p>
            </div>
          )}

          {/* Modals */}
          <EditProjectModal
            project={project}
            open={editOpen}
            onClose={() => setEditOpen(false)}
          />
          <DeleteProjectModal
            projectId={project.id}
            projectName={project.name}
            open={deleteOpen}
            onClose={() => setDeleteOpen(false)}
          />
        </div>
      )}
    </ProtectedAppLayout>
  );
}
