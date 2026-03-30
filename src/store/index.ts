import { configureStore, createListenerMiddleware } from "@reduxjs/toolkit";
import authReducer, { login, register } from "./authSlice";
import habitsReducer from "./habitsSlice";
import statsReducer from "./statsSlice";
import Cookies from "js-cookie";

const listenerMiddleware = createListenerMiddleware();

// Listen for successful login/register and save token and user to localStorage
listenerMiddleware.startListening({
    matcher: (action) =>
        login.fulfilled.match(action) || register.fulfilled.match(action),
    effect: (action) => {
        const token = (action.payload as any).access_token;
        const user = (action.payload as any).user;

        if (token) {
            localStorage.setItem("access_token", token);
            Cookies.set("access_token", token);
        } else {
            localStorage.removeItem("access_token");
            Cookies.remove("access_token");
        }

        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        }
    },
});

export const store = configureStore({
    reducer: {
        auth: authReducer,
        habits: habitsReducer,
        stats: statsReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
