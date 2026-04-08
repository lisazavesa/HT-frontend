import { useEffect, useState } from "react";
import {
  Container,
  Button,
  Group,
  Stack,
  Text,
  SimpleGrid,
  Center,
  Loader,
  Modal,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import "dayjs/locale/ru";
import { IconPlus, IconCheckupList } from "@tabler/icons-react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  fetchHabits,
  deleteHabit,
  upsertHabitLog,
  updateHabit,
  fetchHabitLogsByDateRange,
} from "@/store/habitsSlice";
import { fetchHabitStats } from "@/store/statsSlice";
import { Habit } from "@/types";
import { useDisclosure } from "@mantine/hooks";
import { HabitLogsModal } from "./HabitLogsModal";
import { HabbitTemplate } from "./HabbitTemplate";
import { ModalConfirm } from "./ModalConfirm";

// Format date to YYYY-MM-DD in local timezone (not UTC)
function formatDateToLocal(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getLastWeekRange() {
  const to = new Date();
  to.setHours(0, 0, 0, 0);

  const from = new Date(to);
  from.setDate(from.getDate() - 6);

  return {
    from: formatDateToLocal(from),
    to: formatDateToLocal(to),
  };
}

export const HabitsList = ({
  onEditHabit,
  onCreateHabit,
}: {
  onEditHabit?: (habit: Habit) => void;
  onCreateHabit?: () => void;
}) => {
  const dispatch = useAppDispatch();
  const { habits, habitLogs, loading } = useAppSelector(
    (state) => state.habits,
  );
  const { statsByHabit } = useAppSelector((state) => state.stats);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [habitToDelete, setHabitToDelete] = useState<Habit | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toggleHabitId, setToggleHabitId] = useState<number | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [logsOpened, { open: openLogs, close: closeLogs }] =
    useDisclosure(false);
  const [deleteOpened, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);

  useEffect(() => {
    dispatch(fetchHabits());
  }, [dispatch]);

  useEffect(() => {
    if (!habits.length) {
      return;
    }

    const { from, to } = getLastWeekRange();

    habits.forEach((habit) => {
      dispatch(fetchHabitStats({ habitId: habit.id }));
      dispatch(fetchHabitLogsByDateRange({ habitId: habit.id, from, to }));
    });
  }, [dispatch, habits]);

  const handleDeleteHabit = (habit: Habit) => {
    setHabitToDelete(habit);
    openDelete();
  };

  const handleCloseDelete = () => {
    setHabitToDelete(null);
    closeDelete();
  };

  const handleRecordHabit = (habit: Habit) => {
    setSelectedHabit(habit);
    setSelectedDate(new Date());
    open();
  };

  const confirmDeleteHabit = async () => {
    if (!habitToDelete) {
      return;
    }

    setDeleteLoading(true);
    const result = await dispatch(deleteHabit(habitToDelete.id));
    setDeleteLoading(false);

    if (deleteHabit.fulfilled.match(result)) {
      handleCloseDelete();
    }
  };

  const handleShowLogs = (habit: Habit) => {
    setSelectedHabit(habit);
    openLogs();
  };

  const handleToggleActive = async (habit: Habit) => {
    setToggleHabitId(habit.id);

    const result = await dispatch(
      updateHabit({ id: habit.id, data: { isActive: !habit.isActive } }),
    );

    if (updateHabit.fulfilled.match(result)) {
      dispatch(fetchHabitStats({ habitId: habit.id }));
      const { from, to } = getLastWeekRange();
      dispatch(fetchHabitLogsByDateRange({ habitId: habit.id, from, to }));
    }

    setToggleHabitId(null);
  };

  if (loading && habits.length === 0) {
    return (
      <Center style={{ height: "400px" }}>
        <Loader />
      </Center>
    );
  }

  return (
    <Container size="xl" py="lg">
      <Group justify="space-between" mb="lg">
        <Group>
          <IconCheckupList size={32} />
          <Text size="xl" fw={700}>
            Мои привычки
          </Text>
        </Group>
        <Button leftSection={<IconPlus size={14} />} onClick={onCreateHabit}>
          Добавить привычку
        </Button>
      </Group>

      {habits.length === 0 ? (
        <Center py="xl">
          <Stack align="center" gap="sm">
            <IconCheckupList size={64} opacity={0.5} />
            <Text c="dimmed">Нет привычек</Text>
            <Button onClick={onCreateHabit}>Создать первую привычку</Button>
          </Stack>
        </Center>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
          {habits.map((habit) => (
            <HabbitTemplate
              key={habit.id}
              habit={habit}
              stats={statsByHabit[habit.id]}
              onRecordHabit={handleRecordHabit}
              onShowLogs={handleShowLogs}
              onEditHabit={onEditHabit}
              onDeleteHabit={handleDeleteHabit}
              weekLogs={habitLogs[habit.id] || []}
              onToggleActive={handleToggleActive}
              toggleLoading={toggleHabitId === habit.id}
            />
          ))}
        </SimpleGrid>
      )}

      <Modal opened={opened} onClose={close} title="Записать привычку" centered>
        {selectedHabit && (
          <Stack gap="md">
            <Text fw={700}>{selectedHabit.title}</Text>
            <DatePickerInput
              label="Дата"
              placeholder="Выберите дату"
              value={selectedDate}
              onChange={setSelectedDate}
              locale="ru"
              valueFormat="DD.MM.YYYY"
              maxDate={new Date()}
              clearable={false}
            />
            <Group grow>
              <Button
                variant="light"
                color="green"
                disabled={!selectedDate}
                onClick={async () => {
                  if (!selectedDate) return;
                  const dateStr = formatDateToLocal(selectedDate);
                  const result = await dispatch(
                    upsertHabitLog({
                      habitId: selectedHabit.id,
                      data: {
                        date: dateStr,
                        status: "done",
                      },
                    }),
                  );
                  if (upsertHabitLog.fulfilled.match(result)) {
                    dispatch(fetchHabitStats({ habitId: selectedHabit.id }));
                    const { from, to } = getLastWeekRange();
                    dispatch(
                      fetchHabitLogsByDateRange({
                        habitId: selectedHabit.id,
                        from,
                        to,
                      }),
                    );
                  }
                  close();
                }}
              >
                ✓ Выполнено
              </Button>
              <Button
                variant="light"
                color="red"
                disabled={!selectedDate}
                onClick={async () => {
                  if (!selectedDate) return;
                  const dateStr = formatDateToLocal(selectedDate);
                  const result = await dispatch(
                    upsertHabitLog({
                      habitId: selectedHabit.id,
                      data: {
                        date: dateStr,
                        status: "missed",
                      },
                    }),
                  );
                  if (upsertHabitLog.fulfilled.match(result)) {
                    dispatch(fetchHabitStats({ habitId: selectedHabit.id }));
                    const { from, to } = getLastWeekRange();
                    dispatch(
                      fetchHabitLogsByDateRange({
                        habitId: selectedHabit.id,
                        from,
                        to,
                      }),
                    );
                  }
                  close();
                }}
              >
                ✗ Пропущено
              </Button>
            </Group>
            <Button variant="light" onClick={close}>
              Отмена
            </Button>
          </Stack>
        )}
      </Modal>

      <HabitLogsModal
        opened={logsOpened}
        onClose={closeLogs}
        habit={selectedHabit}
      />

      <ModalConfirm
        opened={deleteOpened}
        onClose={handleCloseDelete}
        onConfirm={confirmDeleteHabit}
        title="Подтверждение удаления"
        message={
          <>
            Удалить привычку <b>{habitToDelete?.title}</b>?
          </>
        }
        description="Это действие необратимо. Будут удалены и все связанные логи."
        confirmText="Удалить"
        confirmColor="red"
        loading={deleteLoading}
      />
    </Container>
  );
};
