import apiClient from "@/api/lib/apiClient";
import { ENDPOINTS } from "@/api/constants/endpoints";
import type { User } from "@/api/types/user.types";
import type {
  LoginRequest,
  RegisterRequest,
  TokenResponse,
} from "@/api/types/auth.types";

export type { LoginRequest, RegisterRequest, TokenResponse };

export const authService = {
  register(payload: RegisterRequest) {
    return apiClient.post<User>(`${ENDPOINTS.auth}/register`, payload);
  },

  login(payload: LoginRequest) {
    return apiClient.post<TokenResponse>(`${ENDPOINTS.auth}/login`, payload);
  },

  me() {
    return apiClient.get<User>(`${ENDPOINTS.auth}/me`);
  },

  refresh() {
    return apiClient.post<TokenResponse>(`${ENDPOINTS.auth}/refresh`, {});
  },
};
