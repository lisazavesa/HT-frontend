import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { Provider as ReduxProvider } from "react-redux";
import { useAppSelector } from "@/hooks/redux";
import { store } from "@/store";
import { HomePage } from "@/pages/HomePage";
import { AuthPage } from "@/components/AuthPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { theme } from "./theme";

const AppRoutes = () => {
  const { user } = useAppSelector((state) => state.auth);
  const isAuthenticated = !!user;

  return (
    <Routes>
      <Route
        path="/"
        element={isAuthenticated ? <HomePage /> : <Navigate to="/auth" />}
      />
      <Route
        path="/settings"
        element={isAuthenticated ? <SettingsPage /> : <Navigate to="/auth" />}
      />
      <Route
        path="/auth"
        element={!isAuthenticated ? <AuthPage /> : <Navigate to="/" />}
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export const App = () => {
  return (
    <ReduxProvider store={store}>
      <MantineProvider theme={theme}>
        <Notifications />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </MantineProvider>
    </ReduxProvider>
  );
};
