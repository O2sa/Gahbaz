import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useGetElements } from '../crud'
import CourseInfo from './CourseInfo'
import { Center, Loader, Box } from '@mantine/core'
import { Helmet } from 'react-helmet'

export default function Course() {
  const { courseId } = useParams()
  const {
    data: course = [],
    isFetching,
  } = useQuery(useGetElements(['courses', courseId]))

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
        <title>منصة جهبذ | المقرر الدراسي</title>
      </Helmet>
      <CourseInfo course={course} />
    </Box>
  )
}
