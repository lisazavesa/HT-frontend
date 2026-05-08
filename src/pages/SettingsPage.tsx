import {
  Container,
  Stack,
  Title,
  Button,
  Badge,
  Text,
  Card,
  TextInput,
  PasswordInput,
  Group,
  Alert,
} from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { clearError, logoutUser, updateCurrentUser } from "@/store/authSlice";
import { useNavigate } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
import {
  IconAlertCircle,
  IconArrowLeft,
  IconLogout,
} from "@tabler/icons-react";
import { ModalConfirm } from "@/components/ModalConfirm";

export const SettingsPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useAppSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [logoutOpened, { open: openLogout, close: closeLogout }] =
    useDisclosure(false);

  useEffect(() => {
    setEmail(user?.email ?? "");
  }, [user?.email]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const hasChanges = useMemo(() => {
    if (!user) {
      return false;
    }
    return email.trim() !== user.email || Boolean(password.trim());
  }, [email, password, user]);

  const handleLogout = async () => {
    setLogoutLoading(true);
    await dispatch(logoutUser());
    setLogoutLoading(false);
    closeLogout();
    navigate("/auth");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    setLocalError(null);

    const nextEmail = email.trim().toLowerCase();
    const nextPassword = password.trim();

    if (!nextEmail) {
      setLocalError("Email обязателен");
      return;
    }

    if (nextPassword && nextPassword.length < 6) {
      setLocalError("Пароль должен быть не короче 6 символов");
      return;
    }

    if (nextPassword && nextPassword !== confirmPassword) {
      setLocalError("Пароли не совпадают");
      return;
    }

    if (!user) {
      setLocalError("Пользователь не найден");
      return;
    }

    const payload: { email?: string; password?: string } = {};
    if (nextEmail !== user.email) {
      payload.email = nextEmail;
    }
    if (nextPassword) {
      payload.password = nextPassword;
    }

    if (!payload.email && !payload.password) {
      setLocalError("Нет изменений для сохранения");
      return;
    }

    const result = await dispatch(updateCurrentUser(payload));
    if (updateCurrentUser.fulfilled.match(result)) {
      setPassword("");
      setConfirmPassword("");
      setSuccess("Данные профиля обновлены");
    }
  };

  return (
    <Container size="sm" py="xl">
      <Button
        variant="subtle"
        leftSection={<IconArrowLeft size={16} />}
        onClick={() => navigate("/")}
        mb="xl"
      >
        Назад
      </Button>

      <Stack gap="xl">
        <div>
          <Title order={1}>Настройки</Title>
        </div>

        <Card withBorder p="lg" radius="lg">
          <Stack gap="md">
            <div>
              <Text size="sm" c="dimmed">
                Пользователь
              </Text>
              <Text fw={700}>{user?.email.split("@")[0]}</Text>
            </div>

            <div>
              <Text size="sm" c="dimmed">
                Email
              </Text>
              <Text fw={700}>{user?.email}</Text>
            </div>
          </Stack>
        </Card>

        <Card withBorder p="lg" radius="lg">
          <form onSubmit={handleSave}>
            <Stack gap="md">
              <Title order={3}>Профиль</Title>

              {(error || localError) && (
                <Alert
                  color="red"
                  icon={<IconAlertCircle size={16} />}
                  title="Ошибка"
                >
                  {localError ?? error}
                </Alert>
              )}

              {success && (
                <Alert color="green" title="Успех">
                  {success}
                </Alert>
              )}

              <TextInput
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
                placeholder="you@example.com"
                disabled={loading}
                required
              />

              <PasswordInput
                label="Новый пароль"
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
                placeholder="Оставьте пустым, если менять не нужно"
                disabled={loading}
              />

              <PasswordInput
                label="Подтвердите пароль"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.currentTarget.value)}
                placeholder="Повторите пароль"
                disabled={loading || !password}
              />

              <Group justify="flex-end">
                <Button
                  type="submit"
                  loading={loading}
                  disabled={!hasChanges || loading}
                >
                  Сохранить изменения
                </Button>
              </Group>
            </Stack>
          </form>
        </Card>

        <Button
          color="red"
          leftSection={<IconLogout size={16} />}
          onClick={openLogout}
          fullWidth
        >
          Выход
        </Button>
      </Stack>

      <ModalConfirm
        opened={logoutOpened}
        onClose={closeLogout}
        onConfirm={handleLogout}
        title="Выход из аккаунта"
        message="Вы уверены, что хотите выйти из аккаунта?"
        description="Текущая сессия будет завершена."
        confirmText="Выйти"
        confirmColor="red"
        loading={logoutLoading}
      />
    </Container>
  );
};
