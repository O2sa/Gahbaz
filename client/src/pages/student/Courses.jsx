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
import { useTranslation } from 'react-i18next'
import { useGetElements } from '../crud.js'
import { PageHeader, EmptyState } from '../../components/common/index.js'
import { IconBook, IconArrowLeft, IconArrowRight } from '@tabler/icons-react'

export default function StudentCourses() {
  const { t, i18n } = useTranslation('student')
  const isRtl = i18n.dir() === 'rtl'
  const ArrowIcon = isRtl ? IconArrowLeft : IconArrowRight

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
        title={t('courses.title')}
        description={t('courses.description')}
        breadcrumbs={[
          { title: t('courses.breadcrumbsHome'), href: '/' },
          { title: t('courses.breadcrumbsMyCourses') },
        ]}
        action={
          <Button
            component={Link}
            to="/enrollment"
            variant="filled"
            color="brand"
            radius="md"
          >
            {t('courses.registrationPortalBtn')}
          </Button>
        }
      />

      {courseList.length === 0 ? (
        <EmptyState
          title={t('courses.emptyTitle')}
          description={t('courses.emptyDesc')}
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
                  {course.category || t('courses.defaultCategory')}
                </Badge>
                <Badge
                  color={course.completed ? 'teal' : 'blue'}
                  variant="dot"
                >
                  {course.completed ? t('courses.statusCompleted') : t('courses.statusActive')}
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
                  {t('courses.instructorPrefix', {
                    name: typeof course.teacher === 'object' ? course.teacher.name : course.teacher,
                  })}
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
                rightIcon={<ArrowIcon size={16} />}
              >
                {t('courses.enterCourse')}
              </Button>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </>
  )
}

