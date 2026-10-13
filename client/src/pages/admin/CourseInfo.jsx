import React from 'react'
import {
  Avatar,
  Box,
  Button,
  Center,
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
import { IconCheck, IconPhoto, IconArrowRight, IconBook, IconEdit } from '@tabler/icons-react'
import CourseContent from '../../components/CourseContent'
import { PageHeader } from '../../components/common/index.js'

export default function CourseInfo({ course }) {
  const navigate = useNavigate()
  const theme = useMantineTheme()
  const isDark = theme.colorScheme === 'dark'

  const courseData = course?.data || course
  if (!courseData || Object.keys(courseData).length === 0) return null

  const teacherNames =
    courseData.teacher ??
    courseData.teachers
      ?.map((t) =>
        typeof t === 'object'
          ? `${t.firstName || ''} ${t.lastName || ''}`.trim() || t.name
          : t
      )
      .filter(Boolean)
      .join(' • ')

  const descriptionText = courseData.description || courseData.describtion

  return (
    <Box>
      <PageHeader
        title={courseData.name || 'تفاصيل المقرر'}
        description={courseData.subtitle || 'عرض توصيف المقرر، المخرجات التعليمية والمحتوى الدراسي'}
        breadcrumbs={[
          { title: 'الرئيسية', href: '/' },
          { title: 'المقررات الدراسية', href: '/courses' },
          { title: courseData.name || 'المقرر' },
        ]}
        action={
          <Group spacing="xs">
            <Button
              variant="default"
              leftIcon={<IconArrowRight size={16} />}
              onClick={() => navigate('/courses')}
            >
              رجوع إلى المقررات
            </Button>
            <Button
              component={Link}
              to={`/courses/${courseData._id || courseData.id}/edit`}
              leftIcon={<IconEdit size={16} />}
              color="brand"
            >
              تعديل المقرر
            </Button>
          </Group>
        }
      />

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
        <Group position="apart" align="flex-start" mb="md">
          <Box>
            <Title order={2} mb="xs" sx={{ color: isDark ? '#ffffff' : '#0f172a', fontWeight: 800 }}>
              {courseData.name}
            </Title>
            {courseData.subtitle && (
              <Text size="md" color="dimmed" mb="md">
                {courseData.subtitle}
              </Text>
            )}
          </Box>
          {courseData.category && (
            <Badge color="brand" variant="light" size="lg">
              {courseData.category}
            </Badge>
          )}
        </Group>

        <Group mb="lg" spacing="md">
          <Avatar.Group>
            {courseData.teachers?.map((val) => (
              <Avatar
                key={val._id || val.id || val}
                radius="xl"
                src={typeof val === 'object' ? val.avatar : undefined}
                color="brand"
              >
                {typeof val === 'object' ? (val.firstName?.charAt(0) || 'أ') : 'أ'}
              </Avatar>
            ))}
          </Avatar.Group>
          <Stack spacing={0}>
            <Text size="xs" color="dimmed">
              عضو هيئة التدريس:
            </Text>
            <Text weight={600} size="sm">
              {teacherNames || 'غير محدد'}
            </Text>
          </Stack>
        </Group>

        <Center my="lg">
          {courseData.cover ? (
            <Image
              src={courseData.cover}
              radius="md"
              alt={courseData.name}
              sx={{ maxHeight: 350, objectFit: 'cover' }}
            />
          ) : (
            <Paper p="xl" radius="md" bg={isDark ? 'dark.6' : 'gray.1'} sx={{ width: '100%', textAlign: 'center' }}>
              <IconPhoto size={48} color="gray" />
              <Text color="dimmed" mt="xs">
                لا توجد صورة غلاف
              </Text>
            </Paper>
          )}
        </Center>

        {descriptionText && (
          <Box mt="xl">
            <Title order={4} mb="xs" sx={{ color: isDark ? '#ffffff' : '#0f172a' }}>
              عن المقرر
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
            mt="xl"
            withBorder
            sx={{ borderColor: isDark ? 'rgba(16, 185, 129, 0.25)' : '#d3f9d8' }}
          >
            <Title order={4} color={isDark ? 'teal.3' : 'teal.9'} mb="md">
              ما الذي ستتعلمه في هذا المقرر؟
            </Title>
            <Grid>
              {courseData.willLearn.map((item, idx) => (
                <Grid.Col key={idx} span={12} sm={6}>
                  <Group align="flex-start">
                    <ThemeIcon color="teal" size={24} radius="xl">
                      <IconCheck size={16} />
                    </ThemeIcon>
                    <Text size="sm" sx={{ flex: 1 }}>
                      {item}
                    </Text>
                  </Group>
                </Grid.Col>
              ))}
            </Grid>
          </Paper>
        )}

        {courseData.requirements?.length > 0 && (
          <Box mt="xl">
            <Title order={4} mb="xs" sx={{ color: isDark ? '#ffffff' : '#0f172a' }}>
              متطلبات المقرر
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
                <List.Item key={idx}>{item}</List.Item>
              ))}
            </List>
          </Box>
        )}

        {courseData.sections?.length > 0 && (
          <Box mt="xl">
            <CourseContent to="lessons/" sections={courseData.sections} />
          </Box>
        )}
      </Paper>
    </Box>
  )
}
