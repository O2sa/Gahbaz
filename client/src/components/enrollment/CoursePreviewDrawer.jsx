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
import { useTranslation } from 'react-i18next'

export default function CoursePreviewDrawer({
  opened,
  onClose,
  course,
  onRegister,
  isAddDropOpen = true,
  canAddCredits = true,
  isLoading = false,
}) {
  const { t, i18n } = useTranslation('student')
  const theme = useMantineTheme()
  const isDark = theme.colorScheme === 'dark'
  const isRtl = i18n.dir() === 'rtl'

  if (!course) return null

  const courseCredits = course.creditHours || 3
  const isEligible = course.eligible && canAddCredits && isAddDropOpen
  const teachers = Array.isArray(course.teachers) ? course.teachers : []

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position={isRtl ? 'left' : 'right'}
      size="lg"
      padding="xl"
      title={
        <Group spacing="xs">
          <ThemeIcon size="lg" radius="md" color="brand" variant="light">
            <IconBook size={20} />
          </ThemeIcon>
          <Box>
            <Text weight={700} size="md" sx={{ color: isDark ? '#ffffff' : '#0f172a' }}>
              {t('previewDrawer.title')}
            </Text>
            {course.code && (
              <Text size="xs" color="dimmed">
                {t('previewDrawer.courseCode', { code: course.code })}
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
              {t('previewDrawer.creditHours', { count: courseCredits })}
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
                ? t('previewDrawer.alreadyEnrolled')
                : course.eligible
                ? t('registration.eligibleBadge')
                : t('registration.ineligibleBadge')}
            </Badge>
          </Group>
        </Paper>

        {/* Teachers / Instructors */}
        <Box>
          <Text size="sm" weight={700} mb="xs" sx={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>
            {t('previewDrawer.instructors')}
          </Text>
          {teachers.length > 0 ? (
            <Stack spacing="xs">
              {teachers.map((tItem, idx) => {
                const name = typeof tItem === 'object' ? tItem.name || `${tItem.firstName || ''} ${tItem.lastName || ''}`.trim() : t('previewDrawer.defaultInstructor')
                const title = typeof tItem === 'object' ? tItem.title : ''
                const avatar = typeof tItem === 'object' ? tItem.avatar : undefined
                return (
                  <Group key={tItem._id || idx} spacing="sm">
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
                      {tItem.email && (
                        <Text size="xs" color="dimmed">
                          {tItem.email}
                        </Text>
                      )}
                    </Box>
                  </Group>
                )
              })}
            </Stack>
          ) : (
            <Text size="xs" color="dimmed">
              {t('previewDrawer.noInstructorAssigned')}
            </Text>
          )}
        </Box>

        <Divider color={isDark ? 'dark.4' : 'gray.2'} />

        {/* Description */}
        <Box>
          <Text size="sm" weight={700} mb="xs" sx={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>
            {t('previewDrawer.aboutCourse')}
          </Text>
          <Text size="sm" color={isDark ? 'gray.3' : 'gray.7'} sx={{ lineHeight: 1.75 }}>
            {course.description || course.subtitle || t('previewDrawer.noDescription')}
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
              {t('previewDrawer.learningOutcomes')}
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
            {t('previewDrawer.prerequisites')}
          </Text>
          {course.missingPrerequisites && course.missingPrerequisites.length > 0 ? (
            <Alert
              icon={<IconShieldLock size={16} />}
              color="red"
              variant="light"
              radius="md"
              title={t('previewDrawer.unmetPrereqsTitle')}
            >
              <Text size="xs" weight={500}>
                {t('previewDrawer.unmetPrereqsText')}
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
                {t('previewDrawer.prereqsMet')}
              </Text>
            </Alert>
          ) : (
            <Text size="xs" color="dimmed">
              {t('previewDrawer.noPrereqs')}
            </Text>
          )}
        </Box>

        {/* Actions / Registration CTA */}
        <Box pt="md" sx={{ marginTop: 'auto' }}>
          {course.isEnrolled ? (
            <Button fullWidth size="md" color="teal" variant="light" disabled>
              {t('previewDrawer.alreadyEnrolled')}
            </Button>
          ) : (
            <Stack spacing="xs">
              {!isAddDropOpen && (
                <Text size="xs" color="red" align="center" weight={500}>
                  {t('previewDrawer.addDropClosed')}
                </Text>
              )}
              {!canAddCredits && (
                <Text size="xs" color="red" align="center" weight={500}>
                  {t('previewDrawer.exceedsMaxCredits', { max: 19 })}
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
                {t('previewDrawer.registerBtn', { credits: courseCredits })}
              </Button>
            </Stack>
          )}
        </Box>
      </Stack>
    </Drawer>
  )
}

