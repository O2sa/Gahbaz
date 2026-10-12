import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useGetElements } from '../crud'
import SemesterDetails from './SemesterDetails'
import { Center, Loader, Box, Paper, Grid, Title, Text, Button, useMantineTheme } from '@mantine/core'
import { IconArrowRight } from '@tabler/icons-react'
import { Helmet } from 'react-helmet'
import { PageHeader } from '../../components/common/index.js'

export default function Semester({ queryClient }) {
  const { semesterId } = useParams()
  const navigate = useNavigate()
  const theme = useMantineTheme()
  const isDark = theme.colorScheme === 'dark'

  const {
    data: semester = {},
    isFetching: isFetchingTeachers,
    isLoading: isLoadingTeachers,
  } = useQuery(useGetElements(['semesters', semesterId]))

  const {
    data: courses = [],
    isFetching,
    isLoading,
  } = useQuery(useGetElements(['courses', 'semester-courses', semesterId]))

  if (isFetchingTeachers || isFetching || isLoadingTeachers || isLoading) {
    return (
      <Center py="xl">
        <Loader size="lg" color="brand" />
      </Center>
    )
  }

  const semesterTitle = semester?.name || 'تفاصيل الفصل الدراسي'

  return (
    <Box>
      <Helmet>
        <title>{`منصة جهبذ | ${semesterTitle}`}</title>
      </Helmet>

      <PageHeader
        title={semesterTitle}
        description="عرض تفاصيل الفصل الدراسي والمقررات الملحقة به"
        breadcrumbs={[
          { title: 'الرئيسية', href: '/' },
          { title: 'الفصول الدراسية', href: '/semesters' },
          { title: semesterTitle },
        ]}
        action={
          <Button variant="default" leftIcon={<IconArrowRight size={16} />} onClick={() => navigate(-1)}>
            رجوع
          </Button>
        }
      />

      <Grid gutter="xl">
        <Grid.Col xs={12} md={6}>
          <Paper
            withBorder
            radius="lg"
            p="xl"
            sx={{
              backgroundColor: isDark
                ? 'rgba(26, 27, 30, 0.75)'
                : 'rgba(255, 255, 255, 0.95)',
              borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2],
            }}
          >
            <Title order={3} mb="xs" sx={{ color: isDark ? '#ffffff' : '#0f172a', fontWeight: 800 }}>
              {semester.name}
            </Title>
            {(semester.semester || semester.level) && (
              <Text size="sm" color="dimmed" mb="md">
                {`${semester.semester || ''} ${semester.level ? `• المستوى ${semester.level}` : ''}`}
              </Text>
            )}
            <Text size="md" color={isDark ? 'gray.3' : 'gray.7'} sx={{ lineHeight: 1.8 }}>
              {semester.describtion || semester.description || 'لا يوجد وصف مضاف لهذا الفصل الدراسي.'}
            </Text>
          </Paper>
        </Grid.Col>

        <Grid.Col xs={12} md={6}>
          <SemesterDetails semester={semester} courses={courses} />
        </Grid.Col>
      </Grid>
    </Box>
  )
}
