import React from 'react'
import { Stack, Text, Title, Button, ThemeIcon } from '@mantine/core'
import { IconInbox } from '@tabler/icons-react'

export default function EmptyState({
  title = 'لا توجد بيانات متاحة',
  description = 'لم يتم العثور على أي عناصر لعرضها في الوقت الحالي',
  icon: Icon = IconInbox,
  actionLabel,
  onAction,
}) {
  return (
    <Stack align="center" justify="center" py="xl" spacing="sm">
      <ThemeIcon size={64} radius="xl" variant="light" color="brand">
        <Icon size={36} stroke={1.5} />
      </ThemeIcon>
      <Title order={4} color="dimmed" sx={{ textAlign: 'center' }}>
        {title}
      </Title>
      {description && (
        <Text size="sm" color="dimmed" sx={{ maxWidth: 360, textAlign: 'center' }}>
          {description}
        </Text>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="light" color="brand" mt="xs">
          {actionLabel}
        </Button>
      )}
    </Stack>
  )
}
