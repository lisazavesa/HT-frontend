import { useState } from "react";
import { AppHeader } from "@/components/Header";
import { HabitsList } from "@/components/HabitsList";
import { HabitModal } from "@/components/HabitModal";
import { Habit } from "@/types";

export const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | undefined>();

  const handleEditHabit = (habit: Habit) => {
    setSelectedHabit(habit);
    setIsModalOpen(true);
  };

  const handleCreateHabit = () => {
    setSelectedHabit(undefined);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedHabit(undefined);
  };

  return (
    <>
      <AppHeader />
      <HabitsList
        onEditHabit={handleEditHabit}
        onCreateHabit={handleCreateHabit}
      />
      <HabitModal
        opened={isModalOpen}
        onClose={handleCloseModal}
        habit={selectedHabit}
      />
    </>
  );
};
