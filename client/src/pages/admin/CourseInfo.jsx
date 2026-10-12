import React from 'react'
import {
  Avatar,
  Box,
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
} from '@mantine/core'
import { IconCheck, IconPhoto } from '@tabler/icons-react'
import CourseContent from '../../components/CourseContent'

export default function CourseInfo({ course }) {
  if (!course) return null

  const teacherNames =
    course.teacher ??
    course.teachers?.map((t) => `${t.firstName} ${t.lastName}`).join(' • ')

  return (
    <Box>
      <Paper p="xl" radius="md" withBorder mb="lg" bg="white">
        <Title order={2} mb="xs">
          {course.name}
        </Title>
        {course.subtitle && (
          <Text size="lg" color="dimmed" mb="md">
            {course.subtitle}
          </Text>
        )}

        <Group mb="lg">
          <Avatar.Group>
            {course.teachers?.map((val) => (
              <Avatar key={val._id} radius="xl" src={val.avatar} />
            ))}
          </Avatar.Group>
          <Stack spacing={0}>
            <Text size="xs" color="dimmed">
              المعلم:
            </Text>
            <Text weight={500}>{teacherNames || 'غير محدد'}</Text>
          </Stack>
        </Group>

        <Center my="lg">
          {course.cover ? (
            <Image
              src={course.cover}
              radius="md"
              alt={course.name}
              sx={{ maxHeight: 350, objectFit: 'cover' }}
            />
          ) : (
            <Paper p="xl" radius="md" bg="gray.1" sx={{ width: '100%', textAlign: 'center' }}>
              <IconPhoto size={48} color="gray" />
              <Text color="dimmed" mt="xs">
                لا توجد صورة غلاف
              </Text>
            </Paper>
          )}
        </Center>

        {course.describtion && (
          <Box mt="xl">
            <Title order={4} mb="xs">
              عن الدورة
            </Title>
            <Text sx={{ lineHeight: 1.8 }}>{course.describtion}</Text>
          </Box>
        )}

        {course.willLearn?.length > 0 && (
          <Paper p="lg" radius="md" bg="green.0" mt="xl" withBorder sx={{ borderColor: '#d3f9d8' }}>
            <Title order={4} color="teal.9" mb="md">
              ما الذي ستتعلمه في هذه الدورة؟
            </Title>
            <Grid>
              {course.willLearn.map((item, idx) => (
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

        {course.requirements?.length > 0 && (
          <Box mt="xl">
            <Title order={4} mb="xs">
              متطلبات الدورة
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
              {course.requirements.map((item, idx) => (
                <List.Item key={idx}>{item}</List.Item>
              ))}
            </List>
          </Box>
        )}

        {course.sections?.length > 0 && (
          <Box mt="xl">
            <CourseContent to="lessons/" sections={course.sections} />
          </Box>
        )}
      </Paper>
    </Box>
  )
}
