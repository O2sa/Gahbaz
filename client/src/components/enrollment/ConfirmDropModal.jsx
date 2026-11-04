import React from 'react'
import {
  Modal,
  Stack,
  Group,
  Text,
  Badge,
  Button,
  Paper,
  Alert,
  Divider,
  ThemeIcon,
  useMantineTheme,
} from '@mantine/core'
import {
  IconAlertTriangle,
  IconTrash,
  IconArrowLeft,
  IconInfoCircle,
} from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

export default function ConfirmDropModal({
  opened,
  onClose,
  onConfirm,
  course,
  currentCredits = 0,
  minCredits = 12,
  isLoading = false,
}) {
  const { t } = useTranslation('student')
  const theme = useMantineTheme()
  const isDark = theme.colorScheme === 'dark'

  if (!course) return null

  const courseCredits = course.creditHours || 3
  const remainingCredits = currentCredits - courseCredits
  const canDrop = remainingCredits >= minCredits

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group spacing="xs">
          <ThemeIcon color="red" variant="light" size="md" radius="md">
            <IconAlertTriangle size={18} />
          </ThemeIcon>
          <Text weight={700} size="md" color="red">
            {t('dropModal.title')}
          </Text>
        </Group>
      }
      styles={{
        content: {
          backgroundColor: isDark ? '#1a1b1e' : '#ffffff',
        },
        header: {
          backgroundColor: isDark ? '#1a1b1e' : '#ffffff',
        },
      }}
    >
      <Stack spacing="md">
        <Text size="sm">
          {t('dropModal.confirmMessage', { name: course.name })}
        </Text>

        <Paper withBorder p="md" radius="md" bg={isDark ? 'rgba(0, 0, 0, 0.25)' : 'gray.0'}>
          <Stack spacing="xs">
            <Group position="apart">
              <Text size="xs" color="dimmed">
                {t('dropModal.currentCredits')}
              </Text>
              <Badge variant="outline" color="blue" size="sm">
                {t('dropModal.creditsBadge', { count: currentCredits })}
              </Badge>
            </Group>

            <Group position="apart">
              <Text size="xs" color="dimmed">
                {t('dropModal.courseCredits')}
              </Text>
              <Badge variant="filled" color="red" size="sm">
                {t('dropModal.creditsNegativeBadge', { count: courseCredits })}
              </Badge>
            </Group>

            <Divider my={4} color={isDark ? 'dark.4' : 'gray.3'} />

            <Group position="apart">
              <Text size="sm" weight={700}>
                {t('dropModal.remainingCredits')}
              </Text>
              <Badge
                variant="filled"
                color={remainingCredits < minCredits ? 'red' : 'teal'}
                size="md"
              >
                {t('dropModal.remainingCreditsBadge', { count: remainingCredits })}
              </Badge>
            </Group>
          </Stack>
        </Paper>

        {remainingCredits < minCredits ? (
          <Alert
            icon={<IconAlertTriangle size={16} />}
            color="red"
            variant="filled"
            radius="md"
            title={t('dropModal.cannotDropTitle')}
          >
            <Text size="xs">
              {t('dropModal.cannotDropAlert', { min: minCredits })}
            </Text>
          </Alert>
        ) : remainingCredits === minCredits ? (
          <Alert
            icon={<IconInfoCircle size={16} />}
            color="orange"
            variant="light"
            radius="md"
          >
            <Text size="xs" weight={500}>
              {t('dropModal.minCreditsWarning', { min: minCredits })}
            </Text>
          </Alert>
        ) : (
          <Text size="xs" color="dimmed">
            {t('dropModal.instantRemovalNotice')}
          </Text>
        )}

        <Group position="right" mt="md">
          <Button variant="default" onClick={onClose} disabled={isLoading}>
            {t('dropModal.cancel')}
          </Button>
          <Button
            color="red"
            leftIcon={<IconTrash size={16} />}
            onClick={onConfirm}
            loading={isLoading}
            disabled={!canDrop}
          >
            {t('dropModal.confirmDrop')}
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}

