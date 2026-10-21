import React from 'react'
import { Modal, Text, Group, Button, Stack, ThemeIcon, useMantineTheme } from '@mantine/core'
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
  const theme = useMantineTheme()
  const isDark = theme.colorScheme === 'dark'

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group spacing="xs">
          <ThemeIcon color={confirmColor} variant="light" size="md" radius="md">
            <IconAlertTriangle size={18} />
          </ThemeIcon>
          <Text weight={700} size="md">
            {title}
          </Text>
        </Group>
      }
      centered
      radius="lg"
      overlayProps={{
        blur: 3,
        opacity: 0.55,
      }}
      styles={{
        modal: {
          backgroundColor: isDark ? theme.colors.dark[7] : '#ffffff',
          border: `1px solid ${isDark ? theme.colors.dark[4] : theme.colors.gray[2]}`,
        },
      }}
    >
      <Stack spacing="lg" pt="xs">
        <Text size="sm" color="dimmed" sx={{ lineHeight: 1.6 }}>
          {message}
        </Text>
        <Group position="right" spacing="xs">
          <Button variant="default" radius="md" onClick={onClose} disabled={isLoading}>
            {cancelLabel}
          </Button>
          <Button
            color={confirmColor}
            radius="md"
            onClick={onConfirm}
            loading={isLoading}
            sx={{ fontWeight: 600 }}
          >
            {confirmLabel}
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}
