import React, { useMemo } from 'react'
import {
  Paper,
  Table,
  Group,
  Text,
  Badge,
  Button,
  Box,
  Center,
  Title,
  Divider,
  Loader,
  SimpleGrid,
  ThemeIcon,
  Stack,
  useMantineTheme,
} from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import {
  IconCertificate,
  IconBook,
  IconCheck,
  IconCalendar,
  IconReportAnalytics,
  IconArrowLeft,
  IconAlertCircle,
  IconSchool,
} from '@tabler/icons-react'
import customFetch from '../../utils/customFetch'
import { useDashboardContext } from '../../layouts/MainLayout.jsx'
import { PageHeader, EmptyState } from '../../components/common'
import { getLetterGrade } from '../admin/StudentGrades.jsx'

export default function StudentGrades() {
  const { user } = useDashboardContext()
  const theme = useMantineTheme()
  const isDark = theme.colorScheme === 'dark'

  const studentId = user?._id || user?.id

  // Fetch student grades across semesters
  const {
    data: rawData = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['grades', 'student', studentId],
    queryFn: async () => {
      const res = await customFetch.get(`/grades/student/${studentId}`)
      return res.data?.data || res.data || []
    },
    enabled: Boolean(studentId),
  })

  const semesterGrades = Array.isArray(rawData) ? rawData : []

  // Calculate cumulative stats
  const stats = useMemo(() => {
    let totalCourses = 0
    let passedCourses = 0
    let totalScoreSum = 0

    for (const sem of semesterGrades) {
      for (const g of sem.grades || []) {
        totalCourses++
        const score = Number(g.total || g.percent || 0)
        totalScoreSum += score
        if (score >= 60) passedCourses++
      }
    }

    const average = totalCourses > 0 ? Math.round((totalScoreSum / totalCourses) * 10) / 10 : 0

    return {
      totalSemesters: semesterGrades.length,
      totalCourses,
      passedCourses,
      average,
    }
  }, [semesterGrades])

  if (isLoading) {
    return (
      <Center py={80}>
        <Stack align="center" spacing="md">
          <Loader size="xl" color="brand" />
          <Text size="sm" color="dimmed">
            جاري تحميل كشف درجاتك الأكاديمية...
          </Text>
        </Stack>
      </Center>
    )
  }

  if (error) {
    return (
      <EmptyState
        title="تعذر تحميل كشف الدرجات"
        description="حدث خطأ أثناء جلب السجل الأكاديمي. يرجى المحاولة مرة أخرى."
      />
    )
  }

  return (
    <>
      <PageHeader
        title="كشف الدرجات الأكاديمية"
        description="استعراض درجات الفصول الدراسية وتقييمات المقررات والتقديرات الرسمية"
        breadcrumbs={[
          { title: 'الرئيسية', href: '/' },
          { title: 'كشف الدرجات' },
        ]}
        action={
          <Button
            component={Link}
            to="/transcript"
            variant="filled"
            color="brand"
            radius="md"
            leftIcon={<IconCertificate size={18} />}
          >
            السجل الأكاديمي والمعدل التراكمي
          </Button>
        }
      />

      {/* Cumulative Stats Cards */}
      <SimpleGrid
        cols={4}
        spacing="md"
        mb="xl"
        breakpoints={[
          { maxWidth: 'md', cols: 2 },
          { maxWidth: 'xs', cols: 1 },
        ]}
      >
        <Paper withBorder p="md" radius="lg" shadow="xs">
          <Group position="apart">
            <div>
              <Text size="xs" color="dimmed" weight={700}>
                الفصول المسجلة
              </Text>
              <Title order={2} mt={4}>
                {stats.totalSemesters}
              </Title>
            </div>
            <ThemeIcon size={46} radius="md" color="blue" variant="light">
              <IconCalendar size={24} />
            </ThemeIcon>
          </Group>
        </Paper>

        <Paper withBorder p="md" radius="lg" shadow="xs">
          <Group position="apart">
            <div>
              <Text size="xs" color="dimmed" weight={700}>
                إجمالي المقررات
              </Text>
              <Title order={2} mt={4}>
                {stats.totalCourses}
              </Title>
            </div>
            <ThemeIcon size={46} radius="md" color="violet" variant="light">
              <IconBook size={24} />
            </ThemeIcon>
          </Group>
        </Paper>

        <Paper withBorder p="md" radius="lg" shadow="xs">
          <Group position="apart">
            <div>
              <Text size="xs" color="dimmed" weight={700}>
                المقررات المجتازة بنجاح
              </Text>
              <Title order={2} mt={4} color="teal">
                {stats.passedCourses}
              </Title>
            </div>
            <ThemeIcon size={46} radius="md" color="teal" variant="light">
              <IconCheck size={24} />
            </ThemeIcon>
          </Group>
        </Paper>

        <Paper withBorder p="md" radius="lg" shadow="xs">
          <Group position="apart">
            <div>
              <Text size="xs" color="dimmed" weight={700}>
                المعدل المئوي العام
              </Text>
              <Title order={2} mt={4}>
                {stats.average}%
              </Title>
            </div>
            <ThemeIcon size={46} radius="md" color="brand" variant="light">
              <IconReportAnalytics size={24} />
            </ThemeIcon>
          </Group>
        </Paper>
      </SimpleGrid>

      {/* Semesters & Courses Breakdown */}
      {semesterGrades.length === 0 ? (
        <EmptyState
          title="لا توجد درجات مسجلة بعد"
          description="لم يتم رصد درجات أكاديمية لك في أي فصل دراسي حتى الآن."
        />
      ) : (
        <Stack spacing="xl">
          {semesterGrades.map((semGroup, idx) => {
            const semester = semGroup.semester || {}
            const gradesList = semGroup.grades || []

            let semCreditsSum = 0
            let semScoreSum = 0
            for (const g of gradesList) {
              semCreditsSum += Number(g.course?.creditHours || 3)
              semScoreSum += Number(g.total || 0)
            }
            const semAvg = gradesList.length > 0 ? (semScoreSum / gradesList.length).toFixed(1) : 0

            return (
              <Paper
                key={semester._id || idx}
                withBorder
                radius="lg"
                p="lg"
                sx={{
                  backgroundColor: isDark ? 'rgba(26, 27, 30, 0.85)' : '#ffffff',
                  borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2],
                  boxShadow: isDark
                    ? '0 4px 20px rgba(0, 0, 0, 0.25)'
                    : '0 4px 20px rgba(30, 64, 175, 0.04)',
                }}
              >
                <Group position="apart" mb="md" align="center">
                  <Group spacing="sm">
                    <ThemeIcon size={38} radius="md" color="brand" variant="light">
                      <IconSchool size={20} />
                    </ThemeIcon>
                    <div>
                      <Title order={3} sx={{ color: isDark ? '#ffffff' : '#0f172a' }}>
                        {semester.name || `الفصل الدراسي ${idx + 1}`}
                      </Title>
                      {semester.startDate && semester.endDate && (
                        <Text size="xs" color="dimmed">
                          {new Date(semester.startDate).toLocaleDateString('ar-SA')} -{' '}
                          {new Date(semester.endDate).toLocaleDateString('ar-SA')}
                        </Text>
                      )}
                    </div>
                  </Group>

                  <Group spacing="xs">
                    <Badge color="brand" variant="light" size="md">
                      {semCreditsSum} ساعات معتمدة
                    </Badge>
                    <Badge color="teal" variant="filled" size="md">
                      متوسط الفصل: {semAvg}%
                    </Badge>
                  </Group>
                </Group>

                <Divider my="sm" color={isDark ? 'dark.4' : 'gray.2'} />

                {gradesList.length === 0 ? (
                  <Text size="sm" color="dimmed" py="md">
                    لا توجد درجات مرصودة لمقررات هذا الفصل بعد.
                  </Text>
                ) : (
                  <Table verticalSpacing="sm" horizontalSpacing="md" highlightOnHover>
                    <thead>
                      <tr
                        style={{
                          backgroundColor: isDark ? theme.colors.dark[6] : theme.colors.gray[1],
                        }}
                      >
                        <th>المقرر الدراسي</th>
                        <th style={{ textAlign: 'center' }}>الساعات</th>
                        <th style={{ textAlign: 'center' }}>أعمال السنة</th>
                        <th style={{ textAlign: 'center' }}>الامتحان النصفي</th>
                        <th style={{ textAlign: 'center' }}>الامتحان النهائي</th>
                        <th style={{ textAlign: 'center' }}>المجموع</th>
                        <th style={{ textAlign: 'center' }}>التقدير</th>
                        <th style={{ textAlign: 'center' }}>الحالة</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gradesList.map((g) => {
                        const course = g.course || {}
                        const total = Number(g.total || 0)
                        const letter = getLetterGrade(total)

                        const coursework = g.grade?.['0']?.value ?? g.grade?.assignments?.value ?? '—'
                        const midterm = g.grade?.['1']?.value ?? g.grade?.midterm?.value ?? '—'
                        const finalExam = g.grade?.['2']?.value ?? g.grade?.final?.value ?? '—'

                        return (
                          <tr key={g._id}>
                            <td>
                              <Group spacing="xs">
                                <ThemeIcon size="sm" color="brand" variant="light" radius="xl">
                                  <IconBook size={14} />
                                </ThemeIcon>
                                <div>
                                  <Text weight={700} size="sm" sx={{ color: isDark ? '#ffffff' : '#0f172a' }}>
                                    {course.name || 'مقرر دراسي'}
                                  </Text>
                                  {course.code && (
                                    <Text size="xs" color="dimmed">
                                      {course.code}
                                    </Text>
                                  )}
                                </div>
                              </Group>
                            </td>

                            <td style={{ textAlign: 'center' }}>
                              <Badge size="sm" variant="outline" color="gray">
                                {course.creditHours || 3} س
                              </Badge>
                            </td>

                            <td style={{ textAlign: 'center' }}>
                              <Text size="sm" weight={500}>
                                {coursework}
                              </Text>
                            </td>

                            <td style={{ textAlign: 'center' }}>
                              <Text size="sm" weight={500}>
                                {midterm}
                              </Text>
                            </td>

                            <td style={{ textAlign: 'center' }}>
                              <Text size="sm" weight={500}>
                                {finalExam}
                              </Text>
                            </td>

                            <td style={{ textAlign: 'center' }}>
                              <Badge
                                size="md"
                                color={total >= 60 ? 'teal' : 'red'}
                                variant={total >= 60 ? 'light' : 'filled'}
                              >
                                {total} / 100
                              </Badge>
                            </td>

                            <td style={{ textAlign: 'center' }}>
                              <Badge size="md" color={letter.color} variant={letter.variant}>
                                {letter.grade} ({letter.label})
                              </Badge>
                            </td>

                            <td style={{ textAlign: 'center' }}>
                              <Badge
                                size="sm"
                                color={total >= 60 ? 'teal' : 'red'}
                                variant="outline"
                              >
                                {total >= 60 ? 'ناجح' : 'راسب'}
                              </Badge>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </Table>
                )}
              </Paper>
            )
          })}
        </Stack>
      )}
    </>
  )
}
