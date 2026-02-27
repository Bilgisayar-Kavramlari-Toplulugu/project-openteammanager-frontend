"use client";

import { userService } from "@/api/services/user.service";
import { useCrudList, useCrudDetail } from "./useCrud";
import type { User } from "@/api/types/user.types";

export const useUsers = () => useCrudList<User>(userService);
export const useUser = (id: string) => useCrudDetail<User>(userService, id);
