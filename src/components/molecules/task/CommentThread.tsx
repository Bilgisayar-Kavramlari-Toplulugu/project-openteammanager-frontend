"use client";

import { useMemo } from "react";
import CommentItem from "@/components/molecules/task/CommentItem";
import type { TaskComment } from "@/api/types/task.types";
import type { ProjectMember } from "@/api/types/project.types";

export interface CommentNode extends TaskComment {
  children: CommentNode[];
}

function buildTree(comments: TaskComment[]): CommentNode[] {
  const map = new Map<string, CommentNode>();
  comments.forEach((c) => map.set(c.id, { ...c, children: [] }));

  const roots: CommentNode[] = [];
  map.forEach((node) => {
    if (node.parent_id && map.has(node.parent_id)) {
      map.get(node.parent_id)!.children.push(node);
    } else {
      roots.push(node);
    }
  });

  const sortAsc = (arr: CommentNode[]) => {
    arr.sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    );
    arr.forEach((n) => sortAsc(n.children));
  };
  sortAsc(roots);
  return roots;
}

interface CommentThreadProps {
  comments: TaskComment[];
  currentUserId?: string | null;
  isAdmin?: boolean;
  members: ProjectMember[];
  onReply: (parentId: string) => void;
  onEdit: (commentId: string, content: string) => Promise<void> | void;
  onDelete: (commentId: string) => Promise<void> | void;
}

function renderNode(
  node: CommentNode,
  props: Omit<CommentThreadProps, "comments">,
) {
  return (
    <CommentItem
      key={node.id}
      comment={node}
      currentUserId={props.currentUserId}
      isAdmin={props.isAdmin}
      members={props.members}
      onReply={props.onReply}
      onEdit={props.onEdit}
      onDelete={props.onDelete}
    >
      {node.children.map((child) => renderNode(child, props))}
    </CommentItem>
  );
}

export default function CommentThread(props: CommentThreadProps) {
  const tree = useMemo(() => buildTree(props.comments), [props.comments]);

  if (tree.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-divider p-4 text-center text-xs text-muted">
        Henüz yorum yok. İlk yorumu siz yazın.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tree.map((node) => renderNode(node, props))}
    </div>
  );
}
