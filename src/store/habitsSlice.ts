import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Habit, HabitLog } from "@/types";
import {
  habitsApi,
  CreateHabitRequest,
  UpdateHabitRequest,
  UpsertHabitLogRequest,
} from "@/api/habits";

interface HabitsState {
  habits: Habit[];
  habitLogs: { [habitId: number]: HabitLog[] };
  loading: boolean;
  error: string | null;
}

const initialState: HabitsState = {
  habits: [],
  habitLogs: {},
  loading: false,
  error: null,
};

// Async thunks
export const fetchHabits = createAsyncThunk(
  "habits/fetchHabits",
  async (_, { rejectWithValue }) => {
    try {
      const response = await habitsApi.getAll();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch habits",
      );
    }
  },
);

export const createHabit = createAsyncThunk(
  "habits/createHabit",
  async (data: CreateHabitRequest, { rejectWithValue }) => {
    try {
      const response = await habitsApi.create(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create habit",
      );
    }
  },
);

export const updateHabit = createAsyncThunk(
  "habits/updateHabit",
  async (
    { id, data }: { id: number; data: UpdateHabitRequest },
    { rejectWithValue },
  ) => {
    try {
      const response = await habitsApi.update(id, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update habit",
      );
    }
  },
);

export const deleteHabit = createAsyncThunk(
  "habits/deleteHabit",
  async (id: number, { rejectWithValue }) => {
    try {
      await habitsApi.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete habit",
      );
    }
  },
);

export const fetchHabitLogs = createAsyncThunk(
  "habits/fetchHabitLogs",
  async (habitId: number, { rejectWithValue }) => {
    try {
      const response = await habitsApi.getLogs(habitId);
      return { habitId, logs: response.data };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch logs",
      );
    }
  },
);

export const fetchHabitLogsByDateRange = createAsyncThunk(
  "habits/fetchHabitLogsByDateRange",
  async (
    { habitId, from, to }: { habitId: number; from: string; to: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await habitsApi.getLogsByDateRange(habitId, from, to);
      return { habitId, logs: response.data };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch logs by date range",
      );
    }
  },
);

export const upsertHabitLog = createAsyncThunk(
  "habits/upsertHabitLog",
  async (
    { habitId, data }: { habitId: number; data: UpsertHabitLogRequest },
    { rejectWithValue, dispatch },
  ) => {
    try {
      const response = await habitsApi.upsertLog(habitId, data);
      // Re-fetch all logs to ensure state is in sync with DB
      dispatch(fetchHabitLogs(habitId));
      return { habitId, log: response.data };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to upsert log",
      );
    }
  },
);

export const deleteHabitLog = createAsyncThunk(
  "habits/deleteHabitLog",
  async (
    { habitId, date }: { habitId: number; date: string },
    { rejectWithValue, dispatch },
  ) => {
    try {
      await habitsApi.deleteLog(habitId, date);
      // Re-fetch all logs to ensure state is in sync with DB
      dispatch(fetchHabitLogs(habitId));
      return { habitId, date };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete log",
      );
    }
  },
);

const habitsSlice = createSlice({
  name: "habits",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Habits
    builder.addCase(fetchHabits.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchHabits.fulfilled,
      (state, action: PayloadAction<Habit[]>) => {
        state.loading = false;
        state.habits = action.payload;
      },
    );
    builder.addCase(fetchHabits.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create Habit
    builder.addCase(
      createHabit.fulfilled,
      (state, action: PayloadAction<Habit>) => {
        state.habits.push(action.payload);
      },
    );
    builder.addCase(createHabit.rejected, (state, action) => {
      state.error = action.payload as string;
    });

    // Update Habit
    builder.addCase(
      updateHabit.fulfilled,
      (state, action: PayloadAction<Habit>) => {
        const index = state.habits.findIndex((h) => h.id === action.payload.id);
        if (index !== -1) {
          state.habits[index] = action.payload;
        }
      },
    );
    builder.addCase(updateHabit.rejected, (state, action) => {
      state.error = action.payload as string;
    });

    // Delete Habit
    builder.addCase(
      deleteHabit.fulfilled,
      (state, action: PayloadAction<number>) => {
        state.habits = state.habits.filter((h) => h.id !== action.payload);
        delete state.habitLogs[action.payload];
      },
    );
    builder.addCase(deleteHabit.rejected, (state, action) => {
      state.error = action.payload as string;
    });

    // Fetch Habit Logs
    builder.addCase(
      fetchHabitLogs.fulfilled,
      (state, action: PayloadAction<{ habitId: number; logs: HabitLog[] }>) => {
        state.habitLogs[action.payload.habitId] = action.payload.logs;
      },
    );

    // Fetch Habit Logs By Date Range
    builder.addCase(
      fetchHabitLogsByDateRange.fulfilled,
      (state, action: PayloadAction<{ habitId: number; logs: HabitLog[] }>) => {
        state.habitLogs[action.payload.habitId] = action.payload.logs;
      },
    );

    // Upsert Habit Log
    builder.addCase(
      upsertHabitLog.fulfilled,
      (state, action: PayloadAction<{ habitId: number; log: HabitLog }>) => {
        const { habitId, log } = action.payload;
        if (!state.habitLogs[habitId]) {
          state.habitLogs[habitId] = [];
        }
        const existingIndex = state.habitLogs[habitId].findIndex(
          (l) => l.date === log.date,
        );
        if (existingIndex !== -1) {
          state.habitLogs[habitId][existingIndex] = log;
        } else {
          state.habitLogs[habitId].push(log);
        }
      },
    );

    // Delete Habit Log
    builder.addCase(
      deleteHabitLog.fulfilled,
      (state, action: PayloadAction<{ habitId: number; date: string }>) => {
        const { habitId, date } = action.payload;
        if (state.habitLogs[habitId]) {
          state.habitLogs[habitId] = state.habitLogs[habitId].filter(
            (l) => l.date !== date,
          );
        }
      },
    );
  },
});

export const { clearError } = habitsSlice.actions;
export default habitsSlice.reducer;
