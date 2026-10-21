import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useGetElements } from '../crud'
import {
  Center,
  Loader,
  Stack,
  Title,
  Paper,
  Box,
  Text,
  Badge,
  Group,
  ThemeIcon,
  useMantineTheme,
  rem,
} from '@mantine/core'
import { IconBook2, IconVideo, IconFileText, IconInfoCircle } from '@tabler/icons-react'
import { Helmet } from 'react-helmet'

export default function CourseLesson() {
  const { sectionId, lessonId } = useParams()
  const theme = useMantineTheme()
  const isDark = theme.colorScheme === 'dark'

  const {
    data: lesson = {},
    isFetching,
    isLoading,
  } = useQuery({
    ...useGetElements(['sections', sectionId, 'lessons', lessonId]),
    enabled: Boolean(sectionId && lessonId),
  })

  if (isFetching || isLoading) {
    return (
      <Center py={80}>
        <Loader size="lg" color="brand" />
      </Center>
    )
  }

  const hasVideo = Boolean(lesson?.video?.url)
  const hasTopic = Boolean(lesson?.topic?.data)

  return (
    <Box py="sm">
      <Helmet>
        <title>{`منصة جهبذ | ${lesson?.name || 'الدرس'}`}</title>
      </Helmet>

      <Stack spacing="xl">
        {/* Lesson Title & Badges */}
        <Box>
          <Group position="apart" align="center" mb="xs">
            <Title
              order={2}
              sx={{
                color: isDark ? '#ffffff' : '#0f172a',
                fontWeight: 800,
                fontSize: rem(24),
              }}
            >
              {lesson?.name || 'عنوان الدرس'}
            </Title>
            <Group spacing="xs">
              {hasVideo && (
                <Badge
                  color="blue"
                  variant="light"
                  size="md"
                  leftSection={<IconVideo size={14} />}
                >
                  فيديو تعليمي
                </Badge>
              )}
              {hasTopic && (
                <Badge
                  color="teal"
                  variant="light"
                  size="md"
                  leftSection={<IconFileText size={14} />}
                >
                  {`${lesson?.topic?.readingTime || 2} دقائق قراءة`}
                </Badge>
              )}
            </Group>
          </Group>
        </Box>

        {/* Video Player Section */}
        {hasVideo && (
          <Paper
            p={6}
            radius="lg"
            withBorder
            sx={{
              backgroundColor: isDark ? 'rgba(0, 0, 0, 0.45)' : '#000000',
              borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[3],
              boxShadow: isDark
                ? '0 8px 30px rgba(0, 0, 0, 0.5)'
                : '0 8px 30px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
              maxWidth: 920,
              margin: '0 auto',
              width: '100%',
            }}
          >
            <video
              style={{
                width: '100%',
                maxHeight: '520px',
                borderRadius: rem(10),
                display: 'block',
                outline: 'none',
              }}
              src={lesson.video.url}
              controls
            />
          </Paper>
        )}

        {/* Text / Topic Content Section */}
        {hasTopic ? (
          <Paper
            p="xl"
            withBorder
            radius="lg"
            sx={{
              backgroundColor: isDark ? 'rgba(26, 27, 30, 0.85)' : '#ffffff',
              borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2],
              boxShadow: isDark
                ? '0 4px 20px rgba(0, 0, 0, 0.3)'
                : '0 2px 12px rgba(0, 0, 0, 0.04)',
              transition: 'background-color 200ms ease, border-color 200ms ease',
            }}
          >
            <Group spacing="xs" mb="lg">
              <ThemeIcon size="md" radius="md" color="brand" variant="light">
                <IconBook2 size={18} />
              </ThemeIcon>
              <Title
                order={4}
                sx={{
                  color: isDark ? '#ffffff' : '#0f172a',
                  fontWeight: 700,
                }}
              >
                المحتوى النصي والملاحظات
              </Title>
            </Group>

            <Box
              sx={{
                color: isDark ? theme.colors.dark[0] : theme.colors.gray[9],
                fontSize: rem(15),
                lineHeight: 1.85,
                '& p': {
                  color: isDark ? theme.colors.dark[1] : theme.colors.gray[8],
                  marginBottom: rem(14),
                },
                '& h1, & h2, & h3, & h4, & h5, & h6': {
                  color: isDark ? '#ffffff' : '#0f172a',
                  fontWeight: 700,
                  marginTop: rem(20),
                  marginBottom: rem(10),
                },
                '& ul, & ol': {
                  paddingRight: rem(20),
                  marginBottom: rem(14),
                  color: isDark ? theme.colors.dark[1] : theme.colors.gray[8],
                },
                '& li': {
                  marginBottom: rem(6),
                },
                '& a': {
                  color: isDark ? '#60a5fa' : theme.colors.brand[6],
                  textDecoration: 'underline',
                  fontWeight: 600,
                },
                '& blockquote': {
                  borderRight: `4px solid ${isDark ? theme.colors.brand[5] : theme.colors.brand[6]}`,
                  margin: `${rem(16)} 0`,
                  padding: `${rem(8)} ${rem(16)}`,
                  backgroundColor: isDark ? 'rgba(59, 130, 246, 0.08)' : 'rgba(30, 64, 175, 0.04)',
                  borderRadius: rem(6),
                  color: isDark ? theme.colors.dark[1] : theme.colors.gray[7],
                  fontStyle: 'italic',
                },
                '& code': {
                  backgroundColor: isDark ? theme.colors.dark[6] : theme.colors.gray[1],
                  color: isDark ? '#f472b6' : '#d63384',
                  padding: `${rem(2)} ${rem(6)}`,
                  borderRadius: rem(4),
                  fontSize: '0.9em',
                  fontFamily: 'monospace',
                },
                '& pre': {
                  backgroundColor: isDark ? theme.colors.dark[7] : theme.colors.gray[0],
                  border: `1px solid ${isDark ? theme.colors.dark[5] : theme.colors.gray[2]}`,
                  padding: rem(14),
                  borderRadius: rem(8),
                  overflowX: 'auto',
                  '& code': {
                    backgroundColor: 'transparent',
                    color: isDark ? '#e2e8f0' : '#1e293b',
                    padding: 0,
                  },
                },
                '& img': {
                  maxWidth: '100%',
                  borderRadius: rem(8),
                  margin: `${rem(12)} 0`,
                },
                '& table': {
                  width: '100%',
                  borderCollapse: 'collapse',
                  margin: `${rem(16)} 0`,
                  '& th, & td': {
                    border: `1px solid ${isDark ? theme.colors.dark[4] : theme.colors.gray[3]}`,
                    padding: rem(10),
                  },
                  '& th': {
                    backgroundColor: isDark ? theme.colors.dark[6] : theme.colors.gray[1],
                    color: isDark ? '#ffffff' : '#0f172a',
                  },
                },
              }}
              dangerouslySetInnerHTML={{ __html: lesson.topic.data }}
            />
          </Paper>
        ) : null}

        {/* Empty State when no content uploaded */}
        {!hasVideo && !hasTopic && (
          <Paper
            p="xl"
            radius="lg"
            withBorder
            sx={{
              textAlign: 'center',
              backgroundColor: isDark ? 'rgba(26, 27, 30, 0.65)' : theme.colors.gray[0],
              borderColor: isDark ? theme.colors.dark[5] : theme.colors.gray[2],
            }}
          >
            <ThemeIcon
              size={54}
              radius="xl"
              color="gray"
              variant="light"
              sx={{ margin: '0 auto', marginBottom: rem(12) }}
            >
              <IconInfoCircle size={30} />
            </ThemeIcon>
            <Title order={4} mb="xs" sx={{ color: isDark ? '#ffffff' : '#0f172a' }}>
              لا يوجد محتوى مضاف بعد
            </Title>
            <Text color="dimmed" size="sm">
              لم يتم رفع مقطع فيديو أو محتوى نصي لهذا الدرس حتى الآن.
            </Text>
          </Paper>
        )}
      </Stack>
    </Box>
  )
}
