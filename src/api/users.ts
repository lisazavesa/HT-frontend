import api from "./instance";
import { User, UpdateUserRequest } from "@/types";

export interface CreateUserRequest {
  email: string;
  password: string;
}

export const usersApi = {
  create: (data: CreateUserRequest) => api.post<User>("/users", data),

  getMe: () => api.get<User>("/users/me"),

  updateMe: (data: UpdateUserRequest) => api.patch<User>("/users/me", data),

  getById: (id: number) => api.get<User>(`/users/${id}`),
};
