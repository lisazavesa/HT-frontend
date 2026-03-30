import { useState } from "react";
import {
  Container,
  Paper,
  PasswordInput,
  TextInput,
  Button,
  Alert,
  Tabs,
  Title,
  Center,
  Stack,
} from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { login, register, clearError } from "@/store/authSlice";
import { useNavigate } from "react-router-dom";
import "@/components/Auth.module.css";

interface LoginForm {
  email: string;
  password: string;
}

interface RegisterForm extends LoginForm {
  confirmPassword: string;
}

export const AuthPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [loginData, setLoginData] = useState<LoginForm>({
    email: "",
    password: "",
  });
  const [registerData, setRegisterData] = useState<RegisterForm>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [activeTab, setActiveTab] = useState<string | null>("login");

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      return;
    }
    const result = await dispatch(
      login({
        email: loginData.email,
        password: loginData.password,
      }),
    );

    if (login.fulfilled.match(result)) {
      navigate("/");
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !registerData.email ||
      !registerData.password ||
      registerData.password !== registerData.confirmPassword
    ) {
      return;
    }

    const result = await dispatch(
      register({
        email: registerData.email,
        password: registerData.password,
      }),
    );

    if (register.fulfilled.match(result)) {
      navigate("/");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <Container size={420} my={40}>
        <Center mb="lg">
          <Title order={1} c="white">
            Habit Tracker
          </Title>
        </Center>

        <Paper radius="md" p="xl" miw={{ base: 300, sm: 400 }} withBorder>
          <Tabs value={activeTab} onChange={setActiveTab}>
            <Tabs.List grow>
              <Tabs.Tab value="login">Вход</Tabs.Tab>
              <Tabs.Tab value="register">Регистрация</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="login" pt="xl">
              <form onSubmit={handleLoginSubmit}>
                <Stack gap="md">
                  {error && (
                    <Alert
                      icon={<IconAlertCircle size={16} />}
                      title="Ошибка"
                      color="red"
                      onClose={() => dispatch(clearError())}
                      withCloseButton
                    >
                      {error}
                    </Alert>
                  )}

                  <TextInput
                    label="Email"
                    placeholder="you@example.com"
                    value={loginData.email}
                    onChange={(e) =>
                      setLoginData({
                        ...loginData,
                        email: e.currentTarget.value,
                      })
                    }
                    required
                    disabled={loading}
                  />

                  <PasswordInput
                    label="Пароль"
                    placeholder="Your password"
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({
                        ...loginData,
                        password: e.currentTarget.value,
                      })
                    }
                    required
                    disabled={loading}
                  />

                  <Button fullWidth type="submit" loading={loading}>
                    Войти
                  </Button>
                </Stack>
              </form>
            </Tabs.Panel>

            <Tabs.Panel value="register" pt="xl">
              <form onSubmit={handleRegisterSubmit}>
                <Stack gap="md">
                  {error && (
                    <Alert
                      icon={<IconAlertCircle size={16} />}
                      title="Ошибка"
                      color="red"
                      onClose={() => dispatch(clearError())}
                      withCloseButton
                    >
                      {error}
                    </Alert>
                  )}

                  <TextInput
                    label="Email"
                    placeholder="you@example.com"
                    value={registerData.email}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        email: e.currentTarget.value,
                      })
                    }
                    required
                    disabled={loading}
                  />

                  <PasswordInput
                    label="Пароль"
                    placeholder="Your password"
                    value={registerData.password}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        password: e.currentTarget.value,
                      })
                    }
                    required
                    disabled={loading}
                  />

                  <PasswordInput
                    label="Подтвердите пароль"
                    placeholder="Confirm password"
                    value={registerData.confirmPassword}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        confirmPassword: e.currentTarget.value,
                      })
                    }
                    required
                    disabled={loading}
                  />

                  <Button fullWidth type="submit" loading={loading}>
                    Зарегистрироваться
                  </Button>
                </Stack>
              </form>
            </Tabs.Panel>
          </Tabs>
        </Paper>
      </Container>
    </div>
  );
};
