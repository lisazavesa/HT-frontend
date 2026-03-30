import {
  Group,
  Button,
  Container,
  Menu,
  Avatar,
  Text,
  Box,
} from "@mantine/core";
import { IconLogout, IconSettings } from "@tabler/icons-react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { logout } from "@/store/authSlice";
import { useNavigate } from "react-router-dom";

export const AppHeader = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
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
                <Button variant="subtle" p={0}>
                  <Group gap="xs">
                    <Avatar name={user.username} color="blue" radius="xl" />
                    <div>
                      <Text size="sm" fw={500}>
                        {user.username}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {user.email}
                      </Text>
                    </div>
                  </Group>
                </Button>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item
                  leftSection={<IconSettings size={14} />}
                  onClick={() => navigate("/settings")}
                >
                  Настройки
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  color="red"
                  leftSection={<IconLogout size={14} />}
                  onClick={handleLogout}
                >
                  Выход
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
        </Group>
      </Container>
    </Box>
  );
};
