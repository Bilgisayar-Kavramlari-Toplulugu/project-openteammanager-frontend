export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: "admin" | "member" | "viewer";
  createdAt: string;
  updatedAt: string;
}
