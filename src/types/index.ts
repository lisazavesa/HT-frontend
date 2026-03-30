export interface User {
    id: number;
    email: string;
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
    access_token?: string;
    user: User;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
}
