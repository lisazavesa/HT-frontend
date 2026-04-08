export interface User {
  id: number;
  email: string;
}

export interface AuthStatusResponse {
  authenticated: boolean;
  user: User;
}

export interface LogoutResponse {
  ok: boolean;
}

export interface Habit {
  id: number;
  title: string;
  description?: string;
  isActive: boolean;
  userId: number;
  createdAt: string;
}

export interface HabitLog {
  id: number;
  habitId: number;
  date: string;
  status: "done" | "missed";
  createdAt: string;
}

export interface AuthResponse {
  user: User;
}

export interface UpdateUserRequest {
  email?: string;
  password?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}
