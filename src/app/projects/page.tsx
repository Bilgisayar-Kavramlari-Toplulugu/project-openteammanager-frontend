"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  PlusOutlined,
  ProjectOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Spin } from "antd";

import ProtectedAppLayout from "@/components/templates/ProtectedAppLayout";
import ProjectCard from "@/components/organisms/projects/ProjectCard";
import ProjectFilters from "@/components/organisms/projects/ProjectFilters";
import CreateProjectModal from "@/components/organisms/projects/CreateProjectModal";
import { projectService } from "@/api/services/project.service";
import { useOrganizationStore } from "@/store/organization.store";

export default function ProjectsPage() {
  const activeOrg = useOrganizationStore((s) => s.activeOrg);
  const userRole = useOrganizationStore((s) => s.userRole);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);

  const isManager =
    userRole === "owner" || userRole === "admin" || userRole === "member";

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects", activeOrg?.id],
    queryFn: () =>
      projectService.list(activeOrg!.id).then((r) => r.data),
    enabled: !!activeOrg,
  });

  const filtered = useMemo(() => {
    let result = projects;
    if (filter !== "all") {
      result = result.filter((p) => p.status === filter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.key.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q),
      );
    }
    return result;
  }, [projects, filter, search]);

  const stats = useMemo(() => {
    const active = projects.filter((p) => p.status === "active").length;
    const planning = projects.filter((p) => p.status === "planning").length;
    const mine = projects.filter((p) => p.is_member).length;
    return { total: projects.length, active, planning, mine };
  }, [projects]);

  return (
    <ProtectedAppLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Projeler
            </h2>
            <p className="text-sm text-muted">
              {activeOrg
                ? `${activeOrg.name} organizasyonundaki tüm projeler`
                : "Tüm projelerinizi burada yönetebilirsiniz."}
            </p>
          </div>

          {isManager && (
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/25 active:scale-[0.98]"
            >
              <PlusOutlined />
              Yeni Proje
            </button>
          )}
        </div>

        {/* Stats row */}
        {!isLoading && projects.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Toplam", value: stats.total, color: "text-foreground" },
              { label: "Aktif", value: stats.active, color: "text-emerald-700 dark:text-emerald-400" },
              { label: "Planlama", value: stats.planning, color: "text-blue-700 dark:text-blue-400" },
              { label: "Katıldıklarım", value: stats.mine, color: "text-primary" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-divider/50 bg-surface/50 px-4 py-3 backdrop-blur-sm"
              >
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted">
                  {stat.label}
                </p>
                <p className={`mt-0.5 text-xl font-bold ${stat.color}`}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Filters + Search */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <ProjectFilters active={filter} onChange={setFilter} />
          <div className="flex items-center gap-2 rounded-xl border border-divider/50 bg-surface/50 px-3 py-1.5 transition-all focus-within:border-primary/40 focus-within:shadow-sm focus-within:shadow-primary/5">
            <SearchOutlined className="text-sm text-muted" />
            <input
              type="text"
              placeholder="Proje ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-48 border-none bg-transparent text-sm text-foreground outline-none placeholder:text-muted/50"
            />
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Spin size="large" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-divider bg-surface/30">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/5">
              <ProjectOutlined className="text-3xl text-primary/40" />
            </div>
            <h3 className="mb-1 text-base font-semibold text-foreground">
              {search || filter !== "all"
                ? "Sonuç bulunamadı"
                : "Henüz proje yok"}
            </h3>
            <p className="mb-4 max-w-xs text-center text-sm text-muted">
              {search || filter !== "all"
                ? "Filtrelerinizi değiştirmeyi deneyin."
                : "İlk projenizi oluşturarak başlayın."}
            </p>
            {isManager && !search && filter === "all" && (
              <button
                type="button"
                onClick={() => setCreateOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary-hover"
              >
                <PlusOutlined />
                Proje Oluştur
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>

      <CreateProjectModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </ProtectedAppLayout>
  );
}
