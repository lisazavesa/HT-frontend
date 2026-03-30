import {
  Container,
  Stack,
  Title,
  Button,
  Badge,
  Text,
  Card,
} from "@mantine/core";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { logout } from "@/store/authSlice";
import { useNavigate } from "react-router-dom";
import { IconArrowLeft, IconLogout } from "@tabler/icons-react";

export const SettingsPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    if (window.confirm("Выйти из аккаунта?")) {
      dispatch(logout());
      navigate("/auth");
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
              <Text fw={700}>{user?.username}</Text>
            </div>

            <div>
              <Text size="sm" c="dimmed">
                Email
              </Text>
              <Text fw={700}>{user?.email}</Text>
            </div>

            <div>
              <Text size="sm" c="dimmed">
                ID пользователя
              </Text>
              <Badge variant="light">{user?.id}</Badge>
            </div>
          </Stack>
        </Card>

        <Card withBorder p="lg" radius="lg">
          <Stack gap="md">
            <Title order={3}>Опасные действия</Title>
            <Button
              color="red"
              leftSection={<IconLogout size={16} />}
              onClick={handleLogout}
              fullWidth
            >
              Выход
            </Button>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
};
