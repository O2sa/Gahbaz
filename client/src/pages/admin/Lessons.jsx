import React, { useState } from 'react'
import CourseContent from '../../components/CourseContent'
import { Link, Outlet, useLoaderData } from 'react-router-dom'
import { useGetElements } from '../crud'
import { useQuery } from '@tanstack/react-query'
import {
  Box,
  Button,
  Drawer,
  Grid,
  Group,
  Text,
  Loader,
  Center,
  ActionIcon,
  Paper,
  Title,
  Badge,
  useMantineTheme,
  rem,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Helmet } from 'react-helmet'
import {
  IconArrowRight,
  IconFolder,
  IconVideo,
  IconPlayerTrackNext,
  IconMenu2,
} from '@tabler/icons-react'

export const loader =
  (queryClient) =>
  async ({ params }) => {
    try {
      await queryClient.ensureQueryData(useGetElements([`courses`, params.courseId]))
      return params.courseId
    } catch (error) {
      console.error(error?.response?.data?.msg)
      return null
    }
  }

export default function Lessons() {
  const courseId = useLoaderData()
  const theme = useMantineTheme()
  const isDark = theme.colorScheme === 'dark'

  const {
    data: course = {},
    isLoading,
  } = useQuery({
    ...useGetElements(['courses', courseId]),
    enabled: Boolean(courseId),
  })

  const [nextLesson, setNextLesson] = useState(null)
  const [opened, { open, close }] = useDisclosure(false)

  if (isLoading) {
    return (
      <Center py={100}>
        <Loader size="lg" color="brand" />
      </Center>
    )
  }

  const courseData = course?.data || course
  const sections = courseData?.sections || []

  const getLessonsNum = sections.reduce(
    (acc, section) => acc + (section?.lessons?.length || 0),
    0,
  )

  const courseSyllbus = (
    <CourseContent close={close} setNextLesson={setNextLesson} to={''} sections={sections} />
  )

  return (
    <Box>
      <Helmet>
        <title>{`منصة جهبذ | ${courseData?.name || 'الدروس والمحتوى'}`}</title>
      </Helmet>

      {/* Top Header Card */}
      <Paper
        withBorder
        radius="lg"
        p="md"
        mb="lg"
        sx={{
          backgroundColor: isDark
            ? 'rgba(26, 27, 30, 0.85)'
            : 'rgba(255, 255, 255, 0.95)',
          borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2],
          boxShadow: isDark
            ? '0 4px 20px rgba(0, 0, 0, 0.25)'
            : '0 4px 20px rgba(30, 64, 175, 0.04)',
        }}
      >
        <Group position="apart" align="center">
          <Group spacing="md">
            <ActionIcon
              component={Link}
              to={`/courses/${courseId}`}
              size={42}
              radius="md"
              variant="light"
              color="brand"
              title="رجوع لتفاصيل المقرر"
            >
              <IconArrowRight size={20} />
            </ActionIcon>

            <Box>
              <Title
                order={3}
                sx={{
                  color: isDark ? '#ffffff' : '#0f172a',
                  fontWeight: 800,
                  lineHeight: 1.3,
                }}
              >
                {courseData?.name || 'فهرس الدروس والمحاضرات'}
              </Title>
              <Group spacing="xs" mt={4}>
                <Badge
                  color="blue"
                  variant="light"
                  size="sm"
                  leftSection={<IconFolder size={13} />}
                >
                  {`${sections.length} أقسام`}
                </Badge>
                <Badge
                  color="violet"
                  variant="light"
                  size="sm"
                  leftSection={<IconVideo size={13} />}
                >
                  {`${getLessonsNum} دروس`}
                </Badge>
              </Group>
            </Box>
          </Group>

          <Group spacing="xs">
            {/* Mobile syllabus drawer toggle */}
            <Box sx={{ display: 'block', [theme.fn.largerThan('lg')]: { display: 'none' } }}>
              <Button
                onClick={open}
                variant="light"
                color="brand"
                leftIcon={<IconMenu2 size={16} />}
              >
                فهرس المحتوى
              </Button>
            </Box>

            {nextLesson && (
              <Button
                component={Link}
                to={nextLesson}
                color="brand"
                leftIcon={<IconPlayerTrackNext size={16} />}
              >
                الدرس التالي
              </Button>
            )}
          </Group>
        </Group>
      </Paper>

      {/* Main Grid: Content (9) + Syllabus (3) */}
      <Grid gutter="lg">
        <Grid.Col span={12} lg={9}>
          <Paper
            p="xl"
            radius="lg"
            withBorder
            sx={{
              minHeight: '75vh',
              backgroundColor: isDark ? 'rgba(26, 27, 30, 0.75)' : '#ffffff',
              borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2],
              boxShadow: isDark
                ? '0 4px 20px rgba(0, 0, 0, 0.25)'
                : '0 2px 10px rgba(0, 0, 0, 0.03)',
            }}
          >
            {getLessonsNum > 0 ? (
              <Outlet context={sections} />
            ) : (
              <Center py={80}>
                <Text color="dimmed" size="md">
                  لا توجد دروس أو محاضرات مضافة لهذا المقرر بعد.
                </Text>
              </Center>
            )}
          </Paper>
        </Grid.Col>

        {/* Desktop Sidebar Syllabus */}
        <Grid.Col
          span={12}
          lg={3}
          sx={{ display: 'none', [theme.fn.largerThan('lg')]: { display: 'block' } }}
        >
          <Paper
            p="md"
            radius="lg"
            withBorder
            sx={{
              backgroundColor: isDark ? 'rgba(26, 27, 30, 0.85)' : '#ffffff',
              borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2],
              position: 'sticky',
              top: rem(20),
              maxHeight: 'calc(100vh - 120px)',
              overflowY: 'auto',
            }}
          >
            {sections.length > 0 && getLessonsNum > 0 ? (
              courseSyllbus
            ) : (
              <Text color="dimmed" size="sm" py="md">
                لا توجد أقسام دراسية متاحة
              </Text>
            )}
          </Paper>
        </Grid.Col>
      </Grid>

      {/* Mobile Drawer */}
      <Drawer
        position="right"
        opened={opened}
        onClose={close}
        title={
          <Text weight={700} sx={{ color: isDark ? '#ffffff' : '#0f172a' }}>
            فهرس الدروس والمحاضرات
          </Text>
        }
        padding="md"
        size="md"
        styles={{
          content: {
            backgroundColor: isDark ? '#1a1b1e' : '#ffffff',
          },
          header: {
            backgroundColor: isDark ? '#1a1b1e' : '#ffffff',
            borderBottom: `1px solid ${isDark ? theme.colors.dark[4] : theme.colors.gray[2]}`,
          },
        }}
      >
        <Box pt="md">{courseSyllbus}</Box>
      </Drawer>
    </Box>
  )
}
