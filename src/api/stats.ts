import api from "./instance";

export interface HabitStats {
    totalDays: number;
    doneDays: number;
    missedDays: number;
    completionRate: number;
    currentStreak: number;
    maxStreak: number;
    weekStats: Record<number, number>;
}

export const statsApi = {
    getStats: (habitId: number, from?: string, to?: string) =>
        api.get<HabitStats>("/stats", {
            params: { habitId, from, to },
        }),
};
