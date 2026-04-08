import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import habitsReducer from "./habitsSlice";
import statsReducer from "./statsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    habits: habitsReducer,
    stats: statsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
