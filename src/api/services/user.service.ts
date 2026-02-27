import CrudService from "@/api/lib/CrudService";
import type { User } from "@/api/types/user.types";

export const userService = new CrudService<User>("users");
