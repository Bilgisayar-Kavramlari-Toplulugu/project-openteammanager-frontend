import apiClient from "@/api/lib/apiClient";
import { ENDPOINTS } from "@/api/constants/endpoints";
import type {
  Organization,
  OrganizationMember,
  CreateOrganizationRequest,
} from "@/api/types/organization.types";

export const organizationService = {
  list() {
    return apiClient.get<Organization[]>(`${ENDPOINTS.organizations}`);
  },

  getById(orgId: string) {
    return apiClient.get<Organization>(
      `${ENDPOINTS.organizations}/${orgId}`,
    );
  },

  create(data: CreateOrganizationRequest) {
    return apiClient.post<Organization>(`${ENDPOINTS.organizations}`, data);
  },

  getMembers(orgId: string) {
    return apiClient.get<OrganizationMember[]>(
      `${ENDPOINTS.organizations}/${orgId}/members`,
    );
  },
};
