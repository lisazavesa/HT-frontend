import {
  Group,
  Container,
  Menu,
  Avatar,
  Text,
  Box,
  UnstyledButton,
  useMantineColorScheme,
} from "@mantine/core";
import { useState } from "react";
import {
  IconLogout,
  IconMoon,
  IconSettings,
  IconSun,
} from "@tabler/icons-react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { logoutUser } from "@/store/authSlice";
import { useNavigate } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
import { ModalConfirm } from "./ModalConfirm";

export const AppHeader = () => {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [logoutOpened, { open: openLogout, close: closeLogout }] =
    useDisclosure(false);
  const displayName = user?.email.split("@")[0] ?? "User";

  const handleLogout = async () => {
    setLogoutLoading(true);
    await dispatch(logoutUser());
    setLogoutLoading(false);
    closeLogout();
    navigate("/auth");
  };

  return (
    <Box
      component="header"
      h={70}
      py="xs"
      style={{
        borderBottom: "1px solid #e9ecef",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12)",
      }}
    >
      <Container
        size="xl"
        h="100%"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Group>
          <Text fw={700} size="xl">
            Habit Tracker
          </Text>
        </Group>

        <Group gap="xs">
          {user && (
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <UnstyledButton>
                  <Group gap="xs">
                    <Avatar
                      name={displayName}
                      size="md"
                      color="blue"
                      radius="xl"
                    />

                    <Text size="md" c="dimmed">
                      {user.email}
                    </Text>
                  </Group>
                </UnstyledButton>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item
                  leftSection={<IconSettings size={18} />}
                  onClick={() => navigate("/settings")}
                >
                  Настройки
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  leftSection={
                    colorScheme !== "light" ? (
                      <IconSun size={18} />
                    ) : (
                      <IconMoon size={18} />
                    )
                  }
                  onClick={() =>
                    setColorScheme(colorScheme === "light" ? "dark" : "light")
                  }
                >
                  Смена темы
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  color="red"
                  leftSection={<IconLogout size={14} />}
                  onClick={openLogout}
                >
                  Выход
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
        </Group>
      </Container>

      <ModalConfirm
        opened={logoutOpened}
        onClose={closeLogout}
        onConfirm={handleLogout}
        title="Выход из аккаунта"
        message="Вы действительно хотите выйти из аккаунта?"
        description="Для продолжения работы потребуется повторный вход."
        confirmText="Выйти"
        confirmColor="red"
        loading={logoutLoading}
      />
    </Box>
  );
};
