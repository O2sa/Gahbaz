import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useGetElements } from '../crud'
import { Center, Loader, Stack, Title, Paper, Box } from '@mantine/core'
import { Helmet } from 'react-helmet'

export default function CourseLesson() {
  const { sectionId, lessonId } = useParams()

  const {
    data: lesson = {},
    isFetching,
  } = useQuery(useGetElements(['sections', sectionId, 'lessons', lessonId]))

  if (isFetching) {
    return (
      <Center py="xl">
        <Loader size="lg" color="brand" />
      </Center>
    )
  }

  return (
    <Box py="md">
      <Helmet>
        <title>منصة جهبذ | {lesson?.name || 'الدرس'}</title>
      </Helmet>
      <Stack spacing="lg">
        {lesson?.video?.url && (
          <Box sx={{ maxWidth: 800, margin: '0 auto', width: '100%' }}>
            <video
              style={{ width: '100%', borderRadius: 8 }}
              src={lesson.video.url}
              controls
            />
          </Box>
        )}

        <Title order={2}>{lesson?.name || ''}</Title>

        {lesson?.topic?.data && (
          <Paper p="md" withBorder radius="md">
            <div dangerouslySetInnerHTML={{ __html: lesson.topic.data }} />
          </Paper>
        )}
      </Stack>
    </Box>
  )
}
