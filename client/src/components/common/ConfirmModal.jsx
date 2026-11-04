import React from 'react'
import { Modal, Text, Group, Button, Stack, ThemeIcon, useMantineTheme } from '@mantine/core'
import { IconAlertTriangle } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

export default function ConfirmModal({
  opened,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel,
  cancelLabel,
  confirmColor = 'red',
  isLoading = false,
}) {
  const theme = useMantineTheme()
  const isDark = theme.colorScheme === 'dark'
  const { t } = useTranslation('common')

  const resolvedTitle = title || t('actions.confirmModalTitle')
  const resolvedMessage = message || t('actions.confirmModalMessage')
  const resolvedConfirmLabel = confirmLabel || t('actions.confirm')
  const resolvedCancelLabel = cancelLabel || t('actions.cancel')

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
            {resolvedTitle}
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
          {resolvedMessage}
        </Text>
        <Group position="right" spacing="xs">
          <Button variant="default" radius="md" onClick={onClose} disabled={isLoading}>
            {resolvedCancelLabel}
          </Button>
          <Button
            color={confirmColor}
            radius="md"
            onClick={onConfirm}
            loading={isLoading}
            sx={{ fontWeight: 600 }}
          >
            {resolvedConfirmLabel}
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}
