import api from "./instance";
import { User, LoginRequest, RegisterRequest, AuthResponse } from "@/types";

export const authApi = {
  login: (data: LoginRequest) => api.post<AuthResponse>("/auth/login", data),

  register: (data: RegisterRequest) =>
    api.post<AuthResponse>("/auth/register", data),

  getProfile: () => api.get<User>("/auth/profile"),
};
