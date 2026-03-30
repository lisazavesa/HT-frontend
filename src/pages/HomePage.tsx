import { useEffect, useState } from "react";
import { AppHeader } from "@/components/Header";
import { HabitsList } from "@/components/HabitsList";
import { HabitModal } from "@/components/HabitModal";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { getProfile } from "@/store/authSlice";
import { Habit } from "@/types";

export const HomePage = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | undefined>();

  useEffect(() => {
    if (!user) {
      dispatch(getProfile());
    }
  }, [dispatch, user]);

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
