import React from 'react'
import {
  Drawer,
  Stack,
  Group,
  Text,
  Badge,
  Button,
  Paper,
  Title,
  Divider,
  Avatar,
  ThemeIcon,
  List,
  Alert,
  Box,
  useMantineTheme,
  rem,
} from '@mantine/core'
import {
  IconBook,
  IconCheck,
  IconUser,
  IconAlertCircle,
  IconShieldLock,
  IconShieldCheck,
  IconPlus,
  IconClock,
  IconSchool,
} from '@tabler/icons-react'

export default function CoursePreviewDrawer({
  opened,
  onClose,
  course,
  onRegister,
  isAddDropOpen = true,
  canAddCredits = true,
  isLoading = false,
}) {
  const theme = useMantineTheme()
  const isDark = theme.colorScheme === 'dark'

  if (!course) return null

  const courseCredits = course.creditHours || 3
  const isEligible = course.eligible && canAddCredits && isAddDropOpen
  const teachers = Array.isArray(course.teachers) ? course.teachers : []

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="right"
      size="lg"
      padding="xl"
      title={
        <Group spacing="xs">
          <ThemeIcon size="lg" radius="md" color="brand" variant="light">
            <IconBook size={20} />
          </ThemeIcon>
          <Box>
            <Text weight={700} size="md" sx={{ color: isDark ? '#ffffff' : '#0f172a' }}>
              تفاصيل المقرر الدراسي
            </Text>
            {course.code && (
              <Text size="xs" color="dimmed">
                رمز المقرر: {course.code}
              </Text>
            )}
          </Box>
        </Group>
      }
      styles={{
        content: {
          backgroundColor: isDark ? '#1a1b1e' : '#ffffff',
        },
        header: {
          backgroundColor: isDark ? '#1a1b1e' : '#ffffff',
          borderBottom: `1px solid ${isDark ? theme.colors.dark[4] : theme.colors.gray[2]}`,
          paddingBottom: rem(14),
        },
      }}
    >
      <Stack spacing="lg" pt="sm">
        {/* Course Header Banner */}
        <Paper
          p="md"
          radius="md"
          withBorder
          sx={{
            backgroundColor: isDark ? 'rgba(59, 130, 246, 0.08)' : 'rgba(30, 64, 175, 0.04)',
            borderColor: isDark ? 'rgba(59, 130, 246, 0.25)' : theme.colors.blue[2],
          }}
        >
          <Title order={3} sx={{ color: isDark ? '#ffffff' : '#0f172a', fontWeight: 800 }} mb="xs">
            {course.name}
          </Title>

          <Group spacing="xs" mt="xs">
            <Badge color="brand" variant="filled" size="sm">
              {courseCredits} ساعات معتمدة
            </Badge>

            {course.category && (
              <Badge color="violet" variant="light" size="sm">
                {course.category}
              </Badge>
            )}

            <Badge
              color={course.isEnrolled ? 'teal' : course.eligible ? 'teal' : 'red'}
              variant="outline"
              size="sm"
            >
              {course.isEnrolled
                ? 'مسجل حالياً'
                : course.eligible
                ? 'مؤهل للتسجيل'
                : 'متطلب غير مكتمل'}
            </Badge>
          </Group>
        </Paper>

        {/* Teachers / Instructors */}
        <Box>
          <Text size="sm" weight={700} mb="xs" sx={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>
            هيئة التدريس:
          </Text>
          {teachers.length > 0 ? (
            <Stack spacing="xs">
              {teachers.map((t, idx) => {
                const name = typeof t === 'object' ? t.name || `${t.firstName || ''} ${t.lastName || ''}`.trim() : 'أستاذ المقرر'
                const title = typeof t === 'object' ? t.title : ''
                const avatar = typeof t === 'object' ? t.avatar : undefined
                return (
                  <Group key={t._id || idx} spacing="sm">
                    <Avatar src={avatar} radius="xl" color="brand" size="md">
                      {name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Group spacing={6}>
                        {title && (
                          <Badge size="xs" color="teal" variant="light">
                            {title}
                          </Badge>
                        )}
                        <Text size="sm" weight={600} sx={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>
                          {name}
                        </Text>
                      </Group>
                      {t.email && (
                        <Text size="xs" color="dimmed">
                          {t.email}
                        </Text>
                      )}
                    </Box>
                  </Group>
                )
              })}
            </Stack>
          ) : (
            <Text size="xs" color="dimmed">
              لم يتم تعيين عضو هيئة تدريس محدد حتى الآن
            </Text>
          )}
        </Box>

        <Divider color={isDark ? 'dark.4' : 'gray.2'} />

        {/* Description */}
        <Box>
          <Text size="sm" weight={700} mb="xs" sx={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>
            نبذة عن المقرر:
          </Text>
          <Text size="sm" color={isDark ? 'gray.3' : 'gray.7'} sx={{ lineHeight: 1.75 }}>
            {course.description || course.subtitle || 'لا يوجد وصف تفصيلي متوفر لهذا المقرر.'}
          </Text>
        </Box>

        {/* What You Will Learn */}
        {course.willLearn && course.willLearn.length > 0 && (
          <Paper
            p="md"
            radius="md"
            withBorder
            sx={{
              backgroundColor: isDark ? 'rgba(16, 185, 129, 0.08)' : 'rgba(16, 185, 129, 0.05)',
              borderColor: isDark ? 'rgba(16, 185, 129, 0.25)' : '#bbf7d0',
            }}
          >
            <Text size="sm" weight={700} color={isDark ? 'teal.3' : 'teal.9'} mb="xs">
              أهداف ومخرجات التعلم:
            </Text>
            <List
              spacing="xs"
              size="sm"
              icon={
                <ThemeIcon color="teal" size={18} radius="xl">
                  <IconCheck size={12} />
                </ThemeIcon>
              }
            >
              {course.willLearn.map((item, idx) => (
                <List.Item key={idx} sx={{ color: isDark ? theme.colors.dark[0] : undefined }}>
                  {item}
                </List.Item>
              ))}
            </List>
          </Paper>
        )}

        {/* Prerequisites Information */}
        <Box>
          <Text size="sm" weight={700} mb="xs" sx={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>
            المتطلبات السابقة للمقرر:
          </Text>
          {course.missingPrerequisites && course.missingPrerequisites.length > 0 ? (
            <Alert
              icon={<IconShieldLock size={16} />}
              color="red"
              variant="light"
              radius="md"
              title="متطلبات سابقة غير مستوفاة"
            >
              <Text size="xs" weight={500}>
                يجب اجتياز المقررات التالية بنسبة 60% على الأقل قبل التمكن من التسجيل:
              </Text>
              <List size="xs" mt={6} spacing={2}>
                {course.missingPrerequisites.map((p, idx) => (
                  <List.Item key={idx}>
                    <strong>{p.name}</strong> {p.code ? `(${p.code})` : ''}
                  </List.Item>
                ))}
              </List>
            </Alert>
          ) : course.prerequisites && course.prerequisites.length > 0 ? (
            <Alert
              icon={<IconShieldCheck size={16} />}
              color="teal"
              variant="light"
              radius="md"
            >
              <Text size="xs" weight={600}>
                تم استيفاء كافة المتطلبات السابقة بنجاح. أنت مؤهل أكاديمياً للتسجيل.
              </Text>
            </Alert>
          ) : (
            <Text size="xs" color="dimmed">
              لا توجد متطلبات سابقة لهذا المقرر، وهو متاح للتسجيل المباشر.
            </Text>
          )}
        </Box>

        {/* Actions / Registration CTA */}
        <Box pt="md" sx={{ marginTop: 'auto' }}>
          {course.isEnrolled ? (
            <Button fullWidth size="md" color="teal" variant="light" disabled>
              أنت مسجل بالفعل في هذا المقرر لهذا الفصل
            </Button>
          ) : (
            <Stack spacing="xs">
              {!isAddDropOpen && (
                <Text size="xs" color="red" align="center" weight={500}>
                  فترة الحذف والإضافة مغلقة حالياً. لا يمكن إضافة مقررات جديدة.
                </Text>
              )}
              {!canAddCredits && (
                <Text size="xs" color="red" align="center" weight={500}>
                  تسجيل هذا المقرر سيتجاوز الحد الأقصى المسموح (19 ساعة معتمدة).
                </Text>
              )}
              <Button
                fullWidth
                size="md"
                color="brand"
                radius="md"
                leftIcon={<IconPlus size={18} />}
                disabled={!isEligible}
                loading={isLoading}
                onClick={() => {
                  onRegister(course._id)
                  onClose()
                }}
              >
                تسجيل في هذا المقرر ({courseCredits} ساعات)
              </Button>
            </Stack>
          )}
        </Box>
      </Stack>
    </Drawer>
  )
}
