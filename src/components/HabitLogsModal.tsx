import { useEffect, useState, useMemo } from "react";
import {
  Modal,
  Table,
  Text,
  Badge,
  Button,
  Center,
  Group,
  SegmentedControl,
  ActionIcon,
  SimpleGrid,
  Stack,
  Box,
  Paper,
  Tooltip,
} from "@mantine/core";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { fetchHabitLogs, deleteHabitLog } from "@/store/habitsSlice";
import { fetchHabitStats } from "@/store/statsSlice";
import {
  IconTrash,
  IconTable,
  IconCalendar,
  IconChevronLeft,
  IconChevronRight,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import { Habit, HabitLog } from "@/types";

interface HabitLogsModalProps {
  opened: boolean;
  onClose: () => void;
  habit: Habit | null;
}

const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number): number {
  const day = new Date(year, month, 1).getDay();
  // Convert from Sunday=0 to Monday=0
  return day === 0 ? 6 : day - 1;
}

function formatDateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

const MONTH_NAMES = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

function CalendarView({ logs }: { logs: HabitLog[] }) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const logsByDate = useMemo(() => {
    const map: Record<string, HabitLog> = {};
    for (const log of logs) {
      // log.date is "YYYY-MM-DD"
      map[log.date] = log;
    }
    return map;
  }, [logs]);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfWeek = getFirstDayOfWeek(year, month);

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const todayKey = formatDateKey(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );

  // Build cells: empty cells for offset + day cells
  const cells: (null | number)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    cells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(d);
  }

  return (
    <Stack gap="sm">
      <Group justify="space-between">
        <ActionIcon variant="subtle" onClick={prevMonth}>
          <IconChevronLeft size={18} />
        </ActionIcon>
        <Text fw={600} size="lg">
          {MONTH_NAMES[month]} {year}
        </Text>
        <ActionIcon variant="subtle" onClick={nextMonth}>
          <IconChevronRight size={18} />
        </ActionIcon>
      </Group>

      <SimpleGrid cols={7} spacing={4}>
        {WEEKDAYS.map((wd) => (
          <Center key={wd} py={4}>
            <Text size="xs" fw={600} c="dimmed">
              {wd}
            </Text>
          </Center>
        ))}

        {cells.map((day, idx) => {
          if (day === null) {
            return <Box key={`empty-${idx}`} />;
          }

          const dateKey = formatDateKey(year, month, day);
          const log = logsByDate[dateKey];
          const isToday = dateKey === todayKey;

          let bg = "transparent";
          let icon = null;

          if (log) {
            if (log.status === "done") {
              bg = "var(--mantine-color-green-1)";
              icon = (
                <IconCheck size={16} color="var(--mantine-color-green-7)" />
              );
            } else {
              bg = "var(--mantine-color-red-1)";
              icon = <IconX size={16} color="var(--mantine-color-red-7)" />;
            }
          }

          return (
            <Tooltip
              key={dateKey}
              label={
                log
                  ? log.status === "done"
                    ? "Выполнено"
                    : "Пропущено"
                  : "Нет данных"
              }
              withArrow
            >
              <Paper
                p={4}
                radius="md"
                style={{
                  background: bg,
                  border: isToday
                    ? "2px solid var(--mantine-color-blue-5)"
                    : "1px solid var(--mantine-color-gray-2)",
                  minHeight: 44,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                }}
              >
                <Text
                  size="xs"
                  fw={isToday ? 700 : 400}
                  c={isToday ? "blue" : undefined}
                >
                  {day}
                </Text>
                {icon}
              </Paper>
            </Tooltip>
          );
        })}
      </SimpleGrid>
    </Stack>
  );
}

export const HabitLogsModal = ({
  opened,
  onClose,
  habit,
}: HabitLogsModalProps) => {
  const dispatch = useAppDispatch();
  const { habitLogs, loading } = useAppSelector((state) => state.habits);
  const logs = habit ? habitLogs[habit.id] || [] : [];
  const [view, setView] = useState<string>("calendar");

  useEffect(() => {
    if (opened && habit) {
      dispatch(fetchHabitLogs(habit.id));
    }
  }, [opened, habit, dispatch]);

  const handleDeleteLog = async (logDate: string) => {
    if (habit && window.confirm("Удалить запись?")) {
      const result = await dispatch(
        deleteHabitLog({ habitId: habit.id, date: logDate }),
      );
      if (deleteHabitLog.fulfilled.match(result)) {
        dispatch(fetchHabitStats({ habitId: habit.id }));
      }
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={`Логи: ${habit?.title}`}
      centered
      size="lg"
    >
      <Stack gap="md">
        <Group justify="center">
          <SegmentedControl
            value={view}
            onChange={setView}
            data={[
              {
                label: (
                  <Center style={{ gap: 6 }}>
                    <IconCalendar size={16} />
                    <span>Календарь</span>
                  </Center>
                ),
                value: "calendar",
              },
              {
                label: (
                  <Center style={{ gap: 6 }}>
                    <IconTable size={16} />
                    <span>Таблица</span>
                  </Center>
                ),
                value: "table",
              },
            ]}
          />
        </Group>

        {view === "calendar" ? (
          logs.length === 0 ? (
            <Center py="xl">
              <Text c="dimmed">Нет логов</Text>
            </Center>
          ) : (
            <CalendarView logs={logs} />
          )
        ) : logs.length === 0 ? (
          <Center py="xl">
            <Text c="dimmed">Нет логов</Text>
          </Center>
        ) : (
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Дата</Table.Th>
                <Table.Th>Статус</Table.Th>
                <Table.Th style={{ textAlign: "right" }}>Действия</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {logs.map((log) => (
                <Table.Tr key={log.id}>
                  <Table.Td>
                    <Badge variant="light">
                      {new Date(log.date).toLocaleDateString("ru-RU")}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Badge color={log.status === "done" ? "green" : "red"}>
                      {log.status === "done" ? "✓ Выполнено" : "✗ Пропущено"}
                    </Badge>
                  </Table.Td>
                  <Table.Td style={{ textAlign: "right" }}>
                    <Button
                      size="xs"
                      color="red"
                      variant="light"
                      onClick={() => handleDeleteLog(log.date)}
                      loading={loading}
                    >
                      <IconTrash size={14} />
                    </Button>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
      </Stack>
    </Modal>
  );
};
