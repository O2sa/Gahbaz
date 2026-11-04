import React from 'react'
import { Stack, Text, Title, Button, ThemeIcon, useMantineTheme } from '@mantine/core'
import { IconInbox } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

export default function EmptyState({
  title,
  description,
  icon: Icon = IconInbox,
  actionLabel,
  onAction,
}) {
  const theme = useMantineTheme()
  const isDark = theme.colorScheme === 'dark'
  const { t } = useTranslation('common')

  const resolvedTitle = title || t('table.noRecords')
  const resolvedDesc = description !== undefined ? description : t('table.emptyDescription')

  return (
    <Stack align="center" justify="center" py="xl" spacing="sm">
      <ThemeIcon
        size={68}
        radius="xl"
        variant="light"
        color="brand"
        sx={{
          backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(30, 64, 175, 0.08)',
        }}
      >
        <Icon size={36} stroke={1.5} />
      </ThemeIcon>
      <Title
        order={4}
        sx={{
          textAlign: 'center',
          color: isDark ? theme.colors.gray[3] : theme.colors.gray[8],
          fontWeight: 700,
        }}
      >
        {resolvedTitle}
      </Title>
      {resolvedDesc && (
        <Text size="sm" color="dimmed" sx={{ maxWidth: 360, textAlign: 'center', lineHeight: 1.6 }}>
          {resolvedDesc}
        </Text>
      )}
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          variant="light"
          color="brand"
          radius="md"
          mt="xs"
          sx={{ fontWeight: 600 }}
        >
          {actionLabel}
        </Button>
      )}
    </Stack>
  )
}
