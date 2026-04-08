import { Button, Group, Modal, Stack, Text } from "@mantine/core";
import type { ReactNode } from "react";

interface ModalConfirmProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message: ReactNode;
  description?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: string;
  loading?: boolean;
}

export const ModalConfirm = ({
  opened,
  onClose,
  onConfirm,
  title,
  message,
  description,
  confirmText = "Подтвердить",
  cancelText = "Отмена",
  confirmColor = "red",
  loading = false,
}: ModalConfirmProps) => {
  return (
    <Modal opened={opened} onClose={onClose} title={title} centered>
      <Stack gap="md">
        <Text>{message}</Text>

        {description ? (
          <Text size="sm" c="dimmed">
            {description}
          </Text>
        ) : null}

        <Group grow>
          <Button variant="default" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button color={confirmColor} onClick={onConfirm} loading={loading}>
            {confirmText}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};
