import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useGetElements } from '../crud'
import SemesterDetails from './SemesterDetails'
import { Center, Loader, Box, Paper, Grid, Title, Text, Button, useMantineTheme } from '@mantine/core'
import { IconArrowRight, IconArrowLeft } from '@tabler/icons-react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '../../components/common/index.js'

export default function Semester({ queryClient }) {
  const params = useParams()
  const semesterId = params.semesterId || params.id
  const navigate = useNavigate()
  const theme = useMantineTheme()
  const isDark = theme.colorScheme === 'dark'
  const { t, i18n } = useTranslation(['admin', 'common', 'nav'])
  const isRtl = i18n.dir() === 'rtl'

  const {
    data: semester = {},
    isFetching: isFetchingTeachers,
    isLoading: isLoadingTeachers,
  } = useQuery({
    ...useGetElements(['semesters', semesterId]),
    enabled: Boolean(semesterId),
  })

  const {
    data: courses = [],
    isFetching,
    isLoading,
  } = useQuery({
    ...useGetElements(['courses', 'semester-courses', semesterId]),
    enabled: Boolean(semesterId),
  })

  if (isFetchingTeachers || isFetching || isLoadingTeachers || isLoading) {
    return (
      <Center py="xl">
        <Loader size="lg" color="brand" />
      </Center>
    )
  }

  const semesterTitle = semester?.name || t('semesters.breadcrumb')

  return (
    <Box>
      <Helmet>
        <title>{`${t('platformTitle', { ns: 'nav', defaultValue: 'منصة جهبذ' })} | ${semesterTitle}`}</title>
      </Helmet>

      <PageHeader
        title={semesterTitle}
        description={t('semesters.subtitle')}
        breadcrumbs={[
          { title: t('actions.home', { ns: 'common' }), href: '/' },
          { title: t('semesters.breadcrumb'), href: '/semesters' },
          { title: semesterTitle },
        ]}
        action={
          <Button
            variant="default"
            leftIcon={isRtl ? <IconArrowRight size={16} /> : <IconArrowLeft size={16} />}
            onClick={() => navigate(-1)}
          >
            {t('actions.back', { ns: 'common' })}
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
                {`${semester.semester || ''} ${semester.level ? `• ${semester.level}` : ''}`}
              </Text>
            )}
            <Text size="md" color={isDark ? 'gray.3' : 'gray.7'} sx={{ lineHeight: 1.8 }}>
              {semester.describtion || semester.description || t('common:emptyDescription')}
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
