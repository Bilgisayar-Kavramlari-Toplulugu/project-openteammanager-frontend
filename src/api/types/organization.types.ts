export interface Organization {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  owner_id: string;
  plan: string;
  created_at: string;
}

export interface OrganizationMember {
  id: string;
  user_id: string;
  role: "owner" | "admin" | "member" | "viewer";
  status: "pending" | "active" | "removed";
  joined_at: string | null;
}

export interface CreateOrganizationRequest {
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
}
