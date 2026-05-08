import api from "./instance";
import { Habit, HabitLog } from "@/types";

export interface CreateHabitRequest {
  title: string;
  description?: string;
}

export interface UpdateHabitRequest extends Partial<CreateHabitRequest> {
  isActive?: boolean;
}

export interface UpsertHabitLogRequest {
  date: string;
  status: "done" | "missed";
}

export const habitsApi = {
  // Привычки
  getAll: () => api.get<Habit[]>("/habits"),

  getById: (id: number) => api.get<Habit>(`/habits/${id}`),

  create: (data: CreateHabitRequest) => api.post<Habit>("/habits", data),

  update: (id: number, data: UpdateHabitRequest) =>
    api.patch<Habit>(`/habits/${id}`, data),

  delete: (id: number) => api.delete(`/habits/${id}`),

  // Логи привычек
  getLogs: (habitId: number) =>
    api.get<HabitLog[]>("/logs", { params: { habitId } }),

  getLogsByDateRange: (habitId: number, from: string, to: string) =>
    api.get<HabitLog[]>("/logs", {
      params: { habitId, from, to },
    }),

  upsertLog: (habitId: number, data: UpsertHabitLogRequest) =>
    api.post<HabitLog>("/logs", { habitId, ...data }),

  deleteLog: (habitId: number, date: string) =>
    api.delete<void>(`/logs/${habitId}/${date}`),
};
