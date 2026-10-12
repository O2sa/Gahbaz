import React from 'react'
import { Modal, Text, Group, Button, Stack, ThemeIcon } from '@mantine/core'
import { IconAlertTriangle } from '@tabler/icons-react'

export default function ConfirmModal({
  opened,
  onClose,
  onConfirm,
  title = 'تأكيد العملية',
  message = 'هل أنت متأكد من رغبتك في المتابعة؟ لا يمكن التراجع عن هذا الإجراء.',
  confirmLabel = 'تأكيد',
  cancelLabel = 'إلغاء',
  confirmColor = 'red',
  isLoading = false,
}) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group spacing="xs">
          <ThemeIcon color={confirmColor} variant="light" size="sm">
            <IconAlertTriangle size={16} />
          </ThemeIcon>
          <Text weight={600}>{title}</Text>
        </Group>
      }
      centered
      radius="md"
    >
      <Stack spacing="md">
        <Text size="sm" color="dimmed">
          {message}
        </Text>
        <Group position="right" spacing="xs" mt="sm">
          <Button variant="default" onClick={onClose} disabled={isLoading}>
            {cancelLabel}
          </Button>
          <Button
            color={confirmColor}
            onClick={onConfirm}
            loading={isLoading}
          >
            {confirmLabel}
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}
