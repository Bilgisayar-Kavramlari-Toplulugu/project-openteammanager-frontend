const BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export const ENDPOINTS = {
  auth: `${BASE}/auth`,
  users: `${BASE}/users`,
  teams: `${BASE}/teams`,
} as const;

export type EndpointKey = keyof typeof ENDPOINTS;
