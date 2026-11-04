import React from 'react'
import {
  Paper,
  Text,
  Title,
  Group,
  Stack,
  Table,
  Badge,
  Button,
  Divider,
  Loader,
  Center,
  Alert,
  SimpleGrid,
  Box,
} from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import {
  IconPrinter,
  IconCertificate,
  IconAlertCircle,
  IconSchool,
  IconAward,
  IconCheck,
  IconX,
} from '@tabler/icons-react'
import customFetch from '../../utils/customFetch'
import { PageHeader, EmptyState } from '../../components/common'

export default function Transcript() {
  const { t, i18n } = useTranslation('student')
  const isRtl = i18n.dir() === 'rtl'

  const {
    data: transcriptResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['transcripts', 'my-transcript'],
    queryFn: async () => {
      const res = await customFetch.get('/transcripts/my-transcript')
      return res.data?.data || res.data || {}
    },
  })

  if (isLoading) {
    return (
      <Center py="xl">
        <Loader size="lg" color="brand" />
      </Center>
    )
  }

  if (error) {
    return (
      <Alert
        icon={<IconAlertCircle size={16} />}
        title={t('transcript.alertTitle')}
        color="red"
        radius="md"
        my="xl"
      >
        {error.response?.data?.error?.message ||
          error.response?.data?.message ||
          t('transcript.errorDefault')}
      </Alert>
    )
  }

  const { student, summary, semesters = [] } = transcriptResponse || {}

  const handlePrint = () => {
    window.print()
  }

  const getStandingColor = (standing) => {
    if (!standing) return 'gray'
    const s = String(standing).toLowerCase()
    if (s.includes('امتياز') || s.includes('excellent')) return 'teal'
    if (s.includes('جيد جداً') || s.includes('very good')) return 'blue'
    if (s.includes('جيد') || s.includes('good')) return 'cyan'
    return 'red'
  }

  return (
    <>
      {/* Hide on print */}
      <Box className="no-print">
        <PageHeader
          title={t('transcript.title')}
          description={t('transcript.description')}
          breadcrumbs={[
            { title: t('transcript.breadcrumbsHome'), href: '/' },
            { title: t('transcript.breadcrumbsGrades'), href: '/grades' },
            { title: t('transcript.breadcrumbsTranscript') },
          ]}
          action={
            <Button
              onClick={handlePrint}
              variant="filled"
              color="brand"
              radius="md"
              leftIcon={<IconPrinter size={16} />}
            >
              {t('transcript.printBtn')}
            </Button>
          }
        />
      </Box>

      {/* Printable Transcript Document */}
      <Paper
        withBorder
        p="xl"
        radius="md"
        shadow="sm"
        className="printable-transcript"
        sx={(theme) => ({
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : '#fff',
          '@media print': {
            border: 'none',
            boxShadow: 'none',
            padding: '0 !important',
            backgroundColor: '#fff !important',
            color: '#000 !important',
          },
        })}
      >
        {/* Official Header */}
        <Group position="apart" align="flex-start" mb="lg">
          <Group spacing="md">
            <IconSchool size={40} color="#7c3aed" />
            <div>
              <Title order={2} weight={800}>
                {student?.university || t('transcript.defaultUniversity')}
              </Title>
              <Text size="sm" color="dimmed">
                {t('transcript.deanship')}
              </Text>
            </div>
          </Group>

          <Stack spacing={2} align="flex-end">
            <Badge size="lg" variant="outline" color="brand">
              {t('transcript.officialBadge')}
            </Badge>
            <Text size="xs" color="dimmed">
              {t('transcript.printDate', { date: new Date().toLocaleDateString(isRtl ? 'ar-EG' : 'en-US') })}
            </Text>
          </Stack>
        </Group>

        <Divider my="md" />

        {/* Student Information Grid */}
        <SimpleGrid
          cols={3}
          spacing="md"
          mb="lg"
          breakpoints={[
            { maxWidth: 'sm', cols: 1 },
          ]}
        >
          <Box>
            <Text size="xs" color="dimmed">
              {t('transcript.studentName')}
            </Text>
            <Text weight={700} size="sm">
              {student?.name || '---'}
            </Text>
          </Box>
          <Box>
            <Text size="xs" color="dimmed">
              {t('transcript.college')}
            </Text>
            <Text weight={600} size="sm">
              {student?.college || '---'}
            </Text>
          </Box>
          <Box>
            <Text size="xs" color="dimmed">
              {t('transcript.major')}
            </Text>
            <Text weight={600} size="sm">
              {student?.major || '---'}
            </Text>
          </Box>
          <Box>
            <Text size="xs" color="dimmed">
              {t('transcript.academicEmail')}
            </Text>
            <Text size="sm">{student?.email || '---'}</Text>
          </Box>
          <Box>
            <Text size="xs" color="dimmed">
              {t('transcript.degree')}
            </Text>
            <Text size="sm">{t('transcript.degreeValue')}</Text>
          </Box>
          <Box>
            <Text size="xs" color="dimmed">
              {t('transcript.academicStanding')}
            </Text>
            <Badge color={getStandingColor(summary?.academicStanding)} variant="light">
              {summary?.academicStanding || t('transcript.standings.good')}
            </Badge>
          </Box>
        </SimpleGrid>

        {/* Cumulative Summary Card */}
        <Paper
          withBorder
          p="md"
          radius="md"
          mb="xl"
          sx={(theme) => ({
            backgroundColor:
              theme.colorScheme === 'dark'
                ? theme.colors.dark[6]
                : theme.colors.gray[0],
          })}
        >
          <Group position="apart">
            <Group spacing="xl">
              <div>
                <Text size="xs" color="dimmed">
                  {t('transcript.totalAttemptedCredits')}
                </Text>
                <Text weight={700} size="lg">
                  {summary?.totalCreditsAttempted || 0}
                </Text>
              </div>
              <div>
                <Text size="xs" color="dimmed">
                  {t('transcript.totalEarnedCredits')}
                </Text>
                <Text weight={700} size="lg" color="teal">
                  {summary?.totalCreditsEarned || 0}
                </Text>
              </div>
              <div>
                <Text size="xs" color="dimmed">
                  {t('transcript.cumulativeGPA')}
                </Text>
                <Text weight={800} size="xl" color="brand">
                  {(summary?.cumulativeGPA ?? 0).toFixed(2)} / 4.00
                </Text>
              </div>
            </Group>

            <Group spacing="xs">
              <IconAward size={24} color="#7c3aed" />
              <div>
                <Text size="xs" color="dimmed">
                  {t('transcript.overallEvaluation')}
                </Text>
                <Text weight={700} size="md">
                  {summary?.academicStanding || '---'}
                </Text>
              </div>
            </Group>
          </Group>
        </Paper>

        {/* Semesters Records */}
        {semesters.length === 0 ? (
          <EmptyState
            title={t('transcript.emptyTitle')}
            description={t('transcript.emptyDesc')}
          />
        ) : (
          <Stack spacing="xl">
            {semesters.map((sem, sIdx) => (
              <Box key={sem.semesterId || sIdx}>
                <Group position="apart" mb="xs">
                  <Text weight={700} size="md">
                    {sem.name || t('grades.defaultSemester', { index: sIdx + 1 })}
                  </Text>
                  <Group spacing="md">
                    <Badge variant="dot" color="brand">
                      {t('transcript.semesterHours', {
                        attempted: sem.creditsAttempted || 0,
                        earned: sem.creditsEarned || 0,
                      })}
                    </Badge>
                    <Badge variant="filled" color="brand">
                      {t('transcript.semesterGPA', { gpa: (sem.semesterGPA ?? 0).toFixed(2) })}
                    </Badge>
                  </Group>
                </Group>

                <Table striped highlightOnHover withBorder withColumnBorders fontSize="xs">
                  <thead>
                    <tr>
                      <th style={{ width: '12%' }}>{t('transcript.table.courseCode')}</th>
                      <th style={{ width: '38%' }}>{t('transcript.table.courseName')}</th>
                      <th style={{ width: '10%' }}>{t('transcript.table.credits')}</th>
                      <th style={{ width: '10%' }}>{t('transcript.table.percentage')}</th>
                      <th style={{ width: '10%' }}>{t('transcript.table.grade')}</th>
                      <th style={{ width: '10%' }}>{t('transcript.table.gradePoints')}</th>
                      <th style={{ width: '10%' }}>{t('transcript.table.qualityPoints')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sem.courses?.map((course, cIdx) => (
                      <tr key={course.courseId || cIdx}>
                        <td style={{ fontWeight: 600 }}>{course.code || '---'}</td>
                        <td>{course.name}</td>
                        <td style={{ textAlign: 'center' }}>{course.creditHours}</td>
                        <td style={{ textAlign: 'center', fontWeight: 600 }}>
                          {course.numericGrade}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <Badge
                            color={course.passed ? 'teal' : 'red'}
                            size="sm"
                            variant="light"
                          >
                            {course.letterGrade}
                          </Badge>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          {(course.gradePoints ?? 0).toFixed(2)}
                        </td>
                        <td style={{ textAlign: 'center', fontWeight: 600 }}>
                          {(course.qualityPoints ?? 0).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Box>
            ))}
          </Stack>
        )}

        {/* Verification & Stamp Footer (Visible on Print) */}
        <Box
          mt={50}
          pt="xl"
          sx={{
            display: 'none',
            '@media print': { display: 'block' },
          }}
        >
          <Group position="apart" align="flex-end">
            <Stack spacing={4} align="center">
              <Text size="xs" weight={600}>
                {t('transcript.printFooter.registrar')}
              </Text>
              <Text size="xs" color="dimmed">
                ............................
              </Text>
            </Stack>

            <Stack spacing={4} align="center">
              <Text size="xs" weight={600}>
                {t('transcript.printFooter.seal')}
              </Text>
              <Box
                sx={{
                  width: 90,
                  height: 90,
                  border: '1px dashed #777',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text size="10px" color="dimmed">
                  {t('transcript.printFooter.sealText')}
                </Text>
              </Box>
            </Stack>

            <Stack spacing={4} align="center">
              <Text size="xs" weight={600}>
                {t('transcript.printFooter.dean')}
              </Text>
              <Text size="xs" color="dimmed">
                ............................
              </Text>
            </Stack>
          </Group>
        </Box>
      </Paper>
    </>
  )
}

