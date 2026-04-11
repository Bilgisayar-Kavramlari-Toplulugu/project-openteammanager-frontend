import apiClient from "./apiClient";
import { ENDPOINTS, type EndpointKey } from "@/api/constants/endpoints";
import type { ListResponse } from "@/api/types/common.types";

export default class CrudService<T> {
  private baseUrl: string;

  constructor(endpoint: EndpointKey) {
    this.baseUrl = ENDPOINTS[endpoint];
  }

  getAll(params?: Record<string, unknown>) {
    return apiClient.get<ListResponse<T>>(this.baseUrl, { params });
  }

  getById(id: string) {
    return apiClient.get<T>(`${this.baseUrl}/${id}`);
  }

  create(data: Partial<T>) {
    return apiClient.post<T>(this.baseUrl, data);
  }

  update(id: string, data: Partial<T>) {
    return apiClient.put<T>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: string) {
    return apiClient.delete(`${this.baseUrl}/${id}`);
  }
}
