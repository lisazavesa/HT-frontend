import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { User, AuthResponse } from "@/types";
import { authApi } from "@/api/auth";
import Cookies from "js-cookie";

interface AuthState {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
    isHydrated: boolean;
}

// Load token from localStorage or cookies
const getInitialToken = (): string | null => {
    const storedToken = localStorage.getItem("access_token");
    if (storedToken && storedToken !== "undefined") return storedToken;
    if (storedToken === "undefined") {
        localStorage.removeItem("access_token");
    }

    const cookieToken = Cookies.get("access_token");
    if (cookieToken && cookieToken !== "undefined") return cookieToken;
    if (cookieToken === "undefined") {
        Cookies.remove("access_token");
    }

    return null;
};

// Load user from localStorage
const getInitialUser = (): User | null => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
        try {
            return JSON.parse(storedUser);
        } catch {
            return null;
        }
    }
    return null;
};

const initialState: AuthState = {
    user: getInitialUser(),
    token: getInitialToken(),
    loading: false,
    error: null,
    isHydrated: true, // Mark as hydrated since we load from localStorage
};

export const login = createAsyncThunk(
    "auth/login",
    async (
        { email, password }: { email: string; password: string },
        { rejectWithValue },
    ) => {
        try {
            const response = await authApi.login({ email, password });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Login failed",
            );
        }
    },
);

export const register = createAsyncThunk(
    "auth/register",
    async (
        { email, password }: { email: string; password: string },
        { rejectWithValue },
    ) => {
        try {
            const response = await authApi.register({ email, password });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Registration failed",
            );
        }
    },
);

export const getProfile = createAsyncThunk(
    "auth/getProfile",
    async (_, { rejectWithValue }) => {
        try {
            const response = await authApi.getProfile();
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch profile",
            );
        }
    },
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.error = null;
            state.isHydrated = false;
            Cookies.remove("access_token");
            localStorage.removeItem("access_token");
        },
        clearError: (state) => {
            state.error = null;
        },
        hydrateAuth: (
            state,
            action: PayloadAction<{ user: User; token: string }>,
        ) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isHydrated = true;
        },
    },
    extraReducers: (builder) => {
        // Login
        builder.addCase(login.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(
            login.fulfilled,
            (state, action: PayloadAction<AuthResponse>) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.access_token ?? null;
            },
        );
        builder.addCase(login.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Register
        builder.addCase(register.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(
            register.fulfilled,
            (state, action: PayloadAction<AuthResponse>) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.access_token ?? null;
            },
        );
        builder.addCase(register.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Get Profile
        builder.addCase(getProfile.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(
            getProfile.fulfilled,
            (state, action: PayloadAction<User>) => {
                state.loading = false;
                state.user = action.payload;
            },
        );
        builder.addCase(getProfile.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    },
});

export const { logout, clearError, hydrateAuth } = authSlice.actions;
export default authSlice.reducer;
