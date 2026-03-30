import { useState, useEffect } from "react";
import {
  Modal,
  Stack,
  TextInput,
  Textarea,
  Button,
  Group,
  Alert,
} from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { createHabit, updateHabit } from "@/store/habitsSlice";
import { Habit } from "@/types";

interface HabitModalProps {
  opened: boolean;
  onClose: () => void;
  habit?: Habit;
}

export const HabitModal = ({ opened, onClose, habit }: HabitModalProps) => {
  const dispatch = useAppDispatch();
  const { error, loading } = useAppSelector((state) => state.habits);

  const [formData, setFormData] = useState<{
    title: string;
    description: string;
  }>({
    title: "",
    description: "",
  });

  useEffect(() => {
    if (habit) {
      setFormData({
        title: habit.title,
        description: habit.description || "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
      });
    }
  }, [habit, opened]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      return;
    }

    if (habit) {
      await dispatch(
        updateHabit({
          id: habit.id,
          data: formData,
        }),
      );
    } else {
      await dispatch(createHabit(formData));
    }

    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={habit ? "Редактировать привычку" : "Новая привычка"}
      centered
    >
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          {error && (
            <Alert
              icon={<IconAlertCircle size={16} />}
              title="Ошибка"
              color="red"
            >
              {error}
            </Alert>
          )}

          <TextInput
            label="Название"
            placeholder="Например: Утренняя медитация"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.currentTarget.value })
            }
            required
            disabled={loading}
          />

          <Textarea
            label="Описание"
            placeholder="Описание привычки..."
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.currentTarget.value })
            }
            disabled={loading}
          />

          <Group justify="flex-end">
            <Button variant="light" onClick={onClose} disabled={loading}>
              Отмена
            </Button>
            <Button
              type="submit"
              loading={loading}
              disabled={!formData.title.trim()}
            >
              {habit ? "Обновить" : "Создать"}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};
