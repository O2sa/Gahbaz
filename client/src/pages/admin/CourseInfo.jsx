import React, { useState } from 'react'
import {
  Avatar,
  Box,
  Button,
  Grid,
  Group,
  Image,
  List,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title,
  Badge,
  useMantineTheme,
} from '@mantine/core'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  IconCheck,
  IconArrowRight,
  IconEdit,
  IconPlayerPlay,
  IconFolder,
  IconVideo,
  IconCertificate,
  IconFileText,
  IconMessageDots,
} from '@tabler/icons-react'
import CourseContent from '../../components/CourseContent'
import { PageHeader } from '../../components/common/index.js'
import { CourseChatDrawer } from '../../components/chat/index.js'
import { useDashboardContext } from '../../layouts/MainLayout.jsx'

export default function CourseInfo({ course }) {
  const { t } = useTranslation('admin')
  const { t: tCommon } = useTranslation('common')
  const { t: tNav } = useTranslation('nav')

  const { user } = useDashboardContext()
  const role = user?.role || user?.__t
  const userId = (user?._id || user?.id || user?.userId || '').toString()

  const isSuperAdmin = role === 'super-admin'
  const isAdmin = role === 'admin' || isSuperAdmin
  const isTeacher = role === 'teacher'
  const isCourseTeacher =
    isTeacher &&
    (course?.data?.teachers || course?.teachers || []).some(
      (tItem) => (typeof tItem === 'object' ? tItem._id || tItem.id : tItem)?.toString() === userId
    )
  const canEditCourse = isAdmin || isCourseTeacher
  const canManageGrades = isAdmin || isCourseTeacher
  const navigate = useNavigate()
  const theme = useMantineTheme()
  const isDark = theme.colorScheme === 'dark'
  const [chatDrawerOpened, setChatDrawerOpened] = useState(false)

  const courseData = course?.data || course
  if (!courseData || Object.keys(courseData).length === 0) return null

  const teacherNames =
    courseData.teacher ??
    courseData.teachers
      ?.map((tItem) =>
        typeof tItem === 'object'
          ? `${tItem.firstName || ''} ${tItem.lastName || ''}`.trim() || tItem.name
          : tItem
      )
      .filter(Boolean)
      .join(' • ')

  const descriptionText = courseData.description || courseData.describtion
  const sections = courseData.sections || []
  const totalLessons = sections.reduce(
    (acc, sec) => acc + (sec?.lessons?.length || 0),
    0
  )

  return (
    <Box>
      <PageHeader
        title={courseData.name || t('courses.title')}
        description={courseData.subtitle || t('courses.subtitle')}
        breadcrumbs={[
          { title: tCommon('actions.home'), href: '/' },
          {
            title: courseData.semester?.name || t('semesters.title'),
            href: courseData.semester?._id
              ? `/semesters/${courseData.semester._id}`
              : '/semesters',
          },
          { title: courseData.name || tNav('courses') },
        ]}
        action={
          <Group spacing="xs">
            <Button
              variant="default"
              leftIcon={<IconArrowRight size={16} />}
              onClick={() => {
                if (window.history.state && window.history.state.idx > 0) {
                  navigate(-1)
                } else if (courseData.semester?._id) {
                  navigate(`/semesters/${courseData.semester._id}`)
                } else {
                  navigate('/semesters')
                }
              }}
            >
              {tCommon('actions.back')}
            </Button>
            {canEditCourse && (
              <Button
                component={Link}
                to={`/courses/${courseData._id || courseData.id}/edit`}
                leftIcon={<IconEdit size={16} />}
                color="brand"
              >
                {t('courses.editCourse')}
              </Button>
            )}
          </Group>
        }
      />

      {/* Hero Card */}
      <Paper
        p="xl"
        radius="lg"
        withBorder
        mb="lg"
        sx={{
          backgroundColor: isDark
            ? 'rgba(26, 27, 30, 0.75)'
            : 'rgba(255, 255, 255, 0.95)',
          borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2],
          boxShadow: isDark
            ? '0 4px 20px rgba(0, 0, 0, 0.25)'
            : '0 4px 20px rgba(30, 64, 175, 0.04)',
        }}
      >
        <Grid gutter="xl" align="center">
          <Grid.Col span={12} md={courseData.cover ? 7 : 12} lg={courseData.cover ? 8 : 12}>
            <Group position="apart" align="flex-start" mb="xs">
              <Group spacing="xs">
                {courseData.category && (
                  <Badge color="brand" variant="light" size="lg">
                    {courseData.category}
                  </Badge>
                )}
                {courseData.code && (
                  <Badge color="gray" variant="outline" size="md">
                    {t('subjects.table.code', { code: courseData.code })}
                  </Badge>
                )}
              </Group>
            </Group>

            <Title
              order={2}
              mb="xs"
              sx={{
                color: isDark ? '#ffffff' : '#0f172a',
                fontWeight: 800,
                lineHeight: 1.3,
              }}
            >
              {courseData.name}
            </Title>

            {courseData.subtitle && (
              <Text size="md" color="dimmed" mb="md" sx={{ lineHeight: 1.6 }}>
                {courseData.subtitle}
              </Text>
            )}

            <Group spacing="xl" mb="lg">
              <Group spacing="sm">
                <Avatar.Group>
                  {courseData.teachers?.map((val) => (
                    <Avatar
                      key={val._id || val.id || val}
                      radius="xl"
                      src={typeof val === 'object' ? val.avatar : undefined}
                      color="brand"
                    >
                      {typeof val === 'object' ? (val.firstName?.charAt(0) || 'U') : 'U'}
                    </Avatar>
                  ))}
                </Avatar.Group>
                <Stack spacing={0}>
                  <Text size="xs" color="dimmed">
                    {t('courses.teacher')}:
                  </Text>
                  <Text weight={600} size="sm" sx={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>
                    {teacherNames || t('subjects.unspecified')}
                  </Text>
                </Stack>
              </Group>

              {sections.length > 0 && (
                <Group spacing="xs">
                  <Badge
                    color="blue"
                    variant="light"
                    size="md"
                    leftSection={<IconFolder size={14} />}
                  >
                    {t('courses.sectionsCount', { count: sections.length })}
                  </Badge>
                  <Badge
                    color="violet"
                    variant="light"
                    size="md"
                    leftSection={<IconVideo size={14} />}
                  >
                    {t('courses.lessonsCount', { count: totalLessons })}
                  </Badge>
                </Group>
              )}
            </Group>

            <Group spacing="sm">
              <Button
                component={Link}
                to={`/courses/${courseData._id || courseData.id}/lessons`}
                color="brand"
                size="md"
                radius="md"
                leftIcon={<IconPlayerPlay size={18} />}
              >
                {t('courses.lectureNotes')}
              </Button>
              {canManageGrades && (
                <Button
                  component={Link}
                  to={`/courses/${courseData._id || courseData.id}/grades`}
                  variant="light"
                  color="teal"
                  size="md"
                  radius="md"
                  leftIcon={<IconCertificate size={18} />}
                >
                  {t('courses.grades')}
                </Button>
              )}
              <Button
                component={Link}
                to={`/courses/${courseData._id || courseData.id}/assignments`}
                variant="light"
                color="indigo"
                size="md"
                radius="md"
                leftIcon={<IconFileText size={18} />}
              >
                {t('courses.assignments')}
              </Button>
              <Button
                onClick={() => setChatDrawerOpened(true)}
                variant="light"
                color="cyan"
                size="md"
                radius="md"
                leftIcon={<IconMessageDots size={18} />}
              >
                {t('courses.liveChat')}
              </Button>
            </Group>
          </Grid.Col>

          {courseData.cover ? (
            <Grid.Col span={12} md={5} lg={4}>
              <Paper
                radius="lg"
                withBorder
                sx={{
                  overflow: 'hidden',
                  maxHeight: 220,
                  backgroundColor: isDark ? 'rgba(0, 0, 0, 0.4)' : theme.colors.gray[0],
                  borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2],
                  boxShadow: isDark
                    ? '0 6px 20px rgba(0, 0, 0, 0.4)'
                    : '0 4px 16px rgba(0, 0, 0, 0.08)',
                }}
              >
                <Image
                  src={courseData.cover}
                  height={220}
                  fit="cover"
                  radius="lg"
                  alt={courseData.name}
                  withPlaceholder
                  styles={{
                    root: { width: '100%', height: 220 },
                    image: { width: '100%', height: '100%', objectFit: 'cover' },
                  }}
                />
              </Paper>
            </Grid.Col>
          ) : null}
        </Grid>
      </Paper>

      {/* Course Details & Content Paper */}
      <Paper
        p="xl"
        radius="lg"
        withBorder
        mb="lg"
        sx={{
          backgroundColor: isDark
            ? 'rgba(26, 27, 30, 0.75)'
            : 'rgba(255, 255, 255, 0.95)',
          borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2],
        }}
      >
        {descriptionText && (
          <Box mb="xl">
            <Title order={4} mb="xs" sx={{ color: isDark ? '#ffffff' : '#0f172a' }}>
              {t('courses.aboutCourse')}
            </Title>
            <Text size="sm" color={isDark ? 'gray.3' : 'gray.7'} sx={{ lineHeight: 1.8 }}>
              {descriptionText}
            </Text>
          </Box>
        )}

        {courseData.willLearn?.length > 0 && (
          <Paper
            p="lg"
            radius="md"
            bg={isDark ? 'rgba(16, 185, 129, 0.12)' : 'green.0'}
            mb="xl"
            withBorder
            sx={{ borderColor: isDark ? 'rgba(16, 185, 129, 0.25)' : '#d3f9d8' }}
          >
            <Title order={4} color={isDark ? 'teal.3' : 'teal.9'} mb="md">
              {t('courses.whatYouWillLearn')}
            </Title>
            <Grid>
              {courseData.willLearn.map((item, idx) => (
                <Grid.Col key={idx} span={12} sm={6}>
                  <Group align="flex-start">
                    <ThemeIcon color="teal" size={24} radius="xl">
                      <IconCheck size={16} />
                    </ThemeIcon>
                    <Text size="sm" sx={{ flex: 1, color: isDark ? theme.colors.dark[0] : undefined }}>
                      {item}
                    </Text>
                  </Group>
                </Grid.Col>
              ))}
            </Grid>
          </Paper>
        )}

        {courseData.requirements?.length > 0 && (
          <Box mb="xl">
            <Title order={4} mb="xs" sx={{ color: isDark ? '#ffffff' : '#0f172a' }}>
              {t('courses.requirements')}
            </Title>
            <List
              spacing="xs"
              size="sm"
              icon={
                <ThemeIcon color="blue" size={20} radius="xl">
                  <IconCheck size={12} />
                </ThemeIcon>
              }
            >
              {courseData.requirements.map((item, idx) => (
                <List.Item key={idx} sx={{ color: isDark ? theme.colors.dark[1] : undefined }}>
                  {item}
                </List.Item>
              ))}
            </List>
          </Box>
        )}

        {sections.length > 0 && (
          <Box mt="xl">
            <CourseContent to="lessons/" sections={sections} />
          </Box>
        )}
      </Paper>

      <CourseChatDrawer
        opened={chatDrawerOpened}
        onClose={() => setChatDrawerOpened(false)}
        courseId={courseData._id || courseData.id}
        courseName={courseData.name}
      />
    </Box>
  )
}
