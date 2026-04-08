import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { User, AuthResponse, UpdateUserRequest } from "@/types";
import { authApi } from "@/api/auth";
import { usersApi } from "@/api/users";

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isHydrated: boolean;
}

const getErrorMessage = (error: any, fallback: string) => {
  const message = error?.response?.data?.message;
  if (Array.isArray(message)) {
    return message.join(", ");
  }
  if (typeof message === "string") {
    return message;
  }
  return fallback;
};

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  isHydrated: false,
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
      return rejectWithValue(getErrorMessage(error, "Login failed"));
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
      return rejectWithValue(getErrorMessage(error, "Registration failed"));
    }
  },
);

export const hydrateAuth = createAsyncThunk("auth/hydrateAuth", async () => {
  try {
    await authApi.getStatus();
    const profile = await usersApi.getMe();
    return profile.data;
  } catch {
    return null;
  }
});

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logout();
      return true;
    } catch (error: any) {
      if (error?.response?.status === 401) {
        return true;
      }
      return rejectWithValue(getErrorMessage(error, "Logout failed"));
    }
  },
);

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await usersApi.getMe();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to fetch user profile"),
      );
    }
  },
);

export const updateCurrentUser = createAsyncThunk(
  "auth/updateCurrentUser",
  async (data: UpdateUserRequest, { rejectWithValue }) => {
    try {
      const response = await usersApi.updateMe(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(getErrorMessage(error, "Failed to update user"));
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
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
        state.isHydrated = true;
      },
    );
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.isHydrated = true;
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
        state.isHydrated = true;
      },
    );
    builder.addCase(register.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.isHydrated = true;
    });

    // Hydrate session
    builder.addCase(hydrateAuth.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      hydrateAuth.fulfilled,
      (state, action: PayloadAction<User | null>) => {
        state.loading = false;
        state.user = action.payload;
        state.isHydrated = true;
      },
    );

    // Logout
    builder.addCase(logoutUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.loading = false;
      state.user = null;
      state.isHydrated = true;
    });
    builder.addCase(logoutUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Current user profile
    builder.addCase(fetchCurrentUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchCurrentUser.fulfilled,
      (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
      },
    );
    builder.addCase(fetchCurrentUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update user profile
    builder.addCase(updateCurrentUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      updateCurrentUser.fulfilled,
      (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
      },
    );
    builder.addCase(updateCurrentUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
