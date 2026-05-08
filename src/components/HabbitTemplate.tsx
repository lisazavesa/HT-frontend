import {
  ActionIcon,
  Badge,
  Button,
  Center,
  Divider,
  Flex,
  Group,
  Paper,
  Progress,
  RingProgress,
  Stack,
  Text,
  ThemeIcon,
  Box,
} from "@mantine/core";
import {
  IconChartBar,
  IconCirclePlus,
  IconEdit,
  IconFlame,
  IconHistory,
  IconPlayerPause,
  IconPlayerPlay,
  IconTarget,
  IconTrash,
} from "@tabler/icons-react";
import type { Habit, HabitLog } from "@/types";
import type { HabitStats } from "@/api/stats";

interface HabbitTemplateProps {
  habit: Habit;
  stats?: HabitStats | null;
  weekLogs: HabitLog[];
  onRecordHabit: (habit: Habit) => void;
  onShowLogs: (habit: Habit) => void;
  onEditHabit?: (habit: Habit) => void;
  onDeleteHabit: (habit: Habit) => void;
  onToggleActive: (habit: Habit) => void;
  toggleLoading?: boolean;
}

const WEEK_SHORT_LABELS = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function buildLastWeekKeys() {
  const result: { key: string; weekDay: string; dayOfMonth: string }[] = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - i);

    result.push({
      key: formatLocalDate(date),
      weekDay: WEEK_SHORT_LABELS[date.getDay()],
      dayOfMonth: String(date.getDate()).padStart(2, "0"),
    });
  }

  return result;
}

export const HabbitTemplate = ({
  habit,
  stats,
  weekLogs,
  onRecordHabit,
  onShowLogs,
  onEditHabit,
  onDeleteHabit,
  onToggleActive,
  toggleLoading = false,
}: HabbitTemplateProps) => {
  const logsByDate = weekLogs.reduce<Record<string, HabitLog>>((acc, log) => {
    acc[log.date] = log;
    return acc;
  }, {});

  const lastWeekDays = buildLastWeekKeys();

  return (
    <Paper
      withBorder
      radius="lg"
      p="lg"
      style={{
        transition: "box-shadow 0.2s ease, transform 0.2s ease",
        boxShadow: "0 4px 14px rgba(22, 38, 73, 0.08)",
      }}
    >
      <Stack gap="sm">
        <Flex justify="space-between" align="start" gap="sm">
          <Stack gap={0}>
            <Text fw={700} size="lg">
              {habit.title}
            </Text>

            <Text h={20} size="sm" c="dimmed" lineClamp={1}>
              {habit.description || "Без описания"}
            </Text>
          </Stack>

          <Badge color={habit.isActive ? "green" : "gray"} variant="light">
            {habit.isActive ? "Активна" : "Пауза"}
          </Badge>
        </Flex>

        <Paper withBorder p="sm" radius="md">
          <Group justify="space-between" align="center" wrap="nowrap">
            <RingProgress
              roundCaps
              size={78}
              thickness={8}
              sections={[
                {
                  value: stats?.completionRate ?? 0,
                  color: "teal",
                },
              ]}
              label={
                <Center>
                  <Text size="xs" fw={700}>
                    {stats?.completionRate ?? 0}%
                  </Text>
                </Center>
              }
            />

            <Stack gap={6} style={{ flex: 1 }}>
              <Group gap={6}>
                <ThemeIcon size="sm" variant="light" color="teal">
                  <IconTarget size={14} />
                </ThemeIcon>
                <Text size="sm">
                  Выполнено: {stats?.doneDays ?? 0}/{stats?.totalDays ?? 0}
                </Text>
              </Group>
              <Group gap={6}>
                <ThemeIcon size="sm" variant="light" color="orange">
                  <IconFlame size={14} />
                </ThemeIcon>
                <Text size="sm">Серия: {stats?.currentStreak ?? 0} дн.</Text>
              </Group>
              <Group gap={6}>
                <ThemeIcon size="sm" variant="light" color="blue">
                  <IconChartBar size={14} />
                </ThemeIcon>
                <Text size="sm">Рекорд: {stats?.maxStreak ?? 0} дн.</Text>
              </Group>
            </Stack>
          </Group>

          <Progress
            mt="sm"
            size="md"
            bg="#d90f3e"
            color="#099268"
            radius="xl"
            value={stats?.completionRate ?? 0}
            styles={{
              section: {
                height: "7px",
                position: "relative",
                top: 0,
                borderRadius: "7px",
              },
              root: {
                height: "7px",
                overflow: "visible",
              },
            }}
          />
        </Paper>

        <Group grow>
          <Button
            variant="light"
            leftSection={<IconCirclePlus size={18} />}
            onClick={() => onRecordHabit(habit)}
            disabled={!habit.isActive}
            fullWidth
          >
            Записать
          </Button>
          <Button
            variant="light"
            onClick={() => onShowLogs(habit)}
            leftSection={<IconHistory size={18} />}
            fullWidth
          >
            Логи
          </Button>
        </Group>

        <Paper withBorder p="xs" radius="md">
          <Stack gap={4}>
            <Text size="xs" c="dimmed" fw={600}>
              Последняя неделя
            </Text>

            <Group justify="space-between" wrap="nowrap" gap={4}>
              {lastWeekDays.map((day) => {
                const log = logsByDate[day.key];
                const status = log?.status;
                const color =
                  status === "done"
                    ? "var(--mantine-color-green-5)"
                    : status === "missed"
                      ? "var(--mantine-color-red-5)"
                      : "var(--mantine-color-gray-4)";

                return (
                  <Stack
                    key={day.key}
                    gap={2}
                    align="center"
                    style={{ flex: 1 }}
                  >
                    <Text size="10px" c="dimmed">
                      {day.weekDay}
                    </Text>
                    <Box
                      style={{
                        width: 11,
                        height: 11,
                        borderRadius: "50%",
                        background: color,
                      }}
                    />
                    <Text size="10px" c="dimmed">
                      {day.dayOfMonth}
                    </Text>
                  </Stack>
                );
              })}
            </Group>
          </Stack>
        </Paper>

        <Divider />

        <Flex justify="space-between" align="center">
          <Text size="sm" c="dimmed">
            {new Date(habit.createdAt).toLocaleDateString("ru-RU", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </Text>

          <Group justify="flex-end" gap="sm">
            <ActionIcon
              variant={habit.isActive ? "light" : "filled"}
              color={habit.isActive ? "gray" : "green"}
              onClick={() => onToggleActive(habit)}
              loading={toggleLoading}
            >
              {habit.isActive ? (
                <IconPlayerPause size={18} />
              ) : (
                <IconPlayerPlay size={18} />
              )}
            </ActionIcon>
            <ActionIcon
              variant="light"
              color="blue"
              onClick={() => onEditHabit?.(habit)}
            >
              <IconEdit size={14} />
            </ActionIcon>
            <ActionIcon
              variant="light"
              color="red"
              onClick={() => onDeleteHabit(habit)}
            >
              <IconTrash size={14} />
            </ActionIcon>
          </Group>
        </Flex>
      </Stack>
    </Paper>
  );
};
