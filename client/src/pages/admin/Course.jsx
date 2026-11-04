import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useGetElements } from '../crud'
import CourseInfo from './CourseInfo'
import { Center, Loader, Box } from '@mantine/core'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'

export default function Course() {
  const { t } = useTranslation(['admin', 'nav'])
  const params = useParams()
  const courseId = params.courseId || params.id
  const {
    data: course = {},
    isFetching,
    isLoading,
  } = useQuery({
    ...useGetElements(['courses', courseId]),
    enabled: Boolean(courseId),
  })

  if (isFetching) {
    return (
      <Center py="xl">
        <Loader size="lg" color="brand" />
      </Center>
    )
  }

  return (
    <Box>
      <Helmet>
        <title>{`${t('platformTitle', { ns: 'nav', defaultValue: 'منصة جهبذ' })} | ${course?.name || t('courses.breadcrumb', { defaultValue: 'المقرر الدراسي' })}`}</title>
      </Helmet>
      <CourseInfo course={course} />
    </Box>
  )
}
