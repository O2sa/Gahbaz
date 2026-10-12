import React from 'react'
import {
  SimpleGrid,
  Card,
  Image,
  Text,
  Badge,
  Button,
  Group,
  Stack,
  Loader,
  Center,
} from '@mantine/core'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useGetElements } from '../crud.js'
import { PageHeader, EmptyState } from '../../components/common/index.js'
import { IconBook, IconArrowLeft } from '@tabler/icons-react'

export default function StudentCourses() {
  const {
    data: courses = [],
    isLoading,
  } = useQuery(useGetElements(['courses']))

  const courseList = Array.isArray(courses)
    ? courses
    : Array.isArray(courses?.data)
    ? courses.data
    : []

  if (isLoading) {
    return (
      <Center py="xl">
        <Loader size="lg" color="brand" />
      </Center>
    )
  }

  return (
    <>
      <PageHeader
        title="المقررات المسجلة"
        description="استعراض المقررات الدراسية والمحاضرات والمصادر التعليمية"
        breadcrumbs={[
          { title: 'الرئيسية', href: '/' },
          { title: 'مقرراتي الدراسية' },
        ]}
      />

      {courseList.length === 0 ? (
        <EmptyState
          title="لا توجد مقررات دراسية مسجلة"
          description="لم يتم تسجيلك في أي مقررات دراسية للفصل الحالي."
        />
      ) : (
        <SimpleGrid
          cols={3}
          spacing="lg"
          breakpoints={[
            { maxWidth: 'md', cols: 2, spacing: 'md' },
            { maxWidth: 'xs', cols: 1, spacing: 'sm' },
          ]}
        >
          {courseList.map((course, idx) => (
            <Card
              key={course._id || course.id || idx}
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
            >
              <Group position="apart" mb="xs">
                <Badge color="brand" variant="light">
                  {course.category || 'مقرر دراسي'}
                </Badge>
                <Badge
                  color={course.completed ? 'teal' : 'blue'}
                  variant="dot"
                >
                  {course.completed ? 'مكتمل' : 'مستمر'}
                </Badge>
              </Group>

              <Group spacing="xs" mb="sm">
                <IconBook size={20} color="#7c3aed" />
                <Text weight={600} size="md" lineClamp={1}>
                  {course.name}
                </Text>
              </Group>

              {course.teacher && (
                <Text size="xs" color="dimmed" mb="md">
                  الأستاذ: {typeof course.teacher === 'object' ? course.teacher.name : course.teacher}
                </Text>
              )}

              <Button
                component={Link}
                to={`/courses/${course._id || course.id}`}
                variant="light"
                color="brand"
                fullWidth
                mt="md"
                radius="md"
                rightIcon={<IconArrowLeft size={16} />}
              >
                الدخول للمقرر
              </Button>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </>
  )
}
