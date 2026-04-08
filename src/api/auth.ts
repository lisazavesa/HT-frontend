import api from "./instance";
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  AuthStatusResponse,
  LogoutResponse,
} from "@/types";

export const authApi = {
  login: (data: LoginRequest) => api.post<AuthResponse>("/auth/login", data),

  register: (data: RegisterRequest) =>
    api.post<AuthResponse>("/auth/register", data),

  refresh: () => api.post<AuthResponse>("/auth/refresh"),

  logout: () => api.post<LogoutResponse>("/auth/logout"),

  getStatus: () => api.get<AuthStatusResponse>("/auth/status"),
};
