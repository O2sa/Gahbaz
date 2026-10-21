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

export default function ConfirmDropModal({
  opened,
  onClose,
  onConfirm,
  course,
  currentCredits = 0,
  minCredits = 12,
  isLoading = false,
}) {
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
            تأكيد حذف المقرر الدراسي
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
          هل أنت متأكد من رغبتك في حذف مقرر{' '}
          <Text component="span" weight={700} color={isDark ? 'brand.3' : 'brand.7'}>
            "{course.name}"
          </Text>{' '}
          من جدولك الدراسي لهذا الفصل؟
        </Text>

        <Paper withBorder p="md" radius="md" bg={isDark ? 'rgba(0, 0, 0, 0.25)' : 'gray.0'}>
          <Stack spacing="xs">
            <Group position="apart">
              <Text size="xs" color="dimmed">
                إجمالي الساعات المسجلة حالياً:
              </Text>
              <Badge variant="outline" color="blue" size="sm">
                {currentCredits} ساعات
              </Badge>
            </Group>

            <Group position="apart">
              <Text size="xs" color="dimmed">
                ساعات المقرر المراد حذفه:
              </Text>
              <Badge variant="filled" color="red" size="sm">
                -{courseCredits} ساعات
              </Badge>
            </Group>

            <Divider my={4} color={isDark ? 'dark.4' : 'gray.3'} />

            <Group position="apart">
              <Text size="sm" weight={700}>
                إجمالي الساعات المتبقية:
              </Text>
              <Badge
                variant="filled"
                color={remainingCredits < minCredits ? 'red' : 'teal'}
                size="md"
              >
                {remainingCredits} ساعة معتمدة
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
            title="تعذر الحذف"
          >
            <Text size="xs">
              لا يمكن حذف هذا المقرر لأن إجمالي ساعاتك سيصبح أقل من الحد الأدنى الأكاديمي المطلوب ({minCredits} ساعة معتمدة).
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
              تنبيه: سيصل رصيد ساعاتك بعد هذا الحذف إلى الحد الأدنى تماماً ({minCredits} ساعات). لن تتمكن من حذف أي مقررات إضافية.
            </Text>
          </Alert>
        ) : (
          <Text size="xs" color="dimmed">
            سيتم إزالة المقرر من قائمة مقرراتك وقناة المحادثات الأكاديمية فوراً.
          </Text>
        )}

        <Group position="right" mt="md">
          <Button variant="default" onClick={onClose} disabled={isLoading}>
            تراجع
          </Button>
          <Button
            color="red"
            leftIcon={<IconTrash size={16} />}
            onClick={onConfirm}
            loading={isLoading}
            disabled={!canDrop}
          >
            تأكيد الحذف
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}
